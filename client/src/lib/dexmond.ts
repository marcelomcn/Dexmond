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

// Create the dexmond API client
export const dexmond = {
  // Get price for a token pair
  async getPrice(sellToken: string, buyToken: string, sellAmount: string): Promise<PriceData> {
    try {
      const response = await fetch(`/api/price?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`);
      if (!response.ok) {
        throw new Error('Failed to fetch price data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching price:', error);
      throw error;
    }
  },

  // Get executable quote for a token pair
  async getQuote(
    sellToken: string,
    buyToken: string,
    sellAmount: string,
    takerAddress?: string
  ): Promise<QuoteData> {
    try {
      let url = `/api/quote?sellToken=${sellToken}&buyToken=${buyToken}&sellAmount=${sellAmount}`;
      if (takerAddress) {
        url += `&takerAddress=${takerAddress}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch quote data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching quote:', error);
      throw error;
    }
  },

  // Get orderbook data for a token pair
  async getOrderbook(baseToken: string, quoteToken: string): Promise<Orderbook> {
    try {
      const response = await fetch(`/api/orderbook?baseToken=${baseToken}&quoteToken=${quoteToken}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orderbook data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching orderbook:', error);
      throw error;
    }
  },

  // Get price history for a token
  async getPriceHistory(token: string, vsCurrency: string = 'usd', days: number = 30): Promise<CandlestickData[]> {
    try {
      const response = await fetch(`/api/price-history?token=${token}&vs_currency=${vsCurrency}&days=${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch price history');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching price history:', error);
      throw error;
    }
  },

  // Get available tokens
  async getTokens(chainId?: number): Promise<Token[]> {
    try {
      let url = '/api/tokens';
      if (chainId) {
        url += `?chainId=${chainId}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch tokens');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching tokens:', error);
      throw error;
    }
  }
};

// Add to window object for global access
declare global {
  interface Window {
    dexmond: typeof dexmond;
  }
}

// Expose the API to the window object
if (typeof window !== 'undefined') {
  window.dexmond = dexmond;
}