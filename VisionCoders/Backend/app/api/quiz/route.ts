import { NextRequest, NextResponse } from 'next/server';
import { getEmbeddingsByBot } from '@/lib/rag/vectorStore';
import { buildQuizPrompt } from '@/lib/rag/buildPrompt';
import { generateCompletion } from '@/lib/rag/llm';
import { saveChatMessage } from '@/lib/services/chatService';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';
import { CommandType, RetrievedChunk } from '@/lib/utils/types';

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        const body = await req.json();
        const { botId, userId, questionCount = 10 } = body;

        logger.apiRequest('POST', '/api/quiz', { requestId, botId, userId, questionCount });

        if (!botId || !userId) {
            return NextResponse.json(
                errorResponse('Missing required parameters', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // 1. Retrieve ALL content for the bot
        const embeddings = await getEmbeddingsByBot(botId);

        if (!embeddings || embeddings.length === 0) {
            return NextResponse.json(
                errorResponse('No content found to generate quiz', 'NO_CONTENT'),
                { status: 404 }
            );
        }

        // Map to RetrievedChunk format
        const allChunks: RetrievedChunk[] = embeddings.map(e => ({
            chunk_text: e.chunk_text,
            chunk_index: e.chunk_index || 0,
            similarity_score: 1,
            file_id: e.file_id,
            metadata: e.metadata,
        }));

        logger.debug('Retrieved context for quiz', {
            chunkCount: allChunks.length
        });

        // 2. Build Quiz Prompt
        const prompt = buildQuizPrompt('You are a helpful AI assistant.', allChunks, questionCount);

        // 3. Generate Quiz
        const quiz = await generateCompletion(prompt);

        // 4. Save to Chat History
        await saveChatMessage({
            bot_id: botId,
            user_id: userId,
            role: 'assistant',
            message: quiz,
            command: CommandType.QUIZ
        });

        logger.info('Quiz generated successfully', {
            botId,
            quizLength: quiz.length,
            requestId
        });

        logger.performance('Quiz API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                quiz,
                stats: {
                    processedChunks: allChunks.length,
                    processingTime: Date.now() - startTime
                }
            }),
            { status: 200 }
        );

    } catch (error) {
        logger.error('Quiz API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to generate quiz',
                'QUIZ_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
