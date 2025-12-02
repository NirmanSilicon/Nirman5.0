-- Migration script to update embedding dimensions from 768 to 1536
-- WARNING: This will delete all existing embeddings!
-- Run this only if you have existing data with 768-dimensional embeddings

-- Step 1: Backup existing data (optional but recommended)
-- CREATE TABLE document_chunks_backup AS SELECT * FROM document_chunks;

-- Step 2: Drop existing embedding column and index
DROP INDEX IF EXISTS document_chunks_embedding_idx;
ALTER TABLE document_chunks DROP COLUMN IF EXISTS embedding;

-- Step 3: Add new embedding column with 1536 dimensions
ALTER TABLE document_chunks ADD COLUMN embedding vector(1536);

-- Step 4: Create index for vector similarity search
CREATE INDEX document_chunks_embedding_idx 
ON document_chunks 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Step 5: Verify the change
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'document_chunks' AND column_name = 'embedding';

-- Note: After running this migration, you MUST re-process all PDFs
-- to generate new 1536-dimensional embeddings using OpenRouter
