import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { 
  mainnet, 
  arbitrum, 
  polygon, 
  optimism, 
  base 
} from 'wagmi/chains';
import { http } from 'wagmi';

export const config = getDefaultConfig({
  appName: 'Dexmond DEX',
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // You'll need to get one from https://cloud.walletconnect.com
  chains: [mainnet, arbitrum, polygon, optimism, base],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
  },
  ssr: false
});