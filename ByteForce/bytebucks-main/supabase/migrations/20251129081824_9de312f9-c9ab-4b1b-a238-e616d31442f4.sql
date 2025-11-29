-- Create storage bucket for NFT media
INSERT INTO storage.buckets (id, name, public)
VALUES ('nft-media', 'nft-media', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for authenticated users to upload
CREATE POLICY "Users can upload NFT media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'nft-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Create storage policy for public read access
CREATE POLICY "NFT media is publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'nft-media');

-- Create storage policy for users to delete their own files
CREATE POLICY "Users can delete their own NFT media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'nft-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);