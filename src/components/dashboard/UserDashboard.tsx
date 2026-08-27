import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, BookOpen, Target, Activity, TrendingUp, ArrowRight, Plus, 
  Minus, RefreshCw, Award, Compass, Heart, ShieldCheck, Zap, AlertCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FinancialHealthCard } from './FinancialHealthCard';
import { QuestsWidget } from './QuestsWidget';
import { FinancialProfileModal } from './FinancialProfileModal';
import { PageHeader } from '../PageHeader';
import { FinancialProfile } from '../../types/financial';
import { DEFAULT_FINANCIAL_PROFILE } from '../../lib/financialHealth';

interface ManualAsset {
  id: string;
  symbol: string;
  name: string;
  type: string;
  buyPrice: number;
  currentPrice: number;
  shares: number;
}

interface FinancialTarget {
  name: string;
  targetAmount: number;
  currentSaved: number;
  category: string;
}

interface ActivityLog {
  id: string;
  type: 'belajar' | 'simulasi' | 'keuangan' | 'komunitas';
  title: string;
  desc: string;
  timestamp: string;
}

export function UserDashboard() {
  const { user, completeModule } = useAuth();
  const navigate = useNavigate();

  // Financial Profile State
  const [finProfile, setFinProfile] = useState<FinancialProfile>(DEFAULT_FINANCIAL_PROFILE);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Financial States
  const [netWorth, setNetWorth] = useState<number>(12500000);
  const [cashBalance, setCashBalance] = useState<number>(3500000);
  const [assetsTotal, setAssetsTotal] = useState<number>(9000000);
  const [priceStatus, setPriceStatus] = useState<'real-time' | 'simulasi'>('real-time');

  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('sikaya_fin_profile');
    if (saved) {
      try {
        setFinProfile(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const handleSaveProfile = (updated: FinancialProfile) => {
    setFinProfile(updated);
    localStorage.setItem('sikaya_fin_profile', JSON.stringify(updated));
    setShowProfileModal(false);
  };
  
  // Custom Target State
  const [target, setTarget] = useState<FinancialTarget | null>(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targetNameInput, setTargetNameInput] = useState('');
  const [targetAmountInput, setTargetAmountInput] = useState('');
  const [targetSavedInput, setTargetSavedInput] = useState('');
  const [targetCategory, setTargetCategory] = useState('Gadget');
  const [addSavingsAmount, setAddSavingsAmount] = useState('');
  const [showAddSavingsInput, setShowAddSavingsInput] = useState(false);

  // Recent Activity Logs
  const [activities, setActivities] = useState<ActivityLog[]>([]);

  // Load Data
  useEffect(() => {
    // 1. Calculate assets from localStorage
    const savedAssets = localStorage.getItem('sikaya_manual_assets');
    const savedVirtual = localStorage.getItem('sikaya_virtual_investments');
    let calcAssetsTotal = 0;

    if (savedAssets) {
      try {
        const parsed = JSON.parse(savedAssets);
        parsed.forEach((asset: ManualAsset) => {
          calcAssetsTotal += (asset.currentPrice || asset.buyPrice) * asset.shares;
        });
      } catch (e) {
        console.error("Failed to parse manual assets", e);
      }
    } else {
      // Setup mock assets if none exist for a cool rich initial view
      const initialAssets = [
        { id: '1', symbol: 'BBRI', name: 'Bank Rakyat Indonesia', type: 'Saham', buyPrice: 4800, currentPrice: 4950, shares: 1000 },
        { id: '2', symbol: 'BTC', name: 'Bitcoin', type: 'Kripto', buyPrice: 950000000, currentPrice: 980000000, shares: 0.002 }
      ];
      localStorage.setItem('sikaya_manual_assets', JSON.stringify(initialAssets));
      calcAssetsTotal = 4950000 + 1960000;
    }

    // Load virtual simulator balance
    let simulatorCash = 10000000;
    const savedSimCash = localStorage.getItem('sikaya_virtual_cash');
    if (savedSimCash) {
      simulatorCash = Number(savedSimCash);
    } else {
      localStorage.setItem('sikaya_virtual_cash', '10000000');
    }

    setCashBalance(simulatorCash);
    setAssetsTotal(calcAssetsTotal);
    setNetWorth(simulatorCash + calcAssetsTotal);

    // Dynamic price status fallback
    const savedStatus = localStorage.getItem('sikaya_price_status');
    if (savedStatus) {
      setPriceStatus(savedStatus as 'real-time' | 'simulasi');
    } else {
      setPriceStatus('real-time');
    }

    // 2. Load Target
    const savedTarget = localStorage.getItem('sikaya_financial_target');
    if (savedTarget) {
      try {
        setTarget(JSON.parse(savedTarget));
      } catch (e) {
        console.error("Failed to parse financial target", e);
      }
    } else {
      // Default initial goal
      const defaultTarget: FinancialTarget = {
        name: 'Membeli Laptop Kuliah Baru',
        targetAmount: 15000000,
        currentSaved: 8500000,
        category: 'Edukasi'
      };
      localStorage.setItem('sikaya_financial_target', JSON.stringify(defaultTarget));
      setTarget(defaultTarget);
    }

    // 3. Load Recent Activity Logs
    const savedLogs = localStorage.getItem('sikaya_activity_logs');
    if (savedLogs) {
      try {
        setActivities(JSON.parse(savedLogs).slice(0, 4));
      } catch (e) {
        console.error("Failed to parse activity logs", e);
      }
    } else {
      const defaultLogs: ActivityLog[] = [
        { id: '1', type: 'belajar', title: 'Menyelesaikan Modul', desc: 'Atur Arus Kas (50/30/20)', timestamp: 'Kemarin' },
        { id: '2', type: 'simulasi', title: 'Transaksi Saham Virtual', desc: 'Membeli BBRI sebanyak 10 lot', timestamp: '2 hari lalu' }
      ];
      localStorage.setItem('sikaya_activity_logs', JSON.stringify(defaultLogs));
      setActivities(defaultLogs);
    }
  }, []);

  // Update financial target savings
  const handleAddSavings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !addSavingsAmount) return;

    const parsedAmount = Number(addSavingsAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    const updatedTarget = {
      ...target,
      currentSaved: Math.min(target.targetAmount, target.currentSaved + parsedAmount)
    };

    localStorage.setItem('sikaya_financial_target', JSON.stringify(updatedTarget));
    setTarget(updatedTarget);
    setAddSavingsAmount('');
    setShowAddSavingsInput(false);

    // Track activity
    logActivity('keuangan', 'Menabung untuk Target', `Menambahkan Rp ${parsedAmount.toLocaleString('id-ID')} ke "${target.name}"`);
  };

  // Create a new target
  const handleCreateTarget = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetNameInput || !targetAmountInput) return;

    const newTarget: FinancialTarget = {
      name: targetNameInput,
      targetAmount: Number(targetAmountInput),
      currentSaved: Number(targetSavedInput) || 0,
      category: targetCategory
    };

    localStorage.setItem('sikaya_financial_target', JSON.stringify(newTarget));
    setTarget(newTarget);
    setShowTargetModal(false);
    
    // Clear inputs
    setTargetNameInput('');
    setTargetAmountInput('');
    setTargetSavedInput('');

    // Track activity
    logActivity('keuangan', 'Membuat Target Finansial Baru', `Target "${newTarget.name}" sukses dibuat!`);
  };

  // Log activity helper
  const logActivity = (type: 'belajar' | 'simulasi' | 'keuangan' | 'komunitas', title: string, desc: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type,
      title,
      desc,
      timestamp: 'Baru saja'
    };

    const savedLogs = localStorage.getItem('sikaya_activity_logs');
    let currentLogs: ActivityLog[] = [];
    if (savedLogs) {
      try { currentLogs = JSON.parse(savedLogs); } catch (e) {}
    }
    
    const updated = [newLog, ...currentLogs];
    localStorage.setItem('sikaya_activity_logs', JSON.stringify(updated));
    setActivities(updated.slice(0, 4));
  };

  if (!user) return null;

  // Classroom stats calculations
  const totalModules = 10;
  const completedCount = user.completedModules?.length || 0;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  // Target Calculations
  const targetProgressPercent = target ? Math.round((target.currentSaved / target.targetAmount) * 100) : 0;
  const targetRemaining = target ? Math.max(0, target.targetAmount - target.currentSaved) : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 100, 
        damping: 15 
      } 
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8"
    >
      <PageHeader
        category="Keuangan"
        title={`Ringkasan Finansial ${user.fullName}`}
        description="Pantau total kekayaan bersih, progres belajar, target impian, dan misi harian dalam satu tempat."
        badge={`${user.xp || 0} XP • LEVEL ${user.literacyLevel || 'Pemula'}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Link to="/belajar" className="ui-btn-primary h-9 text-xs">
              <BookOpen className="w-3.5 h-3.5" /> Lanjut Belajar
            </Link>
            <Link to="/simulasi" className="ui-btn-secondary h-9 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Mulai Simulasi
            </Link>
          </div>
        }
      />

      {/* Grid Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* LEFT COLUMN: Saldo & Target (8 Cols on large) */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* Card 1: Ringkasan Saldo (Balance Summary) */}
          <motion.div 
            variants={itemVariants}
            className="ui-card relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">
                  Total Kekayaan Bersih (Net Worth)
                </span>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-1">
                  Rp {netWorth.toLocaleString('id-ID')}
                </h3>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-full border tracking-wide uppercase font-mono ${
                  priceStatus === 'real-time' 
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${priceStatus === 'real-time' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {priceStatus === 'real-time' ? 'Real-time feed' : 'Simulasi / Delayed'}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 tracking-wide uppercase font-mono">
                  Uang Demo & Simulasi
                </span>
              </div>
            </div>

            {/* Asset Split Visualization */}
            <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block"></span>
                  Kas Simulasi (Rp {cashBalance.toLocaleString('id-ID')})
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block"></span>
                  Investasi Portofolio (Rp {assetsTotal.toLocaleString('id-ID')})
                </span>
              </div>
              
              <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(10, (cashBalance / netWorth) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-teal-500 to-teal-600" 
                  title="Kas"
                ></motion.div>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(10, (assetsTotal / netWorth) * 100)}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600" 
                  title="Investasi"
                ></motion.div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aset Saham</p>
                  <p className="text-xs sm:text-sm font-extrabold mt-1 text-slate-850 dark:text-slate-200">
                    Rp {(assetsTotal * 0.7).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Aset Kripto</p>
                  <p className="text-xs sm:text-sm font-extrabold mt-1 text-slate-850 dark:text-slate-200">
                    Rp {(assetsTotal * 0.2).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl">
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Emas & Lainnya</p>
                  <p className="text-xs sm:text-sm font-extrabold mt-1 text-slate-850 dark:text-slate-200">
                    Rp {(assetsTotal * 0.1).toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl flex flex-col justify-center items-center">
                  <Link 
                    to="/portfolio" 
                    className="text-[11px] font-black text-teal-600 dark:text-teal-400 hover:text-teal-700 hover:underline flex items-center gap-1"
                  >
                    Atur Portofolio <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 1.5: Financial Health Score */}
          <motion.div variants={itemVariants}>
            <FinancialHealthCard profile={finProfile} onEditProfile={() => setShowProfileModal(true)} />
          </motion.div>

          {/* Card 2: Target Finansial (Dream Planner) */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
          >
            {target ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-indigo-900/40 uppercase tracking-widest font-mono">
                      🎯 TARGET FINANSIAL ANDA: {target.category}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight mt-2.5 flex items-center gap-2">
                      {target.name}
                    </h4>
                  </div>
                  <button 
                    onClick={() => setShowTargetModal(true)}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    Ganti Target
                  </button>
                </div>

                {/* Progress Indicators */}
                <div className="bg-slate-50 dark:bg-slate-850/60 rounded-2xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800/40 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Kebutuhan</p>
                    <p className="text-base font-black text-slate-850 dark:text-slate-100 mt-1">Rp {target.targetAmount.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-slate-800 py-2 sm:py-0">
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Terkumpul</p>
                    <p className="text-base font-black text-teal-600 dark:text-teal-400 mt-1">Rp {target.currentSaved.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Kurang</p>
                    <p className="text-base font-black text-rose-500 mt-1">Rp {targetRemaining.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-extrabold text-slate-500">
                    <span>Progres Pengumpulan</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">{targetProgressPercent}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${targetProgressPercent}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full" 
                    ></motion.div>
                  </div>
                </div>

                {/* Inline saving button */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  {!showAddSavingsInput ? (
                    <button
                      onClick={() => setShowAddSavingsInput(true)}
                      className="w-full sm:w-auto px-5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" /> Tambah Tabungan Bulanan
                    </button>
                  ) : (
                    <form onSubmit={handleAddSavings} className="w-full flex flex-col sm:flex-row gap-2">
                      <input 
                        type="number"
                        placeholder="Jumlah tabungan baru (Rp)"
                        value={addSavingsAmount}
                        onChange={(e) => setAddSavingsAmount(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl"
                        >
                          Simpan
                        </button>
                        <button 
                          type="button"
                          onClick={() => setShowAddSavingsInput(false)}
                          className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-400 font-bold text-xs rounded-xl"
                        >
                          Batal
                        </button>
                      </div>
                    </form>
                  )}
                  
                  <Link 
                    to="/features" 
                    state={{ activeFeature: 'fire' }}
                    className="text-xs font-bold text-slate-400 hover:text-indigo-500 flex items-center gap-1 ml-auto"
                  >
                    Gunakan FIRE Calculator <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-xs text-slate-500 font-medium">Anda belum menentukan target impian.</p>
                <button 
                  onClick={() => setShowTargetModal(true)}
                  className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg"
                >
                  Buat Target Sekarang
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Quests, Classroom Progress & Activities (4 Cols on large) */}
        <div className="lg:col-span-4 space-y-6 sm:space-y-8">
          
          {/* Card 2.5: Daily & Weekly Quests */}
          <motion.div variants={itemVariants}>
            <QuestsWidget />
          </motion.div>

          {/* Card 3: Progres Belajar (Learning Module Summary) */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
          >
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 font-mono">
              Progres Kelas Literasi
            </h4>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-black text-slate-850 dark:text-slate-100">{completedCount} / {totalModules} Modul</p>
                  <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Selesai dikerjakan ({progressPercent}%)</p>
                </div>
                <motion.div 
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="p-3 bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 rounded-xl cursor-pointer"
                >
                  <Award className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </motion.div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" 
                ></motion.div>
              </div>

              {/* Next suggested module */}
              <div className="p-3 bg-slate-50 dark:bg-slate-850/60 rounded-xl border border-slate-100 dark:border-slate-800/40">
                <p className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Lanjut Modul Rekomendasi</p>
                <h5 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1">
                  Atur Arus Kas (50/30/20)
                </h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Saku bulanan hemat & anti tekor.</p>
              </div>

              <Link 
                to="/belajar"
                className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-black text-xs rounded-xl text-center block transition-all hover:shadow-md hover:shadow-teal-500/10 active:scale-95"
              >
                Masuk Ruang Belajar
              </Link>
            </div>
          </motion.div>

          {/* Card 4: Aktivitas Terbaru (Recent Activity) */}
          <motion.div 
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden"
          >
            <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4 font-mono">
              Aktivitas Terbaru
            </h4>

            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act, i) => (
                  <motion.div 
                    key={act.id} 
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08, type: "spring", stiffness: 100 }}
                    className="flex gap-3 text-xs items-start border-b border-slate-100/60 dark:border-slate-800/40 pb-3 last:border-0 last:pb-0"
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      act.type === 'belajar' ? 'bg-teal-500' :
                      act.type === 'simulasi' ? 'bg-emerald-500' :
                      act.type === 'keuangan' ? 'bg-indigo-500' : 'bg-amber-500'
                    }`}></span>
                    <div className="flex-1 min-w-0">
                      <p className="font-extrabold text-slate-850 dark:text-slate-200 leading-tight truncate">{act.title}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">{act.desc}</p>
                    </div>
                    <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 shrink-0 uppercase font-mono">{act.timestamp}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-3xl mb-1 select-none">📭</div>
                <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider mb-1">Masa Depan Masih Bersih</p>
                <p className="text-[10px] text-slate-500 leading-tight">
                  Belum ada aktivitas terekam. Selesaikan modul kuis atau beli instrumen virtual di simulator sekarang!
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* MODAL: New Target / Ganti Target */}
      <AnimatePresence>
        {showTargetModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative"
            >
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                Rancang Target Finansial Baru
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Pilih target hidupmu, atur nominal dana yang dibutuhkan, dan pantau progresnya.
              </p>

              <form onSubmit={handleCreateTarget} className="space-y-4 mt-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Kategori Impian</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Gadget', 'Liburan', 'Konser', 'Edukasi', 'Investasi'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTargetCategory(cat)}
                        className={`py-2 text-[11px] font-black rounded-lg border transition-all ${
                          targetCategory === cat
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                            : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Nama Impian Anda</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Contoh: Beli Laptop Spek AI"
                    value={targetNameInput}
                    onChange={(e) => setTargetNameInput(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Target Dana (Rp)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="Contoh: 15000000"
                      value={targetAmountInput}
                      onChange={(e) => setTargetAmountInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Sudah Terkumpul (Rp)</label>
                    <input 
                      type="number" 
                      placeholder="Contoh: 500000"
                      value={targetSavedInput}
                      onChange={(e) => setTargetSavedInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Simpan Target
                  </button>
                  <button 
                    type="button"
                    onClick={() => setShowTargetModal(false)}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Financial Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <FinancialProfileModal
            currentProfile={finProfile}
            onSave={handleSaveProfile}
            onClose={() => setShowProfileModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
