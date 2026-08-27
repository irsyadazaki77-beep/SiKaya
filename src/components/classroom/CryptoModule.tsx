import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function CryptoModule({ user, onComplete, completed }: ModuleProps) {
  const [cryptoQuizAnswers, setCryptoQuizAnswers] = useState<{ [key: number]: number }>({});
  const [cryptoQuizChecked, setCryptoQuizChecked] = useState(false);
  const [cryptoQuizScore, setCryptoQuizScore] = useState(0);

  const cryptoQuestions = [
    {
      id: 1,
      q: 'Seorang teman mengajakmu membeli token kripto baru bernama "MoonSafeDoge" karena harganya sangat murah (Rp 0,001) dan menjanjikan keuntungan 1000% besok. Apa yang harus kamu lakukan?',
      options: [
        { text: 'A. Beli langsung dengan dana darurat mumpung masih murah dan belum viral.', isCorrect: false },
        { text: 'B. Tolak. Ini kemungkinan besar adalah "shitcoin" atau scam (pump and dump) yang tidak memiliki fundamental teknologi jelas.', isCorrect: true }
      ],
      explanation: 'Token tanpa utilitas/proyek nyata, tim anonim, dan menjanjikan return fantastis instan biasanya adalah penipuan (scam).'
    },
    {
      id: 2,
      q: 'Kamu ingin berinvestasi panjang di Bitcoin. Di mana tempat terbaik untuk menyimpannya dengan aman dari peretas bursa (exchange hack)?',
      options: [
        { text: 'A. Tinggalkan saja semuanya di aplikasi bursa kripto (exchange) lokal.', isCorrect: false },
        { text: 'B. Simpan di "Cold Wallet" (Hardware Wallet) di mana kamu memegang penuh Private Key (Not your keys, not your coins).', isCorrect: true }
      ],
      explanation: 'Bursa kripto bisa diretas atau bangkrut. Untuk investasi jangka panjang dan nominal besar, Hardware Wallet adalah yang paling aman.'
    }
  ];

  const handleCryptoQuizOptionSelect = (qId: number, optIndex: number) => {
    if (cryptoQuizChecked) return;
    setCryptoQuizAnswers({
      ...cryptoQuizAnswers,
      [qId]: optIndex
    });
  };

  const handleCheckCryptoQuiz = () => {
    let correctCount = 0;
    cryptoQuestions.forEach((q) => {
      const selectedOptIndex = cryptoQuizAnswers[q.id];
      if (selectedOptIndex !== undefined && q.options[selectedOptIndex].isCorrect) {
        correctCount++;
      }
    });
    setCryptoQuizScore(correctCount);
    setCryptoQuizChecked(true);
  };

  const handleResetCryptoQuiz = () => {
    setCryptoQuizAnswers({});
    setCryptoQuizChecked(false);
    setCryptoQuizScore(0);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-amber-50 border border-amber-100 rounded-full text-amber-700 text-[10px] font-black uppercase dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900">
            Crypto & Web3
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-sans tracking-tight">Fundamental Kripto & Menghindari Penipuan (Scam)</h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Pasar aset kripto menjanjikan return tinggi namun dibarengi risiko yang sangat ekstrem. Banyak oknum tidak bertanggung jawab meluncurkan token bodong (shitcoins) dan iming-iming investasi berkedok kripto. Modul ini membantumu memahami fundamental aset digital dan cara menghindari scam kripto.
        </p>
        <div className="bg-amber-50 border border-amber-200/50 p-3.5 rounded-xl text-xs text-amber-800 flex items-start gap-2.5 mt-3 dark:bg-amber-950/20 dark:border-amber-900/40 dark:text-amber-350">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-600" />
          <p className="leading-relaxed">
            <strong className="font-extrabold text-amber-950 dark:text-amber-200">⚠️ Peringatan Risiko:</strong> Kripto adalah instrumen berisiko sangat tinggi (High Risk). Jangan pernah menggunakan uang panas, uang pinjaman (pinjol), atau seluruh dana daruratmu untuk berinvestasi di aset kripto.
          </p>
        </div>
      </div>

      {/* Quiz Module Form */}
      <div className="space-y-6">
        {cryptoQuestions.map((q, qIndex) => {
          const selectedOptIndex = cryptoQuizAnswers[q.id];
          return (
            <div key={q.id} className="p-5 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50/40 dark:bg-slate-900/20 space-y-4">
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 leading-relaxed flex gap-2">
                <span className="text-teal-600 font-black">{qIndex + 1}.</span> {q.q}
              </h4>
              <div className="space-y-2">
                {q.options.map((opt, optIndex) => {
                  const isSelected = selectedOptIndex === optIndex;
                  let btnStyle = 'border-slate-250 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                  
                  if (isSelected) {
                    if (cryptoQuizChecked) {
                      btnStyle = opt.isCorrect 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/20 dark:border-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/10' 
                        : 'bg-rose-50 border-rose-400 text-rose-850 dark:bg-rose-950/20 dark:border-rose-700 dark:text-rose-300 ring-2 ring-rose-500/10';
                    } else {
                      btnStyle = 'bg-teal-50 border-teal-500 text-teal-850 dark:bg-teal-950/20 dark:border-teal-700 dark:text-teal-300 ring-2 ring-teal-500/10';
                    }
                  } else if (cryptoQuizChecked && opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/10 dark:border-emerald-800 dark:text-emerald-350';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleCryptoQuizOptionSelect(q.id, optIndex)}
                      className={`w-full p-3.5 text-left text-xs font-semibold border rounded-xl transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {cryptoQuizChecked && (
                <div className="mt-3.5 pt-3.5 border-t border-slate-150/50 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">💡 Penjelasan Literasi:</span>
                  {q.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Source attribution */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl mt-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> Sumber Referensi Materi
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Bitcoin: A Peer-to-Peer Electronic Cash System</strong> (Satoshi Nakamoto, 2008)</p>
          <p>• <strong>Otoritas Jasa Keuangan (OJK)</strong> - Satgas Waspada Investasi tentang Ciri-Ciri Investasi Bodong Berkedok Kripto.</p>
        </div>
      </div>

      {/* Check and Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
        {cryptoQuizChecked ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 text-slate-850 dark:text-slate-300 rounded-lg">
              Skor Kuis: {cryptoQuizScore} / {cryptoQuestions.length}
            </span>
            <button
              onClick={handleResetCryptoQuiz}
              className="text-xs font-bold text-teal-600 hover:text-teal-500 underline cursor-pointer"
            >
              Ulangi Kuis
            </button>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex gap-3">
          {!cryptoQuizChecked && (
            <button
              onClick={handleCheckCryptoQuiz}
              disabled={Object.keys(cryptoQuizAnswers).length < cryptoQuestions.length}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-850 text-white text-xs font-black rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Periksa Jawaban Kuis
            </button>
          )}

          {cryptoQuizChecked && (
            <button
              onClick={() => onComplete('crypto')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {completed ? 'Simpan & Lanjut Modul 7' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
