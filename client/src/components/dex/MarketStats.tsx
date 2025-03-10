import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, BarChart2 } from "lucide-react";
import { useState, useEffect } from "react";

interface MarketStat {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
}

export function MarketStats() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MarketStat[]>([]);

  useEffect(() => {
    // Simulate fetching market stats
    const fetchStats = async () => {
      setLoading(true);
      try {
        // In production, this would fetch real data from an API
        const mockStats: MarketStat[] = [
          {
            label: "24h Volume",
            value: "$1.2B",
            change: "12.5%",
            isPositive: true
          },
          {
            label: "Total TVL",
            value: "$850M",
            change: "5.2%",
            isPositive: true
          },
          {
            label: "Gas (Gwei)",
            value: "25",
            change: "3.1%",
            isPositive: false
          },
          {
            label: "Active Pairs",
            value: "2,450",
            change: "8.3%",
            isPositive: true
          }
        ];
        setStats(mockStats);
      } catch (error) {
        console.error("Failed to fetch market stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-4">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-32" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 backdrop-blur-lg bg-opacity-20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-2xl font-bold">{stat.value}</span>
            {stat.change && (
              <div className={`flex items-center ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                {stat.isPositive ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                <span className="ml-1">{stat.change}</span>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
