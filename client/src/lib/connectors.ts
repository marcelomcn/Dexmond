import { http, createConfig } from 'wagmi';
import { mainnet, polygon, arbitrum } from 'wagmi/chains';
import { injected, walletConnect, coinbaseWallet } from 'wagmi/connectors';

// Define supported chains
export const chains = [mainnet, polygon, arbitrum];

// Create connectors
export const metamaskConnector = injected();

export const walletConnectConnector = walletConnect({
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Replace with your WalletConnect project ID
});

export const coinbaseWalletConnector = coinbaseWallet({
  appName: 'Dexmond',
});

// Create wagmi config
export const config = createConfig({
  chains,
  connectors: [
    metamaskConnector,
    walletConnectConnector,
    coinbaseWalletConnector,
  ],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [arbitrum.id]: http(),
  },
});

// Export connectors in format compatible with your existing code
export const connectors = {
  MetaMask: metamaskConnector,
  WalletConnect: walletConnectConnector,
  'Coinbase Wallet': coinbaseWalletConnector,
};