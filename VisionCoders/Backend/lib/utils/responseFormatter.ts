/**
 * Response formatting utilities for consistent API responses and markdown formatting
 */

import { APIError } from './types';

// ============================================================================
// Success Response Formatters
// ============================================================================

/**
 * Format a successful API response
 */
export function successResponse<T>(data: T, message?: string) {
    return {
        success: true,
        ...(message && { message }),
        data: data,
    };
}

/**
 * Format a paginated response
 */
export function paginatedResponse<T>(
    data: T[],
    page: number,
    limit: number,
    total: number
) {
    return {
        success: true,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrevious: page > 1,
        },
    };
}

// ============================================================================
// Error Response Formatters
// ============================================================================

/**
 * Format an error response
 */
export function errorResponse(
    message: string,
    code?: string,
    details?: any
): APIError {
    return {
        success: false,
        error: message,
        ...(code && { code }),
        ...(details && { details }),
    };
}

/**
 * Format validation error response
 */
export function validationError(errors: Record<string, string>): APIError {
    return {
        success: false,
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors,
    };
}

/**
 * Format not found error response
 */
export function notFoundError(resource: string): APIError {
    return {
        success: false,
        error: `${resource} not found`,
        code: 'NOT_FOUND',
    };
}

/**
 * Format unauthorized error response
 */
export function unauthorizedError(message: string = 'Unauthorized'): APIError {
    return {
        success: false,
        error: message,
        code: 'UNAUTHORIZED',
    };
}

/**
 * Format internal server error response
 */
export function internalServerError(
    message: string = 'Internal server error',
    details?: any
): APIError {
    return {
        success: false,
        error: message,
        code: 'INTERNAL_ERROR',
        ...(details && { details }),
    };
}

// ============================================================================
// Markdown Formatters for Chat Responses
// ============================================================================

/**
 * Format text as markdown heading
 */
export function markdownHeading(text: string, level: 1 | 2 | 3 | 4 = 2): string {
    const prefix = '#'.repeat(level);
    return `${prefix} ${text}\n\n`;
}

/**
 * Format text as markdown bold
 */
export function markdownBold(text: string): string {
    return `**${text}**`;
}

/**
 * Format text as markdown italic
 */
export function markdownItalic(text: string): string {
    return `*${text}*`;
}

/**
 * Format text as markdown code block
 */
export function markdownCodeBlock(code: string, language: string = ''): string {
    return `\`\`\`${language}\n${code}\n\`\`\`\n\n`;
}

/**
 * Format text as inline code
 */
export function markdownInlineCode(text: string): string {
    return `\`${text}\``;
}

/**
 * Format array as markdown bullet list
 */
export function markdownBulletList(items: string[]): string {
    return items.map(item => `- ${item}`).join('\n') + '\n\n';
}

/**
 * Format array as markdown numbered list
 */
export function markdownNumberedList(items: string[]): string {
    return items.map((item, index) => `${index + 1}. ${item}`).join('\n') + '\n\n';
}

/**
 * Format text as markdown blockquote
 */
export function markdownBlockquote(text: string): string {
    return `> ${text}\n\n`;
}

/**
 * Format text as markdown horizontal rule
 */
export function markdownHorizontalRule(): string {
    return '---\n\n';
}

/**
 * Format table as markdown
 */
export function markdownTable(headers: string[], rows: string[][]): string {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separator = `| ${headers.map(() => '---').join(' | ')} |`;
    const dataRows = rows.map(row => `| ${row.join(' | ')} |`).join('\n');

    return `${headerRow}\n${separator}\n${dataRows}\n\n`;
}

// ============================================================================
// Specialized Chat Response Formatters
// ============================================================================

/**
 * Format summary response with structured sections
 */
export function formatSummaryResponse(summary: string): string {
    let formatted = markdownHeading('📚 Summary', 2);
    formatted += summary;
    formatted += '\n\n';
    formatted += markdownHorizontalRule();
    formatted += markdownItalic('Generated from your uploaded documents');
    return formatted;
}

/**
 * Format short notes response
 */
export function formatNotesResponse(notes: string): string {
    let formatted = markdownHeading('📝 Short Notes', 2);
    formatted += notes;
    formatted += '\n\n';
    formatted += markdownHorizontalRule();
    formatted += markdownItalic('Quick reference notes from your materials');
    return formatted;
}

/**
 * Format quiz response with structured sections
 */
export function formatQuizResponse(quiz: {
    mcq: Array<{ question: string; options: string[]; answer?: string }>;
    saq: Array<{ question: string; answer?: string }>;
    laq: Array<{ question: string; answer?: string }>;
}): string {
    let formatted = markdownHeading('📝 Quiz', 1);

    // Multiple Choice Questions
    if (quiz.mcq.length > 0) {
        formatted += markdownHeading('Multiple Choice Questions', 2);
        quiz.mcq.forEach((q, index) => {
            formatted += markdownBold(`Q${index + 1}. ${q.question}`) + '\n\n';
            formatted += markdownBulletList(q.options);
        });
        formatted += '\n';
    }

    // Short Answer Questions
    if (quiz.saq.length > 0) {
        formatted += markdownHeading('Short Answer Questions', 2);
        quiz.saq.forEach((q, index) => {
            formatted += `${index + 1}. ${q.question}\n\n`;
        });
        formatted += '\n';
    }

    // Long Answer Questions
    if (quiz.laq.length > 0) {
        formatted += markdownHeading('Long Answer Questions', 2);
        quiz.laq.forEach((q, index) => {
            formatted += `${index + 1}. ${q.question}\n\n`;
        });
    }

    formatted += markdownHorizontalRule();
    formatted += markdownItalic('Quiz generated from your study materials');

    return formatted;
}

/**
 * Format RAG response with sources
 */
export function formatRAGResponse(answer: string, sources?: Array<{ chunk_index: number; similarity_score: number }>): string {
    let formatted = answer + '\n\n';

    if (sources && sources.length > 0) {
        formatted += markdownHorizontalRule();
        formatted += markdownHeading('📖 Sources', 3);
        formatted += markdownItalic(
            `Answer based on ${sources.length} relevant section(s) from your documents`
        );
    }

    return formatted;
}

/**
 * Format error message for user-friendly display
 */
export function formatErrorMessage(error: string): string {
    return `❌ ${markdownBold('Error')}\n\n${error}`;
}

/**
 * Format info message
 */
export function formatInfoMessage(message: string): string {
    return `ℹ️ ${message}`;
}

/**
 * Format warning message
 */
export function formatWarningMessage(message: string): string {
    return `⚠️ ${markdownBold('Warning')}\n\n${message}`;
}

/**
 * Format success message
 */
export function formatSuccessMessage(message: string): string {
    return `✅ ${message}`;
}

// ============================================================================
// Text Utilities
// ============================================================================

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Clean and normalize text
 */
export function cleanText(text: string): string {
    return text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newline
        .trim();
}

/**
 * Escape markdown special characters
 */
export function escapeMarkdown(text: string): string {
    return text.replace(/([*_`\[\]()#+\-.!])/g, '\\$1');
}
