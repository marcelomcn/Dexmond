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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { getTokensByChain, type Token } from "@/lib/tokens";

interface Pool {
  id: string;
  token0: Token;
  token1: Token;
  tvl: number;
  apy: number;
  volume24h: number;
  myLiquidity: number;
  rewards: number;
}

export function LiquidityPools() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  // Mock data - In production, fetch from blockchain/API
  const pools: Pool[] = [
    {
      id: "eth-usdc",
      token0: getTokensByChain(1).find(t => t.symbol === "ETH")!,
      token1: getTokensByChain(1).find(t => t.symbol === "USDC")!,
      tvl: 25000000,
      apy: 12.5,
      volume24h: 1500000,
      myLiquidity: 5000,
      rewards: 120
    },
    {
      id: "eth-dai",
      token0: getTokensByChain(1).find(t => t.symbol === "ETH")!,
      token1: getTokensByChain(1).find(t => t.symbol === "DAI")!,
      tvl: 15000000,
      apy: 15.2,
      volume24h: 1200000,
      myLiquidity: 3000,
      rewards: 85
    },
    // Add more pool pairs here
  ];

  const handleAddLiquidity = async (pool: Pool) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to add liquidity",
        variant: "destructive"
      });
      return;
    }

    if (!amount0 || !amount1) {
      toast({
        title: "Enter Amounts",
        description: "Please enter valid amounts for both tokens",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement liquidity addition logic here
      toast({
        title: "Adding Liquidity",
        description: `Adding liquidity to ${pool.token0.symbol}/${pool.token1.symbol} pool`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add liquidity",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Liquidity Pools</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Pool</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Liquidity Pool</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-muted-foreground">
                Coming soon: Create your own liquidity pool with any token pair
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>24h Volume</TableHead>
              <TableHead>My Liquidity</TableHead>
              <TableHead>My Rewards</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell className="font-medium">
                  {pool.token0.symbol}/{pool.token1.symbol}
                </TableCell>
                <TableCell>{formatCurrency(pool.tvl)}</TableCell>
                <TableCell className="text-green-500">
                  {pool.apy.toFixed(2)}%
                </TableCell>
                <TableCell>{formatCurrency(pool.volume24h)}</TableCell>
                <TableCell>{formatCurrency(pool.myLiquidity)}</TableCell>
                <TableCell className="text-green-500">
                  ${pool.rewards.toFixed(2)}
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Add Liquidity
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          Add Liquidity: {pool.token0.symbol}/{pool.token1.symbol}
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Amount {pool.token0.symbol}</Label>
                          <Input
                            type="number"
                            placeholder="0.0"
                            value={amount0}
                            onChange={(e) => setAmount0(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Amount {pool.token1.symbol}</Label>
                          <Input
                            type="number"
                            placeholder="0.0"
                            value={amount1}
                            onChange={(e) => setAmount1(e.target.value)}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleAddLiquidity(pool)}
                        >
                          Add Liquidity
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
