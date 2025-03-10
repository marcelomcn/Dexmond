
import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { getPriceHistory } from '../../lib/dexmond';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

interface TechnicalChartProps {
  tokenSymbol: string;
}

export function TechnicalChart({ tokenSymbol }: TechnicalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chartRef = useRef<any>(null);
  const candlestickSeriesRef = useRef<any>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    // Initialize the chart
    if (!chartRef.current) {
      chartRef.current = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: {
          background: {
            type: 'solid',
            color: '#1a1a1a',
          },
          textColor: '#d1d4dc',
        },
        grid: {
          vertLines: {
            color: '#2B2B43',
          },
          horzLines: {
            color: '#2B2B43',
          },
        },
        timeScale: {
          timeVisible: true,
          secondsVisible: false,
        },
      });
      
      candlestickSeriesRef.current = chartRef.current.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
    }

    // Get price history data for the selected token
    const loadPriceData = async () => {
      setIsLoading(true);
      try {
        let coinGeckoId = '';
        
        // Map token symbol to CoinGecko ID
        switch(tokenSymbol.toLowerCase()) {
          case 'eth': coinGeckoId = 'ethereum'; break;
          case 'usdc': coinGeckoId = 'usd-coin'; break;
          case 'usdt': coinGeckoId = 'tether'; break;
          case 'dai': coinGeckoId = 'dai'; break;
          case 'wbtc': coinGeckoId = 'wrapped-bitcoin'; break;
          case 'uni': coinGeckoId = 'uniswap'; break;
          case 'link': coinGeckoId = 'chainlink'; break;
          case 'aave': coinGeckoId = 'aave'; break;
          case 'comp': coinGeckoId = 'compound-governance-token'; break;
          case 'sushi': coinGeckoId = 'sushi'; break;
          default: coinGeckoId = 'ethereum';
        }
        
        const data = await getPriceHistory(coinGeckoId);
        if (data && candlestickSeriesRef.current) {
          candlestickSeriesRef.current.setData(data);
          chartRef.current.timeScale().fitContent();
        }
      } catch (error) {
        console.error('Error loading price data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPriceData();

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      // Cleanup chart when component unmounts
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [tokenSymbol, timeframe]);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex justify-between items-center">
          <span>{tokenSymbol} Price Chart</span>
          <div className="flex space-x-1">
            <Button 
              variant={timeframe === '1D' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('1D')}
              className="text-xs h-7 px-2"
            >
              1D
            </Button>
            <Button 
              variant={timeframe === '1W' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('1W')}
              className="text-xs h-7 px-2"
            >
              1W
            </Button>
            <Button 
              variant={timeframe === '1M' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeframe('1M')}
              className="text-xs h-7 px-2"
            >
              1M
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={chartContainerRef} className="w-full h-[400px]">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TechnicalChart;
