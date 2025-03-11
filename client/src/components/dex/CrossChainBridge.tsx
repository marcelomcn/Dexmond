import React, { useState, useEffect, Suspense } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const networks = [
  { id: "ethereum", name: "Ethereum" },
  { id: "polygon", name: "Polygon" },
  { id: "arbitrum", name: "Arbitrum" },
  { id: "optimism", name: "Optimism" },
];

const tokens = [
  { symbol: "ETH", name: "Ethereum", chain: "ethereum" },
  { symbol: "USDC", name: "USD Coin", chain: "ethereum" },
  { symbol: "MATIC", name: "Polygon", chain: "polygon" },
  { symbol: "USDT", name: "Tether", chain: "ethereum" },
];

export const CrossChainBridge = () => {
  const [sourceNetwork, setSourceNetwork] = useState<string>("");
  const [destinationNetwork, setDestinationNetwork] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [bridgeFee, setBridgeFee] = useState<string>("0.001");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Safe initialization
  useEffect(() => {
    try {
      // Default selections
      if (!sourceNetwork && networks.length > 0) {
        setSourceNetwork(networks[0].id);
      }
      if (!destinationNetwork && networks.length > 1) {
        setDestinationNetwork(networks[1].id);
      }
      if (!token && tokens.length > 0) {
        setToken(tokens[0].symbol);
      }
    } catch (err) {
      console.error("Error initializing CrossChainBridge:", err);
      setError("Failed to initialize bridge component");
    }
  }, []);

  const handleBridge = () => {
    try {
      setLoading(true);
      // Simulate bridge operation
      setTimeout(() => {
        console.log("Bridge initiated", {
          sourceNetwork,
          destinationNetwork,
          token,
          amount,
          bridgeFee
        });
        setLoading(false);
        alert("Bridge operation would connect to actual blockchain networks in production");
      }, 1500);
    } catch (err) {
      setLoading(false);
      setError("Bridge operation failed");
      console.error("Bridge error:", err);
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
        <CardTitle>Bridge Assets</CardTitle>
        <CardDescription>Transfer tokens between different blockchain networks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Source Network</label>
          <Select value={sourceNetwork} onValueChange={setSourceNetwork}>
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem key={network.id} value={network.id}>
                  {network.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Destination Network</label>
          <Select value={destinationNetwork} onValueChange={setDestinationNetwork}>
            <SelectTrigger>
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {networks.map((network) => (
                <SelectItem 
                  key={network.id} 
                  value={network.id}
                  disabled={network.id === sourceNetwork}
                >
                  {network.name}
                </SelectItem>
              ))}
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
              {tokens
                .filter(t => !sourceNetwork || t.chain === sourceNetwork)
                .map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))}
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
          <div className="flex justify-between">
            <span className="text-sm font-medium">Bridge Fee</span>
            <span className="text-sm text-muted-foreground">{bridgeFee} ETH</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Bridge fees vary based on network congestion and destination chain
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleBridge}
          disabled={!sourceNetwork || !destinationNetwork || !token || !amount || loading}
        >
          {loading ? "Processing..." : "Bridge Tokens"}
        </Button>
      </CardFooter>
    </Card>
  );
};