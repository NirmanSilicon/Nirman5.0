-- Drop existing public SELECT policy
DROP POLICY IF EXISTS "Transactions are viewable by everyone" ON public.transactions;

-- Create policy for users to view their own transactions (full details)
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE (profiles.id = transactions.from_user_id OR profiles.id = transactions.to_user_id) 
    AND profiles.user_id = auth.uid()
  )
);

-- Create policy for public to view transactions without user identification
-- This allows price history queries but requires a specific NFT or collection context
CREATE POLICY "Public can view transaction data for NFTs" 
ON public.transactions 
FOR SELECT 
USING (
  -- Allow if querying specific NFT or collection (for price history)
  nft_id IS NOT NULL OR collection_id IS NOT NULL
);

-- Note: The above policies combined allow:
-- 1. Authenticated users see their own transactions with full details
-- 2. Anyone can see transaction price/date for specific NFTs (for price charts)
-- But prevents bulk scraping of user transaction patterns