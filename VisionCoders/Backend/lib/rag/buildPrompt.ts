/**
 * Prompt building utilities for RAG pipeline
 * Assembles system prompts with retrieved context
 */

import { RetrievedChunk } from '../utils/types';
import { combineChunks } from './retrieve';
import { logger } from '../utils/logger';

/**
 * Build a RAG prompt with system instructions and context
 * @param systemPrompt - System-level instructions
 * @param context - Retrieved context chunks
 * @param userQuery - User's question
 * @returns Assembled prompt
 */
export function buildRAGPrompt(
    systemPrompt: string,
    context: RetrievedChunk[],
    userQuery: string
): string {
    logger.debug('Building RAG prompt', {
        contextChunks: context.length,
        queryLength: userQuery.length,
    });

    // Combine context chunks
    const combinedContext = combineChunks(context);

    // Assemble prompt
    const prompt = `${systemPrompt}

CONTEXT FROM USER'S DOCUMENTS:
${combinedContext}

USER QUERY:
${userQuery}

INSTRUCTIONS:
- Answer the user's query based ONLY on the provided context
- If the answer is not in the context, say "This information is not available in your notes"
- Paraphrase and rewrite in your own words - do NOT copy text directly
- Format your response clearly with headings, bullet points, and sections where appropriate
- Be concise but comprehensive

YOUR RESPONSE:`;

    return prompt;
}

/**
 * Build a summarization prompt
 * @param systemPrompt - System-level instructions
 * @param allChunks - All chunks from the bot's documents
 * @returns Assembled prompt
 */
export function buildSummarizePrompt(
    systemPrompt: string,
    allChunks: RetrievedChunk[]
): string {
    logger.debug('Building summarize prompt', {
        totalChunks: allChunks.length,
    });

    const combinedContent = combineChunks(allChunks);

    const prompt = `${systemPrompt}

DOCUMENT CONTENT:
${combinedContent}

TASK:
Create a comprehensive summary of the above document content. Your summary should:
- Cover all major topics and key points
- Be well-structured with clear headings and sections
- Use bullet points for better readability
- Paraphrase everything in your own words
- Be detailed but concise
- Follow an academic/study-friendly format

YOUR SUMMARY:`;

    return prompt;
}

/**
 * Build a short notes prompt
 * @param systemPrompt - System-level instructions
 * @param allChunks - All chunks from the bot's documents
 * @returns Assembled prompt
 */
export function buildShortNotesPrompt(
    systemPrompt: string,
    allChunks: RetrievedChunk[]
): string {
    logger.debug('Building short notes prompt', {
        totalChunks: allChunks.length,
    });

    const combinedContent = combineChunks(allChunks);

    const prompt = `${systemPrompt}

DOCUMENT CONTENT:
${combinedContent}

TASK:
Create concise, bullet-point style notes from the above content. Your notes should:
- Be in bullet-point format
- Cover all important concepts and facts
- Be easy to scan and review
- Use clear, simple language
- Group related points under headings
- Be suitable for quick revision
- Paraphrase everything in your own words

YOUR NOTES:`;

    return prompt;
}

/**
 * Build a quiz generation prompt
 * @param systemPrompt - System-level instructions
 * @param allChunks - All chunks from the bot's documents
 * @param questionCount - Number of questions to generate
 * @returns Assembled prompt
 */
