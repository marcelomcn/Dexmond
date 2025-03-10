
import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { dexmond } from '../../lib/dexmond';

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
  const chartRef = useRef<IChartApi | null>(null);

  // Convert timeframe to days for API
  const getDaysFromTimeframe = (tf: string): number => {
    switch(tf) {
      case '1w': return 7;
      case '1m': return 30;
      default: return 1;
    }
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Clear any existing chart
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      width,
      height,
      layout: {
        background: { type: 'solid', color: '#1E1E30' },
        textColor: '#DDD',
      },
      grid: {
        vertLines: { color: '#2E2E3E' },
        horzLines: { color: '#2E2E3E' },
      },
      timeScale: {
        borderColor: '#2E2E3E',
        timeVisible: true,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4CAF50',
      downColor: '#FF5252',
      borderDownColor: '#FF5252',
      borderUpColor: '#4CAF50',
      wickDownColor: '#FF5252',
      wickUpColor: '#4CAF50',
    });

    // Save chart reference
    chartRef.current = chart;

    // Load data
    const loadChartData = async () => {
      try {
        const days = getDaysFromTimeframe(timeframe);
        const candleData = await dexmond.chart.getPriceHistory(tokenSymbol, 'usd', days);
        candlestickSeries.setData(candleData);
      } catch (error) {
        console.error('Error loading chart data:', error);
      }
    };

    loadChartData();

    // Handle resize
    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [tokenSymbol, timeframe, width, height]);

  // Update data when timeframe changes
  useEffect(() => {
    if (!chartRef.current) return;
    
    const days = getDaysFromTimeframe(timeframe);
    dexmond.chart.getPriceHistory(tokenSymbol, 'usd', days)
      .then(data => {
        if (chartRef.current && chartRef.current.series().length > 0) {
          const candlestickSeries = chartRef.current.series()[0];
          candlestickSeries.setData(data);
        }
      })
      .catch(error => {
        console.error('Error updating chart data:', error);
      });
  }, [tokenSymbol, timeframe]);

  return <div ref={chartContainerRef} className="technical-chart" />;
}

export default TechnicalChart;
import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { dexmond } from '@/lib/dexmond';
import { createChart, IChartApi, ISeriesApi, CandlestickData, UTCTimestamp } from 'lightweight-charts';

interface TechnicalChartProps {
  baseToken?: string;
  quoteToken?: string;
  timeframe?: string;
}

export function TechnicalChart({ 
  baseToken = 'ethereum', 
  quoteToken = 'usd', 
  timeframe = '30' 
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
        const data = await dexmond.price.getPriceHistory(baseToken, quoteToken, timeframe);
        setChartData(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to fetch chart data:', err);
        setError('Failed to load chart data');
        setIsLoading(false);
      }
    };

    fetchChartData();
  }, [baseToken, quoteToken, timeframe]);

  useEffect(() => {
    if (!chartContainerRef.current || chartRef.current) return;

    // Initialize the chart
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: {
        background: {
          color: 'transparent',
        },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: {
          color: 'rgba(42, 46, 57, 0.3)',
        },
        horzLines: {
          color: 'rgba(42, 46, 57, 0.3)',
        },
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.3)',
      },
      crosshair: {
        mode: 0,
      },
    });

    // Set up responsive behavior
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);
    
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
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
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
