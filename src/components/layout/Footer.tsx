import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, BookOpen, Activity, Wallet, Users, MessageSquare } from 'lucide-react';
import { Logo } from '../Logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand & Mission */}
        <div className="space-y-4 md:col-span-1">
          <Logo />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
            Platform edukasi dan simulasi literasi keuangan interaktif untuk Generasi Z Indonesia. Cerdas mengelola uang, bebas finansial sejak dini.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-extrabold text-teal-750 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40 px-3 py-1.5 rounded-xl w-fit">
            <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <span>100% Edukasi Bebas Penipuan</span>
          </div>
        </div>

        {/* Col 2: Modul Belajar */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Modul Belajar</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li><Link to="/belajar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Atur Arus Kas (50/30/20)</Link></li>
            <li><Link to="/belajar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Kelola Utang & Pinjol</Link></li>
            <li><Link to="/belajar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Simulasi Bunga Majemuk</Link></li>
            <li><Link to="/belajar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Investasi Saham & Reksa Dana</Link></li>
            <li><Link to="/belajar" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Dana Darurat & Mitigasi Risiko</Link></li>
          </ul>
        </div>

        {/* Col 3: Simulasi & Fitur */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Simulasi & Alat</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li><Link to="/simulasi" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Virtual Trading Saham</Link></li>
            <li><Link to="/life-simulator" className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors">Simulasi Hidup Finansial</Link></li>
            <li><Link to="/portfolio" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Portfolio & Net Worth</Link></li>
            <li><Link to="/features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Cek Kesehatan Finansial</Link></li>
            <li><Link to="/ai-advisor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">AI Financial Advisor</Link></li>
          </ul>
        </div>

        {/* Col 4: Komunitas & Legal Disclaimer */}
        <div className="space-y-3">
          <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">Komunitas & Legal</h4>
          <ul className="space-y-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <li><Link to="/community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Forum Diskusi Gen Z</Link></li>
            <li><Link to="/leaderboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Papan Peringkat Investor</Link></li>
            <li><Link to="/news" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Market News & Sentimen AI</Link></li>
          </ul>
          <div className="p-3 bg-slate-50 dark:bg-slate-850/50 rounded-xl border border-slate-200/60 dark:border-slate-800 text-[10px] text-slate-400 leading-tight">
            <strong className="text-slate-600 dark:text-slate-300">Disclaimer:</strong> Seluruh konten, data bursa, dan simulator di SiKaya ditujukan untuk sarana literasi dan edukasi simulasi finansial semata. Bukan merupakan ajakan atau nasihat investasi berlisensi.
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
        <p>© {new Date().getFullYear()} SiKaya - Platform Literasi Finansial Gen Z Indonesia.</p>
        <p className="flex items-center gap-1 font-medium">
          Dibuat dengan <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> untuk generasi muda cerdas finansial.
        </p>
      </div>
    </footer>
  );
}
