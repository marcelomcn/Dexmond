interface PriceData {
  price: string;
  estimatedPriceImpact: string;
  sources: string[];
}

interface QuoteData {
  price: string;
  guaranteedPrice: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
}

interface OrderbookEntry {
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  source: string;
}

interface Orderbook {
  bids: OrderbookEntry[];
  asks: OrderbookEntry[];
}

interface CandlestickData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

import axios from 'axios';

// API base URL
const API_BASE_URL = '/api';

// Fetch token list
export async function getTokens(chainId?: number): Promise<Token[]> {
  try {
    let url = `${API_BASE_URL}/tokens`;
    if (chainId) {
      url += `?chainId=${chainId}`;
    }
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching token list:', error);
    throw error;
  }
}

// Get token price quote
export async function getPrice(sellToken: string, buyToken: string, sellAmount: string): Promise<PriceData> {
  try {
    const response = await axios.get(`${API_BASE_URL}/price`, {
      params: {
        sellToken,
        buyToken,
        sellAmount
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price:', error);
    throw error;
  }
}

// Get executable swap quote
export async function getQuote(
  sellToken: string,
  buyToken: string,
  sellAmount: string,
  takerAddress: string
): Promise<QuoteData> {
  try {
    const response = await axios.get(`${API_BASE_URL}/quote`, {
      params: {
        sellToken,
        buyToken,
        sellAmount,
        takerAddress
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
}

// Get orderbook data
export async function getOrderbook(baseToken: string, quoteToken: string): Promise<Orderbook> {
  try {
    const response = await axios.get(`${API_BASE_URL}/orderbook`, {
      params: {
        baseToken,
        quoteToken
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    throw error;
  }
}

// Get price history for chart
export async function getPriceHistory(token: string, days: string = '30'): Promise<CandlestickData[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/price-history`, {
      params: {
        token,
        days
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    throw error;
  }
}

// Format token amount for display
export function formatAmount(amount: number, decimals: number = 18, maxDecimals: number = 6): string {
  if (!amount) return '0';

  const fixed = amount.toFixed(maxDecimals);
  return parseFloat(fixed).toString();
}

// Format USD value
export function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

// Export fetchPriceHistory as a wrapper around getPriceHistory
export const fetchPriceHistory = async (tokenId: string, timeframe = '30d') => {
  return getPriceHistory(tokenId, timeframe);
};

// Import monetization utilities
import monetization from './monetization';

// Add to window object for global access
declare global {
  interface Window {
    dexmond: {
      getTokens: typeof getTokens;
      getPrice: typeof getPrice;
      getQuote: typeof getQuote;
      getOrderbook: typeof getOrderbook;
      getPriceHistory: typeof getPriceHistory;
      fetchPriceHistory: typeof fetchPriceHistory;
      formatAmount: typeof formatAmount;
      formatUSD: typeof formatUSD;
      // Add monetization functions
      enableMonetization: (enabled: boolean) => void;
      setAffiliateAddress: (address: string) => void;
      setAffiliateFeeBps: (bps: string) => void;
      getMonetizationConfig: typeof monetization.getMonetizationConfig;
    };
  }
}

// Expose the API to the window object with monetization features
if (typeof window !== 'undefined') {
  window.dexmond = {
    getTokens,
    getPrice,
    getQuote: async (params) => {
      // Add monetization parameters to quote requests
      const enhancedParams = monetization.addMonetizationParams(params);
      return getQuote(enhancedParams);
    },
    getOrderbook,
    getPriceHistory,
    fetchPriceHistory,
    formatAmount,
    formatUSD,
    // Add monetization controls
    enableMonetization: (enabled) => monetization.setMonetizationEnabled(enabled),
    setAffiliateAddress: (address) => monetization.setAffiliateAddress(address),
    setAffiliateFeeBps: (bps) => monetization.setAffiliateFeeBps(bps),
    getMonetizationConfig: monetization.getMonetizationConfig
  };
}