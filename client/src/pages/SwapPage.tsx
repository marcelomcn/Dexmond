import React from "react";
import { Layout } from "@/components/layout/Layout";
import { Card } from "@/components/ui/card";
import { TokenSwap } from "@/components/dex/TokenSwap";
import { PriceChart } from "@/components/dex/PriceChart";

export default function SwapPage() {
  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <Card className="p-6">
              <TokenSwap />
            </Card>
          </div>
          <div className="lg:col-span-8">
            <Card className="p-6">
              <PriceChart />
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
