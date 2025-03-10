// Token list with real addresses for Ethereum mainnet
const tokenList = [
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

// Token price API endpoints
const PRICE_API_URL = 'https://api.coingecko.com/api/v3/simple/price';
const PRICE_PARAMS = 'ids=ethereum,bitcoin,usd-coin,tether,dai,wrapped-bitcoin,uniswap,chainlink,aave,compound-governance-token,sushi&vs_currencies=usd';

// Token to CoinGecko ID mapping
const tokenToCoinGeckoId = {
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'WBTC': 'wrapped-bitcoin',
  'UNI': 'uniswap',
  'LINK': 'chainlink',
  'AAVE': 'aave',
  'COMP': 'compound-governance-token',
  'SUSHI': 'sushi'
};

// Find token by symbol
function findTokenBySymbol(symbol) {
  return tokenList.find(token => token.symbol === symbol);
}

// Find token by address
function findTokenByAddress(address) {
  if (!address) return null;
  return tokenList.find(token => token.address.toLowerCase() === address.toLowerCase());
}

// Get token price in USD using CoinGecko API
async function getTokenPrices() {
  try {
    const response = await fetch(`${PRICE_API_URL}?${PRICE_PARAMS}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
}

// Get token price in USD
async function getTokenPrice(symbol) {
  const coinGeckoId = tokenToCoinGeckoId[symbol];
  if (!coinGeckoId) return 0;
  
  try {
    const prices = await getTokenPrices();
    return prices[coinGeckoId]?.usd || 0;
  } catch (error) {
    console.error(`Error getting price for ${symbol}:`, error);
    return 0;
  }
}

// Format token amount for display
function formatTokenAmount(amount, decimals = 18) {
  if (!amount) return '0';
  
  // Convert to BigNumber for proper handling
  try {
    // Use safeEthers instead of ethers.utils
    const bn = window.safeEthers.utils.parseUnits(amount.toString(), decimals);
    const formatted = window.safeEthers.utils.formatUnits(bn, decimals);
    
    // Format to 6 decimal places max
    const parts = formatted.split('.');
    if (parts.length === 2) {
      const integerPart = parts[0];
      const decimalPart = parts[1].slice(0, 6).replace(/0+$/, '');
      return decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
    }
    
    return formatted;
  } catch (error) {
    console.error("Error formatting token amount:", error);
    return amount.toString();
  }
}