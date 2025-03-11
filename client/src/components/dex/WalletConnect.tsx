
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setIsDialogOpen(false);
      } else {
        alert('Please install MetaMask or another Ethereum wallet');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnectWallet = () => {
    setIsConnected(false);
    setWalletAddress('');
  };

  return (
    <div>
      {isConnected ? (
        <Button 
          variant="outline" 
          onClick={disconnectWallet}
          className="border-gradient-to-r from-purple-500 to-blue-500"
        >
          {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
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
              <Button onClick={connectWallet} className="flex items-center justify-between">
                <span>MetaMask</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M27.2684 4.03027L17.5018 11.2136L19.3079 7.12137L27.2684 4.03027Z" fill="#E17726"/>
                </svg>
              </Button>
              <Button variant="outline" className="flex items-center justify-between">
                <span>WalletConnect</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.08 10.9645C11.08 6.0625 19.32 6.0625 24.32 10.9645L25 11.6298C25.24 11.8645 25.24 12.2345 25 12.4691L22.84 14.5938C22.72 14.7111 22.52 14.7111 22.4 14.5938L21.48 13.6965C18.08 10.3618 12.32 10.3618 8.92 13.6965L7.92 14.6778C7.8 14.7951 7.6 14.7951 7.48 14.6778L5.32 12.5531C5.08 12.3184 5.08 11.9485 5.32 11.7138L6.08 10.9645ZM29.16 15.6744L31.08 17.5659C31.32 17.8005 31.32 18.1702 31.08 18.4051L22.32 27.0234C22.08 27.258 21.68 27.258 21.44 27.0234L15.52 21.1939C15.48 21.1521 15.4 21.1521 15.36 21.1939L9.44 27.0234C9.2 27.258 8.8 27.258 8.56 27.0234L0 18.4051C-0.24 18.1702 -0.24 17.8005 0 17.5659L1.92 15.6744C2.16 15.4397 2.56 15.4397 2.8 15.6744L8.72 21.5039C8.76 21.5457 8.84 21.5457 8.88 21.5039L14.8 15.6744C15.04 15.4397 15.44 15.4397 15.68 15.6744L21.6 21.5039C21.64 21.5457 21.72 21.5457 21.76 21.5039L27.68 15.6744C27.92 15.4397 28.32 15.4397 29.16 15.6744Z" fill="#3B99FC"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
