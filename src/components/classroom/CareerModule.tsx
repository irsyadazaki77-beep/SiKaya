import { useState } from 'react';
import { BookOpen, HelpCircle, ArrowRight, Lightbulb, Wallet } from 'lucide-react';
import { User } from '../../context/AuthContext';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

interface CareerOption {
  title: string;
  salary: number; // IDR per month
  skills: string[];
  desc: string;
}

export function CareerModule({ user, onComplete, completed }: ModuleProps) {
  const [selectedCareer, setSelectedCareer] = useState<string>('SWE');
  const [savingsRate, setSavingsRate] = useState<number>(30); // 30% savings rate
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizChecked, setQuizChecked] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const careers: { [key: string]: CareerOption } = {
    SWE: {
      title: '💻 Software Engineer / Developer',
      salary: 12000000,
      skills: ['React', 'TypeScript', 'Node.js', 'SQL Database', 'Problem Solving'],
      desc: 'Membangun aplikasi web/mobile. Tingginya permintaan digitalisasi korporat dan startup membuat karir ini menawarkan gaji awal tinggi serta skalabilitas karir global.'
    },
    UIX: {
      title: '🎨 UI/UX Designer',
      salary: 9500000,
      skills: ['Figma', 'Wireframing', 'User Research', 'Typography', 'Prototyping'],
      desc: 'Mendesain tampilan dan pengalaman pengguna pada aplikasi digital. Sangat krusial agar pengguna betah memakai produk digital tanpa pusing.'
    },
    DMK: {
      title: '🚀 Digital Marketer / Growth Specialist',
      salary: 8000000,
      skills: ['SEO/SEM', 'Meta & Google Ads', 'Copywriting', 'Google Analytics'],
      desc: 'Meningkatkan penjualan dan exposure produk digital lewat strategi marketing internet berbayar maupun organik.'
    },
    WRT: {
      title: '✍️ Technical / Copy Writer',
      salary: 7000000,
      skills: ['SEO Copywriting', 'Content Strategy', 'Editing', 'English Fluency'],
      desc: 'Menulis konten edukasi, artikel SEO, hingga panduan aplikasi teknis yang mudah dimengerti khalayak luas.'
    }
  };

  const activeCareer = careers[selectedCareer];
  const monthlySavings = (activeCareer.salary * savingsRate) / 100;
  const yearlySavings = monthlySavings * 12;

  // Time to reach 100M IDR emergency fund (in months)
  const monthsTo100M = Math.ceil(100000000 / monthlySavings);
  const yearsTo100M = (monthsTo100M / 12).toFixed(1);

  const questions = [
    {
      id: 1,
      q: 'Mengapa meningkatkan "Active Income" (pendapatan aktif) lewat belajar high-income skill lebih penting dibanding sekadar berhemat secara ekstrem bagi anak muda?',
      options: [
        { text: 'A. Karena berhemat ekstrem mematikan kreativitas dan pertumbuhan karir, sementara porsi tabungan dari gaji besar jauh lebih besar dibanding sisa hasil berhemat dari gaji kecil.', isCorrect: true },
        { text: 'B. Karena jika gaji besar kita wajib berfoya-foya membeli mobil mewah baru secara kredit.', isCorrect: false },
        { text: 'C. Karena pendapatan aktif pasti dikirim langsung oleh pemerintah setiap bulan.', isCorrect: false }
      ],
      explanation: 'Berhemat memiliki batas bawah (kamu tidak bisa memotong biaya makan pokok hingga Rp 0), sementara pendapatan aktif tidak memiliki batas atas jika kamu terus melatih keahlian bernilai tinggi!'
    }
  ];

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (quizChecked) return;
    setQuizAnswers({ ...quizAnswers, [qId]: optIndex });
  };

  const handleCheckQuiz = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (quizAnswers[q.id] === q.options.findIndex(o => o.isCorrect)) {
        correctCount++;
      }
    });
    setQuizScore(correctCount);
    setQuizChecked(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-850 pb-4">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-[10px] font-black uppercase dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900">
            Modul 9 • Karir & Income
          </span>
          {completed && (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">
              ✓ Selesai (+100 XP)
            </span>
          )}
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
          Up-skilling: Peta Jalan Karier & Pendapatan Tinggi (Active Income)
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium mt-1 leading-relaxed">
          Banyak anak muda terlalu fokus memikirkan investasi mikro dari uang saku terbatas, padahal <strong>investasi terbaik di usia muda adalah investasi pada keahlian dirimu sendiri</strong>. Gaji bulanan yang besar (active income) adalah mesin penggerak investasi terbaik!
        </p>
      </div>

      {/* Career Simulator */}
      <div className="bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-indigo-600" /> Kalkulator Kecepatan Finansial Karir Baru
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Pilih jalur keahlian baru yang ingin kamu pelajari di bawah:</p>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {Object.keys(careers).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedCareer(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black cursor-pointer transition-all border ${
                  selectedCareer === key
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400'
                }`}
              >
                {careers[key].title.split(' ')[0]} {key}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display */}
        <div className="bg-white dark:bg-slate-900 border border-slate-150 p-4 rounded-xl space-y-4">
          <div>
            <h5 className="text-xs sm:text-sm font-black text-slate-850 dark:text-slate-100">{activeCareer.title}</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{activeCareer.desc}</p>
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="text-[9px] font-bold text-slate-400 block w-full">Core Skills Wajib Dikuasai:</span>
            {activeCareer.skills.map((skill, sIdx) => (
              <span key={sIdx} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-350 rounded">
                {skill}
              </span>
            ))}
          </div>

          {/* Interactive Savings Rate */}
          <div className="space-y-1.5 pt-2 border-t dark:border-slate-800">
            <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span>Target Tabungan & Investasi Bulanan ({savingsRate}%)</span>
              <span className="text-emerald-600 font-extrabold">Rp {monthlySavings.toLocaleString('id-ID')} / bln</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={savingsRate}
              onChange={(e) => setSavingsRate(parseInt(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
            />
          </div>

          {/* Result Output card */}
          <div className="p-3.5 bg-teal-50 dark:bg-teal-950/20 border border-teal-500/15 rounded-xl grid sm:grid-cols-2 gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Gaji Kotor Rata-Rata</span>
              <p className="font-extrabold text-slate-800 dark:text-slate-200">Rp {activeCareer.salary.toLocaleString('id-ID')} / bulan</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Akumulasi Tabungan 1 Tahun</span>
              <p className="font-extrabold text-teal-600">Rp {yearlySavings.toLocaleString('id-ID')} / tahun</p>
            </div>
            <div className="col-span-2 pt-2 border-t border-teal-500/10 text-[11px] font-bold text-teal-800 dark:text-teal-400 flex items-center gap-1.5 leading-relaxed">
              <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 animate-bounce" />
              <span>Dengan keahlian ini, kamu bisa mengumpulkan <strong>Rp 100.000.000 (Seratus Juta Pertama)</strong> hanya dalam waktu <strong>{yearsTo100M} tahun</strong>!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="space-y-4">
        <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Evaluasi Peta Jalan Karir
        </h4>

        {questions.map((q, qIdx) => {
          const selectedIdx = quizAnswers[q.id];
          return (
            <div key={q.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-xl bg-slate-50/40 dark:bg-slate-900/20 space-y-3">
              <p className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-250">{qIdx + 1}. {q.q}</p>
              <div className="grid gap-2">
                {q.options.map((opt, oIdx) => {
                  const isSelected = selectedIdx === oIdx;
                  let style = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
                  if (isSelected) {
                    if (quizChecked) {
                      style = opt.isCorrect 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/25 dark:border-emerald-700 dark:text-emerald-300 font-bold' 
                        : 'bg-rose-50 border-rose-400 text-rose-850 dark:bg-rose-950/25 dark:border-rose-700 dark:text-rose-300 font-bold';
                    } else {
                      style = 'bg-teal-50 border-teal-500 text-teal-850 dark:bg-teal-950/25 dark:border-teal-700 dark:text-teal-300 font-bold';
                    }
                  } else if (quizChecked && opt.isCorrect) {
                    style = 'bg-emerald-50 border-emerald-500 text-emerald-850 dark:bg-emerald-950/10 dark:border-emerald-800 dark:text-emerald-350';
                  }

                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => handleSelectOption(q.id, oIdx)}
                      className={`p-3 text-left text-xs rounded-xl border transition-all cursor-pointer ${style}`}
                    >
                      {opt.text}
                    </button>
                  );
                })}
              </div>

              {quizChecked && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed italic bg-white dark:bg-slate-900 p-2.5 rounded-lg border dark:border-slate-800">
                  <strong>Penjelasan:</strong> {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Sources list */}
      <div className="p-4 bg-slate-50 dark:bg-slate-900/10 border border-slate-200 dark:border-slate-800/80 rounded-xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
          <BookOpen className="w-3 h-3" /> Referensi Gaji & Karir Indonesia
        </p>
        <div className="text-[11px] text-slate-600 dark:text-slate-400 space-y-1 font-medium">
          <p>• <strong>Mercer Indonesia Salary Survey Guide</strong> - Laporan survei standar penggajian industri teknologi dan jasa kreatif digital di Jakarta.</p>
          <p>• <strong>Glassdoor Indonesia Career Report</strong> - Database rerata imbalan kompensasi spesialisasi teknologi tingkat pemula.</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
        {quizChecked ? (
          <span className="text-xs font-bold text-slate-500">Skor: {quizScore} / {questions.length} Benar!</span>
        ) : (
          <button
            onClick={handleCheckQuiz}
            disabled={Object.keys(quizAnswers).length < questions.length}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold disabled:opacity-40 cursor-pointer"
          >
            Periksa Jawaban
          </button>
        )}

        <button
          onClick={() => onComplete('career')}
          className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer"
        >
          {completed ? 'Lanjut ke Modul 10' : 'Selesaikan & Klaim +100 XP'} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
