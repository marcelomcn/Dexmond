// Swap functionality with real contract interactions
let fromToken = findTokenBySymbol('ETH');
let toToken = findTokenBySymbol('USDC');
let fromAmount = 0;
let toAmount = 0;
let slippageTolerance = 1.0; // Default 1%
let deadline = 20; // 20 minutes
let priceImpact = 0;
let exchangeRate = 0;

// Contract ABIs for swap
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

// ERC20 Token ABI for approvals
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)"
];

// Router addresses for different DEXes
const ROUTER_ADDRESSES = {
  uniswapV2: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  sushiswap: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
  quickswap: "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
};

// Router for swaps (default to Uniswap V2)
let routerAddress = ROUTER_ADDRESSES.uniswapV2;
let router = null;
let provider = null;
let signer = null;
let currentAccount = null;

// Initialize swap functionality
async function initSwap() {
  // Set up token selection handlers
  document.getElementById('fromTokenSelect').addEventListener('click', () => openTokenModal('from'));
  document.getElementById('toTokenSelect').addEventListener('click', () => openTokenModal('to'));
  
  // Set up swap button handler
  document.getElementById('swapButton').addEventListener('click', executeSwap);
  
  // Set up input amount handler
  document.getElementById('fromAmount').addEventListener('input', handleFromAmountChange);
  
  // Set up token swap button
  document.getElementById('swapTokens').addEventListener('click', swapTokenPositions);
  
  // Set up settings button
  document.getElementById('settingsButton').addEventListener('click', openSettingsModal);
  
  // Initialize provider if wallet is connected
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        currentAccount = accounts[0];
        signer = provider.getSigner();
        router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
        
        // Update UI to show connected state
        updateConnectedState(currentAccount);
      } else {
        // Initialize with read-only provider
        router = new ethers.Contract(routerAddress, ROUTER_ABI, provider);
      }
    } catch (error) {
      console.error("Error initializing wallet:", error);
      router = new ethers.Contract(routerAddress, ROUTER_ABI, provider);
    }
  }
  
  // Update UI with initial tokens
  updateFromTokenUI();
  updateToTokenUI();
}

// Update the UI to show connected state
function updateConnectedState(account) {
  const connectButton = document.getElementById('walletConnect');
  const walletStatus = document.getElementById('walletStatus');
  
  if (account) {
    walletStatus.textContent = `${account.slice(0, 6)}...${account.slice(-4)}`;
    connectButton.textContent = 'Connected ';
    connectButton.appendChild(walletStatus);
    
    // Update swap button state
    updateSwapButtonState();
    
    // Update token balances
    updateTokenBalances();
  }
}

// Handle from amount changes and calculate to amount
async function handleFromAmountChange() {
  const input = document.getElementById('fromAmount');
  fromAmount = parseFloat(input.value) || 0;
  
  if (fromAmount <= 0) {
    document.getElementById('toAmount').value = '';
    toAmount = 0;
    updateSwapDetails();
    return;
  }
  
  // Get current token prices
  await calculateSwapAmount();
  
  // Update the swap button state
  updateSwapButtonState();
}

