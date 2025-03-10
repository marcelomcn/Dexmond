import React, { useEffect, useRef } from 'react';

export function TechnicalChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartContainerRef.current) {
      // Chart initialization code would go here
      const chart = document.createElement('div');
      chart.textContent = 'Chart placeholder - real chart would render here';
      chart.style.padding = '20px';
      chart.style.background = '#f0f0f0';
      chart.style.borderRadius = '4px';
      chart.style.textAlign = 'center';
      chartContainerRef.current.appendChild(chart);
    }

    return () => {
      if (chartContainerRef.current) {
        chartContainerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="bg-card p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Price Chart</h3>
      <div ref={chartContainerRef} className="h-[300px]"></div>
    </div>
  );
}

export default TechnicalChart;