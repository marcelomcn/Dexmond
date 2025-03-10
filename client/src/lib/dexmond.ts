
interface PriceResponse {
  price: string;
  estimatedPriceImpact: string;
  value: string;
  gasPrice: string;
  estimatedGas: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  buyAmount: string;
  sellTokenAddress: string;
  sellAmount: string;
  sources: Array<{
    name: string;
    proportion: string;
  }>;
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
}

interface TokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  category?: string;
}

interface OrderbookEntry {
  type: 'buy' | 'sell';
  price: number;
  amount: number;
  total: number;
  source: string;
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export const dexmond = {
  // Price functions
  price: {
    async getPrice(sellToken: string, buyToken: string, sellAmount: string): Promise<PriceResponse> {
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
    
    async getQuote(sellToken: string, buyToken: string, sellAmount: string, takerAddress?: string): Promise<PriceResponse> {
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
    }
  },
  
  // Orderbook functions
  orderbook: {
    async getOrderbook(baseToken: string, quoteToken: string): Promise<{ bids: OrderbookEntry[], asks: OrderbookEntry[] }> {
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
    }
  },
  
  // Chart data functions
  chart: {
    async getPriceHistory(token: string, vsCurrency: string = 'usd', days: number = 30): Promise<CandleData[]> {
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
    
    async updateChart(chartInstance: any, token: string, vsCurrency: string = 'usd', days: number = 30): Promise<void> {
      try {
        const candleData = await this.getPriceHistory(token, vsCurrency, days);
        
        if (chartInstance && chartInstance.series && chartInstance.series.length > 0) {
          const candlestickSeries = chartInstance.series[0];
          candlestickSeries.setData(candleData);
        }
      } catch (error) {
        console.error('Error updating chart:', error);
        throw error;
      }
    }
  },
  
  // Token functions
  tokens: {
    async getTokens(chainId?: number): Promise<TokenInfo[]> {
      try {
        let url = '/api/tokens';
        if (chainId) {
          url += `?chainId=${chainId}`;
        }
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch token list');
        }
        
        return await response.json();
      } catch (error) {
        console.error('Error fetching tokens:', error);
        throw error;
      }
    }
  }
};

// Add to window object for global access
declare global {
  interface Window {
    dexmond: typeof dexmond;
  }
}

window.dexmond = dexmond;
