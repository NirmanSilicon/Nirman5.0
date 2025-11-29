import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, arbitrum, optimism } from 'wagmi/chains';

// Custom Solana-compatible config (note: RainbowKit primarily supports EVM chains)
// For Phantom/Solana, we'll handle separately

export const config = getDefaultConfig({
  appName: 'ByteBucks NFT Marketplace',
  projectId: 'bytebucks-nft-marketplace', // WalletConnect Cloud project ID
  chains: [mainnet, polygon, arbitrum, optimism],
  ssr: false,
});

// Blockchain explorer URLs
export const blockchainExplorers: Record<string, { name: string; url: string; txPath: string }> = {
  ethereum: {
    name: 'Etherscan',
    url: 'https://etherscan.io',
    txPath: '/tx/',
  },
  polygon: {
    name: 'Polygonscan',
    url: 'https://polygonscan.com',
    txPath: '/tx/',
  },
  solana: {
    name: 'Solscan',
    url: 'https://solscan.io',
    txPath: '/tx/',
  },
  bitcoin: {
    name: 'Blockchain.com',
    url: 'https://www.blockchain.com/explorer',
    txPath: '/btc/tx/',
  },
};

export const getExplorerUrl = (blockchain: string, txHash: string) => {
  const explorer = blockchainExplorers[blockchain];
  if (!explorer) return null;
  return `${explorer.url}${explorer.txPath}${txHash}`;
};
