// Mock data for ByteBucks NFT Marketplace

export type Blockchain = 'ethereum' | 'polygon' | 'solana' | 'bitcoin';

export type Badge = 'verified' | 'trending' | 'limited' | 'top-seller' | 'top-pack' | 'lucky-buy' | 'viral-meme' | 'new';

export type NFTCategory = 'art' | 'collectibles' | 'gaming' | 'music' | 'photography' | 'sports' | 'memecoin' | 'bitcoin-ordinals';

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  verified: boolean;
  totalSales: number;
  followers: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  image: string;
  banner?: string;
  description: string;
  creator: Creator;
  blockchain: Blockchain;
  floorPrice: number;
  volume24h: number;
  volume7d: number;
  volumeChange24h: number;
  volumeChange7d: number;
  totalSupply: number;
  uniqueOwners: number;
  category: NFTCategory;
  badges: Badge[];
  verified: boolean;
}

export interface NFT {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  priceUSD: number;
  priceINR: number;
  blockchain: Blockchain;
  collection: Collection;
  creator: Creator;
  owner?: Creator;
  category: NFTCategory;
  badges: Badge[];
  rarity?: string;
  traits?: { name: string; value: string; rarity: number }[];
  editions?: number;
  editionsAvailable?: number;
  launchDate?: Date;
  isLaunched: boolean;
  likes: number;
  views: number;
  priceHistory: { date: string; price: number }[];
  floorPrice: number;
  floorPriceChange24h: number;
  volume24h: number;
  volumeChange24h: number;
  lastSale?: number;
  offers: { price: number; from: string; timestamp: Date; status: 'active' | 'expired' | 'accepted' | 'cancelled' }[];
  isWishlisted?: boolean;
}

export interface SearchResult {
  type: 'nft' | 'collection' | 'user' | 'bitcoin-nft' | 'memecoin-nft';
  id: string;
  name: string;
  image: string;
  subtitle?: string;
  verified?: boolean;
}

// Mock Creators
export const mockCreators: Creator[] = [
  {
    id: 'creator-1',
    username: 'cryptoartist',
    displayName: 'CryptoArtist',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    verified: true,
    totalSales: 2450,
    followers: 125000,
  },
  {
    id: 'creator-2',
    username: 'pixelmaster',
    displayName: 'PixelMaster',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    verified: true,
    totalSales: 1890,
    followers: 89000,
  },
  {
    id: 'creator-3',
    username: 'neonwaves',
    displayName: 'NeonWaves',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    verified: false,
    totalSales: 567,
    followers: 23000,
  },
  {
    id: 'creator-4',
    username: 'memekingz',
    displayName: 'MemeKingz',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
    verified: true,
    totalSales: 3200,
    followers: 450000,
  },
];

// Mock Collections
export const mockCollections: Collection[] = [
  {
    id: 'col-1',
    name: 'Cyber Apes Elite',
    slug: 'cyber-apes-elite',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=400&fit=crop',
    banner: 'https://images.unsplash.com/photo-1634017839464-5c339bbe3c6c?w=1200&h=400&fit=crop',
    description: 'The most exclusive cyberpunk ape collection on the blockchain',
    creator: mockCreators[0],
    blockchain: 'ethereum',
    floorPrice: 2.5,
    volume24h: 450,
    volume7d: 2800,
    volumeChange24h: 12.5,
    volumeChange7d: 34.2,
    totalSupply: 10000,
    uniqueOwners: 4500,
    category: 'collectibles',
    badges: ['verified', 'trending', 'top-seller'],
    verified: true,
  },
  {
    id: 'col-2',
    name: 'Bitcoin Punks',
    slug: 'bitcoin-punks',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=400&h=400&fit=crop',
    description: 'Original pixel art ordinals on Bitcoin',
    creator: mockCreators[1],
    blockchain: 'bitcoin',
    floorPrice: 0.15,
    volume24h: 89,
    volume7d: 560,
    volumeChange24h: 28.3,
    volumeChange7d: 156.7,
    totalSupply: 5000,
    uniqueOwners: 2100,
    category: 'bitcoin-ordinals',
    badges: ['verified', 'new', 'lucky-buy'],
    verified: true,
  },
  {
    id: 'col-3',
    name: 'Doge Universe',
    slug: 'doge-universe',
    image: 'https://images.unsplash.com/photo-1636622433525-f59dbbfb6e9d?w=400&h=400&fit=crop',
    description: 'Much wow, very NFT. The ultimate Doge meme collection',
    creator: mockCreators[3],
    blockchain: 'polygon',
    floorPrice: 0.08,
    volume24h: 234,
    volume7d: 1200,
    volumeChange24h: 45.2,
    volumeChange7d: 89.1,
    totalSupply: 20000,
    uniqueOwners: 8900,
    category: 'memecoin',
    badges: ['viral-meme', 'trending'],
    verified: true,
  },
  {
    id: 'col-4',
    name: 'Solana Dreamscapes',
    slug: 'solana-dreamscapes',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=400&h=400&fit=crop',
    description: 'Surreal digital landscapes on Solana',
    creator: mockCreators[2],
    blockchain: 'solana',
    floorPrice: 12,
    volume24h: 678,
    volume7d: 4500,
    volumeChange24h: -5.2,
    volumeChange7d: 22.8,
    totalSupply: 3000,
    uniqueOwners: 1200,
    category: 'art',
    badges: ['verified', 'limited'],
    verified: true,
  },
];

