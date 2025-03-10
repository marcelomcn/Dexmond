import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import DexPage from "@/pages/dex";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from '@/lib/wagmi';
import '@rainbow-me/rainbowkit/styles.css';

function Router() {
  return (
    <Switch>
      <Route path="/" component={DexPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
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
  );
}

export default App;