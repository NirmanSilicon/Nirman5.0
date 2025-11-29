import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import {
  Wallet,
  LogOut,
  Copy,
  ExternalLink,
  ChevronDown,
  Loader2,
} from 'lucide-react';
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

export function WalletButton() {
  const {
    address,
    isConnected,
    isConnecting,
    balance,
    connect,
    disconnect,
    phantomAddress,
    connectPhantom,
    disconnectPhantom,
  } = useWallet();
  
  const [showModal, setShowModal] = useState(false);

  const connectedAddress = address || phantomAddress;
  const isAnyConnected = isConnected || !!phantomAddress;

  const handleConnect = async (walletId: string) => {
    try {
      if (walletId === 'phantom') {
        await connectPhantom();
      } else {
        connect();
      }
      setShowModal(false);
    } catch (error: any) {
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnect();
    disconnectPhantom();
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const copyAddress = () => {
    if (connectedAddress) {
      navigator.clipboard.writeText(connectedAddress);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (isAnyConnected && connectedAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="elegant-outline" size="sm" className="rounded-full">
            <div className="w-2 h-2 rounded-full bg-success mr-2" />
            {formatAddress(connectedAddress)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-3 py-2">
            <p className="text-sm font-medium">Connected Wallet</p>
            <p className="text-xs text-muted-foreground truncate">{connectedAddress}</p>
            {balance && (
              <p className="text-xs text-primary mt-1">{balance}</p>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={copyAddress}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Address
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => window.open(`https://etherscan.io/address/${connectedAddress}`, '_blank')}>
            <ExternalLink className="w-4 h-4 mr-2" />
            View on Explorer
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <Button
        variant="elegant-outline"
        size="sm"
        className="rounded-full"
        onClick={() => setShowModal(true)}
        disabled={isConnecting}
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4 mr-2" />
            Connect
          </>
        )}
      </Button>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Wallet</DialogTitle>
            <DialogDescription>
              Choose a wallet to connect to ByteBucks
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
    </>
  );
}