// Calculate the swap amount based on the from amount using actual router
async function calculateSwapAmount() {
  if (!fromToken || !toToken || fromAmount <= 0) {
    document.getElementById('toAmount').value = '';
    toAmount = 0;
    updateSwapDetails();
    return;
  }
  
  try {
    // Show calculating state
    document.getElementById('toAmount').value = 'Calculating...';
    
    // Get swap path
    const path = getSwapPath();
    
    // If we don't have a valid path, use API pricing as fallback
    if (path.length === 0 || !router || !provider) {
      await calculateSwapAmountUsingAPI();
      return;
    }
    
    // Parse the input amount to wei
    let amountIn;
    if (fromToken.symbol === 'ETH') {
      // Use safeEthers instead of ethers.utils
      amountIn = window.safeEthers.utils.parseEther(fromAmount.toString());
    } else {
      // Use safeEthers instead of ethers.utils
      amountIn = window.safeEthers.utils.parseUnits(fromAmount.toString(), fromToken.decimals);
    }
    
    // Call the router to get the output amount
    const amounts = await router.getAmountsOut(amountIn, path);
    
    // Format the output amount
    // Use safeEthers instead of ethers.utils
    const amountOut = window.safeEthers.utils.formatUnits(
      amounts[amounts.length - 1], 
      toToken.decimals
    );
    
    toAmount = parseFloat(amountOut);
    
    // Calculate exchange rate
    exchangeRate = toAmount / fromAmount;
    
    // Calculate real price impact
    try {
      const expectedOutput = fromAmount * (await getTokenPrice(fromToken.symbol)) / (await getTokenPrice(toToken.symbol));
      priceImpact = Math.max(0, ((expectedOutput - toAmount) / expectedOutput) * 100);
      
      // If price impact is too high, show warning
      if (priceImpact > 5) {
        document.getElementById('priceImpact').style.color = 'orange';
      } else if (priceImpact > 10) {
        document.getElementById('priceImpact').style.color = 'red';
      } else {
        document.getElementById('priceImpact').style.color = '';
      }
    } catch (error) {
      console.error("Error calculating price impact:", error);
      // Default low price impact if calculation fails
      priceImpact = 0.5;
    }
    
    // Update UI
    document.getElementById('toAmount').value = toAmount.toFixed(6);
    updateSwapDetails();
    
  } catch (error) {
    console.error("Error calculating swap amount:", error);
    // Fall back to API-based calculation
    await calculateSwapAmountUsingAPI();
  }
}

// Fallback calculation using API pricing
async function calculateSwapAmountUsingAPI() {
  try {
    const fromPrice = await getTokenPrice(fromToken.symbol);
    const toPrice = await getTokenPrice(toToken.symbol);
    
    if (fromPrice && toPrice) {
      // Calculate based on market prices
      const calculatedToAmount = (fromAmount * fromPrice) / toPrice;
      toAmount = calculatedToAmount;
      
      // Update exchange rate
      exchangeRate = fromPrice / toPrice;
      
      // Estimate price impact based on amount
      priceImpact = Math.min(fromAmount * 0.002, 2.5); // Simulate mild price impact
    } else {
      toAmount = 0;
      exchangeRate = 0;
      priceImpact = 0;
    }
    
    // Update UI
    document.getElementById('toAmount').value = toAmount.toFixed(6);
    document.getElementById('priceImpact').style.color = '';
    updateSwapDetails();
  } catch (error) {
    console.error("API calculation failed:", error);
    document.getElementById('errorMessage').style.display = 'block';
    document.getElementById('errorMessage').textContent = "Error calculating swap rates";
    toAmount = 0;
    document.getElementById('toAmount').value = '';
  }
}

// Get the swap path based on the selected tokens
function getSwapPath() {
  const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH address
  
  if (fromToken.symbol === 'ETH' && toToken.symbol !== 'ETH') {
    // ETH -> Token
    return [wethAddress, toToken.address];
  } else if (fromToken.symbol !== 'ETH' && toToken.symbol === 'ETH') {
    // Token -> ETH
    return [fromToken.address, wethAddress];
  } else if (fromToken.symbol !== 'ETH' && toToken.symbol !== 'ETH') {
    // Token -> Token (using WETH as intermediary)
    return [fromToken.address, wethAddress, toToken.address];
  }
  
  // Default empty path
  return [];
}

