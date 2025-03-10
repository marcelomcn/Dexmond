import { Card } from "@/components/ui/card";
import { ArrowRightIcon, RefreshCcw } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Transaction {
  hash: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
}

export function RecentTransactions() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        // Mock data - in production, fetch from blockchain/API
        const mockTransactions: Transaction[] = [
          {
            hash: "0x1234...5678",
            fromToken: "ETH",
            toToken: "USDC",
            fromAmount: "1.5",
            toAmount: "2,850.25",
            timestamp: Date.now() - 120000
          },
          {
            hash: "0x8765...4321",
            fromToken: "USDC",
            toToken: "WBTC",
            fromAmount: "5,000",
            toAmount: "0.12",
            timestamp: Date.now() - 300000
          },
          {
            hash: "0x9876...5432",
            fromToken: "WETH",
            toToken: "DAI",
            fromAmount: "2.8",
            toAmount: "5,320.15",
            timestamp: Date.now() - 600000
          }
        ];
        setTransactions(mockTransactions);
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
    const interval = setInterval(fetchTransactions, 15000); // Update every 15s
    return () => clearInterval(interval);
  }, []);

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (loading) {
    return (
      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Button variant="ghost" size="sm" disabled>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="py-3 border-b border-border">
            <Skeleton className="h-6 w-full" />
          </div>
        ))}
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Recent Transactions</h2>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => setTransactions([])}
        >
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      {transactions.map((tx, index) => (
        <div 
          key={index}
          className="py-3 border-b border-border last:border-0"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <a 
                href={`https://etherscan.io/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-primary"
              >
                {tx.hash.slice(0, 6)}...{tx.hash.slice(-4)}
              </a>
              <span className="text-sm text-muted-foreground">
                {formatTime(tx.timestamp)}
              </span>
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm">
              {tx.fromAmount} {tx.fromToken}
            </span>
            <ArrowRightIcon className="h-4 w-4 mx-2 text-muted-foreground" />
            <span className="text-sm">
              {tx.toAmount} {tx.toToken}
            </span>
          </div>
        </div>
      ))}
    </Card>
  );
}
