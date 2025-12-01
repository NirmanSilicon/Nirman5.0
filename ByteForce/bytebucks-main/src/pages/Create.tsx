import { useState } from 'react';
import { Upload, Image, Music, Video, Box, Info, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { blockchainConfig } from '@/data/mockData';
import { cn } from '@/lib/utils';

type MediaType = 'image' | 'video' | 'audio' | '3d';
type SellFormat = 'fixed' | 'auction' | 'offers';

const Create = () => {
  const [mediaType, setMediaType] = useState<MediaType>('image');
  const [blockchain, setBlockchain] = useState<keyof typeof blockchainConfig>('ethereum');
  const [sellFormat, setSellFormat] = useState<SellFormat>('fixed');
  const [dragActive, setDragActive] = useState(false);

  const mediaTypes = [
    { id: 'image', label: 'Image', icon: Image, formats: 'JPG, PNG, GIF, SVG, WEBP' },
    { id: 'video', label: 'Video', icon: Video, formats: 'MP4, WEBM' },
    { id: 'audio', label: 'Audio', icon: Music, formats: 'MP3, WAV, OGG' },
    { id: '3d', label: '3D Model', icon: Box, formats: 'GLB, GLTF' },
  ];

  const sellFormats = [
    { id: 'fixed', label: 'Fixed Price', description: 'Sell at a set price' },
    { id: 'auction', label: 'Timed Auction', description: 'Highest bidder wins' },
    { id: 'offers', label: 'Open for Offers', description: 'Accept the best offer' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Create <span className="text-gradient">New NFT</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Mint your digital art and list it on the marketplace
            </p>
          </div>

          <div className="space-y-8">
            {/* Media Type Selection */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Choose Media Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setMediaType(type.id as MediaType)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-center',
                      mediaType === type.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <type.icon className={cn(
                      'w-8 h-8 mx-auto mb-2',
                      mediaType === type.id ? 'text-primary' : 'text-muted-foreground'
                    )} />
                    <p className="font-medium">{type.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{type.formats}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Upload File</h2>
              <div
                className={cn(
                  'border-2 border-dashed rounded-xl p-12 text-center transition-all',
                  dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                )}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => setDragActive(false)}
              >
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium mb-2">Drag and drop your file here</p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <Button variant="outline">Choose File</Button>
                <p className="text-xs text-muted-foreground mt-4">Max file size: 100MB</p>
              </div>
            </div>

            {/* NFT Details */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">NFT Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    placeholder="Enter NFT name"
                    className="w-full bg-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    placeholder="Describe your NFT..."
                    rows={4}
                    className="w-full bg-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Collection</label>
                    <div className="relative">
                      <select className="w-full bg-muted rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Select collection</option>
                        <option>Create new collection</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <div className="relative">
                      <select className="w-full bg-muted rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary">
                        <option>Art</option>
                        <option>Collectibles</option>
                        <option>Gaming</option>
                        <option>Music</option>
                        <option>Photography</option>
                        <option>Sports</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Selection */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Blockchain</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(blockchainConfig).map(([key, chain]) => (
                  <button
                    key={key}
                    onClick={() => setBlockchain(key as keyof typeof blockchainConfig)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-center',
                      blockchain === key
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <div
                      className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center font-bold"
                      style={{ backgroundColor: `${chain.color}30`, color: chain.color }}
                    >
                      {chain.symbol[0]}
                    </div>
                    <p className="font-medium">{chain.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="glass rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Pricing & Selling Format</h2>
              
              {/* Sell Format */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {sellFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSellFormat(format.id as SellFormat)}
                    className={cn(
                      'p-4 rounded-xl border-2 transition-all text-left',
                      sellFormat === format.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    )}
                  >
                    <p className="font-medium">{format.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{format.description}</p>
                  </button>
                ))}
              </div>

              {/* Price Input */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {sellFormat === 'auction' ? 'Starting Price' : 'Price'} *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="0.00"
                      className="w-full bg-muted rounded-lg px-4 py-3 pr-16 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                      {blockchainConfig[blockchain].symbol}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Royalty Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="10"
                      max="50"
                      className="w-full bg-muted rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Earn on every resale (max 50%)
                  </p>
                </div>
              </div>

              {/* Supply */}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Supply / Editions</label>
                <input
                  type="number"
                  placeholder="1"
                  min="1"
                  className="w-full md:w-48 bg-muted rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Number of copies to mint (1 for unique NFT)
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl" className="flex-1">
                Create NFT
              </Button>
              <Button variant="outline" size="xl">
                Save as Draft
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By creating this NFT, you agree to our Terms of Service and confirm this content doesn't violate any copyrights.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Create;
