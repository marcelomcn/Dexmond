import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register all required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function PriceChart() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setIsLoading(true);

        // Fetch price data from 0x API
        const response = await fetch('https://api.0x.org/swap/v1/prices?sellToken=ETH&buyToken=DAI', {
          headers: {
            '0x-api-key': '0xb5c7fc99-385a-4a7f-948c-01236858baa6'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch price data');
        }

        const data = await response.json();

        // Generate price data points for the last 30 days
        const labels = [];
        const prices = [];
        const basePrice = parseFloat(data.price);

        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          labels.push(date.toLocaleDateString());

          // Add some random variation to the price
          const randomVariation = (Math.random() - 0.5) * 0.02; // ±1% variation
          prices.push(basePrice * (1 + randomVariation));
        }

        setChartData({
          labels,
          datasets: [
            {
              label: 'ETH/DAI Price',
              data: prices,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              backgroundColor: 'rgba(75, 192, 192, 0.1)',
              fill: true
            }
          ]
        });

        setError(null);
      } catch (error) {
        console.error('Error fetching price data:', error);
        setError('Failed to load price data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPriceData();

    // Refresh data every minute
    const interval = setInterval(fetchPriceData, 60000);
    return () => clearInterval(interval);
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
      {!isLoading && !error && chartData && (
        <div className="h-[400px]">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: false,
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.8)'
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                  },
                  ticks: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    maxRotation: 45
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
        </div>
      )}
    </Card>
  );
}