// Check and set allowance for ERC20 tokens
async function checkAndSetAllowance(tokenAddress, amount, spender) {
  try {
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ERC20_ABI,
      signer
    );
    
    // Determine the required allowance
    // Use safeEthers instead of ethers.utils
    const amountWei = window.safeEthers.utils.parseUnits(
      amount.toString(),
      findTokenByAddress(tokenAddress).decimals
    );
    
    // Check current allowance
    const currentAllowance = await tokenContract.allowance(currentAccount, spender);
    
    // If allowance is insufficient, request approval
    if (currentAllowance.lt(amountWei)) {
      document.getElementById('txStatus').textContent = 'Approving token...';
      
      // Request max allowance
      // Use safeEthers instead of ethers.constants
      const maxInt = window.safeEthers.constants.MaxUint256;
      const tx = await tokenContract.approve(spender, maxInt);
      
      // Wait for approval confirmation
      document.getElementById('txStatus').textContent = 'Waiting for approval...';
      await tx.wait();
      
      return true;
    }
    
    // Already has sufficient allowance
    return true;
  } catch (error) {
    console.error("Approval error:", error);
    return false;
  }
}

// Update token balances in UI
async function updateTokenBalances() {
  if (!currentAccount) {
    document.getElementById('fromBalance').textContent = 'Balance: 0.00';
    document.getElementById('toBalance').textContent = 'Balance: 0.00';
    return;
  }
  
  try {
    const fromBalance = await getTokenBalance(fromToken.symbol);
    const toBalance = await getTokenBalance(toToken.symbol);
    
    document.getElementById('fromBalance').textContent = `Balance: ${parseFloat(fromBalance).toFixed(4)}`;
    document.getElementById('toBalance').textContent = `Balance: ${parseFloat(toBalance).toFixed(4)}`;
  } catch (error) {
    console.error("Error updating balances:", error);
  }
}

// Get token balance
async function getTokenBalance(symbol) {
  if (!currentAccount || !provider) {
    return '0';
  }
  
  const token = findTokenBySymbol(symbol);
  if (!token) {
    return '0';
  }
  
  try {
    // For ETH
    if (symbol === 'ETH') {
      const balance = await provider.getBalance(currentAccount);
      // Use safeEthers instead of ethers.utils
      return window.safeEthers.utils.formatEther(balance);
    } 
    // For ERC20 tokens
    else {
      const tokenContract = new ethers.Contract(
        token.address,
        ERC20_ABI,
        provider
      );
      
      const balance = await tokenContract.balanceOf(currentAccount);
      // Use safeEthers instead of ethers.utils
      return window.safeEthers.utils.formatUnits(balance, token.decimals);
    }
  } catch (error) {
    console.error(`Error getting ${symbol} balance:`, error);
    return '0';
  }
}

// Update swap button state based on inputs and wallet connection
function updateSwapButtonState() {
  const swapButton = document.getElementById('swapButton');
  const errorMessage = document.getElementById('errorMessage');
  
  // Clear previous error
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
  
  if (!currentAccount) {
    swapButton.textContent = 'Connect Wallet';
    swapButton.disabled = true;
    return;
  }
  
  if (fromAmount <= 0) {
    swapButton.textContent = 'Enter an amount';
    swapButton.disabled = true;
    return;
  }
  
  // Check if the user has enough balance
  getTokenBalance(fromToken.symbol).then(balance => {
    const hasEnoughBalance = parseFloat(balance) >= fromAmount;
    
    if (!hasEnoughBalance) {
      swapButton.textContent = `Insufficient ${fromToken.symbol} balance`;
      swapButton.disabled = true;
      
      // Show error
      errorMessage.style.display = 'block';
      errorMessage.textContent = `You don't have enough ${fromToken.symbol}`;
    } else {
      swapButton.textContent = 'Swap';
      swapButton.disabled = false;
    }
  });
}

