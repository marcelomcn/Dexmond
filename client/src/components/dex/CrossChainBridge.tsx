import React, { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Define token options
const tokens = [
  { symbol: "ETH", name: "Ethereum", chain: "ethereum" },
  { symbol: "USDC", name: "USD Coin", chain: "ethereum" },
  { symbol: "MATIC", name: "Polygon", chain: "polygon" },
  { symbol: "USDT", name: "Tether", chain: "ethereum" },
];

// Define networks for selection
const networks = [
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
  { id: "bsc", name: "Binance Smart Chain" },
  { id: "avalanche", name: "Avalanche" }
];

export function CrossChainBridge() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destChain, setDestChain] = useState('polygon');
  const [token, setToken] = useState('USDC');
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBridge = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    if (!recipientAddress) {
      alert('Please enter a recipient address');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('This is a demo. In a real application, this would initiate a cross-chain bridge transfer.');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg border-border">
      <CardHeader>
        <CardTitle>Bridge Assets</CardTitle>
        <CardDescription>Transfer tokens between blockchain networks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert className="bg-blue-900/20 border-blue-800">
          <AlertDescription>
            Bridge transfers typically take 10-30 minutes to complete.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <label className="text-sm font-medium">Source Chain</label>
          <Select value={sourceChain} onValueChange={setSourceChain}>
            <SelectTrigger>
              <SelectValue placeholder="Select source chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="bsc">Binance Smart Chain</SelectItem>
              <SelectItem value="avalanche">Avalanche</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Chain</label>
          <Select value={destChain} onValueChange={setDestChain}>
            <SelectTrigger>
              <SelectValue placeholder="Select destination chain" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ethereum">Ethereum</SelectItem>
              <SelectItem value="polygon">Polygon</SelectItem>
              <SelectItem value="bsc">Binance Smart Chain</SelectItem>
              <SelectItem value="avalanche">Avalanche</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Token</label>
          <Select value={token} onValueChange={setToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="MATIC">MATIC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <Input 
            type="number" 
            placeholder="0.0" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Recipient Address</label>
          <Input 
            placeholder="0x..." 
            value={recipientAddress} 
            onChange={(e) => setRecipientAddress(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleBridge}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Bridge Tokens'}
        </Button>
      </CardFooter>
    </Card>
  );
}