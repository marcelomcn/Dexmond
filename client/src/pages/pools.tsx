import React from "react";
import { Card } from "@/components/ui/card";
import { WalletConnect } from "@/components/dex/WalletConnect";
import { MarketStats } from "@/components/dex/MarketStats";
import { LiquidityPools } from "@/components/dex/LiquidityPools";
import { YieldFarming } from "@/components/dex/YieldFarming";
import { LendingMarket } from "@/components/dex/LendingMarket";
import { CrossChainBridge } from "@/components/dex/CrossChainBridge";
import { FlashLoan } from "@/components/dex/FlashLoan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PoolsPage() {
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
                <a href="/" className="text-sm text-muted-foreground hover:text-primary">Trade</a>
                <a href="/pools" className="text-sm text-primary">Pools</a>
                <a href="/analytics" className="text-sm text-muted-foreground hover:text-primary">Analytics</a>
              </div>
            </div>
            <WalletConnect />
          </header>

          <MarketStats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12">
              <Card className="p-6">
                <Tabs defaultValue="pools" onValueChange={(value) => {
                  // Safely handle tab changes
                  try {
                    console.log(`Tab changed to: ${value}`);
                  } catch (error) {
                    console.error("Error changing tabs:", error);
                  }
                }}>
                  <TabsList className="w-full">
                    <TabsTrigger value="pools" className="flex-1" onClick={(e) => e.stopPropagation()}>Liquidity Pools</TabsTrigger>
                    <TabsTrigger value="farming" className="flex-1" onClick={(e) => e.stopPropagation()}>Yield Farming</TabsTrigger>
                    <TabsTrigger value="lending" className="flex-1" onClick={(e) => e.stopPropagation()}>Lending</TabsTrigger>
                    <TabsTrigger value="bridge" className="flex-1" onClick={(e) => e.stopPropagation()}>Bridge</TabsTrigger>
                    <TabsTrigger value="flash" className="flex-1" onClick={(e) => e.stopPropagation()}>Flash Loans</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pools">
                    <LiquidityPools />
                  </TabsContent>
                  <TabsContent value="farming">
                    <YieldFarming />
                  </TabsContent>
                  <TabsContent value="lending">
                    <LendingMarket />
                  </TabsContent>
                  <TabsContent value="bridge">
                    <CrossChainBridge />
                  </TabsContent>
                  <TabsContent value="flash">
                    <FlashLoan />
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