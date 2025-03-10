import { Address } from 'viem';

export interface Token {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

// Popular tokens across different chains
export const tokens: Token[] = [
  // Ethereum Mainnet Tokens
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "WETH",
    name: "Wrapped Ethereum",
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    chainId: 1,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: 1,
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    chainId: 1,
  },
  // Polygon Tokens
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
    chainId: 137,
  },
  {
    symbol: "WMATIC",
    name: "Wrapped Matic",
    address: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
    decimals: 18,
    chainId: 137,
  },
  // BSC Tokens
  {
    symbol: "BNB",
    name: "Binance Coin",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    chainId: 56,
  },
  {
    symbol: "WBNB",
    name: "Wrapped BNB",
    address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    decimals: 18,
    chainId: 56,
  },
  // Popular DeFi Tokens
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "AAVE",
    name: "Aave",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "SNX",
    name: "Synthetix",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    decimals: 18,
    chainId: 1,
  },
];

export const getTokensByChain = (chainId: number) => {
  return tokens.filter(token => token.chainId === chainId);
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const addCustomToken = async (
  address: string, 
  chainId: number
): Promise<Token | null> => {
  try {
    if (!isValidAddress(address)) {
      throw new Error('Invalid token address');
    }

    // In production, we would fetch token metadata from the blockchain
    // For now, return a placeholder custom token
    return {
      symbol: "CUSTOM",
      name: "Custom Token",
      address: address as Address,
      decimals: 18,
      chainId: chainId,
    };
  } catch (error) {
    console.error("Error adding custom token:", error);
    return null;
  }
};
