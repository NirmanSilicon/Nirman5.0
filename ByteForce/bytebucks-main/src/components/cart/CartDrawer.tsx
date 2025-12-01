import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ShoppingCart, Trash2, Loader2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface CartDrawerProps {
  children?: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { items, itemCount, totalPrice, totalPriceUsd, totalPriceInr, isLoading, removeFromCart } = useCart();
  const navigate = useNavigate();

  const blockchainSymbols: Record<string, string> = {
    ethereum: 'ETH',
    polygon: 'MATIC',
    solana: 'SOL',
    bitcoin: 'BTC',
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Shopping Cart ({itemCount})
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <ShoppingCart className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">Your cart is empty</p>
            <p className="text-sm text-muted-foreground/70">Add some NFTs to get started</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4 py-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-border"
                  >
                    {item.nft?.image_url && (
                      <img
                        src={item.nft.image_url}
                        alt={item.nft?.name || 'NFT'}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.nft?.name || 'Unknown NFT'}</h4>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-semibold text-lg text-foreground">
                          {item.nft?.price || 0}{' '}
                          <span className="text-sm font-medium">
                            {item.nft?.blockchain && blockchainSymbols[item.nft.blockchain]}
                          </span>
                        </p>
                        {item.nft?.priceUsd && (
                           <p>
                             {formatCurrency(item.nft.priceUsd, 'USD')}
                           </p>
                        )}
                        {item.nft?.priceInr && (
                          <p>
                            {formatCurrency(item.nft.priceInr, 'INR')}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => removeFromCart(item.nft_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <SheetFooter className="flex-col gap-4 border-t border-border pt-4">
              <div className="w-full space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal (Crypto)</span>
                  <span className="text-xl font-bold">{totalPrice.toFixed(4)}</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal (USD)</span>
                  <span className="font-semibold">{formatCurrency(totalPriceUsd, 'USD')}</span>
                </div>
                 <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal (INR)</span>
                  <span className="font-semibold">{formatCurrency(totalPriceInr, 'INR')}</span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
