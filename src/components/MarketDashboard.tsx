import { useState, useEffect } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, Sparkles, Wallet, ShoppingCart, Activity, Megaphone } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const initialMarketData = [
  { time: '09:00', crypto: 42000, stocks: 5100, gold: 1950 },
  { time: '10:00', crypto: 42500, stocks: 5120, gold: 1945 },
  { time: '11:00', crypto: 41800, stocks: 5110, gold: 1955 },
  { time: '12:00', crypto: 43200, stocks: 5140, gold: 1960 },
  { time: '13:00', crypto: 43800, stocks: 5160, gold: 1950 },
  { time: '14:00', crypto: 43500, stocks: 5150, gold: 1940 },
  { time: '15:00', crypto: 44100, stocks: 5180, gold: 1948 },
  { time: '16:00', crypto: 44500, stocks: 5200, gold: 1955 },
];

const newsHeadlines = [
  "BREAKING: Bank Sentral umumkan kenaikan suku bunga, saham terkoreksi.",
  "Tren positif: Adopsi Kripto meningkat di institusi raksasa Wall Street.",
  "Krisis energi global memicu ketidakpastian, investor beralih ke Emas murni.",
  "Laporan keuangan Kuartal III rilis: Perusahaan Blue Chip raih profit rekor!",
  "Cuitan tokoh teknologi buat harga Kripto anjlok tajam dalam 5 menit.",
  "Data inflasi melandai, Indeks Saham kembali menghijau hari ini.",
  "Ketegangan geopolitik meningkat, harga Emas perlahan tembus rekor baru.",
];

