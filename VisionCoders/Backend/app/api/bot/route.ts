import { NextRequest, NextResponse } from 'next/server';
import { createBot, validateBotName } from '@/lib/services/botService';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const body = await req.json();
        const { name, description, userId } = body;

        logger.apiRequest('POST', '/api/bot', { requestId, userId, name });

        // Validate input
        if (!userId) {
            return NextResponse.json(
                errorResponse('User ID is required', 'MISSING_USER_ID'),
                { status: 400 }
            );
        }

        const validation = validateBotName(name);
        if (!validation.valid) {
            console.error('Bot name validation failed:', validation.error);
            return NextResponse.json(
                errorResponse(validation.error || 'Invalid bot name', 'INVALID_NAME'),
                { status: 400 }
            );
        }

        // Create bot
        const bot = await createBot({
            name,
            description,
            userId,
        });

        logger.info('Bot created via API', { botId: bot.id, requestId });
        logger.performance('Create Bot API', Date.now() - startTime);

        return NextResponse.json(successResponse(bot), { status: 201 });
    } catch (error) {
        logger.error('Create Bot API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to create bot',
                'INTERNAL_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
