/**
 * File service - Handles PDF file lifecycle
 * Manages file uploads, storage, and processing status
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PDFDocument } from '../utils/types';
import { logger } from '../utils/logger';
import { isValidPDF } from '../pdf/extract';

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

// File upload configuration
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760', 10); // 10MB default
const STORAGE_BUCKET = 'pdf-documents'; // Must match frontend bucket name

/**
 * Upload PDF file to Supabase Storage
 * @param file - File buffer
 * @param fileName - Original file name
 * @param botId - Bot ID
 * @returns Uploaded file metadata
 */
export async function uploadPDF(
    file: Buffer,
    fileName: string,
    botId: string
): Promise<PDFDocument> {
    const client = getSupabaseClient();

    try {
        logger.info('Uploading PDF file', {
            fileName,
            botId,
            fileSize: file.length,
        });

        // Validate file
        const validation = validatePDFFile(file, fileName);
        if (!validation.valid) {
            throw new Error(validation.error);
        }

        // Generate unique file path
        const timestamp = Date.now();
        const sanitizedName = sanitizeFileName(fileName);
        const filePath = `${botId}/${timestamp}-${sanitizedName}`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await client.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                contentType: 'application/pdf',
                upsert: false,
            });

        if (uploadError) {
            logger.error('File upload failed', new Error(uploadError.message));
            throw uploadError;
        }

        logger.debug('File uploaded to storage', { path: uploadData.path });

        // Create file record in database
        const { data: fileData, error: dbError } = await client
            .from('pdf_documents')
            .insert({
                bot_id: botId,
                file_name: fileName,
                file_path: uploadData.path,
                file_size: file.length,
                processing_status: 'uploaded',
            })
            .select()
            .single();

        if (dbError) {
            // Cleanup: delete uploaded file if DB insert fails
            await client.storage.from(STORAGE_BUCKET).remove([uploadData.path]);
            throw dbError;
        }

        logger.info('PDF uploaded successfully', {
            fileId: fileData.id,
            fileName,
        });

        return fileData as PDFDocument;
    } catch (error) {
        logger.error('Upload PDF failed', error as Error, { fileName, botId });
        throw new Error(
            `Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'
            }`
        );
    }
}

/**
 * Download PDF file from storage
 * @param filePath - File path in storage
 * @returns File buffer
 */
export async function downloadPDF(filePath: string): Promise<Buffer> {
    const client = getSupabaseClient();

    try {
        logger.debug('Downloading PDF file', { filePath });

        const { data, error } = await client.storage
            .from(STORAGE_BUCKET)
            .download(filePath);

        if (error) {
            throw error;
        }

        const buffer = Buffer.from(await data.arrayBuffer());

        logger.debug('PDF downloaded', {
            filePath,
            size: buffer.length,
        });

        return buffer;
    } catch (error) {
        logger.error('Download PDF failed', error as Error, { filePath });
        throw new Error('Failed to download PDF');
    }
}

/**
 * Get file by ID
 * @param fileId - File ID
 * @returns File metadata
 */
export async function getFileById(fileId: string): Promise<PDFDocument | null> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('pdf_documents')
            .select('*')
            .eq('id', fileId)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }

        return data as PDFDocument;
    } catch (error) {
        logger.error('Get file failed', error as Error, { fileId });
        throw new Error('Failed to get file');
    }
}

/**
 * Get all files for a bot
 * @param botId - Bot ID
 * @returns Array of files
 */
export async function getFilesByBot(botId: string): Promise<PDFDocument[]> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('pdf_documents')
            .select('*')
            .eq('bot_id', botId)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return (data || []) as PDFDocument[];
    } catch (error) {
        logger.error('Get files by bot failed', error as Error, { botId });
        throw new Error('Failed to get files');
    }
}

/**
 * Update file status
 * @param fileId - File ID
 * @param status - New status
 * @param errorMessage - Optional error message
 * @returns Updated file
 */
