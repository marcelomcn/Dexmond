interface Window {
  ethereum?: any;
  LightweightCharts?: any;
  dexmond: {
    orderbook: {
      generateOrderbookData: () => Promise<Array<{
        type: 'buy' | 'sell';
        price: number;
        amount: number;
        total: number;
        source: string;
      }>>;
    };
    chart: {
      updateChartData: (candlestickSeries: any) => Promise<void>;
    };
  };
  safeEthers: any;
}
