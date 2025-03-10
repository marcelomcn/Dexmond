import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

export function PriceChart() {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize chart using CSP-safe configuration
    const initChart = async () => {
      try {
        if (!window.LightweightCharts) {
          console.error("Chart library not loaded");
          return;
        }

        const chart = window.LightweightCharts.createChart(containerRef.current!, {
          width: containerRef.current!.clientWidth,
          height: 400,
          layout: {
            background: { color: 'transparent' },
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
        window.dexmond.chart.updateChartData(candlestickSeries);

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
      <div ref={containerRef} className="w-full h-[400px]" />
    </Card>
  );
}
