import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  mainnet,
  arbitrum,
  polygon,
  optimism,
  base,
  zora,
} from 'viem/chains';

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  throw new Error('WalletConnect Project ID is required. Please set VITE_WALLETCONNECT_PROJECT_ID in your environment.');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Dexmond',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, arbitrum, polygon, optimism, base, zora],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [zora.id]: http(),
  },
});

export const chains = wagmiConfig.chains;