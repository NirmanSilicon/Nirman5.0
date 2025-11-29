-- Create follows table for social following
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create comments table for NFT comments
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nft_id UUID NOT NULL REFERENCES public.nfts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bids table for auction functionality
CREATE TABLE public.bids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nft_id UUID NOT NULL REFERENCES public.nfts(id) ON DELETE CASCADE,
  bidder_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount NUMERIC NOT NULL,
  amount_usd NUMERIC,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'outbid', 'won', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create comment_likes table for tracking likes on comments
CREATE TABLE public.comment_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.comments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(comment_id, user_id)
);

-- Add followers/following counts to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS followers_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS following_count INTEGER DEFAULT 0;

-- Add auction fields to NFTs table
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS is_auction BOOLEAN DEFAULT false;
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS starting_bid NUMERIC;
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS current_bid NUMERIC;
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS highest_bidder_id UUID REFERENCES public.profiles(id);
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS reserve_price NUMERIC;
ALTER TABLE public.nfts ADD COLUMN IF NOT EXISTS bid_increment NUMERIC DEFAULT 0.01;

-- Enable RLS on new tables
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comment_likes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = follows.follower_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = follows.follower_id AND profiles.user_id = auth.uid()));

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON public.comments FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.user_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.user_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comments.user_id AND profiles.user_id = auth.uid()));

-- RLS Policies for bids
CREATE POLICY "Bids are viewable by everyone" ON public.bids FOR SELECT USING (true);
CREATE POLICY "Authenticated users can place bids" ON public.bids FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = bids.bidder_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can cancel their own bids" ON public.bids FOR UPDATE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = bids.bidder_id AND profiles.user_id = auth.uid()));

-- RLS Policies for comment_likes
CREATE POLICY "Comment likes are viewable by everyone" ON public.comment_likes FOR SELECT USING (true);
CREATE POLICY "Users can like comments" ON public.comment_likes FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comment_likes.user_id AND profiles.user_id = auth.uid()));
CREATE POLICY "Users can unlike comments" ON public.comment_likes FOR DELETE 
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = comment_likes.user_id AND profiles.user_id = auth.uid()));

-- Function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE profiles SET following_count = following_count + 1 WHERE id = NEW.follower_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET followers_count = GREATEST(followers_count - 1, 0) WHERE id = OLD.following_id;
    UPDATE profiles SET following_count = GREATEST(following_count - 1, 0) WHERE id = OLD.follower_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for follower counts
CREATE TRIGGER update_follower_counts_trigger
AFTER INSERT OR DELETE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.update_follower_counts();

-- Function to update comment likes count
CREATE OR REPLACE FUNCTION public.update_comment_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET likes_count = likes_count + 1 WHERE id = NEW.comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = OLD.comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for comment likes count
CREATE TRIGGER update_comment_likes_count_trigger
AFTER INSERT OR DELETE ON public.comment_likes
FOR EACH ROW EXECUTE FUNCTION public.update_comment_likes_count();

-- Function to update NFT current bid when new bid is placed
CREATE OR REPLACE FUNCTION public.update_nft_highest_bid()
RETURNS TRIGGER AS $$
BEGIN
  -- Mark previous highest bid as outbid
  UPDATE bids SET status = 'outbid' 
  WHERE nft_id = NEW.nft_id AND status = 'active' AND id != NEW.id;
  
  -- Update NFT with new highest bid
  UPDATE nfts SET 
    current_bid = NEW.amount,
    highest_bidder_id = NEW.bidder_id
  WHERE id = NEW.nft_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for updating highest bid
CREATE TRIGGER update_nft_highest_bid_trigger
AFTER INSERT ON public.bids
FOR EACH ROW EXECUTE FUNCTION public.update_nft_highest_bid();

-- Create indexes for performance
CREATE INDEX idx_follows_follower ON public.follows(follower_id);
CREATE INDEX idx_follows_following ON public.follows(following_id);
CREATE INDEX idx_comments_nft ON public.comments(nft_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);
CREATE INDEX idx_bids_nft ON public.bids(nft_id);
CREATE INDEX idx_bids_bidder ON public.bids(bidder_id);
CREATE INDEX idx_comment_likes_comment ON public.comment_likes(comment_id);