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

interface Farm {
  id: string;
  name: string;
  apy: number;
  tvl: number;
  rewards: string;
  stakedAmount: number;
  earnedRewards: number;
  multiplier: string;
}

export function YieldFarming() {
  const { address } = useAccount();
  const { toast } = useToast();
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [stakeAmount, setStakeAmount] = useState("");

  // Mock data - In production, fetch from blockchain/API
  const farms: Farm[] = [
    {
      id: "eth-usdc-farm",
      name: "ETH-USDC LP",
      apy: 45.5,
      tvl: 12500000,
      rewards: "DEX + ETH",
      stakedAmount: 1500,
      earnedRewards: 125,
      multiplier: "40x"
    },
    {
      id: "eth-dai-farm",
      name: "ETH-DAI LP",
      apy: 38.2,
      tvl: 8750000,
      rewards: "DEX",
      stakedAmount: 2200,
      earnedRewards: 180,
      multiplier: "30x"
    },
    {
      id: "wbtc-eth-farm",
      name: "WBTC-ETH LP",
      apy: 52.8,
      tvl: 15000000,
      rewards: "DEX + WBTC",
      stakedAmount: 3500,
      earnedRewards: 290,
      multiplier: "50x"
    }
  ];

  const handleStake = async (farm: Farm) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to stake",
        variant: "destructive"
      });
      return;
    }

    if (!stakeAmount) {
      toast({
        title: "Enter Amount",
        description: "Please enter a valid amount to stake",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement staking logic here
      toast({
        title: "Staking Initiated",
        description: `Staking ${stakeAmount} LP tokens in ${farm.name}`
      });
    } catch (error) {
      toast({
        title: "Staking Failed",
        description: error instanceof Error ? error.message : "Failed to stake tokens",
        variant: "destructive"
      });
    }
  };

  const handleHarvest = async (farm: Farm) => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to harvest rewards",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement harvesting logic here
      toast({
        title: "Harvesting Rewards",
        description: `Harvesting rewards from ${farm.name}`
      });
    } catch (error) {
      toast({
        title: "Harvest Failed",
        description: error instanceof Error ? error.message : "Failed to harvest rewards",
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
        <h2 className="text-2xl font-semibold">Yield Farming</h2>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Farm</TableHead>
              <TableHead>APY</TableHead>
              <TableHead>TVL</TableHead>
              <TableHead>Rewards</TableHead>
              <TableHead>Multiplier</TableHead>
              <TableHead>My Stake</TableHead>
              <TableHead>Earned</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {farms.map((farm) => (
              <TableRow key={farm.id}>
                <TableCell className="font-medium">
                  {farm.name}
                </TableCell>
                <TableCell className="text-green-500">
                  {farm.apy.toFixed(2)}%
                </TableCell>
                <TableCell>{formatCurrency(farm.tvl)}</TableCell>
                <TableCell>{farm.rewards}</TableCell>
                <TableCell>{farm.multiplier}</TableCell>
                <TableCell>{formatCurrency(farm.stakedAmount)}</TableCell>
                <TableCell className="text-green-500">
                  ${farm.earnedRewards.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          Stake
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>
                            Stake in {farm.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Amount to Stake</Label>
                            <Input
                              type="number"
                              placeholder="0.0"
                              value={stakeAmount}
                              onChange={(e) => setStakeAmount(e.target.value)}
                            />
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleStake(farm)}
                          >
                            Stake LP Tokens
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleHarvest(farm)}
                      disabled={farm.earnedRewards <= 0}
                    >
                      Harvest
                    </Button>
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
