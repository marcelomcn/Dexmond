import axios from 'axios';
import { ethers } from 'ethers';

// Import monetization utilities
import monetization from './monetization';

// Constants
const API_BASE_URL = '/api';

// Interfaces
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

export interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  logoURI?: string;
}

export interface QuoteParams {
  sellToken: string;
  buyToken: string;
  sellAmount?: string;
  buyAmount?: string;
  slippagePercentage?: string;
  takerAddress?: string;
}

export interface SwapQuote {
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: string;
  data: string;
  value: string;
  gas: string;
  estimatedGas: string;
  gasPrice: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyAmount: string;
  sellAmount: string;
  sources: Array<{ name: string; proportion: string }>;
  buyTokenAddress: string;
  sellTokenAddress: string;
  estimatedGasTokenRefund: string;
  allowanceTarget: string;
}


// Functions
export async function getTokens(): Promise<TokenInfo[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/tokens`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return [];
  }
}

export async function getPrice(params: { sellToken: string; buyToken: string; sellAmount?: string }): Promise<number> {
  try {
    const response = await axios.get(`${API_BASE_URL}/price`, { params });
    return response.data.price;
  } catch (error) {
    console.error('Error fetching price:', error);
    return 0;
  }
}

export async function getQuote(params: QuoteParams): Promise<SwapQuote | null> {
  try {
    const response = await axios.get(`${API_BASE_URL}/quote`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    return null;
  }
}

export async function getOrderbook(params: { baseToken: string; quoteToken: string }): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/orderbook`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orderbook:', error);
    return { bids: [], asks: [] };
  }
}

export async function getPriceHistory(params: { baseToken: string; quoteToken: string; resolution: string }): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/price-history`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error);
    return [];
  }
}

export async function fetchPriceHistory(params: { baseToken: string; quoteToken: string; resolution: string; from: number; to: number }): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/candlesticks`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching candlesticks:', error);
    return [];
  }
}

export function formatAmount(amount: string | number, decimals: number = 18): string {
  return ethers.utils.formatUnits(amount.toString(), decimals);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

// Add to window object for global access
declare global {
  interface Window {
    dexmond: {
      getTokens: typeof getTokens;
      getPrice: typeof getPrice;
      getQuote: (params: QuoteParams) => Promise<SwapQuote | null>;
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

export default {
  getTokens,
  getPrice,
  getQuote,
  getOrderbook,
  getPriceHistory,
  fetchPriceHistory,
  formatAmount,
  formatUSD
};