import { TokenSwap } from "@/components/dex/TokenSwap";
import { OrderBook } from "@/components/dex/OrderBook";
import { PriceChart } from "@/components/dex/PriceChart";
import { WalletConnect } from "@/components/dex/WalletConnect";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DexPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-6">
          <header className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Dexmond</h1>
            <WalletConnect />
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4">
              <Card className="p-6">
                <TokenSwap />
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card className="p-6">
                <Tabs defaultValue="chart" className="w-full">
                  <TabsList>
                    <TabsTrigger value="chart">Price Chart</TabsTrigger>
                    <TabsTrigger value="orderbook">Order Book</TabsTrigger>
                  </TabsList>
                  <TabsContent value="chart">
                    <PriceChart />
                  </TabsContent>
                  <TabsContent value="orderbook">
                    <OrderBook />
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
