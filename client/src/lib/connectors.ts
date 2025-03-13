
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

// Configure chains & providers
export const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base],
  [publicProvider()]
);

// Configure wallet connectors
export const { connectors } = getDefaultWallets({
  appName: 'Dexmond',
  projectId: 'YOUR_PROJECT_ID', // Replace with actual project ID if available
  chains
});

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

export default {
  chains,
  connectors,
  wagmiConfig
};
