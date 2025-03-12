
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
    1: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    56: 'https://bsc-dataseed.binance.org',
    137: 'https://polygon-rpc.com',
  },
  qrcode: true,
});

export const coinbaseWallet = new CoinbaseWalletConnector({
  url: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  appName: 'Dexmond',
});

export const connectors = {
  MetaMask: injected,
  WalletConnect: walletconnect,
  'Coinbase Wallet': coinbaseWallet,
};
