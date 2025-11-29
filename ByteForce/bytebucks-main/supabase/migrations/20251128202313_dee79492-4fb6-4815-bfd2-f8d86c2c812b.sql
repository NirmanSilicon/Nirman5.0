-- Create cart_items table for persistent shopping cart
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  nft_id UUID NOT NULL REFERENCES public.nfts(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, nft_id)
);

-- Enable RLS on cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

-- Cart item policies
CREATE POLICY "Users can view their own cart items"
ON public.cart_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = cart_items.user_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can add to their own cart"
ON public.cart_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = cart_items.user_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can update their own cart items"
ON public.cart_items FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = cart_items.user_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can remove from their own cart"
ON public.cart_items FOR DELETE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = cart_items.user_id
  AND profiles.user_id = auth.uid()
));

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled', 'refunded')),
  total_amount NUMERIC NOT NULL DEFAULT 0,
  total_amount_usd NUMERIC,
  discount_applied NUMERIC DEFAULT 0,
  payment_method TEXT,
  transaction_hash TEXT,
  blockchain blockchain_type,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Order policies
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = orders.user_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can create their own orders"
ON public.orders FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = orders.user_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can update their own orders"
ON public.orders FOR UPDATE
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.id = orders.user_id
  AND profiles.user_id = auth.uid()
));

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  nft_id UUID NOT NULL REFERENCES public.nfts(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price_at_purchase NUMERIC NOT NULL,
  price_usd_at_purchase NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Order items policies
CREATE POLICY "Users can view their own order items"
ON public.order_items FOR SELECT
USING (EXISTS (
  SELECT 1 FROM orders
  JOIN profiles ON profiles.id = orders.user_id
  WHERE orders.id = order_items.order_id
  AND profiles.user_id = auth.uid()
));

CREATE POLICY "Users can create order items for their orders"
ON public.order_items FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM orders
  JOIN profiles ON profiles.id = orders.user_id
  WHERE orders.id = order_items.order_id
  AND profiles.user_id = auth.uid()
));

-- Add trigger for orders updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();