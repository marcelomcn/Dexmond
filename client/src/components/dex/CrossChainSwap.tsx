import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';

export function CrossChainSwap() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destChain, setDestChain] = useState('polygon');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('MATIC');
  const [amount, setAmount] = useState('');
  const [estimatedReceived, setEstimatedReceived] = useState('0.00');
  const [isSwapping, setIsSwapping] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAmountChange = (value: string) => {
    setAmount(value);
    // Mock price calculation
    if (value && !isNaN(parseFloat(value))) {
      // Simulate exchange rate
      const mockRate = fromToken === 'ETH' && toToken === 'MATIC' ? 1500 : 0.0007;
      setEstimatedReceived((parseFloat(value) * mockRate).toFixed(6));
    } else {
      setEstimatedReceived('0.00');
    }
  };

  const handleSwap = async () => {
    setIsSwapping(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(`Successfully swapped ${amount} ${fromToken} for ${estimatedReceived} ${toToken}`);
    } catch (err) {
      setError('Swap failed. Please try again.');
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Cross-Chain Swap</CardTitle>
        <CardDescription>Swap tokens across different blockchains</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>From Chain</Label>
          <Select value={sourceChain} onValueChange={setSourceChain}>
            <SelectTrigger>
              <SelectValue placeholder="Select chain" />
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
          <Label>From Token</Label>
          <Select value={fromToken} onValueChange={setFromToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
              <SelectItem value="DAI">DAI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <Label>To Chain</Label>
          <Select value={destChain} onValueChange={setDestChain}>
            <SelectTrigger>
              <SelectValue placeholder="Select chain" />
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
          <Label>To Token</Label>
          <Select value={toToken} onValueChange={setToToken}>
            <SelectTrigger>
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MATIC">MATIC</SelectItem>
              <SelectItem value="ETH">ETH</SelectItem>
              <SelectItem value="USDC">USDC</SelectItem>
              <SelectItem value="USDT">USDT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Estimated Received</Label>
          <div className="text-lg font-medium">{estimatedReceived} {toToken}</div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSwap} 
          className="w-full"
          disabled={isSwapping || !amount || parseFloat(amount) <= 0}>
          {isSwapping ? "Processing..." : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
}