-- Complete Database Setup for PDF-GPT with OpenRouter
-- Run this in Supabase SQL Editor to create all required tables

-- ============================================
-- 1. DOCUMENT_CHUNKS TABLE (MAIN FIX)
-- ============================================

-- Drop existing table if it has wrong structure
-- WARNING: This will delete all existing data!
-- Comment out these lines if you want to keep existing data
-- DROP TABLE IF EXISTS document_chunks CASCADE;

-- Create document_chunks table with correct structure
CREATE TABLE IF NOT EXISTS document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL,
    bot_id UUID NOT NULL,
    chunk_text TEXT NOT NULL,
    chunk_index INTEGER NOT NULL,
    embedding vector(1536),  -- OpenRouter uses 1536 dimensions
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. INDEXES FOR PERFORMANCE
-- ============================================

-- Vector similarity search index (CRITICAL for RAG)
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Regular indexes for faster lookups
CREATE INDEX IF NOT EXISTS document_chunks_bot_id_idx ON document_chunks(bot_id);
CREATE INDEX IF NOT EXISTS document_chunks_file_id_idx ON document_chunks(file_id);
CREATE INDEX IF NOT EXISTS document_chunks_created_at_idx ON document_chunks(created_at DESC);

-- ============================================
-- 3. FOREIGN KEY CONSTRAINTS
-- ============================================

-- Add foreign keys if they don't exist
DO $$
BEGIN
    -- Check if pdf_documents table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pdf_documents') THEN
        ALTER TABLE document_chunks 
        ADD CONSTRAINT IF NOT EXISTS fk_file 
        FOREIGN KEY (file_id) REFERENCES pdf_documents(id) ON DELETE CASCADE;
    END IF;
    
    -- Check if chatbots table exists
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chatbots') THEN
        ALTER TABLE document_chunks 
        ADD CONSTRAINT IF NOT EXISTS fk_bot 
        FOREIGN KEY (bot_id) REFERENCES chatbots(id) ON DELETE CASCADE;
    END IF;
END $$;

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (Option B - Idempotent)
DROP POLICY IF EXISTS "Users can access their own bot chunks" ON document_chunks;
DROP POLICY IF EXISTS "Service role can access all chunks" ON document_chunks;

-- Policy: Users can only access chunks from their own bots
CREATE POLICY "Users can access their own bot chunks"
ON document_chunks
FOR ALL
USING (
    bot_id IN (
        SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
);

-- Policy: Service role can access all chunks
CREATE POLICY "Service role can access all chunks"
ON document_chunks
FOR ALL
TO service_role
USING (true);

-- ============================================
-- 5. HELPER FUNCTION FOR VECTOR SEARCH
-- ============================================

-- Function to search similar embeddings
CREATE OR REPLACE FUNCTION match_embeddings(
    query_embedding vector(1536),
    match_bot_id uuid,
    match_threshold float DEFAULT 0.7,
    match_count int DEFAULT 5
)
RETURNS TABLE (
    id uuid,
    file_id uuid,
    chunk_text text,
    chunk_index int,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        document_chunks.id,
        document_chunks.file_id,
        document_chunks.chunk_text,
        document_chunks.chunk_index,
        1 - (document_chunks.embedding <=> query_embedding) AS similarity
    FROM document_chunks
    WHERE document_chunks.bot_id = match_bot_id
        AND 1 - (document_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY document_chunks.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- ============================================
-- 6. VERIFICATION QUERIES
-- ============================================

-- Check table structure
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'document_chunks'
ORDER BY ordinal_position;

-- Check indexes
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'document_chunks';

-- Check row count
SELECT COUNT(*) as total_chunks FROM document_chunks;

-- ============================================
-- 7. CLEANUP (OPTIONAL)
-- ============================================

-- If you need to start fresh, uncomment and run:
-- TRUNCATE TABLE document_chunks CASCADE;

-- ============================================
-- DONE!
-- ============================================

-- You should see:
-- ✅ document_chunks table created
-- ✅ Indexes created
-- ✅ RLS policies enabled
-- ✅ Helper function created

-- Next steps:
-- 1. Restart your Next.js backend
-- 2. Upload a test PDF
-- 3. Ask questions!
