import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAccount } from "wagmi";

interface Position {
  token: string;
  amount: string;
  value: number;
  pnl: number;
  pnlPercentage: number;
}

interface Trade {
  timestamp: number;
  type: "buy" | "sell";
  token: string;
  amount: string;
  price: number;
  total: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Portfolio() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"positions" | "history" | "analytics">("positions");

  // Mock data - in production, this would be fetched from your backend/blockchain
  const positions: Position[] = [
    {
      token: "ETH",
      amount: "2.5",
      value: 4500,
      pnl: 500,
      pnlPercentage: 12.5,
    },
    {
      token: "USDC",
      amount: "5000",
      value: 5000,
      pnl: 0,
      pnlPercentage: 0,
    },
    // Add more positions...
  ];

  const trades: Trade[] = [
    {
      timestamp: Date.now() - 3600000,
      type: "buy",
      token: "ETH",
      amount: "1.5",
      price: 1800,
      total: 2700,
    },
    {
      timestamp: Date.now() - 7200000,
      type: "sell",
      token: "USDC",
      amount: "1000",
      price: 1,
      total: 1000,
    },
    // Add more trades...
  ];

  const performanceData = [
    { date: "2024-03-01", value: 10000 },
    { date: "2024-03-02", value: 10500 },
    { date: "2024-03-03", value: 10300 },
    { date: "2024-03-04", value: 10800 },
    { date: "2024-03-05", value: 11200 },
  ];

  const allocationData = positions.map(pos => ({
    name: pos.token,
    value: pos.value,
  }));

  const formatUSD = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const totalValue = positions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const pnlPercentage = (totalPnL / (totalValue - totalPnL)) * 100;

  if (!address) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Please connect your wallet to view portfolio
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Portfolio</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Total Value</div>
              <div className="text-xl font-semibold">{formatUSD(totalValue)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">24h PnL</div>
              <div className={`text-xl font-semibold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatUSD(totalPnL)} ({pnlPercentage.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Performance</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Current Positions</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>PnL</TableHead>
                <TableHead>PnL %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {positions.map((position, index) => (
                <TableRow key={index}>
                  <TableCell>{position.token}</TableCell>
                  <TableCell>{position.amount}</TableCell>
                  <TableCell>{formatUSD(position.value)}</TableCell>
                  <TableCell className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {formatUSD(position.pnl)}
                  </TableCell>
                  <TableCell className={position.pnlPercentage >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {position.pnlPercentage.toFixed(2)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Trades</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.map((trade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(trade.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type.toUpperCase()}
                  </TableCell>
                  <TableCell>{trade.token}</TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{formatUSD(trade.price)}</TableCell>
                  <TableCell>{formatUSD(trade.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
}
