import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

export function CrossChainSwap() {
  const [sourceChain, setSourceChain] = useState('ethereum');
  const [destChain, setDestChain] = useState('polygon');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('USDC');
  const [amount, setAmount] = useState('0');
  const [slippage, setSlippage] = useState(0.5);
  const [quote, setQuote] = useState({ rate: 0, output: 0, fee: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (amount && parseFloat(amount) > 0) {
      // Simulate getting a quote
      const baseRate = {
        'ETH-USDC': 3000,
        'ETH-USDT': 3000,
        'ETH-DAI': 3000,
        'USDC-ETH': 1/3000,
        'USDT-ETH': 1/3000,
        'DAI-ETH': 1/3000,
        'USDC-USDT': 1,
        'USDC-DAI': 1,
        'USDT-USDC': 1,
        'USDT-DAI': 1,
        'DAI-USDC': 1,
        'DAI-USDT': 1
      }[`${fromToken}-${toToken}`] || 1;

      // Add a small random factor to simulate price movement
      const rate = baseRate * (1 + (Math.random() * 0.02 - 0.01));
      const output = parseFloat(amount) * rate;
      const fee = output * 0.003; // 0.3% fee

      setQuote({
        rate,
        output: output - fee,
        fee
      });
    } else {
      setQuote({ rate: 0, output: 0, fee: 0 });
    }
  }, [amount, fromToken, toToken]);

  const handleSwap = () => {
    setLoading(true);
    // Simulate transaction
    setTimeout(() => {
      setLoading(false);
      // Reset the form
      setAmount('0');
    }, 2000);
  };

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cross-Chain Swap</CardTitle>
        <CardDescription>Trade tokens across different blockchains</CardDescription>
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

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">From</label>
              <span className="text-sm text-muted-foreground">Balance: 0.0</span>
            </div>
            <div className="flex space-x-2">
              <Input 
                type="number" 
                placeholder="0.00" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)}
                className="flex-grow"
              />
              <Select value={fromToken} onValueChange={setFromToken}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" className="rounded-full p-2" onClick={() => {
              setFromToken(toToken);
              setToToken(fromToken);
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 7l-5-5-5 5"></path>
                <path d="M17 17l-5 5-5-5"></path>
                <path d="M7 7h10v10H7z"></path>
              </svg>
            </Button>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <label className="block text-sm font-medium">To (Estimated)</label>
              <span className="text-sm text-muted-foreground">Balance: 0.0</span>
            </div>
            <div className="flex space-x-2">
              <Input 
                type="text" 
                placeholder="0.00" 
                value={quote.output ? formatNumber(quote.output) : '0.00'} 
                readOnly
                className="flex-grow"
              />
              <Select value={toToken} onValueChange={setToToken}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="USDT">USDT</SelectItem>
                  <SelectItem value="DAI">DAI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {quote.rate > 0 && (
          <div className="bg-muted p-3 rounded-md text-sm">
            <div className="flex justify-between">
              <span>Rate</span>
              <span>1 {fromToken} = {formatNumber(quote.rate)} {toToken}</span>
            </div>
            <div className="flex justify-between">
              <span>Fee</span>
              <span>{formatNumber(quote.fee)} {toToken}</span>
            </div>
            <div className="flex justify-between">
              <span>Slippage Tolerance</span>
              <span>{slippage}%</span>
            </div>
          </div>
        )}

        <div>
          <div className="flex justify-between mb-1">
            <label className="block text-sm font-medium">Slippage Tolerance: {slippage}%</label>
          </div>
          <Slider defaultValue={[0.5]} min={0.1} max={3} step={0.1} onValueChange={(val) => setSlippage(val[0])} />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSwap} 
          disabled={loading || !amount || parseFloat(amount) <= 0}
        >
          {loading ? "Swapping..." : "Swap"}
        </Button>
      </CardFooter>
    </Card>
  );
}