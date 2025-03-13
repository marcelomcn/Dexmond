import React, { Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import DexPage from "@/pages/dex";
import PoolsPage from "@/pages/pools";
import AnalyticsPage from "@/pages/analytics";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { config } from '@/lib/connectors'; // Updated import
import '@rainbow-me/rainbowkit/styles.css';
import AdminPage from "./pages/AdminPage";
import { ethers } from 'ethers';


// Pre-load the CrossChainPage component
const CrossChainPage = React.lazy(() => import('./pages/cross-chain'));

function Router() {
  return (
    <Switch>
      <Route path="/" component={DexPage} />
      <Route path="/pools" component={PoolsPage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/cross-chain">
        <Suspense fallback={<div className="w-full h-screen flex items-center justify-center">
          <div className="loading-animation"></div>
        </div>}>
          <CrossChainPage />
        </Suspense>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <React.StrictMode>
      <WagmiProvider config={config}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#a855f7', 
            borderRadius: 'medium'
          })}
        >
          <QueryClientProvider client={queryClient}>
            <Switch>
              <Route path="/admin" component={AdminPage} />
              <Route component={Router} />
            </Switch>
            <Toaster />
          </QueryClientProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}

export default App;