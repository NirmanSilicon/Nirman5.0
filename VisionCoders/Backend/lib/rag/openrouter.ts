/**
 * OpenRouter API Client
 * Handles chat completions and embeddings via OpenRouter
 */

import { logger } from '../utils/logger';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
    reasoning_details?: any;
}

interface OpenRouterCompletionOptions {
    temperature?: number;
    max_tokens?: number;
    reasoning?: { enabled: boolean };
}

interface OpenRouterEmbeddingResponse {
    data: Array<{
        embedding: number[];
        index: number;
    }>;
}

export class OpenRouterClient {
    private apiKey: string;
    private chatModel: string;
    private embeddingModel: string;

    constructor() {
        this.apiKey = process.env.OPENROUTER_API_KEY || '';
        this.chatModel = process.env.OPENROUTER_CHAT_MODEL || 'openai/gpt-4o-mini';
        this.embeddingModel = process.env.OPENROUTER_EMBEDDING_MODEL || 'openai/text-embedding-3-small';

        if (!this.apiKey) {
            throw new Error('OPENROUTER_API_KEY is not configured in environment variables');
        }

        logger.info('OpenRouter client initialized', {
            chatModel: this.chatModel,
            embeddingModel: this.embeddingModel
        });
    }

    /**
     * Generate chat completion
     * @param messages - Array of chat messages
     * @param options - Optional parameters (temperature, max_tokens, reasoning)
     * @returns Generated text response
     */
    async generateCompletion(
        messages: OpenRouterMessage[],
        options?: OpenRouterCompletionOptions
    ): Promise<string> {
        const startTime = Date.now();

        try {
            logger.debug('Calling OpenRouter chat completion', {
                model: this.chatModel,
                messageCount: messages.length,
                options
            });

            const response = await fetch(`${OPENROUTER_API_URL}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
                    'X-Title': 'PDF-GPT'
                },
                body: JSON.stringify({
                    model: this.chatModel,
                    messages: messages,
                    temperature: options?.temperature ?? 0.7,
                    max_tokens: options?.max_tokens ?? 2000,
                    ...(options?.reasoning && { reasoning: options.reasoning })
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error('OpenRouter API error', new Error(errorText), {
                    status: response.status,
                    statusText: response.statusText
                });
                throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            const content = result.choices[0].message.content;

            const duration = Date.now() - startTime;
            logger.info('OpenRouter chat completion generated', {
                model: this.chatModel,
                responseLength: content.length,
                duration: `${duration}ms`
            });

            logger.performance('OpenRouter Chat Completion', duration);

            return content;

        } catch (error) {
            logger.error('OpenRouter chat completion failed', error as Error, {
                model: this.chatModel
            });
            throw error;
        }
    }

    /**
     * Generate embedding for a single text
     * @param text - Text to embed
     * @returns Embedding vector (1536 dimensions for text-embedding-3-small)
     */
    async generateEmbedding(text: string): Promise<number[]> {
        const startTime = Date.now();

        try {
            logger.debug('Generating embedding via OpenRouter', {
                model: this.embeddingModel,
                textLength: text.length
            });

            const response = await fetch(`${OPENROUTER_API_URL}/embeddings`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: this.embeddingModel,
                    input: text
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                logger.error('OpenRouter embedding error', new Error(errorText), {
                    status: response.status
                });
                throw new Error(`OpenRouter embedding error: ${response.status} - ${errorText}`);
            }

            const result: OpenRouterEmbeddingResponse = await response.json();
            const embedding = result.data[0].embedding;

            const duration = Date.now() - startTime;
            logger.debug('Embedding generated', {
                dimensions: embedding.length,
                duration: `${duration}ms`
            });

            return embedding;

        } catch (error) {
            logger.error('OpenRouter embedding generation failed', error as Error, {
                textLength: text.length,
                model: this.embeddingModel
            });
            throw error;
        }
    }

    /**
     * Generate embeddings for multiple texts (batch processing)
     * @param texts - Array of texts to embed
     * @returns Array of embedding vectors
     */
    async generateEmbeddings(texts: string[]): Promise<number[][]> {
        const startTime = Date.now();

        try {
            logger.info('Generating batch embeddings', {
                count: texts.length,
                model: this.embeddingModel
            });

            // Process in parallel for better performance
            const embeddings = await Promise.all(
                texts.map(text => this.generateEmbedding(text))
            );

            const duration = Date.now() - startTime;
            logger.info('Batch embeddings generated', {
                count: embeddings.length,
                duration: `${duration}ms`,
                avgPerEmbedding: `${(duration / embeddings.length).toFixed(2)}ms`
            });

            logger.performance('OpenRouter Batch Embeddings', duration);

            return embeddings;

        } catch (error) {
            logger.error('Batch embedding generation failed', error as Error, {
                textCount: texts.length
            });
            throw error;
        }
    }
}

// Export singleton instance
export const openrouterClient = new OpenRouterClient();
