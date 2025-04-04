import React, { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { tokenList } from "@/lib/tokens";

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

interface SingleTokenChartProps {
  token: string;
  onTokenChange?: (token: string) => void;
}

export function SingleTokenChart({ token, onTokenChange }: SingleTokenChartProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [priceData, setPriceData] = React.useState<any[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const seriesRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const loadChartLibrary = async () => {
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

        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=30`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        return data.prices.map((price: [number, number]) => ({
          time: price[0] / 1000,
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

      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
        seriesRef.current = null;
      }

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

      if (priceData.length > 0 && seriesRef.current) {
        seriesRef.current.setData(priceData);
        chartRef.current.timeScale().fitContent();
      }

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
      const data = await fetchPriceData(token);

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
  }, [token]);

  const handleTokenChange = (value: string) => {
    if (onTokenChange) {
      onTokenChange(value);
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h3 className="text-lg font-semibold">Price Chart</h3>
        <Select value={token} onValueChange={handleTokenChange}>
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