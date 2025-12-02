/**
 * Chat service - Handles chat orchestration and command detection
 * Routes user queries to appropriate handlers
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ChatMessage, CommandType } from '../utils/types';
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
 * Command patterns for detection
 * Updated to be more flexible - allows text after commands
 */
const COMMAND_PATTERNS: Record<CommandType, RegExp[]> = {
    [CommandType.SUMMARIZE]: [
        /^summar(y|ize|ise)(\s|$)/i,  // "summarize", "summary", "summarise" + optional text
        /^give\s+me\s+a\s+summar/i,   // "give me a summary..."
        /^create\s+summar/i,          // "create summary..."
        /^\[summary\]/i,              // "[Summary]" prefix
    ],
    [CommandType.SHORT_NOTES]: [
        /^(short\s+)?notes(\s|$)/i,   // "notes" or "short notes" + optional text
        /^make\s+notes/i,             // "make notes..."
        /^create\s+notes/i,           // "create notes..."
        /^give\s+me\s+notes/i,        // "give me notes..."
        /^\[notes\]/i,                // "[Notes]" prefix
        /^\[short\s+notes\]/i,        // "[Short notes]" prefix
    ],
    [CommandType.QUIZ]: [
        /^quiz(\s|$)/i,               // "quiz" + optional text
        /^quiz\s+me/i,                // "quiz me"
        /^test\s+me/i,                // "test me..."
        /^create\s+quiz/i,            // "create quiz..."
        /^generate\s+quiz/i,          // "generate quiz..."
        /^make\s+a\s+quiz/i,          // "make a quiz..."
        /^test$/i,                    // "test"
        /^\[quiz\]/i,                 // "[Quiz]" prefix
        /^\[quiz\s+me\]/i,            // "[Quiz me]" prefix
    ],
    [CommandType.EXPLAIN]: [
        /^explain\s+(.+)$/i,          // "explain something"
        /^what\s+is\s+(.+)$/i,        // "what is something"
        /^define\s+(.+)$/i,           // "define something"
        /^tell\s+me\s+about\s+(.+)$/i, // "tell me about something"
    ],
    [CommandType.NONE]: [],
};

/**
 * Detect command from user message
 * @param message - User message
 * @returns Detected command type and extracted concept (for explain)
 */
export function detectCommand(message: string): {
    command: CommandType;
    concept?: string;
} {
    const trimmed = message.trim();

    // Check each command pattern
    for (const [command, patterns] of Object.entries(COMMAND_PATTERNS)) {
        for (const pattern of patterns) {
            const match = trimmed.match(pattern);
            if (match) {
                logger.debug('Command detected', {
                    command,
                    message: trimmed,
                });

                // For explain command, extract the concept
                if (command === CommandType.EXPLAIN && match[1]) {
                    return {
                        command: command as CommandType,
                        concept: match[1].trim(),
                    };
                }

                return { command: command as CommandType };
            }
        }
    }

    // No command detected
    return { command: CommandType.NONE };
}

/**
 * Save chat message to history
 * @param message - Chat message
 * @returns Saved message with ID
 */
export async function saveChatMessage(
    message: ChatMessage
): Promise<ChatMessage> {
    const client = getSupabaseClient();

    try {
        logger.debug('Saving chat message', {
            botId: message.bot_id,
            role: message.role,
        });

        const { data, error } = await client
            .from('chat_history')
            .insert({
                bot_id: message.bot_id,
                user_id: message.user_id,
                role: message.role,
                message: message.message,
                command: message.command || null,
            })
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as ChatMessage;
    } catch (error) {
        logger.error('Save chat message failed', error as Error);
        throw new Error('Failed to save chat message');
    }
}

/**
 * Get chat history for a bot
 * @param botId - Bot ID
 * @param limit - Maximum number of messages to retrieve
 * @returns Array of chat messages
 */
export async function getChatHistory(
    botId: string,
    limit: number = 50
): Promise<ChatMessage[]> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('chat_history')
            .select('*')
            .eq('bot_id', botId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) {
            throw error;
        }

        // Reverse to get chronological order
        return ((data || []) as ChatMessage[]).reverse();
    } catch (error) {
        logger.error('Get chat history failed', error as Error, { botId });
        throw new Error('Failed to get chat history');
    }
}

/**
 * Get recent chat context (last N messages)
 * @param botId - Bot ID
 * @param messageCount - Number of recent messages
 * @returns Recent messages
 */
