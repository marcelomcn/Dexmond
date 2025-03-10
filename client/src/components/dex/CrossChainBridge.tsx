import React, { useState, useEffect } from "react";

interface ChainInfo {
  id: number;
  name: string;
  nativeToken: string;
  estimatedTime: string;
}

const supportedChains: ChainInfo[] = [
  { id: 1, name: "Ethereum", nativeToken: "ETH", estimatedTime: "15 mins" },
  { id: 56, name: "BNB Chain", nativeToken: "BNB", estimatedTime: "5 mins" },
  { id: 137, name: "Polygon", nativeToken: "MATIC", estimatedTime: "7 mins" },
  { id: 42161, name: "Arbitrum", nativeToken: "ETH", estimatedTime: "2 mins" },
  { id: 10, name: "Optimism", nativeToken: "ETH", estimatedTime: "3 mins" },
  { id: 43114, name: "Avalanche", nativeToken: "AVAX", estimatedTime: "5 mins" },
];

export function CrossChainBridge() {
  const [sourceChain, setSourceChain] = useState<ChainInfo>(supportedChains[0]);
  const [targetChain, setTargetChain] = useState<ChainInfo>(supportedChains[1]);
  const [amount, setAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  const handleSwapChains = () => {
    const temp = sourceChain;
    setSourceChain(targetChain);
    setTargetChain(temp);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate a transaction
    setTimeout(() => {
      setTxHash("0x" + Math.random().toString(16).substr(2, 40));
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Cross-Chain Bridge</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-2">Source Chain</label>
          <select 
            className="w-full p-3 bg-background rounded border border-input"
            value={sourceChain.id}
            onChange={(e) => {
              const selected = supportedChains.find(chain => chain.id === parseInt(e.target.value));
              if (selected) setSourceChain(selected);
            }}
          >
            {supportedChains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name} ({chain.nativeToken})
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center my-4">
          <button 
            type="button"
            className="p-2 rounded-full bg-muted hover:bg-primary/20 transition-colors"
            onClick={handleSwapChains}
          >
            ↑↓
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-2">Target Chain</label>
          <select 
            className="w-full p-3 bg-background rounded border border-input"
            value={targetChain.id}
            onChange={(e) => {
              const selected = supportedChains.find(chain => chain.id === parseInt(e.target.value));
              if (selected) setTargetChain(selected);
            }}
          >
            {supportedChains.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name} ({chain.nativeToken})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Amount ({sourceChain.nativeToken})</label>
          <input 
            type="text"
            className="w-full p-3 bg-background rounded border border-input"
            placeholder={`Enter amount in ${sourceChain.nativeToken}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="text-sm mb-6">
          <p>Estimated time: {targetChain.estimatedTime}</p>
          <p>Bridge Fee: 0.1%</p>
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          disabled={isProcessing || !amount}
        >
          {isProcessing ? 'Processing...' : `Bridge to ${targetChain.name}`}
        </button>
      </form>

      {txHash && (
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="text-sm">Transaction submitted:</p>
          <a 
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary break-all"
          >
            {txHash}
          </a>
        </div>
      )}
    </div>
  );
}