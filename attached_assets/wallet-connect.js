// Wallet connection functionality
let provider = null;
let signer = null;
let currentAccount = null;
let walletConnected = false;
let chainId = null;

// Supported networks
const SUPPORTED_NETWORKS = {
  1: {
    name: 'Ethereum Mainnet',
    currency: 'ETH',
    rpcUrl: 'https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161' // Public Infura endpoint
  },
  42161: {
    name: 'Arbitrum One',
    currency: 'ETH',
    rpcUrl: 'https://arb1.arbitrum.io/rpc'
  },
  137: {
    name: 'Polygon Mainnet',
    currency: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com'
  }
};

// Check if ethers.js is available
function checkEthersAvailability() {
  if (typeof ethers === 'undefined') {
    console.error('ethers.js library not found. Please include it in your HTML.');
    return false;
  }
  return true;
}

// Custom Web3Provider implementation that doesn't rely on ethers.js internals
// This avoids potential CSP issues with ethers.js's internal use of eval
function createSafeProvider(ethereum) {
  // Basic provider that wraps ethereum provider
  const safeProvider = {
    _ethereum: ethereum,
    
    // Basic send method
    send: async function(method, params) {
      try {
        return await ethereum.request({ method, params });
      } catch (error) {
        throw error;
      }
    },
    
    // Get accounts
    listAccounts: async function() {
      try {
        return await ethereum.request({ method: 'eth_accounts' });
      } catch (error) {
        console.error("Error listing accounts:", error);
        return [];
      }
    },
    
    // Get network
    getNetwork: async function() {
      try {
        const chainIdHex = await ethereum.request({ method: 'eth_chainId' });
        const chainId = parseInt(chainIdHex, 16);
        return { chainId, name: SUPPORTED_NETWORKS[chainId]?.name || 'Unknown Network' };
      } catch (error) {
        console.error("Error getting network:", error);
        return { chainId: 0, name: 'Unknown' };
      }
    },
    
    // Get balance
    getBalance: async function(address) {
      try {
        const balanceHex = await ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        return BigInt(balanceHex);
      } catch (error) {
        console.error("Error getting balance:", error);
        return BigInt(0);
      }
    },
    
    // Get signer
    getSigner: function() {
      return {
        _provider: this,
        
        // Get address of signer
        getAddress: async function() {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          return accounts[0];
        },
        
        // Sign message
        signMessage: async function(message) {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          const address = accounts[0];
          
          return await ethereum.request({
            method: 'personal_sign',
            params: [message, address]
          });
        },
        
        // Send transaction
        sendTransaction: async function(txParams) {
          const accounts = await ethereum.request({ method: 'eth_accounts' });
          const from = accounts[0];
          
          const tx = {
            from,
            to: txParams.to,
            value: txParams.value || '0x0',
            data: txParams.data || '0x',
            gas: txParams.gasLimit ? '0x' + txParams.gasLimit.toString(16) : undefined
          };
          
          return await ethereum.request({
            method: 'eth_sendTransaction',
            params: [tx]
          });
        }
      };
    }
  };
  
  return safeProvider;
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  initWallet();
});

// Debug function to help identify wallet detection issues
function debugWalletDetection() {
  console.log("Checking for wallet providers...");
  console.log("window.ethereum exists:", Boolean(window.ethereum));
  if (window.ethereum) {
    console.log("window.ethereum.isMetaMask:", Boolean(window.ethereum.isMetaMask));
    console.log("Provider details:", window.ethereum);
  }
}

// Wait for ethereum to be injected if needed
function waitForEthereum(callback, maxAttempts = 10) {
  let attempts = 0;
  
  const checkForEthereum = () => {
    attempts++;
    console.log(`Checking for ethereum (attempt ${attempts})`);
    
    if (window.ethereum) {
      console.log("Found ethereum!");
      callback();
      return;
    }
    
    if (attempts >= maxAttempts) {
      const connectButton = document.getElementById('walletConnect');
      console.error("Max attempts reached. MetaMask not detected.");
      if (connectButton) {
        connectButton.textContent = "MetaMask Not Detected";
        connectButton.disabled = true;
      }
      return;
    }
    
    // Use function reference instead of string for setTimeout
    setTimeout(checkForEthereum, 200);
  };
  
  checkForEthereum();
}

// Initialize wallet
function initWallet() {
  // Get references to DOM elements
  const connectButton = document.getElementById('walletConnect');
  const walletStatus = document.getElementById('walletStatus');
  
  // If DOM elements aren't found, log error and exit
  if (!connectButton || !walletStatus) {
    console.error("Required DOM elements not found. Make sure 'walletConnect' and 'walletStatus' elements exist.");
    return;
  }
  
  // Run debug
  debugWalletDetection();
  
  // Initialize with ethers only if it's available
  waitForEthereum(() => {
    if (!checkEthersAvailability()) {
      connectButton.textContent = "ethers.js not loaded";
      connectButton.disabled = true;
      return;
    }
    
    try {
      // Use our custom safe provider instead of ethers.providers.Web3Provider
      // This avoids potential CSP issues with ethers internal use of eval
      provider = createSafeProvider(window.ethereum);
      
      // Set up event listeners for wallet changes
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      window.ethereum.on('disconnect', handleDisconnect);
      
      // Check if already connected
      provider.listAccounts().then(accounts => {
        if (accounts.length > 0) {
          handleAccountsChanged(accounts);
        } else {
          // Setup connect button
          connectButton.textContent = 'Connect Wallet';
          connectButton.disabled = false;
        }
      }).catch(error => {
        console.error("Error checking accounts:", error);
        connectButton.textContent = 'Connection Error';
      });
      
      // Set up connect button
      connectButton.addEventListener('click', connectWallet);
    } catch (error) {
      console.error("Error initializing wallet:", error);
      connectButton.textContent = 'Wallet Init Error';
    }
  });
}

