-- Create enum types
CREATE TYPE public.blockchain_type AS ENUM ('ethereum', 'polygon', 'solana', 'bitcoin');
CREATE TYPE public.user_type AS ENUM ('creator', 'collector');
CREATE TYPE public.sale_type AS ENUM ('fixed', 'auction', 'offers');
CREATE TYPE public.transaction_type AS ENUM ('mint', 'list', 'delist', 'sale', 'transfer', 'offer_accepted', 'instant_sell', 'royalty_payout');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  user_type user_type DEFAULT 'collector',
  wallet_address TEXT,
  is_verified BOOLEAN DEFAULT false,
  total_volume DECIMAL(20, 8) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_roles table (separate for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Create collections table
CREATE TABLE public.collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  banner_url TEXT,
  blockchain blockchain_type DEFAULT 'ethereum',
  is_verified BOOLEAN DEFAULT false,
  royalty_percentage DECIMAL(5, 2) DEFAULT 0,
  floor_price DECIMAL(20, 8) DEFAULT 0,
  total_volume DECIMAL(20, 8) DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  unique_owners INTEGER DEFAULT 0,
  total_supply INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create NFTs table
CREATE TABLE public.nfts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  creator_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  token_id TEXT,
  blockchain blockchain_type DEFAULT 'ethereum',
  price DECIMAL(20, 8),
  price_usd DECIMAL(20, 2),
  floor_price DECIMAL(20, 8),
  sale_type sale_type DEFAULT 'fixed',
  is_listed BOOLEAN DEFAULT false,
  is_minted BOOLEAN DEFAULT false,
  editions INTEGER DEFAULT 1,
  editions_available INTEGER DEFAULT 1,
  royalty_percentage DECIMAL(5, 2) DEFAULT 0,
  rarity_score DECIMAL(10, 4),
  traits JSONB DEFAULT '[]'::jsonb,
  badges TEXT[] DEFAULT '{}',
  launch_date TIMESTAMP WITH TIME ZONE,
  auction_end_date TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nft_id UUID REFERENCES public.nfts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE (user_id, nft_id)
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID REFERENCES public.nfts(id) ON DELETE SET NULL,
  collection_id UUID REFERENCES public.collections(id) ON DELETE SET NULL,
  from_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  to_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  transaction_type transaction_type NOT NULL,
  price DECIMAL(20, 8),
  price_usd DECIMAL(20, 2),
  blockchain blockchain_type,
  transaction_hash TEXT,
  block_number BIGINT,
  gas_fee DECIMAL(20, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create offers table
CREATE TABLE public.offers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID REFERENCES public.nfts(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  price DECIMAL(20, 8) NOT NULL,
  price_usd DECIMAL(20, 2),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'accepted', 'expired', 'cancelled')),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create user_rewards table
CREATE TABLE public.user_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  completed_transactions INTEGER DEFAULT 0,
  reward_unlocked BOOLEAN DEFAULT false,
  reward_used BOOLEAN DEFAULT false,
  discount_percentage DECIMAL(5, 2) DEFAULT 20,
  last_reward_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create price_history table for charts
CREATE TABLE public.price_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nft_id UUID REFERENCES public.nfts(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  price DECIMAL(20, 8) NOT NULL,
  price_usd DECIMAL(20, 2),
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nfts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.price_history ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Collections policies
CREATE POLICY "Collections are viewable by everyone" ON public.collections
  FOR SELECT USING (true);

CREATE POLICY "Creators can insert collections" ON public.collections
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Creators can update their collections" ON public.collections
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_id AND user_id = auth.uid())
  );

-- NFTs policies
CREATE POLICY "NFTs are viewable by everyone" ON public.nfts
  FOR SELECT USING (true);

CREATE POLICY "Creators can insert NFTs" ON public.nfts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_id AND user_id = auth.uid())
  );

CREATE POLICY "Owners can update their NFTs" ON public.nfts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = owner_id AND user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = creator_id AND user_id = auth.uid())
  );

-- Wishlists policies
CREATE POLICY "Users can view their own wishlist" ON public.wishlists
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can add to their wishlist" ON public.wishlists
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND profiles.user_id = auth.uid())
  );

CREATE POLICY "Users can remove from their wishlist" ON public.wishlists
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND profiles.user_id = auth.uid())
  );

-- Transactions policies
CREATE POLICY "Transactions are viewable by everyone" ON public.transactions
  FOR SELECT USING (true);

CREATE POLICY "System can insert transactions" ON public.transactions
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Offers policies
CREATE POLICY "Offers are viewable by everyone" ON public.offers
  FOR SELECT USING (true);

CREATE POLICY "Users can create offers" ON public.offers
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = bidder_id AND user_id = auth.uid())
  );

CREATE POLICY "Bidders can update their offers" ON public.offers
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = bidder_id AND user_id = auth.uid())
  );

-- User rewards policies
CREATE POLICY "Users can view their own rewards" ON public.user_rewards
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND profiles.user_id = auth.uid())
  );

CREATE POLICY "System can manage rewards" ON public.user_rewards
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Price history policies
CREATE POLICY "Price history is viewable by everyone" ON public.price_history
  FOR SELECT USING (true);

CREATE POLICY "System can insert price history" ON public.price_history
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'username', SPLIT_PART(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'username', SPLIT_PART(NEW.email, '@', 1))
  );
  
  -- Also create a rewards record for the new user
  INSERT INTO public.user_rewards (user_id)
  SELECT id FROM public.profiles WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$;

-- Trigger for automatic profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nfts_updated_at
  BEFORE UPDATE ON public.nfts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_offers_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_rewards_updated_at
  BEFORE UPDATE ON public.user_rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_nfts_collection_id ON public.nfts(collection_id);
CREATE INDEX idx_nfts_creator_id ON public.nfts(creator_id);
CREATE INDEX idx_nfts_owner_id ON public.nfts(owner_id);
CREATE INDEX idx_nfts_blockchain ON public.nfts(blockchain);
CREATE INDEX idx_nfts_is_listed ON public.nfts(is_listed);
CREATE INDEX idx_collections_creator_id ON public.collections(creator_id);
CREATE INDEX idx_collections_blockchain ON public.collections(blockchain);
CREATE INDEX idx_wishlists_user_id ON public.wishlists(user_id);
CREATE INDEX idx_transactions_nft_id ON public.transactions(nft_id);
CREATE INDEX idx_transactions_created_at ON public.transactions(created_at);
CREATE INDEX idx_offers_nft_id ON public.offers(nft_id);
CREATE INDEX idx_price_history_nft_id ON public.price_history(nft_id);
CREATE INDEX idx_price_history_recorded_at ON public.price_history(recorded_at);