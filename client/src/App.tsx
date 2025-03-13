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
import { wagmiConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';
import AdminPage from "./pages/AdminPage"; // Added import for AdminPage
import { Web3ReactProvider } from '@web3-react/core'; // Added import for Web3ReactProvider
import { ethers } from 'ethers'; // Added import for ethers

// Function to get library from provider for Web3ReactProvider
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

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
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <Web3ReactProvider getLibrary={getLibrary}> {/* Added Web3ReactProvider */}
            <RainbowKitProvider 
              theme={darkTheme({
                accentColor: '#a855f7', 
                borderRadius: 'medium'
              })}
            >
              <Switch>
                <Route path="/admin" component={AdminPage} /> {/* Added admin route */}
                <Route component={Router} /> {/* Using Router component instead of Routes */}
              </Switch>
              <Toaster />
            </RainbowKitProvider>
          </Web3ReactProvider> {/* Added closing tag for Web3ReactProvider */}
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}

export default App;