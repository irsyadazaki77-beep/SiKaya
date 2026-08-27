import { useState } from 'react';
import { Lightbulb, Wallet } from 'lucide-react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { CAREER_QUESTIONS } from '../../data/classroom/moduleQuestions';

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

export function CareerModule({ onComplete, completed }: ModuleProps) {
  const [selectedCareer, setSelectedCareer] = useState<string>('SWE');
  const [savingsRate, setSavingsRate] = useState<number>(30); // 30% savings rate

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

  return (
    <ClassroomModuleLayout
      category="Karir & Income"
      title="Up-skilling: Peta Jalan Karier & Pendapatan Tinggi (Active Income)"
      description="Banyak anak muda terlalu fokus memikirkan investasi mikro dari uang saku terbatas, padahal investasi terbaik di usia muda adalah investasi pada keahlian dirimu sendiri. Gaji bulanan yang besar (active income) adalah mesin penggerak investasi terbaik!"
      completed={completed}
    >
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

      <QuizSection
        moduleId="career"
        questions={CAREER_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
