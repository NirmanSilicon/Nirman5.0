/**
 * LLM completion wrapper for OpenRouter API
 * Handles text generation with various models
 */

import { openrouterClient } from './openrouter';
import { logger } from '../utils/logger';

// Configuration
const TEMPERATURE = 0.7;
const MAX_OUTPUT_TOKENS = 2000;

/**
 * Generation configuration
 */
interface GenerationConfig {
    temperature?: number;
    maxOutputTokens?: number;
}

/**
 * Generate text completion using OpenRouter
 * @param prompt - Input prompt
 * @param config - Generation configuration
 * @returns Generated text
 */
export async function generateCompletion(
    prompt: string,
    config?: GenerationConfig
): Promise<string> {
    const startTime = Date.now();

    try {
        logger.debug('Generating completion', {
            promptLength: prompt.length,
        });

        const response = await openrouterClient.generateCompletion(
            [{ role: 'user', content: prompt }],
            {
                temperature: config?.temperature ?? TEMPERATURE,
                max_tokens: config?.maxOutputTokens ?? MAX_OUTPUT_TOKENS,
            }
        );

        const duration = Date.now() - startTime;
        logger.info('Completion generated successfully', {
            duration: `${duration}ms`,
            outputLength: response.length,
        });

        logger.performance('LLM completion', duration);

        return response;
    } catch (error) {
        logger.error('LLM completion failed', error as Error, {
            promptLength: prompt.length,
        });

        throw new Error(
            `Failed to generate completion: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Generate completion with retry logic
 * @param prompt - Input prompt
 * @param config - Generation configuration
 * @param maxRetries - Maximum number of retries
 * @returns Generated text
 */
export async function generateCompletionWithRetry(
    prompt: string,
    config?: GenerationConfig,
    maxRetries: number = 3
): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await generateCompletion(prompt, config);
        } catch (error) {
            lastError = error as Error;
            logger.warn(`Completion attempt ${attempt + 1} failed`, {
                attempt: attempt + 1,
                maxRetries,
                error: lastError.message,
            });

            if (attempt < maxRetries - 1) {
                const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                logger.debug(`Retrying in ${delay}ms...`);
                await sleep(delay);
            }
        }
    }

    throw new Error(
        `Failed to generate completion after ${maxRetries} attempts: ${lastError?.message}`
    );
}

/**
 * Generate chat completion (maintains conversation history)
 * @param messages - Array of message objects
 * @param config - Generation configuration
 * @returns Generated response
 */
export async function generateChatCompletion(
    messages: Array<{ role: 'user' | 'model'; parts: string }>,
    config?: GenerationConfig
): Promise<string> {
    const startTime = Date.now();

    try {
        logger.debug('Generating chat completion', {
            messageCount: messages.length,
        });

        // Convert Gemini format to OpenRouter format
        const openrouterMessages = messages.map(msg => ({
            role: msg.role === 'model' ? 'assistant' as const : 'user' as const,
            content: msg.parts
        }));

        const response = await openrouterClient.generateCompletion(
            openrouterMessages,
            {
                temperature: config?.temperature ?? TEMPERATURE,
                max_tokens: config?.maxOutputTokens ?? MAX_OUTPUT_TOKENS,
            }
        );

        const duration = Date.now() - startTime;
        logger.info('Chat completion generated', {
            duration: `${duration}ms`,
            outputLength: response.length,
        });

        logger.performance('Chat completion', duration);

        return response;
    } catch (error) {
        logger.error('Chat completion failed', error as Error, {
            messageCount: messages.length,
        });

        throw new Error(
            `Chat completion failed: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Count tokens in text (rough estimate)
 * @param text - Text to count tokens for
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters
    return Math.ceil(text.length / 4);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
