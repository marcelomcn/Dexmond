import { Address } from 'viem';

export interface Token {
  symbol: string;
  name: string;
  address: Address;
  decimals: number;
  chainId: number;
  logoURI?: string;
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
  {
    symbol: "UNI",
    name: "Uniswap",
    address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
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
    symbol: "AAVE",
    name: "Aave",
    address: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "MKR",
    name: "Maker",
    address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
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
  {
    symbol: "CRV",
    name: "Curve DAO Token",
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "COMP",
    name: "Compound",
    address: "0xc00e94Cb662C3520282E6f5717214004A7f26888",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "YFI",
    name: "yearn.finance",
    address: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "SUSHI",
    name: "SushiSwap",
    address: "0x6B3595068778DD592e39A122f4f5a5cF09C90fE2",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "GRT",
    name: "The Graph",
    address: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "BAT",
    name: "Basic Attention Token",
    address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "ENJ",
    name: "Enjin Coin",
    address: "0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "MANA",
    name: "Decentraland",
    address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "1INCH",
    name: "1inch",
    address: "0x111111111117dC0aa78b770fA6A738034120C302",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "LRC",
    name: "Loopring",
    address: "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "KNC",
    name: "Kyber Network Crystal",
    address: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "BAL",
    name: "Balancer",
    address: "0xba100000625a3754423978a60c9317c58a424e3D",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "REN",
    name: "REN",
    address: "0x408e41876cCCDC0F92210600ef50372656052a38",
    decimals: 18,
    chainId: 1,
  },
  {
    symbol: "ZRX",
    name: "0x Protocol",
    address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498",
    decimals: 18,
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
  {
    symbol: "QUICK",
    name: "QuickSwap",
    address: "0x831753DD7087CaC61aB5644b308642cc1c33Dc13",
    decimals: 18,
    chainId: 137,
  },
  // Binance Smart Chain Tokens
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
  {
    symbol: "CAKE",
    name: "PancakeSwap Token",
    address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82",
    decimals: 18,
    chainId: 56,
  },
  // Add more tokens here...
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