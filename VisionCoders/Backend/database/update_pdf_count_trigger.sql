-- Function to update bot PDF count
CREATE OR REPLACE FUNCTION update_bot_pdf_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the chatbot's pdf_count based on actual PDF documents
  UPDATE chatbots
  SET pdf_count = (
    SELECT COUNT(*) 
    FROM pdf_documents 
    WHERE bot_id = COALESCE(NEW.bot_id, OLD.bot_id)
  )
  WHERE id = COALESCE(NEW.bot_id, OLD.bot_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update PDF count on INSERT
CREATE TRIGGER update_pdf_count_on_insert
AFTER INSERT ON pdf_documents
FOR EACH ROW
EXECUTE FUNCTION update_bot_pdf_count();

-- Trigger to auto-update PDF count on DELETE
CREATE TRIGGER update_pdf_count_on_delete
AFTER DELETE ON pdf_documents
FOR EACH ROW
EXECUTE FUNCTION update_bot_pdf_count();

-- Optional: One-time update to fix existing bots
UPDATE chatbots
SET pdf_count = (
  SELECT COUNT(*) 
  FROM pdf_documents 
  WHERE pdf_documents.bot_id = chatbots.id
);
