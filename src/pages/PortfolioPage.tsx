import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PieChart as PieChartIcon, 
  Wallet, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Plus,
  RefreshCw,
  Building2,
  Bitcoin,
  Download,
  FileText,
  Target,
  Trash2,
  PlusCircle,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  Coins
} from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';
import { PageHeader } from '../components/PageHeader';
import { exportElementToPdf, exportDataToExcel } from '../utils/exportUtils';

interface ManualAsset {
  id: string;
  symbol: string;
  name: string;
  type: 'Saham' | 'Reksa Dana' | 'Kripto' | 'Emas' | 'Kas & Deposito' | 'Lainnya';
  buyPrice: number;
  currentPrice: number;
  shares: number;
}

const DEFAULT_PRICES: Record<string, { price: number; market: string; name: string }> = {
  BBRI: { price: 4850, market: 'IDX', name: 'Bank Rakyat Indonesia Tbk' },
  TLKM: { price: 3620, market: 'IDX', name: 'Telkom Indonesia Tbk' },
  GOTO: { price: 64, market: 'IDX', name: 'GoTo Gojek Tokopedia Tbk' },
  BBCA: { price: 10125, market: 'IDX', name: 'Bank Central Asia Tbk' },
  AAPL: { price: 184.5, market: 'US', name: 'Apple Inc.' },
  NVDA: { price: 864.1, market: 'US', name: 'NVIDIA Corp.' },
  TSLA: { price: 177.2, market: 'US', name: 'Tesla Inc.' },
  BTC: { price: 62450, market: 'CRYPTO', name: 'Bitcoin' },
  GOLD: { price: 2320, market: 'COMMODITY', name: 'Emas Berjangka' },
  ASII: { price: 5200, market: 'IDX', name: 'Astra International Tbk' },
  AMMN: { price: 8750, market: 'IDX', name: 'Amman Mineral Internasional' },
  ANTM: { price: 1650, market: 'IDX', name: 'Aneka Tambang Tbk' },
  MSFT: { price: 420.5, market: 'US', name: 'Microsoft Corp.' },
  AMZN: { price: 185.3, market: 'US', name: 'Amazon.com Inc.' },
  META: { price: 505.2, market: 'US', name: 'Meta Platforms Inc.' },
  ETH: { price: 3450, market: 'CRYPTO', name: 'Ethereum' },
  SOL: { price: 145.2, market: 'CRYPTO', name: 'Solana' },
  SBN019: { price: 1000000, market: 'COMMODITY', name: 'Sukuk Ritel 019' },
  SILVER: { price: 28.5, market: 'COMMODITY', name: 'Perak Berjangka' }
};

const symbolMapping: Record<string, string> = {
  BBRI: "BBRI.JK",
  TLKM: "TLKM.JK",
  GOTO: "GOTO.JK",
  BBCA: "BBCA.JK",
  AAPL: "AAPL",
  NVDA: "NVDA",
  TSLA: "TSLA",
  BTC: "BTC-USD",
  GOLD: "GC=F"
};

