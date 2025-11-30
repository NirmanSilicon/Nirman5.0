/**
 * Text chunking utilities for RAG pipeline
 * Splits text into token-limited blocks with overlap for better context
 */

import { Chunk } from '../utils/types';
import { logger } from '../utils/logger';

// Configuration
const DEFAULT_CHUNK_SIZE = parseInt(process.env.CHUNK_SIZE || '500', 10);
const DEFAULT_CHUNK_OVERLAP = parseInt(process.env.CHUNK_OVERLAP || '50', 10);

/**
 * Estimate token count (rough approximation: 1 token ≈ 4 characters)
 * For more accurate counting, consider using tiktoken library
 */
export function estimateTokenCount(text: string): number {
    // Average: 1 token ≈ 4 characters (for English text)
    return Math.ceil(text.length / 4);
}

/**
 * Split text into sentences
 * Uses basic sentence boundary detection
 */
export function splitIntoSentences(text: string): string[] {
    // Split on sentence boundaries while preserving the delimiter
    const sentences = text
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.trim().length > 0);

    return sentences;
}

/**
 * Split text into paragraphs
 */
export function splitIntoParagraphs(text: string): string[] {
    return text
        .split(/\n\n+/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);
}

/**
 * Chunk text with token limit and overlap
 * @param text - Text to chunk
 * @param chunkSize - Maximum tokens per chunk
 * @param chunkOverlap - Number of tokens to overlap between chunks
 * @returns Array of text chunks
 */
export function chunkText(
    text: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    chunkOverlap: number = DEFAULT_CHUNK_OVERLAP
): string[] {
    const startTime = Date.now();

    // Split into sentences for better chunk boundaries
    const sentences = splitIntoSentences(text);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokenCount = 0;

    for (const sentence of sentences) {
        const sentenceTokens = estimateTokenCount(sentence);

        // If adding this sentence exceeds chunk size, save current chunk
        if (
            currentTokenCount + sentenceTokens > chunkSize &&
            currentChunk.length > 0
        ) {
            chunks.push(currentChunk.join(' '));

            // Create overlap by keeping last few sentences
            const overlapSentences: string[] = [];
            let overlapTokens = 0;

            // Add sentences from the end until we reach overlap size
            for (let i = currentChunk.length - 1; i >= 0; i--) {
                const tokens = estimateTokenCount(currentChunk[i]);
                if (overlapTokens + tokens <= chunkOverlap) {
                    overlapSentences.unshift(currentChunk[i]);
                    overlapTokens += tokens;
                } else {
                    break;
                }
            }

            currentChunk = overlapSentences;
            currentTokenCount = overlapTokens;
        }

        // Add sentence to current chunk
        currentChunk.push(sentence);
        currentTokenCount += sentenceTokens;
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join(' '));
    }

    const duration = Date.now() - startTime;
    logger.debug('Text chunking completed', {
        originalLength: text.length,
        chunkCount: chunks.length,
        chunkSize,
        chunkOverlap,
        duration: `${duration}ms`,
    });

    return chunks;
}

/**
 * Create chunk objects with metadata
 * @param text - Text to chunk
 * @param fileId - File ID
 * @param botId - Bot ID
 * @param chunkSize - Maximum tokens per chunk
 * @param chunkOverlap - Number of tokens to overlap
 * @returns Array of Chunk objects
 */
export function createChunks(
    text: string,
    fileId: string,
    botId: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    chunkOverlap: number = DEFAULT_CHUNK_OVERLAP
): Chunk[] {
    const textChunks = chunkText(text, chunkSize, chunkOverlap);

    return textChunks.map((chunkText, index) => ({
        file_id: fileId,
        bot_id: botId,
        chunk_text: chunkText,
        chunk_index: index,
        token_count: estimateTokenCount(chunkText),
        metadata: {
            overlap_with_previous: index > 0,
            overlap_with_next: index < textChunks.length - 1,
        },
    }));
}

/**
 * Chunk text by paragraphs (alternative strategy)
 * Useful for documents with clear paragraph structure
 */
export function chunkByParagraphs(
    text: string,
    maxTokensPerChunk: number = DEFAULT_CHUNK_SIZE
): string[] {
    const paragraphs = splitIntoParagraphs(text);
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentTokenCount = 0;

    for (const paragraph of paragraphs) {
        const paragraphTokens = estimateTokenCount(paragraph);

        // If paragraph alone exceeds max tokens, split it further
        if (paragraphTokens > maxTokensPerChunk) {
            // Save current chunk if not empty
            if (currentChunk.length > 0) {
                chunks.push(currentChunk.join('\n\n'));
                currentChunk = [];
                currentTokenCount = 0;
            }

            // Split large paragraph into sentences
            const sentenceChunks = chunkText(paragraph, maxTokensPerChunk, 0);
            chunks.push(...sentenceChunks);
            continue;
        }

        // If adding this paragraph exceeds limit, save current chunk
        if (
            currentTokenCount + paragraphTokens > maxTokensPerChunk &&
            currentChunk.length > 0
        ) {
            chunks.push(currentChunk.join('\n\n'));
            currentChunk = [paragraph];
            currentTokenCount = paragraphTokens;
        } else {
            currentChunk.push(paragraph);
            currentTokenCount += paragraphTokens;
        }
    }

    // Add remaining chunk
    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n\n'));
    }

    return chunks;
}

/**
 * Smart chunking that tries to preserve document structure
 * Uses paragraphs when possible, falls back to sentences
 */
export function smartChunk(
    text: string,
    chunkSize: number = DEFAULT_CHUNK_SIZE,
    chunkOverlap: number = DEFAULT_CHUNK_OVERLAP
): string[] {
    // Try paragraph-based chunking first
    const paragraphs = splitIntoParagraphs(text);

    // If we have clear paragraph structure, use it
    if (paragraphs.length > 1) {
        logger.debug('Using paragraph-based chunking', {
            paragraphCount: paragraphs.length,
        });
        return chunkByParagraphs(text, chunkSize);
    }

    // Otherwise, use sentence-based chunking
    logger.debug('Using sentence-based chunking');
    return chunkText(text, chunkSize, chunkOverlap);
}

/**
 * Get chunk statistics
 */
export function getChunkStats(chunks: string[]): {
    totalChunks: number;
    avgTokensPerChunk: number;
    minTokens: number;
    maxTokens: number;
    totalTokens: number;
} {
    const tokenCounts = chunks.map(estimateTokenCount);

    return {
        totalChunks: chunks.length,
        avgTokensPerChunk:
            tokenCounts.reduce((a, b) => a + b, 0) / chunks.length || 0,
        minTokens: Math.min(...tokenCounts),
        maxTokens: Math.max(...tokenCounts),
        totalTokens: tokenCounts.reduce((a, b) => a + b, 0),
    };
}

/**
 * Validate chunk configuration
 */
export function validateChunkConfig(
    chunkSize: number,
    chunkOverlap: number
): { valid: boolean; error?: string } {
    if (chunkSize <= 0) {
        return { valid: false, error: 'Chunk size must be positive' };
    }

    if (chunkOverlap < 0) {
        return { valid: false, error: 'Chunk overlap cannot be negative' };
    }

    if (chunkOverlap >= chunkSize) {
        return {
            valid: false,
            error: 'Chunk overlap must be less than chunk size',
        };
    }

    return { valid: true };
}
