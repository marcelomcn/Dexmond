import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from '@/components/ui/alert';

export function CrossChainBridge() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destChain, setDestChain] = useState('polygon');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('0');
  const [slippage, setSlippage] = useState(0.5);
  const [bridging, setBridging] = useState(false);
  const [txHash, setTxHash] = useState('');

  const handleBridge = () => {
    setBridging(true);
    // Simulate bridge transaction
    setTimeout(() => {
      setBridging(false);
      setTxHash('0x' + Math.random().toString(16).substring(2, 16) + Math.random().toString(16).substring(2, 16));
    }, 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Chain Bridge</CardTitle>
        <CardDescription>Transfer tokens between different blockchains</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Source Chain</label>
            <Select value={sourceChain} onValueChange={setSourceChain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
                <SelectItem value="binance">Binance Smart Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Destination Chain</label>
            <Select value={destChain} onValueChange={setDestChain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
                <SelectItem value="binance">Binance Smart Chain</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Token</label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="WBTC">WBTC</SelectItem>
              <SelectItem value="DAI">DAI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <Input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium">Slippage Tolerance: {slippage}%</label>
          </div>
          <Slider defaultValue={[0.5]} min={0.1} max={3} step={0.1} onValueChange={(val) => setSlippage(val[0])} />
        </div>

        {txHash && (
          <Alert>
            <AlertDescription>
              Bridge initiated! Transaction hash: <a href="#" className="underline">{txHash}</a>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleBridge} disabled={bridging}>
          {bridging ? "Bridging..." : "Bridge Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
}