import React from 'react';
import { WalletConnect } from "@/components/dex/WalletConnect";

export default function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full bg-transparent z-50 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">Dexmond</h1>
        </div>
        <WalletConnect />
      </div>
    </header>
  );
}