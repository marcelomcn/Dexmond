
import { ethers } from "ethers";

// Supported chains configuration
export const supportedChains = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    rpcUrl: "https://mainnet.infura.io/v3/your-infura-key", // In production, use environment variable
    explorerUrl: "https://etherscan.io",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
    testnetRpcUrl: "https://goerli.infura.io/v3/your-infura-key" // For testing
  },
  bsc: {
    id: 56,
    name: "Binance Smart Chain",
    rpcUrl: "https://bsc-dataseed.binance.org/",
    explorerUrl: "https://bscscan.com",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    testnetRpcUrl: "https://data-seed-prebsc-1-s1.binance.org:8545/"
  },
  polygon: {
    id: 137,
    name: "Polygon",
    rpcUrl: "https://polygon-rpc.com",
    explorerUrl: "https://polygonscan.com",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    testnetRpcUrl: "https://mumbai.polygonscan.com/"
  },
  arbitrum: {
    id: 42161,
    name: "Arbitrum",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
    explorerUrl: "https://arbiscan.io",
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    testnetRpcUrl: "https://goerli-rollup.arbitrum.io/rpc"
  }
};

// ERC20 ABI for token interactions
const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 value) returns (bool)",
  "function transfer(address to, uint256 value) returns (bool)",
  "function transferFrom(address from, address to, uint256 value) returns (bool)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)"
];

// Get provider for a specific chain
export const getProvider = (chainId: number) => {
  const chainConfig = Object.values(supportedChains).find(chain => chain.id === chainId);
  if (!chainConfig) {
    throw new Error(`Chain ID ${chainId} not supported`);
  }
  
  // Use testnet URLs for development, mainnet for production
  const isDev = process.env.NODE_ENV === 'development';
  const rpcUrl = isDev ? chainConfig.testnetRpcUrl : chainConfig.rpcUrl;
  
  return new ethers.providers.JsonRpcProvider(rpcUrl);
};

