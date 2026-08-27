import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function CompoundModule({ user, onComplete, completed }: ModuleProps) {
  const [monthlyInvest, setMonthlyInvest] = useState(500000); // Rp 500,000 / month
  const [annualRate, setAnnualRate] = useState(10); // 10% interest (average mutual fund index)
  
  // Compute compounding over 10 years
  const generateCompoundData = () => {
    const data = [];
    let compoundedTotal = 0;
    let manualSavedTotal = 0;
    const ratePerMonth = (annualRate / 100) / 12;

    for (let year = 0; year <= 10; year++) {
      if (year === 0) {
        data.push({
          year: 'Mulai',
          TabunganBiasa: 0,
          InvestasiCompound: 0
        });
      } else {
        // Run monthly simulation for 12 months
        for (let m = 0; m < 12; m++) {
          manualSavedTotal += monthlyInvest;
          compoundedTotal = (compoundedTotal + monthlyInvest) * (1 + ratePerMonth);
        }
        data.push({
          year: `Thn ${year}`,
          TabunganBiasa: Math.round(manualSavedTotal),
          InvestasiCompound: Math.round(compoundedTotal)
        });
      }
    }
    return data;
  };

  const compoundData = generateCompoundData();
  const finalCompounded = compoundData[compoundData.length - 1].InvestasiCompound;
  const finalSavings = compoundData[compoundData.length - 1].TabunganBiasa;
  const compoundInterestEarned = finalCompounded - finalSavings;

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 text-[10px] font-black uppercase dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900">
            Pertumbuhan Aset
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-sans tracking-tight">
          Keajaiban Bunga Majemuk (Compound Interest)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Albert Einstein konon menyebut <em>Compound Interest</em> (bunga majemuk) sebagai keajaiban dunia ke-8. Konsepnya sederhana: hasil imbal balik (return) yang kamu dapatkan diinvestasikan kembali agar terus melipatgandakan nilai asetmu dari waktu ke waktu bagaikan bola salju.
        </p>

        {/* Anti-misleading alert note */}
        <div className="bg-amber-50 border border-amber-200/50 p-3.5 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 mt-3 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-350">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <p className="leading-relaxed">
            <strong className="font-extrabold text-amber-950 dark:text-amber-200">⚠️ Catatan Transparan (Anti-Misleading):</strong> Di dunia investasi nyata (seperti saham atau reksa dana), return <strong>TIDAK PERNAH dijamin tetap atau linear</strong> setiap bulannya seperti diagram simulasi halus di bawah. Ada kalanya nilai pasar turun (fluktuasi negatif). Simulasi 10% per tahun di bawah adalah contoh rata-rata kinerja historis jangka panjang pasar modal, bukan kepastian return pasif yang konstan.
          </p>
        </div>
      </div>

      {/* Sliders for compound simulator */}
      <div className="grid sm:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-900/15 p-5 rounded-2xl border border-slate-150 dark:border-slate-850">
        <div className="space-y-4">
          <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Atur Parameter Investasi</h4>
          
          {/* Monthly Investment Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span>Investasi Per Bulan</span>
              <span className="text-teal-600 font-extrabold">Rp {monthlyInvest.toLocaleString('id-ID')}</span>
            </div>
            <input
              type="range"
              min="100000"
              max="2000000"
              step="50000"
              value={monthlyInvest}
              onChange={(e) => setMonthlyInvest(parseInt(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Growth Rate Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-bold text-slate-600 dark:text-slate-400">
              <span>Estimasi Imbal Hasil (p.a.)</span>
              <span className="text-indigo-600 font-extrabold">{annualRate}% per tahun</span>
            </div>
            <input
              type="range"
              min="4"
              max="18"
              step="1"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseInt(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Dynamic Info Card */}
          <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[10px] sm:text-xs font-semibold text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span className="dark:text-slate-400">Total Tabungan Manual (10 Thn):</span>
              <span className="text-slate-800 dark:text-slate-200 font-extrabold">Rp {finalSavings.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <span className="dark:text-slate-400">Total Hasil Compounding:</span>
              <span className="text-teal-600 font-black">Rp {finalCompounded.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-850 font-bold text-emerald-600">
              <span>Keuntungan Tambahan (Bunga):</span>
              <span>+Rp {compoundInterestEarned.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </div>

        {/* Graph Visualization Container */}
        <div className="h-[220px] w-full bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800">
          <p className="text-[9px] font-bold text-slate-400 uppercase text-center mb-1">Simulasi Compounding 10 Tahun</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={compoundData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="year" tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(val) => `Rp ${(val/1e6).toFixed(1)}J`} />
              <Tooltip formatter={(value: any) => `Rp ${value.toLocaleString('id-ID')}`} contentStyle={{ fontSize: 10, borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 9, paddingTop: 5 }} />
              <Area type="monotone" dataKey="TabunganBiasa" name="Biasa" stroke="#94a3b8" fill="#e2e8f0" fillOpacity={0.2} />
              <Area type="monotone" dataKey="InvestasiCompound" name="Bunga Majemuk" stroke="#0d9488" fill="#ccfbf1" fillOpacity={0.4} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Source attribution */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl mt-6 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Sumber Referensi Materi
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>The Intelligent Investor</strong> (Benjamin Graham) - Prinsip fundamental investasi jangka panjang.</p>
          <p>• <strong>Bursa Efek Indonesia (BEI)</strong> - Data historis rata-rata IHSG dan kampanye "Yuk Nabung Saham".</p>
        </div>
      </div>

      {/* Complete Module Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={() => onComplete('compound')}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          {completed ? 'Simpan & Lanjut Modul 4' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