export function PortfolioPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'history'>('overview');
  const [investments, setInvestments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [priceStatus, setPriceStatus] = useState<'real-time' | 'simulasi' | 'unavailable'>('real-time');
  const [marketSource, setMarketSource] = useState<string>('Yahoo Finance');

  useEffect(() => {
    let isMounted = true;
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/stock-prices');
        if (!res.ok) throw new Error('Market API error');
        const json = await res.json();
        
        if (json.status === 'unavailable') {
          if (isMounted) {
            setPriceStatus('unavailable');
            setMarketSource(json.source || 'Yahoo Finance');
          }
          return;
        }

        const results = json?.quoteResponse?.result;
        if (results && Array.isArray(results)) {
          const prices: Record<string, number> = {};
          results.forEach((r: any) => {
            const sym = Object.keys(symbolMapping).find(key => symbolMapping[key] === r.symbol);
            if (sym && r.regularMarketPrice) {
              prices[sym] = r.regularMarketPrice;
            }
          });
          if (isMounted) {
            setLivePrices(prices);
            setPriceStatus(json.isSimulated ? 'simulasi' : 'real-time');
            setMarketSource(json.source || 'Yahoo Finance');
          }
        }
      } catch (err) {
        if (isMounted) {
          setPriceStatus('unavailable');
        }
      }
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 15000); // refresh every 15s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Manual Assets State (Persisted in localStorage)
  const [manualAssets, setManualAssets] = useState<ManualAsset[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form input states
  const [formSymbol, setFormSymbol] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Saham' | 'Reksa Dana' | 'Kripto' | 'Emas' | 'Kas & Deposito' | 'Lainnya'>('Saham');
  const [formBuyPrice, setFormBuyPrice] = useState('');
  const [formCurrentPrice, setFormCurrentPrice] = useState('');
  const [formShares, setFormShares] = useState('');

  const TARGET_INVESTMENT = 100000000; // Rp 100.000.000

  // Load manual assets on mount
  useEffect(() => {
    const saved = localStorage.getItem('sikaya_manual_assets');
    if (saved) {
      try {
        setManualAssets(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading manual assets:", e);
      }
    }
  }, []);

  // Fetch virtual simulator assets if authenticated
  useEffect(() => {
    if (token) {
      fetchInvestments();
    }
  }, [token]);

  const fetchInvestments = async () => {
    if (!token || token === 'demo-token') {
      const savedVirtual = localStorage.getItem('sikaya_virtual_investments');
      if (savedVirtual) {
        try {
          setInvestments(JSON.parse(savedVirtual));
        } catch (e) {
          console.error("Error parsing guest virtual investments:", e);
        }
      } else {
        setInvestments([]);
      }
      return;
    }

    setIsLoading(true);
    try {
      const q = query(
        collection(db, 'investmentHistory'),
        where('userId', '==', auth.currentUser?.uid || ''),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          symbol: d.symbol,
          type: d.type,
          shares: d.shares,
          price: d.price,
          total: d.total,
          createdAt: d.createdAt
        };
      });
      // Sort by createdAt descending
      data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setInvestments(data);
    } catch (e) {
      console.error("Error fetching investments from Firestore:", e);
    }
    setIsLoading(false);
  };

  // Save manual assets helper
  const saveManualAssets = (updated: ManualAsset[]) => {
    setManualAssets(updated);
    localStorage.setItem('sikaya_manual_assets', JSON.stringify(updated));
  };

  const handleAddManualAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSymbol.trim() || !formBuyPrice || !formShares) {
      toast.error('Harap isi semua kolom wajib!');
      return;
    }

    const sharesNum = Number(formShares);
    const buyPriceNum = Number(formBuyPrice);
    const currentPriceNum = formCurrentPrice ? Number(formCurrentPrice) : buyPriceNum;

    if (isNaN(sharesNum) || sharesNum <= 0) {
      toast.error('Jumlah unit aset harus lebih dari 0.');
      return;
    }

    if (isNaN(buyPriceNum) || buyPriceNum < 0 || isNaN(currentPriceNum) || currentPriceNum < 0) {
      toast.error('Harga beli atau harga saat ini tidak boleh negatif.');
      return;
    }

    const newAsset: ManualAsset = {
      id: Math.random().toString(36).substring(2, 9),
      symbol: formSymbol.toUpperCase().trim(),
      name: formName.trim() || formSymbol.toUpperCase().trim(),
      type: formType,
      buyPrice: buyPriceNum,
      currentPrice: currentPriceNum,
      shares: sharesNum
    };

    const updated = [...manualAssets, newAsset];
    saveManualAssets(updated);
    toast.success('Aset manual berhasil ditambahkan!');
    
    // Reset Form
    setFormSymbol('');
    setFormName('');
    setFormType('Saham');
    setFormBuyPrice('');
    setFormCurrentPrice('');
    setFormShares('');
    setShowAddForm(false);
  };

  const handleDeleteManualAsset = (id: string) => {
    const updated = manualAssets.filter(asset => asset.id !== id);
    saveManualAssets(updated);
    toast.success('Aset berhasil dihapus');
  };

  // Combine Virtual Holdings with Manual Assets
  const usdToIdr = 16300;

  const virtualHoldings = [...investments].reverse().reduce((acc: any, inv: any) => {
    const symbol = inv.symbol;
    if (!acc[symbol]) {
      acc[symbol] = { shares: 0, totalInvested: 0, avgPrice: 0 };
    }
    
    if (inv.type === 'BELI') {
      const prevShares = acc[symbol].shares;
      const prevAvgPrice = acc[symbol].avgPrice;
      const newShares = prevShares + inv.shares;
      const newAvgPrice = newShares > 0 
        ? ((prevShares * prevAvgPrice) + inv.total) / newShares 
        : 0;
        
      acc[symbol].shares = newShares;
      acc[symbol].avgPrice = newAvgPrice;
      acc[symbol].totalInvested = newShares * newAvgPrice;
    } else if (inv.type === 'JUAL') {
      const prevShares = acc[symbol].shares;
      const newShares = Math.max(0, prevShares - inv.shares);
      
      acc[symbol].shares = newShares;
      acc[symbol].totalInvested = newShares * acc[symbol].avgPrice;
    }
    return acc;
  }, {});

  const getAssetCurrentPrice = (symbol: string) => {
    if (livePrices[symbol] !== undefined) {
      return livePrices[symbol];
    }
    return DEFAULT_PRICES[symbol]?.price || 1000;
  };

  // Summarize into clean structures
  const combinedAssetsList: { 
    id: string; 
    symbol: string; 
    name: string; 
    type: string; 
    amount: number; 
    qty: number;
    buyValue: number;
    change: number; 
    isPositive: boolean; 
    isManual: boolean;
  }[] = [];

  // Add virtual assets with correct USD conversion and latest price
  Object.keys(virtualHoldings).forEach(symbol => {
    const hold = virtualHoldings[symbol];
    if (hold.shares > 0) {
      const def = DEFAULT_PRICES[symbol] || { price: 1000, market: 'IDX', name: symbol };
      const currentPriceInAssetCurrency = getAssetCurrentPrice(symbol);
      const isUsCurrency = def.market === 'US' || def.market === 'CRYPTO' || def.market === 'COMMODITY';
      
      const currentValInIDR = isUsCurrency 
        ? hold.shares * currentPriceInAssetCurrency * usdToIdr 
        : hold.shares * currentPriceInAssetCurrency;
        
      const buyValueInIDR = isUsCurrency 
        ? hold.totalInvested * usdToIdr 
        : hold.totalInvested;
        
      const profitPct = buyValueInIDR > 0 ? ((currentValInIDR - buyValueInIDR) / buyValueInIDR) * 100 : 0;
      
      combinedAssetsList.push({
        id: `v-${symbol}`,
        symbol,
        name: def.name,
        type: def.market === 'CRYPTO' ? 'Kripto' : (def.market === 'COMMODITY' ? 'Emas' : 'Saham'),
        qty: hold.shares,
        buyValue: buyValueInIDR,
        amount: currentValInIDR,
        change: profitPct,
        isPositive: profitPct >= 0,
        isManual: false
      });
    }
  });

  // Add manual assets
  manualAssets.forEach(m => {
    const currentVal = m.shares * m.currentPrice;
    const totalCost = m.shares * m.buyPrice;
    const profitPct = totalCost > 0 ? ((currentVal - totalCost) / totalCost) * 100 : 0;
    combinedAssetsList.push({
      id: m.id,
      symbol: m.symbol,
      name: m.name,
      type: m.type,
      qty: m.shares,
      buyValue: totalCost,
      amount: currentVal,
      change: profitPct,
      isPositive: profitPct >= 0,
      isManual: true
    });
  });

  // Calculate Net Worth
  const totalValue = combinedAssetsList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalCost = combinedAssetsList.reduce((acc, curr) => acc + curr.buyValue, 0);
  const totalUnrealizedProfit = totalValue - totalCost;
  const totalProfitPercent = totalCost > 0 ? (totalUnrealizedProfit / totalCost) * 100 : 0;

  // Pie chart categories distribution
  const allocationMap = {
    'Saham': 0,
    'Reksa Dana': 0,
    'Kripto': 0,
    'Emas': 0,
    'Kas & Deposito': 0,
    'Lainnya': 0
  };

  combinedAssetsList.forEach(asset => {
    const cat = asset.type as keyof typeof allocationMap;
    if (allocationMap[cat] !== undefined) {
      allocationMap[cat] += asset.amount;
    } else {
      allocationMap['Lainnya'] += asset.amount;
    }
  });

  // If portfolio is completely empty, use mock defaults
  const isPortfolioEmpty = combinedAssetsList.length === 0;
  
  const finalTotalValue = isPortfolioEmpty ? 25000000 : totalValue;
  const progressPercentage = Math.min((finalTotalValue / TARGET_INVESTMENT) * 100, 100);

  const portfolioData = isPortfolioEmpty ? [
    { name: 'Saham (Stocks)', value: 15000000, color: '#0d9488' },
    { name: 'Reksa Dana', value: 5000000, color: '#3b82f6' },
    { name: 'Kripto (Crypto)', value: 2500000, color: '#f59e0b' },
    { name: 'Kas & Deposito', value: 2500000, color: '#64748b' },
  ] : [
    { name: 'Saham (Stocks)', value: allocationMap['Saham'], color: '#0d9488' },
    { name: 'Reksa Dana', value: allocationMap['Reksa Dana'], color: '#3b82f6' },
    { name: 'Kripto (Crypto)', value: allocationMap['Kripto'], color: '#f59e0b' },
    { name: 'Emas', value: allocationMap['Emas'], color: '#eab308' },
    { name: 'Kas & Deposito', value: allocationMap['Kas & Deposito'], color: '#8b5cf6' },
    { name: 'Lainnya', value: allocationMap['Lainnya'], color: '#64748b' }
  ].filter(item => item.value > 0);

  const mockChartData = [
    { name: 'Jan', value: finalTotalValue * 0.75 },
    { name: 'Feb', value: finalTotalValue * 0.8 },
    { name: 'Mar', value: finalTotalValue * 0.85 },
    { name: 'Apr', value: finalTotalValue * 0.9 },
    { name: 'May', value: finalTotalValue * 0.95 },
    { name: 'Jun', value: finalTotalValue },
  ];

  const watchlist = [
    { symbol: 'BBRI', name: 'Bank Rakyat Indonesia', price: 'Rp 4.800', change: '+1.2%' },
    { symbol: 'TLKM', name: 'Telkom Indonesia', price: 'Rp 3.200', change: '-0.5%' },
    { symbol: 'ETH', name: 'Ethereum', price: 'Rp 52.000.000', change: '+3.4%' },
  ];

  // Automated Portfolio Audit & Health Check
  const getPortfolioAudit = () => {
    if (isPortfolioEmpty) {
      return {
        score: 60,
        status: "Belum Ada Aset",
        color: "text-amber-500",
        desc: "Tambahkan aset manual pertamamu di bawah untuk mengevaluasi diversifikasi keuangan!",
        advices: [
          "Disiplinlah mengalokasikan minimal 10-20% pendapatan bulanan ke portofolio.",
          "Gunakan fitur 'Tambah Aset Manual' untuk mencatat saham riil, emas, atau reksadana yang kamu miliki."
        ]
      };
    }

    let score = 95;
    const advices: string[] = [];

    // 1. Check Concentration risk (any asset > 50%)
    let highConcentration = false;
    combinedAssetsList.forEach(a => {
      const pct = (a.amount / totalValue) * 100;
      if (pct > 50) {
        highConcentration = true;
        advices.push(`⚠️ Risiko Konsentrasi Tinggi: Aset '${a.symbol}' memakan porsi ${pct.toFixed(0)}% dari seluruh portofoliomu. Disarankan rebalancing ke instrumen lain.`);
      }
    });
    if (highConcentration) score -= 15;

    // 2. Check asset classes count
    const activeClasses = Object.values(allocationMap).filter(val => val > 0).length;
    if (activeClasses < 2) {
      score -= 20;
      advices.push("🚫 Portofolio sangat minim kelas aset. Kamu rentan terhadap gejolak di satu pasar tunggal. Diversifikasi sekarang!");
    } else if (activeClasses < 4) {
      score -= 5;
      advices.push("⚖️ Tingkat diversifikasi sedang. Tambahkan instrumen pelindung seperti Emas Fisik atau Deposito untuk memperkuat ketahanan.");
    }

    // 3. Check defensive cushion (Emas + Kas & Deposito + Reksadana Pasar Uang)
    const defensivePower = (allocationMap['Emas'] + allocationMap['Kas & Deposito'] + allocationMap['Reksa Dana']) / totalValue;
    if (defensivePower < 0.15) {
      score -= 10;
      advices.push("🛡️ Alokasi aset defensif (Kas/Emas/Reksadana) terlalu rendah (<15%). Portofoliomu sangat agresif dan rentan jika bursa crash.");
    }

    // If score is perfect
    if (advices.length === 0) {
      advices.push("🎉 Portofolio Anda seimbang! Anda mengombinasikan aset bertumbuh (saham) dan aset pengaman (emas/kas) secara optimal.");
    }

    let status = "Sangat Sehat";
    let color = "text-emerald-500";
    if (score < 70) {
      status = "Butuh Penyesuaian";
      color = "text-rose-500";
    } else if (score < 85) {
      status = "Cukup Baik";
      color = "text-amber-500";
    }

    return {
      score: Math.max(20, score),
      status,
      color,
      desc: advices[0],
      advices: advices.slice(1)
    };
  };

  const audit = getPortfolioAudit();

  const exportPDF = async () => {
    if (!pdfRef.current) return;
    toast.success('Menyiapkan file PDF...');
    try {
      await exportElementToPdf(pdfRef.current, 'Laporan_Portofolio_Konsolidasi.pdf');
      toast.success('Berhasil mengunduh PDF!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh PDF');
    }
  };

  const exportExcel = async () => {
    try {
      const dataToExport = combinedAssetsList.map(inv => ({
        Nama_Aset: inv.name,
        Simbol: inv.symbol,
        Tipe: inv.type,
        Kuantitas: inv.qty,
        Estimasi_Valuasi: inv.amount,
        Perubahan: `${inv.change.toFixed(1)}%`,
        Status: inv.isManual ? "Manual" : "Virtual Simulator"
      }));
      await exportDataToExcel(dataToExport, "Daftar_Aset_Konsolidasi", "Daftar_Portofolio.xlsx");
      toast.success('Berhasil mengunduh Excel!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal mengunduh file Excel');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8" ref={pdfRef}>
        
        {/* Page Header */}
        <PageHeader
          category="Keuangan"
          title="Dashboard & Portofolio"
          description="Pantau kekayaan bersih, catat aset riil, dan hitung skor diversifikasi investasimu secara terintegrasi."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={fetchInvestments} className="ui-btn-secondary h-9 text-xs">
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Sinkronisasi</span>
              </button>
              <button onClick={exportPDF} className="ui-btn-secondary h-9 text-xs text-indigo-600 dark:text-indigo-400">
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
              <button onClick={exportExcel} className="ui-btn-secondary h-9 text-xs text-emerald-600 dark:text-emerald-400">
                <Download className="w-3.5 h-3.5" />
                <span>Excel</span>
              </button>
            </div>
          }
        />

        {/* Target Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden"
        >
          {isPortfolioEmpty && (
            <div className="absolute top-2 right-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-black px-2 py-0.5 rounded-md font-mono">
              ⚠️ MENGGUNAKAN SIMULASI DATA
            </div>
          )}
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Target Investasi Impian: Rp {TARGET_INVESTMENT.toLocaleString('id-ID')}</h3>
              <p className="text-xs sm:text-sm font-medium text-slate-500">Ayo kumpulkan portofoliomu dan raih kebebasan finansial secepatnya!</p>
            </div>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-4 mb-2 overflow-hidden">
            <div className="bg-gradient-to-r from-teal-400 to-indigo-500 h-4 rounded-full transition-all duration-1000" style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-xs font-bold text-slate-500 font-mono">
            <span>Rp {finalTotalValue.toLocaleString('id-ID')}</span>
            <span>{progressPercentage.toFixed(1)}% Tercapai</span>
          </div>
        </motion.div>

        {/* Top Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-2xl">
                <Wallet className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${totalProfitPercent >= 0 ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30' : 'text-rose-600 bg-rose-50 dark:bg-rose-950/30'}`}>
                {totalProfitPercent >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />} 
                {isPortfolioEmpty ? '12.5%' : `${totalProfitPercent.toFixed(1)}%`}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Total Kekayaan Bersih (Net Worth)</p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-mono">
              Rp {finalTotalValue.toLocaleString('id-ID')}
            </h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl">
                <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg font-mono">
                Floating Profit
              </span>
            </div>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Keuntungan Belum Terealisasi</p>
            <h3 className={`text-2xl sm:text-3xl font-black font-mono ${totalUnrealizedProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {isPortfolioEmpty ? '+Rp 1.250.000' : `${totalUnrealizedProfit >= 0 ? '+' : ''}Rp ${totalUnrealizedProfit.toLocaleString('id-ID')}`}
            </h3>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">Skor Kesehatan Finansial & Diversifikasi</p>
              <div className="flex items-end gap-2 mb-2">
                <h3 className={`text-4xl font-black ${audit.color}`}>{audit.score}</h3>
                <span className="text-slate-400 font-bold mb-1">/ 100</span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-snug">{audit.status}: {audit.desc}</p>
            </div>
          </motion.div>
        </div>

        {/* Realtime Chart & Allocation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 font-display">
              <Activity className="w-5 h-5 text-indigo-500" /> Estimasi Pertumbuhan Aset (6 Bulan Terakhir)
            </h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(val) => `Rp ${val / 1000000}Jt`} />
                  <Tooltip 
                    formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2 font-display">
                <PieChartIcon className="w-5 h-5 text-teal-500" /> Alokasi Kelas Aset
              </h3>
              
              <div className="min-h-[160px] relative">
                <ResponsiveContainer width="100%" height={160}>
                  <RechartsPie>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={4}
                      dataKey="value"
                      stroke="none"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value)}
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Valuasi</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                    Rp {(finalTotalValue / 1000000).toFixed(1)}Jt
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-850 pt-4">
              {portfolioData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[130px]">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">
                    {Math.round((item.value / finalTotalValue) * 100) || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Audit / Advice Checklist Widget */}
        {!isPortfolioEmpty && audit.advices.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-900 border border-amber-150 dark:border-slate-800 rounded-3xl"
          >
            <h4 className="text-xs font-black text-amber-800 dark:text-amber-450 uppercase tracking-widest flex items-center gap-2 mb-3 font-mono">
              <ShieldCheck className="w-4 h-4" /> Checklist Optimasi Diversifikasi Portofolio
            </h4>
            <div className="space-y-2">
              {audit.advices.map((adv, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-amber-500 select-none mt-0.5">&bull;</span>
                  <p>{adv}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Active Asset Inventory Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-850 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white font-display">Gudang Aset Terkonsolidasi</h3>
              <p className="text-xs text-slate-500">Mencakup aset virtual dari simulator bursa dan aset riil kustom Anda.</p>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all hover:opacity-90 cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" /> {showAddForm ? 'Tutup Formulir' : 'Catat Aset Manual'}
            </button>
          </div>

          {/* ADD ASSET FORM (COLLAPSIBLE WITH FRAMER MOTION) */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mb-6"
              >
                <form onSubmit={handleAddManualAsset} className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Formulir Kepemilikan Aset Baru</h4>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Simbol / Kode</label>
                      <input 
                        type="text" value={formSymbol} onChange={e => setFormSymbol(e.target.value)}
                        placeholder="Contoh: ASII, EMAS" required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-black focus:border-indigo-500 uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nama Deskripsi</label>
                      <input 
                        type="text" value={formName} onChange={e => setFormName(e.target.value)}
                        placeholder="Astra International"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kelas Instrumen</label>
                      <select 
                        value={formType} onChange={e => setFormType(e.target.value as any)}
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-bold focus:border-indigo-500"
                      >
                        <option value="Saham">📈 Saham</option>
                        <option value="Reksa Dana">💼 Reksa Dana</option>
                        <option value="Kripto">⚡ Kripto</option>
                        <option value="Emas">🪙 Emas Fisik</option>
                        <option value="Kas & Deposito">🛡️ Kas / Deposito</option>
                        <option value="Lainnya">📦 Lain-lain</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Kuantitas (Lembar/Gram/Unit)</label>
                      <input 
                        type="number" step="any" value={formShares} onChange={e => setFormShares(e.target.value)}
                        placeholder="1000" required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-mono font-bold focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Harga Beli Rata-Rata (Rp)</label>
                      <input 
                        type="number" value={formBuyPrice} onChange={e => setFormBuyPrice(e.target.value)}
                        placeholder="15000" required
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-mono font-bold focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Harga Saat Ini (Rp) - Opsional</label>
                      <input 
                        type="number" value={formCurrentPrice} onChange={e => setFormCurrentPrice(e.target.value)}
                        placeholder="Akan disamakan jika kosong"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-xs font-mono font-bold focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button 
                      type="button" onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
                    >
                      BATAL
                    </button>
                    <button 
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-extrabold shadow-md transition-all cursor-pointer"
                    >
                      SIMPAN ASET
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ASSETS INVENTORY TABLE GRID */}
          {combinedAssetsList.length === 0 ? (
            <div className="text-center py-10 text-slate-400 space-y-2">
              <Layers className="w-10 h-10 mx-auto text-slate-350 opacity-50" />
              <h5 className="font-bold text-sm text-slate-700 dark:text-slate-300">Belum Ada Kepemilikan Tercatat</h5>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Klik tombol 'Catat Aset Manual' atau lakukan trading virtual di simulator belajarmu untuk mengisi portofolio ini.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-450 uppercase tracking-wider font-mono">
                    <th className="py-3 px-2">Simbol Aset</th>
                    <th className="py-3 px-2">Deskripsi</th>
                    <th className="py-3 px-2">Tipe</th>
                    <th className="py-3 px-2 text-right">Kuantitas</th>
                    <th className="py-3 px-2 text-right">Valuasi (IDR)</th>
                    <th className="py-3 px-2 text-right">Imbal Hasil</th>
                    <th className="py-3 px-2 text-center">Status</th>
                    <th className="py-3 px-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-350">
                  {combinedAssetsList.map((asset) => (
                    <tr key={asset.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                      <td className="py-3 px-2 font-black font-mono text-slate-900 dark:text-white text-sm">{asset.symbol}</td>
                      <td className="py-3 px-2 truncate max-w-[150px]">{asset.name}</td>
                      <td className="py-3 px-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350">
                          {asset.type}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-bold text-slate-600 dark:text-slate-400">{asset.qty.toLocaleString('id-ID')}</td>
                      <td className="py-3 px-2 text-right font-black font-mono text-slate-900 dark:text-white">Rp {Math.round(asset.amount).toLocaleString('id-ID')}</td>
                      <td className={`py-3 px-2 text-right font-black font-mono ${asset.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(1)}%
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div className="flex flex-col items-center gap-0.5">
                          <span className={`inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${asset.isManual ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400' : 'bg-teal-50 text-teal-650 dark:bg-teal-950/20 dark:text-teal-400'}`}>
                            {asset.isManual ? 'MANUAL' : 'VIRTUAL'}
                          </span>
                          {!asset.isManual && (
                            <span className={`text-[8px] font-bold px-1 rounded uppercase tracking-wider ${priceStatus === 'real-time' && symbolMapping[asset.symbol] ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'}`}>
                              {priceStatus === 'real-time' && symbolMapping[asset.symbol] ? '⚡ REAL-TIME' : '🔮 SIMULASI'}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        {asset.isManual ? (
                          <button 
                            type="button"
                            onClick={() => handleDeleteManualAsset(asset.id)}
                            className="p-1.5 hover:bg-rose-500/10 text-slate-450 hover:text-rose-500 rounded-lg transition-colors cursor-pointer inline-flex items-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Auto-sync</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Watchlist Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-5 font-display">Watchlist Saham Populer</h3>
            <div className="space-y-4">
              {watchlist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-transparent hover:border-slate-200 transition-colors">
                  <div>
                    <h4 className="font-black text-slate-900 dark:text-white font-mono">{item.symbol}</h4>
                    <p className="text-xs font-medium text-slate-500">{item.name}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-bold text-slate-900 dark:text-white font-mono">{item.price}</h4>
                    <span className={`text-xs font-bold ${item.change.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            
            <div className="space-y-3 relative z-10">
              <span className="text-2xl">💡</span>
              <h4 className="text-lg font-bold font-display leading-tight">Gunakan Simulator Raksasa Belajar!</h4>
              <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-sm">
                Ingin belajar trading saham, kripto, atau reksadana dengan uang mainan virtual sebelum terjun langsung ke pasar modal? Masuk ke modul Belajar, asah skill di classroom, dan lakukan simulasi trading bebas risiko!
              </p>
            </div>
  
            <div className="pt-6 relative z-10">
              <a 
                href="/belajar"
                className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors"
              >
                <span>Pergi ke Kelas Belajar</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Financial Disclaimer Banner */}
        <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>
              <strong>Disclaimer Keuangan:</strong> Ringkasan portofolio dan pencatatan aset manual ini disediakan untuk tujuan pelacakan literasi keuangan pribadi, bukan sebagai alat analisis sekuritas resmi atau rekomendasi investasi.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
