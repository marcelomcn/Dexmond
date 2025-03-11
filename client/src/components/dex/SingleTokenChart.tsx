
import React, { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface TokenOption {
  symbol: string;
  name: string;
  logoURI: string;
}

const tokenList = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    logoURI: 'https://tokens.1inch.io/0x2260fac5e5542a773aa44fbcfedf7c193bc2c599.png'
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    logoURI: 'https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png'
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    logoURI: 'https://tokens.1inch.io/0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48.png'
  },
  {
    symbol: 'USDT',
    name: 'Tether USD',
    logoURI: 'https://tokens.1inch.io/0xdac17f958d2ee523a2206206994597c13d831ec7.png'
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    logoURI: 'https://tokens.1inch.io/0x6b175474e89094c44da98b954eedeac495271d0f.png'
  },
  {
    symbol: 'LINK',
    name: 'ChainLink Token',
    logoURI: 'https://tokens.1inch.io/0x514910771af9ca656af840dff83e8264ecf986ca.png'
  },
  {
    symbol: 'UNI',
    name: 'Uniswap',
    logoURI: 'https://tokens.1inch.io/0x1f9840a85d5af5bf1d1762f925bdaddc4201f984.png'
  },
  {
    symbol: 'AAVE',
    name: 'Aave Token',
    logoURI: 'https://tokens.1inch.io/0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9.png'
  }
];

const tokenToCoinGeckoId: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'DAI': 'dai',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'AAVE': 'aave',
};

export function SingleTokenChart() {
  const [selectedToken, setSelectedToken] = useState<string>("BTC");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [priceData, setPriceData] = useState<any[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadChartLibrary = async () => {
      if (typeof window.LightweightCharts === 'undefined') {
        console.log("Chart library not loaded");
        return false;
      }
      return true;
    };

    const fetchPriceData = async () => {
      if (!selectedToken) return;
      
      setIsLoading(true);
      
      try {
        const coinId = tokenToCoinGeckoId[selectedToken];
        if (!coinId) {
          console.error("No CoinGecko ID for token:", selectedToken);
          setIsLoading(false);
          return;
        }
        
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch price data: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (isMounted) {
          // Format data for chart
          const formattedData = data.prices.map((item: [number, number]) => {
            return {
              time: item[0] / 1000, // Convert to seconds
              value: item[1]
            };
          });
          
          setPriceData(formattedData);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching price data:", error);
        
        if (isMounted) {
          // Generate mock data if API fails
          const mockData = generateMockData(selectedToken);
          setPriceData(mockData);
          setIsLoading(false);
        }
      }
    };

    const initChart = async () => {
      if (!chartContainerRef.current) return;
      
      const hasLibrary = await loadChartLibrary();
      if (!hasLibrary) return;
      
      // Clear previous chart
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
      
      const { createChart, ColorType } = window.LightweightCharts;
      
      // Create new chart
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: 'rgba(255, 255, 255, 0.9)',
        },
        grid: {
          vertLines: { color: 'rgba(197, 203, 206, 0.2)' },
          horzLines: { color: 'rgba(197, 203, 206, 0.2)' },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      // Add area series
      const areaSeries = chartRef.current.addAreaSeries({
        topColor: 'rgba(76, 175, 80, 0.56)',
        bottomColor: 'rgba(76, 175, 80, 0.04)',
        lineColor: 'rgba(76, 175, 80, 1)',
        lineWidth: 2,
      });
      
      // Set price data
      if (priceData.length > 0) {
        areaSeries.setData(priceData);
        chartRef.current.timeScale().fitContent();
      }
      
      // Handle resize
      const resizeObserver = new ResizeObserver(entries => {
        if (chartRef.current && entries.length > 0) {
          const { width, height } = entries[0].contentRect;
          chartRef.current.applyOptions({ width, height });
          chartRef.current.timeScale().fitContent();
        }
      });
      
      resizeObserver.observe(chartContainerRef.current);
      
      return () => {
        resizeObserver.disconnect();
      };
    };
    
    fetchPriceData().then(() => {
      if (isMounted) {
        initChart();
      }
    });

    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [selectedToken]);

  // Generate mock data if API is unavailable
  const generateMockData = (token: string) => {
    const data = [];
    const now = Math.floor(Date.now() / 1000);
    const oneDay = 24 * 60 * 60;
    
    let basePrice = 0;
    switch (token) {
      case 'BTC':
        basePrice = 30000;
        break;
      case 'ETH':
        basePrice = 2000;
        break;
      case 'LINK':
        basePrice = 15;
        break;
      case 'UNI':
        basePrice = 20;
        break;
      case 'AAVE':
        basePrice = 80;
        break;
      default:
        basePrice = token === 'USDC' || token === 'USDT' || token === 'DAI' ? 1 : 100;
    }
    
    for (let i = 30; i >= 0; i--) {
      const time = now - i * oneDay;
      const randomFactor = 0.98 + Math.random() * 0.04; // Random factor between 0.98 and 1.02
      const value = basePrice * randomFactor * (1 + (30 - i) * 0.005); // Slight uptrend
      
      data.push({
        time,
        value
      });
    }
    
    return data;
  };

  const handleTokenChange = (value: string) => {
    setSelectedToken(value);
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <Select value={selectedToken} onValueChange={handleTokenChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select token" />
          </SelectTrigger>
          <SelectContent>
            {tokenList.map((token) => (
              <SelectItem key={token.symbol} value={token.symbol}>
                <div className="flex items-center gap-2">
                  <img 
                    src={token.logoURI} 
                    alt={token.symbol}
                    className="w-5 h-5 rounded-full"
                  />
                  <span>{token.name} ({token.symbol})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative w-full h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-card/50">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : null}
        <div 
          ref={chartContainerRef} 
          className="w-full h-full"
        />
      </div>
    </Card>
  );
}

export default SingleTokenChart;

// Add LightweightCharts type definition
declare global {
  interface Window {
    LightweightCharts: any;
  }
}
