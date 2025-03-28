import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TokenSwap } from "@/components/dex/TokenSwap";
import { OrderBook } from "@/components/dex/OrderBook";
import { PriceChart } from "@/components/dex/PriceChart";
import { MarketStats } from "@/components/dex/MarketStats";
import { RecentTransactions } from "@/components/dex/RecentTransactions";
import { AdvancedTrading } from "@/components/dex/AdvancedTrading";
import { Portfolio } from "@/components/dex/Portfolio";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SingleTokenChart } from "@/components/dex/SingleTokenChart";

// Simple Layout component
const Layout = ({ children }) => (
  <div>
    <main className="mt-20">{children}</main>
  </div>
);

export default function DexPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedToken, setSelectedToken] = useState("BTC");
  const [, navigate] = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (value: string) => {
    try {
      switch(value) {
        case "pools":
          navigate("/pools");
          break;
        case "analytics":
          navigate("/analytics");
          break;
        case "cross-chain":
          navigate("/cross-chain");
          break;
      }
    } catch (error) {
      console.error("Error changing tabs:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="flex flex-col items-center gap-8">
          <div className="loading-animation" />
        </div>
      </div>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-transparent p-4 md:p-8 dex-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-6">
            <MarketStats />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-6">
                <Card className="p-6 bg-opacity-20 backdrop-blur-lg">
                  <Tabs defaultValue="swap" onValueChange={handleTabChange}>
                    <TabsList className="w-full">
                      <TabsTrigger value="swap" className="flex-1">Quick Swap</TabsTrigger>
                      <TabsTrigger value="pools" className="flex-1">Pools</TabsTrigger>
                      <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
                      <TabsTrigger value="cross-chain" className="flex-1">Cross-Chain</TabsTrigger>
                    </TabsList>
                    <TabsContent value="swap">
                      <TokenSwap />
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
                      <SingleTokenChart token={selectedToken} />
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
    </Layout>
  );
}