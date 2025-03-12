import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { CoinbaseWalletConnector } from '@web3-react/coinbase-wallet-connector';

// Supported chain IDs
const supportedChainIds = [1, 56, 137]; // Ethereum, BSC, Polygon

export const injected = new InjectedConnector({
  supportedChainIds,
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    1: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
    56: 'https://bsc-dataseed.binance.org',
    137: 'https://polygon-rpc.com',
  },
  qrcode: true,
});

export const coinbaseWallet = new CoinbaseWalletConnector({
  url: 'https://eth-mainnet.g.alchemy.com/v2/your-api-key',
  appName: 'Dexmond',
});

export const connectors = {
  MetaMask: injected,
  WalletConnect: walletconnect,
  'Coinbase Wallet': coinbaseWallet,
};
