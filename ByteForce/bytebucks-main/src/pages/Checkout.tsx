import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { 
  CreditCard, 
  Wallet, 
  Shield, 
  Check, 
  Loader2,
  ArrowLeft,
  Gift,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

const paymentMethods = [
  { id: 'wallet', name: 'Crypto Wallet', icon: Wallet, description: 'Pay with MetaMask, Coinbase, or WalletConnect' },
  { id: 'card', name: 'Credit Card', icon: CreditCard, description: 'Pay with Visa, Mastercard, or AMEX' },
];

const blockchainSymbols: Record<string, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  solana: 'SOL',
  bitcoin: 'BTC',
};

interface UserReward {
  completed_transactions: number;
  reward_unlocked: boolean;
  reward_used: boolean;
  discount_percentage: number;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { items, totalPrice, clearCart, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [profileId, setProfileId] = useState<string | null>(null);
  const [userReward, setUserReward] = useState<UserReward | null>(null);
  const [applyDiscount, setApplyDiscount] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Check for success/canceled from Stripe redirect
  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const orderIdParam = searchParams.get('order_id');

    if (success === 'true' && orderIdParam) {
      setOrderId(orderIdParam);
      setOrderComplete(true);
      clearCart();
      toast({
        title: "Payment successful!",
        description: "Your NFTs have been transferred to your account",
      });
    } else if (canceled === 'true') {
      toast({
        title: "Payment canceled",
        description: "Your order was not completed",
        variant: "destructive",
      });
    }
  }, [searchParams, clearCart]);

  // Fetch profile and reward status
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) return;

      setUserEmail(user.email || null);

      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);

        // Get reward status
        const { data: reward } = await supabase
          .from('user_rewards')
          .select('*')
          .eq('user_id', profile.id)
          .single();

        if (reward) {
          setUserReward({
            completed_transactions: reward.completed_transactions || 0,
            reward_unlocked: reward.reward_unlocked || false,
            reward_used: reward.reward_used || false,
            discount_percentage: reward.discount_percentage || 20,
          });
          // Auto-apply discount if available and not used
          if (reward.reward_unlocked && !reward.reward_used) {
            setApplyDiscount(true);
          }
        } else {
          // Create reward record if doesn't exist
          await supabase
            .from('user_rewards')
            .insert({ user_id: profile.id });
          setUserReward({
            completed_transactions: 0,
            reward_unlocked: false,
            reward_used: false,
            discount_percentage: 20,
          });
        }
      }
    };

    fetchUserData();
  }, [user?.id, user?.email]);

  // Calculate prices
  const hasDiscount = applyDiscount && userReward?.reward_unlocked && !userReward?.reward_used;
  const discountPercent = userReward?.discount_percentage || 20;
  const discountAmount = hasDiscount ? totalPrice * (discountPercent / 100) : 0;
  const finalTotal = totalPrice - discountAmount;

  // Progress toward next reward
  const transactionsToReward = 4;
  const currentProgress = userReward?.completed_transactions || 0;
  const progressPercent = Math.min((currentProgress / transactionsToReward) * 100, 100);
  const transactionsRemaining = Math.max(transactionsToReward - currentProgress, 0);

  const sendOrderEmail = async (orderId: string, finalTotal: number, discountAmount: number) => {
    if (!userEmail) return;

    try {
      const emailItems = items.map(item => ({
        name: item.nft?.name || 'NFT',
        price: item.nft?.price || 0,
        blockchain: item.nft?.blockchain || 'ethereum',
        image_url: item.nft?.image_url,
      }));

      await supabase.functions.invoke('send-order-email', {
        body: {
          email: userEmail,
          orderId,
          items: emailItems,
          totalAmount: finalTotal,
          discountApplied: discountAmount,
          paymentMethod: selectedPayment,
        },
      });
      console.log('Order confirmation email sent');
    } catch (error) {
      console.error('Failed to send order email:', error);
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some items to your cart first",
        variant: "destructive",
      });
      return;
    }

    if (!profileId) {
      toast({
        title: "Profile not found",
        description: "Please try again",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order first
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: profileId,
          total_amount: finalTotal,
          total_amount_usd: finalTotal * 2000,
          discount_applied: discountAmount,
          payment_method: selectedPayment,
          status: selectedPayment === 'card' ? 'pending' : 'completed',
          blockchain: items[0]?.nft?.blockchain as any || 'ethereum',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // If card payment, redirect to Stripe
      if (selectedPayment === 'card') {
        const stripeItems = items.map(item => ({
          name: item.nft?.name || 'NFT',
          price: item.nft?.price || 0,
          blockchain: item.nft?.blockchain || 'ethereum',
          image_url: item.nft?.image_url,
        }));

        const { data: stripeData, error: stripeError } = await supabase.functions.invoke('create-payment', {
          body: {
            items: stripeItems,
            orderId: order.id,
            totalAmount: finalTotal,
            discountApplied: discountAmount,
          },
        });

        if (stripeError) throw stripeError;

        if (stripeData?.url) {
          // Create order items before redirecting
          const orderItems = items.map(item => ({
            order_id: order.id,
            nft_id: item.nft_id,
            quantity: item.quantity,
            price_at_purchase: item.nft?.price || 0,
            price_usd_at_purchase: (item.nft?.price || 0) * 2000,
          }));

          await supabase.from('order_items').insert(orderItems);

          // Redirect to Stripe checkout
          window.location.href = stripeData.url;
          return;
        }
      }

      // For wallet payments, complete the order immediately
      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        nft_id: item.nft_id,
        quantity: item.quantity,
        price_at_purchase: item.nft?.price || 0,
        price_usd_at_purchase: (item.nft?.price || 0) * 2000,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Create transactions for each item
      const transactions = items.map(item => ({
        transaction_type: 'sale' as const,
        nft_id: item.nft_id,
        from_user_id: null,
        to_user_id: profileId,
        price: item.nft?.price || 0,
        price_usd: (item.nft?.price || 0) * 2000,
        blockchain: (item.nft?.blockchain as any) || 'ethereum',
      }));

      await supabase
        .from('transactions')
        .insert(transactions);

      // Update NFT ownership
      for (const item of items) {
        await supabase
          .from('nfts')
          .update({ 
            owner_id: profileId,
            is_listed: false 
          })
          .eq('id', item.nft_id);
      }

      // Update user rewards
      const newCompletedTransactions = (userReward?.completed_transactions || 0) + 1;
      const newRewardUnlocked = newCompletedTransactions >= transactionsToReward;
      
      const rewardUpdate: any = {
        completed_transactions: newCompletedTransactions,
        updated_at: new Date().toISOString(),
      };

      if (hasDiscount) {
        rewardUpdate.reward_used = true;
        rewardUpdate.completed_transactions = 0;
        rewardUpdate.reward_unlocked = false;
      } else if (newRewardUnlocked && !userReward?.reward_unlocked) {
        rewardUpdate.reward_unlocked = true;
        rewardUpdate.reward_used = false;
        rewardUpdate.last_reward_date = new Date().toISOString();
      }

      await supabase
        .from('user_rewards')
        .update(rewardUpdate)
        .eq('user_id', profileId);

      // Send order confirmation email
      await sendOrderEmail(order.id, finalTotal, discountAmount);

      // Clear cart
      await clearCart();

      setOrderId(order.id);
      setOrderComplete(true);

      toast({
        title: "Order placed successfully!",
        description: "Your NFTs have been transferred to your account",
      });

      if (newRewardUnlocked && !userReward?.reward_unlocked && !hasDiscount) {
        setTimeout(() => {
          toast({
            title: "🎉 Reward Unlocked!",
            description: `You've earned ${discountPercent}% off your next purchase!`,
          });
        }, 2000);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 max-w-2xl">
            <Card className="text-center py-12">
              <CardContent>
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-success" />
                </div>
                <h1 className="text-3xl font-bold mb-4">Order Complete!</h1>
                <p className="text-muted-foreground mb-4">
                  Your order #{orderId?.slice(0, 8)} has been placed successfully.
                  Your NFTs have been transferred to your account.
                </p>
                {userEmail && (
                  <p className="text-sm text-muted-foreground mb-6">
                    A confirmation email has been sent to {userEmail}.
                  </p>
                )}
                <div className="flex gap-4 justify-center">
                  <Button variant="outline" onClick={() => navigate('/orders')}>
                    View Orders
                  </Button>
                  <Button onClick={() => navigate('/explore')}>
                    Continue Shopping
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-12">
          <div className="container mx-auto px-4 flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

          {items.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">Your cart is empty</p>
                <Button onClick={() => navigate('/explore')}>
                  Browse NFTs
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Payment Method & Items */}
              <div className="lg:col-span-2 space-y-6">
                {/* Reward Progress */}
                {userReward && !userReward.reward_unlocked && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Gift className="w-5 h-5 text-primary" />
                        <span className="font-medium">Reward Progress</span>
                      </div>
                      <Progress value={progressPercent} className="h-2 mb-2" />
                      <p className="text-sm text-muted-foreground">
                        {transactionsRemaining > 0 
                          ? `${transactionsRemaining} more transaction${transactionsRemaining > 1 ? 's' : ''} to unlock ${discountPercent}% off!`
                          : 'Reward unlocked on your next purchase!'}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Payment Method */}
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Method</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={selectedPayment}
                      onValueChange={setSelectedPayment}
                      className="space-y-4"
                    >
                      {paymentMethods.map((method) => (
                        <div
                          key={method.id}
                          className={cn(
                            'flex items-center space-x-4 rounded-lg border p-4 cursor-pointer transition-colors',
                            selectedPayment === method.id
                              ? 'border-primary bg-primary/5'
                              : 'border-border hover:border-primary/50'
                          )}
                          onClick={() => setSelectedPayment(method.id)}
                        >
                          <RadioGroupItem value={method.id} id={method.id} />
                          <method.icon className="w-6 h-6 text-muted-foreground" />
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="font-medium cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {method.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Order Items ({items.length})</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                          <img
                            src={item.nft?.image_url || '/placeholder.svg'}
                            alt={item.nft?.name || 'NFT'}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.nft?.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {item.nft?.blockchain}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {item.nft?.price || 0} {item.nft?.blockchain && blockchainSymbols[item.nft.blockchain]}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal ({items.length} item{items.length > 1 ? 's' : ''})</span>
                      <span>{totalPrice.toFixed(4)}</span>
                    </div>
                    
                    {/* Discount Toggle */}
                    {userReward?.reward_unlocked && !userReward?.reward_used && (
                      <div 
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
                          applyDiscount 
                            ? 'border-success bg-success/10' 
                            : 'border-border hover:border-success/50'
                        )}
                        onClick={() => setApplyDiscount(!applyDiscount)}
                      >
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-success" />
                          <span className="text-sm font-medium">Apply {discountPercent}% Reward</span>
                        </div>
                        <div className={cn(
                          'w-5 h-5 rounded-full border-2 flex items-center justify-center',
                          applyDiscount ? 'border-success bg-success' : 'border-muted-foreground'
                        )}>
                          {applyDiscount && <Check className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    )}

                    {hasDiscount && (
                      <div className="flex justify-between text-sm text-success">
                        <span className="flex items-center gap-1">
                          <Gift className="w-4 h-4" />
                          Reward Discount ({discountPercent}%)
                        </span>
                        <span>-{discountAmount.toFixed(4)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Network Fee</span>
                      <span className="text-muted-foreground">~0.001</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{finalTotal.toFixed(4)}</span>
                    </div>

                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || items.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : selectedPayment === 'card' ? (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Pay with Stripe
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      <span>Secure checkout powered by {selectedPayment === 'card' ? 'Stripe' : 'blockchain'}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
