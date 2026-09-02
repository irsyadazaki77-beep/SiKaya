import { useState, useEffect } from 'react';
import { 
  Wallet, BookOpen, Target, Activity, TrendingUp, ArrowRight, Plus, 
  Sparkles, ShieldCheck, AlertTriangle, ChevronRight, CheckCircle2,
  PieChart, RefreshCw, Flame, Coins, Award
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FinancialHealthCard } from './FinancialHealthCard';
import { QuestsWidget } from './QuestsWidget';
import { FinancialProfileModal } from './FinancialProfileModal';
import { FinancialProfile, FinancialGoal, BudgetEnvelope } from '../../types/financial';
import { DEFAULT_FINANCIAL_PROFILE, calculateFinancialHealthScore } from '../../lib/financialHealth';
import { formatRupiah } from '../../utils/financeUtils';

export function UserDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // 1. Financial Profile State
  const [finProfile, setFinProfile] = useState<FinancialProfile>(DEFAULT_FINANCIAL_PROFILE);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 2. Financial Goals State
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [showNewGoalModal, setShowNewGoalModal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalSaved, setNewGoalSaved] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState<FinancialGoal['category']>('Dana Darurat');
  const [newGoalDate, setNewGoalDate] = useState('2026-12-31');

  // 3. Budget Envelopes State
  const [envelopes, setEnvelopes] = useState<BudgetEnvelope[]>([]);

  // 4. Virtual Simulator Balances (Distinct from real profile)
  const [virtualCash, setVirtualCash] = useState<number>(10000000);
  const [virtualPortfolioValue, setVirtualPortfolioValue] = useState<number>(0);

  // Load canonical data on mount
  useEffect(() => {
    // A. Profile
    const savedProf = localStorage.getItem('sikaya_fin_profile');
    if (savedProf) {
      try {
        const parsed = JSON.parse(savedProf);
        setFinProfile(parsed);
        if (parsed.financialGoals) setGoals(parsed.financialGoals);
        if (parsed.budgetEnvelopes) setEnvelopes(parsed.budgetEnvelopes);
      } catch (e) {
        console.error('Failed to parse fin profile', e);
      }
    } else {
      setFinProfile(DEFAULT_FINANCIAL_PROFILE);
      if (DEFAULT_FINANCIAL_PROFILE.financialGoals) setGoals(DEFAULT_FINANCIAL_PROFILE.financialGoals);
      if (DEFAULT_FINANCIAL_PROFILE.budgetEnvelopes) setEnvelopes(DEFAULT_FINANCIAL_PROFILE.budgetEnvelopes);
    }

    // B. Virtual trading balances
    const vCash = localStorage.getItem('sikaya_virtual_cash');
    if (vCash) setVirtualCash(Number(vCash));

    const vHoldings = localStorage.getItem('sikaya_virtual_holdings');
    if (vHoldings) {
      try {
        const parsed = JSON.parse(vHoldings);
        let totalVal = 0;
        Object.values(parsed).forEach((h: any) => {
          totalVal += (h.shares || 0) * (h.currentPrice || h.buyPrice || 0);
        });
        setVirtualPortfolioValue(totalVal);
      } catch (e) {}
    }
  }, []);

  const handleSaveProfile = (updated: FinancialProfile) => {
    setFinProfile(updated);
    localStorage.setItem('sikaya_fin_profile', JSON.stringify(updated));
    setShowProfileModal(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName.trim() || !newGoalTarget) return;

    const createdGoal: FinancialGoal = {
      id: 'goal-' + Date.now(),
      name: newGoalName.trim(),
      category: newGoalCategory,
      targetAmount: Number(newGoalTarget),
      currentSaved: Number(newGoalSaved) || 0,
      targetDate: newGoalDate,
      monthlyContribution: Math.round(Number(newGoalTarget) / 12),
    };

    const updatedGoals = [...goals, createdGoal];
    setGoals(updatedGoals);
    
    const updatedProfile = { ...finProfile, financialGoals: updatedGoals };
    setFinProfile(updatedProfile);
    localStorage.setItem('sikaya_fin_profile', JSON.stringify(updatedProfile));

    setShowNewGoalModal(false);
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalSaved('');
  };

  const handleAddSavingsToGoal = (goalId: string, amount: number) => {
    const updatedGoals = goals.map(g => {
      if (g.id === goalId) {
        return { ...g, currentSaved: Math.min(g.targetAmount, g.currentSaved + amount) };
      }
      return g;
    });
    setGoals(updatedGoals);
    const updatedProfile = { ...finProfile, financialGoals: updatedGoals };
    setFinProfile(updatedProfile);
    localStorage.setItem('sikaya_fin_profile', JSON.stringify(updatedProfile));
  };

  if (!user) return null;

  // Real Net Worth Calculation
  const totalAssets = (finProfile.totalCash || 0) + (finProfile.totalInvestments || 0);
  const totalLiabilities = finProfile.totalDebt || 0;
  const realNetWorth = totalAssets - totalLiabilities;

  // Health Score calculation
  const healthResult = calculateFinancialHealthScore(finProfile);

  // Dynamic Next Recommended Action based on diagnostic weaknesses
  const getContextualNextAction = () => {
    if (healthResult.pillars.emergencyFund.scoreOutOf20 < 14) {
      return {
        title: 'Perkuat Dana Darurat Anda',
        subtitle: `Dana darurat saat ini ${healthResult.pillars.emergencyFund.formattedValue} (Target: 3-6 Bulan). Lindungi diri dari krisis tak terduga.`,
        cta: 'Buka Modul Dana Darurat',
        link: '/classroom?module=emergency',
        icon: ShieldCheck,
        badge: 'Prioritas Utama',
        color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
      };
    } else if (healthResult.pillars.debtRatio.scoreOutOf20 < 14) {
      return {
        title: 'Kendalikan Rasio Utang & Cicilan',
        subtitle: `Rasio cicilan utang Anda ${healthResult.pillars.debtRatio.formattedValue}. Pelajari strategi bebas pinjol & utang.`,
        cta: 'Pelajari Manajemen Utang',
        link: '/classroom?module=debt',
        icon: AlertTriangle,
        badge: 'Kritis',
        color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800'
      };
    } else if (healthResult.pillars.cashflow.scoreOutOf20 < 14 || healthResult.pillars.savingsRate.scoreOutOf20 < 14) {
      return {
        title: 'Optimalkan Aturan Budgeting 50/30/20',
        subtitle: 'Bentuk disiplin arus kas dan alokasikan pos kebutuhan, lifestyle, dan tabungan secara otomatis.',
        cta: 'Buka Modul Budgeting',
        link: '/classroom?module=budgeting',
        icon: Target,
        badge: 'Rekomendasi',
        color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800'
      };
    } else {
      return {
        title: 'Mulai Diversifikasi & Investasi Berkala',
        subtitle: 'Kondisi finansial dasar Anda kokoh! Saatnya memaksimalkan pertumbuhan aset di instrumen terencana.',
        cta: 'Pelajari Reksa Dana & Saham',
        link: '/classroom?module=reksadana',
        icon: TrendingUp,
        badge: 'Tahap Lanjutan',
        color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
      };
    }
  };

  const nextAction = getContextualNextAction();
  const NextIcon = nextAction.icon;

  // Learning Progress
  const totalModulesCount = 10;
  const completedModulesCount = user.completedModules?.length || 0;
  const learningPercentage = Math.round((completedModulesCount / totalModulesCount) * 100);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7">
      {/* 1. Header Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
              Halo, {user.fullName ? user.fullName.split(' ')[0] : 'Kawan'} 👋
            </h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800 font-mono">
              Level {user.level || 1} • {user.xp || 0} XP
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pusat kendali edukasi, diagnostik kesehatan finansial, dan pemantauan target masa depan Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/classroom"
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lanjut Belajar</span>
          </Link>
          <Link
            to="/simulator"
            className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold transition-all shadow-xs"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>Simulasi Pasar</span>
          </Link>
        </div>
      </div>

      {/* 2. Contextual Next Action Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${nextAction.color}`}>
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-inherit shrink-0">
            <NextIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-inherit font-mono">
                {nextAction.badge}
              </span>
              <h4 className="text-sm font-bold font-display">{nextAction.title}</h4>
            </div>
            <p className="text-xs mt-1 leading-relaxed opacity-90 max-w-2xl">{nextAction.subtitle}</p>
          </div>
        </div>
        <Link
          to={nextAction.link}
          className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold transition-all shadow-xs"
        >
          <span>{nextAction.cta}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. Main Dashboard Grid (Primary vs Secondary Hierarchy) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Net Worth, Financial Health, and Goals (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Real Net Worth Summary Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Kekayaan Bersih Pengguna (Aset Riil)
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-display mt-0.5">
                  {formatRupiah(realNetWorth)}
                </h2>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Ubah Profil Keuangan
              </button>
            </div>

            {/* Asset vs Liability Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs">
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Kas & Dana Darurat</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white font-mono mt-0.5">
                  {formatRupiah(finProfile.totalCash || 0)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold text-slate-400">Total Investasi</p>
                <p className="text-sm font-bold text-teal-600 dark:text-teal-400 font-mono mt-0.5">
                  {formatRupiah(finProfile.totalInvestments || 0)}
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] font-semibold text-slate-400">Total Utang & Cicilan</p>
                <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono mt-0.5">
                  {formatRupiah(finProfile.totalDebt || 0)}
                </p>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>Porsi Kas ({totalAssets > 0 ? Math.round(((finProfile.totalCash || 0) / totalAssets) * 100) : 0}%)</span>
                <span>Porsi Investasi ({totalAssets > 0 ? Math.round(((finProfile.totalInvestments || 0) / totalAssets) * 100) : 0}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${totalAssets > 0 ? ((finProfile.totalCash || 0) / totalAssets) * 100 : 50}%` }}
                  className="h-full bg-indigo-500"
                />
                <div
                  style={{ width: `${totalAssets > 0 ? ((finProfile.totalInvestments || 0) / totalAssets) * 100 : 50}%` }}
                  className="h-full bg-teal-500"
                />
              </div>
            </div>
          </div>

          {/* 5-Pillar Financial Health Card */}
          <FinancialHealthCard profile={finProfile} onEditProfile={() => setShowProfileModal(true)} />

          {/* Financial Goals / Dream Planner */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Target Finansial & Dream Planner
                </h3>
                <p className="text-xs text-slate-500">Pantau progres tabungan terencana Anda</p>
              </div>
              <button
                onClick={() => setShowNewGoalModal(true)}
                className="flex items-center gap-1 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Tambah Target
              </button>
            </div>

            <div className="space-y-3">
              {goals.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Target className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">Belum ada target finansial yang dibuat.</p>
                  <button
                    onClick={() => setShowNewGoalModal(true)}
                    className="mt-3 text-xs font-bold text-teal-600 hover:underline cursor-pointer"
                  >
                    + Buat Target Pertama Sekarang
                  </button>
                </div>
              ) : (
                goals.map((goal) => {
                  const pct = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
                  return (
                    <div
                      key={goal.id}
                      className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 font-mono">
                            {goal.category}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{goal.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
                            {formatRupiah(goal.currentSaved)}
                          </span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            dari {formatRupiah(goal.targetAmount)}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                          <span>Progres: {pct}%</span>
                          <span>Sisa: {formatRupiah(Math.max(0, goal.targetAmount - goal.currentSaved))}</span>
                        </div>
                        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            style={{ width: `${pct}%` }}
                            className="h-full bg-teal-500 rounded-full transition-all duration-500"
                          />
                        </div>
                      </div>

                      {/* Quick Add Savings Button */}
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleAddSavingsToGoal(goal.id, 500000)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-teal-500 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                        >
                          + Rp 500.000
                        </button>
                        <button
                          onClick={() => handleAddSavingsToGoal(goal.id, 1000000)}
                          className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-teal-500 transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                        >
                          + Rp 1.000.000
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Learning Journey, Quests, Virtual Trading Snapshot (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Learning Journey Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    Kurikulum Finansial
                  </h3>
                  <p className="text-[11px] text-slate-500">10 Modul Interaktif Standar OJK</p>
                </div>
              </div>
              <span className="text-xs font-bold text-indigo-600 font-mono">
                {learningPercentage}% Selesai
              </span>
            </div>

            {/* Learning Progress Bar */}
            <div className="space-y-2">
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${learningPercentage}%` }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                {completedModulesCount} dari {totalModulesCount} modul telah diselesaikan.
              </p>
            </div>

            <Link
              to="/classroom"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all"
            >
              <span>Lanjutkan Kelas Finansial</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Gamified Quests & Daily Missions */}
          <QuestsWidget />

          {/* Digital Envelope Budgeting Preview */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-teal-50 dark:bg-teal-950/50 text-teal-600 rounded-xl">
                  <PieChart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white font-display">
                    Sistem Amplop Digital
                  </h3>
                  <p className="text-[11px] text-slate-500">Alokasi bulanan terkendali</p>
                </div>
              </div>
              <Link to="/features" className="text-xs font-semibold text-teal-600 hover:underline">
                Kelola
              </Link>
            </div>

            <div className="space-y-2.5 text-xs">
              {envelopes.slice(0, 4).map((env) => {
                const spentPct = Math.min(100, Math.round((env.spent / env.monthlyBudget) * 100));
                const isOver = env.spent > env.monthlyBudget;
                return (
                  <div key={env.id} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{env.category}</span>
                      <span className={`font-mono font-bold ${isOver ? 'text-rose-500' : 'text-slate-600 dark:text-slate-400'}`}>
                        {formatRupiah(env.spent)} / {formatRupiah(env.monthlyBudget)}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${spentPct}%` }}
                        className={`h-full ${isOver ? 'bg-rose-500' : spentPct > 80 ? 'bg-amber-500' : 'bg-teal-500'}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Virtual Trading Simulator Demarcation Card */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
                  SIMULASI VIRTUAL
                </span>
                <h3 className="text-sm font-bold font-display mt-1">Virtual Trading Portfolio</h3>
              </div>
              <Link
                to="/simulator"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Trading Room</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80 text-xs">
              <div>
                <p className="text-[10px] text-slate-400">Kas Virtual Tersedia</p>
                <p className="text-sm font-bold font-mono text-white mt-0.5">
                  {formatRupiah(virtualCash)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Aset Saham & Kripto</p>
                <p className="text-sm font-bold font-mono text-emerald-400 mt-0.5">
                  {formatRupiah(virtualPortfolioValue)}
                </p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              💡 Seluruh transaksi di Trading Room menggunakan dana virtual bebas risiko untuk mengasah analisis teknikal dan psikologi pasar.
            </p>
          </div>

        </div>
      </div>

      {/* 4. MODALS: Edit Profile & Add Goal */}
      {showProfileModal && (
        <FinancialProfileModal
          currentProfile={finProfile}
          onSave={handleSaveProfile}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {showNewGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                Buat Target Finansial Baru
              </h3>
              <button
                onClick={() => setShowNewGoalModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddGoal} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Nama Target
                </label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="Contoh: DP Rumah, Laptop Kuliah, Liburan"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Target Dana (Rp)
                  </label>
                  <input
                    type="number"
                    value={newGoalTarget}
                    onChange={(e) => setNewGoalTarget(e.target.value)}
                    placeholder="15000000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Sudah Terkumpul (Rp)
                  </label>
                  <input
                    type="number"
                    value={newGoalSaved}
                    onChange={(e) => setNewGoalSaved(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Kategori
                </label>
                <select
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium focus:outline-none focus:border-teal-500"
                >
                  <option value="Dana Darurat">Dana Darurat</option>
                  <option value="Rumah">DP Rumah</option>
                  <option value="Gadget / Laptop">Gadget / Elektronik</option>
                  <option value="Kendaraan">Kendaraan</option>
                  <option value="Pendidikan">Pendidikan & Skill</option>
                  <option value="Pernikahan">Pernikahan</option>
                  <option value="Liburan">Liburan</option>
                  <option value="Pensiun">Pensiun / FIRE</option>
                  <option value="Custom">Lainnya</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewGoalModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold cursor-pointer shadow-xs"
                >
                  Simpan Target
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
