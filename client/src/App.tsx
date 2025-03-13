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
          <RainbowKitProvider 
            theme={darkTheme({
              accentColor: '#a855f7', 
              borderRadius: 'medium'
            })}
          >
            <Router />
            <Toaster />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import SwapPage from './pages/SwapPage';
import AdminPage from './pages/AdminPage';
import TokensPage from './pages/TokensPage';
import { WagmiConfig } from 'wagmi';
import { createConfig } from './lib/wagmi';

const wagmiConfig = createConfig();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="swap" element={<SwapPage />} />
            <Route path="tokens" element={<TokensPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </Router>
    </WagmiConfig>
  );
}

export default App;
