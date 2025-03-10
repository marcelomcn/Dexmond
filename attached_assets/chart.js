// Chart functionality using Lightweight Charts with real data
let chart = null;
let candleSeries = null;
let volumeSeries = null;

// CoinGecko API endpoints
const HISTORICAL_PRICE_API = 'https://api.coingecko.com/api/v3/coins/{id}/market_chart';
const OHLC_API = 'https://api.coingecko.com/api/v3/coins/{id}/ohlc';

// Initialize chart
function initChart() {
  const chartContainer = document.getElementById('priceChart');
  
  // Clear previous chart
  chartContainer.innerHTML = '';
  
  // Check if the library is available without using eval
  if (typeof LightweightCharts === 'undefined') {
    chartContainer.innerHTML = '<div class="chart-placeholder">Chart library not available</div>';
    console.error("LightweightCharts library not found");
    return;
  }
  
  try {
    // Create chart with CSP-safe configuration
    // Avoid any string-based function creation
    chart = LightweightCharts.createChart(chartContainer, {
      width: chartContainer.clientWidth,
      height: 300,
      layout: {
        backgroundColor: 'transparent',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      grid: {
        vertLines: {
          color: 'rgba(197, 203, 206, 0.2)',
        },
        horzLines: {
          color: 'rgba(197, 203, 206, 0.2)',
        },
      },
      crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
        textColor: 'rgba(255, 255, 255, 0.9)',
      },
      timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.4)',
        textColor: 'rgba(255, 255, 255, 0.9)',
        timeVisible: true,
      },
    });
    
    // Add candlestick series
    candleSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderDownColor: '#ef5350',
      borderUpColor: '#26a69a',
      wickDownColor: '#ef5350',
      wickUpColor: '#26a69a',
    });
    
    // Add volume series
    volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });
    
    // Handle resize - use function reference, not string
    const handleResize = () => {
      if (chart) {
        chart.applyOptions({
          width: chartContainer.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    // Show loading placeholder
    chartContainer.innerHTML = '<div class="chart-placeholder">Chart will load after selecting tokens</div>';
  } catch (error) {
    console.error("Error initializing chart:", error);
    chartContainer.innerHTML = '<div class="chart-placeholder">Failed to initialize chart</div>';
  }
}

// Update chart with new data
async function updateChart() {
  if (!fromToken || !toToken) return;
  
  const chartContainer = document.getElementById('priceChart');
  chartContainer.innerHTML = '<div class="chart-placeholder">Loading chart data...</div>';
  
  try {
    // Get historical data for the trading pair
    const [candleData, volumeData] = await fetchHistoricalData();
    
    if (!candleData || candleData.length === 0) {
      chartContainer.innerHTML = '<div class="chart-placeholder">No chart data available</div>';
      return;
    }
    
    // Clear previous chart
    chartContainer.innerHTML = '';
    
    // Reinitialize chart if needed
    if (!chart) {
      initChart();
    }
    
    // Set chart data
    candleSeries.setData(candleData);
    
    // Set volume data if available
    if (volumeData && volumeData.length > 0) {
      volumeSeries.setData(volumeData);
    }
    
    // Fit content to the visible range
    chart.timeScale().fitContent();
    
  } catch (error) {
    console.error("Chart error:", error);
    chartContainer.innerHTML = '<div class="chart-placeholder">Failed to load chart data</div>';
  }
}

// Fetch historical price data
async function fetchHistoricalData() {
  const fromCoinId = tokenToCoinGeckoId[fromToken.symbol];
  const toCoinId = tokenToCoinGeckoId[toToken.symbol];
  
  if (!fromCoinId) {
    console.error(`No CoinGecko ID for ${fromToken.symbol}`);
    return [[], []];
  }
  
  try {
    // Try to get OHLC data first (most accurate for charts)
    const ohlcResponse = await fetch(`${OHLC_API.replace('{id}', fromCoinId)}?vs_currency=usd&days=14`);
    
    // If we got a successful response
    if (ohlcResponse.ok) {
      const ohlcData = await ohlcResponse.json();
      
      // Format data for candlestick chart
      const candleData = ohlcData.map(candle => {
        return {
          time: candle[0] / 1000,
          open: candle[1],
          high: candle[2],
          low: candle[3],
          close: candle[4]
        };
      });
      
      // Now get volume data from market chart API
      const volumeData = await fetchVolumeData(fromCoinId);
      
      return [candleData, volumeData];
    } else {
      // Fall back to market chart data if OHLC fails
      console.warn("OHLC API failed, falling back to market chart data");
      return await fetchMarketChartData(fromCoinId);
    }
  } catch (error) {
    console.error("Error fetching historical data:", error);
    
    // Try fallback method if primary fails
    try {
      console.log("Trying fallback data method...");
      return await fetchMarketChartData(fromCoinId);
    } catch (fallbackError) {
      console.error("Fallback data fetch failed:", fallbackError);
      return [[], []];
    }
  }
}

// Fetch market chart data as fallback
async function fetchMarketChartData(coinId) {
  const response = await fetch(`${HISTORICAL_PRICE_API.replace('{id}', coinId)}?vs_currency=usd&days=14&interval=daily`);
  const data = await response.json();
  
  // Convert to candlestick format
  const candleData = [];
  const volumeData = [];
  
  // Group price data by day
  const dailyData = groupDataByDay(data.prices);
  const volumeByDay = data.total_volumes ? groupDataByDay(data.total_volumes) : {};
  
  // Process each day's data
  for (const [timestamp, prices] of Object.entries(dailyData)) {
    if (prices.length === 0) continue;
    
    // Calculate OHLC
    const time = parseInt(timestamp) / 1000; // Convert to seconds
    const open = prices[0];
    const close = prices[prices.length - 1];
    const high = Math.max(...prices);
    const low = Math.min(...prices);
    
    // Add candlestick data
    candleData.push({
      time,
      open,
      high,
      low,
      close
    });
    
    // Add volume data if available
    if (volumeByDay[timestamp] && volumeByDay[timestamp].length > 0) {
      volumeData.push({
        time,
        value: volumeByDay[timestamp][0],
        color: open <= close ? '#26a69a' : '#ef5350'
      });
    }
  }
  
  return [candleData, volumeData];
}

// Fetch just volume data
async function fetchVolumeData(coinId) {
  try {
    const response = await fetch(`${HISTORICAL_PRICE_API.replace('{id}', coinId)}?vs_currency=usd&days=14&interval=daily`);
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    if (!data.total_volumes || data.total_volumes.length === 0) {
      return [];
    }
    
    // Get price data to determine candle colors
    const priceData = groupDataByDay(data.prices);
    const volumeByDay = groupDataByDay(data.total_volumes);
    
    // Create volume data
    const volumeData = [];
    
    for (const [timestamp, volumes] of Object.entries(volumeByDay)) {
      if (volumes.length === 0) continue;
      
      const time = parseInt(timestamp) / 1000;
      const volume = volumes[0];
      
      // Determine color based on price movement
      let color = '#26a69a'; // Default green
      
      if (priceData[timestamp] && priceData[timestamp].length >= 2) {
        const open = priceData[timestamp][0];
        const close = priceData[timestamp][priceData[timestamp].length - 1];
        color = open <= close ? '#26a69a' : '#ef5350';
      }
      
      volumeData.push({
        time,
        value: volume,
        color
      });
    }
    
    return volumeData;
  } catch (error) {
    console.error("Error fetching volume data:", error);
    return [];
  }
}

// Group data by day
function groupDataByDay(dataPoints) {
  const groupedData = {};
  
  if (!dataPoints || !Array.isArray(dataPoints)) {
    return groupedData;
  }
  
  dataPoints.forEach(point => {
    const timestamp = point[0];
    const value = point[1];
    
    // Get the day timestamp (midnight)
    const date = new Date(timestamp);
    date.setHours(0, 0, 0, 0);
    const dayTimestamp = date.getTime();
    
    if (!groupedData[dayTimestamp]) {
      groupedData[dayTimestamp] = [];
    }
    
    groupedData[dayTimestamp].push(value);
  });
  
  return groupedData;
}

// Switch between chart and orderbook tabs
function initTabs() {
  const tabs = document.querySelectorAll('.market-tab');
  const priceChart = document.getElementById('priceChart');
  const orderBook = document.getElementById('orderBook');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      
      // Add active class to clicked tab
      tab.classList.add('active');
      
      // Show appropriate content
      if (tab.dataset.tab === 'chart') {
        priceChart.style.display = 'block';
        orderBook.style.display = 'none';
      } else {
        priceChart.style.display = 'none';
        orderBook.style.display = 'block';
        
        // Update orderbook when switching to it
        updateOrderbook();
      }
    });
  });
}