import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, RotateCcw, AlertTriangle, CheckCircle2, Skull, Heart, Baby, Home, Briefcase, 
  Activity, Sparkles, Plus, Trash2, TrendingUp, Info, HelpCircle, ArrowRight, ShieldCheck, 
  Award, Coins, Compass, PieChart, TrendingDown, Wallet, Percent, Zap, BookOpen, Crown, ChevronRight,
  TrendingUp as TrendIcon, Sparkles as SparkleIcon, HelpCircle as HelpIcon, ArrowUpRight
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/PageHeader';

// Types definitions
interface SimulationEvent {
  year: number;
  age: number;
  message: string;
  type: 'neutral' | 'warning' | 'danger' | 'success';
  icon: React.ReactNode;
}

interface ChartDataPoint {
  age: number;
  balance: number;
  expenses: number;
  yieldRate: number;
}

interface PresetScenario {
  name: string;
  emoji: string;
  desc: string;
  age: number;
  salary: number;
  marry: number;
  child: number;
  house: number;
  layoff: number;
  initialAllocation: { safe: number; mutual: number; stocks: number; crypto: number };
  customEvents: { age: number; title: string; cost: number }[];
}

interface RPGDecision {
  age: number;
  title: string;
  description: string;
  options: {
    text: string;
    effect: (stats: any) => { 
      balanceChange: number; 
      expensesChange: number; 
      salaryChange: number; 
      log: string; 
      hasInsurance?: boolean;
      customModifier?: (stats: any) => void;
    };
  }[];
}

interface EconomicShock {
  title: string;
  emoji: string;
  description: string;
  type: 'success' | 'warning' | 'danger';
  effectText: string;
  apply: (stats: { salary: number; expenses: number; balance: number; yieldMod: number }) => {
    message: string;
    salaryMod: number;
    expenseMod: number;
    yieldMod: number;
    balanceMod: number;
  };
}

