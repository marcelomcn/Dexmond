import { Route, Switch } from 'wouter';
import { 
  RainbowKitProvider,
  darkTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig, chains } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

// Import your pages
import Dashboard from '@/pages/Dashboard';
import SwapPage from '@/pages/SwapPage';
import AdminPage from '@/pages/AdminPage';
import Navigation from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
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