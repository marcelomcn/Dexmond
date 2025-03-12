
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { injected, walletconnect, coinbaseWallet, connectors } from '@/lib/wagmi';

export function WalletConnect() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState('');

  useEffect(() => {
    // Check if already connected
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            setConnectedWalletType('MetaMask');
          }
        })
        .catch(console.error);
    }
  }, []);

  const connectMetaMask = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        setConnectedWalletType('MetaMask');
        setIsDialogOpen(false);
      } else {
        alert('Please install MetaMask');
      }
    } catch (error) {
      console.error('Error connecting MetaMask:', error);
    }
  };

  const connectWalletConnect = async () => {
    try {
      const provider = await walletconnect.activate();
      const accounts = await provider.getAccounts();
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      setConnectedWalletType('WalletConnect');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting WalletConnect:', error);
    }
  };

  const connectCoinbaseWallet = async () => {
    try {
      const provider = await coinbaseWallet.activate();
      const accounts = await provider.getAccounts();
      setWalletAddress(accounts[0]);
      setIsConnected(true);
      setConnectedWalletType('Coinbase');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error connecting Coinbase Wallet:', error);
    }
  };

  const disconnectWallet = () => {
    try {
      if (connectedWalletType === 'MetaMask' && window.ethereum) {
        // For MetaMask, there's no official disconnect method
        // Just reset the state
      } else if (connectedWalletType === 'WalletConnect') {
        walletconnect.deactivate();
      } else if (connectedWalletType === 'Coinbase') {
        coinbaseWallet.deactivate();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }

    setIsConnected(false);
    setWalletAddress('');
    setConnectedWalletType('');
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
                  <rect width="32" height="32" rx="16" fill="#0052FF"/>
                  <path d="M16 6C10.4769 6 6 10.4769 6 16C6 21.5231 10.4769 26 16 26C21.5231 26 26 21.5231 26 16C26 10.4769 21.5231 6 16 6ZM16 20.8615C13.3085 20.8615 11.1385 18.6915 11.1385 16C11.1385 13.3085 13.3085 11.1385 16 11.1385C18.6915 11.1385 20.8615 13.3085 20.8615 16C20.8615 18.6915 18.6915 20.8615 16 20.8615Z" fill="white"/>
                </svg>
              </Button>
              
              <Button className="flex items-center justify-between">
                <span>Rainbow</span>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="32" height="32" rx="16" fill="#001A4B"/>
                  <path d="M7.5 11C7.5 9.067 9.067 7.5 11 7.5H21C22.933 7.5 24.5 9.067 24.5 11V21C24.5 22.933 22.933 24.5 21 24.5H11C9.067 24.5 7.5 22.933 7.5 21V11Z" fill="#00CCFF"/>
                  <path d="M7.5 11C7.5 9.067 9.067 7.5 11 7.5H21C22.933 7.5 24.5 9.067 24.5 11V14.75H7.5V11Z" fill="#0074F0"/>
                  <path d="M7.5 14.75H24.5V19.25H7.5V14.75Z" fill="#A140FF"/>
                  <path d="M7.5 19.25H24.5V21C24.5 22.933 22.933 24.5 21 24.5H11C9.067 24.5 7.5 22.933 7.5 21V19.25Z" fill="#FF1F82"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
