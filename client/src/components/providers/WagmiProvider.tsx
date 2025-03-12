
import React from 'react';
import { WagmiProvider as Provider } from 'wagmi';
import { config } from '@/lib/connectors';

interface WagmiProviderProps {
  children: React.ReactNode;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <Provider config={config}>
      {children}
    </Provider>
  );
}
