import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface CartItem {
  id: string;
  nft_id: string;
  quantity: number;
  nft?: {
    id: string;
    name: string;
    image_url: string;
    price: number | null;
    blockchain: string | null;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (nftId: string) => Promise<void>;
  removeFromCart: (nftId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (nftId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profileId, setProfileId] = useState<string | null>(null);

  // Get profile ID for the current user
  useEffect(() => {
    const fetchProfileId = async () => {
      if (!user?.id) {
        setProfileId(null);
        setItems([]);
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setProfileId(data.id);
      }
    };

    fetchProfileId();
  }, [user?.id]);

  // Fetch cart items when profile is available
  useEffect(() => {
    const fetchCartItems = async () => {
      if (!profileId) return;

      setIsLoading(true);
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          nft_id,
          quantity,
          nfts (
            id,
            name,
            image_url,
            price,
            blockchain
          )
        `)
        .eq('user_id', profileId);

      if (error) {
        console.error('Error fetching cart:', error);
      } else if (data) {
        setItems(data.map(item => ({
          ...item,
          nft: item.nfts as any
        })));
      }
      setIsLoading(false);
    };

    fetchCartItems();
  }, [profileId]);

  const addToCart = async (nftId: string) => {
    if (!profileId) {
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase
      .from('cart_items')
      .upsert({
        user_id: profileId,
        nft_id: nftId,
        quantity: 1,
      }, {
        onConflict: 'user_id,nft_id'
      });

    if (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } else {
      // Fetch updated cart
      const { data } = await supabase
        .from('cart_items')
        .select(`
          id,
          nft_id,
          quantity,
          nfts (
            id,
            name,
            image_url,
            price,
            blockchain
          )
        `)
        .eq('user_id', profileId);

      if (data) {
        setItems(data.map(item => ({
          ...item,
          nft: item.nfts as any
        })));
      }
    }
    setIsLoading(false);
  };

  const removeFromCart = async (nftId: string) => {
    if (!profileId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', profileId)
      .eq('nft_id', nftId);

    if (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    } else {
      setItems(prev => prev.filter(item => item.nft_id !== nftId));
      toast({
        title: "Removed from cart",
        description: "Item has been removed from your cart",
      });
    }
    setIsLoading(false);
  };

  const clearCart = async () => {
    if (!profileId) return;

    setIsLoading(true);
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', profileId);

    if (error) {
      console.error('Error clearing cart:', error);
    } else {
      setItems([]);
    }
    setIsLoading(false);
  };

  const isInCart = (nftId: string) => {
    return items.some(item => item.nft_id === nftId);
  };

  const itemCount = items.length;
  const totalPrice = items.reduce((sum, item) => sum + (item.nft?.price || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      isLoading,
      addToCart,
      removeFromCart,
      clearCart,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
