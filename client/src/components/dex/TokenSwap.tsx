import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { getTokensByChain, getTokensByCategory, addCustomToken, type Token } from "@/lib/tokens";
import { PlusCircle, Search } from "lucide-react";
import { useAccount, useChainId } from 'wagmi';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input as SearchInput } from "@/components/ui/input";

export function TokenSwap() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const { toast } = useToast();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [customTokenAddress, setCustomTokenAddress] = useState("");
  const [isAddingToken, setIsAddingToken] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Get available tokens for the current chain
  const availableTokens = chainId ? getTokensByChain(chainId) : [];

  // Filter tokens based on search term
  const filteredTokens = availableTokens.filter(token => 
    token.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    token.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group tokens by category
  const groupedTokens = filteredTokens.reduce((acc, token) => {
    const category = token.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(token);
    return acc;
  }, {} as Record<string, Token[]>);

  const handleAddCustomToken = async () => {
    if (!chainId) {
      toast({
        title: "Network Error",
        description: "Please connect to a network first",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsAddingToken(true);
      const newToken = await addCustomToken(customTokenAddress, chainId);

      if (newToken) {
        toast({
          title: "Token Added",
          description: `Successfully added custom token`
        });
        setCustomTokenAddress("");
      } else {
        throw new Error("Failed to add token");
      }
    } catch (error) {
      toast({
        title: "Error Adding Token",
        description: error instanceof Error ? error.message : "Invalid token address",
        variant: "destructive"
      });
    } finally {
      setIsAddingToken(false);
    }
  };

  const handleSwap = async () => {
    if (!isConnected) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive"
      });
      return;
    }

    if (!fromToken || !toToken) {
      toast({
        title: "Select Tokens",
        description: "Please select tokens to swap",
        variant: "destructive"
      });
      return;
    }

    if (!fromAmount) {
      toast({
        title: "Enter Amount",
        description: "Please enter an amount to swap",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: "Swap Initiated",
        description: `Swapping ${fromAmount} ${fromToken.symbol} to ${toToken.symbol}`
      });
    } catch (error) {
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Failed to execute swap",
        variant: "destructive"
      });
    }
  };

  const renderTokenList = (direction: 'from' | 'to') => (
    <SelectContent>
      <div className="p-2">
        <SearchInput
          placeholder="Search tokens..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
        />
      </div>
      <ScrollArea className="h-80">
        {Object.entries(groupedTokens).map(([category, tokens]) => (
          <SelectGroup key={category}>
            <SelectLabel className="capitalize">{category}</SelectLabel>
            {tokens.map((token) => (
              <SelectItem
                key={token.address}
                value={token.address}
                disabled={
                  (direction === 'from' && token.address === toToken?.address) ||
                  (direction === 'to' && token.address === fromToken?.address)
                }
              >
                <div className="flex items-center gap-2">
                  <span>{token.symbol}</span>
                  <span className="text-muted-foreground text-sm">- {token.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </ScrollArea>
    </SelectContent>
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>From</Label>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Token
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Token</DialogTitle>
                <DialogDescription>
                  Enter the contract address of your token
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Token Contract Address</Label>
                  <Input
                    placeholder="0x..."
                    value={customTokenAddress}
                    onChange={(e) => setCustomTokenAddress(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleAddCustomToken}
                  disabled={isAddingToken || !customTokenAddress}
                >
                  {isAddingToken ? "Adding..." : "Add Token"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex gap-2">
          <Select
            value={fromToken?.address}
            onValueChange={(value) => setFromToken(availableTokens.find(t => t.address === value) || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            {renderTokenList('from')}
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
        <Label>To</Label>
        <div className="flex gap-2">
          <Select
            value={toToken?.address}
            onValueChange={(value) => setToToken(availableTokens.find(t => t.address === value) || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            {renderTokenList('to')}
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
        disabled={!isConnected || !fromToken || !toToken || !fromAmount}
        className="w-full"
      >
        {!isConnected ? "Connect Wallet" : "Swap"}
      </Button>
    </div>
  );
}