export function buildQuizPrompt(
    systemPrompt: string,
    allChunks: RetrievedChunk[],
    questionCount: number = 10
): string {
    logger.debug('Building quiz prompt', {
        totalChunks: allChunks.length,
        questionCount,
    });

    const combinedContent = combineChunks(allChunks);

    const mcqCount = Math.ceil(questionCount * 0.6); // 60% MCQ
    const saqCount = Math.ceil(questionCount * 0.3); // 30% SAQ
    const laqCount = Math.max(1, questionCount - mcqCount - saqCount); // Rest LAQ

    const prompt = `${systemPrompt}

DOCUMENT CONTENT:
${combinedContent}

TASK:
Generate a quiz with ${questionCount} questions based on the above content. Create:
- ${mcqCount} Multiple Choice Questions (MCQ) with 4 options each
- ${saqCount} Short Answer Questions (SAQ)
- ${laqCount} Long Answer Questions (LAQ)

FORMAT YOUR RESPONSE AS FOLLOWS:

## Multiple Choice Questions

1. [Question text]
   A) [Option A]
   B) [Option B]
   C) [Option C]
   D) [Option D]
   **Answer: [Correct option letter]**

[Continue for all MCQs...]

## Short Answer Questions

1. [Question text]

[Continue for all SAQs...]

## Long Answer Questions

1. [Question text]

[Continue for all LAQs...]

REQUIREMENTS:
- Questions should test understanding, not just memorization
- Cover different topics from the content
- MCQ options should be plausible and not obviously wrong
- Vary difficulty levels
- Base all questions strictly on the provided content

YOUR QUIZ:`;

    return prompt;
}

/**
 * Build an explanation prompt
 * @param systemPrompt - System-level instructions
 * @param context - Retrieved context chunks
 * @param concept - Concept to explain
 * @returns Assembled prompt
 */
export function buildExplainPrompt(
    systemPrompt: string,
    context: RetrievedChunk[],
    concept: string
): string {
    logger.debug('Building explain prompt', {
        contextChunks: context.length,
        concept,
    });

    const combinedContext = combineChunks(context);

    const prompt = `${systemPrompt}

CONTEXT FROM USER'S DOCUMENTS:
${combinedContext}

CONCEPT TO EXPLAIN:
${concept}

TASK:
Explain the concept in simple, easy-to-understand terms based on the provided context. Your explanation should:
- Start with a simple definition
- Break down complex ideas into simpler parts
- Use examples or analogies where helpful
- Be clear and beginner-friendly
- Stay grounded in the provided context
- Paraphrase everything in your own words

If the concept is not covered in the context, say "This concept is not covered in your notes."

YOUR EXPLANATION:`;

    return prompt;
}

/**
 * Build a custom prompt with template variables
 * @param template - Prompt template with {variables}
 * @param variables - Object with variable values
 * @returns Assembled prompt
 */
export function buildCustomPrompt(
    template: string,
    variables: Record<string, string>
): string {
    let prompt = template;

    for (const [key, value] of Object.entries(variables)) {
        const placeholder = `{${key}}`;
        prompt = prompt.replace(new RegExp(placeholder, 'g'), value);
    }

    return prompt;
}

/**
 * Truncate prompt to fit within token limit
 * @param prompt - Full prompt
 * @param maxTokens - Maximum tokens (rough estimate: 1 token ≈ 4 chars)
 * @returns Truncated prompt
 */
export function truncatePrompt(prompt: string, maxTokens: number): string {
    const maxChars = maxTokens * 4;

    if (prompt.length <= maxChars) {
        return prompt;
    }

    logger.warn('Prompt exceeds token limit, truncating', {
        original: prompt.length,
        max: maxChars,
    });

    return prompt.substring(0, maxChars) + '\n\n[Content truncated due to length...]';
}

/**
 * Validate prompt length
 * @param prompt - Prompt to validate
 * @param maxTokens - Maximum allowed tokens
 * @returns Validation result
 */
export function validatePromptLength(
    prompt: string,
    maxTokens: number
): { valid: boolean; estimatedTokens: number; error?: string } {
    const estimatedTokens = Math.ceil(prompt.length / 4);

    if (estimatedTokens > maxTokens) {
        return {
            valid: false,
            estimatedTokens,
            error: `Prompt exceeds maximum token limit (${estimatedTokens} > ${maxTokens})`,
        };
    }

    return {
        valid: true,
        estimatedTokens,
    };
}
