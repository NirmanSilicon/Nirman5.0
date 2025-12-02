-- Setup Chat History Table
-- Run this in Supabase SQL Editor

-- 1. Create chat_history table
CREATE TABLE IF NOT EXISTS chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- We can link to auth.users if needed, but keeping it flexible for now
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    message TEXT NOT NULL,
    command TEXT, -- To store command type if any (e.g., 'summarize', 'quiz')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS chat_history_bot_id_idx ON chat_history(bot_id);
CREATE INDEX IF NOT EXISTS chat_history_user_id_idx ON chat_history(user_id);
CREATE INDEX IF NOT EXISTS chat_history_created_at_idx ON chat_history(created_at DESC);

-- 3. Enable RLS
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies

-- Policy: Users can view their own bot's chat history
CREATE POLICY "Users can view own bot chat history"
ON chat_history
FOR SELECT
USING (
    bot_id IN (
        SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
);

-- Policy: Users can insert messages into their own bot's chat history
-- (Though usually insertion happens via service role in backend, this is good for client-side if ever needed)
CREATE POLICY "Users can insert own bot chat history"
ON chat_history
FOR INSERT
WITH CHECK (
    bot_id IN (
        SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
);

-- Policy: Users can delete their own bot's chat history
CREATE POLICY "Users can delete own bot chat history"
ON chat_history
FOR DELETE
USING (
    bot_id IN (
        SELECT id FROM chatbots WHERE user_id = auth.uid()
    )
);

-- Policy: Service role has full access
CREATE POLICY "Service role has full access to chat_history"
ON chat_history
FOR ALL
TO service_role
USING (true);

-- 5. Verification
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'chat_history';
