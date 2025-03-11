import React, { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tokenList } from "@/lib/tokens";

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Declare the LightweightCharts type
declare global {
  interface Window {
    LightweightCharts: any;
  }
}

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
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;
    let chart: any = null;
    let areaSeries: any = null;

    const loadChartLibrary = async () => {
      // Check if the library is loaded
      if (typeof window.LightweightCharts === 'undefined') {
        console.log("Chart library not loaded");
        return false;
      }
      return true;
    };

    const fetchPriceData = async (token: string) => {
      try {
        const coinId = tokenToCoinGeckoId[token];
        if (!coinId) {
          console.error(`No CoinGecko ID found for ${token}`);
          return [];
        }

        // Use mock data for development to avoid API rate limits
        // In production, uncomment the fetch call
        /*
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        );

      } catch (error) {
        console.error('Error fetching price data:', error);
        return [];
      }
    };

    const initChart = async () => {
      if (!chartContainerRef.current) return;
      
      const libraryLoaded = await loadChartLibrary();
      if (!libraryLoaded) return;
      
      try {
        // Clear previous chart if exists
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
          seriesRef.current = null;
        }
        
        // Create chart
        chart = window.LightweightCharts.createChart(chartContainerRef.current, {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: {
            background: { color: '#ffffff' },
            textColor: '#333',
          },
          grid: {
            vertLines: { color: '#f0f0f0' },
            horzLines: { color: '#f0f0f0' },
          },
          timeScale: {
            timeVisible: true,
            borderColor: '#d6d6d6',
          },
        });
        
        // Create area series
        areaSeries = chart.addAreaSeries({
          topColor: 'rgba(33, 150, 243, 0.56)',
          bottomColor: 'rgba(33, 150, 243, 0.04)',
          lineColor: 'rgba(33, 150, 243, 1)',
          lineWidth: 2,
        });
        
        // Save references
        chartRef.current = chart;
        seriesRef.current = areaSeries;
        
        // Fetch and set data
        const data = await fetchPriceData(selectedToken);
        if (data.length > 0 && areaSeries) {
          areaSeries.setData(data);
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
        
        // Handle resize
        const handleResize = () => {
          if (chartContainerRef.current && chart) {
            chart.applyOptions({
              width: chartContainerRef.current.clientWidth,
            });
          }
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      } catch (error) {
        console.error('Error initializing chart:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    initChart();
    
    return () => {
      isMounted = false;
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, [selectedToken]);
  
  const handleTokenChange = (token: string) => {
    setSelectedToken(token);
    setIsLoading(true);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Price Chart</span>
          <Select value={selectedToken} onValueChange={handleTokenChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BTC">Bitcoin (BTC)</SelectItem>
              <SelectItem value="ETH">Ethereum (ETH)</SelectItem>
              <SelectItem value="USDC">USD Coin (USDC)</SelectItem>
              <SelectItem value="USDT">Tether (USDT)</SelectItem>
              <SelectItem value="DAI">DAI</SelectItem>
              <SelectItem value="LINK">Chainlink (LINK)</SelectItem>
              <SelectItem value="UNI">Uniswap (UNI)</SelectItem>
              <SelectItem value="AAVE">Aave (AAVE)</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div ref={chartContainerRef} className="h-[400px] w-full" />
        )}
      </CardContent>
    </Card>
  );
}


        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = mockData;
        
        return data.prices.map(([timestamp, price]: [number, number]) => ({
          time: new Date(timestamp).toISOString().split('T')[0],
          value: price
        }));
        */

        // Mock data for development
        const mockData = {
          prices: Array.from({ length: 30 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i));
            const timestamp = date.getTime();
            // Generate random price that trends upward
            const basePrice = token === 'BTC' ? 35000 : 2000;
            const randomFactor = 1 + (Math.random() * 0.1 - 0.05);
            const price = basePrice * (1 + i/60) * randomFactor;
            return [timestamp, price];
          })
        };

        // Format data for the chart
        return data.prices.map((price: [number, number]) => ({
          time: price[0] / 1000, // Convert milliseconds to seconds for the chart
          value: price[1],
        }));
      } catch (error) {
        console.error("Error fetching price data:", error);
        return [];
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
        seriesRef.current = null;
      }

      // Create chart instance using the global LightweightCharts object
      const { createChart } = window.LightweightCharts;
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: { type: 'solid', color: 'transparent' },
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

      // Add area series - Added error handling
      try {
        seriesRef.current = chartRef.current.addAreaSeries({
          topColor: 'rgba(76, 175, 80, 0.56)',
          bottomColor: 'rgba(76, 175, 80, 0.04)',
          lineColor: 'rgba(76, 175, 80, 1)',
          lineWidth: 2,
        });
      } catch (error) {
        console.error("Error adding area series:", error);
      }


      // Set price data
      if (priceData.length > 0 && seriesRef.current) {
        seriesRef.current.setData(priceData);
        chartRef.current.timeScale().fitContent();
      }

      // Handle resize
      const resizeObserver = new ResizeObserver(entries => {
        if (chartRef.current && entries.length > 0) {
          const { width, height } = entries[0].contentRect;
          chartRef.current.applyOptions({ width, height });
        }
      });

      resizeObserver.observe(chartContainerRef.current);

      return () => {
        if (chartContainerRef.current) {
          resizeObserver.unobserve(chartContainerRef.current);
        }
      };
    };

    const updateChartData = async () => {
      setIsLoading(true);
      const data = await fetchPriceData(selectedToken);

      if (isMounted) {
        setPriceData(data);
        setIsLoading(false);
      }
    };

    updateChartData().then(() => {
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

  const handleTokenChange = (value: string) => {
    setSelectedToken(value);
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <Select value={selectedToken} onValueChange={handleTokenChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
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