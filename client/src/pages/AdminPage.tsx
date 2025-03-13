import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonetizationSettings } from "@/components/MonetizationSettings";
import { MonetizationConfig, defaultMonetizationConfig } from "@/lib/monetization";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Layout } from "@/components/layout/Layout";

export default function AdminPage() {
  const [monetizationConfig, setMonetizationConfig] = useLocalStorage<MonetizationConfig>(
    "dexmond-monetization-config",
    defaultMonetizationConfig
  );

  const handleMonetizationConfigChange = (newConfig: MonetizationConfig) => {
    setMonetizationConfig(newConfig);
  };

  return (
    <Layout>
      <div className="container mx-auto py-8 space-y-8">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          <div className="space-y-8">
            <MonetizationSettings
              config={monetizationConfig}
              onConfigChange={handleMonetizationConfigChange}
            />
          </div>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>DEX Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Volume (24h)</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fees Earned (24h)</p>
                    <p className="text-2xl font-bold">$0.00</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Active Users</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Swaps</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No recent swaps to display.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}