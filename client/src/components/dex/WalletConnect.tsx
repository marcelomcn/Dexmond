import { ConnectButton } from '@rainbow-me/rainbowkit';

export function WalletConnect() {
  return (
    <ConnectButton 
      chainStatus="icon"
      showBalance={false}
    />
  );
}
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
                  <path d="M8.28125 11.3438C13.125 6.5 21.125 6.5 25.9688 11.3438L26.5625 11.9375C26.8438 12.2188 26.8438 12.6562 26.5625 12.9375L24.625 14.875C24.4844 15.0156 24.2656 15.0156 24.125 14.875L23.2969 14.0469C19.8281 10.5781 14.4219 10.5781 10.9531 14.0469L10.0625 14.9375C9.92188 15.0781 9.70312 15.0781 9.5625 14.9375L7.625 13C7.34375 12.7188 7.34375 12.2812 7.625 12L8.28125 11.3438ZM29.4844 14.8594L31.1875 16.5625C31.4688 16.8438 31.4688 17.2812 31.1875 17.5625L24.0781 24.6719C23.7969 24.9531 23.3594 24.9531 23.0781 24.6719C23.0781 24.6719 23.0781 24.6719 23.0781 24.6719L18.1406 19.7344C18.0703 19.6641 17.9531 19.6641 17.8828 19.7344C17.8828 19.7344 17.8828 19.7344 17.8828 19.7344L12.9453 24.6719C12.6641 24.9531 12.2266 24.9531 11.9453 24.6719C11.9453 24.6719 11.9453 24.6719 11.9453 24.6719L4.8125 17.5391C4.53125 17.2578 4.53125 16.8203 4.8125 16.5391L6.51562 14.8359C6.79688 14.5547 7.23438 14.5547 7.51562 14.8359L12.4531 19.7734C12.5234 19.8438 12.6406 19.8438 12.7109 19.7734C12.7109 19.7734 12.7109 19.7734 12.7109 19.7734L17.6484 14.8359C17.9297 14.5547 18.3672 14.5547 18.6484 14.8359C18.6484 14.8359 18.6484 14.8359 18.6484 14.8359L23.5859 19.7734C23.6562 19.8438 23.7734 19.8438 23.8438 19.7734L28.7812 14.8359C29.0625 14.5547 29.5 14.5547 29.7812 14.8359L29.4844 14.8594Z" fill="#3B99FC"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