// Get signer for a chain using the connected wallet
export const getSigner = async (chainId: number) => {
  if (!window.ethereum) {
    throw new Error("No Ethereum provider found");
  }
  
  // First check if we're connected to the correct network
  const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
  if (parseInt(currentChainId, 16) !== chainId) {
    try {
      // Request chain switch
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // If the chain hasn't been added to MetaMask, add it
      if (error.code === 4902) {
        const chain = Object.values(supportedChains).find(c => c.id === chainId);
        if (!chain) {
          throw new Error(`Chain ID ${chainId} not supported`);
        }
        
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${chainId.toString(16)}`,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrl],
              blockExplorerUrls: [chain.explorerUrl],
            },
          ],
        });
      } else {
        throw error;
      }
    }
  }
  
  // Get provider and signer
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  return provider.getSigner();
};

// Get token balance
export const getTokenBalance = async (
  chainId: number,
  tokenAddress: string,
  walletAddress: string
) => {
  const provider = getProvider(chainId);
  
  // If token address is zero address, get native token balance
  if (tokenAddress === ethers.constants.AddressZero) {
    const balance = await provider.getBalance(walletAddress);
    return ethers.utils.formatEther(balance);
  }
  
  // Otherwise get ERC20 balance
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const balance = await tokenContract.balanceOf(walletAddress);
  const decimals = await tokenContract.decimals();
  return ethers.utils.formatUnits(balance, decimals);
};

// Get token details
export const getTokenDetails = async (
  chainId: number,
  tokenAddress: string
) => {
  // If zero address, return native token details
  if (tokenAddress === ethers.constants.AddressZero) {
    const chain = Object.values(supportedChains).find(c => c.id === chainId);
    if (!chain) {
      throw new Error(`Chain ID ${chainId} not supported`);
    }
    
    return {
      name: chain.nativeCurrency.name,
      symbol: chain.nativeCurrency.symbol,
      decimals: chain.nativeCurrency.decimals,
      address: ethers.constants.AddressZero
    };
  }
  
  // Get ERC20 token details
  const provider = getProvider(chainId);
  const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  
  const [name, symbol, decimals] = await Promise.all([
    tokenContract.name(),
    tokenContract.symbol(),
    tokenContract.decimals()
  ]);
  
  return {
    name,
    symbol,
    decimals,
    address: tokenAddress
  };
};

// Get token price from CoinGecko
export const getTokenPrice = async (chainId: number, tokenAddress: string) => {
  try {
    // Map chain ID to CoinGecko platform ID
    const platformId = {
      1: 'ethereum',
      56: 'binance-smart-chain',
      137: 'polygon-pos',
      42161: 'arbitrum-one'
    }[chainId];
    
    if (!platformId) {
      throw new Error(`Chain ID ${chainId} not supported for price fetching`);
    }
    
    // If native token
    if (tokenAddress === ethers.constants.AddressZero) {
      const nativeSymbol = Object.values(supportedChains).find(c => c.id === chainId)?.nativeCurrency.symbol.toLowerCase();
      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${nativeSymbol}&vs_currencies=usd`);
      const data = await response.json();
      return data[nativeSymbol]?.usd || 0;
    }
    
    // For ERC20 tokens
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/token_price/${platformId}?contract_addresses=${tokenAddress}&vs_currencies=usd`);
    const data = await response.json();
    return data[tokenAddress.toLowerCase()]?.usd || 0;
  } catch (error) {
    console.error("Error fetching token price:", error);
    return 0; // Return 0 price on error
  }
};

// Bridge interface - will be implemented using specific bridge protocols
export interface BridgeProviderInterface {
  name: string;
  supportedPaths: Array<{sourceChainId: number, targetChainId: number}>;
  estimateFee: (sourceChainId: number, targetChainId: number, tokenAddress: string, amount: string) => Promise<string>;
  bridge: (sourceChainId: number, targetChainId: number, tokenAddress: string, amount: string, recipient: string) => Promise<string>;
  getStatus: (txHash: string) => Promise<'pending' | 'completed' | 'failed'>;
}

// Mock bridge provider for testing (will be replaced with actual implementations)
export class AxelarBridgeProvider implements BridgeProviderInterface {
  name = "Axelar";
  
  supportedPaths = [
    { sourceChainId: 1, targetChainId: 56 },
    { sourceChainId: 1, targetChainId: 137 },
    { sourceChainId: 56, targetChainId: 1 },
    { sourceChainId: 56, targetChainId: 137 },
    { sourceChainId: 137, targetChainId: 1 },
    { sourceChainId: 137, targetChainId: 56 },
  ];
  
  async estimateFee(sourceChainId: number, targetChainId: number, tokenAddress: string, amount: string) {
    // In production, call the Axelar API for fee estimation
    // For testing, return a fixed fee of 0.1% of the amount
    const fee = parseFloat(amount) * 0.001;
    return fee.toString();
  }
  
  async bridge(sourceChainId: number, targetChainId: number, tokenAddress: string, amount: string, recipient: string) {
    // Here we would interact with the Axelar contracts for bridging
    // For now, this is a placeholder that would be replaced with real implementation
    // This should return a transaction hash
    
    // In production, this would:
    // 1. Get source chain signer
    // 2. Approve token for bridge contract (if ERC20)
    // 3. Call bridge function
    // 4. Return transaction hash
    
    return "0x1234567890abcdef";
  }
  
  async getStatus(txHash: string) {
    // In production, query the Axelar API for transaction status
    // For now, return a mock status
    return 'pending';
  }
}

// Will be expanded with other bridge providers like Wormhole, LayerZero, etc.
export const bridgeProviders: BridgeProviderInterface[] = [
  new AxelarBridgeProvider()
];

// Find supported bridge for a path
export const findBridgeProvider = (sourceChainId: number, targetChainId: number) => {
  return bridgeProviders.find(provider => 
    provider.supportedPaths.some(
      path => path.sourceChainId === sourceChainId && path.targetChainId === targetChainId
    )
  );
};
