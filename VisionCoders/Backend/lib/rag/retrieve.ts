/**
 * Retrieval module for RAG pipeline
 * Handles semantic search and context retrieval
 */

import { generateQueryEmbedding } from './embed';
import { searchSimilarEmbeddings } from './vectorStore';
import { RetrievedChunk } from '../utils/types';
import { logger } from '../utils/logger';

// Configuration
const DEFAULT_TOP_K = parseInt(process.env.TOP_K_RESULTS || '5', 10);
const DEFAULT_SIMILARITY_THRESHOLD = parseFloat(
    process.env.SIMILARITY_THRESHOLD || '0.7'
);

/**
 * Retrieve relevant chunks for a query using semantic search
 * @param query - User query
 * @param botId - Bot ID to search within
 * @param topK - Number of chunks to retrieve
 * @param similarityThreshold - Minimum similarity score
 * @returns Array of retrieved chunks with similarity scores
 */
export async function retrieveRelevantChunks(
    query: string,
    botId: string,
    topK: number = DEFAULT_TOP_K,
    similarityThreshold: number = DEFAULT_SIMILARITY_THRESHOLD
): Promise<RetrievedChunk[]> {
    const startTime = Date.now();

    try {
        logger.info('Retrieving relevant chunks', {
            query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
            botId,
            topK,
            similarityThreshold,
        });

        // Step 1: Generate query embedding
        const queryEmbedding = await generateQueryEmbedding(query);

        // Step 2: Search for similar embeddings
        const results = await searchSimilarEmbeddings(
            queryEmbedding,
            botId,
            topK,
            similarityThreshold
        );

        // Step 3: Transform results to RetrievedChunk format
        const chunks: RetrievedChunk[] = results.map((result) => ({
            chunk_text: result.chunk_text,
            chunk_index: result.chunk_index,
            similarity_score: result.similarity,
            file_id: result.file_id,
            metadata: result.metadata,
        }));

        const duration = Date.now() - startTime;
        logger.info('Chunks retrieved successfully', {
            count: chunks.length,
            duration: `${duration}ms`,
            avgSimilarity:
                chunks.length > 0
                    ? (
                        chunks.reduce((sum, c) => sum + c.similarity_score, 0) /
                        chunks.length
                    ).toFixed(3)
                    : 'N/A',
        });

        return chunks;
    } catch (error) {
        logger.error('Chunk retrieval failed', error as Error, {
            query: query.substring(0, 50),
            botId,
        });

        throw new Error(
            `Failed to retrieve chunks: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Retrieve chunks with re-ranking
 * First retrieves more chunks than needed, then re-ranks and returns top-k
 * @param query - User query
 * @param botId - Bot ID
 * @param topK - Final number of chunks to return
 * @param similarityThreshold - Minimum similarity score
 * @returns Top-k re-ranked chunks
 */
export async function retrieveAndRerank(
    query: string,
    botId: string,
    topK: number = DEFAULT_TOP_K,
    similarityThreshold: number = DEFAULT_SIMILARITY_THRESHOLD
): Promise<RetrievedChunk[]> {
    // Retrieve more chunks for re-ranking
    const retrievalCount = Math.min(topK * 2, 20);

    const chunks = await retrieveRelevantChunks(
        query,
        botId,
        retrievalCount,
        similarityThreshold
    );

    // Simple re-ranking: prioritize chunks with higher similarity
    // In production, you might use a more sophisticated re-ranking model
    const reranked = chunks
        .sort((a, b) => b.similarity_score - a.similarity_score)
        .slice(0, topK);

    logger.debug('Chunks re-ranked', {
        original: chunks.length,
        final: reranked.length,
    });

    return reranked;
}

/**
 * Retrieve chunks with diversity
 * Ensures retrieved chunks are diverse and not too similar to each other
 * @param query - User query
 * @param botId - Bot ID
 * @param topK - Number of chunks to return
 * @param similarityThreshold - Minimum similarity score
 * @param diversityThreshold - Minimum difference between chunks (0-1)
 * @returns Diverse set of chunks
 */
export async function retrieveWithDiversity(
    query: string,
    botId: string,
    topK: number = DEFAULT_TOP_K,
    similarityThreshold: number = DEFAULT_SIMILARITY_THRESHOLD,
    diversityThreshold: number = 0.1
): Promise<RetrievedChunk[]> {
    // Retrieve more chunks than needed
    const chunks = await retrieveRelevantChunks(
        query,
        botId,
        topK * 3,
        similarityThreshold
    );

    if (chunks.length === 0) {
        return [];
    }

    // Select diverse chunks
    const selected: RetrievedChunk[] = [chunks[0]]; // Always include top result

    for (const chunk of chunks.slice(1)) {
        if (selected.length >= topK) {
            break;
        }

        // Check if chunk is sufficiently different from already selected chunks
        const isDiverse = selected.every((selectedChunk) => {
            const scoreDiff = Math.abs(
                chunk.similarity_score - selectedChunk.similarity_score
            );
            return scoreDiff >= diversityThreshold;
        });

        if (isDiverse) {
            selected.push(chunk);
        }
    }

    logger.debug('Diverse chunks selected', {
        total: chunks.length,
        selected: selected.length,
        diversityThreshold,
    });

    return selected;
}

/**
 * Check if sufficient context is available for a query
 * @param query - User query
 * @param botId - Bot ID
 * @param minChunks - Minimum number of chunks required
 * @param similarityThreshold - Minimum similarity score
 * @returns True if sufficient context is available
 */
export async function hasSufficientContext(
    query: string,
    botId: string,
    minChunks: number = 1,
    similarityThreshold: number = DEFAULT_SIMILARITY_THRESHOLD
): Promise<boolean> {
    try {
        const chunks = await retrieveRelevantChunks(
            query,
            botId,
            minChunks,
            similarityThreshold
        );

        return chunks.length >= minChunks;
    } catch (error) {
        logger.error('Context check failed', error as Error);
        return false;
    }
}

/**
 * Get context statistics for a query
 * @param query - User query
 * @param botId - Bot ID
 * @returns Statistics about available context
 */
export async function getContextStats(
    query: string,
    botId: string
): Promise<{
    totalChunks: number;
    avgSimilarity: number;
    maxSimilarity: number;
    minSimilarity: number;
}> {
    const chunks = await retrieveRelevantChunks(query, botId, 10, 0);

    if (chunks.length === 0) {
        return {
            totalChunks: 0,
            avgSimilarity: 0,
            maxSimilarity: 0,
            minSimilarity: 0,
        };
    }

    const similarities = chunks.map((c) => c.similarity_score);

    return {
        totalChunks: chunks.length,
        avgSimilarity:
            similarities.reduce((sum, s) => sum + s, 0) / similarities.length,
        maxSimilarity: Math.max(...similarities),
        minSimilarity: Math.min(...similarities),
    };
}

/**
 * Format retrieved chunks for display
 * @param chunks - Retrieved chunks
 * @returns Formatted string
 */
export function formatRetrievedChunks(chunks: RetrievedChunk[]): string {
    if (chunks.length === 0) {
        return 'No relevant context found.';
    }

    return chunks
        .map(
            (chunk, index) =>
                `[${index + 1}] (Similarity: ${chunk.similarity_score.toFixed(3)})\n${chunk.chunk_text
                }`
        )
        .join('\n\n---\n\n');
}

/**
 * Combine retrieved chunks into a single context string
 * @param chunks - Retrieved chunks
 * @param maxLength - Maximum total length (in characters)
 * @returns Combined context string
 */
export function combineChunks(
    chunks: RetrievedChunk[],
    maxLength?: number
): string {
    let combined = chunks.map((c) => c.chunk_text).join('\n\n');

    if (maxLength && combined.length > maxLength) {
        logger.warn('Context exceeds max length, truncating', {
            original: combined.length,
            max: maxLength,
        });

        combined = combined.substring(0, maxLength) + '...';
    }

    return combined;
}
