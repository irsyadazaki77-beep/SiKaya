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
        setGoals(parsed.goals.join(', ') || 'Tabungan Rumah');
        setRiskTolerance(parsed.riskTolerance);
      } catch (e) {}
    }
  }, []);
  
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Stateful Chat Session logs
  const [chatHistory, setChatHistory] = useState<{question: string, response: string, mood: string, timestamp: string}[]>([
    {
      question: "Apakah aman beli HP cicilan paylater?",
      response: "### 🚨 Manajemen Utang & Kredit\n\n- **Aturan 30%:** Total cicilanmu maksimal Rp 1.500.000 per bulan.\n- **Hindari Bunga Tinggi:** Paylater memiliki bunga tersembunyi yang sangat merugikan.",
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
    "Bagaimana membagi gaji saya bulanan?"
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

  // Financial Diagnostics (Memoized calculations)
  const dtiRatio = useMemo(() => {
    return numericIncome > 0 ? Math.round((numericExpenses / numericIncome) * 100) : 0;
  }, [numericIncome, numericExpenses]);

  const savingsRate = useMemo(() => {
    return numericIncome > 0 ? Math.round((numericSavings / numericIncome) * 100) : 0;
  }, [numericIncome, numericSavings]);

  const dtiStatus = useMemo(() => {
    if (dtiRatio > 50) {
      return { label: "Bahaya", color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20" };
    } else if (dtiRatio > 35) {
      return { label: "Peringatan", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" };
    }
    return { label: "Sangat Sehat", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" };
  }, [dtiRatio]);

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
        cash: finProfile.totalCash,
        investments: finProfile.totalInvestments,
        totalDebt: finProfile.totalDebt,
        monthlyDebt: finProfile.monthlyDebtPayment,
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
        body: JSON.stringify({ profile, question: question.trim(), mood: selectedMood }),
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
      <div className="max-w-4xl mx-auto mb-8 bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-500 animate-pulse" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Kepribadian AI:</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => setSelectedMood('Profesional')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Profesional' ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <HeartHandshake className="w-4 h-4" /> Profesional
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Savage')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Savage' ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <Skull className="w-4 h-4" /> Savage 🔥
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Empathetic')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-sm font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Empathetic' ? 'bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-400' : 'bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-100'}`}
          >
            <Bot className="w-4 h-4" /> Suportif 🤗
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
                  <h3 className="ui-card-title">Profil Finansialmu</h3>
                  <p className="ui-card-sub">Data ini digunakan untuk analisis AI.</p>
                </div>
              </div>
              <div className="lg:hidden">
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isProfileExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
  
            <div className={`${isProfileExpanded ? 'block' : 'hidden lg:block'} space-y-4`}>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pemasukan Bulanan (Rp)</label>
                  <input 
                    type="text" 
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Tabungan Saat Ini (Rp)</label>
                  <input 
                    type="text" 
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pengeluaran Bulanan (Rp)</label>
                  <input 
                    type="text" 
                    value={expensesInput}
                    onChange={(e) => setExpensesInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Target Keuangan Terdekat</label>
                  <input 
                    type="text" 
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                    placeholder="Contoh: Menikah, beli laptop..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Profil Risiko</label>
                  <select 
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-950 transition-all text-slate-900 dark:text-white"
                  >
                    <option value="Konservatif">Konservatif (Cari Aman)</option>
                    <option value="Moderat">Moderat (Seimbang)</option>
                    <option value="Agresif">Agresif (Siap Rugi)</option>
                  </select>
                </div>
              </form>
            </div>
          </div>


          {/* Diagnostics sidebar block */}
          <div className="ui-card">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-teal-600" /> Diagnostik Finansial Instan
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Rasio Belanja</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{dtiRatio}%</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md mt-3 text-center w-full block ${dtiStatus.color}`}>
                  {dtiStatus.label}
                </span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">Savings Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{savingsRate}%</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md mt-3 text-center w-full block ${savingsRate >= 20 ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'}`}>
                  {savingsRate >= 20 ? 'Sangat Bagus' : 'Kurang Sehat'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Col: Chat / Output */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          className="lg:col-span-7 flex flex-col h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
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
                      <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 grid grid-cols-3 gap-4 text-xs">
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

                      <div className="markdown-body text-sm leading-relaxed space-y-2">
                        <ReactMarkdown>{response}</ReactMarkdown>
                      </div>
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
            <p className="text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Informasi bersifat edukasi, bukan rekomendasi investasi profesional.</span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
