import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

type Indicator = 'ma' | 'ema' | 'rsi' | 'macd';

interface TechnicalIndicator {
  name: string;
  enabled: boolean;
  period?: number;
}

export function TechnicalChart() {
  const { toast } = useToast();
  const [indicators, setIndicators] = useState<Record<Indicator, TechnicalIndicator>>({
    ma: { name: 'Moving Average', enabled: false, period: 20 },
    ema: { name: 'EMA', enabled: false, period: 12 },
    rsi: { name: 'RSI', enabled: false, period: 14 },
    macd: { name: 'MACD', enabled: false },
  });
  const [priceAlert, setPriceAlert] = useState({
    enabled: false,
    price: '',
    condition: 'above' as 'above' | 'below'
  });
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In production, this would fetch real data from your API
        const mockData = generateMockData();
        setChartData({
          labels: mockData.timestamps,
          datasets: [
            {
              label: 'Price',
              data: mockData.prices,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              fill: false
            },
            ...(indicators.ma.enabled ? [{
              label: 'MA',
              data: calculateMA(mockData.prices, indicators.ma.period || 20),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
              fill: false
            }] : []),
            ...(indicators.ema.enabled ? [{
              label: 'EMA',
              data: calculateEMA(mockData.prices, indicators.ema.period || 12),
              borderColor: 'rgb(54, 162, 235)',
              tension: 0.1,
              fill: false
            }] : [])
          ]
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [indicators]);

  const toggleIndicator = (indicator: Indicator) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: {
        ...prev[indicator],
        enabled: !prev[indicator].enabled
      }
    }));
  };

  const updateIndicatorPeriod = (indicator: Indicator, period: number) => {
    setIndicators(prev => ({
      ...prev,
      [indicator]: {
        ...prev[indicator],
        period
      }
    }));
  };

  const setPriceAlertHandler = () => {
    if (!priceAlert.price || isNaN(Number(priceAlert.price))) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price for the alert",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Price Alert Set",
      description: `Alert will trigger when price goes ${priceAlert.condition} ${priceAlert.price}`
    });
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {Object.entries(indicators).map(([key, indicator]) => (
            <div key={key} className="flex items-center space-x-2">
              <Switch
                checked={indicator.enabled}
                onCheckedChange={() => toggleIndicator(key as Indicator)}
              />
              <Label>{indicator.name}</Label>
              {indicator.period !== undefined && (
                <Input
                  type="number"
                  value={indicator.period}
                  onChange={(e) => updateIndicatorPeriod(key as Indicator, Number(e.target.value))}
                  className="w-20"
                />
              )}
            </div>
          ))}
        </div>

        <div className="h-[400px]">
          {chartData && (
            <Line
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: {
                      color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  }
                },
                plugins: {
                  legend: {
                    labels: {
                      color: 'rgba(255, 255, 255, 0.8)'
                    }
                  },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    bodyColor: '#fff'
                  }
                }
              }}
            />
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Price Alerts</h3>
          <div className="flex items-center space-x-2">
            <Switch
              checked={priceAlert.enabled}
              onCheckedChange={(checked) => setPriceAlert(prev => ({ ...prev, enabled: checked }))}
            />
            <Select
              value={priceAlert.condition}
              onValueChange={(value: 'above' | 'below') => 
                setPriceAlert(prev => ({ ...prev, condition: value }))
              }
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Above</SelectItem>
                <SelectItem value="below">Below</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Price"
              value={priceAlert.price}
              onChange={(e) => setPriceAlert(prev => ({ ...prev, price: e.target.value }))}
              className="w-32"
            />
            <Button onClick={setPriceAlertHandler}>Set Alert</Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Helper functions for technical indicators
function calculateMA(prices: number[], period: number): number[] {
  const ma: number[] = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      ma.push(0);
      continue;
    }
    const slice = prices.slice(i - period + 1, i + 1);
    const average = slice.reduce((a, b) => a + b, 0) / period;
    ma.push(average);
  }
  return ma;
}

function calculateEMA(prices: number[], period: number): number[] {
  const multiplier = 2 / (period + 1);
  const ema = [prices[0]];

  for (let i = 1; i < prices.length; i++) {
    const newEMA = (prices[i] - ema[i - 1]) * multiplier + ema[i - 1];
    ema.push(newEMA);
  }

  return ema;
}

function generateMockData() {
  const timestamps = [];
  const prices = [];
  const volumes = [];

  const basePrice = 1800; // Example ETH price
  const baseVolume = 100000;

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    timestamps.push(date.toLocaleDateString());

    const randomPrice = basePrice * (1 + (Math.random() - 0.5) * 0.02);
    const randomVolume = baseVolume * (1 + (Math.random() - 0.5) * 0.5);

    prices.push(randomPrice);
    volumes.push(randomVolume);
  }

  return { timestamps, prices, volumes };
}