import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize chart using CSP-safe configuration
    const initChart = async () => {
      try {
        // Wait for the chart library to load
        while (!window.LightweightCharts) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const chart = window.LightweightCharts.createChart(containerRef.current!, {
          width: containerRef.current!.clientWidth,
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
            borderColor: 'rgba(197, 203, 206, 0.4)',
          },
        });

        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350'
        });

        // Store reference for cleanup
        chartRef.current = chart;

        // Update data using CSP-safe methods
        await window.dexmond.chart.updateChartData(candlestickSeries);
        setIsLoading(false);

        // Handle window resize
        const handleResize = () => {
          if (containerRef.current && chart) {
            chart.applyOptions({
              width: containerRef.current.clientWidth
            });
          }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      } catch (error) {
        console.error("Failed to initialize chart:", error);
        setIsLoading(false);
      }
    };

    initChart();

    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
      }
    };
  }, []);

  return (
    <Card className="p-4">
      {isLoading && (
        <div className="flex items-center justify-center h-[400px]">
          <div className="loading-animation" />
        </div>
      )}
      <div 
        ref={containerRef} 
        className="w-full h-[400px]"
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </Card>
  );
}