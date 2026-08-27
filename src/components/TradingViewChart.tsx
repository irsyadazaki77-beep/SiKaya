import React from 'react';

interface TradingViewChartProps {
  symbol: string;
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
  const encodedSymbol = encodeURIComponent(symbol);
  // Using official high-performance widget embed URL
  const iframeUrl = `https://s.tradingview.com/widgetembed/?symbol=${encodedSymbol}&theme=dark&style=1&timezone=Asia%2FJakarta&locale=id&interval=D&toolbarbg=131722&hide_side_toolbar=false&allow_symbol_change=false&saveimage=1&studies=%5B%5D`;

  return (
    <div className="w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
      <iframe
        id="tradingview-iframe-widget"
        title="TradingView Chart"
        src={iframeUrl}
        className="w-full h-full border-none"
        allowFullScreen
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
