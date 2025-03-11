
import React from "react";
import { CrossChainBridge } from "../components/dex/CrossChainBridge";
import { CrossChainSwap } from "../components/dex/CrossChainSwap";
import { WalletConnect } from "@/components/dex/WalletConnect";

export default function CrossChainPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container py-6 space-y-6">
        <header className="flex justify-between items-center pb-4 border-b">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cross Chain</h1>
            <p className="text-muted-foreground">
              Transfer and swap tokens across different blockchains
            </p>
          </div>
          <WalletConnect />
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <CrossChainBridge />
          </div>
          <div>
            <CrossChainSwap />
          </div>
        </div>
      </div>
    </div>
  );
}
