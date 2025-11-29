import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

// Mapping from our blockchain names to CoinGecko API IDs
const COINGECKO_ID_MAP: { [key: string]: string } = {
  ethereum: 'ethereum',
  polygon: 'matic-network',
  solana: 'solana',
  bitcoin: 'bitcoin',
};

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
    priceUsd?: number;
    priceInr?: number;
  };
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalPrice: number;
  totalPriceUsd: number;
  totalPriceInr: number;
  isLoading: boolean;
  addToCart: (nftId: string) => Promise<void>;
  removeFromCart: (nftId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isInCart: (nftId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to fetch prices and update items
const fetchAndSetFiatPrices = async (items: CartItem[]): Promise<CartItem[]> => {
  const cryptoIds = [
    ...new Set(
      items
        .map((item) => item.nft?.blockchain && COINGECKO_ID_MAP[item.nft.blockchain.toLowerCase()])
        .filter(Boolean)
    ),
  ] as string[];

  if (cryptoIds.length === 0) {
    return items; // No crypto items to price
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoIds.join(',')}&vs_currencies=usd,inr`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch fiat prices');
    }
    const rates = await response.json();

    return items.map((item) => {
      const cryptoId = item.nft?.blockchain && COINGECKO_ID_MAP[item.nft.blockchain.toLowerCase()];
      if (cryptoId && rates[cryptoId] && item.nft?.price) {
        return {
          ...item,
          nft: {
            ...item.nft,
            priceUsd: item.nft.price * rates[cryptoId].usd,
            priceInr: item.nft.price * rates[cryptoId].inr,
          },
        };
      }
      return item;
    });
  } catch (error) {
    console.error("Error fetching fiat prices:", error);
    toast({
        title: "Price Conversion Failed",
        description: "Could not fetch live USD/INR prices. Displaying crypto value only.",
        variant: "destructive"
    });
    return items; // Return original items on failure
  }
};


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
        setItems([]);
      } else if (data) {
        const itemsWithNfts = data.map(item => ({
          ...item,
          nft: item.nfts as any
        }));
        const itemsWithFiat = await fetchAndSetFiatPrices(itemsWithNfts);
        setItems(itemsWithFiat);
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
      setIsLoading(false);
    } else {
      // Fetch updated cart
      const { data: newData, error: fetchError } = await supabase
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

      if (fetchError) {
        console.error('Error fetching cart after add:', fetchError);
      } else if (newData) {
        const itemsWithNfts = newData.map(item => ({
          ...item,
          nft: item.nfts as any
        }));
        const itemsWithFiat = await fetchAndSetFiatPrices(itemsWithNfts);
        setItems(itemsWithFiat);
        toast({
          title: "Added to cart",
          description: "Item has been added to your cart",
        });
      }
      setIsLoading(false);
    }
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
  const totalPriceUsd = items.reduce((sum, item) => sum + (item.nft?.priceUsd || 0) * item.quantity, 0);
  const totalPriceInr = items.reduce((sum, item) => sum + (item.nft?.priceInr || 0) * item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      itemCount,
      totalPrice,
      totalPriceUsd,
      totalPriceInr,
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
