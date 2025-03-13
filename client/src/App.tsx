import { Route, Switch } from 'wouter';
import { 
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiConfig, chains } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

// Import your pages
import Dashboard from '@/pages/Dashboard';
import SwapPage from '@/pages/SwapPage';
import AdminPage from '@/pages/AdminPage';
import PoolsPage from '@/pages/pools';
import CrossChainPage from '@/pages/cross-chain';
import Navigation from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider 
          chains={chains}
          theme={darkTheme({
            accentColor: '#0097FB',
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
          coolMode
        >
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto py-4 px-4 md:px-6">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/swap" component={SwapPage} />
                <Route path="/pools" component={PoolsPage} />
                <Route path="/cross-chain" component={CrossChainPage} />
                <Route path="/admin" component={AdminPage} />
              </Switch>
            </main>
            <Toaster />
          </div>
        </RainbowKitProvider>
      </WagmiConfig>
    </QueryClientProvider>
  );
}

export default App;