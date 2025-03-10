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
import React, { useEffect, useRef } from 'react';

export function TechnicalChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!chartContainerRef.current || !window.LightweightCharts) return;
    
    const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: { color: 'rgba(0, 0, 0, 0)' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.2)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.2)' },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });
    
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4CAF50',
      downColor: '#F44336',
      borderDownColor: '#F44336',
      borderUpColor: '#4CAF50',
      wickDownColor: '#F44336',
      wickUpColor: '#4CAF50',
    });
    
    // Generate some sample data for now
    const data = generateSampleData();
    candlestickSeries.setData(data);
    
    // If window.dexmond exists, use it to update chart data
    if (window.dexmond?.chart?.updateChartData) {
      window.dexmond.chart.updateChartData(candlestickSeries).catch(console.error);
    }
    
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      chart.remove();
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="bg-card rounded-xl shadow-lg overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="text-xl font-semibold">Price Chart</h2>
      </div>
      <div ref={chartContainerRef} className="w-full h-[400px]" />
    </div>
  );
}

function generateSampleData() {
  const data = [];
  let time = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime() / 1000;
  let price = 100;
  
  for (let i = 0; i < 30; i++) {
    const volatility = 0.1;
    const changePercent = 2 * volatility * Math.random();
    if (changePercent > volatility) {
      price = price * (1 + changePercent);
    } else {
      price = price * (1 - changePercent);
    }
    
    const open = price;
    const high = price * (1 + Math.random() * 0.05);
    const low = price * (1 - Math.random() * 0.05);
    const close = price * (1 + (Math.random() * 0.1 - 0.05));
    
    data.push({
      time: time,
      open: open,
      high: high,
      low: low,
      close: close,
    });
    
    time += 24 * 60 * 60; // Add one day
  }
  
  return data;
}
