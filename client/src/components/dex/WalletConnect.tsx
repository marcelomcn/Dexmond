import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { config, metamaskConnector, walletConnectConnector, coinbaseWalletConnector } from '@/lib/connectors';

export function WalletConnect() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const connectMetaMask = async () => {
    try {
      connect({ connector: metamaskConnector });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting MetaMask:', error);
    }
  };

  const connectWalletConnect = async () => {
    try {
      connect({ connector: walletConnectConnector });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting WalletConnect:', error);
    }
  };

  const connectCoinbaseWallet = async () => {
    try {
      connect({ connector: coinbaseWalletConnector });
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting Coinbase Wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      disconnect();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-sm text-gray-500">Connected Wallet</div>
          <div className="font-mono text-xs">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</div>
          <Button onClick={disconnectWallet} variant="destructive" size="sm">Disconnect</Button>
        </div>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect a wallet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={connectMetaMask} className="flex items-center justify-between">
                <span>MetaMask</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.2684 4.03027L17.5018 11.2136L19.3079 7.12137L27.2684 4.03027Z" fill="#E17726"/>
                </svg>
              </Button>

              <Button onClick={connectWalletConnect} className="flex items-center justify-between">
                <span>WalletConnect</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.2414 10.5266C13.0344 5.73369 20.9656 5.73369 25.7586 10.5266L26.3866 11.1547C26.6618 11.4299 26.6618 11.8787 26.3866 12.1539L24.2673 14.2731C24.1297 14.4107 23.9053 14.4107 23.7677 14.2731L22.8749 13.3803C19.4519 9.95734 14.5481 9.95734 11.1251 13.3803L10.1662 14.3392C10.0286 14.4768 9.80421 14.4768 9.66659 14.3392L7.54741 12.22C7.27222 11.9448 7.27222 11.496 7.54741 11.2208L8.2414 10.5266ZM29.3184 14.0865L31.2161 15.9842C31.4913 16.2594 31.4913 16.7082 31.2161 16.9834L23.154 25.0455C22.6036 25.5959 21.7155 25.5959 21.1651 25.0455L15.6521 19.5323C15.5833 19.4635 15.4732 19.4635 15.4044 19.5323L9.89143 25.0455C9.34103 25.5959 8.45293 25.5959 7.90253 25.0455L-0.154533 16.9884C-0.429722 16.7132 -0.429722 16.2644 -0.154533 15.9892L1.74316 14.0915C2.29356 13.5411 3.18165 13.5411 3.73205 14.0915L9.24504 19.6045C9.31383 19.6733 9.42388 19.6733 9.49267 19.6045L15.0057 14.0915C15.5561 13.5411 16.4442 13.5411 16.9946 14.0915L22.5076 19.6045C22.5764 19.6733 22.6864 19.6733 22.7552 19.6045L28.2682 14.0915C28.8186 13.5411 29.7067 13.5411 30.2571 14.0915H29.3184V14.0865Z" fill="#3396FF"/>
                </svg>
              </Button>

              <Button onClick={connectCoinbaseWallet} className="flex items-center justify-between">
                <span>Coinbase Wallet</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.164 0 0 7.164 0 16C0 24.836 7.164 32 16 32C24.836 32 32 24.836 32 16C32 7.164 24.836 0 16 0ZM16.5 22.9287C16.5 23.2048 16.2761 23.4286 16 23.4286H12.5714C12.2953 23.4286 12.0714 23.2048 12.0714 22.9287V19.5C12.0714 19.2239 12.2953 19 12.5714 19H16C16.2761 19 16.5 19.2239 16.5 19.5V22.9287ZM22.4286 16.5C22.4286 16.7761 22.2047 17 21.9286 17H10.0714C9.79533 17 9.57143 16.7761 9.57143 16.5V10.0714C9.57143 9.79533 9.79533 9.57143 10.0714 9.57143H21.9286C22.2047 9.57143 22.4286 9.79533 22.4286 10.0714V16.5Z" fill="#0052FF"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}