import { NextRequest, NextResponse } from 'next/server';
import {
    detectCommand,
    saveChatMessage,
    getRecentContext,
} from '@/lib/services/chatService';
import { retrieveRelevantChunks } from '@/lib/rag/retrieve';
import { buildRAGPrompt, buildExplainPrompt } from '@/lib/rag/buildPrompt';
import { generateChatCompletion } from '@/lib/rag/llm';
import { errorResponse, successResponse } from '@/lib/utils/responseFormatter';
import { logger } from '@/lib/utils/logger';
import { CommandType } from '@/lib/utils/types';

export async function POST(req: NextRequest) {
    const startTime = Date.now();
    const requestId = crypto.randomUUID();

    try {
        console.log('=== CHAT API REQUEST START ===');
        const body = await req.json();
        console.log('Request body:', JSON.stringify(body, null, 2));

        const { message, botId, userId } = body;
        console.log('Parsed params:', { message, botId, userId });

        logger.apiRequest('POST', '/api/chat', { requestId, botId, userId });

        if (!message || !botId || !userId) {
            console.error('Missing params:', { message: !!message, botId: !!botId, userId: !!userId });
            return NextResponse.json(
                errorResponse('Missing required parameters', 'MISSING_PARAMS'),
                { status: 400 }
            );
        }

        // 1. Detect Command
        const { command, concept } = detectCommand(message);

        // 2. Save User Message
        await saveChatMessage({
            bot_id: botId,
            user_id: userId,
            role: 'user',
            message: message,
            command: command !== CommandType.NONE ? command : undefined,
        });

        let responseText = '';
        let usedChunks: any[] = [];

        // 3. Handle Command or Standard RAG
        if (command === CommandType.EXPLAIN && concept) {
            // --- EXPLAIN COMMAND ---
            logger.info('Processing EXPLAIN command', { concept, requestId });

            // Retrieve context specifically for the concept
            usedChunks = await retrieveRelevantChunks(concept, botId);

            // Build Explain Prompt
            const systemPrompt = buildExplainPrompt('You are a helpful AI tutor.', usedChunks, concept);

            // Generate Answer
            responseText = await generateChatCompletion([
                { role: 'user', parts: systemPrompt }
            ]);

        } else if (
            command === CommandType.SUMMARIZE ||
            command === CommandType.SHORT_NOTES ||
            command === CommandType.QUIZ
        ) {
            // --- PROCESS COMMANDS DIRECTLY ---
            logger.info(`Processing ${command} command`, { requestId });

            // Get ALL chunks for the bot (not just relevant ones)
            const { getEmbeddingsByBot } = await import('@/lib/rag/vectorStore');
            const allEmbeddings = await getEmbeddingsByBot(botId);

            // Check if there are any chunks
            if (!allEmbeddings || allEmbeddings.length === 0) {
                responseText = "I don't have any documents to process yet. Please upload a PDF first.";
                logger.warn('No chunks found for command', { command, botId });
            } else {
                // Convert embeddings to chunks format
                usedChunks = allEmbeddings.map(emb => ({
                    id: emb.id || '',
                    file_id: emb.document_id,
                    chunk_text: emb.content,
                    chunk_index: emb.chunk_index,
                    similarity: 1.0,
                }));

                logger.info(`Retrieved ${usedChunks.length} chunks for ${command}`, { requestId });

                // Get unique file IDs to check PDF count
                const uniqueFileIds = [...new Set(usedChunks.map(chunk => chunk.file_id))];
                const pdfCount = uniqueFileIds.length;

                logger.info(`Processing ${pdfCount} PDF(s) for ${command}`, { requestId });

                // For single-PDF commands, check if there's more than one PDF
                if (pdfCount > 1 && (command === CommandType.SUMMARIZE || command === CommandType.SHORT_NOTES)) {
                    responseText = `I found ${pdfCount} PDFs in this bot. Which PDF would you like me to ${command === CommandType.SUMMARIZE ? 'summarize' : 'create notes for'}? Please specify the PDF name or upload date.`;
                    logger.info('Multiple PDFs found, asking user to specify', { pdfCount, command });
                } else {
                    // Build appropriate prompt based on command
                    if (command === CommandType.SUMMARIZE) {
                        const { SUMMARIZE_PROMPT } = await import('@/lib/prompts/summarize');
                        const { buildSummarizePrompt } = await import('@/lib/rag/buildPrompt');
                        const systemPrompt = buildSummarizePrompt(SUMMARIZE_PROMPT, usedChunks);

                        logger.debug('Sending summarize prompt to LLM', { promptLength: systemPrompt.length });
                        responseText = await generateChatCompletion([
                            { role: 'user', parts: systemPrompt }
                        ]);
                    } else if (command === CommandType.SHORT_NOTES) {
                        const { NOTES_PROMPT } = await import('@/lib/prompts/notes');
                        const { buildShortNotesPrompt } = await import('@/lib/rag/buildPrompt');
                        const systemPrompt = buildShortNotesPrompt(NOTES_PROMPT, usedChunks);

                        logger.debug('Sending notes prompt to LLM', { promptLength: systemPrompt.length });
                        responseText = await generateChatCompletion([
                            { role: 'user', parts: systemPrompt }
                        ]);
                    } else if (command === CommandType.QUIZ) {
                        const { QUIZ_PROMPT } = await import('@/lib/prompts/quiz');
                        const { buildQuizPrompt } = await import('@/lib/rag/buildPrompt');
                        const systemPrompt = buildQuizPrompt(QUIZ_PROMPT, usedChunks);

                        logger.debug('Sending quiz prompt to LLM', { promptLength: systemPrompt.length });
                        responseText = await generateChatCompletion([
                            { role: 'user', parts: systemPrompt }
                        ]);
                    }
                }
            }

        } else {
            // --- STANDARD RAG ---
            logger.info('Processing Standard RAG', { requestId });

            // Retrieve Context
            usedChunks = await retrieveRelevantChunks(message, botId);

            // Get Chat History for Context
            const history = await getRecentContext(botId, 5); // Last 5 messages

            // Format history for prompt (optional, or use in LLM chat history)
            // For RAG, we usually put the context in the system prompt of the *current* turn

            const systemPrompt = buildRAGPrompt('You are a helpful AI assistant.', usedChunks, message);

            // We combine the RAG system prompt with the chat history
            // Note: buildRAGPrompt already includes the user query and context.
            // We might want to pass history to generateChatCompletion if we want multi-turn context.
            // For simplicity and strict grounding, we'll treat each RAG query as standalone + history.

            // Construct messages for Gemini
            const messages: Array<{ role: 'user' | 'model'; parts: string }> = [];

            // Add history (excluding the current new message which is handled in systemPrompt)
            // We need to be careful not to duplicate.
            // Let's just use the system prompt as the single user message for strict RAG 
            // to ensure the model follows the "Answer ONLY using context" rule strictly.
            // Adding chat history *can* sometimes dilute the strict context rule if not careful.
            // Given the "Strict Grounding" requirement, we will prioritize the constructed RAG prompt.

            messages.push({ role: 'user', parts: systemPrompt });

            responseText = await generateChatCompletion(messages);
        }

        // 4. Save Assistant Response
        await saveChatMessage({
            bot_id: botId,
            user_id: userId,
            role: 'assistant',
            message: responseText,
        });

        logger.info('Chat response generated', {
            botId,
            responseLength: responseText.length,
            requestId,
        });

        logger.performance('Chat API', Date.now() - startTime);

        return NextResponse.json(
            successResponse({
                message: responseText,
                sources: usedChunks.map(c => ({
                    fileId: c.file_id,
                    pageNumber: c.metadata?.pageNumber || c.metadata?.page_number
                })),
            }),
            { status: 200 }
        );

    } catch (error) {
        console.error('=== CHAT API ERROR ===');
        console.error('Error type:', error?.constructor?.name);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        console.error('Full error object:', error);

        logger.error('Chat API failed', error as Error, { requestId });
        return NextResponse.json(
            errorResponse(
                'Failed to process chat message',
                'CHAT_ERROR',
                error instanceof Error ? error.message : undefined
            ),
            { status: 500 }
        );
    }
}
