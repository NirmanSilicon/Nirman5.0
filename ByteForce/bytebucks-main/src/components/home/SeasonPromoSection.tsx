import { useState } from 'react';
import { Zap, Wallet, Trophy, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const walletOptions = [
  {
    id: 'metamask',
    name: 'MetaMask',
    icon: '🦊',
    description: 'Connect to MetaMask wallet',
    type: 'evm',
  },
  {
    id: 'walletconnect',
    name: 'WalletConnect',
    icon: '🔗',
    description: 'Scan with WalletConnect',
    type: 'evm',
  },
  {
    id: 'phantom',
    name: 'Phantom',
    icon: '👻',
    description: 'Connect to Phantom wallet',
    type: 'solana',
  },
];

export function SeasonPromoSection() {
  const [showModal, setShowModal] = useState(false);
  const {
    address,
    isConnected,
    isConnecting,
    connect,
    phantomAddress,
    connectPhantom,
  } = useWallet();

  const isAnyConnected = isConnected || !!phantomAddress;

  const handleConnect = async (walletId: string) => {
    try {
      if (walletId === 'phantom') {
        await connectPhantom();
      } else {
        connect();
      }
      setShowModal(false);
      toast({
        title: "Wallet connected",
        description: "You're now ready to earn $CRYON rewards!",
      });
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Season 1 is Live</span>
          </div>

          {/* Main headline */}
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground mb-6">
            Architect Your Future
          </h2>

          {/* Main description */}
          <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
            Every trade earns you <span className="text-primary font-semibold">$CRYON</span> and a powerful governance vote. 
            Hunt for high-value <span className="text-accent font-semibold">Boosted Quests</span> for exponential gains.
          </p>

          {/* Reward pool highlight */}
          <div className="glass rounded-2xl p-6 mb-8 border border-primary/20">
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/20">
                  <Trophy className="w-6 h-6 text-primary" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Reward Pool</p>
                  <p className="text-2xl font-bold text-foreground">10,000 $CRYON</p>
                </div>
              </div>
              <div className="hidden md:block w-px h-12 bg-border" />
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-accent/20">
                  <Calendar className="w-6 h-6 text-accent" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Distribution Date</p>
                  <p className="text-2xl font-bold text-foreground">December 6th</p>
                </div>
              </div>
            </div>
          </div>

          {/* Call to action */}
          <div className="space-y-4 mb-8">
            <p className="text-muted-foreground">
              <span className="text-foreground font-medium">Connect all your wallets</span> now to unify your activity and immediately climb the leaderboard.
            </p>
            <p className="text-muted-foreground">
              Your final rank guarantees your substantial <span className="text-primary font-semibold">$CRYON airdrop</span>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {isAnyConnected ? (
              <Button size="lg" className="gap-2 px-8" variant="secondary">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-1" />
                Wallet Connected
              </Button>
            ) : (
              <Button 
                size="lg" 
                className="gap-2 px-8"
                onClick={() => setShowModal(true)}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-5 h-5" />
                    Connect Wallets
                  </>
                )}
              </Button>
            )}
            <Button variant="outline" size="lg" className="gap-2 px-8">
              <Zap className="w-5 h-5" />
              View Quests
            </Button>
          </div>

          {/* Bottom tagline */}
          <p className="mt-8 text-sm text-muted-foreground">
            Log in and begin building your stake today.
          </p>
        </div>
      </div>

      {/* Wallet Connection Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Connect your wallets to start earning $CRYON rewards
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {walletOptions.map((wallet) => (
              <button
                key={wallet.id}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-xl border border-border',
                  'hover:border-primary/50 hover:bg-muted/50 transition-colors'
                )}
                onClick={() => handleConnect(wallet.id)}
              >
                <span className="text-2xl">{wallet.icon}</span>
                <div className="text-left">
                  <p className="font-medium">{wallet.name}</p>
                  <p className="text-sm text-muted-foreground">{wallet.description}</p>
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