export async function getRecentContext(
    botId: string,
    messageCount: number = 10
): Promise<ChatMessage[]> {
    return getChatHistory(botId, messageCount);
}

/**
 * Delete chat history for a bot
 * @param botId - Bot ID
 * @returns Number of deleted messages
 */
export async function deleteChatHistory(botId: string): Promise<number> {
    const client = getSupabaseClient();

    try {
        logger.info('Deleting chat history', { botId });

        const { error, count } = await client
            .from('chat_history')
            .delete()
            .eq('bot_id', botId);

        if (error) {
            throw error;
        }

        logger.info('Chat history deleted', { botId, count });
        return count || 0;
    } catch (error) {
        logger.error('Delete chat history failed', error as Error, { botId });
        throw new Error('Failed to delete chat history');
    }
}

/**
 * Get chat statistics for a bot
 * @param botId - Bot ID
 * @returns Chat statistics
 */
export async function getChatStats(botId: string): Promise<{
    totalMessages: number;
    userMessages: number;
    assistantMessages: number;
    commandUsage: Record<string, number>;
}> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('chat_history')
            .select('role, command')
            .eq('bot_id', botId);

        if (error) {
            throw error;
        }

        const messages = data || [];
        const userMessages = messages.filter((m) => m.role === 'user').length;
        const assistantMessages = messages.filter(
            (m) => m.role === 'assistant'
        ).length;

        // Count command usage
        const commandUsage: Record<string, number> = {};
        messages.forEach((m) => {
            if (m.command) {
                commandUsage[m.command] = (commandUsage[m.command] || 0) + 1;
            }
        });

        return {
            totalMessages: messages.length,
            userMessages,
            assistantMessages,
            commandUsage,
        };
    } catch (error) {
        logger.error('Get chat stats failed', error as Error, { botId });
        return {
            totalMessages: 0,
            userMessages: 0,
            assistantMessages: 0,
            commandUsage: {},
        };
    }
}

/**
 * Check if message is a command
 * @param message - User message
 * @returns True if message is a command
 */
export function isCommand(message: string): boolean {
    const { command } = detectCommand(message);
    return command !== CommandType.NONE;
}

/**
 * Get command description
 * @param command - Command type
 * @returns Human-readable description
 */
export function getCommandDescription(command: CommandType): string {
    const descriptions: Record<CommandType, string> = {
        [CommandType.SUMMARIZE]:
            'Generate a comprehensive summary of all documents',
        [CommandType.SHORT_NOTES]: 'Create concise bullet-point notes',
        [CommandType.QUIZ]: 'Generate a quiz with MCQ, SAQ, and LAQ questions',
        [CommandType.EXPLAIN]: 'Explain a specific concept in simple terms',
        [CommandType.NONE]: 'Regular question-answer',
    };

    return descriptions[command] || 'Unknown command';
}

/**
 * Get available commands list
 * @returns List of available commands with examples
 */
export function getAvailableCommands(): Array<{
    command: CommandType;
    description: string;
    examples: string[];
}> {
    return [
        {
            command: CommandType.SUMMARIZE,
            description: 'Generate a comprehensive summary',
            examples: ['summarize', 'summary', 'give me a summary'],
        },
        {
            command: CommandType.SHORT_NOTES,
            description: 'Create short notes',
            examples: ['short notes', 'make notes', 'notes'],
        },
        {
            command: CommandType.QUIZ,
            description: 'Generate a quiz',
            examples: ['quiz', 'test me', 'create quiz'],
        },
        {
            command: CommandType.EXPLAIN,
            description: 'Explain a concept',
            examples: ['explain photosynthesis', 'what is gravity'],
        },
    ];
}

/**
 * Validate chat message
 * @param message - Message to validate
 * @returns Validation result
 */
export function validateChatMessage(message: string): {
    valid: boolean;
    error?: string;
} {
    if (!message || message.trim().length === 0) {
        return { valid: false, error: 'Message cannot be empty' };
    }

    if (message.length > 5000) {
        return {
            valid: false,
            error: 'Message exceeds maximum length of 5000 characters',
        };
    }

    return { valid: true };
}

/**
 * Format chat message for display
 * @param message - Chat message
 * @returns Formatted message
 */
export function formatChatMessage(message: ChatMessage): string {
    const timestamp = message.created_at
        ? new Date(message.created_at).toLocaleString()
        : '';
    const role = message.role === 'user' ? 'You' : 'Assistant';
    const command = message.command ? ` [${message.command}]` : '';

    return `[${timestamp}] ${role}${command}: ${message.message}`;
}
