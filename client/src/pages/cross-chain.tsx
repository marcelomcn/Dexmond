
import React from "react";
import Link from "next/link";
import { CrossChainBridge } from "../components/dex/CrossChainBridge";
import { CrossChainSwap } from "../components/dex/CrossChainSwap";
import { WalletConnect } from "../components/dex/WalletConnect";

export default function CrossChainPage() {
  return (
    <div className="min-h-screen pb-16">
      <div className="container mx-auto px-4 py-6">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Cross-Chain</h1>
            
            <div className="flex gap-4">
              <Link href="/dex" className="text-primary hover:underline">
                DEX
              </Link>
              <Link href="/cross-chain" className="text-primary font-bold hover:underline">
                Cross-Chain
              </Link>
              <Link href="/analytics" className="text-primary hover:underline">
                Analytics
              </Link>
            </div>
            <WalletConnect />
          </header>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CrossChainBridge />
            <CrossChainSwap />
          </div>
        </div>
      </div>
  );
}
