import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  mainnet,
  polygon,
  bsc,
} from 'viem/chains';

if (!import.meta.env.VITE_WALLETCONNECT_PROJECT_ID) {
  throw new Error('WalletConnect Project ID is required. Please set VITE_WALLETCONNECT_PROJECT_ID in your environment.');
}

export const wagmiConfig = getDefaultConfig({
  appName: 'Dexmond',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, polygon, bsc],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
});

export const chains = wagmiConfig.chains;