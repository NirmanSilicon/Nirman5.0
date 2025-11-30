/**
 * Core TypeScript types and interfaces for PDF-GPT Backend
 */

// ============================================================================
// Bot Types
// ============================================================================

export interface Bot {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
}

export interface CreateBotRequest {
  name: string;
  description: string;
  userId: string;
}

export interface CreateBotResponse {
  success: boolean;
  bot?: Bot;
  error?: string;
}

// ============================================================================
// PDF Document Types
// ============================================================================

export interface PDFDocument {
  id: string;
  bot_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  page_count?: number;
  processing_status: 'uploaded' | 'processing' | 'processed' | 'embedded' | 'failed';
  error_message?: string;
  created_at: string;
}

export interface UploadPDFRequest {
  botId: string;
  file: File | Buffer;
  fileName: string;
}

export interface UploadPDFResponse {
  success: boolean;
  fileId?: string;
  fileName?: string;
  error?: string;
}

// ============================================================================
// Text Chunk Types
// ============================================================================

export interface Chunk {
  id?: string;
  file_id: string;
  bot_id: string;
  chunk_text: string;
  chunk_index: number;
  page_number?: number;
  token_count?: number;
  metadata?: ChunkMetadata;
}

export interface ChunkMetadata {
  source_page?: number;
  start_char?: number;
  end_char?: number;
  overlap_with_previous?: boolean;
  overlap_with_next?: boolean;
  [key: string]: any;
}

export interface ProcessPDFRequest {
  fileId: string;
}

export interface ProcessPDFResponse {
  success: boolean;
  chunks?: number;
  textLength?: number;
  pageCount?: number;
  error?: string;
}

// ============================================================================
// Embedding Types
// ============================================================================

export interface Embedding {
  id?: string;
  bot_id: string;
  file_id?: string;        // Legacy - for API compatibility
  chunk_id?: string;
  chunk_text?: string;     // Legacy - for API compatibility
  chunk_index: number;
  embedding: number[];
  metadata?: Record<string, any>;
  // Actual database columns
  chatbot_id?: string;     // Database uses this instead of bot_id
  document_id?: string;    // Database uses this instead of file_id
  content?: string;        // Database uses this instead of chunk_text
  created_at?: string;
}

export interface EmbedRequest {
  fileId: string;
  botId: string;
}

export interface EmbedResponse {
  success: boolean;
  embeddingsCount?: number;
  error?: string;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface ChatMessage {
  id?: string;
  bot_id: string;
  user_id: string;
  role: 'user' | 'assistant' | 'system';
  message: string;
  command?: CommandType;
  created_at?: string;
}

export enum CommandType {
  SUMMARIZE = 'summarize',
  SHORT_NOTES = 'short_notes',
  QUIZ = 'quiz',
  EXPLAIN = 'explain',
  NONE = 'none',
}

export interface ChatRequest {
  botId: string;
  message: string;
  userId: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  command?: CommandType;
  sources?: RetrievedChunk[];
  error?: string;
}

// ============================================================================
// RAG Retrieval Types
// ============================================================================

export interface RetrievedChunk {
  chunk_text: string;
  chunk_index: number;
  similarity_score: number;
  file_id: string;
  page_number?: number;
  metadata?: Record<string, any>;
}

export interface RetrievalRequest {
  botId: string;
  query: string;
  topK?: number;
  similarityThreshold?: number;
}

export interface RetrievalResponse {
  success: boolean;
  chunks?: RetrievedChunk[];
  error?: string;
}

// ============================================================================
// Command Handler Types
// ============================================================================

export interface SummarizeRequest {
  botId: string;
  userId: string;
}

export interface SummarizeResponse {
  success: boolean;
  summary?: string;
  error?: string;
}

export interface ShortNotesRequest {
  botId: string;
  userId: string;
}

export interface ShortNotesResponse {
  success: boolean;
  notes?: string;
  error?: string;
}

export interface QuizRequest {
  botId: string;
  userId: string;
  questionCount?: number;
}

export interface QuizQuestion {
  type: 'mcq' | 'saq' | 'laq';
  question: string;
  options?: string[];
  answer?: string;
  points?: number;
}

export interface QuizResponse {
  success: boolean;
  quiz?: {
    mcq: QuizQuestion[];
    saq: QuizQuestion[];
    laq: QuizQuestion[];
  };
  error?: string;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface APIError {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// ============================================================================
// Utility Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ============================================================================
// Supabase Types
// ============================================================================

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface VectorSearchResult {
  id: string;
  file_id: string;
  chunk_text: string;
  chunk_index: number;
  similarity: number;
  metadata?: Record<string, any>;
}
