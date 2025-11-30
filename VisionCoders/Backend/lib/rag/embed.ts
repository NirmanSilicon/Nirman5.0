/**
 * Embedding generation using OpenRouter API
 * Creates vector embeddings for text chunks
 */

import { openrouterClient } from './openrouter';
import { logger } from '../utils/logger';

// Configuration
const BATCH_SIZE = 100; // Process embeddings in batches
const RETRY_ATTEMPTS = 3;
const RETRY_DELAY = 1000; // 1 second

/**
 * Generate embedding for a single text
 * @param text - Text to embed
 * @returns Embedding vector (1536 dimensions for text-embedding-3-small)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const startTime = Date.now();

    try {
        logger.debug('Generating embedding', {
            textLength: text.length,
        });

        const embedding = await openrouterClient.generateEmbedding(text);

        const duration = Date.now() - startTime;
        logger.performance('Embedding generation', duration);

        return embedding;
    } catch (error) {
        logger.error('Failed to generate embedding', error as Error, {
            textLength: text.length,
        });

        throw new Error(
            `Embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Generate embeddings for multiple texts with retry logic
 * @param texts - Array of texts to embed
 * @param retryAttempt - Current retry attempt
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(
    texts: string[],
    retryAttempt: number = 0
): Promise<number[][]> {
    const startTime = Date.now();

    try {
        logger.info('Generating embeddings', {
            count: texts.length,
        });

        // Process in batches to avoid rate limits
        const embeddings: number[][] = [];

        for (let i = 0; i < texts.length; i += BATCH_SIZE) {
            const batch = texts.slice(i, i + BATCH_SIZE);

            logger.debug(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}`, {
                batchSize: batch.length,
                progress: `${i + batch.length}/${texts.length}`,
            });

            // Generate embeddings for batch
            const batchEmbeddings = await Promise.all(
                batch.map((text) => generateEmbedding(text))
            );

            embeddings.push(...batchEmbeddings);

            // Small delay between batches to avoid rate limiting
            if (i + BATCH_SIZE < texts.length) {
                await sleep(100);
            }
        }

        const duration = Date.now() - startTime;
        logger.info('Embeddings generated successfully', {
            count: embeddings.length,
            duration: `${duration}ms`,
            avgPerEmbedding: `${(duration / embeddings.length).toFixed(2)}ms`,
        });

        return embeddings;
    } catch (error) {
        logger.error('Batch embedding generation failed', error as Error, {
            textCount: texts.length,
            retryAttempt,
        });

        // Retry logic
        if (retryAttempt < RETRY_ATTEMPTS) {
            const delay = RETRY_DELAY * Math.pow(2, retryAttempt); // Exponential backoff
            logger.warn(`Retrying in ${delay}ms...`, {
                attempt: retryAttempt + 1,
                maxAttempts: RETRY_ATTEMPTS,
            });

            await sleep(delay);
            return generateEmbeddings(texts, retryAttempt + 1);
        }

        throw new Error(
            `Failed to generate embeddings after ${RETRY_ATTEMPTS} attempts`
        );
    }
}

/**
 * Generate embedding for a query (same as generateEmbedding but with different logging)
 * @param query - Query text
 * @returns Embedding vector
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
    logger.debug('Generating query embedding', {
        queryLength: query.length,
    });

    return generateEmbedding(query);
}

/**
 * Batch generate embeddings with metadata
 * Returns embeddings with their corresponding text for easier mapping
 */
export async function generateEmbeddingsWithMetadata(
    texts: string[]
): Promise<Array<{ text: string; embedding: number[] }>> {
    const embeddings = await generateEmbeddings(texts);

    return texts.map((text, index) => ({
        text,
        embedding: embeddings[index],
    }));
}

/**
 * Calculate cosine similarity between two embeddings
 * @param embedding1 - First embedding vector
 * @param embedding2 - Second embedding vector
 * @returns Similarity score (0-1, higher is more similar)
 */
export function cosineSimilarity(
    embedding1: number[],
    embedding2: number[]
): number {
    if (embedding1.length !== embedding2.length) {
        throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += embedding1[i] * embedding1[i];
        norm2 += embedding2[i] * embedding2[i];
    }

    const magnitude = Math.sqrt(norm1) * Math.sqrt(norm2);

    if (magnitude === 0) {
        return 0;
    }

    return dotProduct / magnitude;
}

/**
 * Get embedding dimension
 * @returns Embedding dimension (1536 for text-embedding-3-small)
 */
export function getEmbeddingDimension(): number {
    // text-embedding-3-small produces 1536-dimensional embeddings
    return 1536;
}

/**
 * Validate embedding vector
 */
export function isValidEmbedding(embedding: number[]): boolean {
    if (!Array.isArray(embedding)) {
        return false;
    }

    if (embedding.length !== getEmbeddingDimension()) {
        return false;
    }

    // Check if all values are numbers
    return embedding.every((val) => typeof val === 'number' && !isNaN(val));
}

/**
 * Sleep utility for delays
 */
function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Normalize embedding vector (convert to unit vector)
 * Useful for certain distance metrics
 */
export function normalizeEmbedding(embedding: number[]): number[] {
    const magnitude = Math.sqrt(
        embedding.reduce((sum, val) => sum + val * val, 0)
    );

    if (magnitude === 0) {
        return embedding;
    }

    return embedding.map((val) => val / magnitude);
}
