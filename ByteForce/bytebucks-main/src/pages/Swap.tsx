// NEW: src/pages/Swap.tsx
import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowDown } from 'lucide-react';

export default function Swap() {
  const [fromAmount, setFromAmount] = useState('1.0');
  const [toAmount, setToAmount] = useState('3500.0');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');

  const handleSwap = () => {
    // In a real app, this would trigger a swap transaction
    alert(`Swapping ${fromAmount} ${fromToken} for ${toAmount} ${toToken}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Swap Tokens</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Exchange tokens directly within the platform.
              </p>
            </div>

            <Card className="glass">
              <CardContent className="p-6 space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <label className="text-xs text-muted-foreground">From</label>
                  <div className="flex items-center gap-4 mt-1">
                    <Input 
                      type="number" 
                      value={fromAmount} 
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                    <span className="text-lg font-semibold">{fromToken}</span>
                  </div>
                </div>
                
                <div className="flex justify-center -my-2 z-10">
                    <Button variant="ghost" size="icon" className="bg-background rounded-full">
                        <ArrowDown className="w-5 h-5"/>
                    </Button>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <label className="text-xs text-muted-foreground">To</label>
                  <div className="flex items-center gap-4 mt-1">
                    <Input 
                      type="number" 
                      value={toAmount}
                      readOnly
                      className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0"
                    />
                    <span className="text-lg font-semibold">{toToken}</span>
                  </div>
                </div>

                <Button size="lg" className="w-full" onClick={handleSwap}>
                  Connect Wallet to Swap
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
