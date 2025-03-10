
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
