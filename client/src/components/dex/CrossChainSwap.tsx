
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

const mockedTokens = [
  { symbol: "ETH", name: "Ethereum", balance: "1.23" },
  { symbol: "USDC", name: "USD Coin", balance: "1024.5" },
  { symbol: "USDT", name: "Tether", balance: "500" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "750.25" },
];

export const CrossChainSwap = () => {
  const [fromToken, setFromToken] = useState<string>("");
  const [toToken, setToToken] = useState<string>("");
  const [fromAmount, setFromAmount] = useState<string>("");
  const [toAmount, setToAmount] = useState<string>("");
  const [slippage, setSlippage] = useState<string>("0.5");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safe initialization
  useEffect(() => {
    try {
      if (!fromToken && mockedTokens.length > 0) {
        setFromToken(mockedTokens[0].symbol);
      }
      if (!toToken && mockedTokens.length > 1) {
        setToToken(mockedTokens[1].symbol);
      }
    } catch (err) {
      console.error("Error initializing CrossChainSwap:", err);
      setError("Failed to initialize swap component");
    }
  }, []);

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const value = e.target.value;
      setFromAmount(value);

      // In a real implementation, you would call a price API or on-chain function
      if (value && !isNaN(parseFloat(value))) {
        // Simplified price calculation for demo
        const rate = 1.2; // Example exchange rate
        setToAmount((parseFloat(value) * rate).toFixed(6));
      } else {
        setToAmount("");
      }
    } catch (err) {
      console.error("Error calculating swap amount:", err);
    }
  };

  const handleSwap = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would call actual swap functions
      console.log("Swap initiated", {
        fromToken,
        toToken,
        fromAmount,
        toAmount,
        slippage
      });

      // Simulate network delay
      setTimeout(() => {
        setLoading(false);
        alert("Swap functionality would be implemented with real blockchain interactions");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("Swap operation failed");
      console.error("Swap error:", err);
    }
  };

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Something went wrong</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500">{error}</div>
          <Button 
            className="mt-4 w-full" 
            variant="outline"
            onClick={() => setError(null)}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cross-Chain Swap</CardTitle>
        <CardDescription>Swap tokens across different blockchain networks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From</label>
            <span className="text-xs text-muted-foreground">
              Balance: {mockedTokens.find(t => t.symbol === fromToken)?.balance || "0.00"}
            </span>
          </div>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={fromAmount}
              onChange={handleFromAmountChange}
              className="flex-1"
            />
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {mockedTokens.map((token) => (
                  <SelectItem 
                    key={token.symbol} 
                    value={token.symbol}
                    disabled={token.symbol === toToken}
                  >
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0"
            onClick={() => {
              const temp = fromToken;
              setFromToken(toToken);
              setToToken(temp);
              
              const tempAmount = fromAmount;
              setFromAmount(toAmount);
              setToAmount(tempAmount);
            }}
          >
            ↓↑
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">To</label>
          <div className="flex space-x-2">
            <Input
              type="number"
              placeholder="0.0"
              value={toAmount}
              readOnly
              className="flex-1"
            />
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                {mockedTokens.map((token) => (
                  <SelectItem 
                    key={token.symbol} 
                    value={token.symbol}
                    disabled={token.symbol === fromToken}
                  >
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Slippage Tolerance</label>
            <span className="text-sm">{slippage}%</span>
          </div>
          <Slider
            value={[parseFloat(slippage)]}
            min={0.1}
            max={5}
            step={0.1}
            onValueChange={(values) => setSlippage(values[0].toFixed(1))}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0.1%</span>
            <span>5%</span>
          </div>
        </div>
        
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Exchange Rate</span>
            <span>1 {fromToken} ≈ 1.2 {toToken}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Network Fee</span>
            <span>≈ 0.005 ETH</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSwap}
          disabled={!fromToken || !toToken || !fromAmount || loading}
        >
          {loading ? "Processing..." : "Swap Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
};

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function CrossChainSwap() {
  const [fromChain, setFromChain] = useState('ethereum');
  const [toChain, setToChain] = useState('polygon');
  const [fromToken, setFromToken] = useState('ETH');
  const [toToken, setToToken] = useState('MATIC');
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwap = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('This is a demo. In a real application, this would initiate a cross-chain swap.');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-card shadow-lg border-border">
      <CardHeader>
        <CardTitle>Cross-Chain Swap</CardTitle>
        <CardDescription>Swap tokens across different blockchain networks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From Chain</label>
            <label className="text-sm font-medium">From Token</label>
          </div>
          <div className="flex gap-2">
            <Select value={fromChain} onValueChange={setFromChain}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="bsc">Binance Smart Chain</SelectItem>
                <SelectItem value="avalanche">Avalanche</SelectItem>
              </SelectContent>
            </Select>
            <Select value={fromToken} onValueChange={setFromToken}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ETH">ETH</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="border-4 border-background rounded-full bg-muted p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground">
                <path d="M7 10l5 5 5-5"/>
                <path d="M7 15l5-5 5 5"/>
              </svg>
            </div>
          </div>
          <div className="h-12"></div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">To Chain</label>
            <label className="text-sm font-medium">To Token</label>
          </div>
          <div className="flex gap-2">
            <Select value={toChain} onValueChange={setToChain}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
              </SelectContent>
            </Select>
            <Select value={toToken} onValueChange={setToToken}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MATIC">MATIC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="USDC">USDC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">Amount</label>
          <Input 
            type="number" 
            placeholder="0.0" 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Estimated Fee:</span>
          <span>0.005 {fromToken}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSwap} 
          disabled={isLoading} 
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Swap'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
