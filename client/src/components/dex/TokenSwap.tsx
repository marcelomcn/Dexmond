import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWeb3 } from "@/lib/web3";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Sample token list - in production would be fetched from an API
const tokens = [
  { symbol: "ETH", name: "Ethereum", address: "0x0000000000000000000000000000000000000000" },
  { symbol: "USDC", name: "USD Coin", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48" }
];

export function TokenSwap() {
  const { address, executeSwap } = useWeb3();
  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSwap = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      await executeSwap({
        fromToken,
        toToken,
        amount: fromAmount
      });
      
      toast({
        title: "Swap Successful",
        description: `Swapped ${fromAmount} ${fromToken.symbol} to ${toAmount} ${toToken.symbol}`
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Failed to execute swap",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <label>From</label>
        <div className="flex gap-2">
          <Select 
            value={fromToken.symbol}
            onValueChange={(value) => setFromToken(tokens.find(t => t.symbol === value)!)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.0"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label>To</label>
        <div className="flex gap-2">
          <Select
            value={toToken.symbol}
            onValueChange={(value) => setToToken(tokens.find(t => t.symbol === value)!)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {tokens.map(token => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.symbol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="number"
            value={toAmount}
            onChange={(e) => setToAmount(e.target.value)}
            placeholder="0.0"
            disabled
          />
        </div>
      </div>

      <Button 
        onClick={handleSwap}
        disabled={!address || !fromAmount || loading}
        className="w-full"
      >
        {loading ? "Swapping..." : "Swap"}
      </Button>
    </div>
  );
}
