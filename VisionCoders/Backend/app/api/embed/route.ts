import { NextRequest, NextResponse } from 'next/server';
import { generateEmbeddings } from '@/lib/rag/embed';
import { insertEmbeddings } from '@/lib/rag/vectorStore';
import { updateFileStatus } from '@/lib/services/fileService';
import { Chunk } from '@/lib/utils/types';
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
        const { chunks, fileId, botId } = body as {
            chunks: Chunk[];
            fileId: string;
            botId: string;
        };

        logger.apiRequest('POST', '/api/embed', {
            requestId,
            fileId,
            chunkCount: chunks?.length,
        });

        if (!chunks || chunks.length === 0 || !fileId || !botId) {
            return NextResponse.json(
                errorResponse('Missing required parameters', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // 1. Generate Embeddings
        const texts = chunks.map((c) => c.chunk_text);
        const embeddings = await generateEmbeddings(texts);

        // 2. Prepare Embeddings for Insertion
        const embeddingsToInsert = chunks.map((chunk, index) => ({
            bot_id: botId,
            file_id: fileId,
            chunk_text: chunk.chunk_text,
            chunk_index: chunk.chunk_index,
            embedding: embeddings[index],
            metadata: chunk.metadata,
        }));

        // 3. Insert into Vector Store
        const insertedCount = await insertEmbeddings(embeddingsToInsert);

        // 4. Update File Status to Completed
        await updateFileStatus(fileId, 'completed');

        logger.info('Embeddings generated and stored', {
            fileId,
            count: insertedCount,
            requestId,
        });

        logger.performance('Embed API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                insertedCount,
                processingTime: Date.now() - startTime,
            }),
            { status: 200 }
        );
    } catch (error) {
        logger.error('Embed API failed', error as Error, { requestId });

        // Try to update status to failed
        try {
            const body = await req.clone().json();
            if (body.fileId) {
                await updateFileStatus(
                    body.fileId,
                    'failed',
                    error instanceof Error ? error.message : 'Embedding generation failed'
                );
            }
        } catch (e) {
            // Ignore error
        }

        return NextResponse.json(
            errorResponse(
                'Failed to generate embeddings',
                'EMBEDDING_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
