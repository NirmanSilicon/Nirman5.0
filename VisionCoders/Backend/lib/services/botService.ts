/**
 * Bot service - Handles bot creation and management
 * Manages bot metadata and lifecycle
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Bot, CreateBotRequest } from '../utils/types';
import { logger } from '../utils/logger';

// Initialize Supabase client
let supabase: SupabaseClient | null = null;

function getSupabaseClient(): SupabaseClient {
    if (!supabase) {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey =
            process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Supabase credentials not configured');
        }

        supabase = createClient(supabaseUrl, supabaseKey);
    }

    return supabase;
}

/**
 * Create a new bot
 * @param request - Bot creation request
 * @returns Created bot
 */
export async function createBot(request: CreateBotRequest): Promise<Bot> {
    const client = getSupabaseClient();

    try {
        logger.info('Creating new bot', {
            name: request.name,
            userId: request.userId,
        });

        // Validate input
        if (!request.name || request.name.trim().length === 0) {
            throw new Error('Bot name is required');
        }

        if (request.name.length < 3 || request.name.length > 100) {
            throw new Error('Bot name must be between 3 and 100 characters');
        }

        // Generate planet data for visualization
        const orbitRadii = [5, 8, 12, 17, 23];
        const textureTypes = ['rocky', 'icy', 'desert', 'ocean', 'volcanic'] as const;

        // Get existing bot count to determine orbit
        const { count } = await client
            .from('chatbots')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', request.userId);

        const existingCount = count || 0;
        const orbitRing = existingCount % 5;
        const orbitRadius = orbitRadii[orbitRing];
        const planetData = {
            orbit_radius: orbitRadius,
            orbit_speed: 0.5 / orbitRadius,
            texture_type: textureTypes[Math.floor(Math.random() * textureTypes.length)],
            planet_size: 0.5,
            activity: 0.3,
            angle_offset: Math.random() * Math.PI * 2,
        };

        // Insert bot into database
        const { data, error } = await client
            .from('chatbots')
            .insert({
                name: request.name.trim(),
                description: request.description?.trim() || '',
                user_id: request.userId,
                ...planetData,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating bot:', error);
            logger.error('Failed to create bot', new Error(error.message), {
                code: error.code,
            });
            throw error;
        }

        logger.info('Bot created successfully', {
            botId: data.id,
            name: data.name,
        });

        return data as Bot;
    } catch (error) {
        logger.error('Create bot failed', error as Error);
        throw new Error(
            `Failed to create bot: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Get bot by ID
 * @param botId - Bot ID
 * @returns Bot or null if not found
 */
export async function getBotById(botId: string): Promise<Bot | null> {
    const client = getSupabaseClient();

    try {
        logger.debug('Fetching bot', { botId });

        const { data, error } = await client
            .from('chatbots')
            .select('*')
            .eq('id', botId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                // Not found
                return null;
            }
            throw error;
        }

        return data as Bot;
    } catch (error) {
        logger.error('Get bot failed', error as Error, { botId });
        throw new Error('Failed to get bot');
    }
}

/**
 * Get all bots for a user
 * @param userId - User ID
 * @returns Array of bots
 */
export async function getBotsByUser(userId: string): Promise<Bot[]> {
    const client = getSupabaseClient();

    try {
        logger.debug('Fetching user bots', { userId });

        const { data, error } = await client
            .from('chatbots')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        logger.debug('User bots retrieved', {
            userId,
            count: data?.length || 0,
        });

        return (data || []) as Bot[];
    } catch (error) {
        logger.error('Get user bots failed', error as Error, { userId });
        throw new Error('Failed to get user bots');
    }
}

/**
 * Update bot details
 * @param botId - Bot ID
 * @param updates - Fields to update
 * @returns Updated bot
 */
export async function updateBot(
    botId: string,
    updates: { name?: string; description?: string }
): Promise<Bot> {
    const client = getSupabaseClient();

    try {
        logger.info('Updating bot', { botId, updates });

        // Validate updates
        if (updates.name !== undefined) {
            if (updates.name.length < 3 || updates.name.length > 100) {
                throw new Error('Bot name must be between 3 and 100 characters');
            }
        }

        const { data, error } = await client
            .from('chatbots')
            .update({
                ...(updates.name && { name: updates.name.trim() }),
                ...(updates.description !== undefined && {
                    description: updates.description.trim(),
                }),
                updated_at: new Date().toISOString(),
            })
            .eq('id', botId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        logger.info('Bot updated successfully', { botId });
        return data as Bot;
    } catch (error) {
        logger.error('Update bot failed', error as Error, { botId });
        throw new Error('Failed to update bot');
    }
}

/**
 * Delete a bot and all associated data
 * @param botId - Bot ID
 * @returns True if deleted successfully
 */
export async function deleteBot(botId: string): Promise<boolean> {
    const client = getSupabaseClient();

    try {
        logger.info('Deleting bot', { botId });

        // Delete bot (cascading deletes will handle embeddings and files)
        const { error } = await client.from('chatbots').delete().eq('id', botId);

        if (error) {
            throw error;
        }

        logger.info('Bot deleted successfully', { botId });
        return true;
    } catch (error) {
        logger.error('Delete bot failed', error as Error, { botId });
        throw new Error('Failed to delete bot');
    }
}

/**
 * Check if bot exists
 * @param botId - Bot ID
 * @returns True if bot exists
 */
export async function botExists(botId: string): Promise<boolean> {
    const bot = await getBotById(botId);
    return bot !== null;
}

/**
 * Check if user owns bot
 * @param botId - Bot ID
 * @param userId - User ID
 * @returns True if user owns bot
 */
export async function userOwnsBot(
    botId: string,
    userId: string
): Promise<boolean> {
    const bot = await getBotById(botId);
    return bot !== null && bot.user_id === userId;
}

/**
 * Get bot statistics
 * @param botId - Bot ID
 * @returns Bot statistics
 */
export async function getBotStats(botId: string): Promise<{
    fileCount: number;
    embeddingCount: number;
    chatCount: number;
}> {
    const client = getSupabaseClient();

    try {
        // Get file count
        const { count: fileCount } = await client
            .from('pdf_documents')
            .select('*', { count: 'exact', head: true })
            .eq('bot_id', botId);

        // Get embedding count
        const { count: embeddingCount } = await client
            .from('document_chunks')
            .select('*', { count: 'exact', head: true })
            .eq('bot_id', botId);

        // Get chat message count
        const { count: chatCount } = await client
            .from('chat_history')
            .select('*', { count: 'exact', head: true })
            .eq('bot_id', botId);

        return {
            fileCount: fileCount || 0,
            embeddingCount: embeddingCount || 0,
            chatCount: chatCount || 0,
        };
    } catch (error) {
        logger.error('Get bot stats failed', error as Error, { botId });
        return {
            fileCount: 0,
            embeddingCount: 0,
            chatCount: 0,
        };
    }
}

/**
 * Validate bot name
 * @param name - Bot name to validate
 * @returns Validation result
 */
export function validateBotName(name: string): {
    valid: boolean;
    error?: string;
} {
    if (!name || name.trim().length === 0) {
        return { valid: false, error: 'Bot name is required' };
    }

    const trimmed = name.trim();

    if (trimmed.length < 3) {
        return { valid: false, error: 'Bot name must be at least 3 characters' };
    }

    if (trimmed.length > 100) {
        return { valid: false, error: 'Bot name must not exceed 100 characters' };
    }

    // Check for invalid characters
    if (!/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
        return {
            valid: false,
            error: 'Bot name can only contain letters, numbers, spaces, hyphens, and underscores',
        };
    }

    return { valid: true };
}
