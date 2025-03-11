import React from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { WalletConnect } from "@/components/dex/WalletConnect";
import { MarketStats } from "@/components/dex/MarketStats";
import TechnicalChart from "@/components/dex/TechnicalChart";

export default function AnalyticsPage() {
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
                  <span className="text-sm text-primary cursor-pointer">Analytics</span>
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
            <div className="lg:col-span-12">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Market Analytics</h2>
                <div className="space-y-6">
                  <TechnicalChart />
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Layout } from "@/components/layout/Layout";

export default function AnalyticsPage() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <h2 className="text-2xl font-bold">Market Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Trading Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Liquidity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Token Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Fee Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chart Placeholder
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
