import { useState } from 'react';
import { BookOpen, ArrowRight } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function InvestingModule({ user, onComplete, completed }: ModuleProps) {
  const [riskQ1, setRiskQ1] = useState<string>('');
  const [riskQ2, setRiskQ2] = useState<string>('');
  const [riskQ3, setRiskQ3] = useState<string>('');
  const [riskSubmitted, setRiskSubmitted] = useState(false);

  const getRiskProfile = () => {
    if (riskQ3 === 'A') {
      return {
        title: 'Jangka Sangat Pendek (Pecinta Keamanan Likuiditas 🛡️)',
        desc: 'Karena kamu akan menggunakan uang ini dalam waktu kurang dari 1 tahun, sangat berisiko menaruhnya di saham karena fluktuasi jangka pendek sangat tinggi! Pilihan terbaik dan aman adalah Reksa Dana Pasar Uang (RDPU) atau Deposito Syariah/Biasa yang stabil dan mudah cair kapan saja tanpa denda.',
        allocation: '90% RDPU, 10% Tabungan Bank'
      };
    }

    if (riskQ1 === 'A' && riskQ2 === 'A') {
      return {
        title: 'Konservatif (Pecinta Ketenangan 🕊️)',
        desc: 'Kamu sangat tidak suka melihat nilai portofoliomu turun walau sedikit. Pilihan instrumen investasi terbaik untukmu adalah Reksa Dana Pasar Uang (RDPU) atau Surat Berharga Negara (SBN) yang dijamin pemerintah 100%.',
        allocation: '80% RDPU, 20% Emas Digital'
      };
    } else if (riskQ1 === 'C' && riskQ2 === 'C' && riskQ3 === 'C') {
      return {
        title: 'Agresif (Si Pemberani Saham Jangka Panjang 🦁)',
        desc: 'Kamu paham bahwa keuntungan tinggi diikuti risiko tinggi (High Risk High Return). Dengan horizon waktu panjang (>5 tahun), gejolak pasar saat ini adalah kesempatan emas bagimu untuk meraih pertumbuhan maksimal.',
        allocation: '75% Reksa Dana Saham/Indeks, 15% Obligasi Negara, 10% Emas Digital'
      };
    } else {
      return {
        title: 'Moderat (Si Penyeimbang Tengah ⚖️)',
        desc: 'Kamu ingin keuntungan di atas inflasi, tapi masih cemas jika pasar bergejolak ekstrem. Diversifikasi adalah kuncimu untuk menyebarkan risiko.',
        allocation: '50% Reksa Dana Obligasi, 30% Indeks Saham, 20% RDPU'
      };
    }
  };

  const riskProfile = getRiskProfile();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-700 text-[10px] font-black uppercase dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900">
            Tipe Investor
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white">Menemukan Profil Risiko & Alokasi Aset Pertama</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Tidak ada satu instrumen investasi yang cocok untuk semua orang. Profil risiko menentukan seberapa kuat emosimu menghadapi fluktuasi harga pasar. Mari isi evaluasi kilat untuk mencocokkan kepribadianmu:
        </p>
      </div>

      {/* Risk profiler questions */}
      <div className="space-y-5 bg-slate-50 dark:bg-slate-900/10 p-5 rounded-2xl border border-slate-150 dark:border-slate-850">
        {/* Question 1 */}
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">1. Jika portofolio investasimu turun 15% dalam waktu 2 hari karena gejolak pasar global, apa tindakan utamamu?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => { setRiskQ1('A'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ1 === 'A' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              A. Langsung panik, jual semua aset yang tersisa agar tidak rugi makin dalam. 😨
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ1('B'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ1 === 'B' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              B. Tetap tenang, tunggu pasar stabil karena paham pasar selalu pulih kembali. ⚖️
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ1('C'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ1 === 'C' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              C. Girang! Momen diskon pasar untuk borong lebih banyak reksa dana & saham murah! 🚀
            </button>
          </div>
        </div>

        {/* Question 2 */}
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">2. Apa tujuan utama kamu dalam berinvestasi?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => { setRiskQ2('A'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ2 === 'A' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              A. Menjaga nilai uang agar aman dari inflasi, pertumbuhan pelan tidak masalah. 🕊️
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ2('B'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ2 === 'B' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              B. Mengumpulkan dana pendidikan atau DP rumah dalam jangka waktu 3-5 tahun. ⚖️
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ2('C'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ2 === 'C' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              C. Meraih kebebasan finansial total (F.I.R.E) dalam jangka panjang 10+ tahun. 🦁
            </button>
          </div>
        </div>

        {/* Question 3 */}
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200">3. Berapa lama horizon waktu (rencana jangka waktu) kamu berinvestasi sebelum dana tersebut ditarik kembali?</p>
          <div className="grid sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => { setRiskQ3('A'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ3 === 'A' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              A. Kurang dari 1 tahun (Jangka Sangat Pendek, untuk bayar SPP atau liburan dekat). ⏱️
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ3('B'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ3 === 'B' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              B. 1 hingga 5 tahun (Jangka Menengah, contoh untuk DP rumah atau modal nikah). ⚖️
            </button>
            <button
              type="button"
              onClick={() => { setRiskQ3('C'); setRiskSubmitted(false); }}
              className={`p-3 text-left border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                riskQ3 === 'C' ? 'bg-white dark:bg-slate-900 border-teal-500 ring-2 ring-teal-500/10 text-teal-850 dark:text-teal-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              C. Lebih dari 5 tahun (Jangka Panjang, tabungan masa pensiun atau kebebasan finansial). 🦁
            </button>
          </div>
        </div>

        {/* Action matching button */}
        <button
          type="button"
          onClick={() => setRiskSubmitted(true)}
          disabled={!riskQ1 || !riskQ2 || !riskQ3}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          Analisis Tipe Profil Risiko Saya
        </button>

        {/* Result output box */}
        {riskSubmitted && (
          <div className="p-5 bg-white dark:bg-slate-900 border border-teal-500/40 rounded-2xl space-y-3 shadow-xs">
            <div>
              <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest">TIPE PROFIL KAMU:</p>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">{riskProfile.title}</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{riskProfile.desc}</p>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs">
              <span className="font-bold text-slate-600 dark:text-slate-400">Saran Alokasi Aset Belajar:</span>
              <span className="px-2.5 py-1 bg-teal-50 border border-teal-100 rounded-lg text-teal-700 dark:bg-teal-950/30 dark:border-teal-900/40 dark:text-teal-400 font-black text-[11px]">
                {riskProfile.allocation}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Source attribution */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl mt-6 mb-4">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Sumber Referensi Materi
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Modern Portfolio Theory</strong> (Harry Markowitz) - Teori diversifikasi investasi dan manajemen portofolio berdasarkan tingkat toleransi risiko.</p>
        </div>
      </div>

      {/* Complete Module Button */}
      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          onClick={() => onComplete('investing')}
          disabled={!riskSubmitted}
          className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 disabled:opacity-45 disabled:cursor-not-allowed cursor-pointer"
        >
          {completed ? 'Simpan & Lanjut Modul 5' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
