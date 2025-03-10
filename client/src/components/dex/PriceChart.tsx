import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initChart = async () => {
      try {
        setIsLoading(true);
        console.log("Initializing chart...");

        // Wait for the chart library to load with a timeout
        let attempts = 0;
        while (!window.LightweightCharts && attempts < 50) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
          console.log(`Waiting for chart library... attempt ${attempts}`);
        }

        if (!window.LightweightCharts) {
          throw new Error("Chart library failed to load");
        }

        console.log("Chart library loaded, creating chart...");

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

        console.log("Chart created, adding candlestick series...");

        const candlestickSeries = chart.addCandlestickSeries({
          upColor: '#26a69a',
          downColor: '#ef5350',
          borderVisible: false,
          wickUpColor: '#26a69a',
          wickDownColor: '#ef5350'
        });

        // Store reference for cleanup
        chartRef.current = chart;

        console.log("Fetching chart data...");

        // Update data using CSP-safe methods
        await window.dexmond.chart.updateChartData(candlestickSeries);

        console.log("Chart data updated, fitting content...");

        // Fit content to view
        chart.timeScale().fitContent();

        setIsLoading(false);
        setError(null);

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
        setError("Failed to load chart data. Please try refreshing the page.");
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
      {error && (
        <div className="flex items-center justify-center h-[400px] text-red-400">
          {error}
        </div>
      )}
      {!isLoading && !error && (
        <div 
          ref={containerRef} 
          className="w-full h-[400px]"
        />
      )}
    </Card>
  );
}