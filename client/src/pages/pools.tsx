import React from "react";
import { Card } from "@/components/ui/card";
import { MarketStats } from "@/components/dex/MarketStats";
import { LiquidityPools } from "@/components/dex/LiquidityPools";
import { YieldFarming } from "@/components/dex/YieldFarming";
import { LendingMarket } from "@/components/dex/LendingMarket";
import { CrossChainBridge } from "@/components/dex/CrossChainBridge";
import { FlashLoan } from "@/components/dex/FlashLoan";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout } from "@/components/layout/Layout";

export default function PoolsPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
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
    </Layout>
  );
}