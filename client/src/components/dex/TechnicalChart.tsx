import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getPriceHistory } from '@/lib/dexmond';

interface TechnicalChartProps {
  tokenSymbol: string;
}

function TechnicalChart({ tokenSymbol }: TechnicalChartProps) {
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

    // Update chart data based on timeframe changes
    const updateChartData = async () => {
      setIsLoading(true);
      try {
        const tokenId = tokenSymbol.toLowerCase();
        const data = await getPriceHistory(tokenId, timeframe);

        if (candlestickSeriesRef.current && data) {
          candlestickSeriesRef.current.setData(data);
        }
      } catch (error) {
        console.error('Error fetching price history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    updateChartData();

    // Handle resize
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
    };
  }, [tokenSymbol, timeframe]);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Price Chart - {tokenSymbol}</CardTitle>
        <div className="flex space-x-2">
          <Button
            variant={timeframe === '1D' ? 'default' : 'outline'}
            onClick={() => setTimeframe('1D')}
            size="sm"
          >
            1D
          </Button>
          <Button
            variant={timeframe === '1W' ? 'default' : 'outline'}
            onClick={() => setTimeframe('1W')}
            size="sm"
          >
            1W
          </Button>
          <Button
            variant={timeframe === '1M' ? 'default' : 'outline'}
            onClick={() => setTimeframe('1M')}
            size="sm"
          >
            1M
          </Button>
          {/* Added 1Y button for consistency */}
          <Button
            variant={timeframe === '1Y' ? 'default' : 'outline'}
            onClick={() => setTimeframe('1Y')}
            size="sm"
          >
            1Y
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div 
            ref={chartContainerRef} 
            className="w-full h-[300px]"
          />
        )}
      </CardContent>
    </Card>
  );
}

export default TechnicalChart;