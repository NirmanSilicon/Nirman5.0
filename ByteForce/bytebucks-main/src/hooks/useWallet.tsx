import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { toast } from '@/hooks/use-toast';

interface WalletContextType {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  balance: string | null;
  chainId: number | null;
  connect: () => void;
  disconnect: () => void;
  phantomAddress: string | null;
  connectPhantom: () => Promise<void>;
  disconnectPhantom: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chain } = useAccount();
  const { connect: wagmiConnect, connectors, isPending } = useConnect();
  const { disconnect: wagmiDisconnect } = useDisconnect();
  const { data: balanceData } = useBalance({ address });
  
  // Phantom (Solana) wallet state
  const [phantomAddress, setPhantomAddress] = useState<string | null>(null);

  // Check for existing Phantom connection on mount
  useEffect(() => {
    const checkPhantomConnection = async () => {
      try {
        const { solana } = window as any;
        if (solana?.isPhantom) {
          const response = await solana.connect({ onlyIfTrusted: true });
          setPhantomAddress(response.publicKey.toString());
        }
      } catch (error) {
        // User hasn't previously connected
      }
    };
    checkPhantomConnection();
  }, []);

  const connect = () => {
    // Try to connect with injected (MetaMask) first
    const injectedConnector = connectors.find(c => c.id === 'injected');
    if (injectedConnector) {
      wagmiConnect({ connector: injectedConnector });
    } else if (connectors.length > 0) {
      wagmiConnect({ connector: connectors[0] });
    }
  };

  const disconnect = () => {
    wagmiDisconnect();
    disconnectPhantom();
  };

  const connectPhantom = async () => {
    try {
      const { solana } = window as any;
      if (!solana?.isPhantom) {
        toast({
          title: "Phantom not found",
          description: "Please install Phantom wallet extension",
          variant: "destructive",
        });
        window.open('https://phantom.app/', '_blank');
        return;
      }

      const response = await solana.connect();
      setPhantomAddress(response.publicKey.toString());
      toast({
        title: "Wallet connected",
        description: `Connected to Phantom: ${response.publicKey.toString().slice(0, 8)}...`,
      });
    } catch (error: any) {
      console.error('Phantom connection error:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect to Phantom",
        variant: "destructive",
      });
    }
  };

  const disconnectPhantom = () => {
    try {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        solana.disconnect();
      }
      setPhantomAddress(null);
    } catch (error) {
      console.error('Phantom disconnect error:', error);
    }
  };

  const balance = balanceData ? 
    `${parseFloat(balanceData.formatted).toFixed(4)} ${balanceData.symbol}` : 
    null;

  return (
    <WalletContext.Provider value={{
      address: address || null,
      isConnected,
      isConnecting: isPending,
      balance,
      chainId: chain?.id || null,
      connect,
      disconnect,
      phantomAddress,
      connectPhantom,
      disconnectPhantom,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
