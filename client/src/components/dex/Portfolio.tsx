
import { useState, useEffect } from "react";
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
  Legend,
} from "recharts";
import { useAccount } from "wagmi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supportedChains, getTokenBalance, getTokenPrice } from "@/lib/crosschain";
import { ethers } from "ethers";

interface Position {
  chainId: number;
  chainName: string;
  token: string;
  tokenAddress: string;
  amount: string;
  value: number;
  pnl: number;
  pnlPercentage: number;
}

interface Trade {
  timestamp: number;
  type: "buy" | "sell" | "bridge";
  chainId: number;
  chainName: string;
  token: string;
  amount: string;
  price: number;
  total: number;
  txHash?: string;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function Portfolio() {
  const { address } = useAccount();
  const [activeTab, setActiveTab] = useState<"positions" | "history" | "analytics">("positions");
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string>("all");
  const [trades, setTrades] = useState<Trade[]>([]);
  const [bridgeHistory, setBridgeHistory] = useState<any[]>([]);
  
  // Common token addresses for different chains (in production, get from a token list API)
  const commonTokens = {
    ethereum: [
      { symbol: "ETH", address: ethers.constants.AddressZero },
      { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" },
      { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7" },
      { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F" },
    ],
    bsc: [
      { symbol: "BNB", address: ethers.constants.AddressZero },
      { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56" },
      { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955" },
    ],
    polygon: [
      { symbol: "MATIC", address: ethers.constants.AddressZero },
      { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
      { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F" },
    ],
    arbitrum: [
      { symbol: "ETH", address: ethers.constants.AddressZero },
      { symbol: "USDC", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8" },
    ],
  };

  // Fetch wallet balances across multiple chains
  useEffect(() => {
    const fetchWalletBalances = async () => {
      if (!address || !window.ethereum) {
        setPositions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const allPositions: Position[] = [];
        
        // Iterate over supported chains
        for (const [chainKey, chain] of Object.entries(supportedChains)) {
          try {
            // Get native token balance
            const nativeBalance = await getTokenBalance(
              chain.id, 
              ethers.constants.AddressZero, 
              address
            );
            
            // Only add if balance > 0
            if (parseFloat(nativeBalance) > 0) {
              const nativePrice = await getTokenPrice(chain.id, ethers.constants.AddressZero);
              const nativeValue = parseFloat(nativeBalance) * nativePrice;
              
              allPositions.push({
                chainId: chain.id,
                chainName: chain.name,
                token: chain.nativeCurrency.symbol,
                tokenAddress: ethers.constants.AddressZero,
                amount: nativeBalance,
                value: nativeValue,
                pnl: 0, // Would calculate from historical data in production
                pnlPercentage: 0, // Would calculate from historical data in production
              });
            }
            
            // Get common token balances for this chain
            const tokens = commonTokens[chainKey as keyof typeof commonTokens] || [];
            for (const token of tokens) {
              if (token.address !== ethers.constants.AddressZero) { // Skip native token
                const tokenBalance = await getTokenBalance(chain.id, token.address, address);
                
                if (parseFloat(tokenBalance) > 0) {
                  const tokenPrice = await getTokenPrice(chain.id, token.address);
                  const tokenValue = parseFloat(tokenBalance) * tokenPrice;
                  
                  allPositions.push({
                    chainId: chain.id,
                    chainName: chain.name,
                    token: token.symbol,
                    tokenAddress: token.address,
                    amount: tokenBalance,
                    value: tokenValue,
                    pnl: 0,
                    pnlPercentage: 0,
                  });
                }
              }
            }
          } catch (chainError) {
            console.error(`Error fetching balances for ${chain.name}:`, chainError);
            // Continue with other chains even if one fails
          }
        }
        
        setPositions(allPositions);
        
        // In production, would fetch real transaction history
        // For now, just create mock trades based on positions
        const mockTrades: Trade[] = allPositions.map(pos => ({
          timestamp: Date.now() - Math.random() * 86400000,
          type: Math.random() > 0.5 ? "buy" : "sell",
          chainId: pos.chainId,
          chainName: pos.chainName,
          token: pos.token,
          amount: (parseFloat(pos.amount) * 0.5).toFixed(4),
          price: pos.value / parseFloat(pos.amount),
          total: pos.value * 0.5,
          txHash: `0x${Math.random().toString(16).substring(2)}`,
        }));
        
        // Add some cross-chain bridge transactions
        if (allPositions.length >= 2) {
          const sourcePosition = allPositions[0];
          const targetPosition = allPositions[1];
          
          mockTrades.push({
            timestamp: Date.now() - 36000000,
            type: "bridge",
            chainId: sourcePosition.chainId,
            chainName: sourcePosition.chainName,
            token: sourcePosition.token,
            amount: (parseFloat(sourcePosition.amount) * 0.3).toFixed(4),
            price: sourcePosition.value / parseFloat(sourcePosition.amount),
            total: sourcePosition.value * 0.3,
            txHash: `0x${Math.random().toString(16).substring(2)}`,
          });
        }
        
        setTrades(mockTrades.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error("Error fetching wallet balances:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletBalances();
    // Refresh every 2 minutes
    const interval = setInterval(fetchWalletBalances, 120000);
    return () => clearInterval(interval);
  }, [address]);

  // Filter positions by selected chain
  const filteredPositions = selectedChain === "all"
    ? positions
    : positions.filter(pos => pos.chainName.toLowerCase() === selectedChain.toLowerCase());

  // Performance data - in production, fetch from an API
  const performanceData = [
    { date: "2024-03-01", value: 10000 },
    { date: "2024-03-02", value: 10500 },
    { date: "2024-03-03", value: 10300 },
    { date: "2024-03-04", value: 10800 },
    { date: "2024-03-05", value: 11200 },
  ];

  const allocationData = filteredPositions.map(pos => ({
    name: `${pos.token} (${pos.chainName})`,
    value: pos.value,
  }));

  const formatUSD = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);

  const totalValue = filteredPositions.reduce((sum, pos) => sum + pos.value, 0);
  const totalPnL = filteredPositions.reduce((sum, pos) => sum + pos.pnl, 0);
  const pnlPercentage = totalValue === 0 ? 0 : (totalPnL / (totalValue - totalPnL)) * 100;

  if (!address) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Please connect your wallet to view portfolio
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Loading wallet balances across chains...
        </div>
      </Card>
    );
  }

  if (positions.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No assets found in this wallet across any supported chains
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
            <Select value={selectedChain} onValueChange={setSelectedChain}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                {Object.values(supportedChains).map(chain => (
                  <SelectItem key={chain.id} value={chain.name.toLowerCase()}>
                    {chain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="positions">Positions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <TabsContent value="positions" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Chain</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead className="text-right">24h PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPositions.map((position, index) => (
                  <TableRow key={index}>
                    <TableCell>{position.chainName}</TableCell>
                    <TableCell>{position.token}</TableCell>
                    <TableCell>{position.amount}</TableCell>
                    <TableCell className="text-right">{formatUSD(position.value)}</TableCell>
                    <TableCell className={`text-right ${position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatUSD(position.pnl)} ({position.pnlPercentage.toFixed(2)}%)
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="history" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>Asset</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade, index) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(trade.timestamp).toLocaleString()}</TableCell>
                    <TableCell className={
                      trade.type === "buy" 
                        ? "text-green-500" 
                        : trade.type === "sell" 
                        ? "text-red-500" 
                        : "text-blue-500"
                    }>
                      {trade.type === "bridge" ? "Bridge" : trade.type === "buy" ? "Buy" : "Sell"}
                    </TableCell>
                    <TableCell>{trade.chainName}</TableCell>
                    <TableCell>{trade.token}</TableCell>
                    <TableCell>{trade.amount}</TableCell>
                    <TableCell className="text-right">{formatUSD(trade.price)}</TableCell>
                    <TableCell className="text-right">{formatUSD(trade.total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          <TabsContent value="analytics" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Portfolio Performance</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis tickFormatter={(value) => `$${value}`} />
                      <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                      <Line type="monotone" dataKey="value" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Asset Allocation</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip formatter={(value) => formatUSD(value as number)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
