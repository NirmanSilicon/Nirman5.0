-- Create notifications table
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb DEFAULT '{}',
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
ON public.notifications FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = notifications.user_id AND profiles.user_id = auth.uid()
));

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
ON public.notifications FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = notifications.user_id AND profiles.user_id = auth.uid()
));

-- System can insert notifications
CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
ON public.notifications FOR DELETE
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = notifications.user_id AND profiles.user_id = auth.uid()
));

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create watchlists table for price alerts
CREATE TABLE public.watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  nft_id uuid REFERENCES public.nfts(id) ON DELETE CASCADE,
  collection_id uuid REFERENCES public.collections(id) ON DELETE CASCADE,
  target_price numeric,
  alert_type text DEFAULT 'price_drop',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT watchlist_has_target CHECK (nft_id IS NOT NULL OR collection_id IS NOT NULL)
);

-- Enable RLS
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;

-- Users can view their own watchlists
CREATE POLICY "Users can view their own watchlists"
ON public.watchlists FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = watchlists.user_id AND profiles.user_id = auth.uid()
));

-- Users can insert their own watchlists
CREATE POLICY "Users can insert their own watchlists"
ON public.watchlists FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = watchlists.user_id AND profiles.user_id = auth.uid()
));

-- Users can update their own watchlists
CREATE POLICY "Users can update their own watchlists"
ON public.watchlists FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = watchlists.user_id AND profiles.user_id = auth.uid()
));

-- Users can delete their own watchlists
CREATE POLICY "Users can delete their own watchlists"
ON public.watchlists FOR DELETE
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.id = watchlists.user_id AND profiles.user_id = auth.uid()
));

-- Add notification preferences to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS notification_preferences jsonb DEFAULT '{
  "bid_received": true,
  "bid_outbid": true,
  "sale": true,
  "price_alert": true,
  "wishlist_update": true,
  "follow": true,
  "like": true
}'::jsonb;