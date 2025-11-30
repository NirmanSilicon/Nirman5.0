/**
 * PDF text extraction using pdf-parse
 * Extracts raw text from PDF files with metadata
 */

import pdfParse from 'pdf-parse';
import { logger } from '../utils/logger';

export interface PDFExtractionResult {
    text: string;
    pageCount: number;
    metadata?: {
        title?: string;
        author?: string;
        subject?: string;
        creator?: string;
        producer?: string;
        creationDate?: Date;
        modificationDate?: Date;
    };
    info?: any;
}

/**
 * Extract text from PDF buffer using Python service (preferred) or pdf-parse (fallback)
 * @param buffer - PDF file buffer
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDF(
    buffer: Buffer
): Promise<PDFExtractionResult> {
    const startTime = Date.now();

    try {
        logger.debug('Starting PDF text extraction', {
            bufferSize: buffer.length,
        });

        // Try Python service first (if available)
        const pythonServiceUrl = process.env.PDF_PROCESSOR_URL || 'http://localhost:8000';

        try {
            logger.debug('Attempting extraction via Python service', { url: pythonServiceUrl });

            const formData = new FormData();
            formData.append('file', new Blob([new Uint8Array(buffer)]), 'document.pdf');

            const response = await fetch(`${pythonServiceUrl}/extract`, {
                method: 'POST',
                body: formData,
                signal: AbortSignal.timeout(30000), // 30 second timeout
            });

            if (response.ok) {
                const data = await response.json();

                const duration = Date.now() - startTime;
                logger.info('PDF extraction completed via Python service', {
                    pageCount: data.page_count,
                    textLength: data.text.length,
                    duration: `${duration}ms`,
                });

                logger.performance('PDF extraction (Python)', duration);

                return {
                    text: data.text,
                    pageCount: data.page_count,
                    metadata: data.metadata ? {
                        title: data.metadata.title,
                        author: data.metadata.author,
                        subject: data.metadata.subject,
                        creator: data.metadata.creator,
                        producer: data.metadata.producer,
                    } : undefined,
                };
            } else {
                logger.warn('Python service returned error, falling back to pdf-parse', {
                    status: response.status,
                });
            }
        } catch (pythonError) {
            logger.warn('Python service unavailable, falling back to pdf-parse', {
                error: pythonError instanceof Error ? pythonError.message : String(pythonError),
            });
        }

        // Fallback to pdf-parse
        logger.debug('Using pdf-parse fallback');

        const data = await pdfParse(buffer, {
            max: 0,
        });

        const duration = Date.now() - startTime;

        logger.info('PDF text extraction completed via pdf-parse (fallback)', {
            pageCount: data.numpages,
            textLength: data.text.length,
            duration: `${duration}ms`,
        });

        logger.performance('PDF extraction (fallback)', duration);

        const metadata = data.info
            ? {
                title: data.info.Title,
                author: data.info.Author,
                subject: data.info.Subject,
                creator: data.info.Creator,
                producer: data.info.Producer,
                creationDate: data.info.CreationDate
                    ? new Date(data.info.CreationDate)
                    : undefined,
                modificationDate: data.info.ModDate
                    ? new Date(data.info.ModDate)
                    : undefined,
            }
            : undefined;

        return {
            text: data.text,
            pageCount: data.numpages,
            metadata,
            info: data.info,
        };
    } catch (error) {
        logger.error('PDF extraction failed', error as Error, {
            bufferSize: buffer.length,
        });

        throw new Error(
            `Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Extract text from PDF file path (for server-side files)
 * @param filePath - Path to PDF file
 * @returns Extracted text and metadata
 */
export async function extractTextFromPDFFile(
    filePath: string
): Promise<PDFExtractionResult> {
    const fs = require('fs').promises;

    try {
        logger.debug('Reading PDF file', { filePath });

        const buffer = await fs.readFile(filePath);
        return await extractTextFromPDF(buffer);
    } catch (error) {
        logger.error('Failed to read PDF file', error as Error, { filePath });

        throw new Error(
            `Failed to read PDF file: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Validate PDF buffer
 * @param buffer - Buffer to validate
 * @returns True if valid PDF
 */
export function isValidPDF(buffer: Buffer): boolean {
    // PDF files start with %PDF-
    const pdfSignature = Buffer.from('%PDF-');
    return buffer.slice(0, 5).equals(pdfSignature);
}

/**
 * Get PDF page count without full extraction
 * @param buffer - PDF file buffer
 * @returns Number of pages
 */
export async function getPDFPageCount(buffer: Buffer): Promise<number> {
    try {
        const data = await pdfParse(buffer, {
            max: 0,
            pagerender: () => '', // Don't render page content
        });

        return data.numpages;
    } catch (error) {
        logger.error('Failed to get PDF page count', error as Error);
        throw new Error('Failed to get PDF page count');
    }
}

/**
 * Clean extracted PDF text
 * Removes excessive whitespace and normalizes line breaks
 * @param text - Raw extracted text
 * @returns Cleaned text
 */
export function cleanPDFText(text: string): string {
    return (
        text
            // Remove null bytes
            .replace(/\0/g, '')
            // Normalize line breaks
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n')
            // Remove excessive whitespace
            .replace(/[ \t]+/g, ' ')
            // Remove excessive line breaks (keep max 2)
            .replace(/\n{3,}/g, '\n\n')
            // Trim each line
            .split('\n')
            .map((line) => line.trim())
            .join('\n')
            // Trim overall
            .trim()
    );
}

/**
 * Extract text with cleaning
 * @param buffer - PDF file buffer
 * @returns Cleaned extraction result
 */
export async function extractAndCleanPDF(
    buffer: Buffer
): Promise<PDFExtractionResult> {
    const result = await extractTextFromPDF(buffer);

    return {
        ...result,
        text: cleanPDFText(result.text),
    };
}
