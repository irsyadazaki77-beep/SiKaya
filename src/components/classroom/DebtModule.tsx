import { useState } from 'react';
import { User } from '../../types/user';
import { ClassroomModuleLayout } from './ClassroomModuleLayout';
import { QuizSection } from './QuizSection';
import { DEBT_QUESTIONS } from '../../data/classroom/moduleQuestions';

interface ModuleProps {
  user: User;
  onComplete: (moduleId: string) => void;
  completed: boolean;
}

export function DebtModule({ onComplete, completed }: ModuleProps) {
  return (
    <ClassroomModuleLayout
      category="Mengelola Utang"
      title="Kelola Utang: Anti-FOMO & Pinjol Ilegal"
      description="Kemudahan akses kredit di era digital ibarat pisau bermata dua. Paylater dan aplikasi pinjaman online (pinjol) ilegal siap menjebak keuanganmu jika digunakan tanpa pertimbangan matang."
      completed={completed}
    >
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

      <div className="space-y-2 mt-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
         <p>
           Utang produktif bisa menjadi tuas pengungkit (leverage) yang baik bila digunakan pada tempat dan perhitungan yang benar. Namun, untuk Gen Z, godaan utang konsumtif jauh lebih besar karena paparan media sosial.
         </p>
      </div>

      {/* Quiz Section */}
      <QuizSection
        moduleId="debt"
        questions={DEBT_QUESTIONS}
        completed={completed}
        onComplete={onComplete}
      />
    </ClassroomModuleLayout>
  );
}
