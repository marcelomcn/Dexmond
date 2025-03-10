import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAccount, useChainId } from 'wagmi';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { getTokensByChain, type Token } from "@/lib/tokens";
import { ArrowRight, ExternalLink } from "lucide-react";

interface BridgeTransaction {
  id: string;
  fromChain: number;
  toChain: number;
  token: Token;
  amount: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: number;
  txHash: string;
}

interface ChainInfo {
  id: number;
  name: string;
  nativeToken: string;
  estimatedTime: string;
}

import React, { useState, useEffect } from "react";

const supportedChains: ChainInfo[] = [
  { id: 1, name: "Ethereum", nativeToken: "ETH", estimatedTime: "15 mins" },
  { id: 137, name: "Polygon", nativeToken: "MATIC", estimatedTime: "5 mins" },
  { id: 42161, name: "Arbitrum", nativeToken: "ETH", estimatedTime: "10 mins" },
  { id: 10, name: "Optimism", nativeToken: "ETH", estimatedTime: "10 mins" },
  { id: 56, name: "BSC", nativeToken: "BNB", estimatedTime: "5 mins" }
];

export function CrossChainBridge() {
  const { address } = useAccount();
  const currentChainId = useChainId();
  const { toast } = useToast();

  const [fromChain, setFromChain] = useState<number>(currentChainId || 1);
  const [toChain, setToChain] = useState<number>(137);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState("");

  // Fix the mock transactions section and add error handling
  const [transactions] = useState<BridgeTransaction[]>([
    {
      id: "1",
      fromChain: 1,
      toChain: 137,
      token: getTokensByChain(1).find(t => t.symbol === "USDC") || {
        symbol: "USDC",
        name: "USD Coin",
        address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        decimals: 6,
        chainId: 1,
        category: 'stablecoin',
      },
      amount: "1000",
      status: 'completed',
      timestamp: Date.now() - 3600000,
      txHash: "0x1234...5678"
    },
    {
      id: "2",
      fromChain: 137,
      toChain: 1,
      token: getTokensByChain(137).find(t => t.symbol === "MATIC") || {
        symbol: "MATIC",
        name: "Polygon",
        address: "0x0000000000000000000000000000000000001010",
        decimals: 18,
        chainId: 137,
      },
      amount: "500",
      status: 'pending',
      timestamp: Date.now() - 1800000,
      txHash: "0x8765...4321"
    }
  ]);

  const handleBridge = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to bridge tokens",
        variant: "destructive"
      });
      return;
    }

    if (!selectedToken || !amount) {
      toast({
        title: "Invalid Input",
        description: "Please select a token and enter an amount",
        variant: "destructive"
      });
      return;
    }

    try {
      // In production, implement actual bridge logic here
      toast({
        title: "Bridge Initiated",
        description: `Bridging ${amount} ${selectedToken.symbol} from ${
          supportedChains.find(c => c.id === fromChain)?.name
        } to ${
          supportedChains.find(c => c.id === toChain)?.name
        }`
      });
    } catch (error) {
      toast({
        title: "Bridge Failed",
        description: error instanceof Error ? error.message : "Failed to initiate bridge",
        variant: "destructive"
      });
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Cross-Chain Bridge</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>From Chain</Label>
              <Select
                value={fromChain.toString()}
                onValueChange={(value) => setFromChain(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem
                      key={chain.id}
                      value={chain.id.toString()}
                      disabled={chain.id === toChain}
                    >
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>To Chain</Label>
              <Select
                value={toChain.toString()}
                onValueChange={(value) => setToChain(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedChains.map((chain) => (
                    <SelectItem
                      key={chain.id}
                      value={chain.id.toString()}
                      disabled={chain.id === fromChain}
                    >
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Token</Label>
              <Select
                value={selectedToken?.address}
                onValueChange={(value) => {
                  const token = getTokensByChain(fromChain).find(t => t.address === value);
                  setSelectedToken(token || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  {getTokensByChain(fromChain).map((token) => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="0.0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="pt-4">
              <Button
                onClick={handleBridge}
                className="w-full"
                disabled={!selectedToken || !amount}
              >
                Bridge Tokens
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="space-y-4">
              {/* Update the transaction display section with error handling */}
              {transactions.map((tx) => (
                <Card key={tx.id} className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatTime(tx.timestamp)}
                      </span>
                      <span className={`text-sm font-medium ${
                        tx.status === 'completed' ? 'text-green-500' :
                        tx.status === 'pending' ? 'text-yellow-500' :
                        'text-red-500'
                      }`}>
                        {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{tx.amount} {tx.token?.symbol || 'Unknown'}</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{tx.amount} {tx.token?.symbol || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{
                        supportedChains.find(c => c.id === tx.fromChain)?.name || 'Unknown Chain'
                      }</span>
                      <ArrowRight className="h-4 w-4" />
                      <span>{
                        supportedChains.find(c => c.id === tx.toChain)?.name || 'Unknown Chain'
                      }</span>
                    </div>
                    <a
                      href={`https://etherscan.io/tx/${tx.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Transaction <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}