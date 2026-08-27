import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Zap, CheckCircle2, Flame, RefreshCw, Sparkles, ChevronRight } from 'lucide-react';
import { Quest } from '../../types/financial';
import { getStoredQuests, saveQuests } from '../../lib/quests';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export function QuestsWidget() {
  const { user, addXp } = useAuth();
  const { toast } = useToast();
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  useEffect(() => {
    setQuests(getStoredQuests());
  }, []);

  const handleClaim = (questId: string) => {
    const updated = quests.map((q) => {
      if (q.id === questId) {
        return { ...q, completed: true };
      }
      return q;
    });

    const targetQuest = quests.find((q) => q.id === questId);
    if (targetQuest && !targetQuest.completed) {
      addXp(targetQuest.xpReward);
      toast.success(`Misi "${targetQuest.title}" selesai! +${targetQuest.xpReward} XP diperoleh 🎉`);
    }

    setQuests(updated);
    saveQuests(updated);
  };

  const filteredQuests = quests.filter((q) => q.type === activeTab);
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-2xl border border-amber-100 dark:border-amber-900/40">
            <Flame className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest text-amber-600 dark:text-amber-400 uppercase bg-amber-50 dark:bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/50">
                GAMIFIKASI BELAJAR
              </span>
              <span className="text-[10px] font-extrabold text-slate-400">
                Streak 5 Hari 🔥
              </span>
            </div>
            <h3 className="text-lg font-black text-slate-850 dark:text-slate-100 mt-0.5">
              Misi & Tantangan Literasi
            </h3>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-2xl border border-slate-200 dark:border-slate-850 self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none flex-1 sm:flex-initial ${
              activeTab === 'daily'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Misi Harian
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`px-4 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer border-none flex-1 sm:flex-initial ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Misi Mingguan
          </button>
        </div>
      </div>

      {/* Quest Item List */}
      <div className="space-y-3">
        {filteredQuests.map((quest) => (
          <div
            key={quest.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 ${
              quest.completed
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 opacity-80'
                : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/80 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/40">
                  +{quest.xpReward} XP
                </span>
                <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">
                  {quest.title}
                </h4>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {quest.description}
              </p>
            </div>

            <div>
              {quest.completed ? (
                <span className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-black rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                </span>
              ) : (
                <button
                  onClick={() => handleClaim(quest.id)}
                  className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-xs font-black rounded-xl hover:shadow-md active:scale-95 transition-all cursor-pointer border-none flex items-center gap-1.5 shrink-0"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Klaim Misi
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