export function MarketDashboard() {
  const { toast } = useToast();
  const [marketData, setMarketData] = useState(initialMarketData);
  const [cryptoPrice, setCryptoPrice] = useState(44500);
  const [stocksPrice, setStocksPrice] = useState(5200);
  const [goldPrice, setGoldPrice] = useState(1955);
  const [cryptoChange, setCryptoChange] = useState(0.85);
  const [stocksChange, setStocksChange] = useState(0.45);
  
  // News Ticker State
  const [currentNews, setCurrentNews] = useState(newsHeadlines[0]);

  // Paper Trading State
  const [balance, setBalance] = useState(10000); // $10,000 starting cash
  const [holdings, setHoldings] = useState({ crypto: 0, stocks: 0, gold: 0 });
  const [tradeAmount, setTradeAmount] = useState<number>(100);

  const calculatePortfolioValue = () => {
    return balance + 
      (holdings.crypto * cryptoPrice) + 
      (holdings.stocks * stocksPrice) + 
      (holdings.gold * goldPrice);
  };

  const handleBuy = (asset: 'crypto' | 'stocks' | 'gold', price: number) => {
    if (balance >= tradeAmount) {
      const amountToBuy = tradeAmount / price;
      setBalance(prev => prev - tradeAmount);
      setHoldings(prev => ({ ...prev, [asset]: prev[asset] + amountToBuy }));
      toast.success(`Berhasil membeli ${amountToBuy.toFixed(4)} unit ${asset}!`);
    } else {
      toast.error("Saldo virtual tidak cukup!");
    }
  };

  const handleSell = (asset: 'crypto' | 'stocks' | 'gold', price: number) => {
    const amountToSell = tradeAmount / price;
    if (holdings[asset] >= amountToSell) {
      setBalance(prev => prev + tradeAmount);
      setHoldings(prev => ({ ...prev, [asset]: prev[asset] - amountToSell }));
      toast.success(`Berhasil menjual ${amountToSell.toFixed(4)} unit ${asset}!`);
    } else if (holdings[asset] > 0) {
      // Sell all remaining if less than trade amount
      const sellValue = holdings[asset] * price;
      setBalance(prev => prev + sellValue);
      setHoldings(prev => ({ ...prev, [asset]: 0 }));
      toast.success(`Berhasil menjual semua unit ${asset} tersisa senilai $${sellValue.toFixed(2)}!`);
    } else {
      toast.error(`Anda tidak memiliki aset ${asset} untuk dijual!`);
    }
  };

  useEffect(() => {
    // Live Pulse Simulation - Update 7 & 8
    const interval = setInterval(() => {
      setMarketData((prev) => {
        const lastRow = prev[prev.length - 1];
        const cryptoRandom = (Math.random() - 0.48) * 120; // soft positive drift
        const stocksRandom = (Math.random() - 0.5) * 12;
        const goldRandom = (Math.random() - 0.5) * 4;

        const updatedData = [...prev];
        const newCrypto = Math.round(lastRow.crypto + cryptoRandom);
        const newStocks = Math.round(lastRow.stocks + stocksRandom);
        const newGold = Math.round(lastRow.gold + goldRandom);

        updatedData[updatedData.length - 1] = {
          ...lastRow,
          crypto: newCrypto,
          stocks: newStocks,
          gold: newGold,
        };

        // Update top bar figures
        setCryptoPrice(newCrypto);
        setStocksPrice(newStocks);
        setGoldPrice(newGold);
        
        // Calculate dynamic live change
        const firstCrypto = initialMarketData[0].crypto;
        const firstStocks = initialMarketData[0].stocks;
        setCryptoChange(((newCrypto - firstCrypto) / firstCrypto) * 100);
        setStocksChange(((newStocks - firstStocks) / firstStocks) * 100);

        return updatedData;
      });
    }, 3000);

    // News rotation
    const newsInterval = setInterval(() => {
      setCurrentNews(newsHeadlines[Math.floor(Math.random() * newsHeadlines.length)]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(newsInterval);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 transition-colors">
      
      {/* Gamification Header: Paper Trading Portfolio */}
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center bg-slate-900 dark:bg-black text-white p-4 rounded-xl shadow-lg border border-slate-800 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/20 text-teal-400 rounded-lg">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-500">Total Nilai Portofolio</p>
            <h2 className="text-xl font-extrabold flex items-center gap-2">
              ${calculatePortfolioValue().toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${calculatePortfolioValue() >= 10000 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {calculatePortfolioValue() >= 10000 ? '+' : ''}{(((calculatePortfolioValue() - 10000) / 10000) * 100).toFixed(2)}%
              </span>
            </h2>
          </div>
        </div>
        <div className="flex gap-4 text-xs font-semibold">
          <div className="text-center">
            <p className="text-slate-500">Saldo Cash</p>
            <p className="text-slate-200">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">Aset Kripto</p>
            <p className="text-teal-400">{holdings.crypto.toFixed(4)}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">Lembar Saham</p>
            <p className="text-indigo-400">{holdings.stocks.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500">Gram Emas</p>
            <p className="text-amber-400">{holdings.gold.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Live News Ticker */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-lg p-2 mb-6 flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 shrink-0">
          <Megaphone className="w-4 h-4 animate-bounce" />
          <span className="text-[10px] font-black uppercase tracking-wider">BERITA PASAR:</span>
        </div>
        <div className="w-full relative whitespace-nowrap overflow-hidden">
          <p key={currentNews} className="text-xs font-bold text-amber-800 dark:text-amber-400 animate-slide-in-right truncate">
            {currentNews}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-teal-600 dark:text-teal-450" />
              Papan Simulasi Pasar Berdenyut
            </h3>
            {/* Dynamic Status Badge - Update 8 */}
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-[9px] font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-widest animate-pulse border border-emerald-100 dark:border-emerald-900/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> LIVE
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Grafik simulasi diperbarui langsung setiap 3 detik. Cobalah beli atau jual aset untuk praktek.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 flex-1 sm:flex-none">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Simulasi Crypto</p>
            <p className="text-xs font-bold text-teal-600 dark:text-teal-400 flex items-center gap-0.5 mt-0.5">
              ${cryptoPrice.toLocaleString('id-ID')} 
              <span className="text-[9px] font-bold">({cryptoChange >= 0 ? '+' : ''}{cryptoChange.toFixed(2)}%)</span>
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-850 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800 flex-1 sm:flex-none">
            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase">Simulasi Saham</p>
            <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 mt-0.5">
              ${stocksPrice.toLocaleString('id-ID')}
              <span className="text-[9px] font-bold">({stocksChange >= 0 ? '+' : ''}{stocksChange.toFixed(2)}%)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Reduced chart height for visual compactness - Update 10 */}
      <div className="h-[240px] w-full mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={marketData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCrypto" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorStocks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d97706" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis 
              dataKey="time" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              dy={6}
            />
            <YAxis 
              yAxisId="left"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              tickFormatter={(val) => `$${val}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                borderRadius: '12px', 
                border: '1px solid rgba(148, 163, 184, 0.2)', 
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                color: '#f8fafc',
                boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.15)',
                fontSize: '11px',
                fontWeight: 600,
              }}
            />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 600, paddingTop: '8px' }} />
            <Area yAxisId="left" type="monotone" dataKey="crypto" name="Kripto (Simulasi)" stroke="#0d9488" strokeWidth={1.5} fillOpacity={1} fill="url(#colorCrypto)" />
            <Area yAxisId="right" type="monotone" dataKey="stocks" name="Indeks Saham (Simulasi)" stroke="#4f46e5" strokeWidth={1.5} fillOpacity={1} fill="url(#colorStocks)" />
            <Area yAxisId="right" type="monotone" dataKey="gold" name="Emas murni" stroke="#d97706" strokeWidth={1.5} fillOpacity={1} fill="url(#colorGold)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Trading Actions Panel */}
      <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <ShoppingCart className="w-4 h-4 text-slate-500" /> Panel Transaksi Virtual
          </h4>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium">Nilai Transaksi:</span>
            <select 
              value={tradeAmount} 
              onChange={(e) => setTradeAmount(Number(e.target.value))}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-xs font-bold focus:outline-none"
            >
              <option value={100}>$100</option>
              <option value={500}>$500</option>
              <option value={1000}>$1,000</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Crypto Trade */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400">Kripto</p>
              <p className="text-xs font-extrabold">${cryptoPrice.toLocaleString('en-US')}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleBuy('crypto', cryptoPrice)} className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-black rounded hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors">BELI</button>
              <button onClick={() => handleSell('crypto', cryptoPrice)} className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 text-[10px] font-black rounded hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors">JUAL</button>
            </div>
          </div>
          {/* Stocks Trade */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">Saham</p>
              <p className="text-xs font-extrabold">${stocksPrice.toLocaleString('en-US')}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleBuy('stocks', stocksPrice)} className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-black rounded hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors">BELI</button>
              <button onClick={() => handleSell('stocks', stocksPrice)} className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 text-[10px] font-black rounded hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors">JUAL</button>
            </div>
          </div>
          {/* Gold Trade */}
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">Emas</p>
              <p className="text-xs font-extrabold">${goldPrice.toLocaleString('en-US')}</p>
            </div>
            <div className="flex gap-1.5">
              <button onClick={() => handleBuy('gold', goldPrice)} className="px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-[10px] font-black rounded hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors">BELI</button>
              <button onClick={() => handleSell('gold', goldPrice)} className="px-3 py-1 bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400 text-[10px] font-black rounded hover:bg-rose-200 dark:hover:bg-rose-900 transition-colors">JUAL</button>
            </div>
          </div>
        </div>
      </div>

      {/* Explanatory Asset Tooltips - Update 9 */}
      <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[9px] text-slate-400 dark:text-slate-500 font-semibold text-center">
        <div>
          <span className="text-teal-600 dark:text-teal-400 font-bold block mb-0.5">🪙 Kripto</span>
          Volatilitas tinggi, pergerakan liar, cocok dipelajari di masa muda namun berisiko sangat tinggi.
        </div>
        <div>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-0.5">📈 Indeks Saham</span>
          Kumpulan emiten besar bursa, menawarkan pertumbuhan jangka panjang yang kuat & terukur.
        </div>
        <div>
          <span className="text-amber-600 dark:text-amber-400 font-bold block mb-0.5">⚜️ Emas Murni</span>
          Aset pelindung nilai (safe-haven) terhadap inflasi dunia, pergerakan cenderung lambat tapi stabil.
        </div>
      </div>
    </div>
  );
}

