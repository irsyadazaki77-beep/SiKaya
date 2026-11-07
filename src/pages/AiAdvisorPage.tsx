import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, AlertCircle, Loader2, DollarSign, Wallet, ShieldCheck, ChevronDown, History, ShieldAlert, HeartHandshake, Skull, Download, HeartPulse } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';
import { calculateFinancialHealthScore, DEFAULT_FINANCIAL_PROFILE } from '../lib/financialHealth';
import { FinancialProfile } from '../types/financial';
import { PageHeader } from '../components/PageHeader';
import { exportElementToPdf } from '../utils/exportUtils';

export function AiAdvisorPage() {
  const { token, user, login } = useAuth();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Financial Profile Sync
  const [finProfile, setFinProfile] = useState<FinancialProfile>(DEFAULT_FINANCIAL_PROFILE);

  const [incomeInput, setIncomeInput] = useState<string>('8.500.000');
  const [savingsInput, setSavingsInput] = useState<string>('18.000.000');
  const [expensesInput, setExpensesInput] = useState<string>('5.200.000');
  const [debtInput, setDebtInput] = useState<string>('850.000');
  const [maritalStatus, setMaritalStatus] = useState<string>('Lajang');
  const [goals, setGoals] = useState<string>('Tabungan Rumah First-Time');
  const [riskTolerance, setRiskTolerance] = useState<string>('Moderat');
  const [selectedMood, setSelectedMood] = useState<'Profesional' | 'Savage' | 'Empathetic'>('Profesional');

  // Load stored profile
  useEffect(() => {
    const saved = localStorage.getItem('sikaya_fin_profile');
    if (saved) {
      try {
        const parsed: FinancialProfile = JSON.parse(saved);
        setFinProfile(parsed);
        setIncomeInput(parsed.monthlyIncome.toLocaleString('id-ID'));
        setExpensesInput(parsed.monthlyExpenses.toLocaleString('id-ID'));
        setSavingsInput(parsed.emergencyFund.toLocaleString('id-ID'));
        if (parsed.monthlyDebtPayment) {
          setDebtInput(parsed.monthlyDebtPayment.toLocaleString('id-ID'));
        }
        setGoals(parsed.goals.join(', ') || 'Tabungan Rumah First-Time');
        setRiskTolerance(parsed.riskTolerance || 'Moderat');
      } catch (e) {}
    }
  }, []);
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initial example formatted according to CFP 4-part standard
  const initialDefaultResponse = `### 1. 📊 Diagnosis Kilat
- **Debt Service Ratio (DSR):** Cicilan utang saat ini Rp 850.000 atau **10.0%** dari penghasilan (ambang batas sehat < 30%).
- **Kecukupan Dana Darurat:** Tabungan likuid Rp 18.000.000 mampu menopang **3.5 bulan** pengeluaran (kategori Lajang target ideal: 3 - 6x pengeluaran).

### 2. 💡 Analisis & Simulasi Angka
- Jika Anda mengambil cicilan baru (misal: gadget seharga **Rp 12.000.000** via paylater 12 bulan dengan bunga ~2.95%/bulan):
  - Estimasi cicilan tambahan: **Rp 1.354.000 / bulan**.
  - Total cicilan bulanan melonjak menjadi **Rp 2.204.000 / bulan** -> DSR Anda melesat ke **25.9%**.
  - Total beban bunga ekstra yang terbuang: **Rp 4.248.000** (35.4% lebih mahal dari harga tunai).
  - Kapasitas investasi bulanan Anda akan tergerus sebesar 45%.

### 3. 🎯 3 Langkah Aksi Prioritas
1. **Segera (Hari Ini / Minggu Ini):** Terapkan aturan *30-Day Delay Rule* sebelum membeli barang konsumtif non-esensial untuk menghindari godaan impulsif paylater.
2. **Jangka Pendek (1 - 3 Bulan):** Lengkapi pos dana darurat hingga mencapai 6x pengeluaran (target Rp 31.200.000) dengan memindahkan surplus kas ke Reksadana Pasar Uang (RDPU) yang likuid (return ~4.5% - 5.5% net/tahun).
3. **Jangka Panjang (> 6 Bulan):** Alokasikan minimal 20% gaji (Rp 1.700.000/bulan) ke instrumen diversifikasi (SBN Ritel 6.0% - 6.5% dan Reksa Dana Indeks) untuk mengakumulasi target tabungan rumah.

### 4. 🔍 Pertanyaan Lanjutan yang Disarankan
[SUGGESTION: Bagaimana membagi gaji Rp 8.500.000 dengan aturan 50/30/20?]
[SUGGESTION: Rekomendasi instrumen investasi untuk profil risiko Moderat?]
[SUGGESTION: Berapa target dana darurat jika nanti saya menikah?]`;

  // Stateful Chat Session logs
  const [chatHistory, setChatHistory] = useState<{question: string, response: string, mood: string, timestamp: string}[]>([
    {
      question: "Apakah aman beli HP cicilan paylater?",
      response: initialDefaultResponse,
      mood: "Profesional",
      timestamp: "10:15 WIB"
    }
  ]);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Clean up any pending abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Load chat history from Firestore on login with query limit
  useEffect(() => {
    if (token && token !== 'demo-token' && auth.currentUser) {
      const loadChat = async () => {
        try {
          const q = query(
            collection(db, 'chatHistory'),
            where('userId', '==', auth.currentUser?.uid),
            limit(25)
          );
          const querySnapshot = await getDocs(q);
          const history = querySnapshot.docs.map(doc => {
            const d = doc.data();
            return {
              question: d.question,
              response: d.response,
              mood: d.mood,
              timestamp: d.createdAt ? new Date(d.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB" : "10:00 WIB",
              createdAt: d.createdAt
            };
          });
          history.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          if (history.length > 0) {
            setChatHistory(history);
          }
        } catch (e) {
          console.error("Error loading chat history:", e);
        }
      };
      loadChat();
    }
  }, [token]);

  const suggestionChips = useMemo(() => [
    "Apakah aman beli HP cicilan paylater?",
    "Berapa dana darurat ideal untuk saya?",
    "Rekomendasi investasi untuk profil moderat?",
    "Bagaimana membagi gaji bulanan dengan aturan 50/30/20?"
  ], []);

  const handleChipClick = useCallback((text: string) => {
    setQuestion(text);
  }, []);

  // Helper functions for currency parsing & formatting
  const formatRupiah = (val: string) => {
    const cleanNum = val.replace(/\D/g, '');
    return cleanNum ? Number(cleanNum).toLocaleString('id-ID') : '';
  };

  const parseRawNumber = (val: string) => {
    return Number(val.replace(/\D/g, '')) || 0;
  };

  const numericIncome = parseRawNumber(incomeInput);
  const numericExpenses = parseRawNumber(expensesInput);
  const numericSavings = parseRawNumber(savingsInput);
  const numericDebt = parseRawNumber(debtInput);

  // Financial Diagnostics (Memoized CFP calculations)
  const dtiRatio = useMemo(() => {
    return numericIncome > 0 ? Number(((numericDebt / numericIncome) * 100).toFixed(1)) : 0;
  }, [numericIncome, numericDebt]);

  const savingsRate = useMemo(() => {
    const remaining = numericIncome - numericExpenses - numericDebt;
    return numericIncome > 0 ? Math.round((Math.max(0, remaining) / numericIncome) * 100) : 0;
  }, [numericIncome, numericExpenses, numericDebt]);

  const emergencyMonths = useMemo(() => {
    return numericExpenses > 0 ? (numericSavings / numericExpenses).toFixed(1) : '0';
  }, [numericSavings, numericExpenses]);

  const targetEmergencyMonths = useMemo(() => {
    if (maritalStatus === 'Menikah') return 9;
    if (maritalStatus.includes('Anak') || maritalStatus.includes('Freelancer') || maritalStatus.includes('Wirausaha')) return 12;
    return 6;
  }, [maritalStatus]);

  const dtiStatus = useMemo(() => {
    if (dtiRatio > 40) {
      return { label: "Bahaya / Kritis (>40%)", color: "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200" };
    } else if (dtiRatio >= 30) {
      return { label: "Waspada (30%-40%)", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200" };
    }
    return { label: "Sehat (<30%)", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200" };
  }, [dtiRatio]);

  const activeAnswerText = response || chatHistory[0]?.response || '';

  const extractedSuggestions = useMemo(() => {
    if (!activeAnswerText) return [];
    const matches: string[] = [];
    const regex = /\[SUGGESTION:\s*([^\]]+)\]/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(activeAnswerText)) !== null) {
      if (match[1]?.trim()) {
        matches.push(match[1].trim());
      }
    }
    return matches;
  }, [activeAnswerText]);

  const cleanMarkdownText = useMemo(() => {
    if (!activeAnswerText) return '';
    return activeAnswerText.replace(/\[SUGGESTION:\s*([^\]]+)\]/gi, '').trim();
  }, [activeAnswerText]);

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    toast.success('Sedang memproses laporan konsultasi Anda...');
    setIsExporting(true);
    try {
      await exportElementToPdf(reportRef.current, `SiKaya_Konsultasi_${selectedMood}.pdf`);
      toast.success('Rekomendasi AI berhasil diunduh dalam format PDF!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses ekspor PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
      toast.success('Berhasil login dengan Google! Silakan ajukan pertanyaan.');
    } catch (e) {
      console.error(e);
      toast.error('Login dengan Google dibatalkan atau gagal.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Check Firebase authentication
    let activeToken: string | null = null;
    if (auth.currentUser) {
      try {
        activeToken = await auth.currentUser.getIdToken();
      } catch (tokenErr) {
        console.error("Gagal mendapatkan Firebase ID token:", tokenErr);
      }
    }

    if (!activeToken) {
      setError("Autentikasi Diperlukan: Untuk keamanan dan perlindungan data finansial, Anda harus login menggunakan akun Google terlebih dahulu.");
      toast.error("Silakan login dengan Google untuk menggunakan AI Advisor.");
      return;
    }

    if (question.trim().length > 2000) {
      setError("Pertanyaan maksimal 2000 karakter.");
      toast.error("Pertanyaan maksimal 2000 karakter.");
      return;
    }

    if (numericIncome < 0 || numericExpenses < 0 || numericSavings < 0) {
      setError("Nilai keuangan tidak boleh bernilai negatif.");
      toast.error("Nilai keuangan tidak boleh bernilai negatif.");
      return;
    }

    setLoading(true);
    setResponse(null);
    setError(null);
    
    try {
      const healthDiag = calculateFinancialHealthScore({
        monthlyIncome: numericIncome,
        monthlyExpenses: numericExpenses,
        emergencyFund: numericSavings,
        totalCash: finProfile.totalCash || 12500000,
        totalDebt: finProfile.totalDebt || 3500000,
        monthlyDebtPayment: finProfile.monthlyDebtPayment || 850000,
        totalInvestments: finProfile.totalInvestments || 24500000,
        riskTolerance: riskTolerance as any,
        goals: [goals]
      });

      const profile = {
        income: numericIncome,
        expenses: numericExpenses,
        emergencyFund: numericSavings,
        cash: finProfile.totalCash || numericSavings,
        investments: finProfile.totalInvestments || 0,
        totalDebt: finProfile.totalDebt || 0,
        monthlyDebt: numericDebt,
        maritalStatus,
        healthScore: healthDiag.overallScore,
        healthGrade: healthDiag.grade,
        goals,
        riskTolerance
      };

      // Cancel previous pending request if any
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const apiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({
          profile,
          question: question.trim(),
          mood: selectedMood,
          history: chatHistory.slice(0, 6).reverse().flatMap(item => [
            { role: 'user', text: item.question },
            { role: 'model', text: item.response }
          ])
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!apiRes.ok) {
        const errorData = await apiRes.json().catch(() => null);
        const serverMsg = errorData?.error?.message || "Gagal terhubung ke AI server.";
        throw new Error(serverMsg);
      }

      const apiData = await apiRes.json();
      const reply = apiData.reply;
      
      setResponse(reply);

      // Add to stateful history
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + " WIB";
      setChatHistory(prev => [
        { question: question.trim(), response: reply, mood: selectedMood, timestamp: timeStr },
        ...prev
      ]);

      // Save to history backend if logged in
      if (auth.currentUser) {
        addDoc(collection(db, 'chatHistory'), {
          userId: auth.currentUser.uid,
          question: question.trim(),
          response: reply,
          mood: selectedMood,
          createdAt: new Date().toISOString()
        }).catch(err => console.error("Error saving chat history to Firestore:", err));
      }

    } catch (err: any) {
      console.error("Advisor error:", err);
      setError(err.message || "Gagal memproses pertanyaan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <PageHeader
        category="Asisten AI"
        title="Konsultan Finansial AI Personal"
        description="Dapatkan saran manajemen keuangan, strategi investasi, dan tips mengelola utang yang disesuaikan secara spesifik dengan profil finansialmu."
        badge="GRATIS"
      />

      {/* Mood Selector / Personality Selector Bar */}
      <div className="max-w-4xl mx-auto mb-8 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-teal-50 dark:bg-teal-900/30 text-teal-600 rounded-xl">
            <Sparkles className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Mode Komunikasi AI</p>
            <p className="text-xs text-slate-500">Sesuaikan gaya analisa dengan preferensi Anda</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2 w-full md:w-auto">
          <button 
            type="button"
            onClick={() => setSelectedMood('Profesional')}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${selectedMood === 'Profesional' ? 'bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-900/40 dark:border-indigo-700 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <span className="flex items-center gap-1.5 font-bold"><HeartHandshake className="w-3.5 h-3.5 text-indigo-500" /> Profesional</span>
            <span className="text-[10px] opacity-75 font-normal">Objektif & Rasio</span>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Savage')}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${selectedMood === 'Savage' ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-900/40 dark:border-rose-700 dark:text-rose-300 shadow-sm ring-1 ring-rose-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <span className="flex items-center gap-1.5 font-bold"><Skull className="w-3.5 h-3.5 text-rose-500" /> Savage 🔥</span>
            <span className="text-[10px] opacity-75 font-normal">Anti-FOMO/Paylater</span>
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Empathetic')}
            className={`px-3 py-2 text-xs font-semibold rounded-xl border transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${selectedMood === 'Empathetic' ? 'bg-teal-50 border-teal-300 text-teal-700 dark:bg-teal-900/40 dark:border-teal-700 dark:text-teal-300 shadow-sm ring-1 ring-teal-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <span className="flex items-center gap-1.5 font-bold"><Bot className="w-3.5 h-3.5 text-teal-500" /> Suportif 🤗</span>
            <span className="text-[10px] opacity-75 font-normal">Hangat & Bertahap</span>
          </button>
        </div>
      </div>
 
      <div className="grid lg:grid-cols-12 gap-8 items-stretch relative z-10">
        {/* Left Col: Profile Form */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          <div className="ui-card">
            <div 
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className="flex items-center justify-between cursor-pointer lg:cursor-default mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 dark:bg-teal-900/30 rounded-xl text-teal-600">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="ui-card-title">Profil Finansial (CFP Standard)</h3>
                  <p className="ui-card-sub">Data ini dijadikan acuan kalkulasi & simulasi AI.</p>
                </div>
              </div>
              <div className="lg:hidden">
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isProfileExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
  
            <div className={`${isProfileExpanded ? 'block' : 'hidden lg:block'} space-y-4`}>
              <form className="space-y-3.5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pemasukan Bulanan (Rp)</label>
                  <input 
                    type="text" 
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pengeluaran Bulanan (Rp)</label>
                  <input 
                    type="text" 
                    value={expensesInput}
                    onChange={(e) => setExpensesInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Cicilan Utang Bulanan (Rp)</label>
                    <span className="text-[10px] text-slate-500">Acuan DSR/DTI</span>
                  </div>
                  <input 
                    type="text" 
                    value={debtInput}
                    onChange={(e) => setDebtInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dana Darurat / Tabungan Likuid (Rp)</label>
                  <input 
                    type="text" 
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Status & Dependen</label>
                    <select 
                      value={maritalStatus}
                      onChange={(e) => setMaritalStatus(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Lajang">Lajang (Target 3-6x)</option>
                      <option value="Menikah">Menikah (Target 6-9x)</option>
                      <option value="Menikah + Anak">Menikah + Anak (Target 9-12x)</option>
                      <option value="Wirausaha / Freelancer">Freelancer/Wirausaha (9-12x)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Profil Risiko</label>
                    <select 
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                    >
                      <option value="Konservatif">Konservatif (Aman)</option>
                      <option value="Moderat">Moderat (Seimbang)</option>
                      <option value="Agresif">Agresif (Tinggi)</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Target Finansial Terdekat</label>
                  <input 
                    type="text" 
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                    placeholder="Contoh: DP Rumah, Beli Laptop, Bebas Utang..."
                  />
                </div>
              </form>
            </div>
          </div>

          {/* CFP Financial Diagnostics Card */}
          <div className="ui-card space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-teal-600" />
                Diagnostik CFP Benchmark
              </span>
              <span className="text-[10px] font-semibold text-teal-600 bg-teal-50 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                Standar OJK / CFP
              </span>
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {/* DSR Card */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Debt Service Ratio (DSR)</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{dtiRatio}%</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md mt-2 text-center w-full block border ${dtiStatus.color}`}>
                  {dtiStatus.label}
                </span>
              </div>

              {/* Emergency Fund Card */}
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-medium text-slate-500">Kecukupan Dana Darurat</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white mt-1">{emergencyMonths}x <span className="text-xs font-normal text-slate-500">pengeluaran</span></p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md mt-2 text-center w-full block border ${Number(emergencyMonths) >= targetEmergencyMonths ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                  Target: {targetEmergencyMonths}x ({maritalStatus})
                </span>
              </div>
            </div>

            {/* 50/30/20 Ideal Rule Reference */}
            <div className="p-3 bg-slate-100/60 dark:bg-slate-800/40 rounded-xl text-xs space-y-1.5 border border-slate-200/50 dark:border-slate-800/50">
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between text-[11px]">
                <span>Alokasi Ideal 50/30/20:</span>
                <span className="text-slate-500 font-normal">Gaji: Rp {numericIncome.toLocaleString('id-ID')}</span>
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Kebutuhan 50%</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {Math.round(numericIncome * 0.5).toLocaleString('id-ID')}</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Keinginan 30%</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Rp {Math.round(numericIncome * 0.3).toLocaleString('id-ID')}</span>
                </div>
                <div className="p-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block">Tabungan 20%</span>
                  <span className="font-bold text-teal-600 dark:text-teal-400">Rp {Math.round(numericIncome * 0.2).toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Col: Chat / Output */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="lg:col-span-7 flex flex-col h-[560px] sm:h-[680px] lg:h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-900/20 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/30 flex items-center justify-center text-teal-600">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100">SiKaya Advisor Copilot</p>
                <p className="text-xs font-medium text-slate-500">Merespons sebagai: {selectedMood}</p>
              </div>
            </div>
            
            {/* Quick Session Counter */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400">
              <History className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold">{chatHistory.length} Sesi</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Session History Sidebar widget */}
            <div className="hidden sm:block w-56 border-r border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-900/20 overflow-y-auto p-4 space-y-3">
              <p className="text-xs font-bold text-slate-500 mb-3">Riwayat Sesi</p>
              {chatHistory.map((hist, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setQuestion(hist.question);
                    setResponse(hist.response);
                    setSelectedMood(hist.mood as any);
                  }}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer group shadow-sm"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-2 group-hover:text-teal-600">{hist.question}</p>
                  <div className="flex justify-between items-center mt-2 text-[10px] font-medium text-slate-400">
                    <span>{hist.mood}</span>
                    <span>{hist.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/50 p-4 rounded-xl flex items-start gap-3 mb-4"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-rose-800 dark:text-rose-200">Gagal Memuat Rekomendasi AI</h4>
                      <p className="text-sm text-rose-600 dark:text-rose-400 mt-1">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {!response && !loading && !error && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center p-4"
                  >
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Tanyakan Apapun Ke AI</h4>
                    <p className="text-sm text-slate-500 max-w-sm">
                      Halo! Ceritakan dilema finansialmu atau tanyakan tips investasi. Saya siap menganalisis berdasarkan profil yang kamu isi.
                    </p>
                  </motion.div>
                )}
                
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-center py-10"
                  >
                    <div className="bg-slate-50 dark:bg-slate-800 px-6 py-3 rounded-full flex items-center gap-3 shadow-sm border border-slate-100 dark:border-slate-700">
                      <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Menganalisis Profil Finansialmu...</span>
                    </div>
                  </motion.div>
                )}

                {response && !loading && (
                  <motion.div 
                    ref={reportRef}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* User Question Bubble */}
                    <div className="flex justify-end mb-6">
                      <div className="bg-slate-900 dark:bg-slate-800 text-white px-5 py-3 rounded-2xl rounded-tr-sm max-w-[85%] text-sm font-medium shadow-sm">
                        {chatHistory[0]?.question || question}
                      </div>
                    </div>

                    {/* AI Response Document Style */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm prose prose-sm dark:prose-invert prose-teal max-w-none prose-headings:font-semibold prose-p:leading-relaxed">
                      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Bot className="w-5 h-5 text-teal-600" />
                          <span className="font-semibold text-slate-900 dark:text-white text-sm">Analisis AI ({selectedMood})</span>
                        </div>
                        
                        <button 
                          type="button"
                          onClick={handleExportPDF}
                          disabled={isExporting}
                          className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                        >
                          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                          <span>Unduh PDF</span>
                        </button>
                      </div>

                      {/* Quick Metadata summary for PDF export visibility */}
                      <div className="mb-6 p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 text-xs">
                        <div>
                          <span className="block text-slate-500 mb-1">Pemasukan</span>
                          <span className="font-semibold text-slate-900 dark:text-white">Rp {numericIncome.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 mb-1">Tabungan</span>
                          <span className="font-semibold text-slate-900 dark:text-white">Rp {numericSavings.toLocaleString('id-ID')}</span>
                        </div>
                        <div>
                          <span className="block text-slate-500 mb-1">Pengeluaran</span>
                          <span className="font-semibold text-slate-900 dark:text-white">Rp {numericExpenses.toLocaleString('id-ID')}</span>
                        </div>
                      </div>

                      <div className="markdown-body text-sm leading-relaxed space-y-3">
                        <ReactMarkdown>{cleanMarkdownText}</ReactMarkdown>
                      </div>

                      {/* Interactive Suggested Follow-Up Prompts */}
                      {extractedSuggestions.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700 not-prose">
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-500" />
                            Pertanyaan Lanjutan yang Disarankan:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {extractedSuggestions.map((suggest, sIdx) => (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleChipClick(suggest)}
                                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/30 dark:hover:bg-teal-900/50 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer shadow-xs active:scale-98"
                              >
                                💬 {suggest}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-4 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-teal-500 rounded-full text-xs font-medium text-slate-600 dark:text-slate-300 transition-all cursor-pointer shadow-sm"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            {!auth.currentUser && (
              <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 text-sm font-medium">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span>Akses AI Advisor memerlukan verifikasi login Google</span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickLogin}
                  disabled={isLoggingIn}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm"
                >
                  {isLoggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Login Google</span>
                </button>
              </div>
            )}
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ketik pertanyaan terkait finansial di sini..."
                disabled={loading}
                maxLength={2000}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-14 py-3.5 text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50 transition-colors text-slate-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute right-2 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 flex items-center justify-center gap-1.5 text-center px-2">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>Simulasi & edukasi finansial berbasis metodologi CFP, bukan rekomendasi investasi terikat atau penasihat berizin OJK/Bappebti. Jaga kerahasiaan PIN/Password.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
