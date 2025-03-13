
import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { injected, walletconnect, coinbaseWallet } from '@/lib/connectors';

export function WalletConnect() {
  const { activate, deactivate, active, account, error } = useWeb3React();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Handle connection errors
  useEffect(() => {
    if (error) {
      console.error('Wallet connection error:', error);
    }
  }, [error]);

  const connectWallet = async (connector) => {
    try {
      await activate(connector, undefined, true);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  // Format address for display
  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div>
      {active && account ? (
        <Button 
          variant="outline" 
          onClick={disconnectWallet}
          className="border-gradient-to-r from-purple-500 to-blue-500"
        >
          {formatAddress(account)}
        </Button>
      ) : (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
              Connect Wallet
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Connect Your Wallet</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Button onClick={() => connectWallet(injected)} className="flex items-center justify-between">
                <span>MetaMask</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.2684 4.03027L17.5018 11.2136L19.3079 7.12137L27.2684 4.03027Z" fill="#E17726"/>
                </svg>
              </Button>
              <Button onClick={() => connectWallet(walletconnect)} className="flex items-center justify-between">
                <span>WalletConnect</span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.4 11.39C10.94 7.91 16.57 7.91 20.1 11.39L20.74 12.01C20.92 12.19 20.92 12.48 20.74 12.66L19.14 14.22C19.05 14.31 18.9 14.31 18.81 14.22L17.95 13.38C15.57 11.05 11.93 11.05 9.56 13.38L8.64 14.28C8.55 14.37 8.4 14.37 8.31 14.28L6.7 12.72C6.53 12.54 6.53 12.25 6.7 12.07L7.4 11.39ZM23.69 14.92L25.17 16.36C25.34 16.54 25.34 16.83 25.17 17L19.55 22.53C19.38 22.7 19.09 22.7 18.91 22.53L14.99 18.69C14.95 18.64 14.88 18.64 14.84 18.69L10.91 22.53C10.74 22.7 10.45 22.7 10.27 22.53L4.64 17C4.46 16.82 4.46 16.53 4.64 16.35L6.12 14.91C6.29 14.74 6.59 14.74 6.76 14.91L10.69 18.76C10.74 18.8 10.81 18.8 10.85 18.76L14.78 14.91C14.95 14.74 15.24 14.74 15.42 14.91L19.35 18.76C19.39 18.8 19.46 18.8 19.5 18.76L23.43 14.91C23.61 14.74 23.9 14.74 24.08 14.91H23.69Z" fill="#3B99FC"/>
                </svg>
              </Button>
              <Button onClick={() => connectWallet(coinbaseWallet)} className="flex items-center justify-between">
                <span>Coinbase Wallet</span>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2.33325C7.55996 2.33325 2.33337 7.55984 2.33337 13.9999C2.33337 20.44 7.55996 25.6666 14 25.6666C20.4401 25.6666 25.6667 20.44 25.6667 13.9999C25.6667 7.55984 20.4401 2.33325 14 2.33325Z" fill="#0052FF"/>
                  <path d="M14.0001 18.6666C11.4267 18.6666 9.33342 16.5732 9.33342 13.9999C9.33342 11.4266 11.4267 9.33325 14.0001 9.33325C16.5734 9.33325 18.6667 11.4266 18.6667 13.9999C18.6667 16.5732 16.5734 18.6666 14.0001 18.6666ZM14.0001 10.4999C12.0667 10.4999 10.5001 12.0666 10.5001 13.9999C10.5001 15.9332 12.0667 17.4999 14.0001 17.4999C15.9334 17.4999 17.5001 15.9332 17.5001 13.9999C17.5001 12.0666 15.9334 10.4999 14.0001 10.4999Z" fill="white"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
