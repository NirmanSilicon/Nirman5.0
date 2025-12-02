import { NextRequest, NextResponse } from 'next/server';
import { getEmbeddingsByBot } from '@/lib/rag/vectorStore';
import { buildSummarizePrompt } from '@/lib/rag/buildPrompt';
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
        const { botId, userId } = body;

        logger.apiRequest('POST', '/api/summarize', { requestId, botId, userId });

        if (!botId || !userId) {
            return NextResponse.json(
                errorResponse('Missing required parameters', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // 1. Retrieve ALL content for the bot
        // For summarization, we ideally want the full context.
        // Gemini 1.5 Pro's large context window makes this possible for most use cases.
        const embeddings = await getEmbeddingsByBot(botId);

        if (!embeddings || embeddings.length === 0) {
            return NextResponse.json(
                errorResponse('No content found to summarize', 'NO_CONTENT'),
                { status: 404 }
            );
        }

        // Map to RetrievedChunk format
        const allChunks: RetrievedChunk[] = embeddings.map(e => ({
            chunk_text: e.chunk_text,
            chunk_index: e.chunk_index || 0,
            similarity_score: 1, // Irrelevant for full context
            file_id: e.file_id,
            metadata: e.metadata,
        }));

        logger.debug('Retrieved context for summarization', {
            chunkCount: allChunks.length
        });

        // 2. Build Summarize Prompt
        const prompt = buildSummarizePrompt('You are a helpful AI assistant.', allChunks);

        // 3. Generate Summary
        const summary = await generateCompletion(prompt);

        // 4. Save to Chat History
        await saveChatMessage({
            bot_id: botId,
            user_id: userId,
            role: 'assistant',
            message: summary,
            command: CommandType.SUMMARIZE
        });

        logger.info('Summary generated successfully', {
            botId,
            summaryLength: summary.length,
            requestId
        });

        logger.performance('Summarize API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                summary,
                stats: {
                    processedChunks: allChunks.length,
                    processingTime: Date.now() - startTime
                }
            }),
            { status: 200 }
        );

    } catch (error) {
        logger.error('Summarize API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to generate summary',
                'SUMMARIZE_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
