// NEW: src/pages/Tokens.tsx
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

// Mock data, in a real app this would come from a wallet connection hook (e.g., useBalance from wagmi)
const tokenData = [
  { name: 'Ethereum', symbol: 'ETH', balance: '1.25', value: '$4,375.00' },
  { name: 'Polygon', symbol: 'MATIC', balance: '5,678.50', value: '$4,826.72' },
  { name: 'ByteBucks Token', symbol: 'BBT', balance: '10,000', value: '$100.00' },
];

export default function Tokens() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Your Tokens</h1>
              <p className="mt-4 text-muted-foreground md:text-xl">
                Overview of your connected wallet's token balances.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-6 h-6 text-primary" />
                  <span>Token Balances</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokenData.map((token) => (
                    <div key={token.symbol} className="flex justify-between items-center p-4 rounded-lg bg-muted/50">
                      <div>
                        <p className="font-semibold">{token.name} ({token.symbol})</p>
                        <p className="text-sm text-muted-foreground">Balance</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{token.balance} {token.symbol}</p>
                        <p className="text-sm text-muted-foreground">{token.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
