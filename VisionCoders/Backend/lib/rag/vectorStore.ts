/**
 * Supabase vector store operations
 * Handles embedding storage and semantic search
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Embedding, VectorSearchResult } from '../utils/types';
import { logger } from '../utils/logger';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

/**
 * Get or create Supabase client
 */
function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
        logger.info('Supabase client initialized');
    }

    return supabase;
}

/**
 * Insert a single embedding into the database
 * @param embedding - Embedding object to insert
 * @returns Inserted embedding with ID
 */
export async function insertEmbedding(
    embedding: Embedding
): Promise<Embedding> {
    const client = getSupabaseClient();

    try {
        logger.dbQuery('INSERT', 'embeddings', {
            botId: embedding.bot_id,
            fileId: embedding.file_id,
            chunkIndex: embedding.chunk_index,
        });

        const { data, error } = await client
            .from('document_chunks')
            .insert({
                chatbot_id: embedding.bot_id,
                document_id: embedding.file_id,
                content: embedding.chunk_text,
                chunk_index: embedding.chunk_index,
                embedding: embedding.embedding,
                metadata: embedding.metadata || {},
            })
            .select()
            .single();

        if (error) {
            logger.error('Failed to insert embedding', new Error(error.message), {
                code: error.code,
                details: error.details,
            });
            throw error;
        }

        logger.debug('Embedding inserted successfully', { id: data.id });
        return data as Embedding;
    } catch (error) {
        logger.error('Insert embedding failed', error as Error);
        throw new Error(
            `Failed to insert embedding: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Insert multiple embeddings in batch
 * @param embeddings - Array of embeddings to insert
 * @returns Number of inserted embeddings
 */
export async function insertEmbeddings(
    embeddings: Embedding[]
): Promise<number> {
    const client = getSupabaseClient();
    const startTime = Date.now();

    try {
        logger.info('Inserting embeddings batch', {
            count: embeddings.length,
        });

        // Prepare data for insertion
        const data = embeddings.map((emb) => ({
            chatbot_id: emb.bot_id,
            document_id: emb.file_id,
            content: emb.chunk_text,
            chunk_index: emb.chunk_index,
            embedding: emb.embedding,
            metadata: emb.metadata || {},
        }));

        const { error } = await client.from('document_chunks').insert(data);

        if (error) {
            logger.error('Batch insert failed', new Error(error.message), {
                code: error.code,
                count: embeddings.length,
            });
            throw error;
        }

        const duration = Date.now() - startTime;
        logger.info('Embeddings inserted successfully', {
            count: embeddings.length,
            duration: `${duration}ms`,
        });

        return embeddings.length;
    } catch (error) {
        logger.error('Batch insert embeddings failed', error as Error);
        throw new Error(
            `Failed to insert embeddings: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Search for similar embeddings using vector similarity
 * @param queryEmbedding - Query embedding vector
 * @param botId - Bot ID to filter results
 * @param topK - Number of results to return
 * @param similarityThreshold - Minimum similarity score (0-1)
 * @returns Array of similar chunks with similarity scores
 */
export async function searchSimilarEmbeddings(
    queryEmbedding: number[],
    botId: string,
    topK: number = 5,
    similarityThreshold: number = 0.7
): Promise<VectorSearchResult[]> {
    const client = getSupabaseClient();
    const startTime = Date.now();

    try {
        logger.dbQuery('VECTOR_SEARCH', 'embeddings', {
            botId,
            topK,
            similarityThreshold,
        });

        // Use Supabase's vector similarity search
        // This uses the pgvector extension's cosine similarity operator (<=>)
        const { data, error } = await client.rpc('match_embeddings', {
            query_embedding: queryEmbedding,
            match_bot_id: botId,
            match_threshold: similarityThreshold,
            match_count: topK,
        });

        if (error) {
            logger.error('Vector search failed', new Error(error.message), {
                code: error.code,
            });
            throw error;
        }

        const duration = Date.now() - startTime;
        logger.info('Vector search completed', {
            resultsFound: data?.length || 0,
            duration: `${duration}ms`,
        });

        return (data || []) as VectorSearchResult[];
    } catch (error) {
        logger.error('Search similar embeddings failed', error as Error);
        throw new Error(
            `Vector search failed: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Get all embeddings for a bot
 * @param botId - Bot ID
 * @returns Array of embeddings
 */
export async function getEmbeddingsByBot(botId: string): Promise<Embedding[]> {
    const client = getSupabaseClient();

    try {
        logger.dbQuery('SELECT', 'embeddings', { botId });

        const { data, error } = await client
            .from('document_chunks')
            .select('*')
            .eq('chatbot_id', botId)
            .order('chunk_index', { ascending: true });

        if (error) {
            throw error;
        }

        logger.debug('Retrieved embeddings', {
            botId,
            count: data?.length || 0,
        });

        return (data || []) as Embedding[];
    } catch (error) {
        logger.error('Get embeddings by bot failed', error as Error, { botId });
        throw new Error(
            `Failed to get embeddings: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Get all embeddings for a file
 * @param fileId - File ID
 * @returns Array of embeddings
 */
export async function getEmbeddingsByFile(
    fileId: string
): Promise<Embedding[]> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('document_chunks')
            .select('*')
            .eq('file_id', fileId)
            .order('chunk_index', { ascending: true });

        if (error) {
            throw error;
        }

        return (data || []) as Embedding[];
    } catch (error) {
        logger.error('Get embeddings by file failed', error as Error, { fileId });
        throw new Error('Failed to get embeddings');
    }
}

/**
 * Delete all embeddings for a bot
 * @param botId - Bot ID
 * @returns Number of deleted embeddings
 */
export async function deleteEmbeddingsByBot(botId: string): Promise<number> {
    const client = getSupabaseClient();

    try {
        logger.dbQuery('DELETE', 'embeddings', { botId });

        const { error, count } = await client
            .from('document_chunks')
            .delete()
            .eq('bot_id', botId);

        if (error) {
            throw error;
        }

        logger.info('Embeddings deleted', { botId, count });
        return count || 0;
    } catch (error) {
        logger.error('Delete embeddings failed', error as Error, { botId });
        throw new Error('Failed to delete embeddings');
    }
}

/**
 * Delete all embeddings for a file
 * @param fileId - File ID
 * @returns Number of deleted embeddings
 */
export async function deleteEmbeddingsByFile(fileId: string): Promise<number> {
    const client = getSupabaseClient();

    try {
        const { error, count } = await client
            .from('document_chunks')
            .delete()
            .eq('file_id', fileId);

        if (error) {
            throw error;
        }

        logger.info('File embeddings deleted', { fileId, count });
        return count || 0;
    } catch (error) {
        logger.error('Delete file embeddings failed', error as Error, { fileId });
        throw new Error('Failed to delete file embeddings');
    }
}

/**
 * Get embedding count for a bot
 * @param botId - Bot ID
 * @returns Number of embeddings
 */
export async function getEmbeddingCount(botId: string): Promise<number> {
    const client = getSupabaseClient();

    try {
        const { count, error } = await client
            .from('document_chunks')
            .select('*', { count: 'exact', head: true })
            .eq('bot_id', botId);

        if (error) {
            throw error;
        }

        return count || 0;
    } catch (error) {
        logger.error('Get embedding count failed', error as Error, { botId });
        return 0;
    }
}

/**
 * Check if embeddings exist for a bot
 * @param botId - Bot ID
 * @returns True if embeddings exist
 */
export async function hasEmbeddings(botId: string): Promise<boolean> {
    const count = await getEmbeddingCount(botId);
    return count > 0;
}
