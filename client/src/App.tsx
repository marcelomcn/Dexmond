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
import { Toaster } from '@/components/ui/toaster';
import { WalletConnect } from "@/components/dex/WalletConnect"; // Fixed import path

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
            <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Dexmond</h1>
                </div>
                <WalletConnect />
              </div>
            </header>
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
    </QueryClientProvider>
  );
}

export default App;