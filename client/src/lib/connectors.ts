import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { config } from '@/lib/wagmi';

// Configure wallet connectors
export const { connectors } = getDefaultWallets({
  appName: 'Dexmond',
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '',
});

export const chains = [mainnet, polygon, optimism, arbitrum, base];

export default {
  connectors,
  chains,
  config
};