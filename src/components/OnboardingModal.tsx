import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Sparkles, ArrowRight, ArrowLeft, Check, Compass, 
  GraduationCap, Briefcase, Building, Laptop, ShieldCheck, 
  Target, AlertTriangle, TrendingUp, Home, BookOpen, Clock
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { FinancialProfile } from '../types/financial';

export function OnboardingModal() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  
  // 1. Condition / Persona
  const [condition, setCondition] = useState<'Mahasiswa' | 'Pekerja Baru' | 'Profesional' | 'Freelancer / Wirausaha'>('Pekerja Baru');
  
  // 2. Primary Goal
  const [primaryGoal, setPrimaryGoal] = useState<'darurat' | 'utang' | 'investasi' | 'rumah' | 'budgeting' | 'pensiun' | 'pendidikan'>('darurat');
  
  // 3. Knowledge Level
  const [knowledgeLevel, setKnowledgeLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  
  // 4. Risk Preference
  const [risk, setRisk] = useState<'Konservatif' | 'Moderat' | 'Agresif'>('Moderat');

  useEffect(() => {
    const completed = localStorage.getItem('sikaya_onboarding_completed');
    if (!completed) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      toast.error('Harap masukkan nama panggilan Anda!');
      return;
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleComplete = () => {
    const persona = {
      name: name.trim() || 'Pengguna SiKaya',
      condition,
      primaryGoal,
      knowledgeLevel,
      risk,
      completedAt: new Date().toISOString()
    };
    
    // Save to persona and initialize or update canonical profile
    localStorage.setItem('sikaya_onboarding_completed', 'true');
    localStorage.setItem('sikaya_profile_persona', JSON.stringify(persona));
    
    const existingProfile = localStorage.getItem('sikaya_fin_profile');
    if (!existingProfile) {
      // Default baseline profile based on condition
      let defaultIncome = 5000000;
      let defaultExpenses = 3500000;
      let defaultEmergency = 5000000;

      if (condition === 'Mahasiswa') {
        defaultIncome = 2500000;
        defaultExpenses = 1800000;
        defaultEmergency = 2000000;
      } else if (condition === 'Profesional') {
        defaultIncome = 12000000;
        defaultExpenses = 7000000;
        defaultEmergency = 25000000;
      }

      const initialProfile: FinancialProfile = {
        monthlyIncome: defaultIncome,
        monthlyExpenses: defaultExpenses,
        totalCash: defaultEmergency + 2000000,
        emergencyFund: defaultEmergency,
        totalDebt: 0,
        monthlyDebtPayment: 0,
        totalInvestments: 5000000,
        riskTolerance: risk,
        persona: {
          condition,
          primaryGoal,
          knowledgeLevel
        },
        goals: [
          primaryGoal === 'darurat' ? 'Dana Darurat 6 Bulan' :
          primaryGoal === 'rumah' ? 'DP Rumah Pertama' :
          primaryGoal === 'pensiun' ? 'Dana Pensiun Mandiri' : 'Portofolio Investasi Berkala'
        ]
      };
      localStorage.setItem('sikaya_fin_profile', JSON.stringify(initialProfile));
    }

    toast.success(`Selamat datang, ${name || 'Kawan'}! Kurikulum & dashboard finansial Anda telah disesuaikan.`);
    setIsOpen(false);
    window.location.reload();
  };

  const getRecommendedAllocation = () => {
    if (risk === 'Konservatif') {
      return [
        { name: 'Kas & Deposito', pct: 50, color: 'bg-indigo-500' },
        { name: 'Emas Fisik & SBN', pct: 30, color: 'bg-amber-500' },
        { name: 'Reksa Dana Pasar Uang', pct: 20, color: 'bg-teal-500' }
      ];
    } else if (risk === 'Moderat') {
      return [
        { name: 'Saham Bluechip (IHSG)', pct: 40, color: 'bg-emerald-500' },
        { name: 'Reksa Dana Pendapatan Tetap', pct: 35, color: 'bg-teal-500' },
        { name: 'Kas Likuid & Deposito', pct: 20, color: 'bg-indigo-500' },
        { name: 'Emas Fisik', pct: 5, color: 'bg-amber-500' }
      ];
    } else {
      return [
        { name: 'Saham Pertumbuhan & Ekuitas', pct: 55, color: 'bg-emerald-500' },
        { name: 'Aset Kripto & Web3', pct: 15, color: 'bg-rose-500' },
        { name: 'Reksa Dana / SBN', pct: 20, color: 'bg-teal-500' },
        { name: 'Kas Taktis', pct: 10, color: 'bg-indigo-500' }
      ];
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
        >
          {/* Progress Indicators */}
          <div className="flex gap-2 mb-6 relative z-10">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i <= step ? 'bg-teal-600 dark:bg-teal-500' : 'bg-slate-100 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          <div className="relative z-10">
            {/* STEP 1: WELCOME & CONDITION */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-md inline-block font-mono">
                    👋 Personalisasi Akun
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Siapa nama & status Anda saat ini?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kami menyesuaikan kurikulum belajar dengan tahapan hidup Anda saat ini.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Nama Panggilan
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Raka, Abel, Clara"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                    Tahapan Hidup Saat Ini
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'Mahasiswa', label: 'Mahasiswa / Pelajar', icon: GraduationCap },
                      { id: 'Pekerja Baru', label: 'First Jobber / Pekerja', icon: Briefcase },
                      { id: 'Profesional', label: 'Karyawan / Senior', icon: Building },
                      { id: 'Freelancer / Wirausaha', label: 'Freelancer / Bisnis', icon: Laptop }
                    ].map((item) => {
                      const Icon = item.icon;
                      const selected = condition === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCondition(item.id as any)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                            selected
                              ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200'
                              : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 shrink-0 ${selected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-semibold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem('sikaya_onboarding_completed', 'true');
                      setIsOpen(false);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer font-medium"
                  >
                    Lewati (Default)
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: FINANCIAL GOALS */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-md inline-block font-mono">
                    🎯 Langkah 2 dari 4
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Apa prioritas target finansial utama Anda?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Pilih fokus yang ingin Anda selesaikan terlebih dahulu di SiKaya.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {[
                    { id: 'darurat', label: 'Bangun Dana Darurat', desc: 'Jaring pengaman dari risiko tak terduga', icon: ShieldCheck },
                    { id: 'utang', label: 'Bebas Utang & Pinjol', desc: 'Strategi pelunasan cicilan konsumtif', icon: AlertTriangle },
                    { id: 'investasi', label: 'Mulai Belajar Investasi', desc: 'Pahami reksa dana, SBN & saham', icon: TrendingUp },
                    { id: 'rumah', label: 'Menabung DP Rumah', desc: 'Rencana cicilan KPR dan properti', icon: Home },
                    { id: 'budgeting', label: 'Budgeting Disiplin 50/30/20', desc: 'Hentikan kebocoran uang bulanan', icon: Target },
                    { id: 'pensiun', label: 'Pensiun Dini / FIRE', desc: 'Mencapai kebebasan finansial mandiri', icon: Compass },
                    { id: 'pendidikan', label: 'Dana Pendidikan / Skill', desc: 'Investasi ilmu dan sertifikasi', icon: GraduationCap }
                  ].map((g) => {
                    const Icon = g.icon;
                    const selected = primaryGoal === g.id;
                    return (
                      <button
                        key={g.id}
                        type="button"
                        onClick={() => setPrimaryGoal(g.id as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          selected
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${selected ? 'text-teal-600' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold">{g.label}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">{g.desc}</p>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: KNOWLEDGE LEVEL */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-md inline-block font-mono">
                    📚 Langkah 3 dari 4
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Sejauh mana pemahaman finansial Anda?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Modul awal di kelas akan disesuaikan dengan tingkat kenyamanan Anda.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {[
                    {
                      id: 'Beginner',
                      title: 'Pemula (Beginner)',
                      desc: 'Baru ingin belajar menabung rutin, membedakan kebutuhan & keinginan, serta memahami bahaya pinjol.',
                      icon: BookOpen
                    },
                    {
                      id: 'Intermediate',
                      title: 'Menengah (Intermediate)',
                      desc: 'Sudah memiliki tabungan stabil, ingin belajar instrumen reksa dana, SBN, dan diversifikasi aset.',
                      icon: Target
                    },
                    {
                      id: 'Advanced',
                      title: 'Mahir (Advanced)',
                      desc: 'Sudah aktif berinvestasi di saham/kripto, ingin mengasah analisis valuasi laporan keuangan dan rebalancing.',
                      icon: Sparkles
                    }
                  ].map((lvl) => {
                    const Icon = lvl.icon;
                    const selected = knowledgeLevel === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() => setKnowledgeLevel(lvl.id as any)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                          selected
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                        }`}
                      >
                        <div className={`p-2 rounded-lg shrink-0 ${selected ? 'bg-teal-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white">{lvl.title}</p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{lvl.desc}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: RISK PREFERENCE & PREVIEW */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 dark:bg-teal-950/50 px-2.5 py-1 rounded-md inline-block font-mono">
                    🛡️ Langkah 4 dari 4
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
                    Pilih gaya profil risiko investasi Anda
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ini akan menentukan simulasi alokasi aset yang direkomendasikan.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Konservatif', label: 'Konservatif', desc: 'Prioritas keamanan modal' },
                    { id: 'Moderat', label: 'Moderat', desc: 'Seimbang imbal hasil & risiko' },
                    { id: 'Agresif', label: 'Agresif', desc: 'Pertumbuhan modal maksimal' }
                  ].map((r) => {
                    const selected = risk === r.id;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setRisk(r.id as any)}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          selected
                            ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-500 text-teal-900 dark:text-teal-200'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <p className="text-xs font-bold">{r.label}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{r.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Recommended Allocation Preview Bar */}
                <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2.5">
                  <p className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
                    Preview Alokasi Aset Rekomendasi:
                  </p>
                  
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full flex overflow-hidden">
                    {getRecommendedAllocation().map((item, idx) => (
                      <div
                        key={idx}
                        style={{ width: `${item.pct}%` }}
                        className={`h-full ${item.color}`}
                        title={`${item.name} (${item.pct}%)`}
                      />
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    {getRecommendedAllocation().map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                        <span className={`w-2 h-2 rounded-full ${item.color}`} />
                        <span>{item.name}: <strong className="text-slate-900 dark:text-white font-mono">{item.pct}%</strong></span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer font-medium"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleComplete}
                    className="flex items-center gap-1.5 px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Selesai & Mulai Belajar</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
