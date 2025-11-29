// NEW: src/pages/Rewards.tsx
import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Gift, Target, CheckCircle, Award } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';

export default function Rewards() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profileId, setProfileId] = useState<string | null>(null);
  const [completedTxCount, setCompletedTxCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?.id) {
        setCompletedTxCount(0);
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        const { count, error } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id)
          .eq('status', 'completed');
        
        if (error) {
          console.error("Error fetching transaction count:", error);
          setCompletedTxCount(0);
        } else {
          setCompletedTxCount(count ?? 0);
        }
      } else {
        setCompletedTxCount(0);
      }
    };

    fetchUserData();
  }, [user?.id]);

  const rewardStatus = useMemo(() => {
    if (completedTxCount === null) {
      return {
        title: 'Loading your rewards...',
        description: 'Please wait while we fetch your rewards status.',
        progress: 0,
        transactionsToNextReward: 4
      };
    }

    if (completedTxCount === 0) {
      return {
        title: 'First Transaction Offer!',
        description: 'You are eligible for a 5% discount (up to $50) on your first order. This will be applied automatically at checkout.',
        progress: 0,
        transactionsToNextReward: 4
      };
    }

    if (completedTxCount >= 4) {
      return {
        title: 'Loyalty Reward Unlocked!',
        description: 'You get a 5% discount (up to $25) on every order. This will be applied automatically at checkout.',
        progress: 100,
        transactionsToNextReward: 0
      };
    }
    
    const remaining = 4 - completedTxCount;
    return {
      title: 'Almost There!',
      description: `Complete ${remaining} more transaction${remaining > 1 ? 's' : ''} to unlock your 5% loyalty discount.`,
      progress: (completedTxCount / 4) * 100,
      transactionsToNextReward: remaining
    };
  }, [completedTxCount]);

  const isLoading = completedTxCount === null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Your Rewards</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                We reward our loyal collectors. See your current status and offers below.
              </p>
            </div>

            {isLoading ? (
              <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-6 w-1/2" />
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <Gift className="w-8 h-8 text-primary" />
                    <span>Reward Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold">{rewardStatus.title}</h3>
                    <p className="text-muted-foreground mt-1">{rewardStatus.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center font-mono text-sm">
                      <span>Progress</span>
                      <span>{completedTxCount ?? 0} / 4 Transactions</span>
                    </div>
                    <Progress value={rewardStatus.progress} className="h-3" />
                  </div>

                  <div className="text-center pt-4">
                    <Button onClick={() => navigate('/explore')}>
                      Start Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="mt-10 grid md:grid-cols-2 gap-8">
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    First Transaction Offer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>As a new member, you get <strong>5% off</strong> your first purchase, capped at a <strong>$50 discount</strong>. This is our way of saying welcome to the ByteBucks community!</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-6 h-6 text-yellow-500" />
                    Loyalty Program
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>After completing 4 transactions, you unlock our loyalty reward: <strong>5% off</strong> every subsequent order, capped at a <strong>$25 discount</strong>. Keep collecting to keep saving!</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
