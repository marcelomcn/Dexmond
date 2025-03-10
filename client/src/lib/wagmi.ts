import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { http } from 'viem';
import {
  mainnet,
  polygon,
  bsc,
} from 'viem/chains';

export const wagmiConfig = getDefaultConfig({
  appName: 'Dexmond',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID!,
  chains: [mainnet, polygon, bsc],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [bsc.id]: http(),
  },
});

export const chains = wagmiConfig.chains;