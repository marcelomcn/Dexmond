
import React from "react";
import { Link } from "wouter";
import { WalletConnect } from "@/components/dex/WalletConnect";
import { CrossChainSwap } from "@/components/dex/CrossChainSwap";
import { Portfolio } from "@/components/dex/Portfolio";

export default function CrossChainPage() {
  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8 dex-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <header className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
                Dexmond
              </h1>
              <div className="hidden md:flex gap-4 ml-8">
                <Link href="/">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Trade</span>
                </Link>
                <Link href="/pools">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Pools</span>
                </Link>
                <Link href="/analytics">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Analytics</span>
                </Link>
                <Link href="/cross-chain">
                  <span className="text-sm text-primary cursor-pointer">Cross-Chain</span>
                </Link>
              </div>
            </div>
            <WalletConnect />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CrossChainSwap />
            </div>
            
            <div className="lg:col-span-1">
              <Portfolio />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
