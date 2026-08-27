import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Shield, User, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function OnboardingModal() {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<'darurat' | 'rumah' | 'pensiun' | 'liburan'>('darurat');
  const [risk, setRisk] = useState<'konservatif' | 'moderat' | 'agresif'>('moderat');

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
      name: name.trim(),
      goal,
      risk,
      completedAt: new Date().toISOString()
    };
    localStorage.setItem('sikaya_onboarding_completed', 'true');
    localStorage.setItem('sikaya_profile_persona', JSON.stringify(persona));
    toast.success(`Selamat bergabung, ${name}! Profil finansial Anda berhasil dikustomisasi.`);
    setIsOpen(false);
    window.location.reload(); // refresh to propagate changes to layout/dashboard gracefully
  };

  const getRecommendedAllocation = () => {
    if (risk === 'konservatif') {
      return [
        { name: '🛡️ Kas & Deposito', pct: 50, color: 'bg-indigo-500' },
        { name: '🪙 Emas Fisik', pct: 30, color: 'bg-yellow-500' },
        { name: '💼 Reksa Dana', pct: 20, color: 'bg-teal-500' }
      ];
    } else if (risk === 'moderat') {
      return [
        { name: '📈 Saham Bluechip', pct: 40, color: 'bg-emerald-500' },
        { name: '💼 Reksa Dana / Obligasi', pct: 40, color: 'bg-teal-500' },
        { name: '🛡️ Kas & Deposito', pct: 15, color: 'bg-indigo-500' },
        { name: '🪙 Emas Fisik', pct: 5, color: 'bg-yellow-500' }
      ];
    } else {
      return [
        { name: '📈 Saham & Ekuitas', pct: 60, color: 'bg-emerald-500' },
        { name: '⚡ Aset Crypto', pct: 20, color: 'bg-rose-500' },
        { name: '💼 Reksa Dana / SBN', pct: 15, color: 'bg-teal-500' },
        { name: '🛡️ Kas Cair', pct: 5, color: 'bg-indigo-500' }
      ];
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-xl relative overflow-hidden"
        >

          {/* Progress Indicators */}
          <div className="flex gap-2 mb-8 relative z-10">
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
            {/* STEP 1: WELCOME & NAME */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 dark:bg-teal-950/30 px-3 py-1 rounded-md inline-block font-mono">
                    👋 Selamat Datang di SiKaya
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                    Halo! Siapa nama panggilan Anda?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Mari kustomisasi pengalaman belajar finansial Anda agar lebih relevan dengan gaya hidup Anda.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block font-mono">Nama Panggilan Anda</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Contoh: Raka, Abel, Clara"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-teal-500 focus:bg-white transition-all font-display"
                    />
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 text-white rounded-xl text-sm font-semibold transition-all shadow-sm cursor-pointer"
                >
                  <span>Mulai Rencana Saya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: FINANCIAL GOALS */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2">
                    <Target className="w-6 h-6 text-teal-500" /> Apa tujuan finansial utama Anda?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Setiap orang memiliki impian berbeda. Pilih satu tujuan yang paling ingin Anda capai saat ini.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { id: 'darurat', label: '🛡️ Dana Darurat', desc: 'Membangun jaring pengaman keuangan aman.' },
                    { id: 'rumah', label: '🏠 Beli Rumah Baru', desc: 'Mempersiapkan DP rumah impian.' },
                    { id: 'pensiun', label: '🚀 Bebas Finansial', desc: 'Pensiun dini & merdeka keuangan.' },
                    { id: 'liburan', label: '✈️ Liburan Impian', desc: 'Menabung dana liburan tanpa utang.' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        goal === g.id
                          ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-500 text-teal-900 dark:text-teal-200 shadow-sm'
                          : 'bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <p className="font-extrabold text-xs">{g.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{g.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Lanjutkan</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: RISK TOLERANCE */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display flex items-center gap-2">
                    <Shield className="w-6 h-6 text-teal-500" /> Bagaimana profil risiko Anda?
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    Bagaimana perasaan Anda jika nilai portofolio Anda turun 10% dalam sehari?
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'konservatif', label: '🛡️ Konservatif (Sangat Amankan Pokok)', desc: 'Saya lebih memilih keuntungan kecil yang pasti, asalkan uang pokok saya tidak berkurang sama sekali.' },
                    { id: 'moderat', label: '⚖️ Moderat (Seimbang & Proporsional)', desc: 'Saya bisa menerima fluktuasi naik-turun jangka pendek asalkan dalam jangka panjang menghasilkan return di atas inflasi.' },
                    { id: 'agresif', label: '🚀 Agresif (Maksimalisasi Pertumbuhan)', desc: 'Saya siap menghadapi fluktuasi ekstrem dan penurunan tajam demi mendapatkan keuntungan berlipat ganda.' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRisk(r.id as any)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        risk === r.id
                          ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-500 text-teal-900 dark:text-teal-200 shadow-sm animate-pulse-subtle'
                          : 'bg-slate-50/50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <p className="font-extrabold text-xs">{r.label}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{r.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleBack}
                    className="px-5 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleNext}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <span>Hitung Alokasi Saya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: RECOMMENDATIONS REPORT */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sparkles className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-display">
                    Rencana Alokasi Finansial Anda!
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Berdasarkan profil risiko <strong className="text-slate-700 dark:text-slate-300 uppercase font-mono">{risk}</strong> dan tujuan <strong className="text-slate-700 dark:text-slate-300 uppercase font-mono">{goal}</strong> Anda:
                  </p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 font-mono">Rekomendasi Pembagian Aset:</p>
                  <div className="space-y-2">
                    {getRecommendedAllocation().map((item, idx) => (
                      <div key={idx} className="space-y-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span className="text-slate-700 dark:text-slate-300">{item.name}</span>
                          <span className="font-mono text-slate-900 dark:text-white">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleComplete}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-850 dark:bg-white dark:text-slate-950 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-black/10"
                >
                  <Check className="w-4 h-4" />
                  <span>Selesaikan Onboarding & Mulai</span>
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
