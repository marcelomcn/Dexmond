
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
