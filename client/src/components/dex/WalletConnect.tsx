import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export const WalletConnect: React.FC = () => {
  const { isConnected } = useAccount();

  return (
    <div className="wallet-connect-container">
      <ConnectButton 
        label="Connect Wallet"
        accountStatus={{
          smallScreen: 'avatar',
          largeScreen: 'full',
        }}
        chainStatus={{
          smallScreen: 'icon',
          largeScreen: 'full',
        }}
        showBalance={false}
      />
    </div>
  );
};

export default WalletConnect;