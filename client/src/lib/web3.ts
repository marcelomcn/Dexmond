import { create } from 'zustand';

interface Token {
  symbol: string;
  name: string;
  address: string;
}

interface SwapParams {
  fromToken: Token;
  toToken: Token;
  amount: string;
}

interface Web3State {
  address: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  executeSwap: (params: SwapParams) => Promise<void>;
}

// CSP-safe Web3 implementation using window.ethereum
export const useWeb3 = create<Web3State>((set) => ({
  address: null,

  connect: async () => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask to use this application");
    }

    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      set({ address: accounts[0] });

      // Handle account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        set({ address: accounts[0] || null });
      });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      throw error;
    }
  },

  disconnect: () => {
    set({ address: null });
  },

  executeSwap: async ({ fromToken, toToken, amount }) => {
    if (!window.ethereum) {
      throw new Error("Please install MetaMask");
    }

    try {
      // Use CSP-safe contract methods from ethereum-utils.js
      const contract = window.safeEthers.Contract(
        "DEX_CONTRACT_ADDRESS",
        ["function swap(address from, address to, uint256 amount)"],
        window.ethereum
      );

      const tx = await contract.swap(
        fromToken.address,
        toToken.address,
        window.safeEthers.utils.parseUnits(amount, 18)
      );

      await tx.wait();
    } catch (error) {
      console.error("Swap failed:", error);
      throw error;
    }
  }
}));