// Mock NFTs
export const mockNFTs: NFT[] = [
  {
    id: 'nft-1',
    name: 'Cyber Ape #4521',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&h=600&fit=crop',
    description: 'A rare cyberpunk ape with golden visor and neon accessories',
    price: 3.2,
    priceUSD: 6400,
    priceINR: 534400,
    blockchain: 'ethereum',
    collection: mockCollections[0],
    creator: mockCreators[0],
    category: 'collectibles',
    badges: ['verified', 'trending'],
    rarity: 'Legendary',
    traits: [
      { name: 'Background', value: 'Neon City', rarity: 5 },
      { name: 'Eyes', value: 'Golden Visor', rarity: 2 },
      { name: 'Fur', value: 'Chrome', rarity: 8 },
    ],
    editions: 1,
    isLaunched: true,
    likes: 1245,
    views: 15600,
    priceHistory: [
      { date: '2024-01-01', price: 2.1 },
      { date: '2024-01-15', price: 2.5 },
      { date: '2024-02-01', price: 2.8 },
      { date: '2024-02-15', price: 3.2 },
    ],
    floorPrice: 2.5,
    floorPriceChange24h: 8.5,
    volume24h: 450,
    volumeChange24h: 12.5,
    lastSale: 3.0,
    offers: [
      { price: 2.9, from: 'pixelmaster', timestamp: new Date(), status: 'active' },
      { price: 2.7, from: 'neonwaves', timestamp: new Date(Date.now() - 86400000), status: 'expired' },
    ],
    isWishlisted: false,
  },
  {
    id: 'nft-2',
    name: 'Bitcoin Punk #0042',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?w=600&h=600&fit=crop',
    description: 'OG Bitcoin ordinal with rare alien trait',
    price: 0.25,
    priceUSD: 16250,
    priceINR: 1356875,
    blockchain: 'bitcoin',
    collection: mockCollections[1],
    creator: mockCreators[1],
    category: 'bitcoin-ordinals',
    badges: ['verified', 'lucky-buy', 'new'],
    rarity: 'Ultra Rare',
    isLaunched: true,
    likes: 3456,
    views: 45000,
    priceHistory: [
      { date: '2024-01-01', price: 0.08 },
      { date: '2024-01-15', price: 0.12 },
      { date: '2024-02-01', price: 0.18 },
      { date: '2024-02-15', price: 0.25 },
    ],
    floorPrice: 0.15,
    floorPriceChange24h: 28.3,
    volume24h: 89,
    volumeChange24h: 28.3,
    offers: [],
    isWishlisted: true,
  },
  {
    id: 'nft-3',
    name: 'Doge to the Moon #777',
    image: 'https://images.unsplash.com/photo-1636622433525-f59dbbfb6e9d?w=600&h=600&fit=crop',
    description: 'Such moon, very rocket. Legendary doge NFT',
    price: 0.15,
    priceUSD: 150,
    priceINR: 12525,
    blockchain: 'polygon',
    collection: mockCollections[2],
    creator: mockCreators[3],
    category: 'memecoin',
    badges: ['viral-meme', 'trending', 'top-seller'],
    rarity: 'Epic',
    isLaunched: true,
    likes: 8900,
    views: 120000,
    priceHistory: [
      { date: '2024-01-01', price: 0.05 },
      { date: '2024-02-01', price: 0.15 },
    ],
    floorPrice: 0.08,
    floorPriceChange24h: 45.2,
    volume24h: 234,
    volumeChange24h: 45.2,
    offers: [],
    isWishlisted: false,
  },
  {
    id: 'nft-4',
    name: 'Ethereal Dreams #12',
    image: 'https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=600&h=600&fit=crop',
    description: 'A breathtaking surreal landscape from the Dreamscapes collection',
    price: 18,
    priceUSD: 1980,
    priceINR: 165330,
    blockchain: 'solana',
    collection: mockCollections[3],
    creator: mockCreators[2],
    category: 'art',
    badges: ['verified', 'limited'],
    rarity: 'Rare',
    editions: 10,
    editionsAvailable: 3,
    isLaunched: true,
    likes: 567,
    views: 8900,
    priceHistory: [],
    floorPrice: 12,
    floorPriceChange24h: -5.2,
    volume24h: 678,
    volumeChange24h: -5.2,
    offers: [],
    isWishlisted: false,
  },
  {
    id: 'nft-5',
    name: 'Genesis Block #001',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=600&fit=crop',
    description: 'The first in a legendary Bitcoin ordinal series - launching soon',
    price: 0.5,
    priceUSD: 32500,
    priceINR: 2714375,
    blockchain: 'bitcoin',
    collection: mockCollections[1],
    creator: mockCreators[1],
    category: 'bitcoin-ordinals',
    badges: ['verified', 'limited', 'new'],
    rarity: 'Genesis',
    launchDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    isLaunched: false,
    likes: 12000,
    views: 89000,
    priceHistory: [],
    floorPrice: 0.15,
    floorPriceChange24h: 0,
    volume24h: 0,
    volumeChange24h: 0,
    offers: [],
    isWishlisted: false,
  },
  {
    id: 'nft-6',
    name: 'Pepe Rare #420',
    image: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?w=600&h=600&fit=crop',
    description: 'Ultra rare Pepe with diamond hands trait',
    price: 0.25,
    priceUSD: 250,
    priceINR: 20875,
    blockchain: 'ethereum',
    collection: mockCollections[2],
    creator: mockCreators[3],
    category: 'memecoin',
    badges: ['viral-meme', 'lucky-buy'],
    rarity: 'Ultra Rare',
    launchDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    isLaunched: false,
    likes: 5600,
    views: 34000,
    priceHistory: [],
    floorPrice: 0.08,
    floorPriceChange24h: 0,
    volume24h: 0,
    volumeChange24h: 0,
    offers: [],
    isWishlisted: true,
  },
];