export async function updateFileStatus(
    fileId: string,
    status: PDFDocument['processing_status'],
    errorMessage?: string
): Promise<PDFDocument> {
    const client = getSupabaseClient();

    try {
        logger.debug('Updating file status', { fileId, status });

        const { data, error } = await client
            .from('pdf_documents')
            .update({
                processing_status: status,
                ...(errorMessage && { error_message: errorMessage }),
            })
            .eq('id', fileId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        logger.info('File status updated', { fileId, status });
        return data as PDFDocument;
    } catch (error) {
        logger.error('Update file status failed', error as Error, { fileId });
        throw new Error('Failed to update file status');
    }
}

/**
 * Update file metadata (e.g., page count)
 * @param fileId - File ID
 * @param metadata - Metadata to update
 * @returns Updated file
 */
export async function updateFileMetadata(
    fileId: string,
    metadata: { page_count?: number }
): Promise<PDFDocument> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client
            .from('pdf_documents')
            .update({
                ...metadata,
            })
            .eq('id', fileId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as PDFDocument;
    } catch (error) {
        logger.error('Update file metadata failed', error as Error, { fileId });
        throw new Error('Failed to update file metadata');
    }
}

/**
 * Delete file and cleanup storage
 * @param fileId - File ID
 * @returns True if deleted successfully
 */
export async function deleteFile(fileId: string): Promise<boolean> {
    const client = getSupabaseClient();

    try {
        logger.info('Deleting file', { fileId });

        // Get file to find storage path
        const file = await getFileById(fileId);
        if (!file) {
            throw new Error('File not found');
        }

        // Delete from storage
        const { error: storageError } = await client.storage
            .from(STORAGE_BUCKET)
            .remove([file.file_path]);

        if (storageError) {
            logger.warn('Failed to delete from storage', { error: storageError });
        }

        // Delete from database
        const { error: dbError } = await client
            .from('pdf_documents')
            .delete()
            .eq('id', fileId);

        if (dbError) {
            throw dbError;
        }

        logger.info('File deleted successfully', { fileId });
        return true;
    } catch (error) {
        logger.error('Delete file failed', error as Error, { fileId });
        throw new Error('Failed to delete file');
    }
}

/**
 * Validate PDF file
 * @param file - File buffer
 * @param fileName - File name
 * @returns Validation result
 */
export function validatePDFFile(
    file: Buffer,
    fileName: string
): { valid: boolean; error?: string } {
    // Check file size
    if (file.length > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        };
    }

    if (file.length === 0) {
        return { valid: false, error: 'File is empty' };
    }

    // Check file extension
    if (!fileName.toLowerCase().endsWith('.pdf')) {
        return { valid: false, error: 'File must be a PDF' };
    }

    // Validate PDF signature
    if (!isValidPDF(file)) {
        return { valid: false, error: 'Invalid PDF file' };
    }

    return { valid: true };
}

/**
 * Sanitize file name for storage
 * @param fileName - Original file name
 * @returns Sanitized file name
 */
export function sanitizeFileName(fileName: string): string {
    return fileName
        .replace(/[^a-zA-Z0-9._-]/g, '_')
        .replace(/_{2,}/g, '_')
        .toLowerCase();
}

/**
 * Get file download URL
 * @param filePath - File path in storage
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL
 */
export async function getFileDownloadURL(
    filePath: string,
    expiresIn: number = 3600
): Promise<string> {
    const client = getSupabaseClient();

    try {
        const { data, error } = await client.storage
            .from(STORAGE_BUCKET)
            .createSignedUrl(filePath, expiresIn);

        if (error) {
            throw error;
        }

        return data.signedUrl;
    } catch (error) {
        logger.error('Get download URL failed', error as Error, { filePath });
        throw new Error('Failed to generate download URL');
    }
}

/**
 * Check if file exists
 * @param fileId - File ID
 * @returns True if file exists
 */
export async function fileExists(fileId: string): Promise<boolean> {
    const file = await getFileById(fileId);
    return file !== null;
}

/**
 * Get total storage used by bot
 * @param botId - Bot ID
 * @returns Total bytes used
 */
export async function getBotStorageUsage(botId: string): Promise<number> {
    const files = await getFilesByBot(botId);
    return files.reduce((total, file) => total + file.file_size, 0);
}
