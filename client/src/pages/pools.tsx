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
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <MarketStats />
          <Card className="p-6">
            <Tabs defaultValue="pools">
              <TabsList className="w-full">
                <TabsTrigger value="pools" className="flex-1">Liquidity Pools</TabsTrigger>
                <TabsTrigger value="farming" className="flex-1">Yield Farming</TabsTrigger>
                <TabsTrigger value="lending" className="flex-1">Lending</TabsTrigger>
                <TabsTrigger value="bridge" className="flex-1">Bridge</TabsTrigger>
                <TabsTrigger value="flash" className="flex-1">Flash Loans</TabsTrigger>
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
    </Layout>
  );
}