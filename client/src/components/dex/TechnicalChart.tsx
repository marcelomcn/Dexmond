
import React from 'react';

interface TechnicalChartProps {
  symbol?: string;
  timeframe?: string;
}

export function TechnicalChart({ symbol = 'BTCUSDT', timeframe = '1d' }: TechnicalChartProps) {
  return (
    <div className="bg-card rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{symbol} Price Chart</h2>
        <div className="flex gap-2">
          <button className="px-2 py-1 text-xs rounded bg-muted">1h</button>
          <button className="px-2 py-1 text-xs rounded bg-primary text-primary-foreground">1d</button>
          <button className="px-2 py-1 text-xs rounded bg-muted">1w</button>
          <button className="px-2 py-1 text-xs rounded bg-muted">1m</button>
        </div>
      </div>
      
      <div className="aspect-video bg-muted rounded flex items-center justify-center">
        <p className="text-muted-foreground">Chart visualization will appear here</p>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-muted-foreground">24h Change</p>
          <p className="text-green-500">+2.45%</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">24h Volume</p>
          <p>$1.2B</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Market Cap</p>
          <p>$43.8B</p>
        </div>
      </div>
    </div>
  );
}
