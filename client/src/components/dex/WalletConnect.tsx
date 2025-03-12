
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { injected, walletconnect, coinbaseWallet } from '@/lib/connectors';

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
      await walletconnect.activate();
      const provider = await walletconnect.getProvider();
      const accounts = await provider.request({ method: 'eth_accounts' });
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
      await coinbaseWallet.activate();
      const provider = await coinbaseWallet.getProvider();
      const accounts = await provider.request({ method: 'eth_accounts' });
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
                  <path d="M16 6C10.48 6 6 10.48 6 16C6 21.52 10.48 26 16 26C21.52 26 26 21.52 26 16C26 10.48 21.52 6 16 6ZM16.9 19.15H15.1V21H13.2V19.15H11.4V17.35H13.2V15.5H11.4V13.7H13.2V11.85H15.1V13.7H16.9V15.5H15.1V17.35H16.9V19.15Z" fill="white"/>
                </svg>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
