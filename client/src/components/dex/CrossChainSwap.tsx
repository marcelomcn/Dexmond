import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowDownUp } from "lucide-react";

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

  const handleFromAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleSwap = async () => {
    // In a real implementation, this would call actual swap functions
    console.log("Swap initiated", {
      fromToken,
      toToken,
      fromAmount,
      toAmount,
      slippage
    });

    alert("Swap functionality would be implemented with real blockchain interactions");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Swap</CardTitle>
        <CardDescription>Exchange tokens at the best rates</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">From</label>
            <span className="text-sm text-muted-foreground">
              Balance: {fromToken ? 
                mockedTokens.find(t => t.symbol === fromToken)?.balance || "0.0" 
                : "0.0"
              }
            </span>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={fromAmount}
              onChange={handleFromAmountChange}
              placeholder="0.0"
              className="flex-1"
            />
            <Select 
              value={fromToken}
              onValueChange={setFromToken}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                {mockedTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="rounded-full"
            onClick={() => {
              const tempToken = fromToken;
              const tempAmount = fromAmount;
              setFromToken(toToken);
              setFromAmount(toAmount);
              setToToken(tempToken);
              setToAmount(tempAmount);
            }}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">To</label>
            <span className="text-sm text-muted-foreground">
              Balance: {toToken ? 
                mockedTokens.find(t => t.symbol === toToken)?.balance || "0.0" 
                : "0.0"
              }
            </span>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={toAmount}
              readOnly
              placeholder="0.0"
              className="flex-1"
            />
            <Select
              value={toToken}
              onValueChange={setToToken}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                {mockedTokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Slippage Tolerance</label>
          <div className="flex space-x-2">
            {["0.5", "1.0", "2.0"].map((value) => (
              <Button
                key={value}
                variant={slippage === value ? "default" : "outline"}
                size="sm"
                onClick={() => setSlippage(value)}
                className="flex-1"
              >
                {value}%
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-4 p-3 bg-muted rounded-md">
          <div className="flex justify-between text-sm">
            <span>Exchange Rate</span>
            <span>
              {fromToken && toToken && fromAmount && toAmount ? 
                `1 ${fromToken} ≈ ${(parseFloat(toAmount) / parseFloat(fromAmount)).toFixed(6)} ${toToken}` 
                : "—"
              }
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          onClick={handleSwap}
          className="w-full"
          disabled={!fromToken || !toToken || !fromAmount || fromToken === toToken}
        >
          Swap
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrossChainSwap;