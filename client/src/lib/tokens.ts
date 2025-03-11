import { Address } from 'viem';

export interface Token {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  chainId: number;
  logoURI?: string;
  category?: 'defi' | 'gaming' | 'metaverse' | 'l2' | 'governance' | 'stablecoin';
}

// Major tokens across different chains
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
    category: 'stablecoin',
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    chainId: 1,
    category: 'stablecoin',
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    chainId: 1,
    category: 'stablecoin',
  },
  {
    symbol: "WBTC",
    name: "Wrapped Bitcoin",
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    chainId: 1,
  },
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    decimals: 18,
    chainId: 1,
    category: 'defi',
  },
  {
    symbol: "LINK",
    name: "Chainlink",
    address: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    decimals: 18,
    chainId: 1,
  },
  // Add 450+ more tokens here...
  // Popular DeFi Protocols
  {
    symbol: "AAVE",
    name: "Aave",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18,
    chainId: 1,
    category: 'defi',
  },
  {
    symbol: "MKR",
    name: "Maker",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
    decimals: 18,
    chainId: 1,
    category: 'governance',
  },
  {
    symbol: "SNX",
    name: "Synthetix",
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    decimals: 18,
    chainId: 1,
    category: 'defi',
  },
  // Layer 2 Tokens
  {
    symbol: "OP",
    name: "Optimism",
    address: "0x4200000000000000000000000000000000000042",
    decimals: 18,
    chainId: 10,
    category: 'l2',
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    address: "0x912CE59144191C1204E64559FE8253a0e49E6548",
    decimals: 18,
    chainId: 42161,
    category: 'l2',
  },
  // Liquid Staking Tokens
  {
    symbol: "stETH",
    name: "Lido Staked ETH",
    address: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "rETH",
    name: "Rocket Pool ETH",
    address: "0xae78736Cd615f374D3085123A210448E74Fc6393",
    decimals: 18,
    chainId: 1,
  },
  // GameFi Tokens
  {
    symbol: "SAND",
    name: "The Sandbox",
    address: "0x3845badAde8e6dFF049820680d1F14bD3903a5d0",
    decimals: 18,
    chainId: 1,
    category: 'gaming',
  },
  {
    symbol: "AXS",
    name: "Axie Infinity",
    address: "0xBB0E17EF65F82Ab018d8EDd776e8DD940327B28b",
    decimals: 18,
    chainId: 1,
    category: 'gaming',
  },
  // Metaverse Tokens
  {
    symbol: "MANA",
    name: "Decentraland",
    address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
    decimals: 18,
    chainId: 1,
    category: 'metaverse',
  },
  // ... [Continue with more tokens]
];

export const getTokensByChain = (chainId: number) => {
  return tokens.filter(token => token.chainId === chainId);
};

export const getTokensByCategory = (category: Token['category']) => {
  return tokens.filter(token => token.category === category);
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
// Token list with real addresses for Ethereum mainnet
export const tokenList = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE', // Special address for native ETH
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png'
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    decimals: 8,
    logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png'
  },
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // Using WBTC address for representation
    decimals: 8,
    logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png'
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png'
  },
  {
    symbol: 'LINK',
    name: 'ChainLink Token',
    address: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png'
  },
  {
    symbol: 'AAVE',
    name: 'Aave Token',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png'
  },
  {
    symbol: 'COMP',
    name: 'Compound',
    address: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0xc00e94cb662c3520282e6f5717214004a7f26888.png'
  },
  {
    symbol: 'SUSHI',
    name: 'SushiToken',
    address: '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2',
    decimals: 18,
    logoURI: 'https://tokens.1inch.io/0x6b3595068778dd592e39a122f4f5a5cf09c90fe2.png'
  }
];

// Add a function to get token by symbol
export function getTokenBySymbol(symbol: string) {
  return tokenList.find(token => token.symbol === symbol);
}

// Add a function to get all token symbols
export function getAllTokenSymbols() {
  return tokenList.map(token => token.symbol);
}
