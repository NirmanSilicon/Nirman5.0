import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, TrendingUp, Info } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PriceSuggestionProps {
  name: string;
  description: string;
  blockchain: string;
  traits?: { name: string; value: string }[];
  onPriceSelect: (price: number) => void;
}

interface Suggestion {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  reasoning: string;
  confidence: 'low' | 'medium' | 'high';
}

const confidenceColors = {
  low: 'bg-amber-500/20 text-amber-500 border-amber-500/30',
  medium: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
  high: 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30',
};

const blockchainSymbols: Record<string, string> = {
  ethereum: 'ETH',
  polygon: 'MATIC',
  solana: 'SOL',
  bitcoin: 'BTC',
};

export function PriceSuggestion({ name, description, blockchain, traits, onPriceSelect }: PriceSuggestionProps) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);

  const getSuggestion = async () => {
    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter an NFT name first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setSuggestion(null);

    try {
      const { data, error } = await supabase.functions.invoke('suggest-nft-price', {
        body: { name, description, blockchain, traits },
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: 'Error',
          description: data.error,
          variant: 'destructive',
        });
        return;
      }

      setSuggestion(data);
    } catch (error: any) {
      console.error('Error getting price suggestion:', error);
      toast({
        title: 'Failed to get suggestion',
        description: error.message || 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const symbol = blockchainSymbols[blockchain] || 'ETH';

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground">AI Price Suggestion</span>
        </div>

        {!suggestion ? (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Get an AI-powered price recommendation based on similar NFTs and market trends.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={getSuggestion}
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing market...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Get Price Suggestion
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Main suggestion */}
            <div className="text-center p-4 rounded-lg bg-background/50">
              <p className="text-xs text-muted-foreground mb-1">Suggested Price</p>
              <p className="text-2xl font-bold text-foreground">
                {suggestion.suggestedPrice.toFixed(4)} <span className="text-primary">{symbol}</span>
              </p>
              <Badge variant="outline" className={`mt-2 ${confidenceColors[suggestion.confidence]}`}>
                {suggestion.confidence} confidence
              </Badge>
            </div>

            {/* Price range */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.minPrice)}
                className="flex-1 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
              >
                <p className="text-xs text-muted-foreground">Min</p>
                <p className="font-medium text-sm">{suggestion.minPrice.toFixed(4)} {symbol}</p>
              </button>
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.suggestedPrice)}
                className="flex-1 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors text-center border border-primary/20"
              >
                <p className="text-xs text-primary">Recommended</p>
                <p className="font-medium text-sm text-primary">{suggestion.suggestedPrice.toFixed(4)} {symbol}</p>
              </button>
              <button
                type="button"
                onClick={() => onPriceSelect(suggestion.maxPrice)}
                className="flex-1 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors text-center"
              >
                <p className="text-xs text-muted-foreground">Max</p>
                <p className="font-medium text-sm">{suggestion.maxPrice.toFixed(4)} {symbol}</p>
              </button>
            </div>

            {/* Reasoning */}
            <div className="p-3 rounded-lg bg-muted/30">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground">{suggestion.reasoning}</p>
              </div>
            </div>

            {/* Get new suggestion */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={getSuggestion}
              disabled={loading}
              className="w-full text-xs"
            >
              {loading ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3 mr-1" />
              )}
              Get new suggestion
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
