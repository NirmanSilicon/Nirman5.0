import { NextRequest, NextResponse } from 'next/server';
import { uploadPDF } from '@/lib/services/fileService';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';

// Configure body parser for file uploads
export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const botId = formData.get('botId') as string;

        logger.apiRequest('POST', '/api/upload', {
            requestId,
            botId,
            fileName: file?.name,
            fileSize: file?.size,
        });

        // Validate input
        if (!botId) {
            return NextResponse.json(
                errorResponse('Bot ID is required', 'MISSING_BOT_ID'),
                { status: 400 }
            );
        }

        if (!file) {
            return NextResponse.json(
                errorResponse('File is required', 'MISSING_FILE'),
                { status: 400 }
            );
        }

        // Convert File to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload file
        const uploadedFile = await uploadPDF(buffer, file.name, botId);

        logger.info('File uploaded via API', {
            fileId: uploadedFile.id,
            requestId,
        });
        logger.performance('Upload API', Date.now() - startTime);

        return NextResponse.json(successResponse(uploadedFile), { status: 201 });
    } catch (error) {
        logger.error('Upload API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to upload file',
                'INTERNAL_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
