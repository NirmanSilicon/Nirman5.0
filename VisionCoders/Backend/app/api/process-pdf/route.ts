import { NextRequest, NextResponse } from 'next/server';
import { downloadPDF, updateFileMetadata, updateFileStatus } from '@/lib/services/fileService';
import { extractAndCleanPDF } from '@/lib/pdf/extract';
import { createChunks } from '@/lib/pdf/chunk';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';

// CORS preflight handler
export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    });
}

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const body = await req.json();
        const { fileId, filePath, botId } = body;

        logger.apiRequest('POST', '/api/process-pdf', { requestId, fileId, botId });

        if (!fileId || !filePath || !botId) {
            return NextResponse.json(
                errorResponse('Missing required parameters', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // Update status to processing
        await updateFileStatus(fileId, 'processing');

        // 1. Download PDF
        const buffer = await downloadPDF(filePath);

        // 2. Extract Text
        const extractionResult = await extractAndCleanPDF(buffer);

        // Update page count
        await updateFileMetadata(fileId, {
            page_count: extractionResult.pageCount,
        });

        // 3. Chunk Text
        const chunks = createChunks(
            extractionResult.text,
            fileId,
            botId
        );

        logger.info('PDF processed successfully', {
            fileId,
            pageCount: extractionResult.pageCount,
            chunkCount: chunks.length,
            requestId,
        });

        logger.performance('Process PDF API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                chunks,
                metadata: extractionResult.metadata,
                stats: {
                    pageCount: extractionResult.pageCount,
                    chunkCount: chunks.length,
                    processingTime: Date.now() - startTime,
                },
            }),
            { status: 200 }
        );
    } catch (error) {
        logger.error('Process PDF API failed', error as Error, { requestId });

        // Try to update status to failed if we have a fileId
        try {
            const body = await req.clone().json();
            if (body.fileId) {
                await updateFileStatus(
                    body.fileId,
                    'failed',
                    error instanceof Error ? error.message : 'Processing failed'
                );
            }
        } catch (e) {
            // Ignore error during error handling
        }

        return NextResponse.json(
            errorResponse(
                'Failed to process PDF',
                'PROCESSING_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
