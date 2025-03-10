// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
  // Show loading screen
  const loadingScreen = document.getElementById('initialLoading');
  if (loadingScreen) {
    loadingScreen.style.display = 'flex';
  }
  
  try {
    // Initialize wallet connection
    await initWallet();
    
    // Initialize swap functionality
    await initSwap();
    
    // Initialize chart
    initChart();
    
    // Initialize tabs
    initTabs();
    
    // Initialize default tokens
    updateFromTokenUI();
    updateToTokenUI();
    
    // Poll for token prices every 60 seconds
    setInterval(async () => {
      if (fromAmount > 0) {
        await calculateSwapAmount();
      }
    }, 60000);
    
    // Attempt to load chart
    await updateChart();
    
    // Log initialization success
    console.log('Dexmond initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    
    // Show error message if initialization fails
    const errorMsg = document.createElement('div');
    errorMsg.className = 'initialization-error';
    errorMsg.textContent = 'Failed to initialize application. Please refresh the page or check your connection.';
    document.body.appendChild(errorMsg);
  } finally {
    // Hide loading screen after initialization (success or failure)
    setTimeout(() => {
      if (loadingScreen) {
        loadingScreen.classList.add('hide');
        setTimeout(() => {
          if (loadingScreen.parentNode) {
            loadingScreen.parentNode.removeChild(loadingScreen);
          }
        }, 500);
      }
    }, 1000);
  }
});