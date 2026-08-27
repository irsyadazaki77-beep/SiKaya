import { useState } from 'react';
import { BookOpen, AlertTriangle, ArrowRight } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function DebtModule({ user, onComplete, completed }: ModuleProps) {
  const quizQuestions = [
    {
      id: 1,
      q: 'Teman se-geng mengajak kamu nonton konser internasional seharga Rp 2.500.000 dengan sistem "Paylater" cicilan bunga 12% per bulan. Kamu tidak punya tabungan sekarang. Apa tindakanmu?',
      options: [
        { text: 'A. Ambil paylater, mumpung konser sekali seumur hidup. Masalah bayar dipikir belakangan biar gak FOMO.', isCorrect: false },
        { text: 'B. Menolak dengan sopan. Konser adalah keinginan ("wants"), bukan kebutuhan primer. Berhutang untuk konsumsi gaya hidup dengan bunga tinggi adalah jebakan finansial.', isCorrect: true }
      ],
      explanation: 'Paylater atau utang konsumtif untuk kebutuhan non-mendesak dengan bunga tinggi adalah awal petaka finansial Gen Z. Selalu beli keinginan menggunakan dana dingin yang sudah ditabung sebelumnya!'
    },
    {
      id: 2,
      q: 'Kamu melihat iklan di sosial media yang menawarkan pinjaman instan tanpa KTP rumit, cair dalam 5 menit, tapi tidak ada logo OJK (Otoritas Jasa Keuangan) di website-nya. Bagaimana kamu merespon?',
      options: [
        { text: 'A. Langsung ajukan pinjaman buat ganti HP baru, mumpung syaratnya gampang banget.', isCorrect: false },
        { text: 'B. Segera abaikan dan laporkan ke OJK. Pinjol ilegal memeras peminjam dengan bunga mencekik, denda harian tidak masuk akal, serta ancaman sebar data pribadi.', isCorrect: true }
      ],
      explanation: 'Pinjol ilegal tidak terdaftar OJK dan menggunakan taktik intimidasi serta peretasan kontak ponsel untuk menagih. Jangan pernah menyentuh platform pinjaman non-OJK!'
    }
  ];

  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const handleQuizOptionSelect = (qId: number, optIndex: number) => {
    if (quizChecked) return;
    setQuizAnswers({
      ...quizAnswers,
      [qId]: optIndex
    });
  };

  const handleCheckQuiz = () => {
    let correctCount = 0;
    quizQuestions.forEach((q) => {
      const selectedOptIndex = quizAnswers[q.id];
      if (selectedOptIndex !== undefined && q.options[selectedOptIndex].isCorrect) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizChecked(true);
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setQuizChecked(false);
    setQuizScore(0);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-rose-50 border border-rose-100 rounded-full text-rose-700 text-[10px] font-black uppercase dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900">
            Mengelola Utang
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white font-sans tracking-tight">
          Kelola Utang: Anti-FOMO & Pinjol Ilegal
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Kemudahan akses kredit di era digital ibarat pisau bermata dua. Paylater dan aplikasi pinjaman online (pinjol) ilegal siap menjebak keuanganmu jika digunakan tanpa pertimbangan matang.
        </p>

        {/* Educational Box Productive vs Consumptive Debt */}
        <div className="grid sm:grid-cols-2 gap-4 mt-3 bg-teal-50/20 dark:bg-slate-900/40 border border-teal-500/15 dark:border-slate-800 p-4 rounded-xl text-xs">
          <div className="space-y-1">
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">📈 Utang Produktif</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Utang yang digunakan untuk membeli aset yang nilainya meningkat atau menghasilkan arus kas positif. Contoh: Mengambil cicilan laptop untuk menunjang pekerjaan freelance desain grafis, atau pinjaman modal bisnis mikro yang terukur keuntungannya melebihi bunga pinjaman.
            </p>
          </div>
          <div className="space-y-1">
            <span className="font-extrabold text-rose-700 dark:text-rose-400 flex items-center gap-1">📉 Utang Konsumtif</span>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Utang untuk membeli barang habis pakai yang nilainya menyusut dan tidak menambah pendapatan. Contoh: Menggunakan paylater atau pinjol untuk membeli baju baru demi OOTD, tiket konser FOMO, ganti HP demi gengsi, atau nongkrong elit di coffee shop. Ini adalah jebakan kemiskinan instan!
            </p>
          </div>
        </div>

        <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-3">
          Uji pemahamanmu dengan menjawab skenario kuis di bawah ini secara bijak:
        </p>
      </div>

      {/* Quiz Module Form */}
      <div className="space-y-6">
        {quizQuestions.map((q, qIndex) => {
          const selectedOptIndex = quizAnswers[q.id];
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
                    if (quizChecked) {
                      btnStyle = opt.isCorrect 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/20 dark:border-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/10' 
                        : 'bg-rose-50 border-rose-400 text-rose-850 dark:bg-rose-950/20 dark:border-rose-700 dark:text-rose-300 ring-2 ring-rose-500/10';
                    } else {
                      btnStyle = 'bg-teal-50 border-teal-500 text-teal-850 dark:bg-teal-950/20 dark:border-teal-700 dark:text-teal-300 ring-2 ring-teal-500/10';
                    }
                  } else if (quizChecked && opt.isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/10 dark:border-emerald-800 dark:text-emerald-350';
                  }

                  return (
                    <button
                      key={optIndex}
                      type="button"
                      onClick={() => handleQuizOptionSelect(q.id, optIndex)}
                      className={`w-full p-3.5 text-left text-xs font-semibold border rounded-xl transition-all cursor-pointer ${btnStyle}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {/* Display explanation if checked */}
              {quizChecked && (
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
          <p>• <strong>Otoritas Jasa Keuangan (OJK)</strong> - Literasi terkait Pinjaman Online Ilegal dan Edukasi Utang Konsumtif vs Produktif.</p>
        </div>
      </div>

      {/* Check and Action Buttons */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/85">
        {quizChecked ? (
          <div className="flex items-center gap-2">
            <span className="text-xs font-black px-3 py-1.5 bg-slate-100 dark:bg-slate-900 border dark:border-slate-800 text-slate-800 dark:text-slate-300 rounded-lg">
              Skor Kuis: {quizScore} / {quizQuestions.length}
            </span>
            <button
              onClick={handleResetQuiz}
              className="text-xs font-bold text-teal-600 hover:text-teal-500 underline cursor-pointer"
            >
              Ulangi Kuis
            </button>
          </div>
        ) : (
          <div></div>
        )}

        <div className="flex gap-3">
          {!quizChecked && (
            <button
              onClick={handleCheckQuiz}
              disabled={Object.keys(quizAnswers).length < quizQuestions.length}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Periksa Jawaban Kuis
            </button>
          )}

          {quizChecked && (
            <button
              onClick={() => onComplete('debt')}
              className="px-6 py-3 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl hover:shadow-lg hover:shadow-teal-600/15 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {completed ? 'Simpan & Lanjut Modul 3' : 'Selesaikan Modul & Ambil +100 XP'} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
