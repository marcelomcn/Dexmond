
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowDown, ArrowRight, Shuffle } from "lucide-react";
import { useAccount } from "wagmi";
import { useToast } from "@/components/ui/use-toast";
import { ethers } from "ethers";

import { 
  supportedChains, 
  getTokenBalance, 
  getTokenPrice, 
  findBridgeProvider 
} from "@/lib/crosschain";

// Common token addresses per chain (in production, fetch from token list API)
const commonTokens = {
  ethereum: [
    { symbol: "ETH", address: ethers.constants.AddressZero, decimals: 18 },
    { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6 },
    { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6 },
    { symbol: "DAI", address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", decimals: 18 },
  ],
  bsc: [
    { symbol: "BNB", address: ethers.constants.AddressZero, decimals: 18 },
    { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18 },
    { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18 },
  ],
  polygon: [
    { symbol: "MATIC", address: ethers.constants.AddressZero, decimals: 18 },
    { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6 },
    { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6 },
  ],
  arbitrum: [
    { symbol: "ETH", address: ethers.constants.AddressZero, decimals: 18 },
    { symbol: "USDC", address: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", decimals: 6 },
  ],
};

export function CrossChainSwap() {
  const { address } = useAccount();
  const { toast } = useToast();
  
  // Source chain state
  const [sourceChain, setSourceChain] = useState("ethereum");
  const [sourceToken, setSourceToken] = useState("");
  const [sourceAmount, setSourceAmount] = useState("");
  const [sourceBalance, setSourceBalance] = useState("0");
  const [sourceUsdValue, setSourceUsdValue] = useState(0);
  
  // Target chain state
  const [targetChain, setTargetChain] = useState("polygon");
  const [targetToken, setTargetToken] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetUsdValue, setTargetUsdValue] = useState(0);
  
  // Bridge state
  const [bridgeProvider, setBridgeProvider] = useState<string | null>(null);
  const [bridgeFee, setBridgeFee] = useState<string>("0");
  const [isQuoting, setIsQuoting] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [bridgeTime, setBridgeTime] = useState("15-30 minutes");
  
  // Set default tokens when chains are selected
  useEffect(() => {
    const sourceTokenList = commonTokens[sourceChain as keyof typeof commonTokens] || [];
    if (sourceTokenList.length > 0 && !sourceToken) {
      setSourceToken(sourceTokenList[0].address);
    }
    
    const targetTokenList = commonTokens[targetChain as keyof typeof commonTokens] || [];
    if (targetTokenList.length > 0 && !targetToken) {
      setTargetToken(targetTokenList[0].address);
    }
  }, [sourceChain, targetChain, sourceToken, targetToken]);
  
  // Update source balance when wallet, chain, or token changes
  useEffect(() => {
    const updateSourceBalance = async () => {
      if (!address || !sourceToken) return;
      
      try {
        const chainId = Object.values(supportedChains).find(
          chain => chain.name.toLowerCase() === sourceChain.toLowerCase()
        )?.id;
        
        if (!chainId) return;
        
        const balance = await getTokenBalance(chainId, sourceToken, address);
        setSourceBalance(balance);
      } catch (error) {
        console.error("Error fetching source balance:", error);
      }
    };
    
    updateSourceBalance();
  }, [address, sourceChain, sourceToken]);
  
  // Update bridge provider when source or target chains change
  useEffect(() => {
    const updateBridgeProvider = async () => {
      const sourceChainId = Object.values(supportedChains).find(
        chain => chain.name.toLowerCase() === sourceChain.toLowerCase()
      )?.id;
      
      const targetChainId = Object.values(supportedChains).find(
        chain => chain.name.toLowerCase() === targetChain.toLowerCase()
      )?.id;
      
      if (!sourceChainId || !targetChainId) {
        setBridgeProvider(null);
        return;
      }
      
      const provider = findBridgeProvider(sourceChainId, targetChainId);
      setBridgeProvider(provider?.name || null);
      
      if (provider && sourceToken && sourceAmount) {
        try {
          setIsQuoting(true);
          const fee = await provider.estimateFee(
            sourceChainId,
            targetChainId,
            sourceToken,
            sourceAmount
          );
          setBridgeFee(fee);
        } catch (error) {
          console.error("Error estimating bridge fee:", error);
          setBridgeFee("Error");
        } finally {
          setIsQuoting(false);
        }
      }
    };
    
    updateBridgeProvider();
  }, [sourceChain, targetChain, sourceToken, sourceAmount]);
  
  // Update USD values when amounts change
  useEffect(() => {
    const updateUsdValues = async () => {
      try {
        if (sourceToken && sourceAmount) {
          const sourceChainId = Object.values(supportedChains).find(
            chain => chain.name.toLowerCase() === sourceChain.toLowerCase()
          )?.id;
          
          if (sourceChainId) {
            const price = await getTokenPrice(sourceChainId, sourceToken);
            setSourceUsdValue(parseFloat(sourceAmount) * price);
          }
        }
        
        if (targetToken && targetAmount) {
          const targetChainId = Object.values(supportedChains).find(
            chain => chain.name.toLowerCase() === targetChain.toLowerCase()
          )?.id;
          
          if (targetChainId) {
            const price = await getTokenPrice(targetChainId, targetToken);
            setTargetUsdValue(parseFloat(targetAmount) * price);
          }
        }
      } catch (error) {
        console.error("Error updating USD values:", error);
      }
    };
    
    updateUsdValues();
  }, [sourceToken, sourceAmount, targetToken, targetAmount, sourceChain, targetChain]);
  
  // Set target amount when source amount changes (accounting for fees)
  useEffect(() => {
    if (sourceAmount && bridgeFee !== "Error") {
      const amount = parseFloat(sourceAmount);
      const fee = parseFloat(bridgeFee);
      const targetAmt = amount - fee;
      
      if (targetAmt > 0) {
        setTargetAmount(targetAmt.toString());
      } else {
        setTargetAmount("0");
      }
    }
  }, [sourceAmount, bridgeFee]);
  
  // Swap chains
  const handleSwapChains = () => {
    const tempChain = sourceChain;
    const tempToken = sourceToken;
    
    setSourceChain(targetChain);
    setSourceToken(targetToken);
    setTargetChain(tempChain);
    setTargetToken(tempToken);
    
    // Reset amounts
    setSourceAmount("");
    setTargetAmount("");
  };
  
  // Handle max amount
  const handleMaxAmount = () => {
    setSourceAmount(sourceBalance);
  };
  
  // Execute cross-chain swap
  const handleCrossChainSwap = async () => {
    if (!address) {
      toast({
        title: "Connect Wallet",
        description: "Please connect your wallet to swap",
        variant: "destructive",
      });
      return;
    }
    
    if (!sourceAmount || parseFloat(sourceAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to swap",
        variant: "destructive",
      });
      return;
    }
    
    if (parseFloat(sourceAmount) > parseFloat(sourceBalance)) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance",
        variant: "destructive",
      });
      return;
    }
    
    if (!bridgeProvider) {
      toast({
        title: "Bridge Unavailable",
        description: "No bridge provider available for this path",
        variant: "destructive",
      });
      return;
    }
    
    setIsSwapping(true);
    
    try {
      const sourceChainId = Object.values(supportedChains).find(
        chain => chain.name.toLowerCase() === sourceChain.toLowerCase()
      )?.id;
      
      const targetChainId = Object.values(supportedChains).find(
        chain => chain.name.toLowerCase() === targetChain.toLowerCase()
      )?.id;
      
      if (!sourceChainId || !targetChainId) {
        throw new Error("Invalid chain selection");
      }
      
      const provider = findBridgeProvider(sourceChainId, targetChainId);
      
      if (!provider) {
        throw new Error("Bridge provider not available");
      }
      
      // This would be replaced with actual bridge transaction in production
      // Here we're simulating the process
      setTimeout(() => {
        toast({
          title: "Transaction Initiated",
          description: "Your cross-chain swap has been initiated",
        });
        
        setIsSwapping(false);
        setSourceAmount("");
        setTargetAmount("");
        
        // In production, would track the transaction status and update UI accordingly
      }, 2000);
    } catch (error) {
      console.error("Error executing cross-chain swap:", error);
      toast({
        title: "Swap Failed",
        description: error instanceof Error ? error.message : "Failed to execute swap",
        variant: "destructive",
      });
      setIsSwapping(false);
    }
  };
  
  const getTokenList = (chainName: string) => {
    return commonTokens[chainName as keyof typeof commonTokens] || [];
  };
  
  const getTokenSymbol = (chainName: string, address: string) => {
    const token = getTokenList(chainName).find(t => t.address === address);
    return token ? token.symbol : "Unknown";
  };
  
  const formatUSD = (value: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Cross-Chain Swap</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Source Chain */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>From</Label>
              {address && <div className="text-sm text-muted-foreground">
                Balance: {parseFloat(sourceBalance).toFixed(6)}
              </div>}
            </div>
            
            <div className="flex gap-2">
              <Select value={sourceChain} onValueChange={setSourceChain}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(supportedChains).map(chain => (
                    <SelectItem key={chain.id} value={chain.name.toLowerCase()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sourceToken} onValueChange={setSourceToken}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {getTokenList(sourceChain).map(token => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <Input
                type="number"
                placeholder="0.0"
                value={sourceAmount}
                onChange={(e) => setSourceAmount(e.target.value)}
                className="pr-16"
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={handleMaxAmount}
              >
                MAX
              </Button>
            </div>
            
            {sourceAmount && <div className="text-sm text-muted-foreground">
              ≈ {formatUSD(sourceUsdValue)}
            </div>}
          </div>
          
          {/* Target Chain */}
          <div className="space-y-4">
            <div className="flex justify-between">
              <Label>To</Label>
              <Button variant="ghost" size="sm" onClick={handleSwapChains}>
                <Shuffle className="h-4 w-4 mr-1" /> Swap Chains
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Select value={targetChain} onValueChange={setTargetChain}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Chain" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(supportedChains).map(chain => (
                    <SelectItem key={chain.id} value={chain.name.toLowerCase()}>
                      {chain.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={targetToken} onValueChange={setTargetToken}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  {getTokenList(targetChain).map(token => (
                    <SelectItem key={token.address} value={token.address}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Input
              type="number"
              placeholder="0.0"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              disabled
            />
            
            {targetAmount && <div className="text-sm text-muted-foreground">
              ≈ {formatUSD(targetUsdValue)}
            </div>}
          </div>
        </div>
        
        {/* Swap Details */}
        {sourceAmount && parseFloat(sourceAmount) > 0 && (
          <div className="bg-secondary/50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Bridge Provider</span>
              <span>{bridgeProvider || "Not available"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Bridge Fee</span>
              <span>{isQuoting ? <Loader2 className="h-4 w-4 animate-spin" /> : bridgeFee}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Time</span>
              <span>{bridgeTime}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Rate</span>
              <span>
                1 {getTokenSymbol(sourceChain, sourceToken)} ≈ {" "}
                {(parseFloat(targetAmount) / parseFloat(sourceAmount)).toFixed(6)}{" "}
                {getTokenSymbol(targetChain, targetToken)}
              </span>
            </div>
          </div>
        )}
        
        <Button 
          className="w-full" 
          disabled={
            !address ||
            !sourceAmount ||
            parseFloat(sourceAmount) <= 0 ||
            parseFloat(sourceAmount) > parseFloat(sourceBalance) ||
            !bridgeProvider ||
            sourceChain === targetChain ||
            isSwapping
          }
          onClick={handleCrossChainSwap}
        >
          {isSwapping ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Swapping...
            </>
          ) : !address ? (
            "Connect Wallet"
          ) : !sourceAmount || parseFloat(sourceAmount) <= 0 ? (
            "Enter Amount"
          ) : parseFloat(sourceAmount) > parseFloat(sourceBalance) ? (
            "Insufficient Balance"
          ) : !bridgeProvider ? (
            "No Bridge Available"
          ) : sourceChain === targetChain ? (
            "Select Different Chains"
          ) : (
            "Swap"
          )}
        </Button>
      </div>
    </Card>
  );
}
