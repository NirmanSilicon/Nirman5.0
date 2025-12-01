import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useWallet } from '@/hooks/useWallet';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Upload,
  Image,
  Plus,
  X,
  Loader2,
  Wallet,
  Sparkles,
  Info,
} from 'lucide-react';
import { PriceSuggestion } from '@/components/mint/PriceSuggestion';

interface Trait {
  name: string;
  value: string;
}

const blockchains = [
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'polygon', name: 'Polygon', symbol: 'MATIC' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
];

export default function Mint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { address, isConnected, connect, phantomAddress, connectPhantom } = useWallet();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    blockchain: 'ethereum',
    price: '',
    editions: 1,
    royaltyPercentage: 5,
  });
  const [traits, setTraits] = useState<Trait[]>([]);
  const [newTrait, setNewTrait] = useState({ name: '', value: '' });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 50MB",
          variant: "destructive",
        });
        return;
      }
      setMediaFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addTrait = () => {
    if (newTrait.name && newTrait.value) {
      setTraits([...traits, newTrait]);
      setNewTrait({ name: '', value: '' });
    }
  };

  const removeTrait = (index: number) => {
    setTraits(traits.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to mint NFTs",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    const walletConnected = formData.blockchain === 'solana' 
      ? phantomAddress 
      : isConnected && address;

    if (!walletConnected) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to mint NFTs",
        variant: "destructive",
      });
      return;
    }

    if (!mediaFile) {
      toast({
        title: "Media required",
        description: "Please upload an image or media file",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Get profile ID
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!profile) throw new Error('Profile not found');

      // Upload media to storage
      const fileExt = mediaFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('nft-media')
        .upload(fileName, mediaFile);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('nft-media')
        .getPublicUrl(fileName);

      // Create NFT record
      const { data: nft, error: nftError } = await supabase
        .from('nfts')
        .insert({
          name: formData.name,
          description: formData.description,
          image_url: publicUrl,
          blockchain: formData.blockchain as any,
          price: parseFloat(formData.price) || null,
          creator_id: profile.id,
          owner_id: profile.id,
          editions: formData.editions,
          editions_available: formData.editions,
          royalty_percentage: formData.royaltyPercentage,
          traits: JSON.stringify(traits),
          is_minted: true,
          is_listed: !!formData.price,
          sale_type: 'fixed' as const,
        })
        .select()
        .single();

      if (nftError) throw nftError;

      // Create mint transaction
      await supabase.from('transactions').insert({
        nft_id: nft.id,
        from_user_id: profile.id,
        to_user_id: profile.id,
        transaction_type: 'mint',
        blockchain: formData.blockchain as any,
        gas_fee: 0.001, // Simulated gas fee
        transaction_hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        block_number: Math.floor(Math.random() * 1000000) + 18000000,
      });

      toast({
        title: "NFT Minted Successfully!",
        description: `${formData.name} has been created and added to your collection`,
      });

      navigate(`/nft/${nft.id}`);
    } catch (error: any) {
      console.error('Minting error:', error);
      toast({
        title: "Minting failed",
        description: error.message || "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWalletStatus = () => {
    if (formData.blockchain === 'solana') {
      return phantomAddress 
        ? { connected: true, address: phantomAddress }
        : { connected: false, address: null };
    }
    return { connected: isConnected, address };
  };

  const walletStatus = getWalletStatus();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Mint Your <span className="text-gradient">NFT</span>
            </h1>
            <p className="text-muted-foreground">
              Create and mint your digital artwork on the blockchain
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Column - Media Upload */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Image className="w-5 h-5" />
                      Media Upload
                    </CardTitle>
                    <CardDescription>
                      Supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3. Max 50MB.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <label
                      className={cn(
                        'flex flex-col items-center justify-center w-full aspect-square rounded-xl border-2 border-dashed cursor-pointer transition-colors',
                        mediaPreview
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      {mediaPreview ? (
                        <div className="relative w-full h-full">
                          <img
                            src={mediaPreview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={(e) => {
                              e.preventDefault();
                              setMediaFile(null);
                              setMediaPreview(null);
                            }}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-4 p-8 text-center">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Drop your file here</p>
                            <p className="text-sm text-muted-foreground">
                              or click to browse
                            </p>
                          </div>
                        </div>
                      )}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*,video/*,audio/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </CardContent>
                </Card>

                {/* Wallet Connection */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Wallet Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {walletStatus.connected ? (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20">
                        <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-success">Connected</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {walletStatus.address?.slice(0, 8)}...{walletStatus.address?.slice(-6)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          if (formData.blockchain === 'solana') {
                            connectPhantom();
                          } else {
                            connect();
                          }
                        }}
                      >
                        <Wallet className="w-4 h-4 mr-2" />
                        Connect {formData.blockchain === 'solana' ? 'Phantom' : 'Wallet'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Form Fields */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      NFT Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter NFT name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your NFT..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={4}
                      />
                    </div>

                    {/* Blockchain */}
                    <div className="space-y-2">
                      <Label>Blockchain *</Label>
                      <Select
                        value={formData.blockchain}
                        onValueChange={(value) => setFormData({ ...formData, blockchain: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {blockchains.map((chain) => (
                            <SelectItem key={chain.id} value={chain.id}>
                              {chain.name} ({chain.symbol})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price */}
                    <div className="space-y-2">
                      <Label htmlFor="price">Price (optional)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.0001"
                        placeholder="Enter price"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to mint without listing for sale
                      </p>
                    </div>

                    {/* AI Price Suggestion */}
                    <PriceSuggestion
                      name={formData.name}
                      description={formData.description}
                      blockchain={formData.blockchain}
                      traits={traits}
                      onPriceSelect={(price) => setFormData({ ...formData, price: price.toString() })}
                    />

                    {/* Editions */}
                    <div className="space-y-2">
                      <Label>Editions: {formData.editions}</Label>
                      <Slider
                        value={[formData.editions]}
                        onValueChange={([value]) => setFormData({ ...formData, editions: value })}
                        min={1}
                        max={100}
                        step={1}
                      />
                      <p className="text-xs text-muted-foreground">
                        Number of copies to mint (1 for unique)
                      </p>
                    </div>

                    {/* Royalty */}
                    <div className="space-y-2">
                      <Label>Royalty: {formData.royaltyPercentage}%</Label>
                      <Slider
                        value={[formData.royaltyPercentage]}
                        onValueChange={([value]) => setFormData({ ...formData, royaltyPercentage: value })}
                        min={0}
                        max={25}
                        step={0.5}
                      />
                      <p className="text-xs text-muted-foreground">
                        Percentage you receive from secondary sales
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Traits */}
                <Card>
                  <CardHeader>
                    <CardTitle>Traits / Attributes</CardTitle>
                    <CardDescription>
                      Add properties to make your NFT unique
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Existing Traits */}
                    {traits.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {traits.map((trait, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 px-3 py-1 rounded-lg bg-primary/10 border border-primary/20"
                          >
                            <span className="text-sm">
                              <span className="text-muted-foreground">{trait.name}:</span>{' '}
                              <span className="font-medium">{trait.value}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => removeTrait(index)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Trait */}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Property name"
                        value={newTrait.name}
                        onChange={(e) => setNewTrait({ ...newTrait, name: e.target.value })}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={newTrait.value}
                        onChange={(e) => setNewTrait({ ...newTrait, value: e.target.value })}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="icon" onClick={addTrait}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting || !mediaFile || !formData.name || !walletStatus.connected}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Minting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Mint NFT
                    </>
                  )}
                </Button>

                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p>
                    By minting, you confirm that you own or have the rights to this content
                    and agree to pay any applicable gas fees.
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