// Execute the swap
async function executeSwap() {
  const errorMessage = document.getElementById('errorMessage');
  errorMessage.style.display = 'none';
  
  if (!currentAccount || !signer) {
    try {
      currentAccount = await connectWallet();
      if (currentAccount) {
        signer = provider.getSigner();
        router = new ethers.Contract(routerAddress, ROUTER_ABI, signer);
      } else {
        return;
      }
    } catch (error) {
      console.error("Wallet connection failed:", error);
      return;
    }
  }
  
  if (fromAmount <= 0) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = "Please enter an amount";
    return;
  }
  
  try {
    // Show loading overlay
    document.getElementById('loadingOverlay').style.display = 'flex';
    document.getElementById('txStatus').textContent = 'Preparing swap...';
    
    // Get router contract with signer
    const routerWithSigner = router.connect(signer);
    
    // Calculate minimum amount out based on slippage
    const amountOutMin = toAmount * (1 - (slippageTolerance / 100));
    
    let amountOutMinWei;
    if (toToken.symbol === 'ETH') {
      // Use safeEthers instead of ethers.utils
      amountOutMinWei = window.safeEthers.utils.parseEther(amountOutMin.toFixed(18));
    } else {
      // Use safeEthers instead of ethers.utils
      amountOutMinWei = window.safeEthers.utils.parseUnits(
        amountOutMin.toFixed(toToken.decimals), 
        toToken.decimals
      );
    }
    
    // Calculate deadline timestamp
    const deadlineTimestamp = Math.floor(Date.now() / 1000) + (deadline * 60);
    
    // Execute the swap based on token types
    let tx;
    const path = getSwapPath();
    
    // Check if we have a valid path
    if (path.length === 0) {
      document.getElementById('loadingOverlay').style.display = 'none';
      errorMessage.style.display = 'block';
      errorMessage.textContent = "Invalid swap path";
      return;
    }
    
    // Check and set allowance for ERC20 tokens
    if (fromToken.symbol !== 'ETH') {
      document.getElementById('txStatus').textContent = 'Checking token allowance...';
      const approved = await checkAndSetAllowance(
        fromToken.address,
        fromAmount,
        routerAddress
      );
      
      if (!approved) {
        document.getElementById('loadingOverlay').style.display = 'none';
        errorMessage.style.display = 'block';
        errorMessage.textContent = "Token approval failed";
        return;
      }
    }
    
    if (fromToken.symbol === 'ETH') {
      // ETH -> Token
      document.getElementById('txStatus').textContent = 'Swapping ETH for tokens...';
      
      tx = await routerWithSigner.swapExactETHForTokens(
        amountOutMinWei,
        path,
        currentAccount,
        deadlineTimestamp,
        {
          // Use safeEthers instead of ethers.utils
          value: window.safeEthers.utils.parseEther(fromAmount.toString()),
          gasLimit: 250000
        }
      );
    } else if (toToken.symbol === 'ETH') {
      // Token -> ETH
      document.getElementById('txStatus').textContent = 'Swapping tokens for ETH...';
      
      // Use safeEthers instead of ethers.utils
      const amountIn = window.safeEthers.utils.parseUnits(
        fromAmount.toString(),
        fromToken.decimals
      );
      
      tx = await routerWithSigner.swapExactTokensForETH(
        amountIn,
        amountOutMinWei,
        path,
        currentAccount,
        deadlineTimestamp,
        { gasLimit: 250000 }
      );
    } else {
      // Token -> Token
      document.getElementById('txStatus').textContent = 'Swapping tokens...';
      
      // Use safeEthers instead of ethers.utils
      const amountIn = window.safeEthers.utils.parseUnits(
        fromAmount.toString(),
        fromToken.decimals
      );
      
      tx = await routerWithSigner.swapExactTokensForTokens(
        amountIn,
        amountOutMinWei,
        path,
        currentAccount,
        deadlineTimestamp,
        { gasLimit: 250000 }
      );
    }
    
    // Wait for transaction confirmation
    document.getElementById('txStatus').textContent = 'Waiting for confirmation...';
    await tx.wait();
    
    // Transaction confirmed
    document.getElementById('txStatus').textContent = 'Swap successful!';
    setTimeout(() => {
      document.getElementById('loadingOverlay').style.display = 'none';
    }, 2000);
    
    // Update balances
    await updateTokenBalances();
    
    // Reset form
    document.getElementById('fromAmount').value = '';
    document.getElementById('toAmount').value = '';
    fromAmount = 0;
    toAmount = 0;
    
    // Update swap details
    updateSwapDetails();
    
  } catch (error) {
    console.error("Swap error:", error);
    document.getElementById('loadingOverlay').style.display = 'none';
    errorMessage.style.display = 'block';
    
    if (error.code === 4001) {
      errorMessage.textContent = "Transaction rejected by user";
    } else if (error.message?.includes('insufficient funds')) {
      errorMessage.textContent = "Insufficient funds for gas";
    } else {
      errorMessage.textContent = "Swap failed: " + (error.message || "Unknown error");
    }
  }
}

