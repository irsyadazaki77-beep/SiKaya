import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, TrendingDown, DollarSign, Wallet, ShoppingBag, 
  Search, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3, 
  Info, History, CheckCircle2, AlertCircle, Sparkles, Globe,
  Play, Pause, FastForward, Award, PieChart as PieIcon, Landmark,
  BookOpen, UserCheck, HelpCircle, Download, RotateCcw, Flame, Check, X, ShieldAlert
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Line, Legend, PieChart, Pie, Cell } from 'recharts';
import { TradingViewChart } from '../components/TradingViewChart';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';

interface Asset {
  symbol: string;
  name: string;
  market: 'IDX' | 'US' | 'CRYPTO' | 'COMMODITY';
  price: number;
  change: number;
  prevClose: number;
  volume: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  dayRange: string;
  description: string;
  sector: string;
  chartData: { time: string; value: number }[];
}

interface PendingOrder {
  id: string;
  symbol: string;
  type: 'LIMIT_BELI' | 'LIMIT_JUAL' | 'STOP_LOSS';
  targetPrice: number;
  shares: number;
}

interface Transaction {
  id: string;
  type: 'BELI' | 'JUAL' | 'DEVIDEN' | 'BONUS';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}

const initialAssets: Asset[] = [
  {
    symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk", market: "IDX", price: 4850, change: 1.2, prevClose: 4790,
    volume: "124M", marketCap: "Rp 735T", peRatio: "11.4x", dividendYield: "6.1%", dayRange: "4780-4900", sector: "Keuangan",
    description: "Bank BUMN terbesar berfokus pada pembiayaan UMKM nasional.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 4700 + Math.random() * 200 }))
  },
  {
    symbol: "TLKM", name: "Telkom Indonesia Tbk", market: "IDX", price: 3620, change: -0.8, prevClose: 3650,
    volume: "45M", marketCap: "Rp 358T", peRatio: "14.8x", dividendYield: "5.2%", dayRange: "3600-3680", sector: "Infrastruktur",
    description: "Raksasa telekomunikasi digital dan seluler Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 3550 + Math.random() * 150 }))
  },
  {
    symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk", market: "IDX", price: 64, change: 3.2, prevClose: 62,
    volume: "1.2B", marketCap: "Rp 76T", peRatio: "N/A", dividendYield: "0%", dayRange: "61-66", sector: "Teknologi",
    description: "Ekosistem digital on-demand, e-commerce, dan fintech terbesar.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 60 + Math.random() * 8 }))
  },
  {
    symbol: "BBCA", name: "Bank Central Asia Tbk", market: "IDX", price: 10125, change: 0.5, prevClose: 10075,
    volume: "85M", marketCap: "Rp 1,240T", peRatio: "24.1x", dividendYield: "2.8%", dayRange: "10000-10200", sector: "Keuangan",
    description: "Bank swasta terbesar di Indonesia dengan likuiditas tinggi.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 9950 + Math.random() * 300 }))
  },
  {
    symbol: "AAPL", name: "Apple Inc.", market: "US", price: 184.5, change: 1.4, prevClose: 181.86,
    volume: "58M", marketCap: "$2.89T", peRatio: "29.4x", dividendYield: "0.5%", dayRange: "181-186", sector: "Teknologi",
    description: "Pencipta iPhone, MacOS, dan ekosistem digital premium global.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 180 + Math.random() * 8 }))
  },
  {
    symbol: "NVDA", name: "NVIDIA Corp.", market: "US", price: 864.1, change: 4.8, prevClose: 823.89,
    volume: "47M", marketCap: "$2.16T", peRatio: "74.2x", dividendYield: "0.02%", dayRange: "820-870", sector: "Teknologi",
    description: "Pionir super chip GPU dan kecerdasan buatan (AI) dunia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 810 + Math.random() * 60 }))
  },
  {
    symbol: "TSLA", name: "Tesla Inc.", market: "US", price: 177.2, change: -2.3, prevClose: 181.46,
    volume: "89M", marketCap: "$564B", peRatio: "42.1x", dividendYield: "0%", dayRange: "175-183", sector: "Otomotif",
    description: "Inovator mobil listrik, baterai, dan energi bersih milik Elon Musk.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 173 + Math.random() * 12 }))
  },
  {
    symbol: "BTC", name: "Bitcoin", market: "CRYPTO", price: 62450, change: 1.8, prevClose: 61320,
    volume: "28B", marketCap: "$1.22T", peRatio: "N/A", dividendYield: "0%", dayRange: "61000-63500", sector: "Kripto",
    description: "Mata uang digital kripto desentralisasi pertama di dunia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 60500 + Math.random() * 2500 }))
  },
  {
    symbol: "GOLD", name: "Emas Berjangka", market: "COMMODITY", price: 2320, change: 0.7, prevClose: 2304,
    volume: "120K", marketCap: "N/A", peRatio: "N/A", dividendYield: "0%", dayRange: "2290-2340", sector: "Komoditas",
    description: "Aset lindung nilai (safe haven) fisik global terpopuler.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 2280 + Math.random() * 50 }))
  }
,
  {
    symbol: "ASII", name: "Astra International Tbk", market: "IDX", price: 5200, change: 0.5, prevClose: 5175,
    volume: "34M", marketCap: "Rp 210T", peRatio: "7.2x", dividendYield: "8.5%", dayRange: "5150-5250", sector: "Otomotif & Multisektor",
    description: "Konglomerasi otomotif, alat berat, dan agribisnis terbesar di Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 5100 + Math.random() * 150 }))
  },
  {
    symbol: "AMMN", name: "Amman Mineral Internasional", market: "IDX", price: 8750, change: 2.1, prevClose: 8570,
    volume: "21M", marketCap: "Rp 634T", peRatio: "15.4x", dividendYield: "0%", dayRange: "8500-8800", sector: "Pertambangan",
    description: "Perusahaan tambang tembaga dan emas raksasa di Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 8500 + Math.random() * 300 }))
  },
  {
    symbol: "ANTM", name: "Aneka Tambang Tbk", market: "IDX", price: 1650, change: -1.2, prevClose: 1670,
    volume: "45M", marketCap: "Rp 39T", peRatio: "12.8x", dividendYield: "3.2%", dayRange: "1640-1680", sector: "Pertambangan",
    description: "BUMN pertambangan emas, nikel, dan bauksit terkemuka.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 1620 + Math.random() * 60 }))
  },
  {
    symbol: "MSFT", name: "Microsoft Corp.", market: "US", price: 420.5, change: 0.8, prevClose: 417.1,
    volume: "22M", marketCap: "$3.1T", peRatio: "35.2x", dividendYield: "0.7%", dayRange: "415-425", sector: "Teknologi",
    description: "Raksasa software dan cloud computing, pemimpin tren AI global.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 410 + Math.random() * 15 }))
  },
  {
    symbol: "AMZN", name: "Amazon.com Inc.", market: "US", price: 185.3, change: -0.4, prevClose: 186.0,
    volume: "35M", marketCap: "$1.9T", peRatio: "42.5x", dividendYield: "0%", dayRange: "182-188", sector: "Konsumer & Cloud",
    description: "Pemimpin e-commerce global dan penyedia layanan cloud AWS.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 180 + Math.random() * 10 }))
  },
  {
    symbol: "META", name: "Meta Platforms Inc.", market: "US", price: 505.2, change: 1.5, prevClose: 497.7,
    volume: "18M", marketCap: "$1.28T", peRatio: "28.3x", dividendYield: "0.4%", dayRange: "495-510", sector: "Teknologi",
    description: "Induk perusahaan Facebook, Instagram, dan WhatsApp.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 490 + Math.random() * 20 }))
  },
  {
    symbol: "ETH", name: "Ethereum", market: "CRYPTO", price: 3450, change: -2.5, prevClose: 3540,
    volume: "12B", marketCap: "$415B", peRatio: "N/A", dividendYield: "0%", dayRange: "3400-3580", sector: "Kripto",
    description: "Platform blockchain terbesar untuk smart contract dan DeFi.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 3400 + Math.random() * 150 }))
  },
  {
    symbol: "SOL", name: "Solana", market: "CRYPTO", price: 145.2, change: 5.4, prevClose: 137.8,
    volume: "4.2B", marketCap: "$65B", peRatio: "N/A", dividendYield: "0%", dayRange: "135-148", sector: "Kripto",
    description: "Blockchain kecepatan tinggi dengan biaya transaksi sangat rendah.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 135 + Math.random() * 15 }))
  },
  {
    symbol: "SBN019", name: "Sukuk Ritel 019", market: "COMMODITY", price: 1000000, change: 0, prevClose: 1000000,
    volume: "N/A", marketCap: "N/A", peRatio: "N/A", dividendYield: "5.95%", dayRange: "1000000-1000000", sector: "Obligasi",
    description: "Surat Berharga Syariah Negara, investasi aman dijamin pemerintah.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 1000000 }))
  },
  {
    symbol: "SILVER", name: "Perak Berjangka", market: "COMMODITY", price: 28.5, change: 1.2, prevClose: 28.1,
    volume: "65K", marketCap: "N/A", peRatio: "N/A", dividendYield: "0%", dayRange: "28.0-28.8", sector: "Komoditas",
    description: "Logam mulia industri dengan pergerakan lebih volatil dibanding emas.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 27.5 + Math.random() * 1.5 }))
  }
];

