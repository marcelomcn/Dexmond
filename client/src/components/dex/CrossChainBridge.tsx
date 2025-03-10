
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowDown, Info } from "lucide-react";

interface ChainInfo {
  id: number;
  name: string;
  nativeToken: string;
  estimatedTime: string;
}

const supportedChains: ChainInfo[] = [
  { id: 1, name: "Ethereum", nativeToken: "ETH", estimatedTime: "15 mins" },
  { id: 56, name: "Binance Smart Chain", nativeToken: "BNB", estimatedTime: "5 mins" },
  { id: 137, name: "Polygon", nativeToken: "MATIC", estimatedTime: "3 mins" },
  { id: 42161, name: "Arbitrum", nativeToken: "ETH", estimatedTime: "10 mins" },
];

const mockedTokens = [
  { symbol: "ETH", name: "Ethereum", balance: "1.23" },
  { symbol: "USDC", name: "USD Coin", balance: "1024.5" },
  { symbol: "USDT", name: "Tether", balance: "500" },
  { symbol: "DAI", name: "Dai Stablecoin", balance: "750.25" },
];

export const CrossChainBridge = () => {
  const [sourceChain, setSourceChain] = useState<string>("");
  const [destinationChain, setDestinationChain] = useState<string>("");
  const [sourceToken, setSourceToken] = useState<string>("");
  const [destinationToken, setDestinationToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [fee, setFee] = useState<string>("0.0");
  
  const calculateFee = () => {
    // In a real implementation, this would call a bridge API to get the actual fee
    if (amount && !isNaN(parseFloat(amount))) {
      setFee((parseFloat(amount) * 0.005).toFixed(4)); // 0.5% fee example
    } else {
      setFee("0.0");
    }
  };
  
  useEffect(() => {
    calculateFee();
  }, [amount, sourceChain, destinationChain, sourceToken]);
  
  const handleBridgeSubmit = async () => {
    // In a real implementation, this would call the actual bridge smart contract
    console.log("Initiating bridge transaction", {
      sourceChain,
      destinationChain,
      sourceToken,
      destinationToken,
      amount
    });
    
    // Here you would:
    // 1. Connect to user's wallet (using ethers or viem)
    // 2. Approve the bridge contract to use tokens
    // 3. Call the actual bridge function
    
    alert("Bridge functionality would be implemented here with real smart contract calls");
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cross-Chain Bridge</CardTitle>
        <CardDescription>Transfer tokens across different blockchain networks</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Chain</label>
          <Select
            value={sourceChain}
            onValueChange={setSourceChain}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select source chain" />
            </SelectTrigger>
            <SelectContent>
              {supportedChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.name}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium">Amount</label>
            <span className="text-sm text-muted-foreground">
              Balance: {sourceToken ? 
                mockedTokens.find(t => t.symbol === sourceToken)?.balance || "0.0" 
                : "0.0"
              }
            </span>
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1"
            />
            <Select 
              value={sourceToken}
              onValueChange={setSourceToken}
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
          <Button variant="outline" size="icon" className="rounded-full">
            <ArrowDown className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Chain</label>
          <Select
            value={destinationChain}
            onValueChange={setDestinationChain}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select destination chain" />
            </SelectTrigger>
            <SelectContent>
              {supportedChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.name}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">You'll Receive</label>
          <div className="flex space-x-2">
            <Input
              type="text"
              value={amount ? (parseFloat(amount) - parseFloat(fee)).toFixed(4) : "0.0"}
              readOnly
              className="flex-1"
            />
            <Select
              value={destinationToken}
              onValueChange={setDestinationToken}
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
        
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <div className="flex justify-between mb-1">
            <span>Bridge Fee</span>
            <span>{fee} {sourceToken}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>Estimated Time</span>
            <span>
              {sourceChain && destinationChain ? 
                supportedChains.find(c => c.name === destinationChain)?.estimatedTime || "Unknown" 
                : "Unknown"
              }
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Info className="h-3 w-3 mr-1" />
            Bridge fees vary by network congestion and token
          </div>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleBridgeSubmit}
          className="w-full"
          disabled={!sourceChain || !destinationChain || !sourceToken || !destinationToken || !amount}
        >
          Bridge Tokens
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CrossChainBridge;