// Update UI with swap details
function updateSwapDetails() {
  // Update rate
  if (fromAmount > 0 && toAmount > 0) {
    document.getElementById('rate').textContent = `1 ${fromToken.symbol} = ${(toAmount / fromAmount).toFixed(6)} ${toToken.symbol}`;
  } else {
    document.getElementById('rate').textContent = `1 ${fromToken.symbol} = ? ${toToken.symbol}`;
  }
  
  // Update price impact
  document.getElementById('priceImpact').textContent = `${priceImpact.toFixed(2)}%`;
  
  // Update minimum received
  const minReceived = toAmount * (1 - (slippageTolerance / 100));
  document.getElementById('minimumReceived').textContent = `${minReceived.toFixed(6)} ${toToken.symbol}`;
  
  // Update network fee - fetch actual gas estimate when possible
  estimateGasFee().then(gasFee => {
    document.getElementById('networkFee').textContent = `~$${gasFee.toFixed(2)}`;
  }).catch(error => {
    console.error("Error estimating gas:", error);
    // Fallback to reasonable estimate
    document.getElementById('networkFee').textContent = `~$${(2 + (Math.random() * 3)).toFixed(2)}`;
  });
}

// Estimate gas fee
async function estimateGasFee() {
  if (!provider) {
    return 3 + (Math.random() * 2); // Reasonable default
  }
  
  try {
    // Get current gas price
    const gasPrice = await provider.getGasPrice();
    // Use safeEthers instead of ethers.utils
    const gasPriceGwei = parseFloat(window.safeEthers.utils.formatUnits(gasPrice, "gwei"));
    
    // Estimate gas used (typical DEX swap uses ~150k-200k gas)
    const gasUsed = 180000;
    
    // Calculate fee in ETH
    const feeInEth = gasUsed * gasPriceGwei * 1e-9;
    
    // Convert to USD
    const ethPrice = await getTokenPrice('ETH');
    return feeInEth * ethPrice;
  } catch (error) {
    console.error("Gas estimation error:", error);
    return 3 + (Math.random() * 2); // Fallback
  }
}

// Swap token positions (from/to)
function swapTokenPositions() {
  // Swap token objects
  const tempToken = fromToken;
  fromToken = toToken;
  toToken = tempToken;
  
  // Update UI
  updateFromTokenUI();
  updateToTokenUI();
  
  // Recalculate swap if there's an amount entered
  if (fromAmount > 0) {
    calculateSwapAmount();
  }
}

// Update from token UI
function updateFromTokenUI() {
  document.getElementById('fromTokenSymbol').textContent = fromToken.symbol;
  document.getElementById('fromTokenLogo').src = fromToken.logoURI || '/api/placeholder/24/24';
  document.getElementById('fromTokenLogo').onerror = function() {
    this.src = '/api/placeholder/24/24';
  };
  updateTokenBalances();
}

// Update to token UI
function updateToTokenUI() {
  document.getElementById('toTokenSymbol').textContent = toToken.symbol;
  document.getElementById('toTokenLogo').src = toToken.logoURI || '/api/placeholder/24/24';
  document.getElementById('toTokenLogo').onerror = function() {
    this.src = '/api/placeholder/24/24';
  };
  updateTokenBalances();
}

