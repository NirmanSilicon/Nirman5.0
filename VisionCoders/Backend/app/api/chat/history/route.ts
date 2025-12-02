import { NextRequest, NextResponse } from 'next/server';
import { getChatHistory } from '@/lib/services/chatService';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';

export async function GET(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const { searchParams } = new URL(req.url);
        const botId = searchParams.get('botId');

        logger.apiRequest('GET', '/api/chat/history', { requestId, botId });

        if (!botId) {
            return NextResponse.json(
                errorResponse('Missing botId parameter', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // Get chat history
        const history = await getChatHistory(botId);

        logger.performance('Chat History API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                history: history.map(msg => ({
                    id: msg.id,
                    role: msg.role,
                    content: msg.message,
                    timestamp: new Date(msg.created_at || Date.now()).getTime(),
                    command: msg.command
                }))
            }),
            { status: 200 }
        );

    } catch (error) {
        logger.error('Chat History API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to fetch chat history',
                'HISTORY_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
