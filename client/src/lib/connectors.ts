
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { CoinbaseWalletConnector } from '@web3-react/coinbase-wallet-connector';

// Supported chain IDs
const supportedChainIds = [1, 56, 137, 42161, 10, 43114]; // Ethereum, BSC, Polygon, Arbitrum, Optimism, Avalanche

export const injected = new InjectedConnector({
  supportedChainIds,
});

// Use environment variables for RPC endpoints if available
const getRpcUrl = (chainId) => {
  const defaultRpcs = {
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161', // Public Infura endpoint
    56: 'https://bsc-dataseed.binance.org',
    137: 'https://polygon-rpc.com',
    42161: 'https://arb1.arbitrum.io/rpc',
    10: 'https://mainnet.optimism.io',
    43114: 'https://api.avax.network/ext/bc/C/rpc'
  };
  
  return defaultRpcs[chainId] || defaultRpcs[1];
};

// Create RPC mapping for WalletConnect
const rpcUrls = {};
supportedChainIds.forEach(chainId => {
  rpcUrls[chainId] = getRpcUrl(chainId);
});

export const walletconnect = new WalletConnectConnector({
  rpc: rpcUrls,
  qrcode: true,
  bridge: 'https://bridge.walletconnect.org',
  pollingInterval: 12000,
});

export const coinbaseWallet = new CoinbaseWalletConnector({
  url: getRpcUrl(1),
  appName: 'Dexmond',
  supportedChainIds,
});

export const connectors = {
  MetaMask: injected,
  WalletConnect: walletconnect,
  'Coinbase Wallet': coinbaseWallet,
};

// Helper function to get connector by name
export const getConnectorByName = (name) => {
  return connectors[name] || injected;
};
