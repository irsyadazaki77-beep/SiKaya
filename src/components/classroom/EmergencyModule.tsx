import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function EmergencyModule({ onComplete, completed }: ModuleProps) {
  const [emergencyExpenses, setEmergencyExpenses] = useState<number>(3000000); // Default Rp 3.000.000 / month
  const [emergencyDependents, setEmergencyDependents] = useState<'single' | 'married' | 'family'>('single');
  const [emergencySaved, setEmergencySaved] = useState<number>(1500000); // Saved currently
  const [activeScenario, setActiveScenario] = useState<{ title: string; cost: number; desc: string } | null>(null);
  const [scenarioTested, setScenarioTested] = useState<boolean>(false);
  const [testOutcome, setTestOutcome] = useState<{ status: 'success' | 'fail'; message: string } | null>(null);

  const getTargetEmergencyFund = () => {
    let multiplier = 6;
    if (emergencyDependents === 'married') multiplier = 9;
    if (emergencyDependents === 'family') multiplier = 12;
    return emergencyExpenses * multiplier;
  };

  const runCrisisSimulation = (forcedIdx?: number) => {
    const scenarios = [
      {
        title: '💻 Gawai Utama Rusak Total!',
        getCost: (exp: number) => Math.max(2500000, Math.round(exp * 1.2)),
        desc: 'Laptop atau HP utama yang kamu pakai untuk kerja freelance, kuliah, atau jualan online tiba-tiba mati total dan butuh ganti cepat agar kamu tidak kehilangan pemasukan.'
      },
      {
        title: '🤒 Penanganan Medis Mendadak!',
        getCost: (exp: number) => Math.max(1500000, Math.round(exp * 0.8)),
        desc: 'Kamu mengalami sakit mendadak yang membutuhkan tindakan medis darurat segera di klinik khusus yang tidak ter-cover penuh oleh BPJS atau asuransi.'
      },
      {
        title: '🏚️ Kerusakan Tempat Tinggal!',
        getCost: (exp: number) => Math.max(1000000, Math.round(exp * 0.6)),
        desc: 'Hujan badai semalaman merusak atap kamar tidurmu. Semua peralatan elektronik terancam rusak, sehingga kamu harus segera membayar kontraktor untuk perbaikan cepat.'
      },
      {
        title: '🏍️ Kecelakaan Ringan & Servis Kendaraan!',
        getCost: (exp: number) => Math.max(1200000, Math.round(exp * 0.7)),
        desc: 'Motor kesayanganmu yang menjadi andalan transport harian mengalami kerusakan mesin parah. Kendaraan ini wajib diperbaiki agar kamu bisa tetap produktif bekerja/kuliah.'
      },
      {
        title: '💼 Pemutusan Kontrak Proyek Freelance (PHK)!',
        getCost: (exp: number) => exp * 3, // 3 months of expenses
        desc: 'Klien utama tempatmu mengandalkan pemasukan tiba-tiba membatalkan kontrak sepihak. Kamu kehilangan seluruh income bulanan dan butuh biaya hidup 3 bulan ke depan selagi mencari proyek baru.'
      }
    ];

    const randomIdx = Math.floor(Math.random() * scenarios.length);
    const selectedIdx = forcedIdx !== undefined ? forcedIdx : randomIdx;
    const selected = scenarios[selectedIdx];
    const computedCost = selected.getCost(emergencyExpenses);

    setActiveScenario({
      title: selected.title,
      cost: computedCost,
      desc: selected.desc
    });

    const isEnough = emergencySaved >= computedCost;
    if (isEnough) {
      setTestOutcome({
        status: 'success',
        message: `Hebat! Dana darurat yang kamu kumpulkan sebesar Rp ${emergencySaved.toLocaleString('id-ID')} CUKUP untuk menutup biaya darurat sebesar Rp ${computedCost.toLocaleString('id-ID')}. Kamu berhasil melewati badai finansial ini tanpa perlu berutang ke pinjol atau melikuidasi investasi sahammu di harga rugi! 😎`
      });
    } else {
      const shortage = computedCost - emergencySaved;
      setTestOutcome({
        status: 'fail',
        message: `Aduh! Dana daruratmu (Rp ${emergencySaved.toLocaleString('id-ID')}) kurang sebesar Rp ${shortage.toLocaleString('id-ID')} untuk membayar tagihan mendadak ini (Rp ${computedCost.toLocaleString('id-ID')}). Tanpa dana darurat yang siap cair, kamu terpaksa meminjam uang di platform pinjol berbunga tinggi atau menjual investasi portofoliomu saat harga pasar sedang hancur. Mulai sekarang, yuk utamakan pondasi dana darurat terlebih dahulu! ⚠️`
      });
    }
    setScenarioTested(true);
  };

  return (
    <ClassroomModuleLayout
      category="Pondasi Finansial"
      title="Dana Darurat (Emergency Fund) & Uji Stres Krisis"
      description="Banyak influencer finansial menyuruh langsung terjun bebas berinvestasi saham, trading harian, atau membeli kripto tanpa memiliki dana darurat. Ini sangat menyesatkan dan berbahaya! Dana darurat adalah pondasi keuangan mutlak. Sebelum menaruh uang sepeser pun di instrumen berisiko, pastikan kamu memiliki tabungan cair terpisah."
      completed={completed}
    >
      {/* Interactive Simulator Card */}
      <div className="grid md:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/15 p-5 sm:p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80">
        
        {/* Inputs area */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Langkah 1: Konfigurasi Profilmu</h4>

            {/* Monthly Expenses */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Pengeluaran Bulanan Nyata:</span>
                <span className="text-teal-600 font-extrabold">Rp {emergencyExpenses.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="15000000"
                step="500000"
                value={emergencyExpenses}
                onChange={(e) => {
                  setEmergencyExpenses(parseInt(e.target.value));
                  setScenarioTested(false);
                  setActiveScenario(null);
                }}
                className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />
              <p className="text-[10px] text-slate-400 font-medium">Meliputi makan, kos/sewa, pulsa, transport, dan tagihan wajib.</p>
            </div>

            {/* Dependents / Status Selector */}
            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Status Pernikahan & Tanggungan:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEmergencyDependents('single');
                    setScenarioTested(false);
                    setActiveScenario(null);
                  }}
                  className={`py-2 px-1 text-center border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    emergencyDependents === 'single' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450'
                  }`}
                >
                  Single (6x)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmergencyDependents('married');
                    setScenarioTested(false);
                    setActiveScenario(null);
                  }}
                  className={`py-2 px-1 text-center border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    emergencyDependents === 'married' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450'
                  }`}
                >
                  Menikah (9x)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEmergencyDependents('family');
                    setScenarioTested(false);
                    setActiveScenario(null);
                  }}
                  className={`py-2 px-1 text-center border rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                    emergencyDependents === 'family' ? 'bg-teal-500 text-white border-teal-500' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450'
                  }`}
                >
                  Keluarga (12x)
                </button>
              </div>
            </div>
          </div>

          {/* Target Display */}
          <div className="p-3.5 bg-teal-50 border border-teal-500/15 dark:bg-teal-950/20 dark:border-teal-900/40 rounded-xl flex justify-between items-center text-xs mt-4">
            <span className="font-bold text-teal-850 dark:text-teal-400">Target Dana Darurat Ideal:</span>
            <span className="font-black text-teal-600 text-sm">Rp {getTargetEmergencyFund().toLocaleString('id-ID')}</span>
          </div>
        </div>

        {/* Simulation actions and results area */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Langkah 2: Uji Stres Keuanganmu</h4>

            {/* How much they actually have saved slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                <span>Dana Darurat yang Kamu Miliki:</span>
                <span className="text-indigo-600 font-extrabold">Rp {emergencySaved.toLocaleString('id-ID')}</span>
              </div>
              <input
                type="range"
                min="0"
                max="30000000"
                step="500000"
                value={emergencySaved}
                onChange={(e) => {
                  setEmergencySaved(parseInt(e.target.value));
                  setScenarioTested(false);
                  setActiveScenario(null);
                }}
                className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
              />
            </div>

            {/* Simulation trigger button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => runCrisisSimulation()}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white font-extrabold rounded-xl text-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                🚨 JALANKAN UJI STRES KRISIS ACAK
              </button>

              {/* Specific Crisis Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Atau Pilih Skenario Krisis Spesifik:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => runCrisisSimulation(0)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50/50 text-[10px] font-extrabold transition-all text-left text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    💻 Gawai Rusak
                  </button>
                  <button
                    type="button"
                    onClick={() => runCrisisSimulation(1)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50/50 text-[10px] font-extrabold transition-all text-left text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    🤒 Sakit Mendadak
                  </button>
                  <button
                    type="button"
                    onClick={() => runCrisisSimulation(2)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50/50 text-[10px] font-extrabold transition-all text-left text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    🏚️ Atap Bocor
                  </button>
                  <button
                    type="button"
                    onClick={() => runCrisisSimulation(3)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50/50 text-[10px] font-extrabold transition-all text-left text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    🏍️ Motor Mogok
                  </button>
                  <button
                    type="button"
                    onClick={() => runCrisisSimulation(4)}
                    className="p-2 border border-slate-200 dark:border-slate-800 hover:border-teal-500 rounded-xl bg-white dark:bg-slate-900 hover:bg-teal-50/50 text-[10px] font-extrabold transition-all text-left text-slate-700 dark:text-slate-300 col-span-2 text-center cursor-pointer"
                  >
                    💼 Kehilangan Pekerjaan (PHK Kontrak)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Scenario Output Box */}
          {activeScenario && (
            <div className="p-4 bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800 rounded-xl space-y-2.5 text-xs mt-3 shadow-xs">
              <div className="flex justify-between items-center font-extrabold">
                <span className="text-rose-600 dark:text-rose-400">{activeScenario.title}</span>
                <span className="text-slate-800 dark:text-slate-250 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[10px]">Biaya: Rp {activeScenario.cost.toLocaleString('id-ID')}</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed font-medium">{activeScenario.desc}</p>
              
              {testOutcome && (
                <div className={`p-3 rounded-lg border text-[11px] font-bold leading-relaxed ${
                  testOutcome.status === 'success' 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-300 dark:border-emerald-900/40' 
                    : 'bg-rose-50 text-rose-800 border-rose-100 dark:bg-rose-950/20 dark:text-rose-350 dark:border-rose-900/40'
                }`}>
                  {testOutcome.message}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Source attribution */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl mt-6 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Sumber Referensi Materi
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Standar Certified Financial Planner (CFP)</strong> - Panduan alokasi dana darurat (3-6x untuk lajang, 9-12x untuk keluarga).</p>
        </div>
      </div>

      {/* Complete Module Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={() => onComplete('emergency')}
          disabled={!scenarioTested}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          {completed ? 'Simpan & Lanjut Modul 6' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </ClassroomModuleLayout>
  );
}
