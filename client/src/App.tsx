
import React from 'react';
import { Route, Switch } from 'wouter';
import { 
  getDefaultWallets,
  RainbowKitProvider,
  lightTheme
} from '@rainbow-me/rainbowkit';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum, base, zora } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import '@rainbow-me/rainbowkit/styles.css';

// Import your pages
import Dashboard from '@/pages/Dashboard';
import SwapPage from '@/pages/SwapPage';
import AdminPage from '@/pages/AdminPage';
import Navigation from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

// Configure chains & providers
const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [publicProvider()]
);

// Set up connectors
const { connectors } = getDefaultWallets({
  appName: 'Dexmond',
  projectId: 'YOUR_PROJECT_ID', // You can replace this with actual project ID
  chains
});

// Create Wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider 
        chains={chains}
        theme={lightTheme({
          accentColor: '#0097FB',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}
      >
        <div className="min-h-screen bg-background">
          <Navigation />
          <main className="container mx-auto py-4 px-4 md:px-6">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/swap" component={SwapPage} />
              <Route path="/admin" component={AdminPage} />
            </Switch>
          </main>
          <Toaster />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
