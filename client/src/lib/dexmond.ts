// Global type augmentation for window object
declare global {
  interface Window {
    dexmond: typeof dexmond;
  }
}

const API_KEY = '0x b5c7fc99-385a-4a7f-948c-01236858baa6';
const BASE_URL = 'https://api.0x.org';

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

export const dexmond = {
  orderbook: {
    async generateOrderbookData() {
      try {
        const response = await fetch(`${BASE_URL}/swap/v1/quote`, {
          headers: {
            '0x-api-key': API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch orderbook data');
        }
        
        const data = await response.json() as PriceResponse;
        
        // Generate synthetic orderbook data based on the price
        const basePrice = parseFloat(data.price);
        const orders = [];
        
        // Generate buy orders
        for (let i = 0; i < 10; i++) {
          const priceOffset = (Math.random() * 0.01) - 0.005;
          orders.push({
            type: 'buy',
            price: basePrice * (1 - priceOffset),
            amount: Math.random() * 10 + 1,
            total: 0,
            source: data.sources[Math.floor(Math.random() * data.sources.length)]?.name || 'Market'
          });
        }
        
        // Generate sell orders
        for (let i = 0; i < 10; i++) {
          const priceOffset = (Math.random() * 0.01) - 0.005;
          orders.push({
            type: 'sell',
            price: basePrice * (1 + priceOffset),
            amount: Math.random() * 10 + 1,
            total: 0,
            source: data.sources[Math.floor(Math.random() * data.sources.length)]?.name || 'Market'
          });
        }
        
        // Calculate totals and sort
        orders.forEach(order => {
          order.total = order.price * order.amount;
        });
        
        return orders.sort((a, b) => b.price - a.price);
      } catch (error) {
        console.error('Error generating orderbook data:', error);
        return [];
      }
    }
  },
  
  chart: {
    async updateChartData(candlestickSeries: any) {
      try {
        // Get historical price data from 0x API
        const response = await fetch(`${BASE_URL}/swap/v1/prices`, {
          headers: {
            '0x-api-key': API_KEY
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }
        
        const data = await response.json();
        
        // Generate synthetic OHLC data
        const currentTime = Math.floor(Date.now() / 1000);
        const candleData = [];
        
        for (let i = 30; i >= 0; i--) {
          const basePrice = parseFloat(data.price);
          const time = currentTime - (i * 86400); // Daily candles
          const volatility = 0.02; // 2% daily volatility
          
          const open = basePrice * (1 + (Math.random() - 0.5) * volatility);
          const close = basePrice * (1 + (Math.random() - 0.5) * volatility);
          const high = Math.max(open, close) * (1 + Math.random() * volatility);
          const low = Math.min(open, close) * (1 - Math.random() * volatility);
          
          candleData.push({
            time,
            open,
            high,
            low,
            close
          });
        }
        
        candlestickSeries.setData(candleData);
      } catch (error) {
        console.error('Error updating chart data:', error);
      }
    }
  }
};

// Add to window object
window.dexmond = dexmond;
