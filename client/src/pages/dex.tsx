import React, { useEffect, useState } from "react";
import { TokenSwap } from "@/components/dex/TokenSwap";
import { OrderBook } from "@/components/dex/OrderBook";
import { PriceChart } from "@/components/dex/PriceChart";
import { WalletConnect } from "@/components/dex/WalletConnect";
import { MarketStats } from "@/components/dex/MarketStats";
import { RecentTransactions } from "@/components/dex/RecentTransactions";
import { AdvancedTrading } from "@/components/dex/AdvancedTrading";
import { Portfolio } from "@/components/dex/Portfolio";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function DexPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            DEXMOND
          </h1>
          <p className="text-xl text-purple-200 opacity-80">
            Cross-Chain DEX Aggregator
          </p>
          <div className="loading-animation" />
        </div>
      </div>
    );
  }

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
                  <span className="text-sm text-primary cursor-pointer">Trade</span>
                </Link>
                <Link href="/pools">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Pools</span>
                </Link>
                <Link href="/analytics">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Analytics</span>
                </Link>
                <Link href="/cross-chain">
                  <span className="text-sm text-muted-foreground hover:text-primary cursor-pointer">Cross-Chain</span>
                </Link>
              </div>
            </div>
            <WalletConnect />
          </header>

          <MarketStats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <Card className="p-6 bg-opacity-20 backdrop-blur-lg">
                <Tabs defaultValue="swap">
                  <TabsList className="w-full">
                    <TabsTrigger value="swap" className="flex-1">Quick Swap</TabsTrigger>
                    <TabsTrigger value="advanced" className="flex-1">Advanced</TabsTrigger>
                  </TabsList>
                  <TabsContent value="swap">
                    <TokenSwap />
                  </TabsContent>
                  <TabsContent value="advanced">
                    <AdvancedTrading />
                  </TabsContent>
                </Tabs>
              </Card>
              <RecentTransactions />
            </div>

            <div className="lg:col-span-8">
              <Card className="p-6 bg-opacity-20 backdrop-blur-lg">
                <Tabs defaultValue="chart">
                  <TabsList className="bg-opacity-20">
                    <TabsTrigger value="chart">Price Chart</TabsTrigger>
                    <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                    <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart">
                    <PriceChart />
                  </TabsContent>
                  <TabsContent value="orderbook">
                    <OrderBook />
                  </TabsContent>
                  <TabsContent value="portfolio">
                    <Portfolio />
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}