const mockNews = [
  { text: "NVIDIA merilis superkomputer AI generasi terbaru, saham NVDA melonjak!", impact: { NVDA: 0.06 } },
  { text: "Inflasi AS melandai, sentimen positif untuk pasar saham Wall Street.", impact: { AAPL: 0.02, TSLA: 0.03 } },
  { text: "Bank Indonesia menahan suku bunga acuan, sektor finansial IDX stabil.", impact: { BBRI: 0.015, BBCA: 0.01 } },
  { text: "GoTo meluncurkan fitur integrasi AI baru untuk mitra driver, GOTO menguat.", impact: { GOTO: 0.05 } },
  { text: "Volatilitas Kripto meningkat tajam menjelang regulasi baru AS.", impact: { BTC: -0.04 } },
  { text: "Emas dunia kembali menjadi incaran seiring ketidakpastian geopolitik.", impact: { GOLD: 0.025 } },
  { text: "Tesla mengumumkan efisiensi pabrik Gigafactory baru, ongkos produksi turun.", impact: { TSLA: 0.04 } },
  { text: "Layanan broadband Telkomsel mengalami gangguan singkat, harga saham terkoreksi.", impact: { TLKM: -0.02 } }
,
  { text: "The Fed memutuskan untuk menaikkan suku bunga, saham teknologi terkoreksi.", impact: { AAPL: -0.03, MSFT: -0.02, META: -0.025 } },
  { text: "Pemerintah meluncurkan insentif kendaraan listrik besar-besaran.", impact: { ASII: 0.04, AMMN: 0.02 } },
  { text: "Ethereum menyelesaikan upgrade besar, biaya gas turun drastis.", impact: { ETH: 0.05, SOL: -0.01 } },
  { text: "Permintaan perhiasan meningkat jelang musim perayaan India dan Tiongkok.", impact: { GOLD: 0.015, SILVER: 0.02 } },
];

const quizQuestions = [
  {
    q: "Apa arti rasio Price-to-Earnings (P/E Ratio) yang tinggi?",
    a: ["Saham relatif mahal atau investor mengharapkan pertumbuhan tinggi", "Perusahaan pasti akan membagikan dividen besar", "Perusahaan memiliki hutang yang sangat sedikit"],
    correct: 0, reward: 5000000
  },
  {
    q: "Mana kelas aset yang dianggap sebagai lindung nilai inflasi klasik?",
    a: ["Emas (GOLD)", "Saham Teknologi Berisiko", "Uang Tunai Fiat"],
    correct: 0, reward: 5000000
  },
  {
    q: "Apa yang terjadi pada pemegang saham jika perusahaan melakukan Stock Split?",
    a: ["Jumlah lembar saham bertambah, nilai per lembar turun proporsional", "Saham mereka ditarik kembali oleh bursa", "Dividen per lembar naik otomatis 2 kali lipat"],
    correct: 0, reward: 5000000
  }
,
  {
    q: "Apa keuntungan utama membeli Surat Berharga Negara (SBN)?",
    a: ["Dijamin oleh negara sehingga bebas risiko gagal bayar", "Return lebih tinggi dari saham", "Bisa digunakan sebagai mata uang kripto"],
    correct: 0, reward: 5000000
  },
  {
    q: "Berapa lama waktu penyelesaian (settlement) transaksi saham di Bursa Efek Indonesia?",
    a: ["T+2 (Dua hari bursa setelah transaksi)", "T+0 (Hari itu juga)", "T+7 (Satu minggu)"],
    correct: 0, reward: 5000000
  },
  {
    q: "Apa fungsi utama dari Stop Loss dalam trading?",
    a: ["Membatasi kerugian jika harga bergerak berlawanan", "Otomatis membeli di harga bawah", "Mencairkan dividen lebih cepat"],
    correct: 0, reward: 5000000
  },
  {
    q: "Dalam investasi kripto, apa yang dimaksud dengan 'Halving' Bitcoin?",
    a: ["Pengurangan imbalan penambang (miner) menjadi setengahnya", "Harga Bitcoin turun 50%", "Koin Bitcoin dibakar setengahnya"],
    correct: 0, reward: 5000000
  },
  {
    q: "Faktor mana yang paling mempengaruhi pergerakan harga emas dunia?",
    a: ["Inflasi dan ketidakpastian ekonomi global", "Laporan keuangan perusahaan perhiasan", "Musim panen komoditas pertanian"],
    correct: 0, reward: 5000000
  },
  {
    q: "Jika saham memiliki Dividend Yield 5% dan harga saham naik 10%, berapa Total Return kotor Anda?",
    a: ["15%", "5%", "10%"],
    correct: 0, reward: 5000000
  },
];