// Connect wallet
async function connectWallet() {
  const connectButton = document.getElementById('walletConnect');
  const walletStatus = document.getElementById('walletStatus');
  
  if (!window.ethereum || !provider) {
    console.error("No ethereum provider available");
    connectButton.textContent = 'No Wallet Provider';
    return;
  }
  
  try {
    // Show connecting state
    connectButton.textContent = 'Connecting...';
    
    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);
    
    if (accounts.length > 0) {
      await handleAccountsChanged(accounts);
      return accounts[0];
    } else {
      connectButton.textContent = 'No Accounts';
      return null;
    }
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    if (error.code === 4001) {
      // User rejected the connection
      connectButton.textContent = 'Connection Rejected';
    } else {
      connectButton.textContent = 'Connection Failed';
    }
    return null;
  }
}

// Safe string truncation helper
function truncateAddress(address) {
  if (!address || typeof address !== 'string') return '';
  if (address.length < 10) return address;
  return address.slice(0, 6) + '...' + address.slice(-4);
}

// Handle account changes
async function handleAccountsChanged(accounts) {
  const connectButton = document.getElementById('walletConnect');
  const walletStatus = document.getElementById('walletStatus');
  
  if (!connectButton || !walletStatus) {
    console.error("Required DOM elements not found");
    return;
  }
  
  if (!accounts || accounts.length === 0) {
    // User disconnected their wallet
    walletConnected = false;
    currentAccount = null;
    signer = null;
    walletStatus.textContent = '';
    connectButton.textContent = 'Connect Wallet';
    console.log('Wallet disconnected');
  } else {
    // User connected or switched accounts
    walletConnected = true;
    currentAccount = accounts[0];
    
    // Get the chain ID
    try {
      const network = await provider.getNetwork();
      chainId = network.chainId;
      console.log('Connected to chain:', chainId);
      
      // Check if we're on a supported network
      if (SUPPORTED_NETWORKS[chainId]) {
        console.log('Connected to supported network:', SUPPORTED_NETWORKS[chainId].name);
      } else {
        console.warn('Connected to unsupported network. ChainId:', chainId);
      }
      
      // Get signer
      signer = provider.getSigner();
      
      // Update UI - use safe truncation
      const displayAddress = truncateAddress(currentAccount);
      walletStatus.textContent = displayAddress;
      connectButton.textContent = 'Connected ';
      connectButton.appendChild(walletStatus);
      
      console.log('Connected to wallet account:', currentAccount);
    } catch (error) {
      console.error('Error getting network details:', error);
    }
  }
  
  // Dispatch custom event for the rest of the app
  const walletChangedEvent = new CustomEvent('walletChanged', { 
    detail: { 
      connected: walletConnected,
      account: currentAccount,
      chainId: chainId
    }
  });
  window.dispatchEvent(walletChangedEvent);
}

// Handle chain changes
async function handleChainChanged(chainIdHex) {
  console.log('Chain changed to:', chainIdHex);
  
  // Force page refresh as recommended by MetaMask
  window.location.reload();
}

// Handle disconnect
function handleDisconnect(error) {
  console.log('Wallet disconnected:', error);
  
  // Reset state
  walletConnected = false;
  currentAccount = null;
  signer = null;
  
  // Update UI
  const connectButton = document.getElementById('walletConnect');
  const walletStatus = document.getElementById('walletStatus');
  
  if (connectButton && walletStatus) {
    walletStatus.textContent = '';
    connectButton.textContent = 'Connect Wallet';
  }
  
  // Dispatch custom event
  const walletChangedEvent = new CustomEvent('walletChanged', {
    detail: {
      connected: false,
      account: null,
      chainId: null
    }
  });
  window.dispatchEvent(walletChangedEvent);
}

// Switch network if needed
async function switchNetwork(targetChainId) {
  if (!provider || !signer) {
    console.error('No provider or signer available');
    return false;
  }
  
  // Check if we're already on the target network
  try {
    const currentNetwork = await provider.getNetwork();
    if (currentNetwork.chainId === targetChainId) {
      return true;
    }
  } catch (error) {
    console.error('Error checking current network:', error);
  }
  
  // Get the network details
  const network = SUPPORTED_NETWORKS[targetChainId];
  if (!network) {
    console.error('Target network not supported:', targetChainId);
    return false;
  }
  
  try {
    // Try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${targetChainId.toString(16)}` }],
    });
    return true;
  } catch (switchError) {
    console.error('Error switching network:', switchError);
    
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        // Try to add the network
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: network.name,
              nativeCurrency: {
                name: network.currency,
                symbol: network.currency,
                decimals: 18
              },
              rpcUrls: [network.rpcUrl],
            },
          ],
        });
        return true;
      } catch (addError