export function LifeSimulatorPage() {
  const { user, addXp } = useAuth();
  const { toast } = useToast();

  // Mode & Tabs
  const [isInteractiveMode, setIsInteractiveMode] = useState(false);
  const [rpgStarted, setRpgStarted] = useState(false);
  const [rpgAge, setRpgAge] = useState(22);

  // Asset Allocation State (Sums to 100%)
  const [allocation, setAllocation] = useState({
    safe: 40,      // Deposito / SBN (Yield 5.5%, Risk: 0%)
    mutual: 30,    // Reksadana (Yield 8.5%, Risk: low)
    stocks: 20,    // Saham IHSG (Yield 12%, Risk: medium-high)
    crypto: 10     // Kripto (Yield 16%, Risk: extreme)
  });

  // Allocation Preset selected helper
  const [allocPreset, setAllocPreset] = useState<'custom' | 'konservatif' | 'moderat' | 'agresif' | 'yolo'>('moderat');

  // Input states for Instant Mode
  const [currentAge, setCurrentAge] = useState(22);
  const [salaryInput, setSalaryInput] = useState('5.000.000');
  const [marryAge, setMarryAge] = useState(27);
  const [childAge, setChildAge] = useState(30);
  const [houseAge, setHouseAge] = useState(32);
  const [layoffAge, setLayoffAge] = useState(35);

  // Custom life events injection
  const [customEvents, setCustomEvents] = useState<{ age: number; title: string; cost: number }[]>([
    { age: 25, title: 'Beli Motor Baru', cost: 25000000 },
    { age: 45, title: 'Ibadah Haji / Umrah', cost: 60000000 }
  ]);

  const [newCustomAge, setNewCustomAge] = useState<number>(25);
  const [newCustomTitle, setNewCustomTitle] = useState<string>('');
  const [newCustomCost, setNewCustomCost] = useState<string>('15.000.000');

  // Outputs for simulation
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const [bankruptcyProb, setBankruptcyProb] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [financialReportCard, setFinancialReportCard] = useState<{
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    savingScore: number;
    diversificationScore: number;
    emergencyScore: number;
    overallScore: number;
    xpEarned: number;
    xpClaimed: boolean;
  } | null>(null);

  // RPG interactive states
  const [rpgBalance, setRpgBalance] = useState(15000000);
  const [rpgSalary, setRpgSalary] = useState(5000000);
  const [rpgExpenses, setRpgExpenses] = useState(2500000);
  const [rpgHasInsurance, setRpgHasInsurance] = useState(false);
  const [rpgHasHouse, setRpgHasHouse] = useState(false);
  const [rpgMortgage, setRpgMortgage] = useState(0);
  const [rpgEvents, setRpgEvents] = useState<SimulationEvent[]>([]);
  const [rpgChart, setRpgChart] = useState<ChartDataPoint[]>([]);
  const [currentDecision, setCurrentDecision] = useState<RPGDecision | null>(null);
  const [decisionHistory, setDecisionHistory] = useState<Record<number, string>>({});
  
  // Custom modifiers for RPG RPG mode
  const [rpgSalaryGrowthModifier, setRpgSalaryGrowthModifier] = useState(1.05); // Base 5%
  const [rpgActiveCareer, setRpgActiveCareer] = useState<string>('Karyawan Swasta');
  
  // Shock State triggers
  const [currentShock, setCurrentShock] = useState<EconomicShock | null>(null);
  const [shockHistory, setShockHistory] = useState<{ age: number; title: string; type: string }[]>([]);

  // Helpers for currency formatting
  const formatRupiah = (val: string) => {
    const cleanNum = val.replace(/\D/g, '');
    return cleanNum ? Number(cleanNum).toLocaleString('id-ID') : '';
  };

  const parseRawNumber = (val: string) => {
    return Number(val.replace(/\D/g, '')) || 0;
  };

  // Portfolio allocation auto-balancer (Sums strictly to 100)
  const handleAllocationChange = (key: 'safe' | 'mutual' | 'stocks' | 'crypto', value: number) => {
    setAllocPreset('custom');
    const otherKeys = (['safe', 'mutual', 'stocks', 'crypto'] as const).filter(k => k !== key);
    const diff = value - allocation[key];
    const newAllocation = { ...allocation, [key]: value };
    
    let remainingDiff = -diff;
    const validKeys = otherKeys.filter(k => {
      if (remainingDiff < 0) return allocation[k] > 0;
      if (remainingDiff > 0) return allocation[k] < 100;
      return true;
    });

    if (validKeys.length > 0) {
      const share = remainingDiff / validKeys.length;
      validKeys.forEach(k => {
        newAllocation[k] = Math.max(0, Math.min(100, Math.round(newAllocation[k] + share)));
      });
    }

    let total = newAllocation.safe + newAllocation.mutual + newAllocation.stocks + newAllocation.crypto;
    if (total !== 100) {
      const adjustKey = otherKeys[0];
      newAllocation[adjustKey] = Math.max(0, Math.min(100, newAllocation[adjustKey] + (100 - total)));
    }

    setAllocation(newAllocation);
  };

  // Trigger Preset Portfolio templates
  const applyAllocPreset = (type: 'konservatif' | 'moderat' | 'agresif' | 'yolo') => {
    setAllocPreset(type);
    if (type === 'konservatif') {
      setAllocation({ safe: 70, mutual: 20, stocks: 10, crypto: 0 });
    } else if (type === 'moderat') {
      setAllocation({ safe: 40, mutual: 30, stocks: 20, crypto: 10 });
    } else if (type === 'agresif') {
      setAllocation({ safe: 15, mutual: 20, stocks: 45, crypto: 20 });
    } else if (type === 'yolo') {
      setAllocation({ safe: 0, mutual: 5, stocks: 15, crypto: 80 });
    }
  };

  // Indonesian Economic Shocks database
  const economicShocks: EconomicShock[] = [
    {
      title: "📉 Ledakan Inflasi & Harga Sembako Meroket",
      emoji: "🛒",
      description: "Harga kebutuhan pokok, beras, dan sayuran naik tajam akibat gagal panen nasional.",
      type: "danger",
      effectText: "Beban Biaya Hidup bulanan meroket +25%.",
      apply: (stats) => {
        return {
          message: "Krisis pangan memicu inflasi ekstrim. Anda terpaksa merogoh kocek lebih dalam untuk makan sehari-hari.",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.25,
          yieldMod: -0.02,
          balanceMod: 0
        };
      }
    },
    {
      title: "🚀 Super Bull Market Kripto",
      emoji: "₿",
      description: "Adopsi masif institusi besar membuat Bitcoin dan altcoin terbang ke All-Time High baru!",
      type: "success",
      effectText: "Aset Kripto Anda mencetak return gila-gilaan (+80%).",
      apply: () => {
        return {
          message: "Portofolio kripto Anda to the moon! Keuntungan luar biasa bagi yang berani mengambil risiko.",
          salaryMod: 0,
          expenseMod: 0,
          yieldMod: 0.80,
          balanceMod: 0
        };
      }
    },
    {
      title: "🏥 Gelombang Wabah Penyakit Baru",
      emoji: "🦠",
      description: "Virus baru menyebar dengan cepat, mengganggu sistem kerja dan kesehatan nasional.",
      type: "warning",
      effectText: "Biaya kesehatan darurat melonjak, IHSG melemah.",
      apply: (stats) => {
        return {
          message: "Aktivitas terhenti sesaat. Anda harus membeli vitamin dan alat pelindung diri secara masif.",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.15,
          yieldMod: -0.05,
          balanceMod: -1500000 // one time medical cost
        };
      }
    },

    {
      title: "⛽ Kenaikan Harga BBM Bersubsidi",
      emoji: "⛽",
      description: "Pemerintah terpaksa memotong anggaran subsidi Pertalite dan Solar demi menjaga keseimbangan APBN negara.",
      type: "danger",
      effectText: "Beban Biaya Hidup melonjak +20% untuk tahun ini.",
      apply: (stats) => {
        return {
          message: "Harga BBM naik memicu efek domino kenaikan harga pangan dan logistik. Pengeluaran membengkak!",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.20,
          yieldMod: -0.01,
          balanceMod: 0
        };
      }
    },
    {
      title: "🚀 Booming Komoditas Global",
      emoji: "🚢",
      description: "Harga batubara, kelapa sawit (CPO), dan nikel dunia melesat tinggi! Ekspor nasional melonjak tajam.",
      type: "success",
      effectText: "Imbal hasil pasar saham IHSG tumbuh eksponensial (+15% return ekstra).",
      apply: () => {
        return {
          message: "Sektor riil & komoditas Indonesia berkilau. Saham-saham Blue Chip meroket tinggi!",
          salaryMod: 0,
          expenseMod: 0,
          yieldMod: 0.15,
          balanceMod: 0
        };
      }
    },
    {
      title: "💸 Depresiasi Rupiah & Krisis Moneter Global",
      emoji: "📉",
      description: "Bank Sentral AS (Federal Reserve) menaikkan suku bunga tinggi, memicu dana keluar dan memperlemah Rupiah.",
      type: "danger",
      effectText: "Biaya hidup impor naik +15%. Kripto mengalami volatilitas besar.",
      apply: (stats) => {
        return {
          message: "Rupiah melemah terhadap USD. Harga gadget, teknologi, dan bahan baku impor bertambah mahal.",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.15,
          yieldMod: -0.04,
          balanceMod: 0
        };
      }
    },
    {
      title: "📈 Kebijakan BI-Rate Naik",
      emoji: "🏦",
      description: "Bank Indonesia menaikkan suku bunga acuan untuk memerangi laju inflasi domestik yang memanas.",
      type: "warning",
      effectText: "Yield Deposito bertambah +2%, namun biaya cicilan KPR bertambah mahal +15%.",
      apply: (stats) => {
        return {
          message: "Suku bunga tinggi menguntungkan penabung deposito, namun menekan debitur cicilan mengambang (floating rate).",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.05, // minor overall tightening
          yieldMod: 0.02,
          balanceMod: 0
        };
      }
    },
    {
      title: "🥩 Lonjakan Inflasi Bahan Sembako",
      emoji: "🌾",
      description: "Faktor cuaca El Nino memicu kegagalan panen beras dan hortikultura secara nasional.",
      type: "danger",
      effectText: "Kebutuhan bahan pangan harian bertambah +12%.",
      apply: (stats) => {
        return {
          message: "Beras, cabai, dan daging sapi merangkak naik di seluruh pasar retail Indonesia.",
          salaryMod: 0,
          expenseMod: stats.expenses * 0.12,
          yieldMod: 0,
          balanceMod: 0
        };
      }
    },
    {
      title: "💻 Era Keemasan Tech & Investasi Baru",
      emoji: "🦄",
      description: "Masuknya modal asing mendirikan digital hub nasional dan melahirkan banyak startup unicorn baru.",
      type: "success",
      effectText: "Aliran bonus tahunan mengalir. Pendapatan bertambah +25%.",
      apply: (stats) => {
        return {
          message: "Permintaan bakat digital memuncak! Anda mendapat apresiasi bonus keahlian khusus.",
          salaryMod: stats.salary * 0.25,
          expenseMod: 0,
          yieldMod: 0.05,
          balanceMod: 0
        };
      }
    },
    {
      title: "⚡ Program Bansos & Insentif Pajak Pemerintah",
      emoji: "🎁",
      description: "Pemerintah meluncurkan insentif PPN DTP perumahan dan subsidi listrik untuk menjaga daya beli.",
      type: "success",
      effectText: "Subsidi langsung meringankan kas tabungan Anda sebesar Rp 8.000.000.",
      apply: () => {
        return {
          message: "Anda menikmati keringanan tagihan bulanan dan stimulus langsung masuk ke rekening.",
          salaryMod: 0,
          expenseMod: 0,
          yieldMod: 0,
          balanceMod: 8000000
        };
      }
    }
  ];

  // Simulated preset scenarios
  const presets: PresetScenario[] = [
    {
      name: "Generasi Sandwich",
      emoji: "🥪",
      desc: "Menikah muda, harus menanggung biaya orang tua, terikat cicilan rumah panjang, gaji UMR pas-pasan.",
      age: 22,
      salary: 4700000,
      marry: 25,
      child: 28,
      house: 30,
      layoff: 40,
      initialAllocation: { safe: 60, mutual: 30, stocks: 10, crypto: 0 },
      customEvents: [
        { age: 24, title: "Sumbangan Rutin Berobat Ortu", cost: 15000000 },
        { age: 35, title: "Biaya Pangkal SD Anak", cost: 20000000 }
      ]
    },
    {
      name: "PNS Idaman Mertua",
      emoji: "👔",
      desc: "Gaji stabil, jaminan pensiun aman, kenaikan pasti, kebal dari isu PHK massal korporasi.",
      age: 24,
      salary: 7500000,
      marry: 28,
      child: 31,
      house: 33,
      layoff: 58, // Almost zero risk
      initialAllocation: { safe: 50, mutual: 40, stocks: 10, crypto: 0 },
      customEvents: [
        { age: 42, title: "Dana Kuliah Anak Pertama", cost: 50000000 },
        { age: 50, title: "Renovasi Atap Rumah Bocor", cost: 30000000 }
      ]
    },
    {
      name: "Sultan Tech Bro",
      emoji: "⚡",
      desc: "Gaji awal fantastis tapi gaya hidup mewah dan konsumtif. Rawan PHK mendadak akibat bubble startup.",
      age: 21,
      salary: 19000000,
      marry: 29,
      child: 32,
      house: 34,
      layoff: 36,
      initialAllocation: { safe: 15, mutual: 25, stocks: 40, crypto: 20 },
      customEvents: [
        { age: 24, title: "Beli Laptop Spek Monster", cost: 38000000 },
        { age: 28, title: "DP Mobil Sport Listrik", cost: 130000000 }
      ]
    },
    {
      name: "Content Creator Viral",
      emoji: "📹",
      desc: "Pendapatan tidak teratur tapi bisa sangat besar. Pengeluaran peralatan tinggi di awal.",
      age: 22,
      salary: 12000000,
      marry: 27,
      child: 30,
      house: 32,
      layoff: 45,
      initialAllocation: { safe: 20, mutual: 20, stocks: 30, crypto: 30 },
      customEvents: [
        { age: 23, title: "Biaya Studio & Kamera Premium", cost: 35000000 },
        { age: 40, title: "Ibadah Haji Plus Keluarga", cost: 110000000 }
      ]
    },
    {
      name: "Solo Culinary Entrepreneur",
      emoji: "👩‍🍳",
      desc: "Mulai dengan modal mini. Sangat bergantung pada inflasi harga bahan baku tapi pertumbuhan tak terbatas.",
      age: 23,
      salary: 3500000,
      marry: 28,
      child: 31,
      house: 35,
      layoff: 50,
      initialAllocation: { safe: 40, mutual: 30, stocks: 20, crypto: 10 },
      customEvents: [
        { age: 26, title: "Sewa Ruko Tambahan Cabang", cost: 25000000 },
        { age: 48, title: "Ekspansi Dapur & Mesin Semi-Auto", cost: 45000000 }
      ]
    },
    {
      name: "Pekerja Gig / Driver Ojol",
      emoji: "🛵",
      desc: "Bekerja mandiri tanpa tunjangan korporasi. Risiko kesehatan fisik dan BBM sangat dominan.",
      age: 22,
      salary: 4500000,
      marry: 26,
      child: 29,
      house: 34,
      layoff: 45,
      initialAllocation: { safe: 50, mutual: 40, stocks: 10, crypto: 0 },
      customEvents: [
        { age: 25, title: "Turun Mesin & Ganti Motor Baru", cost: 18000000 },
        { age: 38, title: "Biaya Operasi Ring Jantung Ortu", cost: 40000000 }
      ]
    }
  ];

  // List of pre-defined decisions in RPG Game
  const rpgDecisions: RPGDecision[] = [
    {
      age: 24,
      title: "🏢 Godaan Pindah Kerja (Bakar Uang vs Stabil)",
      description: "Sebuah Startup Unicorn menawarkan kenaikan gaji 40% tapi berisiko tinggi lay-off. Sementara perusahaan lamamu stabil.",
      options: [
        {
          text: "Pindah ke Startup (Gaji +40%, Risiko Tinggi)",
          effect: (stats) => ({
            balanceChange: 0,
            expensesChange: stats.expenses * 0.1, // Lifestyle creep
            salaryChange: stats.salary * 0.40,
            log: "Pindah ke Startup! Gajimu melonjak drastis 40%, tapi gaya hidupmu ikut naik 10% karena pergaulan baru."
          })
        },
        {
          text: "Bertahan di Perusahaan Lama",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Memilih stabilitas di atas gaji besar. Karirmu aman dari drama lay-off."
          })
        }
      ]
    },
    {
      age: 29,
      title: "🤝 Ajakan Investasi Bisnis Teman",
      description: "Teman SMA-mu meminjam modal Rp 25 Juta untuk buka kedai kopi dengan janji bagi hasil 30% per tahun.",
      options: [
        {
          text: "Berikan Modal Rp 25 Juta",
          effect: () => {
            const success = Math.random() > 0.75; // 25% chance of success
            return {
              balanceChange: success ? 50000000 : -25000000,
              expensesChange: 0,
              salaryChange: 0,
              log: success 
                ? "Keajaiban! Kedai kopi temanmu sukses besar dan modalmu kembali berlipat ganda." 
                : "Apes. Bisnisnya bangkrut dalam 6 bulan dan temanmu menghilang. Rp 25 Juta lenyap."
            };
          }
        },
        {
          text: "Tolak Halus Ajakan Tersebut",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Kamu menolak dengan halus. Hubungan pertemanan sedikit canggung, tapi uangmu aman di Reksadana."
          })
        }
      ]
    },
    {
      age: 38,
      title: "💸 Jebakan Pinjaman Online (Keluarga)",
      description: "Adikmu terjerat hutang Pinjol ilegal sebesar Rp 35 Juta dan diteror penagih hutang setiap hari.",
      options: [
        {
          text: "Lunasi Semua Hutangnya (Rp 35 Juta)",
          effect: () => ({
            balanceChange: -35000000,
            expensesChange: 0,
            salaryChange: 0,
            log: "Kamu menguras tabungan Rp 35 Juta demi menyelamatkan adikmu dari jeratan Pinjol."
          })
        },
        {
          text: "Bantu Sebagian Saja (Rp 10 Juta)",
          effect: () => ({
            balanceChange: -10000000,
            expensesChange: 0,
            salaryChange: 0,
            log: "Kamu membantu Rp 10 Juta. Sang adik harus mencicil sisanya perlahan, tapi tabungan utamamu selamat."
          })
        }
      ]
    },

    {
      age: 23,
      title: "📱 Godaan Gadget Boba Terbaru",
      description: "HP lamamu masih berfungsi baik, tapi HP boba versi terbaru baru saja rilis. Teman-teman tongkronganmu ramai membahasnya.",
      options: [
        {
          text: "Beli tunai Rp 14.000.000",
          effect: () => ({
            balanceChange: -14000000,
            expensesChange: 0,
            salaryChange: 0,
            log: "Membeli HP baru secara cash Rp 14 Juta demi gengsi, tabunganmu langsung terkuras."
          })
        },
        {
          text: "Cicil Paylater Rp 1.500.000/bln selama 12 bulan (Bunga Tinggi)",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 1500000,
            salaryChange: 0,
            log: "Mengambil cicilan Paylater untuk HP baru. Biaya cashflow bulananmu tertekan hebat!"
          })
        },
        {
          text: "Tolak FOMO, tabung & investasikan porsi uangnya",
          effect: () => ({
            balanceChange: 0,
            expensesChange: -400000, // saving
            salaryChange: 0,
            log: "Hebat! Sukses mengabaikan FOMO gadget. Uang dialokasikan untuk mempertebal Reksadana."
          })
        }
      ]
    },
    {
      age: 25,
      title: "🎓 Sertifikasi Keahlian Premium / Pelatihan S2",
      description: "Ada kesempatan program sertifikasi profesional tingkat global seharga Rp 15 Juta. Ini terbukti mempercepat promosi jabatan.",
      options: [
        {
          text: "Ambil Program & Bayar Rp 15.000.000",
          effect: (stats) => {
            return {
              balanceChange: -15000000,
              expensesChange: 0,
              salaryChange: stats.salary * 0.20, // Instant raise
              log: "Langkah cerdas! Investasi leher ke atas terbayar. Gaji bulanan Anda langsung naik 20% dan laju naik gaji tahunan bertambah!",
              customModifier: () => {
                setRpgSalaryGrowthModifier(1.08); // Growth rates up to 8%
              }
            };
          }
        },
        {
          text: "Simpan modalnya saja, belajar otodidak gratis",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Memilih tidak mengambil program formal. Karir berjalan stabil dengan kenaikan normal."
          })
        }
      ]
    },
    {
      age: 27,
      title: "💍 Rencana Resepsi Pernikahan",
      description: "Pasanganmu mengajak membicarakan pesta pernikahan. Ada pilihan gedung mewah berkapasitas besar, atau syukuran sederhana di KUA.",
      options: [
        {
          text: "Gelar Resepsi Ballroom Mewah (Biaya Rp 120.000.000)",
          effect: () => ({
            balanceChange: -120000000,
            expensesChange: 1500000, // extra household cost
            salaryChange: 0,
            log: "Resepsi mewah terselenggara megah! Semua tamu kagum, namun tabunganmu menipis dramatis."
          })
        },
        {
          text: "Syukuran Hangat di KUA & Restoran (Biaya Rp 20.000.000)",
          effect: () => ({
            balanceChange: -20000000,
            expensesChange: 1000000, // shared household cost
            salaryChange: 0,
            log: "Pernikahan sakral dan sederhana di KUA. Sisa anggaran dialokasikan untuk investasi masa depan bersama."
          })
        }
      ]
    },
    {
      age: 30,
      title: "🛡️ Proteksi Asuransi Kesehatan Privat",
      description: "Anda baru memiliki jaminan dasar BPJS Kesehatan. Agen asuransi swasta menawarkan paket komprehensif Rp 450.000/bulan.",
      options: [
        {
          text: "Daftar Asuransi Kesehatan Swasta (Rp 450.000 / bln)",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 450000,
            salaryChange: 0,
            log: "Membeli asuransi privat. Proteksi medis komprehensif aktif untuk risiko tak terduga.",
            hasInsurance: true
          })
        },
        {
          text: "Bertahan dengan BPJS, simpan preminya",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Memilih bergantung penuh pada BPJS. Anda menghemat premi tapi memikul risiko co-pay medis.",
            hasInsurance: false
          })
        }
      ]
    },
    {
      age: 33,
      title: "👵 Krisis Sandwich: Kesehatan Orang Tua Menurun",
      description: "Ibu mertua/orang tua mendadak harus dirawat intensif di rumah sakit akibat gangguan jantung. Biaya di luar BPJS Rp 45 Juta.",
      options: [
        {
          text: "Bayar Tagihan Pengobatan",
          effect: (stats) => {
            if (stats.hasInsurance) {
              return {
                balanceChange: -4000000, // covered largely by insurance co-pay
                expensesChange: 0,
                salaryChange: 0,
                log: "Luar biasa untung! Asuransi swasta meng-cover mayoritas tagihan, Anda hanya membayar biaya administrasi Rp 4 Juta."
              };
            } else {
              return {
                balanceChange: -45000000,
                expensesChange: 0,
                salaryChange: 0,
                log: "Kasihan sekali! Tanpa asuransi swasta tambahan, Anda terpaksa menguras dana darurat tabungan Rp 45 Juta tunai."
              };
            }
          }
        }
      ]
    },
    {
      age: 36,
      title: "🏪 Waralaba Bisnis Kopi Kekinian (Side Hustle)",
      description: "Ada tawaran kemitraan franchise kedai kopi susu otomatis dengan manajemen terkelola penuh. Butuh modal Rp 30 Juta.",
      options: [
        {
          text: "Ambil Franchise (Bayar Rp 30.000.000)",
          effect: (stats) => ({
            balanceChange: -30000000,
            expensesChange: 0,
            salaryChange: stats.salary * 0.30, // passive income!
            log: "Kemitraan lancar! Bisnis kopi ramai pembeli dan menyokong tambahan passive income bulanan +30%."
          })
        },
        {
          text: "Lewati, simpan uang di pasar modal",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Memilih menghindari risiko riil waralaba, fokus menabung pasif di ETF Saham."
          })
        }
      ]
    },
    {
      age: 42,
      title: "🚗 Keputusan Kendaraan Keluarga",
      description: "Keluargamu tumbuh membesar, anak-anak beranjak remaja. Motor matic lamamu terasa sempit dan berbahaya saat hujan.",
      options: [
        {
          text: "Kredit SUV Baru (DP Rp 40 Jt, Cicilan Rp 4.5 Jt/bln)",
          effect: () => ({
            balanceChange: -40000000,
            expensesChange: 4500000,
            salaryChange: 0,
            log: "Membeli SUV baru dengan cicilan. Kenyamanan keluarga top, tapi arus kas bulananmu sangat kencang terkuras."
          })
        },
        {
          text: "Beli Mobil Bekas Cash (Rp 85 Juta)",
          effect: () => ({
            balanceChange: -85000000,
            expensesChange: 600000, // maintenance
            salaryChange: 0,
            log: "Membeli MPV bekas berkualitas secara tunai Rp 85 Juta tanpa teror cicilan bulanan."
          })
        },
        {
          text: "Tahan dulu, andalkan taksi online saat bepergian",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 350000,
            salaryChange: 0,
            log: "Bertahan naik motor dan menyewa taksi online saat terpaksa. Menghemat ratusan juta Rupiah!"
          })
        }
      ]
    },
    {
      age: 45,
      title: "🎰 Skema Investasi Berisiko Tinggi / Memecoin",
      description: "Komunitas grup chatting mendadak viral merayakan koin kripto bertema anjing yang melesat tinggi. Ada peluang melipatgandakan aset secara instan.",
      options: [
        {
          text: "Spekulasikan Rp 30.000.000 ke Koin Kripto",
          effect: () => {
            const success = Math.random() > 0.65; // 35% chance
            return {
              balanceChange: success ? 90000000 : -30000000,
              expensesChange: 0,
              salaryChange: 0,
              log: success 
                ? "Jackpot luar biasa! Spekulasi koinmu meroket 3x lipat, menghasilkan cuan bersih Rp 90 Juta!" 
                : "Aduh runtuh! Koin mengalami skema rug-pull dev, uang Rp 30 Juta milikmu hangus tak bersisa."
            };
          }
        },
        {
          text: "Abaikan kebisingan, konsisten nabung SBN/Reksadana",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Tetap tenang memegang prinsip investasi dingin. Aset Anda tumbuh konsisten bebas drama."
          })
        }
      ]
    },
    {
      age: 50,
      title: "🎓 Pendidikan Tinggi Anak Pertama",
      description: "Anak pertamamu lulus SMA dan ingin masuk ke universitas swasta ternama dengan jurusan internasional premium.",
      options: [
        {
          text: "Biayai Universitas Elite Swasta (Uang Pangkal Rp 100 Jt + SPP Rp 3 Jt/bln)",
          effect: () => ({
            balanceChange: -100000000,
            expensesChange: 3000000,
            salaryChange: 0,
            log: "Menyekolahkan anak di kampus elite demi masa depan terbaiknya. Pengeluaran bulananmu melonjak."
          })
        },
        {
          text: "Dorong Masuk PTN Favorit (Uang Pangkal Rp 15 Jt + UKT Rp 800rb/bln)",
          effect: () => ({
            balanceChange: -15000000,
            expensesChange: 800000,
            salaryChange: 0,
            log: "Anakmu lolos seleksi PTN negeri bergengsi. Anggaran pendidikan sangat ramah kantong."
          })
        }
      ]
    },
    {
      age: 54,
      title: "🔥 Gerakan Pensiun Dini (FIRE Movement)",
      description: "Kamu merasa jenuh dengan rutinitas bekerja keras. Jika kas asetmu melimpah, kamu bisa memikirkan pensiun dini mandiri.",
      options: [
        {
          text: "Pensiun Dini Sekarang (Hanya jika Saldo > Rp 800 Juta)",
          effect: (stats) => {
            if (stats.balance >= 80000000) {
              return {
                balanceChange: 0,
                expensesChange: -stats.expenses * 0.15, // simplified costs
                salaryChange: -stats.salary, // drop wage entirely
                log: "Hebat! Anda mengambil keputusan berani pensiun dini untuk menikmati masa tua bebas stres korporasi.",
                customModifier: () => {
                  setRpgSalaryGrowthModifier(0); // No more salary raises
                }
              };
            } else {
              return {
                balanceChange: 0,
                expensesChange: 0,
                salaryChange: 0,
                log: "Gagal pensiun dini! Saldo tabungan Anda saat ini belum aman mencukupi ambang FIRE."
              };
            }
          }
        },
        {
          text: "Lanjutkan bekerja optimal hingga usia 60 tahun",
          effect: () => ({
            balanceChange: 0,
            expensesChange: 0,
            salaryChange: 0,
            log: "Memutuskan tetap loyal di karir korporasi demi jaring pengaman pensiun terlengkap di umur 60."
          })
        }
      ]
    }
  ];

  const applyPreset = (preset: PresetScenario) => {
    setCurrentAge(preset.age);
    setSalaryInput(preset.salary.toLocaleString('id-ID'));
    setMarryAge(preset.marry);
    setChildAge(preset.child);
    setHouseAge(preset.house);
    setLayoffAge(preset.layoff);
    setCustomEvents(preset.customEvents);
    setAllocation(preset.initialAllocation);
    toast.info(`Preset "${preset.name}" berhasil diterapkan!`);
  };

  const addCustomEvent = () => {
    if (!newCustomTitle.trim()) return;
    const costNum = parseRawNumber(newCustomCost);
    setCustomEvents(prev => [
      ...prev,
      { age: newCustomAge, title: newCustomTitle.trim(), cost: costNum }
    ].sort((a, b) => a.age - b.age));
    setNewCustomTitle('');
    setNewCustomCost('15.000.000');
  };

  const removeCustomEvent = (idx: number) => {
    setCustomEvents(prev => prev.filter((_, i) => i !== idx));
  };

  // Compute actual dynamic annual compound interest based on user allocation percentages
  const getDynamicYield = () => {
    // Allocation rates: Safe (5.5%), Mutual (8.5%), Stocks (12%), Crypto (16%)
    const baseReturn = (
      (allocation.safe * 5.5) + 
      (allocation.mutual * 8.5) + 
      (allocation.stocks * 12.0) + 
      (allocation.crypto * 16.0)
    ) / 100;

    // Apply volatility risk factor
    // Crypto is extremely volatile (+/- 55% swings)
    // Stocks has medium high volatility (+/- 14% swings)
    // Mutual has minor volatility (+/- 3% swings)
    // Safe has 0% volatility
    const volatilityFactor = (
      (allocation.mutual * (Math.random() * 4 - 2)) + 
      (allocation.stocks * (Math.random() * 26 - 13)) + 
      (allocation.crypto * (Math.random() * 110 - 55))
    ) / 100;

    return Math.max(-0.25, (baseReturn + volatilityFactor) / 100); // Floor at -25% max single-year asset loss
  };

  // Run financial grade scorecard analysis
  const calculateFinancialReport = (finalBalance: number, initialSalary: number, hasGoneBankrupt: boolean, totalExpensesPaid: number) => {
    const savingScore = Math.max(10, Math.min(100, Math.round((finalBalance > 0 ? (finalBalance / (initialSalary * 12 * 35)) * 100 : 10))));
    const diversificationScore = Math.round(
      100 - (Math.abs(allocation.safe - 25) + Math.abs(allocation.mutual - 25) + Math.abs(allocation.stocks - 25) + Math.abs(allocation.crypto - 25)) * 0.5
    );
    const emergencyScore = hasGoneBankrupt ? 25 : Math.min(100, Math.round(finalBalance > 50000000 ? 100 : 50));
    
    const overallScore = Math.round((savingScore * 0.5) + (diversificationScore * 0.3) + (emergencyScore * 0.2));
    
    let grade: 'A' | 'B' | 'C' | 'D' | 'E' = 'C';
    let xpEarned = 30;
    
    if (overallScore >= 85 && !hasGoneBankrupt) {
      grade = 'A';
      xpEarned = 150;
    } else if (overallScore >= 70 && !hasGoneBankrupt) {
      grade = 'B';
      xpEarned = 70;
    } else if (overallScore >= 45) {
      grade = 'C';
      xpEarned = 50;
    } else if (overallScore >= 25) {
      grade = 'D';
      xpEarned = 30;
    } else {
      grade = 'E';
      xpEarned = 15;
    }

    return {
      grade,
      savingScore,
      diversificationScore,
      emergencyScore,
      overallScore,
      xpEarned,
      xpClaimed: false
    };
  };

  // Claim XP from report card
  const claimXPFromReport = () => {
    if (!financialReportCard || financialReportCard.xpClaimed) return;
    
    addXp(financialReportCard.xpEarned);
    setFinancialReportCard(prev => prev ? { ...prev, xpClaimed: true } : null);
    
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });
    
    toast.success(`Hooray! +${financialReportCard.xpEarned} XP berhasil diklaim ke profil Anda! 🏆🚀`);
  };

  // INSTANT MODE PROJECTION RUNNER
  const runSimulation = () => {
    setIsSimulating(true);
    setEvents([]);
    setChartData([]);
    setFinalStatus(null);
    setFinancialReportCard(null);
    setShockHistory([]);
    
    let age = currentAge;
    const currentYear = new Date().getFullYear();
    let year = currentYear;
    
    const salaryVal = parseRawNumber(salaryInput);
    let balance = salaryVal * 3; // Emergency fund cushion
    let currentSalary = salaryVal;
    let monthlyExpenses = currentSalary * 0.55; 
    
    let isMarried = false;
    let hasChild = false;
    let hasHouse = false;
    let isLaidOff = false;
    let mortgage = 0;
    
    const newEvents: SimulationEvent[] = [];
    const localChartData: ChartDataPoint[] = [];
    let hasGoneBankrupt = false;
    let failedToBuyHouse = false;
    let totalCustomCostsPaid = 0;
    let totalExpensesSum = 0;

    for (let i = age; i <= 60; i++) {
      let yieldModifier = 0;
      let salaryMod = 0;
      let expenseMod = 0;
      let balanceMod = 0;

      // Random shock event chance (approx 15% rate)
      if (Math.random() < 0.15 && i > currentAge && i < 60) {
        const shockIndex = Math.floor(Math.random() * economicShocks.length);
        const shock = economicShocks[shockIndex];
        const res = shock.apply({ salary: currentSalary, expenses: monthlyExpenses, balance, yieldMod: 0 });
        
        salaryMod = res.salaryMod;
        expenseMod = res.expenseMod;
        yieldModifier = res.yieldMod;
        balanceMod = res.balanceMod;

        newEvents.push({
          year, age: i, type: shock.type,
          message: `GEJOLAK EKONOMI: ${shock.title}. ${res.message}`,
          icon: <AlertTriangle className={`w-5 h-5 ${shock.type === 'danger' ? 'text-rose-500' : 'text-amber-500'}`} />
        });
      }

      const annualIncome = isLaidOff ? 0 : (currentSalary + salaryMod) * 12;
      const annualExpenses = ((monthlyExpenses + expenseMod) * 12) + (mortgage * 12);
      totalExpensesSum += annualExpenses;

      balance += annualIncome + balanceMod;
      balance -= annualExpenses;

      // Process Custom injects
      customEvents.forEach(evt => {
        if (evt.age === i) {
          balance -= evt.cost;
          totalCustomCostsPaid += evt.cost;
          newEvents.push({
            year, age: i, type: 'warning',
            message: `Event Kustom: ${evt.title}. Pengeluaran Rp ${evt.cost.toLocaleString('id-ID')}`,
            icon: <Sparkles className="w-5 h-5 text-indigo-500" />
          });
        }
      });

      // Compounding Dynamic Yields
      const annualYield = getDynamicYield() + yieldModifier;
      if (balance > 0) {
        balance *= (1 + annualYield);
      }

      // Progress raising & inflations
      if (!isLaidOff) {
        currentSalary *= 1.05; 
      }
      monthlyExpenses *= 1.04; 

      // Milestone: Marriage
      if (i === marryAge && !isMarried) {
        isMarried = true;
        balance -= 45000000; 
        monthlyExpenses *= 1.35; 
        newEvents.push({
          year, age: i, type: 'neutral',
          message: 'Milestone Pernikahan. Biaya hidup bertambah 35% akibat menyokong rumah tangga bersama.',
          icon: <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
        });
      }

      // Milestone: Childbirth
      if (i === childAge && !hasChild) {
        hasChild = true;
        balance -= 25000000;
        monthlyExpenses *= 1.25;
        newEvents.push({
          year, age: i, type: 'neutral',
          message: 'Anak Pertama Lahir. Anggaran popok, susu, & imunisasi melonjak pengeluaran.',
          icon: <Baby className="w-5 h-5 text-sky-500" />
        });
      }

      // Milestone: House buying (DP check)
      if (i === houseAge && !hasHouse) {
        const dp = 120000000;
        if (balance >= dp) {
          hasHouse = true;
          balance -= dp;
          mortgage = Math.max(2500000, currentSalary * 0.35);
          newEvents.push({
            year, age: i, type: 'success',
            message: `Membeli Rumah KPR! DP Rp ${dp.toLocaleString('id-ID')} diselesaikan. Cicilan KPR 15 Tahun berjalan.`,
            icon: <Home className="w-5 h-5 text-emerald-500" />
          });
        } else {
          failedToBuyHouse = true;
          newEvents.push({
            year, age: i, type: 'danger',
            message: 'Gagal KPR Rumah! Saldo tabungan Anda tidak mencukupi target uang muka DP Rp 120 Juta.',
            icon: <AlertTriangle className="w-5 h-5 text-rose-500" />
          });
        }
      }

      // KPR Clearances
      if (hasHouse && i === houseAge + 15) {
        mortgage = 0;
        newEvents.push({
          year, age: i, type: 'success',
          message: 'KPR Rumah Lunas Total! Tanggungan bulanan Anda menyusut bebas.',
          icon: <CheckCircle2 className="w-5 h-5 text-teal-500" />
        });
      }

      // Crisis Layoff
      if (i === layoffAge && !isLaidOff) {
        isLaidOff = true;
        currentSalary = 0;
        newEvents.push({
          year, age: i, type: 'danger',
          message: 'Badai Layoff/PHK melanda tempat kerja Anda! Saluran upah utama terhenti.',
          icon: <Briefcase className="w-5 h-5 text-rose-600 animate-pulse" />
        });
      }

      // Layoff recoveries
      if (isLaidOff && i === layoffAge + 2) {
        isLaidOff = false;
        currentSalary = salaryVal * 1.12;
        newEvents.push({
          year, age: i, type: 'neutral',
          message: 'Mendapat panggilan kerja baru. Keuangan berangsur-angsur normal.',
          icon: <Activity className="w-5 h-5 text-indigo-500" />
        });
      }

      // Insolvency
      if (balance < 0 && !hasGoneBankrupt) {
        hasGoneBankrupt = true;
        newEvents.push({
          year, age: i, type: 'danger',
          message: 'Kas Anda minus! Terpaksa berutang konsumtif dengan bunga gila-gilaan.',
          icon: <Skull className="w-5 h-5 text-red-500" />
        });
      }

      localChartData.push({
        age: i,
        balance: Math.round(balance),
        expenses: Math.round(annualExpenses),
        yieldRate: Math.round(annualYield * 100)
      });

      if (i === 60) {
        let retireMessage = '';
        if (balance > 1500000000) {
          retireMessage = 'Pensiun Makmur: Kas kekayaan Anda sangat melimpah untuk menikmati hari tua dengan tenang.';
          newEvents.push({
            year, age: i, type: 'success',
            message: retireMessage,
            icon: <CheckCircle2 className="w-5 h-5 text-teal-500" />
          });
        } else if (balance > 0) {
          retireMessage = 'Pensiun Sederhana: Kekayaan cukup untuk hidup bersahaja. Perlu kontrol ketat pengeluaran medis.';
          newEvents.push({
            year, age: i, type: 'warning',
            message: retireMessage,
            icon: <AlertTriangle className="w-5 h-5 text-amber-500" />
          });
        } else {
          retireMessage = 'Pensiun Pailit: Tabungan Anda lunas. Sangat bergantung pada kiriman anak atau berutang baru.';
          newEvents.push({
            year, age: i, type: 'danger',
            message: retireMessage,
            icon: <Skull className="w-5 h-5 text-rose-600" />
          });
        }
      }

      year++;
    }

    const recs: string[] = [];
    if (hasGoneBankrupt) {
      recs.push("🚨 Arus kas bulanan Anda hancur akibat cicilan konsumtif. Tingkatkan porsi tabungan (saving rate) ke minimal 30% sejak awal berkarir.");
    }
    if (failedToBuyHouse) {
      recs.push("🏠 Rumah gagal dibeli karena DP menipis. Alokasikan portofolio Anda minimal 40% ke Saham/Reksadana untuk mengalahkan inflasi real estate.");
    }
    if (allocation.crypto > 40) {
      recs.push("🪙 Eksposur Kripto Anda terlalu ekstrim! Diversifikasikan minimal 40% ke SBN/Deposito untuk menjaga kestabilan dari crash pasar mendadak.");
    }
    if (totalCustomCostsPaid > 120000000) {
      recs.push("🎁 Pengeluaran kustom gaya hidup sangat boros. Kurangi berbelanja barang konsumtif agar keajaiban bunga majemuk berjalan lancar.");
    }
    if (recs.length === 0) {
      recs.push("🎉 Kombinasi manajemen portofolio yang luar biasa hebat! Pengendalian biaya hidup dan diversifikasi aset Anda patut dijadikan panutan.");
    }

    let prob = 0;
    if (hasGoneBankrupt) prob += 55;
    if (failedToBuyHouse) prob += 15;
    if (allocation.crypto > 45) prob += 25;
    if (balance < 400000000) prob += 15;
    prob = Math.max(5, Math.min(prob + Math.floor(Math.random() * 8), 99));

    setTimeout(() => {
      setEvents(newEvents);
      setChartData(localChartData);
      setFinalStatus(balance > 1500000000 ? 'SUCCESS' : balance > 0 ? 'WARNING' : 'DANGER');
      setBankruptcyProb(prob);
      setRecommendations(recs);
      
      const report = calculateFinancialReport(balance, salaryVal, hasGoneBankrupt, totalExpensesSum);
      setFinancialReportCard(report);
      
      setIsSimulating(false);

      if (balance > 1500000000) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }, 1200);
  };

  // RPG GAME LOGIC
  const startRPGGame = () => {
    const salaryVal = parseRawNumber(salaryInput);
    setRpgStarted(true);
    setRpgAge(currentAge);
    setRpgSalary(salaryVal);
    setRpgBalance(salaryVal * 3); // Cushion
    setRpgExpenses(salaryVal * 0.5);
    setRpgHasInsurance(false);
    setRpgHasHouse(false);
    setRpgMortgage(0);
    setDecisionHistory({});
    setCurrentDecision(null);
    setFinalStatus(null);
    setFinancialReportCard(null);
    setRpgSalaryGrowthModifier(1.05);
    setCurrentShock(null);
    setShockHistory([]);

    const initialChart: ChartDataPoint[] = [{
      age: currentAge,
      balance: salaryVal * 3,
      expenses: Math.round(salaryVal * 0.5 * 12),
      yieldRate: 7
    }];
    setRpgChart(initialChart);

    const initialEvents: SimulationEvent[] = [{
      year: new Date().getFullYear(),
      age: currentAge,
      message: `Memulai karir finansial pada umur ${currentAge} sebagai [${rpgActiveCareer}] dengan gaji Rp ${salaryVal.toLocaleString('id-ID')}/bulan.`,
      type: 'success',
      icon: <Coins className="w-5 h-5 text-emerald-500 animate-spin" />
    }];
    setRpgEvents(initialEvents);

    checkRPGAgeDecision(currentAge);
  };

  const advanceOneYear = () => {
    if (rpgAge >= 60) {
      endRPGGame();
      return;
    }

    const nextAge = rpgAge + 1;
    const currentYear = new Date().getFullYear() + (nextAge - currentAge);
    
    let salary = rpgSalary;
    let expenses = rpgExpenses;
    let balance = rpgBalance;
    let mortgage = rpgMortgage;
    let hasHouse = rpgHasHouse;
    let insurance = rpgHasInsurance;

    const addedEvents: SimulationEvent[] = [];
    setCurrentShock(null);

    // Dynamic yield based on current user allocations
    const annualYield = getDynamicYield();

    // 1. Earn income & Pay living expenses (accumulated annually)
    const annualIncome = salary * 12;
    const annualExpenses = (expenses * 12) + (mortgage * 12);

    balance += annualIncome;
    balance -= annualExpenses;

    // Apply Compounding yield
    if (balance > 0) {
      balance *= (1 + annualYield);
    }

    // Apply growth modifier and inflation
    salary *= rpgSalaryGrowthModifier; 
    expenses *= 1.04; 

    // 2. Random Indonesian Macroeconomic Shock Draw (25% chance)
    if (Math.random() < 0.25 && nextAge < 60) {
      const shockIndex = Math.floor(Math.random() * economicShocks.length);
      const shock = economicShocks[shockIndex];
      const res = shock.apply({ salary, expenses, balance, yieldMod: 0 });
      
      salary += res.salaryMod;
      expenses += res.expenseMod;
      balance += res.balanceMod;
      
      setCurrentShock(shock);
      setShockHistory(prev => [...prev, { age: nextAge, title: shock.title, type: shock.type }]);

      addedEvents.push({
        year: currentYear, age: nextAge, type: shock.type,
        message: `GEJOLAK EKONOMI: ${shock.title}. ${res.message}`,
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />
      });
    }

    // Marriage
    if (nextAge === marryAge) {
      balance -= 45000000;
      expenses *= 1.35;
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'neutral',
        message: 'Resepsi Pernikahan! Menggelar syukuran bersama pasangan. Pengeluaran rumah tangga naik 35%.',
        icon: <Heart className="w-5 h-5 text-rose-500" />
      });
    }

    // Birth of child
    if (nextAge === childAge) {
      balance -= 25000000;
      expenses *= 1.25;
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'neutral',
        message: 'Kelahiran Anak Pertama! Tagihan bulanan popok, popok, susu naik +25%.',
        icon: <Baby className="w-5 h-5 text-sky-500" />
      });
    }

    // House buy DP check
    if (nextAge === houseAge && !hasHouse) {
      const dp = 120000000;
      if (balance >= dp) {
        hasHouse = true;
        balance -= dp;
        mortgage = Math.max(2500000, salary * 0.35);
        addedEvents.push({
          year: currentYear, age: nextAge, type: 'success',
          message: `Membeli Rumah Impian! DP Rp ${dp.toLocaleString('id-ID')} lunas. KPR 15 Tahun berjalan.`,
          icon: <Home className="w-5 h-5 text-emerald-500" />
        });
      } else {
        addedEvents.push({
          year: currentYear, age: nextAge, type: 'danger',
          message: 'Gagal KPR Rumah! Saldo tabungan tidak mencukupi target DP Rp 120 Juta.',
          icon: <AlertTriangle className="w-5 h-5 text-rose-500" />
        });
      }
    }

    // Mortgage clear
    if (hasHouse && nextAge === houseAge + 15) {
      mortgage = 0;
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'success',
        message: 'Cicilan KPR Rumah Lunas Total! Kas bulanan kembali melonggar.',
        icon: <CheckCircle2 className="w-5 h-5 text-teal-500" />
      });
    }

    // Crisis Layoff
    if (nextAge === layoffAge) {
      salary = 0;
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'danger',
        message: 'Krisis global merontokkan startup Anda! Terkena PHK tanpa pesangon layak.',
        icon: <Briefcase className="w-5 h-5 text-rose-600" />
      });
    }

    // Recovery
    if (nextAge === layoffAge + 2) {
      salary = parseRawNumber(salaryInput) * 1.15;
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'success',
        message: 'Selamat! Menemukan posisi baru. Gaji bulanan pulih dan naik +15%.',
        icon: <Activity className="w-5 h-5 text-emerald-500" />
      });
    }

    // Bankruptcy alert
    if (balance < 0) {
      addedEvents.push({
        year: currentYear, age: nextAge, type: 'danger',
        message: 'Rekening darurat Anda nol! Anda terpaksa mengandalkan pinjol berbeban tinggi.',
        icon: <Skull className="w-5 h-5 text-red-500" />
      });
    }

    setRpgAge(nextAge);
    setRpgBalance(balance);
    setRpgSalary(salary);
    setRpgExpenses(expenses);
    setRpgMortgage(mortgage);
    setRpgHasHouse(hasHouse);

    const newChartPoint: ChartDataPoint = {
      age: nextAge,
      balance: Math.round(balance),
      expenses: Math.round(annualExpenses),
      yieldRate: Math.round(annualYield * 100)
    };

    setRpgChart(prev => [...prev, newChartPoint]);
    if (addedEvents.length > 0) {
      setRpgEvents(prev => [...prev, ...addedEvents]);
    }

    checkRPGAgeDecision(nextAge);
  };

  const checkRPGAgeDecision = (age: number) => {
    const decision = rpgDecisions.find(d => d.age === age);
    if (decision) {
      setCurrentDecision(decision);
    } else {
      setCurrentDecision(null);
    }
  };

  const handleRPGDecisionSelect = (optionIndex: number) => {
    if (!currentDecision) return;
    
    const option = currentDecision.options[optionIndex];
    const stats = {
      balance: rpgBalance,
      salary: rpgSalary,
      expenses: rpgExpenses,
      hasInsurance: rpgHasInsurance
    };

    const outcome = option.effect(stats);
    
    const updatedBalance = rpgBalance + outcome.balanceChange;
    const updatedExpenses = rpgExpenses + outcome.expensesChange;
    const updatedSalary = rpgSalary + outcome.salaryChange;
    const updatedInsurance = outcome.hasInsurance !== undefined ? outcome.hasInsurance : rpgHasInsurance;

    if (outcome.customModifier) {
      outcome.customModifier(stats);
    }

    setRpgBalance(updatedBalance);
    setRpgExpenses(updatedExpenses);
    setRpgSalary(updatedSalary);
    setRpgHasInsurance(updatedInsurance);

    setDecisionHistory(prev => ({
      ...prev,
      [currentDecision.age]: option.text
    }));

    const currentYear = new Date().getFullYear() + (currentDecision.age - currentAge);
    const newEvent: SimulationEvent = {
      year: currentYear,
      age: currentDecision.age,
      message: `Pilihan Hidup Anda: "${option.text}". Efek: ${outcome.log}`,
      type: outcome.balanceChange < -30000000 ? 'danger' : 'success',
      icon: <Award className="w-5 h-5 text-indigo-500" />
    };

    setRpgEvents(prev => [...prev, newEvent]);
    setCurrentDecision(null);

    setRpgChart(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      const lastIdx = copy.length - 1;
      copy[lastIdx] = {
        ...copy[lastIdx],
        balance: Math.round(updatedBalance)
      };
      return copy;
    });
  };

  const endRPGGame = () => {
    setRpgStarted(false);
    
    let prob = 0;
    if (rpgBalance < 0) prob += 65;
    if (rpgBalance < 500000000) prob += 20;
    if (!rpgHasInsurance) prob += 15;
    prob = Math.max(5, Math.min(prob + Math.floor(Math.random() * 8), 99));
    
    setBankruptcyProb(prob);
    setEvents(rpgEvents);
    setChartData(rpgChart);
    setFinalStatus(rpgBalance > 1500000000 ? 'SUCCESS' : rpgBalance > 0 ? 'WARNING' : 'DANGER');

    const totalExpEstimate = rpgExpenses * 12 * 35;
    const report = calculateFinancialReport(rpgBalance, parseRawNumber(salaryInput), rpgBalance < 0, totalExpEstimate);
    setFinancialReportCard(report);

    const recs: string[] = [];
    if (rpgBalance < 0) {
      recs.push("🚨 Sesi simulasi berakhir bangkrut. Hindari paylater gadget mahal dan cicilan MPV SUV baru di awal tahun karir Anda.");
    } else if (rpgBalance < 500000000) {
      recs.push("⚖️ Anda bertahan hidup namun tabungan pensiun Anda mepet. Pilihlah alokasi 35% di Saham IHSG demi pertumbuhan tabungan jangka panjang.");
    } else {
      recs.push("🎉 Strategi master finansial! Keputusan Anda menunda paylater serta andal melunasi mobil bekas cash mengantar kekayaan optimal.");
    }
    setRecommendations(recs);

    if (rpgBalance > 1500000000) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Page Header */}
        <PageHeader
          category="Simulasi"
          title="Financial Life Simulator 3.0"
          description="Pecahkan simulasi realita kehidupan finansial di Indonesia. Alokasikan instrumen investasimu, lalu uji ketahanan finansialmu dari teror gejolak ekonomi!"
          badge="GAME REALITA"
        />

        <div className="mb-6 relative">
          {/* MODE CHANGER */}
          <div className="flex justify-center mt-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 flex gap-1 shadow-lg">
              <button
                type="button"
                onClick={() => {
                  setIsInteractiveMode(false);
                  setRpgStarted(false);
                  setFinancialReportCard(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${!isInteractiveMode ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
              >
                <TrendingUp className="w-4 h-4" /> Mode Instan (Grafik)
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsInteractiveMode(true);
                  setFinancialReportCard(null);
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${isInteractiveMode ? 'bg-rose-600 text-white shadow-sm shadow-rose-500/20' : 'text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-450'}`}
              >
                <Compass className="w-4 h-4" /> Mode RPG Interaktif 🎮
              </button>
            </div>
          </div>
        </div>

        {/* INTEGRATED ASSET ALLOCATION DASHBOARD PANEL */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 md:p-8 mb-8 shadow-lg relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-150 dark:border-slate-800 mb-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-5 h-5 text-rose-500" /> Pengaturan Alokasi Portofolio Investasi
              </h3>
              <p className="text-xs text-slate-400 font-medium mt-1">Ubah persentase tabungan bulanan yang dialokasikan ke instrumen investasi berikut. Hasil total harus tepat 100%.</p>
            </div>
            
            {/* Allocation presets pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {[
                { id: 'konservatif', label: '🛡️ Konservatif' },
                { id: 'moderat', label: '⚖️ Moderat' },
                { id: 'agresif', label: '🚀 Agresif' },
                { id: 'yolo', label: '🎰 Kripto YOLO' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => applyAllocPreset(p.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${allocPreset === p.id ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-300 border border-slate-250 dark:border-slate-800'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Item 1: Deposito / SBN */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-850 dark:text-slate-200">🏦 Deposito & SBN</span>
                <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">{allocation.safe}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 font-medium">Bunga 5.5% • Risiko: 0% (Dijamin Negara)</p>
              <input 
                type="range" min="0" max="100" value={allocation.safe}
                onChange={e => handleAllocationChange('safe', Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>

            {/* Item 2: Reksadana */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-850 dark:text-slate-200">📈 Reksadana Obligasi</span>
                <span className="text-xs font-black font-mono text-teal-600 dark:text-teal-400">{allocation.mutual}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 font-medium">Hasil 8.5% • Volatilitas Ringan (+/- 3%)</p>
              <input 
                type="range" min="0" max="100" value={allocation.mutual}
                onChange={e => handleAllocationChange('mutual', Number(e.target.value))}
                className="w-full accent-teal-500"
              />
            </div>

            {/* Item 3: Saham IHSG */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-850 dark:text-slate-200">🏢 Saham IHSG / Blue Chip</span>
                <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">{allocation.stocks}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 font-medium">Hasil 12% • Volatilitas Sedang (+/- 14%)</p>
              <input 
                type="range" min="0" max="100" value={allocation.stocks}
                onChange={e => handleAllocationChange('stocks', Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Item 4: Kripto */}
            <div className="bg-slate-50 dark:bg-slate-950/40 border border-slate-150 dark:border-slate-850 p-4 rounded-2xl relative">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-black text-slate-850 dark:text-slate-200">🪙 Kripto / Spekulatif</span>
                <span className="text-xs font-black font-mono text-rose-600 dark:text-rose-455">{allocation.crypto}%</span>
              </div>
              <p className="text-[10px] text-slate-400 mb-3 font-medium">Hasil 16% • Volatilitas Ekstrim (+/- 55%)</p>
              <input 
                type="range" min="0" max="100" value={allocation.crypto}
                onChange={e => handleAllocationChange('crypto', Number(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] font-mono font-bold text-slate-450 uppercase border-t border-slate-100 dark:border-slate-800 pt-3">
            <span>Alokasi Gabungan: <strong className="text-slate-800 dark:text-white">{(allocation.safe + allocation.mutual + allocation.stocks + allocation.crypto)}%</strong></span>
            <span>Volatilitas Domestik: <span className={allocation.crypto > 40 ? 'text-rose-500 animate-pulse' : 'text-emerald-500'}>{allocation.crypto > 40 ? '🔴 EKSTRIM SPEKULATIF' : '🟢 REKOMENDASI LIGA'}</span></span>
          </div>
        </div>

        {/* ========================================================
            MODE 1: INSTANT CHARTS SIMULATOR
           ======================================================== */}
        {!isInteractiveMode && (
          <>
            {/* Career Presets List */}
            <div className="mb-10">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" /> Skenario Profil Kehidupan (Preset)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {presets.map((preset, idx) => (
                  <div 
                    key={idx}
                    onClick={() => applyPreset(preset)}
                    className="bg-white dark:bg-slate-900 border border-slate-200 hover:border-rose-500 dark:border-slate-800 dark:hover:border-rose-500 rounded-2xl p-4 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between text-left relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{preset.emoji}</span>
                        <span className="text-[8px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-600 dark:text-slate-300 group-hover:bg-rose-500 group-hover:text-white transition-colors">PILIH</span>
                      </div>
                      <h4 className="font-extrabold text-slate-900 dark:text-white text-xs mb-1 group-hover:text-rose-500 truncate">{preset.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium line-clamp-2">{preset.desc}</p>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-800/80 mt-3 pt-2 text-[8px] font-mono font-black text-slate-400">
                      Rp {preset.salary.toLocaleString('id-ID')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column Parameters */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-rose-500" /> Variabel Milestones Kehidupan
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Umur Sekarang (th)</label>
                        <input 
                          type="number" value={currentAge} onChange={e => setCurrentAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Gaji Bulanan (Rp)</label>
                        <input 
                          type="text" value={salaryInput} onChange={e => setSalaryInput(formatRupiah(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Menikah di Umur</label>
                        <input 
                          type="number" value={marryAge} onChange={e => setMarryAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Punya Anak di Umur</label>
                        <input 
                          type="number" value={childAge} onChange={e => setChildAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Beli Rumah di Umur</label>
                        <input 
                          type="number" value={houseAge} onChange={e => setHouseAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">PHK / Krisis di Umur</label>
                        <input 
                          type="number" value={layoffAge} onChange={e => setLayoffAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 dark:from-white dark:to-slate-200 dark:hover:from-slate-100 dark:hover:to-slate-300 text-white dark:text-slate-900 font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 shadow-xl hover:shadow-2xl cursor-pointer text-xs uppercase tracking-widest relative overflow-hidden"
                      >
                        {isSimulating ? <RotateCcw className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                        {isSimulating ? 'MEMPROSES REALITA...' : 'PROYEKSI JALAN TENTANG KAS'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inject custom life costs */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Plus className="w-4 h-4 text-rose-500" /> Tambah Pengeluaran Besar Kustom
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">Suntikkan beban keuangan lokal (Haji/Umrah, cicilan motor baru, renovasi rumah) di umur tertentu.</p>

                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Umur Event</label>
                        <input 
                          type="number" value={newCustomAge} onChange={e => setNewCustomAge(Number(e.target.value))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-bold focus:outline-none focus:border-rose-500 font-mono text-base sm:text-xs text-center"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Nama Pengeluaran</label>
                        <input 
                          type="text" value={newCustomTitle} onChange={e => setNewCustomTitle(e.target.value)}
                          placeholder="Contoh: Naik Umrah"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 text-base sm:text-xs font-bold focus:outline-none focus:border-rose-500"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Estimasi Total Biaya (Rp)</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" value={newCustomCost} onChange={e => setNewCustomCost(formatRupiah(e.target.value))}
                          className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2 font-mono text-base sm:text-xs font-bold focus:outline-none focus:border-rose-500"
                        />
                        <button 
                          type="button"
                          onClick={addCustomEvent}
                          className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-extrabold rounded-lg text-xs transition-colors cursor-pointer"
                        >
                          TAMBAH
                        </button>
                      </div>
                    </div>
                  </div>

                  {customEvents.length > 0 && (
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-3 space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                      {customEvents.map((evt, idx) => (
                        <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850">
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{evt.title}</p>
                            <p className="text-[10px] text-slate-400 font-bold font-mono">Umur {evt.age} th • Rp {evt.cost.toLocaleString('id-ID')}</p>
                          </div>
                          <button 
                            onClick={() => removeCustomEvent(idx)}
                            className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column Output Projection */}
              <div className="lg:col-span-7 space-y-6">
                {events.length === 0 && (
                  <div className="bg-slate-100 dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                    <Activity className="w-12 h-12 text-slate-400 mb-4 opacity-50 animate-pulse" />
                    <h3 className="text-slate-500 font-bold font-display">Simulasi Belum Dijalankan</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs leading-relaxed">
                      Tekan tombol "Jalankan Simulasi" di sebelah kiri untuk menghitung dan memproyeksikan kurva keuangan Anda hingga masa pensiun di umur 60 tahun.
                    </p>
                  </div>
                )}
                
                {isSimulating && (
                  <div className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-full min-h-[500px] flex flex-col items-center justify-center text-center p-8">
                    <div className="w-16 h-16 border-4 border-slate-200 border-t-rose-500 dark:border-slate-700 dark:border-t-white rounded-full animate-spin mb-4"></div>
                    <h3 className="text-slate-900 dark:text-white font-black animate-pulse font-display">MENGKALIBRASI PROYEKSI FINANSIAL...</h3>
                    <p className="text-xs text-slate-400 mt-2 font-mono">Menghitung return volatilitas portofolio dan merangkai data makro...</p>
                  </div>
                )}

                {!isSimulating && events.length > 0 && (
                  <div className="space-y-6">
                    
                    {/* Final report card panel */}
                    <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-slate-800">
                      <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-rose-500 to-amber-500/20 blur-3xl rounded-full"></div>
                      
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">STATUS AKHIR SIMULASI (UMUR 60)</p>
                          <h4 className="text-2xl sm:text-3xl font-black font-display mt-1">Status: {
                            finalStatus === 'SUCCESS' ? '🟢 SEJAHTERA & MAKMUR' :
                            finalStatus === 'WARNING' ? '🟡 SEDERHANA & AMAN' : '🔴 PAILIT / BANGKRUT'
                          }</h4>
                        </div>

                        {/* Report grade badge */}
                        {financialReportCard && (
                          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-amber-400 to-rose-500 rounded-2xl flex flex-col items-center justify-center shadow-lg transform rotate-6">
                            <span className="text-[8px] font-mono font-black text-white leading-none uppercase">GRADE</span>
                            <span className="text-xl sm:text-2xl font-black text-white leading-none mt-0.5">{financialReportCard.grade}</span>
                          </div>
                        )}
                      </div>

                      {/* Score metrics bento layout */}
                      {financialReportCard && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-950/40 border border-slate-800/80 p-4 rounded-2xl mb-6">
                          <div className="text-center">
                            <span className="block text-[8px] font-mono font-black text-slate-400 uppercase">SAVING RATE</span>
                            <span className="block text-base font-mono font-black text-emerald-400 mt-0.5">{financialReportCard.savingScore}/100</span>
                          </div>
                          <div className="text-center border-l border-slate-800">
                            <span className="block text-[8px] font-mono font-black text-slate-400 uppercase">DIVERSIFIKASI</span>
                            <span className="block text-base font-mono font-black text-indigo-400 mt-0.5">{financialReportCard.diversificationScore}/100</span>
                          </div>
                          <div className="text-center border-l border-slate-800">
                            <span className="block text-[8px] font-mono font-black text-slate-400 uppercase">REKENING DARURAT</span>
                            <span className="block text-base font-mono font-black text-amber-400 mt-0.5">{financialReportCard.emergencyScore}/100</span>
                          </div>
                          <div className="text-center border-l border-slate-800">
                            <span className="block text-[8px] font-mono font-black text-slate-400 uppercase">TOTAL SKOR</span>
                            <span className="block text-base font-mono font-black text-rose-455 mt-0.5">{financialReportCard.overallScore}/100</span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-5">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Probabilitas Bangkrut</p>
                          <p className="text-3xl font-black text-rose-500 font-mono mt-1">{bankruptcyProb}%</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Rekomendasi Utama</p>
                          <p className="text-xs font-semibold text-slate-200 mt-1.5 leading-relaxed">{recommendations[0]}</p>
                        </div>
                      </div>

                      {/* Gamification reward link */}
                      {financialReportCard && (
                        <div className="mt-6 border-t border-dashed border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-400 animate-bounce" />
                            <span className="text-xs text-slate-350">
                              Dapatkan hadiah <strong className="text-amber-400">+{financialReportCard.xpEarned} XP</strong> untuk meluncurkan posisi ranking-mu!
                            </span>
                          </div>
                          <button
                            onClick={claimXPFromReport}
                            disabled={financialReportCard.xpClaimed}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md ${financialReportCard.xpClaimed ? 'bg-slate-800 text-slate-500 border border-slate-700 shadow-none cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-black cursor-pointer shadow-amber-500/10'}`}
                          >
                            {financialReportCard.xpClaimed ? 'HADIAH SUDAH DIKLAIM' : 'KLAIM HADIAH XP'}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Area Growth Chart Recharts */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-sm">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-rose-500 animate-pulse" /> Kurva Proyeksi Likuiditas & Volatilitas Aset
                      </h4>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.35}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="age" stroke="#94a3b8" fontSize={11} tickLine={false} />
                            <YAxis 
                              stroke="#94a3b8" 
                              fontSize={10} 
                              tickLine={false} 
                              tickFormatter={(val) => `Rp ${(val/1000000).toFixed(0)}Jt`} 
                            />
                            <Tooltip 
                              formatter={(value: any) => `Rp ${Number(value).toLocaleString('id-ID')}`}
                              labelFormatter={(label) => `Umur ${label} Tahun`}
                              contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff' }}
                            />
                            <Area type="monotone" dataKey="balance" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBalance)" name="Kas Likuiditas Tabungan" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold font-mono mt-3 text-center uppercase tracking-wider">
                        Grafik diatas menghitung return majemuk berbobot portofolio {(allocation.safe * 5.5 + allocation.mutual * 8.5 + allocation.stocks * 12 + allocation.crypto * 16) / 100}% pertahun & inflasi biaya hidup 4%
                      </p>
                    </div>

                    {/* Simulation timeline lists */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm overflow-hidden relative">
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-6 border-b border-slate-150 dark:border-slate-800 pb-3">Timeline Sejarah Perjalanan</h3>
                      
                      <div className="relative pl-8 space-y-6 before:absolute before:inset-y-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                        {events.map((ev, idx) => (
                          <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.04 }}
                            className="relative"
                          >
                            <div className="absolute -left-8 w-7 h-7 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center z-10">
                              <div className="w-1.5 h-1.5 bg-rose-500 rounded-full"></div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                              <div className="shrink-0 text-right mt-1">
                                <span className="block text-sm font-black text-slate-900 dark:text-white leading-none font-mono">{ev.year}</span>
                                <span className="text-[9px] font-bold text-slate-500 uppercase font-mono">Umur {ev.age}</span>
                              </div>
                              
                              <div className={`p-4 rounded-2xl flex-1 border ${
                                ev.type === 'danger' ? 'bg-rose-50/50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50' : 
                                ev.type === 'warning' ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50' :
                                ev.type === 'success' ? 'bg-teal-50/50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/50' :
                                'bg-slate-50 border-slate-200 dark:bg-slate-800/50 dark:border-slate-700'
                              }`}>
                                <div className="flex items-start gap-3">
                                  <div className="mt-0.5">{ev.icon}</div>
                                  <p className={`text-xs font-bold leading-relaxed ${
                                    ev.type === 'danger' ? 'text-rose-900 dark:text-rose-200' : 
                                    ev.type === 'warning' ? 'text-amber-900 dark:text-amber-200' :
                                    ev.type === 'success' ? 'text-teal-900 dark:text-teal-200' :
                                    'text-slate-700 dark:text-slate-300'
                                  }`}>{ev.message}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ========================================================
            MODE 2: INTERACTIVE RPG GAME
           ======================================================== */}
        {isInteractiveMode && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            {!rpgStarted && finalStatus === null && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-48 h-48 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/40 rounded-3xl flex items-center justify-center mx-auto text-rose-500 animate-pulse">
                  <Compass className="w-10 h-10" />
                </div>
                <div className="max-w-lg mx-auto">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white font-display mb-2">Pilih Jalur Karir RPG Anda</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Setiap karakter membawa back-story, UMR awal, dan parameter tabungan darurat berbeda. Ambil keputusan kunci finansial sepanjang hidupmu hingga pensiun di umur 60!
                  </p>
                </div>

                {/* Grid selection list of careers */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto text-left pt-2">
                  {[
                    { id: 'Generasi Sandwich', title: '🥪 Generasi Sandwich', wage: 4700000, desc: 'Beban ortu tinggi, asuransi nol' },
                    { id: 'PNS Idaman', title: '👔 PNS Idaman Mertua', wage: 7500000, desc: 'Aman mutlak, pensiun pasti' },
                    { id: 'Sultan Tech Bro', title: '⚡ Sultan Tech Bro', wage: 19000000, desc: 'Gaji gemuk, gaya hidup fomo' },
                    { id: 'Content Creator Viral', title: '📹 Content Creator', wage: 12000000, desc: 'Bisa viral atau kena cancel' },
                    { id: 'Wirausaha Kuliner', title: '👩‍🍳 Kuliner Solo', wage: 3500000, desc: 'Fokus ekspansi warung makan' },
                    { id: 'Pekerja Gig', title: '🛵 Driver Ojol', wage: 4500000, desc: 'Fisik capek, bensin fluktuatif' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setRpgActiveCareer(c.id);
                        setSalaryInput(c.wage.toLocaleString('id-ID'));
                        
                        // Apply matching allocations preset
                        if (c.id === 'Sultan Tech Bro' || c.id === 'Content Creator Viral') {
                          applyAllocPreset('agresif');
                        } else if (c.id === 'Generasi Sandwich' || c.id === 'Pekerja Gig') {
                          applyAllocPreset('konservatif');
                        } else {
                          applyAllocPreset('moderat');
                        }
                      }}
                      className={`p-4 rounded-2xl border transition-all text-left cursor-pointer ${rpgActiveCareer === c.id ? 'bg-rose-500/10 border-rose-500 shadow-sm' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
                    >
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white leading-none">{c.title}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-1.5">Gaji Pokok: Rp {c.wage.toLocaleString('id-ID')}/bln</p>
                      <p className="text-[9px] text-slate-400 mt-1 italic">{c.desc}</p>
                    </button>
                  ))}
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850 inline-block text-left text-xs space-y-2 max-w-md">
                  <p className="font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" /> Jaring Pengaman Simulasi:
                  </p>
                  <ul className="list-disc list-inside text-slate-500 space-y-1">
                    <li>Karakter: <strong className="text-rose-500 font-black">{rpgActiveCareer}</strong></li>
                    <li>Tabungan Darurat awal: setara 3x gaji pertama</li>
                    <li>Setiap tahun ada penyesuaian kenaikan gaji rutin & inflasi</li>
                    <li>Suku bunga investasi majemuk dikalkulasikan berbobot</li>
                  </ul>
                </div>

                <div>
                  <button
                    onClick={startRPGGame}
                    className="px-8 py-4 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black rounded-2xl text-sm transition-all shadow-xl shadow-rose-600/25 active:scale-95 uppercase tracking-widest cursor-pointer"
                  >
                    🎮 Mulai Skenario Karakter
                  </button>
                </div>
              </div>
            )}

            {/* RPG Game Board Active */}
            {rpgStarted && (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column HUD */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 p-6 shadow-2xl relative overflow-hidden space-y-5">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-3">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">STATUS INTERAKTIF</p>
                        <h4 className="text-xl font-black text-slate-900 dark:text-white font-display">Umur: {rpgAge} Tahun</h4>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-0.5 shadow-lg shadow-rose-500/20">
      <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-xl">🧑‍💻</div>
    </div>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Arus Saldo Likuid (Net Worth)</p>
                        <h3 className={`text-2xl font-black font-mono mt-0.5 ${rpgBalance >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                          Rp {Math.round(rpgBalance).toLocaleString('id-ID')}
                        </h3>
                      </div>

                      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-850 pt-3">
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Gaji Bulanan</p>
                          <p className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                            Rp {Math.round(rpgSalary).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Biaya Hidup</p>
                          <p className="text-sm font-black text-slate-700 dark:text-slate-300 font-mono mt-0.5">
                            Rp {Math.round(rpgExpenses).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-850 pt-3 flex flex-wrap gap-2">
                        {rpgHasInsurance && (
                          <span className="text-[9px] font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Asuransi Aktif
                          </span>
                        )}
                        {rpgHasHouse && (
                          <span className="text-[9px] font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <Home className="w-3.5 h-3.5" /> Rumah Milik
                          </span>
                        )}
                        {rpgMortgage > 0 && (
                          <span className="text-[9px] font-black bg-rose-500/10 text-rose-600 dark:text-rose-450 px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" /> Cicilan KPR Aktif
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RPG live chart mini */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
                    <p className="text-[10px] font-black text-slate-450 uppercase tracking-widest font-mono mb-2">Live Net Worth Curve</p>
                    <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rpgChart}>
                          <defs>
                            <linearGradient id="colorRpg" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#ec4899" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="age" stroke="#94a3b8" fontSize={9} tickLine={false} />
                          <Area type="monotone" dataKey="balance" stroke="#ec4899" strokeWidth={1.5} fill="url(#colorRpg)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Right Column Board Decisions */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Active Decision card prompt */}
                  <AnimatePresence mode="wait">
                    {currentDecision ? (
                      <motion.div
                        key={currentDecision.age}
                        initial={{ opacity: 0, scale: 0.95, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -15 }}
                        className="bg-gradient-to-r from-rose-500 to-amber-500 p-0.5 rounded-3xl shadow-xl overflow-hidden"
                      >
                        <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 space-y-5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black bg-rose-500 text-white px-2.5 py-1 rounded-lg font-mono">PILIHAN KUNCI HIDUP</span>
                            <span className="text-xs font-extrabold text-slate-400">Umur {currentDecision.age} Tahun</span>
                          </div>
                          
                          <div className="space-y-1.5">
                            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-display leading-tight">{currentDecision.title}</h3>
                            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">{currentDecision.description}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-3 pt-3">
                            {currentDecision.options.map((opt, oIdx) => (
                              <button
                                key={oIdx}
                                onClick={() => handleRPGDecisionSelect(oIdx)}
                                className="w-full text-left p-4 rounded-2xl bg-slate-50 hover:bg-rose-500/5 dark:bg-slate-950 dark:hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 hover:border-rose-500 dark:hover:border-rose-500 transition-all font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-center justify-between group cursor-pointer"
                              >
                                <span>{opt.text}</span>
                                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="space-y-4">
                        {/* Shocks banner indicator if active */}
                        {currentShock && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={`p-5 rounded-3xl border flex items-start gap-4 ${currentShock.type === 'danger' ? 'bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 text-rose-900 dark:text-rose-200' : currentShock.type === 'success' ? 'bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/50 text-teal-900 dark:text-teal-200' : 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/50 text-amber-900 dark:text-amber-200'}`}
                          >
                            <span className="text-3xl shrink-0">{currentShock.emoji}</span>
                            <div>
                              <h4 className="font-extrabold text-sm uppercase font-mono">GEJOLAK EKONOMI: {currentShock.title}</h4>
                              <p className="text-xs mt-1 leading-relaxed">{currentShock.description}</p>
                              <p className="text-[10px] font-black mt-2 uppercase tracking-wide text-rose-600 dark:text-rose-400">Efek Makro: {currentShock.effectText}</p>
                            </div>
                          </motion.div>
                        )}

                        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm text-center space-y-4">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center mx-auto text-rose-500 animate-float">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div className="max-w-md mx-auto space-y-1">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm">Tidak ada kejutan khusus tahun ini</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Bunga investasi portofoliomu berjalan otomatis.</p>
                          </div>
                          
                          <div>
                            <button
                              onClick={advanceOneYear}
                              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 mx-auto cursor-pointer shadow-md"
                            >
                              Maju Ke Tahun Berikutnya <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>

                  {/* Log travels list */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3">LOG PERJALANAN</h3>
                    
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {rpgEvents.slice().reverse().map((ev, idx) => (
                        <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                          <span className="font-bold text-slate-400 font-mono shrink-0">Th {ev.age}:</span>
                          <p className="text-slate-600 dark:text-slate-350 font-semibold">{ev.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* RPG Game completed / Screen results */}
            {!rpgStarted && finalStatus !== null && (
              <div className="space-y-8 animate-fade-in">
                <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl text-center relative overflow-hidden border border-slate-800">
                  <div className="absolute top-0 right-0 w-60 h-60 bg-gradient-to-br from-pink-500 to-rose-600/20 blur-3xl rounded-full"></div>
                  
                  <div className="max-w-xl mx-auto space-y-4 relative z-10">
                    <span className="text-4xl">🏆</span>
                    <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight leading-none">Simulasi Selesai di Umur 60!</h2>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-mono">STATUS PENSIUN KARAKTER ANDA</p>
                    
                    <h3 className="text-2xl sm:text-3xl font-black font-display text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                      {finalStatus === 'SUCCESS' ? '🟢 SEJAHTERA & MEWAH' :
                       finalStatus === 'WARNING' ? '🟡 SEDERHANA & AMAN' : '🔴 PAILIT / BANGKRUT'}
                    </h3>

                    {/* Report card bento for RPG */}
                    {financialReportCard && (
                      <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-3xl my-6 space-y-4 max-w-md mx-auto">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                          <span className="text-xs font-black font-mono text-slate-400 uppercase">RAPOR KEUANGAN</span>
                          <span className="bg-rose-500 text-white font-mono font-black text-xs px-2.5 py-0.5 rounded">GRADE {financialReportCard.grade}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div>
                            <span className="block text-[8px] font-bold text-slate-400 uppercase">TABUNGAN</span>
                            <span className="block text-sm font-mono font-black text-emerald-400 mt-0.5">{financialReportCard.savingScore}/100</span>
                          </div>
                          <div className="border-l border-slate-850">
                            <span className="block text-[8px] font-bold text-slate-400 uppercase">DIVERSIFIKASI</span>
                            <span className="block text-sm font-mono font-black text-indigo-400 mt-0.5">{financialReportCard.diversificationScore}/100</span>
                          </div>
                          <div className="border-l border-slate-850">
                            <span className="block text-[8px] font-bold text-slate-400 uppercase">DARURAT</span>
                            <span className="block text-sm font-mono font-black text-amber-400 mt-0.5">{financialReportCard.emergencyScore}/100</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-medium">
                          Skor Kumulatif Finansial: <strong className="text-white font-mono">{financialReportCard.overallScore}%</strong>
                        </div>
                        
                        {/* Gamification claim */}
                        <div className="pt-2">
                          <button
                            onClick={claimXPFromReport}
                            disabled={financialReportCard.xpClaimed}
                            className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${financialReportCard.xpClaimed ? 'bg-slate-800 text-slate-500 border border-slate-750 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'}`}
                          >
                            {financialReportCard.xpClaimed ? 'HADIAH XP SUDAH DIKLAIM' : `KLAIM HADIAH +${financialReportCard.xpEarned} XP`}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Aset Kas Akhir</p>
                        <p className="text-xl sm:text-2xl font-black text-emerald-400 font-mono mt-1">
                          Rp {Math.round(rpgBalance).toLocaleString('id-ID')}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Probabilitas Bangkrut</p>
                        <p className="text-xl sm:text-2xl font-black text-rose-500 font-mono mt-1">{bankruptcyProb}%</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 italic pt-4 leading-relaxed font-semibold">
                      "{recommendations[0]}"
                    </p>

                    <div className="pt-4">
                      <button
                        onClick={startRPGGame}
                        className="px-6 py-3 bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all hover:bg-slate-100 cursor-pointer shadow-lg"
                      >
                        🔄 Main Lagi / Coba Karir Lain
                      </button>
                    </div>
                  </div>
                </div>

                {/* RPG decisions summary */}
                {Object.keys(decisionHistory).length > 0 && (
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-3">
                      Keputusan Kunci Kehidupan yang Diambil:
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.keys(decisionHistory).map((ageKey) => {
                        const dAge = Number(ageKey);
                        const decObj = rpgDecisions.find(d => d.age === dAge);
                        return (
                          <div key={ageKey} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-150 dark:border-slate-850">
                            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">PILIHAN UMUR {dAge} TAHUN</span>
                            <h4 className="font-extrabold text-slate-850 dark:text-slate-200 text-xs mt-1">{decObj?.title}</h4>
                            <p className="text-xs text-rose-600 dark:text-rose-455 font-bold mt-2">
                              &rarr; "{decisionHistory[dAge]}"
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
