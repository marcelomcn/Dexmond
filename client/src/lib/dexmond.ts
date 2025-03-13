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
import axios from 'axios';
import { MonetizationConfig } from './monetization';

// Interfaces
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
  sources: Array<{name: string, proportion: string}>;
  buyTokenAddress: string;
  sellTokenAddress: string;
  estimatedGasTokenRefund: string;
  allowanceTarget: string;
}

// Constants
const API_BASE_URL = '/api';

/**
 * Fetch supported tokens from the 0x API
 * @param chainId Chain ID to filter tokens by
 * @returns List of supported tokens
 */
export async function fetchTokenList(chainId?: number): Promise<TokenInfo[]> {
  try {
    const response = await axios.get(`${API_BASE_URL}/tokens`, {
      params: { chainId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching token list:', error);
    return [];
  }
}

/**
 * Get price quote for a swap
 * @param params Quote parameters
 * @returns Price quote data
 */
export async function getPrice(params: QuoteParams): Promise<any> {
  try {
    const response = await axios.get(`${API_BASE_URL}/price`, {
      params
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price:', error);
    throw error;
  }
}

/**
 * Get executable swap quote with monetization options
 * @param params Quote parameters
 * @param monetizationConfig Monetization configuration
 * @returns Executable swap quote
 */
export async function getQuote(
  params: QuoteParams, 
  monetizationConfig: MonetizationConfig
): Promise<SwapQuote> {
  try {
    // Add monetization parameters
    const requestParams: Record<string, any> = {
      ...params
    };
    
    if (monetizationConfig.collectAffiliateFee && monetizationConfig.affiliateFeeRecipient) {
      requestParams.collectAffiliateFee = 'true';
      requestParams.affiliateFeeRecipient = monetizationConfig.affiliateFeeRecipient;
      requestParams.affiliateFeeBps = monetizationConfig.affiliateFeeBps;
    }
    
    if (monetizationConfig.collectPositiveSlippage && monetizationConfig.positiveSlippageRecipient) {
      requestParams.positiveSlippageRecipient = monetizationConfig.positiveSlippageRecipient;
    }
    
    const response = await axios.get(`${API_BASE_URL}/quote`, {
      params: requestParams
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching quote:', error);
    throw error;
  }
}

/**
 * Get price history for a token
 * @param token Token ID (from CoinGecko)
 * @param days Number of days of history
 * @returns Price history data
 */
export async function getPriceHistory(token: string, days: number = 30): Promise<any[]> {
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
    return [];
  }
}

/**
 * Get orderbook data for a trading pair
 * @param baseToken Base token address
 * @param quoteToken Quote token address
 * @returns Orderbook data with bids and asks
 */
export async function getOrderbook(baseToken: string, quoteToken: string): Promise<any> {
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
    return { bids: [], asks: [] };
  }
}