// Blockchain icons/colors mapping
export const blockchainConfig: Record<Blockchain, { color: string; symbol: string; name: string }> = {
  ethereum: { color: '#627EEA', symbol: 'ETH', name: 'Ethereum' },
  polygon: { color: '#8247E5', symbol: 'MATIC', name: 'Polygon' },
  solana: { color: '#14F195', symbol: 'SOL', name: 'Solana' },
  bitcoin: { color: '#F7931A', symbol: 'BTC', name: 'Bitcoin' },
};

// Badge config
export const badgeConfig: Record<Badge, { label: string; className: string }> = {
  verified: { label: 'Verified', className: 'badge-verified' },
  trending: { label: 'Trending', className: 'badge-trending' },
  limited: { label: 'Limited Edition', className: 'badge-limited' },
  'top-seller': { label: 'Top Seller', className: 'badge-trending' },
  'top-pack': { label: 'Top Pack', className: 'badge-trending' },
  'lucky-buy': { label: 'Lucky Buy', className: 'badge-lucky' },
  'viral-meme': { label: 'Viral Meme', className: 'badge-trending' },
  new: { label: 'New', className: 'badge-limited' },
};

// Market Stats
export const marketStats = {
  totalVolume: 2450000,
  totalVolume24h: 125000,
  totalNFTs: 1250000,
  totalCollections: 15600,
  totalUsers: 890000,
  btcVolume24h: 89,
  btcVolumeChange24h: 28.3,
};
