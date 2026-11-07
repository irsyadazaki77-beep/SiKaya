import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, Medal, Flame, TrendingUp, Users, Clock, Award, 
  ArrowUpRight, ArrowDownRight, ShieldCheck, CheckCircle2, 
  Coins, Sparkles, ChevronRight, X, AlertCircle, Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { notifyDataMutation } from '../layout/CloudSyncIndicator';

export interface TournamentParticipant {
  id: string;
  name: string;
  avatar: string;
  initialBalance: number;
  currentNetWorth: number;
  roi: number; // percentage, e.g. +14.85
  tradesCount: number;
  rank: number;
  isCurrentUser?: boolean;
}

export interface Tournament {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  status: 'ACTIVE' | 'UPCOMING' | 'COMPLETED';
  startDate: string;
  endDate: string;
  daysRemaining: number;
  prizePoolXP: number;
  participantCount: number;
  startingCapital: number;
  allowedMarkets: string[];
  participants: TournamentParticipant[];
}

const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: 'arena-idx-sprint-44',
    title: 'IDX Blue Chip Sprint 2026',
    subtitle: 'Kompetisi imbal hasil saham Indonesia modal virtual IDR 50 Juta',
    badge: 'TURNAMEN MINGGUAN',
    status: 'ACTIVE',
    startDate: '3 Nov 2026',
    endDate: '10 Nov 2026',
    daysRemaining: 4,
    prizePoolXP: 5000,
    participantCount: 428,
    startingCapital: 50000000,
    allowedMarkets: ['IDX'],
    participants: [
      { id: 'p1', name: 'Alif Trader Pro', avatar: '🦁', initialBalance: 50000000, currentNetWorth: 58450000, roi: 16.90, tradesCount: 14, rank: 1 },
      { id: 'p2', name: 'Nadia SBN Hunter', avatar: '👩‍💼', initialBalance: 50000000, currentNetWorth: 56200000, roi: 12.40, tradesCount: 9, rank: 2 },
      { id: 'p3', name: 'Reza Swing King', avatar: '⚡', initialBalance: 50000000, currentNetWorth: 55100000, roi: 10.20, tradesCount: 22, rank: 3 },
      { id: 'p4', name: 'Maya Value Investor', avatar: '🧕', initialBalance: 50000000, currentNetWorth: 53900000, roi: 7.80, tradesCount: 6, rank: 4 },
      { id: 'p5', name: 'Bimo Scalper', avatar: '🤖', initialBalance: 50000000, currentNetWorth: 52400000, roi: 4.80, tradesCount: 31, rank: 5 }
    ]
  },
  {
    id: 'arena-crypto-volatility-45',
    title: 'Global Volatility Cup',
    subtitle: 'Turnamen multi-aset: Bitcoin, Ethereum, Wall Street & Emas Berjangka',
    badge: 'SEGERA DIMULAI',
    status: 'UPCOMING',
    startDate: '11 Nov 2026',
    endDate: '18 Nov 2026',
    daysRemaining: 7,
    prizePoolXP: 8000,
    participantCount: 189,
    startingCapital: 100000000,
    allowedMarkets: ['US', 'CRYPTO', 'COMMODITY'],
    participants: []
  }
];

