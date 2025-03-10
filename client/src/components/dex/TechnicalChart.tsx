
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { dexmond } from '@/lib/dexmond';
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp } from 'lightweight-charts';

interface TechnicalChartProps {
  tokenSymbol: string;
  width?: number;
  height?: number;
  timeframe?: '1d' | '1w' | '1m';
}

export function TechnicalChart({ 
  tokenSymbol = 'ethereum', 
  width = 800, 
  height = 400,
  timeframe = '1d'
}: TechnicalChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<CandlestickData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch price history data from our API
        const data = await dexmond.getPriceHistory(tokenSymbol, 'usd', getDaysFromTimeframe(timeframe));
        setChartData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        setError('Failed to load chart data');
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [tokenSymbol, timeframe]);

  const getDaysFromTimeframe = (tf: string): number => {
    switch(tf) {
      case '1w': return 7;
      case '1m': return 30;
      default: return 1;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    // Initialize the chart
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: 'rgba(42, 46, 57, 0.3)' },
        horzLines: { color: 'rgba(42, 46, 57, 0.3)' },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
      },
      crosshair: {
        mode: 0,
      },
    });

    // Set up responsive behavior
    window.addEventListener('resize', () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    });

    // Create the candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  // Update chart data when it changes
  useEffect(() => {
    if (candlestickSeriesRef.current && chartData.length > 0) {
      candlestickSeriesRef.current.setData(chartData);
      
      // Fit content to make sure all data is visible
      if (chartRef.current) {
        chartRef.current.timeScale().fitContent();
      }
    }
  }, [chartData]);

  return (
    <Card className="p-4 h-[500px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Price Chart</h3>
        {isLoading && (
          <div className="text-sm text-muted-foreground">Loading...</div>
        )}
        {error && (
          <div className="text-sm text-red-500">{error}</div>
        )}
      </div>
      <div 
        ref={chartContainerRef} 
        className="w-full h-[400px]"
      />
    </Card>
  );
}