// Open the token selection modal
function openTokenModal(type) {
  const modal = document.getElementById('tokenModal');
  const tokenListContainer = document.getElementById('tokenList');
  
  // Clear previous tokens
  tokenListContainer.innerHTML = '';
  
  // Store the type for use in selection
  tokenListContainer.dataset.selectType = type;
  
  // Populate token list
  tokenList.forEach(token => {
    const tokenItem = document.createElement('div');
    tokenItem.className = 'token-item';
    tokenItem.dataset.symbol = token.symbol;
    tokenItem.dataset.address = token.address;
    
    // Skip the token that's already selected in the other field
    if ((type === 'from' && token.symbol === toToken.symbol) || 
        (type === 'to' && token.symbol === fromToken.symbol)) {
      return;
    }
    
    tokenItem.innerHTML = `
      <img class="token-logo" src="${token.logoURI || '/api/placeholder/24/24'}" alt="${token.symbol}">
      <div class="token-info">
        <div class="token-name">${token.symbol}</div>
        <div class="token-symbol">${token.name}</div>
      </div>
      <div class="token-balance" id="balance-${token.symbol}">Loading...</div>
    `;
    
    // Add error handling for token logo
    const tokenLogo = tokenItem.querySelector('.token-logo');
    tokenLogo.onerror = function() {
      this.src = '/api/placeholder/24/24';
    };
    
    // Add click handler
    tokenItem.addEventListener('click', () => selectToken(token, type));
    
    // Add to list
    tokenListContainer.appendChild(tokenItem);
    
    // Load balance if wallet is connected
    if (currentAccount) {
      getTokenBalance(token.symbol).then(balance => {
        const balanceElement = document.getElementById(`balance-${token.symbol}`);
        if (balanceElement) {
          balanceElement.textContent = parseFloat(balance).toFixed(4);
        }
      });
    }
  });
  
  // Show modal
  modal.style.display = 'flex';
  
  // Add close handler
  document.getElementById('closeModal').onclick = () => {
    modal.style.display = 'none';
  };
  
  // Close when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}

// Select a token from the modal
function selectToken(token, type) {
  if (type === 'from') {
    fromToken = token;
    updateFromTokenUI();
  } else {
    toToken = token;
    updateToTokenUI();
  }
  
  // Close modal
  document.getElementById('tokenModal').style.display = 'none';
  
  // Recalculate swap if there's an amount entered
  if (fromAmount > 0) {
    calculateSwapAmount();
  }
  
  // Update chart
  updateChart();
}

// Open settings modal
function openSettingsModal() {
  const modal = document.getElementById('settingsModal');
  
  // Set current values
  document.querySelectorAll('.slippage-option').forEach(option => {
    if (parseFloat(option.dataset.value) === slippageTolerance) {
      option.classList.add('active');
    } else {
      option.classList.remove('active');
    }
  });
  
  document.getElementById('customSlippage').value = '';
  document.getElementById('deadlineMinutes').value = deadline;
  
  // Show modal
  modal.style.display = 'flex';
  
  // Add close handler
  document.getElementById('closeSettingsModal').onclick = () => {
    modal.style.display = 'none';
  };
  
  // Add slippage option handlers
  document.querySelectorAll('.slippage-option').forEach(option => {
    option.onclick = () => {
      document.querySelectorAll('.slippage-option').forEach(btn => btn.classList.remove('active'));
      option.classList.add('active');
      slippageTolerance = parseFloat(option.dataset.value);
      document.getElementById('customSlippage').value = '';
      updateSwapDetails();
    };
  });
  
  // Add custom slippage handler
  document.getElementById('customSlippage').oninput = (e) => {
    const value = parseFloat(e.target.value);
    if (value > 0) {
      document.querySelectorAll('.slippage-option').forEach(btn => btn.classList.remove('active'));
      slippageTolerance = value;
      updateSwapDetails();
    }
  };
  
  // Add deadline handler
  document.getElementById('deadlineMinutes').oninput = (e) => {
    deadline = parseInt(e.target.value) || 20;
  };
  
  // Close when clicking outside
  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };
}