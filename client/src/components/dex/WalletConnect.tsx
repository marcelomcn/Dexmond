
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { Button } from '@/components/ui/button';

export function WalletConnect() {
  const { isConnected } = useAccount();

  return (
    <div className="flex items-center">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          mounted,
        }) => {
          const ready = mounted;
          const connected = ready && account && chain;

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button onClick={openConnectModal} variant="default">
                      Connect Wallet
                    </Button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <Button onClick={openChainModal} variant="destructive">
                      Wrong network
                    </Button>
                  );
                }

                return (
                  <div className="flex gap-2">
                    <Button
                      onClick={openChainModal}
                      variant="outline"
                      size="sm"
                      className="hidden md:flex"
                    >
                      {chain.name}
                    </Button>

                    <Button 
                      onClick={openAccountModal} 
                      variant="outline"
                    >
                      {account.displayName}
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}

export default WalletConnect;
