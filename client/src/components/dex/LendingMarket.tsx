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

interface LendingPool {
  token: Token;
  totalSupply: number;
  supplyApy: number;
  totalBorrowed: number;
  borrowApy: number;
  mySupplied: number;
  myBorrowed: number;
  collateralFactor: number;
}

export function LendingMarket() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedPool, setSelectedPool] = useState<LendingPool | null>(null);
  const [amount, setAmount] = useState("");
  const [action, setAction] = useState<'supply' | 'borrow' | 'withdraw' | 'repay'>('supply');

  // Mock data - In production, fetch from blockchain/API
  const lendingPools: LendingPool[] = [
    {
      token: getTokensByChain(1).find(t => t.symbol === "ETH")!,
      totalSupply: 125000000,
      supplyApy: 3.2,
      totalBorrowed: 75000000,
      borrowApy: 4.5,
      mySupplied: 5000,
      myBorrowed: 2000,
      collateralFactor: 0.8
    },
    {
      token: getTokensByChain(1).find(t => t.symbol === "USDC")!,
      totalSupply: 250000000,
      supplyApy: 4.8,
      totalBorrowed: 180000000,
      borrowApy: 6.2,
      mySupplied: 10000,
      myBorrowed: 5000,
      collateralFactor: 0.85
    },
    {
      token: getTokensByChain(1).find(t => t.symbol === "WBTC")!,
      totalSupply: 75000000,
      supplyApy: 2.5,
      totalBorrowed: 45000000,
      borrowApy: 3.8,
      mySupplied: 15000,
      myBorrowed: 0,
      collateralFactor: 0.75
    }
  ];

  const handleAction = async (pool: LendingPool) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to perform this action",
        variant: "destructive"
      });
      return;
    }

    if (!amount) {
      toast({
        title: "Enter Amount",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement actual lending/borrowing logic here
      const actionMessages = {
        supply: "Supplying",
        borrow: "Borrowing",
        withdraw: "Withdrawing",
        repay: "Repaying"
      };

      toast({
        title: `${actionMessages[action]} ${pool.token.symbol}`,
        description: `${actionMessages[action]} ${amount} ${pool.token.symbol}`
      });
    } catch (error) {
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "Failed to perform action",
        variant: "destructive"
      });
    }
  };

  const calculateHealthFactor = (pool: LendingPool) => {
    if (pool.myBorrowed === 0) return Infinity;
    const collateralValue = pool.mySupplied * pool.collateralFactor;
    return collateralValue / pool.myBorrowed;
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
        <h2 className="text-2xl font-semibold">Lending Market</h2>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asset</TableHead>
              <TableHead>Total Supply</TableHead>
              <TableHead>Supply APY</TableHead>
              <TableHead>Total Borrowed</TableHead>
              <TableHead>Borrow APY</TableHead>
              <TableHead>My Position</TableHead>
              <TableHead>Health Factor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lendingPools.map((pool) => (
              <TableRow key={pool.token.address}>
                <TableCell className="font-medium">
                  {pool.token.symbol}
                </TableCell>
                <TableCell>{formatCurrency(pool.totalSupply)}</TableCell>
                <TableCell className="text-green-500">
                  {pool.supplyApy.toFixed(2)}%
                </TableCell>
                <TableCell>{formatCurrency(pool.totalBorrowed)}</TableCell>
                <TableCell className="text-red-500">
                  {pool.borrowApy.toFixed(2)}%
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-green-500">
                      Supplied: {formatCurrency(pool.mySupplied)}
                    </div>
                    <div className="text-red-500">
                      Borrowed: {formatCurrency(pool.myBorrowed)}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className={`font-semibold ${
                    calculateHealthFactor(pool) > 1.5 ? 'text-green-500' : 'text-red-500'
                  }`}>
                    {calculateHealthFactor(pool) === Infinity ? '∞' : calculateHealthFactor(pool).toFixed(2)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Supply
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Supply {pool.token.symbol}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Amount to Supply</Label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAction('supply');
                              handleAction(pool);
                            }}
                          >
                            Supply
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Borrow
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Borrow {pool.token.symbol}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Amount to Borrow</Label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setAction('borrow');
                              handleAction(pool);
                            }}
                          >
                            Borrow
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
