import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wallet, BookOpen, Target, Activity, TrendingUp, ArrowRight, Plus, 
  Minus, RefreshCw, Award, Compass, Heart, ShieldCheck, Zap, AlertCircle,
  PiggyBank, LineChart
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
      const initialAssets = [
        { id: '1', symbol: 'BBRI', name: 'Bank Rakyat Indonesia', type: 'Saham', buyPrice: 4800, currentPrice: 4950, shares: 1000 },
        { id: '2', symbol: 'BTC', name: 'Bitcoin', type: 'Kripto', buyPrice: 950000000, currentPrice: 980000000, shares: 0.002 }
      ];
      localStorage.setItem('sikaya_manual_assets', JSON.stringify(initialAssets));
      calcAssetsTotal = 4950000 + 1960000;
    }

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

    const savedStatus = localStorage.getItem('sikaya_price_status');
    if (savedStatus) {
      setPriceStatus(savedStatus as 'real-time' | 'simulasi');
    } else {
      setPriceStatus('real-time');
    }

    const savedTarget = localStorage.getItem('sikaya_financial_target');
    if (savedTarget) {
      try {
        setTarget(JSON.parse(savedTarget));
      } catch (e) {
        console.error("Failed to parse financial target", e);
      }
    } else {
      const defaultTarget: FinancialTarget = {
        name: 'Membeli Laptop Kuliah Baru',
        targetAmount: 15000000,
        currentSaved: 8500000,
        category: 'Edukasi'
      };
      localStorage.setItem('sikaya_financial_target', JSON.stringify(defaultTarget));
      setTarget(defaultTarget);
    }

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

    logActivity('keuangan', 'Menabung untuk Target', `Menambahkan Rp ${parsedAmount.toLocaleString('id-ID')} ke "${target.name}"`);
  };

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
    
    setTargetNameInput('');
    setTargetAmountInput('');
    setTargetSavedInput('');

    logActivity('keuangan', 'Membuat Target Finansial Baru', `Target "${newTarget.name}" sukses dibuat!`);
  };

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

  const totalModules = 10;
  const completedCount = user.completedModules?.length || 0;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const targetProgressPercent = target ? Math.round((target.currentSaved / target.targetAmount) * 100) : 0;
  const targetRemaining = target ? Math.max(0, target.targetAmount - target.currentSaved) : 0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
            Halo, {user.fullName.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">Berikut adalah ringkasan keuangan Anda hari ini.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/belajar" className="ui-btn-primary">
            <BookOpen className="w-4 h-4" /> Belajar
          </Link>
          <Link to="/simulasi" className="ui-btn-secondary">
            <Activity className="w-4 h-4 text-emerald-500" /> Simulasi
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Financial Overview (2 cols on large) */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="ui-card flex flex-col justify-between h-auto min-h-[220px]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Kekayaan Bersih</p>
                <h2 className="text-4xl font-semibold text-slate-900 dark:text-white mt-1">
                  Rp {netWorth.toLocaleString('id-ID')}
                </h2>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="ui-badge ui-badge-emerald">
                  <span className={`w-1.5 h-1.5 rounded-full ${priceStatus === 'real-time' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                  {priceStatus === 'real-time' ? 'Data Live' : 'Simulasi'}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-teal-500"></span> Kas (Rp {cashBalance.toLocaleString('id-ID')})
                </span>
                <span className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded bg-indigo-500"></span> Investasi (Rp {assetsTotal.toLocaleString('id-ID')})
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${Math.max(5, (cashBalance / netWorth) * 100)}%` }} className="h-full bg-teal-500"></div>
                <div style={{ width: `${Math.max(5, (assetsTotal / netWorth) * 100)}%` }} className="h-full bg-indigo-500"></div>
              </div>
            </div>
          </div>

          <FinancialHealthCard profile={finProfile} onEditProfile={() => setShowProfileModal(true)} />

          <div className="ui-card">
            {target ? (
              <div className="space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="ui-badge ui-badge-indigo mb-2">TARGET: {target.category.toUpperCase()}</span>
                    <h3 className="ui-card-title">{target.name}</h3>
                  </div>
                  <button onClick={() => setShowTargetModal(true)} className="text-sm text-indigo-600 hover:underline font-medium">
                    Edit
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Target Dana</p>
                    <p className="text-base font-semibold mt-0.5">Rp {target.targetAmount.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Terkumpul</p>
                    <p className="text-base font-semibold text-teal-600 mt-0.5">Rp {target.currentSaved.toLocaleString('id-ID')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Sisa</p>
                    <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mt-0.5">Rp {targetRemaining.toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-medium">
                    <span className="text-slate-600 dark:text-slate-400">Progres ({targetProgressPercent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div style={{ width: `${targetProgressPercent}%` }} className="h-full bg-indigo-500 rounded-full"></div>
                  </div>
                </div>

                {!showAddSavingsInput ? (
                  <button
                    onClick={() => setShowAddSavingsInput(true)}
                    className="ui-btn-secondary w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" /> Tambah Tabungan
                  </button>
                ) : (
                  <form onSubmit={handleAddSavings} className="flex gap-2">
                    <input 
                      type="number"
                      placeholder="Nominal (Rp)"
                      value={addSavingsAmount}
                      onChange={(e) => setAddSavingsAmount(e.target.value)}
                      className="ui-input flex-1"
                      autoFocus
                    />
                    <button type="submit" className="ui-btn-primary">Simpan</button>
                    <button type="button" onClick={() => setShowAddSavingsInput(false)} className="ui-btn-secondary">Batal</button>
                  </form>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Target className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-600 mb-4">Belum ada target finansial yang dibuat.</p>
                <button onClick={() => setShowTargetModal(true)} className="ui-btn-primary mx-auto">
                  Buat Target Baru
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar/Right Column */}
        <div className="space-y-6">
          <QuestsWidget />

          <div className="ui-card">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Progres Belajar</h3>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">{completedCount} / {totalModules}</p>
                <p className="text-xs text-slate-500">Modul diselesaikan</p>
              </div>
              <div className="p-3 bg-teal-50 dark:bg-teal-900/20 text-teal-600 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-4">
              <div style={{ width: `${progressPercent}%` }} className="h-full bg-teal-500 rounded-full"></div>
            </div>
            <Link to="/belajar" className="ui-btn-outline w-full justify-center">
              Lanjut Belajar
            </Link>
          </div>

          <div className="ui-card">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Aktivitas Terakhir</h3>
            {activities.length > 0 ? (
              <div className="space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex gap-3">
                    <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                      act.type === 'belajar' ? 'bg-teal-500' :
                      act.type === 'simulasi' ? 'bg-emerald-500' :
                      act.type === 'keuangan' ? 'bg-indigo-500' : 'bg-amber-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{act.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{act.desc}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">Belum ada aktivitas.</p>
            )}
          </div>
        </div>
      </div>

      {showTargetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="ui-card w-full max-w-md">
            <h3 className="ui-card-title mb-1">Target Finansial Baru</h3>
            <p className="ui-card-sub mb-6">Tentukan impian finansial Anda.</p>

            <form onSubmit={handleCreateTarget} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Kategori</label>
                <select 
                  value={targetCategory}
                  onChange={(e) => setTargetCategory(e.target.value)}
                  className="ui-input w-full"
                >
                  {['Gadget', 'Liburan', 'Pendidikan', 'Investasi', 'Lainnya'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Nama Target</label>
                <input 
                  type="text" required placeholder="Cth: Beli Laptop Baru"
                  value={targetNameInput} onChange={(e) => setTargetNameInput(e.target.value)}
                  className="ui-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Target Dana (Rp)</label>
                <input 
                  type="number" required placeholder="Cth: 15000000"
                  value={targetAmountInput} onChange={(e) => setTargetAmountInput(e.target.value)}
                  className="ui-input w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Sudah Terkumpul (Rp)</label>
                <input 
                  type="number" placeholder="Cth: 5000000"
                  value={targetSavedInput} onChange={(e) => setTargetSavedInput(e.target.value)}
                  className="ui-input w-full"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="ui-btn-primary flex-1">Simpan Target</button>
                <button type="button" onClick={() => setShowTargetModal(false)} className="ui-btn-secondary">Batal</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProfileModal && (
        <FinancialProfileModal
          currentProfile={finProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}
    </div>
  );
}

