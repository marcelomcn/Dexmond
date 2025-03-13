import React from 'react';
import { WalletConnect } from "@/components/dex/WalletConnect";

export default function Navigation() {
  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Dexmond</h1>
        </div>
        <WalletConnect />
      </div>
    </nav>
  );
}