export function SimulationPage() {
  const { toast } = useToast();
  const { token } = useAuth();
  // Core Assets and Balances
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState<Asset>(initialAssets[0]);
  const [compareWith, setCompareWith] = useState<string>('');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'IDX' | 'US' | 'CRYPTO' | 'COMMODITY'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  
  // API loading & error states
  const [apiLoading, setApiLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const [marketMeta, setMarketMeta] = useState<{
    source: string;
    lastUpdated: string | null;
    isRealtime: boolean;
    isStale: boolean;
    isSimulated: boolean;
    status: string;
  }>({
    source: 'Yahoo Finance',
    lastUpdated: null,
    isRealtime: false,
    isStale: false,
    isSimulated: false,
    status: 'loading'
  });
  
  const [cashIDR, setCashIDR] = useState<number>(100000000); // Rp 100 Juta
  const [cashUSD, setCashUSD] = useState<number>(10000); // $10,000
  const usdToIdr = 16300;

  // Holdings storage with cost basis: { symbol: { shares: number, avgPrice: number } }
  const [holdings, setHoldings] = useState<Record<string, { shares: number; avgPrice: number }>>({
    BBRI: { shares: 500, avgPrice: 4750 },
    AAPL: { shares: 10, avgPrice: 180 }
  });

  // Pending limit/stop loss orders
  const [pendingOrders, setPendingOrders] = useState<PendingOrder[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: "TX9281A", type: "BELI", symbol: "BBRI", shares: 500, price: 4750, total: 2375000, timestamp: "09:15" },
    { id: "TX1204X", type: "BELI", symbol: "AAPL", shares: 10, price: 180, total: 1800, timestamp: "09:30" }
  ]);

  // Keep latest assets and holdings in refs to prevent infinite loop / rescheduling in effects
  const assetsRef = useRef<Asset[]>(assets);
  const holdingsRef = useRef<Record<string, { shares: number; avgPrice: number }>>(holdings);

  useEffect(() => {
    assetsRef.current = assets;
  }, [assets]);

  useEffect(() => {
    holdingsRef.current = holdings;
  }, [holdings]);

  // Load virtual transactions from Firestore or localStorage on mount/token change
  useEffect(() => {
    let isMounted = true;
    
    const loadVirtualData = async () => {
      let txs: any[] = [];
      
      if (token && token !== 'demo-token' && auth.currentUser) {
        try {
          const q = query(
            collection(db, 'investmentHistory'),
            where('userId', '==', auth.currentUser.uid),
            limit(50)
          );
          const querySnapshot = await getDocs(q);
          txs = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return {
              id: doc.id,
              type: d.type,
              symbol: d.symbol,
              shares: d.shares,
              price: d.price,
              total: d.total,
              timestamp: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '09:00',
              createdAt: d.createdAt
            };
          });
          // Sort by createdAt descending
          txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } catch (err) {
          console.error("Error loading investment history from Firestore:", err);
        }
      } else {
        const saved = localStorage.getItem('sikaya_virtual_investments');
        if (saved) {
          try {
            txs = JSON.parse(saved);
          } catch (e) {}
        }
      }

      if (!isMounted) return;

      if (txs.length > 0) {
        // Reconstruct holdings and cash balances from transaction history
        let calculatedCashIDR = 100000000;
        let calculatedCashUSD = 10000;
        const calculatedHoldings: Record<string, { shares: number; avgPrice: number }> = {};

        // Process transactions chronologically to build accurate cost basis
        const chronoTxs = [...txs].reverse();
        chronoTxs.forEach(tx => {
          const asset = assetsRef.current.find(a => a.symbol === tx.symbol);
          const market = asset ? asset.market : (tx.symbol === 'BTC' || tx.symbol === 'ETH' ? 'CRYPTO' : 'IDX');
          
          if (tx.type === 'BELI') {
            if (market === 'IDX') {
              calculatedCashIDR -= tx.total;
            } else {
              calculatedCashUSD -= tx.total; // total is in USD for non-IDX assets
            }
            
            const cur = calculatedHoldings[tx.symbol] || { shares: 0, avgPrice: 0 };
            const newShares = cur.shares + tx.shares;
            const newAvg = ((cur.shares * cur.avgPrice) + tx.total) / newShares;
            calculatedHoldings[tx.symbol] = { shares: newShares, avgPrice: Number(newAvg.toFixed(2)) };
          } else if (tx.type === 'JUAL') {
            if (market === 'IDX') {
              calculatedCashIDR += tx.total;
            } else {
              calculatedCashUSD += tx.total;
            }
            
            const cur = calculatedHoldings[tx.symbol];
            if (cur) {
              const newShares = Math.max(0, cur.shares - tx.shares);
              calculatedHoldings[tx.symbol] = { ...cur, shares: newShares };
            }
          } else if (tx.type === 'BONUS' || tx.type === 'DEVIDEN') {
            if (market === 'IDX') {
              calculatedCashIDR += tx.total;
            } else {
              calculatedCashUSD += tx.total;
            }
          }
        });

        setCashIDR(calculatedCashIDR);
        setCashUSD(calculatedCashUSD);
        setHoldings(calculatedHoldings);
        setTransactions(txs);
      } else {
        // Use default initial values
        setCashIDR(100000000);
        setCashUSD(10000);
        setHoldings({
          BBRI: { shares: 500, avgPrice: 4750 },
          AAPL: { shares: 10, avgPrice: 180 }
        });
        setTransactions([
          { id: "TX9281A", type: "BELI", symbol: "BBRI", shares: 500, price: 4750, total: 2375000, timestamp: "09:15" },
          { id: "TX1204X", type: "BELI", symbol: "AAPL", shares: 10, price: 180, total: 1800, timestamp: "09:30" }
        ]);
      }
    };

    loadVirtualData();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // Simulation speed control: 'NORMAL' (5s), 'FAST' (2s), 'PAUSED'
  const [simSpeed, setSimSpeed] = useState<'NORMAL' | 'FAST' | 'PAUSED'>('NORMAL');
  const [currentNews, setCurrentNews] = useState<string>("Pasar berjalan kondusif pagi ini.");
  
  // Real-time chart toggle state
  const [useRealtimeChart, setUseRealtimeChart] = useState<boolean>(true);
  
  // Chart visualization indicators
  const [showSMA, setShowSMA] = useState<boolean>(false);
  const [chartType, setChartType] = useState<'AREA' | 'BAR' | 'LINE'>('AREA');

  // Mappings for real stock prices
  const symbolMapping: Record<string, string> = {
    "BBRI": "BBRI.JK",
    "TLKM": "TLKM.JK",
    "GOTO": "GOTO.JK",
    "BBCA": "BBCA.JK",
    "AAPL": "AAPL",
    "NVDA": "NVDA",
    "TSLA": "TSLA",
    "BTC": "BTC-USD",
    "GOLD": "GC=F"
  };

  const getTradingViewSymbol = (symbol: string) => {
    switch (symbol) {
      case 'BBRI': return 'IDX:BBRI';
      case 'TLKM': return 'IDX:TLKM';
      case 'GOTO': return 'IDX:GOTO';
      case 'BBCA': return 'IDX:BBCA';
      case 'AAPL': return 'NASDAQ:AAPL';
      case 'NVDA': return 'NASDAQ:NVDA';
      case 'TSLA': return 'NASDAQ:TSLA';
      case 'BTC': return 'BINANCE:BTCUSDT';
      case 'GOLD': return 'TVC:GOLD';
      default: return `IDX:${symbol}`;
    }
  };

  // Interactive Goal Planner
  const [financialGoal, setFinancialGoal] = useState({ name: "Dana Darurat Mandiri", target: 200000000 });
  const [showGoalModal, setShowGoalModal] = useState(false);

  // Daily Quiz System
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<boolean | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string>('');

  // Risk Profile Diagnostic
  const [riskAnswers, setRiskAnswers] = useState<number[]>([]);
  const [riskResult, setRiskResult] = useState<string>('');
  const [showRiskModal, setShowRiskModal] = useState(false);

  // Trading Badges (Achievements)
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: '1', title: 'Investor Pertama', desc: 'Lakukan pembelian instan pertamamu', unlocked: true, icon: '🔥' },
    { id: '2', title: 'Sultan IDX', desc: 'Miliki aset bernilai Rp 50 Juta di IDX', unlocked: false, icon: '🇮🇩' },
    { id: '3', title: 'Wall Street Player', desc: 'Beli minimal 2 saham di US market', unlocked: false, icon: '🦅' },
    { id: '4', title: 'Kripto Pioneer', desc: 'Beli aset kripto pertamamu', unlocked: false, icon: '🪙' },
    { id: '5', title: 'Quiz Whiz', desc: 'Jawab pertanyaan quiz keuangan dengan benar', unlocked: false, icon: '🎓' }
  ]);

  // Order Input States
  const [orderType, setOrderType] = useState<'BELI' | 'JUAL'>('BELI');
  const [orderMethod, setOrderMethod] = useState<'INSTAN' | 'LIMIT' | 'STOP_LOSS'>('INSTAN');
  const [orderShares, setOrderShares] = useState<string>('50');
  const [targetPrice, setTargetPrice] = useState<string>('');
  const [orderFeedback, setOrderFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Competitor Leaderboard Simulation
  const [leaderboard, setLeaderboard] = useState([
    { name: "Anda", value: 0, growth: 0, avatar: "👤" },
    { name: "Budi Value Investor", value: 250000000, growth: 8.5, avatar: "📈" },
    { name: "Sarah Tech Scalper", value: 220000000, growth: 12.1, avatar: "⚡" },
    { name: "Andi Conservative Coach", value: 180000000, growth: 4.2, avatar: "🛡️" }
  ]);

  // 1. Core Portfolio Valuation in IDR
  const calculateTotalPortfolioIDR = useCallback(() => {
    let value = cashIDR + (cashUSD * usdToIdr);
    assets.forEach(asset => {
      const hold = holdings[asset.symbol];
      if (hold && hold.shares > 0) {
        const val = hold.shares * asset.price;
        value += asset.market === 'US' || asset.market === 'CRYPTO' || asset.market === 'COMMODITY' ? val * usdToIdr : val;
      }
    });
    return value;
  }, [cashIDR, cashUSD, assets, holdings, usdToIdr]);

  // Synchronize dynamic user leaderboards
  const netWorth = useMemo(() => calculateTotalPortfolioIDR(), [calculateTotalPortfolioIDR]);
  useEffect(() => {
    const startCapital = 263000000; // sum of initial cash balances & holdings value approx
    const currentGrowth = ((netWorth - startCapital) / startCapital) * 100;

    setLeaderboard(prev => prev.map(member => {
      if (member.name === "Anda") {
        return { ...member, value: netWorth, growth: Number(currentGrowth.toFixed(2)) };
      }
      // randomly update competitors with minimal variations
      const dailyFluct = (Math.random() * 0.4 - 0.2);
      const newVal = member.value * (1 + dailyFluct / 100);
      return {
        ...member,
        value: newVal,
        growth: Number((member.growth + dailyFluct).toFixed(2))
      };
    }));
  }, [netWorth]);

  // Unlock achievements check
  useEffect(() => {
    setAchievements(prev => prev.map(ach => {
      if (ach.id === '2') { // Sultan IDX
        const idxVal = assets
          .filter(a => a.market === 'IDX')
          .reduce((sum, a) => sum + ((holdings[a.symbol]?.shares || 0) * a.price), 0);
        if (idxVal >= 50000000) return { ...ach, unlocked: true };
      }
      if (ach.id === '3') { // Wall Street Player
        const usCount = assets.filter(a => a.market === 'US' && (holdings[a.symbol]?.shares || 0) > 0).length;
        if (usCount >= 2) return { ...ach, unlocked: true };
      }
      if (ach.id === '4') { // Kripto Pioneer
        const hasCrypto = (holdings['BTC']?.shares || 0) > 0;
        if (hasCrypto) return { ...ach, unlocked: true };
      }
      return ach;
    }));
  }, [holdings, assets]);

  // 2. Real-time Market Clock & Simulation Price Feed (Real-time Integration with Fallback)
  useEffect(() => {
    let isMounted = true;
    
    const fetchRealQuotes = async () => {
      if (simSpeed === 'PAUSED') return;
      try {
        const res = await fetch('/api/stock-prices');
        if (!res.ok) throw new Error('Data pasar sementara tidak tersedia.');
        const json = await res.json();
        
        const isUnavailable = json.status === 'unavailable' || !json?.quoteResponse?.result || json.quoteResponse.result.length === 0;

        if (isUnavailable) {
          if (isMounted) {
            setApiError("Data pasar sementara tidak tersedia.");
            setMarketMeta({
              source: json?.source || 'Yahoo Finance',
              lastUpdated: json?.lastUpdated || null,
              isRealtime: false,
              isStale: true,
              isSimulated: false,
              status: 'unavailable'
            });
          }
          return;
        }

        const results = json.quoteResponse.result;

        if (isMounted) {
          setApiError(null);
          setMarketMeta({
            source: json?.source || 'Yahoo Finance',
            lastUpdated: json?.lastUpdated || new Date().toISOString(),
            isRealtime: Boolean(json?.isRealtime),
            isStale: Boolean(json?.isStale),
            isSimulated: Boolean(json?.isSimulated),
            status: json?.status || 'ok'
          });

          setAssets(prev => prev.map(asset => {
            const yahooSym = symbolMapping[asset.symbol];
            if (!yahooSym) return asset;

            const realQuote = results.find((r: any) => r.symbol === yahooSym);
            if (!realQuote) return asset;

            // Map and parse the real values
            const nextPrice = realQuote.regularMarketPrice ?? asset.price;
            const nextChange = realQuote.regularMarketChangePercent ?? asset.change;
            const nextPrevClose = realQuote.regularMarketPreviousClose ?? asset.prevClose;

            const formatVolume = (val: number) => {
              if (val >= 1e9) return `${(val / 1e9).toFixed(1)}B`;
              if (val >= 1e6) return `${(val / 1e6).toFixed(1)}M`;
              if (val >= 1e3) return `${(val / 1e3).toFixed(1)}K`;
              return val.toString();
            };

            const volume = realQuote.regularMarketVolume ? formatVolume(realQuote.regularMarketVolume) : asset.volume;

            const marketCap = realQuote.marketCap
              ? (asset.market === 'IDX' 
                  ? `Rp ${(realQuote.marketCap / 1e12).toFixed(1)}T` 
                  : `$${(realQuote.marketCap >= 1e12 ? `${(realQuote.marketCap / 1e12).toFixed(2)}T` : `${(realQuote.marketCap / 1e9).toFixed(1)}B`)}`)
              : asset.marketCap;

            const peRatio = realQuote.trailingPE ? `${realQuote.trailingPE.toFixed(1)}x` : "N/A";
            
            const divPercent = realQuote.dividendYield ?? (realQuote.trailingAnnualDividendYield ? realQuote.trailingAnnualDividendYield * 100 : 0);
            const dividendYield = divPercent > 0 ? `${divPercent.toFixed(2)}%` : "0%";

            const dayRange = realQuote.regularMarketDayLow && realQuote.regularMarketDayHigh 
              ? `${realQuote.regularMarketDayLow.toLocaleString()} - ${realQuote.regularMarketDayHigh.toLocaleString()}`
              : asset.dayRange;

            // Update local chart data with real price
            const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            const nextChart = [...asset.chartData.slice(1), { time: timeStr, value: nextPrice }];

            return {
              ...asset,
              price: nextPrice,
              change: nextChange,
              prevClose: nextPrevClose,
              volume,
              marketCap,
              peRatio,
              dividendYield,
              dayRange,
              chartData: nextChart
            };
          }));
        }
      } catch (err: any) {
        console.warn("Market API fetch error:", err.message);
        if (isMounted) {
          setApiError("Data pasar sementara tidak tersedia.");
          setMarketMeta({
            source: 'Yahoo Finance',
            lastUpdated: null,
            isRealtime: false,
            isStale: true,
            isSimulated: false,
            status: 'unavailable'
          });
        }
      } finally {
        if (isMounted) {
          setApiLoading(false);
        }
      }
    };

    // Initial fetch of real quotes
    fetchRealQuotes();

    // Poll real prices every 10 seconds (or 3 seconds for FAST)
    const intervalTime = simSpeed === 'FAST' ? 3000 : 10000;
    const pricePoll = setInterval(fetchRealQuotes, intervalTime);

    return () => {
      isMounted = false;
      clearInterval(pricePoll);
    };
  }, [simSpeed]);

  // Run news & dividends simulation along with it
  useEffect(() => {
    if (simSpeed === 'PAUSED') return;

    const simInterval = setInterval(() => {
      // 25% chance to trigger random news event
      if (Math.random() < 0.25) {
        const randomN = mockNews[Math.floor(Math.random() * mockNews.length)];
        setCurrentNews(randomN.text);
      }

      // 8% chance of dividend payout for holdings
      if (Math.random() < 0.08) {
        const currentHoldings = holdingsRef.current;
        const currentAssets = assetsRef.current;

        const ownedWithDividend = Object.keys(currentHoldings).filter(sym => {
          const asset = currentAssets.find(a => a.symbol === sym);
          return asset && Number(asset.dividendYield.replace('%', '')) > 0;
        });

        if (ownedWithDividend.length > 0) {
          const chosenSym = ownedWithDividend[Math.floor(Math.random() * ownedWithDividend.length)];
          const asset = currentAssets.find(a => a.symbol === chosenSym)!;
          const shareQty = currentHoldings[chosenSym].shares;
          const divRate = (asset.price * (Number(asset.dividendYield.replace('%', '')) / 100)) / 4; // quarterly div
          const totalDiv = Number((shareQty * divRate).toFixed(2));

          if (totalDiv > 0) {
            if (asset.market === 'IDX') {
              setCashIDR(p => p + totalDiv);
            } else {
              setCashUSD(p => p + totalDiv);
            }
            setTransactions(prev => [{
              id: `DIV-${Math.random().toString(36).substring(2,6).toUpperCase()}`,
              type: 'DEVIDEN',
              symbol: chosenSym,
              shares: shareQty,
              price: Number(divRate.toFixed(2)),
              total: totalDiv,
              timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
            }, ...prev]);
            setCurrentNews(`💰 Korporat Alert: Anda menerima dividen sebesar ${asset.market === 'IDX' ? 'Rp ' : '$'}${totalDiv.toLocaleString()} dari saham ${chosenSym}!`);
          }
        }
      }
    }, 8000);

    return () => {
      clearInterval(simInterval);
    };
  }, [simSpeed]);

  // Sync selectedAsset when assets list updates
  useEffect(() => {
    const latest = assets.find(a => a.symbol === selectedAsset.symbol);
    if (latest) {
      setSelectedAsset(latest);
    }
  }, [assets, selectedAsset.symbol]);

  // 3. Pending Limit & Stop Loss Execution Engine
  useEffect(() => {
    if (pendingOrders.length === 0) return;
    const triggered: string[] = [];
    
    pendingOrders.forEach(order => {
      const asset = assets.find(a => a.symbol === order.symbol);
      if (!asset) return;

      let isTriggered = false;
      if (order.type === 'LIMIT_BELI' && asset.price <= order.targetPrice) isTriggered = true;
      if (order.type === 'LIMIT_JUAL' && asset.price >= order.targetPrice) isTriggered = true;
      if (order.type === 'STOP_LOSS' && asset.price <= order.targetPrice) isTriggered = true;

      if (isTriggered) {
        triggered.push(order.id);
        executePendingOrder(order, asset.price);
      }
    });

    if (triggered.length > 0) {
      setPendingOrders(prev => prev.filter(o => !triggered.includes(o.id)));
    }
  }, [assets, pendingOrders]);

  const executePendingOrder = (order: PendingOrder, actualPrice: number) => {
    const asset = assets.find(a => a.symbol === order.symbol)!;
    const totalCost = order.shares * actualPrice;

    if (order.type === 'LIMIT_BELI') {
      if (asset.market === 'IDX') {
        if (cashIDR < totalCost) return;
        setCashIDR(p => p - totalCost);
      } else {
        if (cashUSD < totalCost) return;
        setCashUSD(p => p - totalCost);
      }

      setHoldings(p => {
        const cur = p[order.symbol] || { shares: 0, avgPrice: 0 };
        const newShares = cur.shares + order.shares;
        const newAvg = ((cur.shares * cur.avgPrice) + totalCost) / newShares;
        return { ...p, [order.symbol]: { shares: newShares, avgPrice: Number(newAvg.toFixed(2)) } };
      });

      setTransactions(p => [{
        id: `TX-${order.id}`,
        type: 'BELI',
        symbol: order.symbol,
        shares: order.shares,
        price: actualPrice,
        total: totalCost,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }, ...p]);
      setCurrentNews(`⚡ LIMIT BELI Terpicu: Membeli ${order.shares} saham ${order.symbol} pada harga target!`);
    } else {
      // LIMIT_JUAL or STOP_LOSS
      const cur = holdings[order.symbol];
      if (!cur || cur.shares < order.shares) return;

      setHoldings(p => ({
        ...p,
        [order.symbol]: { ...p[order.symbol], shares: p[order.symbol].shares - order.shares }
      }));

      if (asset.market === 'IDX') {
        setCashIDR(p => p + totalCost);
      } else {
        setCashUSD(p => p + totalCost);
      }

      setTransactions(p => [{
        id: `TX-${order.id}`,
        type: 'JUAL',
        symbol: order.symbol,
        shares: order.shares,
        price: actualPrice,
        total: totalCost,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }, ...p]);
      setCurrentNews(`⚡ ORDER PENDING Terpicu: Berhasil melepas ${order.shares} saham ${order.symbol} seharga ${actualPrice}!`);
    }
  };

  // SMA indicator calculator
  const getSMAData = useCallback((data: { time: string; value: number }[], windowSize: number) => {
    return data.map((d, i) => {
      if (i < windowSize - 1) return { ...d, sma: d.value };
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += data[i - j].value;
      }
      return { ...d, sma: Number((sum / windowSize).toFixed(2)) };
    });
  }, []);

  const chartDataWithSMA = useMemo(() => {
    return showSMA ? getSMAData(selectedAsset.chartData, 3) : selectedAsset.chartData;
  }, [showSMA, selectedAsset.chartData, getSMAData]);

  // Search filter
  const filteredAssets = useMemo(() => {
    return assets.filter(a => {
      const matchesMarket = marketFilter === 'ALL' || a.market === marketFilter;
      const matchesSearch = a.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            a.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesMarket && matchesSearch;
    });
  }, [assets, marketFilter, searchQuery]);

  // Execute Order
  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderFeedback(null);

    const sharesNum = Number(orderShares);
    if (isNaN(sharesNum) || sharesNum <= 0) {
      setOrderFeedback({ type: 'error', text: 'Masukkan jumlah unit aset yang valid (harus lebih dari 0).' });
      toast.error('Masukkan jumlah unit aset yang valid (harus lebih dari 0).');
      return;
    }

    const price = selectedAsset.price;
    const market = selectedAsset.market;
    const symbol = selectedAsset.symbol;

    if (isNaN(price) || price < 0) {
      setOrderFeedback({ type: 'error', text: 'Harga aset tidak valid.' });
      toast.error('Harga aset tidak valid.');
      return;
    }

    if (orderMethod !== 'INSTAN') {
      const target = Number(targetPrice);
      if (isNaN(target) || target <= 0) {
        setOrderFeedback({ type: 'error', text: 'Masukkan harga target untuk Limit / Stop Loss.' });
        toast.error('Masukkan harga target untuk Limit / Stop Loss.');
        return;
      }
      const newPending: PendingOrder = {
        id: Math.random().toString(36).substring(2, 7).toUpperCase(),
        symbol,
        type: orderMethod === 'LIMIT' ? (orderType === 'BELI' ? 'LIMIT_BELI' : 'LIMIT_JUAL') : 'STOP_LOSS',
        targetPrice: target,
        shares: sharesNum
      };
      setPendingOrders(prev => [...prev, newPending]);
      setOrderFeedback({ type: 'success', text: `Berhasil mendaftarkan pending order ${orderMethod} untuk ${symbol}!` });
      toast.info(`Pending order ${orderMethod} untuk ${symbol} berhasil didaftarkan!`);
      return;
    }

    const totalCost = Number((sharesNum * price).toFixed(2));
    if (orderType === 'BELI') {
      if (market === 'IDX') {
        if (cashIDR < totalCost) {
          setOrderFeedback({ type: 'error', text: `Rupiah tidak mencukupi. Butuh Rp ${totalCost.toLocaleString()}` });
          toast.error(`Rupiah tidak mencukupi. Butuh Rp ${totalCost.toLocaleString()}`);
          return;
        }
        setCashIDR(prev => prev - totalCost);
      } else {
        const costUsd = totalCost;
        if (cashUSD < costUsd) {
          setOrderFeedback({ type: 'error', text: `Saldo USD tidak mencukupi. Butuh $${costUsd.toLocaleString()}` });
          toast.error(`Saldo USD tidak mencukupi. Butuh $${costUsd.toLocaleString()}`);
          return;
        }
        setCashUSD(prev => prev - costUsd);
      }

      setHoldings(prev => {
        const cur = prev[symbol] || { shares: 0, avgPrice: 0 };
        const newShares = cur.shares + sharesNum;
        const newAvgPrice = ((cur.shares * cur.avgPrice) + totalCost) / newShares;
        return {
          ...prev,
          [symbol]: { shares: newShares, avgPrice: Number(newAvgPrice.toFixed(2)) }
        };
      });

      setTransactions(prev => [{
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        type: 'BELI',
        symbol,
        shares: sharesNum,
        price,
        total: totalCost,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }, ...prev]);

      setOrderFeedback({ type: 'success', text: `Sukses membeli ${sharesNum} unit ${symbol}!` });
      toast.success(`Sukses membeli ${sharesNum} unit ${symbol}!`);

      if (token && token !== 'demo-token' && auth.currentUser) {
        auth.currentUser.getIdToken().then(idToken => {
          fetch('/api/user/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              symbol,
              type: "BELI",
              shares: sharesNum,
              price: price
            })
          }).catch(err => console.error("Error logging transaction via API:", err));
        });
      } else {
        const savedVirtual = localStorage.getItem('sikaya_virtual_investments') || '[]';
        const virtualHistory = JSON.parse(savedVirtual);
        const newTx = {
          id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'BELI',
          symbol,
          shares: sharesNum,
          price,
          total: totalCost,
          timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          createdAt: new Date().toISOString()
        };
        const updatedHistory = [newTx, ...virtualHistory];
        localStorage.setItem('sikaya_virtual_investments', JSON.stringify(updatedHistory));
      }

    } else {
      // JUAL
      const cur = holdings[symbol];
      if (!cur || cur.shares < sharesNum) {
        setOrderFeedback({ type: 'error', text: `Kepemilikan aset ${symbol} tidak mencukupi.` });
        toast.error(`Kepemilikan aset ${symbol} tidak mencukupi.`);
        return;
      }

      setHoldings(prev => ({
        ...prev,
        [symbol]: { ...prev[symbol], shares: prev[symbol].shares - sharesNum }
      }));

      if (market === 'IDX') {
        setCashIDR(prev => prev + totalCost);
      } else {
        setCashUSD(prev => prev + totalCost);
      }

      const txTimestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      setTransactions(prev => [{
        id: Math.random().toString(36).substring(2, 8).toUpperCase(),
        type: 'JUAL',
        symbol,
        shares: sharesNum,
        price,
        total: totalCost,
        timestamp: txTimestamp
      }, ...prev]);

      setOrderFeedback({ type: 'success', text: `Sukses menjual ${sharesNum} unit ${symbol}!` });
      toast.success(`Sukses menjual ${sharesNum} unit ${symbol}!`);

      if (token && token !== 'demo-token' && auth.currentUser) {
        auth.currentUser.getIdToken().then(idToken => {
          fetch('/api/user/transactions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`
            },
            body: JSON.stringify({
              symbol,
              type: "JUAL",
              shares: sharesNum,
              price: price
            })
          }).catch(err => console.error("Error logging transaction via API:", err));
        });
      } else {
        const savedVirtual = localStorage.getItem('sikaya_virtual_investments') || '[]';
        const virtualHistory = JSON.parse(savedVirtual);
        const newTx = {
          id: Math.random().toString(36).substring(2, 8).toUpperCase(),
          type: 'JUAL',
          symbol,
          shares: sharesNum,
          price,
          total: totalCost,
          timestamp: txTimestamp,
          createdAt: new Date().toISOString()
        };
        const updatedHistory = [newTx, ...virtualHistory];
        localStorage.setItem('sikaya_virtual_investments', JSON.stringify(updatedHistory));
      }
    }
  };

  // Handle Quiz Submition
  const handleQuizAnswer = (selectedOpt: number) => {
    const q = quizQuestions[quizIdx];
    if (selectedOpt === q.correct) {
      setQuizAnswered(true);
      setQuizFeedback(`Jawaban Benar! Selamat Anda mendapatkan bonus modal virtual sebesar Rp ${q.reward.toLocaleString('id-ID')}!`);
      setCashIDR(prev => prev + q.reward);
      setTransactions(p => [{
        id: `QUIZ-${Date.now().toString().slice(-4)}`,
        type: 'BONUS',
        symbol: 'BONUS',
        shares: 0,
        price: q.reward,
        total: q.reward,
        timestamp: 'Now'
      }, ...p]);
      // Unlock badge Quiz Whiz
      setAchievements(prev => prev.map(a => a.id === '5' ? { ...a, unlocked: true } : a));
    } else {
      setQuizAnswered(false);
      setQuizFeedback("Jawaban kurang tepat. Coba lagi materi belajar investasi!");
    }
  };

  // Handle Risk Diagnostics calculation
  const handleSelectRiskAnswer = (val: number) => {
    const nextAnswers = [...riskAnswers, val];
    setRiskAnswers(nextAnswers);

    if (nextAnswers.length === 3) {
      const sum = nextAnswers.reduce((a, b) => a + b, 0);
      let profile = "Konservatif (Sangat cocok untuk Emas & Saham BBCA)";
      if (sum > 4 && sum <= 7) profile = "Moderat (Cocok untuk Campuran Saham Bluechip & Komoditas)";
      if (sum > 7) profile = "Agresif (Sangat cocok untuk Saham Teknologi & Aset Kripto Bitcoin)";
      
      setRiskResult(profile);
    }
  };

  const handleResetRisk = () => {
    setRiskAnswers([]);
    setRiskResult('');
  };

  // Save/Export Report
  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ holdings, transactions, cashIDR, cashUSD }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Simulasi_Portofolio_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Clear / Reset Simulation
  const handleHardReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menyetel ulang seluruh portofolio simulasi ke modal awal?")) {
      setCashIDR(100000000);
      setCashUSD(10000);
      setHoldings({});
      setPendingOrders([]);
      setTransactions([]);
      setCurrentNews("Simulasi berhasil di-reset ke pengaturan awal.");
    }
  };

  // Top Up Fund Bonus
  const handleClaimStimulus = () => {
    setCashIDR(p => p + 10000000);
    setOrderFeedback({ type: 'success', text: "Selamat! Tambahan stimulus modal Rp 10.000.000 berhasil masuk ke saldo Anda." });
  };

  // Visual sector data distribution
  const sectorData = useMemo(() => {
    return Object.keys(holdings)
      .filter(sym => holdings[sym].shares > 0)
      .map(sym => {
        const asset = assets.find(a => a.symbol === sym);
        const val = holdings[sym].shares * (asset?.price || 0);
        return {
          name: asset?.name || sym,
          value: asset?.market === 'IDX' ? val : val * usdToIdr
        };
      });
  }, [holdings, assets, usdToIdr]);

  const COLORS = ['#0d9488', '#4f46e5', '#f59e0b', '#ef4444', '#10b981', '#ec4899'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <PageHeader
        category="Simulasi"
        title="Virtual Trading Simulator"
        description="Latih strategi investasi di pasar IDX, Wall Street, Kripto, dan Emas tanpa risiko uang asli."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleClaimStimulus}
              className="ui-btn-primary h-9 text-xs"
            >
              Claim Stimulus Rp 10M
            </button>
            <button 
              onClick={handleHardReset}
              className="ui-btn-secondary h-9 text-xs text-rose-600 dark:text-rose-400"
            >
              Reset Virtual Cash
            </button>
          </div>
        }
      />

      {/* Live Financial News Scrolling Banner */}
      <div className="bg-slate-900 text-teal-400 text-xs py-2 px-4 rounded-xl mb-6 flex items-center justify-between border border-teal-800/20 overflow-hidden shadow-xs gap-3">
        <span className="flex items-center gap-1.5 font-black uppercase shrink-0">
          <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse animate-bounce" /> Live News:
        </span>
        <div className="flex-1 overflow-hidden relative mx-4">
          <motion.div 
            key={currentNews}
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
            className="whitespace-nowrap font-extrabold text-slate-100 text-xs inline-block"
          >
            {currentNews}
          </motion.div>
        </div>
        <span className="text-[10px] font-bold text-slate-400 px-2 shrink-0 border-l border-slate-700">
          IDX & US Live Feed
        </span>
      </div>

      {/* Main Stats Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-slate-900 via-teal-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 border border-teal-700/30 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-6 space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-400/15 text-teal-300 text-[10px] font-extrabold tracking-wider border border-teal-500/20 shadow-md uppercase">
              <Sparkles className="w-3.5 h-3.5" /> Virtual Simulator PRO v2.0
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Simulator Investasi <span className="text-teal-400">Multiaset</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              Eksplorasi pasar modal IDX, Wall Street, Komoditas Emas, hingga Kripto secara interaktif. Latih keahlian strategi hedging, limit order, dan money management tanpa risiko.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button 
                onClick={handleClaimStimulus}
                className="inline-flex items-center gap-1 bg-teal-600 hover:bg-teal-500 text-white text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                Claim Stimulus Rp10M
              </button>
              <button 
                onClick={handleHardReset}
                className="inline-flex items-center gap-1 bg-rose-950/40 hover:bg-rose-900/50 text-rose-300 text-[10px] font-black uppercase px-3.5 py-2 rounded-xl transition-all border border-rose-500/20 shadow-sm active:scale-95 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Reset Simulasi
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-4">
            {/* Total Balance Block */}
            <div className="bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl flex flex-col gap-1.5 backdrop-blur-md">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Total Net Worth</span>
              <span className="text-2xl sm:text-3xl font-black text-teal-400 tracking-tight">
                Rp {netWorth.toLocaleString('id-ID')}
              </span>
              <div className="flex justify-between text-[10px] font-bold text-slate-300 pt-2 border-t border-white/5">
                <span>Tunai: Rp {cashIDR.toLocaleString('id-ID')}</span>
                <span>Tunai USD: ${cashUSD.toLocaleString('en-US')}</span>
              </div>
            </div>

            {/* Quick Goals Widget */}
            <div className="bg-teal-900/30 border border-teal-500/20 p-4 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-extrabold text-teal-300 uppercase tracking-widest">Target Investasi</span>
                  <p className="text-xs font-black text-slate-100 line-clamp-1">{financialGoal.name}</p>
                </div>
                <button 
                  onClick={() => setShowGoalModal(true)}
                  className="text-[9px] font-extrabold bg-teal-400/20 text-teal-300 px-2 py-0.5 rounded-md hover:bg-teal-400/30 transition-all uppercase"
                >
                  Ubah Goal
                </button>
              </div>

              {/* Goal Progress bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-bold text-slate-300 mb-1">
                  <span>Progress Target</span>
                  <span>{Math.min(100, Math.round((netWorth / financialGoal.target) * 100))}%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, (netWorth / financialGoal.target) * 100)}%` }}
                  ></div>
                </div>
                <span className="text-[9px] text-slate-400 font-bold block mt-1.5 text-right">
                  Target: Rp {financialGoal.target.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Directory and Filters (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm space-y-4">
            {/* Simulation Speed Regulator */}
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" /> Kecepatan Pasar:
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSimSpeed('PAUSED')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all ${simSpeed === 'PAUSED' ? 'bg-amber-100 dark:bg-amber-950 text-amber-700' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Pause className="w-2.5 h-2.5 inline mr-1" /> JEDA
                </button>
                <button
                  onClick={() => setSimSpeed('NORMAL')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all ${simSpeed === 'NORMAL' ? 'bg-teal-500 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Play className="w-2.5 h-2.5 inline mr-1" /> NORMAL
                </button>
                <button
                  onClick={() => setSimSpeed('FAST')}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all ${simSpeed === 'FAST' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <FastForward className="w-2.5 h-2.5 inline mr-1" /> CEPAT 2X
                </button>
              </div>
            </div>

            {/* Search inputs */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari kode/nama aset (e.g. BTC, BBRI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500"
              />
            </div>

            {/* Asset Market Filter Tabs */}
            <div className="flex flex-wrap gap-1">
              {(['ALL', 'IDX', 'US', 'CRYPTO', 'COMMODITY'] as const).map(market => (
                <button
                  key={market}
                  onClick={() => setMarketFilter(market)}
                  className={`text-center px-2 py-1.5 text-[9px] font-black tracking-wider rounded-lg transition-all border ${
                    marketFilter === market
                      ? 'bg-slate-900 text-white dark:bg-slate-800 border-transparent shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 bg-transparent border-slate-100 dark:border-slate-850'
                  }`}
                >
                  {market === 'ALL' && '🌎 SEMUA'}
                  {market === 'IDX' && '🇮🇩 IDX'}
                  {market === 'US' && '🇺🇸 US'}
                  {market === 'CRYPTO' && '🪙 KRIPTO'}
                  {market === 'COMMODITY' && '🔱 KOMODITAS'}
                </button>
              ))}
            </div>

            {/* API Status & Integrity Notice */}
            {marketMeta.status === 'unavailable' && (
              <div className="bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl p-3 flex items-start gap-2.5 text-rose-800 dark:text-rose-300">
                <Info className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <h5 className="text-[9px] font-extrabold uppercase tracking-wider font-mono">Data Pasar Sementara Tidak Tersedia</h5>
                  <p className="text-[8px] font-medium leading-relaxed">
                    Penyedia data bursa (Yahoo Finance) sedang tidak merespons. Angka harga dibekukan demi menjaga integritas data finansial.
                  </p>
                </div>
              </div>
            )}

            {marketMeta.status === 'simulated' && (
              <div className="bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 rounded-xl p-2.5 flex items-center justify-between text-amber-800 dark:text-amber-300 text-[10px]">
                <div className="flex items-center gap-1.5 font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                  <span>SIMULATED DATA (Mock Mode)</span>
                </div>
                <span className="text-[8px] opacity-75 font-mono">Simulasi Edukasi</span>
              </div>
            )}

            {marketMeta.status === 'ok' && marketMeta.lastUpdated && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30 rounded-xl px-3 py-1.5 flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-[9px]">
                <div className="flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Live Feed ({marketMeta.source})</span>
                </div>
                <span className="text-[8px] opacity-75 font-mono">
                  {new Date(marketMeta.lastUpdated).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB
                </span>
              </div>
            )}

            {/* Dynamic Assets scrollable inventory */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {apiLoading ? (
                <div className="space-y-2 py-1">
                  {[1, 2, 3, 4].map(idx => (
                    <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-200 dark:bg-slate-850 rounded-lg"></div>
                        <div className="space-y-1">
                          <div className="w-14 h-3 bg-slate-200 dark:bg-slate-850 rounded"></div>
                          <div className="w-20 h-2 bg-slate-200 dark:bg-slate-850 rounded"></div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="w-16 h-3 bg-slate-200 dark:bg-slate-850 rounded"></div>
                        <div className="w-10 h-2 bg-slate-200 dark:bg-slate-850 rounded ml-auto"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredAssets.length > 0 ? (
                filteredAssets.map(asset => {
                  const isSelected = selectedAsset.symbol === asset.symbol;
                  const hold = holdings[asset.symbol];
                  const holdingQty = hold?.shares || 0;
                  const isPositive = asset.change >= 0;

                  return (
                    <button
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset)}
                      className={`w-full text-left p-3 rounded-xl transition-all border flex items-center justify-between ${
                        isSelected 
                          ? 'bg-teal-50/60 dark:bg-teal-950/20 border-teal-200 dark:border-teal-900/40 shadow-xs' 
                          : 'bg-transparent border-slate-100 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-850/30'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg font-black text-[10px] shrink-0 ${
                          asset.market === 'IDX' ? 'bg-rose-50 text-rose-600' :
                          asset.market === 'US' ? 'bg-blue-50 text-blue-600' :
                          asset.market === 'CRYPTO' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {asset.symbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs text-slate-800 dark:text-slate-200">{asset.symbol}</span>
                            <span className="text-[8px] font-bold uppercase text-slate-400 px-1 bg-slate-100 dark:bg-slate-800 rounded">{asset.market}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[120px]">{asset.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black text-slate-800 dark:text-slate-100">
                          {asset.market === 'IDX' ? `Rp ${asset.price.toLocaleString('id-ID')}` : `$${asset.price.toLocaleString('en-US')}`}
                        </p>
                        <span className={`text-[10px] font-bold inline-flex items-center gap-0.5 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {isPositive ? '+' : ''}{asset.change.toFixed(2)}%
                          {holdingQty > 0 && (
                            <span className="ml-1.5 text-[8px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-1 py-0.2 rounded">
                              {holdingQty}
                            </span>
                          )}
                        </span>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-950/30 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3 animate-pulse" />
                  <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 mb-1 font-display">Aset Tidak Ditemukan</h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mb-3 max-w-[180px] mx-auto leading-relaxed">
                    Tidak ada instrumen yang cocok dengan pencarian "{searchQuery}".
                  </p>
                  <button 
                    onClick={() => { setSearchQuery(''); setMarketFilter('ALL'); }}
                    className="px-3 py-1.5 bg-white dark:bg-slate-900 hover:bg-slate-50 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-bold text-slate-750 dark:text-slate-300 transition-all cursor-pointer shadow-xs"
                  >
                    Reset Pencarian
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Achievement Badges widget */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
            <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" /> Prestasi & Lencana Anda
            </h3>
            <div className="grid grid-cols-5 gap-2">
              {achievements.map(ach => (
                <div 
                  key={ach.id} 
                  title={`${ach.title}: ${ach.desc}`}
                  className={`p-2 rounded-xl text-center border transition-all ${ach.unlocked ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200' : 'bg-slate-50 dark:bg-slate-950 border-transparent opacity-40'}`}
                >
                  <span className="text-lg block mb-0.5">{ach.icon}</span>
                  <span className="text-[8px] font-black block truncate">{ach.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Charts, order input, analytics, co-pilot (lg:col-span-8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Stock Interactive Chart Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{selectedAsset.symbol}</h2>
                  <span className="text-[10px] font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded uppercase">
                    {selectedAsset.sector}
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-bold">{selectedAsset.name}</p>
              </div>

              {/* Chart Overlay compare tools and Indicators */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Real-time & Simulator toggler */}
                <div className="flex gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl mr-2">
                  <button
                    onClick={() => setUseRealtimeChart(true)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${useRealtimeChart ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-500'}`}
                  >
                    🔴 REAL-TIME
                  </button>
                  <button
                    onClick={() => setUseRealtimeChart(false)}
                    className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${!useRealtimeChart ? 'bg-slate-900 text-white dark:bg-slate-800 shadow-sm' : 'text-slate-500'}`}
                  >
                    📊 SIMULATOR
                  </button>
                </div>

                {!useRealtimeChart && (
                  <>
                    {/* Compare dropdown */}
                    <select
                      value={compareWith}
                      onChange={(e) => setCompareWith(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl px-2 py-1.5 text-[10px] font-black focus:outline-none"
                    >
                      <option value="">📊 Bandingkan Aset</option>
                      {assets.filter(a => a.symbol !== selectedAsset.symbol).map(a => (
                        <option key={a.symbol} value={a.symbol}>{a.symbol} ({a.market})</option>
                      ))}
                    </select>

                    <button
                      onClick={() => setShowSMA(!showSMA)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${showSMA ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100'}`}
                    >
                      Indikator SMA-3
                    </button>

                    <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
                      {(['AREA', 'LINE', 'BAR'] as const).map(type => (
                        <button
                          key={type}
                          onClick={() => setChartType(type)}
                          className={`px-2 py-1 text-[9px] font-black rounded-lg ${chartType === type ? 'bg-slate-900 text-white dark:bg-slate-800' : 'text-slate-500'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Price visualization chart */}
            <div className={`${useRealtimeChart ? 'h-[420px]' : 'h-64'} w-full relative transition-all duration-300 mb-2`}>
              {useRealtimeChart ? (
                <TradingViewChart symbol={getTradingViewSymbol(selectedAsset.symbol)} />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'BAR' ? (
                    <AreaChart data={chartDataWithSMA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Area type="step" dataKey="value" stroke="#3b82f6" fill="#93c5fd" fillOpacity={0.2} />
                    </AreaChart>
                  ) : chartType === 'LINE' ? (
                    <AreaChart data={chartDataWithSMA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} dot={{ r: 2 }} />
                      {showSMA && <Line type="monotone" dataKey="sma" stroke="#6366f1" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </AreaChart>
                  ) : (
                    <AreaChart data={chartDataWithSMA} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="time" tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" />
                      <YAxis tick={{ fontSize: 9, fontWeight: 600 }} stroke="#94a3b8" domain={['auto', 'auto']} />
                      <Tooltip contentStyle={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Area type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorValue)" />
                      {showSMA && <Line type="monotone" dataKey="sma" stroke="#6366f1" strokeDasharray="5 5" strokeWidth={2} dot={false} />}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>

            {/* Real-time stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs text-center font-bold">
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 block mb-0.5">Rentang Hari</span>
                <p className="text-slate-700 dark:text-slate-200">{selectedAsset.dayRange}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 block mb-0.5">Kapitalisasi Pasar</span>
                <p className="text-slate-700 dark:text-slate-200">{selectedAsset.marketCap}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 block mb-0.5">Div. Yield</span>
                <p className="text-slate-700 dark:text-slate-200">{selectedAsset.dividendYield}</p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] text-slate-400 block mb-0.5">Rasio P/E</span>
                <p className="text-slate-700 dark:text-slate-200">{selectedAsset.peRatio}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-12 gap-6 items-start">
            {/* Interactive Buy/Sell Form with order types (md:col-span-7) */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm md:col-span-7 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-slate-500" /> Eksekusi Order Saham
                </h3>
                <span className="text-[10px] text-slate-500 font-bold">
                  Saldo: {selectedAsset.market === 'IDX' ? `Rp ${cashIDR.toLocaleString('id-ID')}` : `$${cashUSD.toLocaleString('en-US')}`}
                </span>
              </div>

              {orderFeedback && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  orderFeedback.type === 'success' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100' 
                    : 'bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-100'
                }`}>
                  {orderFeedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                  <span>{orderFeedback.text}</span>
                </div>
              )}

              <form onSubmit={handleOrderSubmit} className="space-y-4">
                {/* Order Buy / Sell Toggles */}
                <div className="flex gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setOrderType('BELI')}
                    className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg transition-all ${orderType === 'BELI' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
                  >
                    BELI ASSET
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('JUAL')}
                    className={`flex-1 text-center py-2 text-xs font-extrabold rounded-lg transition-all ${orderType === 'JUAL' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-850'}`}
                  >
                    JUAL ASSET
                  </button>
                </div>

                {/* Order Method: Instant, Limit, Stop Loss */}
                <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-xl">
                  {(['INSTAN', 'LIMIT', 'STOP_LOSS'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setOrderMethod(method)}
                      className={`text-center py-1.5 text-[10px] font-black rounded-lg transition-all ${orderMethod === method ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {method}
                    </button>
                  ))}
                </div>

                {/* Shares input & Target Price for limit orders */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">Jumlah (Lembar)</label>
                    <input
                      type="number"
                      value={orderShares}
                      onChange={(e) => setOrderShares(e.target.value)}
                      min="1"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-base sm:text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-500 uppercase">
                      {orderMethod === 'INSTAN' ? 'Harga Saat Ini' : 'Target Harga'}
                    </label>
                    <input
                      type="number"
                      value={orderMethod === 'INSTAN' ? selectedAsset.price : targetPrice}
                      onChange={(e) => setTargetPrice(e.target.value)}
                      disabled={orderMethod === 'INSTAN'}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-base sm:text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Estimation invoice details */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-slate-500">
                    <span>Estimasi Harga</span>
                    <span className="text-slate-800 dark:text-slate-200">
                      {selectedAsset.market === 'IDX' ? `Rp ${selectedAsset.price.toLocaleString('id-ID')}` : `$${selectedAsset.price.toLocaleString('en-US')}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-800 dark:text-slate-100 font-extrabold border-t border-slate-150 dark:border-slate-800 pt-2 text-sm">
                    <span>Estimasi Total</span>
                    <span className={orderType === 'BELI' ? 'text-emerald-600' : 'text-rose-600'}>
                      {selectedAsset.market === 'IDX' 
                        ? `Rp ${(Number(orderShares) * selectedAsset.price).toLocaleString('id-ID')}` 
                        : `$${(Number(orderShares) * selectedAsset.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className={`w-full py-2.5 text-xs font-black uppercase tracking-wider text-white rounded-xl transition-all shadow-md active:scale-95 ${
                    orderType === 'BELI' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  Kirim Order {orderType} {selectedAsset.symbol}
                </button>
              </form>
            </div>

            {/* AI Advisor Co-pilot panel (md:col-span-5) */}
            <div className="bg-gradient-to-br from-indigo-950 to-slate-950 text-slate-100 rounded-2xl border border-indigo-900/40 p-5 shadow-sm md:col-span-5 space-y-4">
              <div className="flex items-center gap-1.5 border-b border-indigo-900/50 pb-3">
                <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
                <h3 className="font-extrabold text-xs uppercase tracking-widest text-indigo-300">AI Co-pilot Advisor</h3>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300 font-semibold italic">
                "Berdasarkan profil kepemilikan Anda, aset utama Anda berfokus pada {Object.keys(holdings).join(', ')}. Disarankan untuk memanfaatkan diversifikasi multiaset dengan menambahkan porsi Emas (GOLD) atau Komoditas untuk memproteksi portofolio Anda dari guncangan inflasi."
              </p>
              <div className="bg-indigo-900/30 p-3 rounded-xl border border-indigo-700/20 text-[10px] text-indigo-200 font-bold space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-black">Rekomendasi Takstis:</span>
                <p>💡 Pasang limit order BELI saham NVDA di level $810 untuk antisipasi pullback teknis pasca rilis berita.</p>
              </div>
            </div>
          </div>

          {/* Holdings Inventory & P&L Real-time Dashboard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-slate-400" /> Kepemilikan Portofolio Virtual & P&L
              </h3>
              <button 
                onClick={handleExportJSON}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 text-[10px] font-bold rounded-xl border border-slate-200 hover:bg-slate-100"
              >
                <Download className="w-3.5 h-3.5" /> Ekspor JSON
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-400">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black uppercase text-slate-400">
                    <th className="py-2.5">Aset / Sektor</th>
                    <th className="py-2.5 text-right">Jumlah</th>
                    <th className="py-2.5 text-right">Rata-rata</th>
                    <th className="py-2.5 text-right">Harga Saat Ini</th>
                    <th className="py-2.5 text-right">Return / P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-bold">
                  {Object.keys(holdings).filter(sym => holdings[sym].shares > 0).map(sym => {
                    const hold = holdings[sym];
                    const asset = assets.find(a => a.symbol === sym);
                    if (!asset) return null;

                    const curValue = hold.shares * asset.price;
                    const costBasis = hold.shares * hold.avgPrice;
                    const pnlVal = curValue - costBasis;
                    const pnlPct = costBasis > 0 ? (pnlVal / costBasis) * 100 : 0;
                    const isPositive = pnlVal >= 0;

                    return (
                      <tr key={sym} className="hover:bg-slate-50/50">
                        <td className="py-3">
                          <span className="font-extrabold text-slate-800 dark:text-slate-100">{sym}</span>
                          <span className="block text-[9px] text-slate-400 uppercase">{asset.sector}</span>
                        </td>
                        <td className="py-3 text-right text-slate-700 dark:text-slate-300">
                          {hold.shares} lbr
                        </td>
                        <td className="py-3 text-right">
                          {asset.market === 'IDX' ? `Rp ${hold.avgPrice.toLocaleString()}` : `$${hold.avgPrice}`}
                        </td>
                        <td className="py-3 text-right">
                          {asset.market === 'IDX' ? `Rp ${asset.price.toLocaleString()}` : `$${asset.price}`}
                        </td>
                        <td className={`py-3 text-right ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                          <span className="flex items-center justify-end gap-1">
                            {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                            {asset.market === 'IDX' ? `Rp ${pnlVal.toLocaleString()}` : `$${pnlVal.toFixed(2)}`}
                          </span>
                          <span className="text-[10px] block">({isPositive ? '+' : ''}{pnlPct.toFixed(1)}%)</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Interactive Daily Quiz / Financial Trivia Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <BookOpen className="w-4 h-4 text-teal-500" /> Trivia & Quiz Harian Keuangan
              </h3>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-150">
                <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider">Pertanyaan hari ini</span>
                <p className="text-xs font-black text-slate-800 dark:text-slate-200 mt-1">{quizQuestions[quizIdx].q}</p>
                
                <div className="mt-4 space-y-2">
                  {quizQuestions[quizIdx].a.map((opt, i) => (
                    <button
                      key={i}
                      disabled={quizAnswered !== null}
                      onClick={() => handleQuizAnswer(i)}
                      className="w-full text-left p-3 rounded-xl border text-xs font-extrabold transition-all hover:bg-slate-100 dark:hover:bg-slate-800 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 disabled:opacity-70 disabled:hover:bg-white"
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                {quizFeedback && (
                  <div className={`mt-3 p-3 rounded-xl text-xs font-bold ${quizAnswered ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'}`}>
                    {quizFeedback}
                  </div>
                )}
                
                {quizAnswered && quizIdx < quizQuestions.length - 1 && (
                  <button 
                    onClick={() => { setQuizIdx(quizIdx + 1); setQuizAnswered(null); setQuizFeedback(''); }}
                    className="mt-3 text-xs font-black text-teal-600 uppercase hover:underline"
                  >
                    Pertanyaan Berikutnya →
                  </button>
                )}
              </div>
            </div>

            {/* Simulated Online Interactive Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <UserCheck className="w-4 h-4 text-indigo-500" /> Papan Peringkat Trader Virtual
              </h3>
              <div className="divide-y divide-slate-100 space-y-3">
                {leaderboard.sort((a, b) => b.value - a.value).map((member, index) => {
                  const isUser = member.name === "Anda";
                  return (
                    <div key={member.name} className={`flex items-center justify-between py-2.5 text-xs ${isUser ? 'bg-indigo-50/45 dark:bg-indigo-950/20 px-3 rounded-xl border border-indigo-100/40' : ''}`}>
                      <div className="flex items-center gap-2.5">
                        <span className="font-black text-slate-400 text-[10px] w-4">#{index + 1}</span>
                        <span className="text-lg">{member.avatar}</span>
                        <div>
                          <p className={`font-extrabold ${isUser ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-800 dark:text-slate-200'}`}>
                            {member.name}
                          </p>
                          <span className="text-[10px] text-slate-400 uppercase font-black">Pertumbuhan: {member.growth >= 0 ? '+' : ''}{member.growth}%</span>
                        </div>
                      </div>
                      <span className="font-black text-slate-900 dark:text-slate-100">
                        Rp {member.value.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive risk diagnostics modal launcher and Pending Orders queue */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Pending Orders Log / Stop Loss queue */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <History className="w-4 h-4 text-slate-400" /> Pending Limit & Stop Loss Orders ({pendingOrders.length})
              </h3>
              {pendingOrders.length > 0 ? (
                <div className="space-y-2.5 max-h-[160px] overflow-y-auto">
                  {pendingOrders.map(order => (
                    <div key={order.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-xs">
                      <div>
                        <span className="font-black text-slate-800 dark:text-slate-100">{order.symbol}</span>
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[8px] font-black bg-indigo-100 text-indigo-700">{order.type}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">Target: {order.targetPrice.toLocaleString()} ({order.shares} lbr)</p>
                        <button 
                          onClick={() => setPendingOrders(p => p.filter(o => o.id !== order.id))}
                          className="text-[9px] text-rose-500 hover:underline font-black uppercase mt-0.5 block ml-auto"
                        >
                          Batalkan Order
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-6 text-xs text-slate-400 font-bold">Tidak ada pending order saat ini.</p>
              )}
            </div>

            {/* Risk diagnostics launcher widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-100 pb-3">
                <Landmark className="w-4 h-4 text-indigo-500" /> Analisis Profil Risiko Finansial
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Ketahui kecenderungan kepribadian Anda dalam menghadapi volatilitas dan risiko kerugian investasi di instrumen berisiko tinggi.
              </p>
              <button 
                onClick={() => { setShowRiskModal(true); handleResetRisk(); }}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black uppercase text-[10px] tracking-wider py-2.5 rounded-xl transition-all"
              >
                Mulai Tes Diagnostik (3 Soal)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: CHANGE FINANCIAL GOAL */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-sm w-full rounded-2xl p-6 border border-slate-200 dark:border-slate-850 space-y-4"
            >
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-sm font-extrabold uppercase text-slate-800 dark:text-slate-100">Setel Ulang Target Finansial</h3>
                <button onClick={() => setShowGoalModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Nama Rencana Target</label>
                  <input
                    type="text"
                    value={financialGoal.name}
                    onChange={(e) => setFinancialGoal(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-500 block">Jumlah Uang Target (Rupiah)</label>
                  <input
                    type="number"
                    value={financialGoal.target}
                    onChange={(e) => setFinancialGoal(p => ({ ...p, target: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-base sm:text-xs font-bold"
                  />
                </div>
              </div>

              <button 
                onClick={() => setShowGoalModal(false)}
                className="w-full py-2.5 text-xs font-black uppercase text-white bg-teal-600 rounded-xl hover:bg-teal-500 transition-all"
              >
                Simpan Rencana Rencana
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: RISK PROFILE DIAGNOSTICS */}
      <AnimatePresence>
        {showRiskModal && (
          <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 border border-slate-200 space-y-4 shadow-xl"
            >
              <div className="flex justify-between items-center border-b border-slate-150 pb-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-100">Evaluasi Profil Risiko</h3>
                <button onClick={() => setShowRiskModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
              </div>

              {riskAnswers.length < 3 ? (
                <div className="space-y-4">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={`h-1.5 flex-1 rounded-full ${riskAnswers.length >= step - 1 ? 'bg-indigo-600' : 'bg-slate-100'}`} />
                    ))}
                  </div>

                  {riskAnswers.length === 0 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">1. Jika portofolio Anda turun 15% dalam 1 minggu, apa reaksi pertama Anda?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Panik dan langsung menjual semua aset demi mengamankan sisa dana (Konservatif)</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Menganalisis alasan penurunan dan menahan portofolio sementara waktu (Moderat)</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Melihatnya sebagai peluang diskon belanja saham besar-besaran (Agresif)</button>
                      </div>
                    </div>
                  )}

                  {riskAnswers.length === 1 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">2. Apa tujuan investasi utama yang ingin Anda kejar dalam 3 tahun ke depan?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Melindungi uang pokok dari inflasi dengan aman dan stabil</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Mendapatkan keuntungan pertumbuhan modal sedang dan dividen tunai berkelanjutan</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Memaksimalkan peningkatan modal gila-gilaan dari aset growth berisiko tinggi</button>
                      </div>
                    </div>
                  )}

                  {riskAnswers.length === 2 && (
                    <div className="space-y-3">
                      <p className="text-xs font-black text-slate-800 dark:text-slate-100">3. Berapa porsi dana investasi dari seluruh kekayaan bersih cair Anda?</p>
                      <div className="space-y-2">
                        <button onClick={() => handleSelectRiskAnswer(1)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Kurang dari 10% (Sangat hati-hati)</button>
                        <button onClick={() => handleSelectRiskAnswer(2)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Antara 10% sampai 40% (Porsi moderat seimbang)</button>
                        <button onClick={() => handleSelectRiskAnswer(3)} className="w-full text-left p-3 rounded-xl border text-xs font-bold hover:bg-slate-50">Lebih dari 40% (Alokasi agresif)</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 text-center py-4">
                  <span className="text-4xl block">🎯</span>
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">Profil Risiko Anda</span>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{riskResult}</p>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                    Kami menyarankan Anda menyesuaikan rasio alokasi aset agar emosi trading Anda tetap terjaga dengan baik dalam simulasi real-time.
                  </p>
                  <div className="flex gap-2 pt-2">
                    <button 
                      onClick={handleResetRisk}
                      className="flex-1 py-2 text-xs font-black border border-slate-200 rounded-xl hover:bg-slate-50 transition-all uppercase"
                    >
                      Ulangi Tes
                    </button>
                    <button 
                      onClick={() => setShowRiskModal(false)}
                      className="flex-1 py-2 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all uppercase"
                    >
                      Selesai
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Financial Disclaimer Banner */}
      <div className="mt-8 p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 text-slate-500 dark:text-slate-400 text-xs">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
          <span>
            <strong>Disclaimer Keuangan:</strong> Seluruh transaksi dalam simulator ini bersifat virtual untuk tujuan edukasi dan pelatihan literasi finansial. SiKaya tidak memfasilitasi transaksi uang riil maupun menyediakan penasihat investasi berlisensi OJK.
          </span>
        </div>
      </div>
    </div>
  );
}