export function TradingArenaSection() {
  const { user, addXp } = useAuth();
  const { toast } = useToast();

  const [tournaments, setTournaments] = useState<Tournament[]>(DEFAULT_TOURNAMENTS);
  const [selectedTournament, setSelectedTournament] = useState<Tournament>(DEFAULT_TOURNAMENTS[0]);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [userRoi, setUserRoi] = useState<number>(8.45);

  useEffect(() => {
    // Check if user has joined locally
    const joinedState = localStorage.getItem(`sikaya_arena_joined_${selectedTournament.id}`);
    setIsJoined(!!joinedState);

    // Calculate dynamic ROI if virtual holdings exist
    const vHoldings = localStorage.getItem('sikaya_virtual_holdings');
    const vCash = localStorage.getItem('sikaya_virtual_cash');
    if (vHoldings && vCash) {
      try {
        const parsed = JSON.parse(vHoldings);
        let curTotal = Number(vCash) || 10000000;
        Object.values(parsed).forEach((h: any) => {
          curTotal += (h.shares || 0) * (h.currentPrice || h.buyPrice || 0);
        });
        const startingCap = selectedTournament.startingCapital || 50000000;
        const calculatedRoi = Number((((curTotal - startingCap) / startingCap) * 100).toFixed(2));
        if (!isNaN(calculatedRoi)) {
          setUserRoi(calculatedRoi);
        }
      } catch (e) {}
    }
  }, [selectedTournament.id]);

  const handleJoinTournament = () => {
    localStorage.setItem(`sikaya_arena_joined_${selectedTournament.id}`, 'true');
    setIsJoined(true);
    addXp(150); // XP bonus for participating
    notifyDataMutation();
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.7 } });
    toast.success(`🎉 Berhasil bergabung di ${selectedTournament.title}! Modal virtual Anda telah terdaftar.`);
  };

  // Compute leaderboard participants with user included
  const displayParticipants = React.useMemo(() => {
    if (!isJoined) return selectedTournament.participants;

    const userParticipant: TournamentParticipant = {
      id: user.uid || 'current-user',
      name: user.fullName ? `${user.fullName} (Anda)` : 'Anda',
      avatar: user.avatar || '🦊',
      initialBalance: selectedTournament.startingCapital,
      currentNetWorth: selectedTournament.startingCapital * (1 + userRoi / 100),
      roi: userRoi,
      tradesCount: 8,
      rank: 4,
      isCurrentUser: true
    };

    const combined = [...selectedTournament.participants, userParticipant];
    combined.sort((a, b) => b.roi - a.roi);
    return combined.map((p, idx) => ({ ...p, rank: idx + 1 }));
  }, [isJoined, selectedTournament, user, userRoi]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              ARENA KOMPETISI TRADING
            </span>
            <span className="text-[10px] font-mono text-slate-400">Musim 2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white font-display">
            Turnamen Portofolio & Paper Trading
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Uji insting analisis pasar Anda melawan ribuan investor muda se-Indonesia tanpa risiko kehilangan modal riil.
          </p>
        </div>

        {/* Action button */}
        {!isJoined ? (
          <button
            type="button"
            onClick={handleJoinTournament}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer shrink-0"
          >
            <Flame className="w-4 h-4 text-amber-300" />
            <span>Gabung Turnamen Gratis (+150 XP)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Terdaftar Aktif di Musim Ini</span>
          </div>
        )}
      </div>

      {/* Tournament Meta Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-400">Status Turnamen</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-black text-slate-900 dark:text-white">Sedang Berjalan</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-400">Sisa Waktu</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <p className="text-xs font-black text-slate-900 dark:text-white">{selectedTournament.daysRemaining} Hari Lagi</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-400">Total Hadiah XP</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Coins className="w-3.5 h-3.5 text-amber-500" />
            <p className="text-xs font-black text-slate-900 dark:text-white font-mono">{selectedTournament.prizePoolXP.toLocaleString()} XP</p>
          </div>
        </div>

        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          <p className="text-[10px] uppercase font-mono text-slate-400">Peserta Terdaftar</p>
          <div className="flex items-center gap-1.5 mt-1">
            <Users className="w-3.5 h-3.5 text-teal-500" />
            <p className="text-xs font-black text-slate-900 dark:text-white font-mono">{selectedTournament.participantCount + (isJoined ? 1 : 0)} Trader</p>
          </div>
        </div>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        {displayParticipants.slice(0, 3).map((p, idx) => {
          const isGold = idx === 0;
          const isSilver = idx === 1;
          const isBronze = idx === 2;
          return (
            <div
              key={p.id}
              className={`p-4 rounded-2xl border text-center relative overflow-hidden transition-all ${
                isGold 
                  ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-500/40 shadow-sm'
                  : isSilver
                  ? 'bg-slate-50 dark:bg-slate-950 border-slate-300 dark:border-slate-700'
                  : 'bg-orange-50/40 dark:bg-orange-950/20 border-orange-500/30'
              }`}
            >
              <div className="flex justify-center mb-2">
                <span className={`text-xl p-2 rounded-2xl shadow-inner ${
                  isGold ? 'bg-amber-400/20' : isSilver ? 'bg-slate-300/20' : 'bg-orange-400/20'
                }`}>
                  {p.avatar}
                </span>
              </div>
              <div className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider font-mono mb-1 bg-white/80 dark:bg-slate-900 border border-inherit">
                {isGold ? 'Juara 1 👑' : isSilver ? 'Juara 2 🥈' : 'Juara 3 🥉'}
              </div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{p.name}</h4>
              <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono mt-1">
                +{p.roi.toFixed(2)}% ROI
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Rp {p.currentNetWorth.toLocaleString('id-ID')}
              </p>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="px-4 py-3 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Klasemen Sementara Turnamen</span>
          <span className="text-[10px] font-mono text-slate-400">Pembaruan Real-Time</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/80 max-h-72 overflow-y-auto">
          {displayParticipants.map((p) => {
            return (
              <div
                key={p.id}
                className={`flex items-center justify-between px-4 py-3 text-xs transition-colors ${
                  p.isCurrentUser 
                    ? 'bg-teal-50/70 dark:bg-teal-950/40 border-l-4 border-l-teal-500' 
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 text-center font-mono font-bold text-slate-400">{p.rank}</span>
                  <span className="text-base">{p.avatar}</span>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      {p.name}
                      {p.isCurrentUser && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-teal-600 text-white font-mono">
                          ANDA
                        </span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">{p.tradesCount} transaksi dieksekusi</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block text-xs">
                    +{p.roi.toFixed(2)}%
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    Rp {p.currentNetWorth.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
