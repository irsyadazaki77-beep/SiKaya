import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, Sparkles, AlertCircle, Loader2, DollarSign, Wallet, ShieldCheck, ChevronDown, History, ShieldAlert, HeartHandshake, Skull, Download, HeartPulse } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { calculateFinancialHealthScore, DEFAULT_FINANCIAL_PROFILE } from '../lib/financialHealth';
import { FinancialProfile } from '../types/financial';
import { PageHeader } from '../components/PageHeader';

export function AiAdvisorPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

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

  // Load chat history from Firestore on login
  React.useEffect(() => {
    if (token && token !== 'demo-token' && auth.currentUser) {
      const loadChat = async () => {
        try {
          const q = query(
            collection(db, 'chatHistory'),
            where('userId', '==', auth.currentUser.uid)
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

  const suggestionChips = [
    "Apakah aman beli HP cicilan paylater?",
    "Berapa dana darurat ideal untuk saya?",
    "Rekomendasi investasi untuk profil moderat?",
    "Bagaimana membagi gaji saya bulanan?"
  ];

  const handleChipClick = (text: string) => {
    setQuestion(text);
  };

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

  // Financial Diagnostics (Real-time calculations)
  const dtiRatio = numericIncome > 0 ? Math.round((numericExpenses / numericIncome) * 100) : 0;
  const savingsRate = numericIncome > 0 ? Math.round((numericSavings / numericIncome) * 100) : 0;

  let dtiStatus = { label: "Sangat Sehat", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20" };
  if (dtiRatio > 50) {
    dtiStatus = { label: "Bahaya", color: "text-rose-500 bg-rose-50 dark:bg-rose-900/20" };
  } else if (dtiRatio > 35) {
    dtiStatus = { label: "Peringatan", color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20" };
  }

  const handleExportPDF = async () => {
    if (!reportRef.current) return;
    toast.success('Sedang memproses laporan konsultasi Anda...');
    setIsExporting(true);
    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`SiKaya_Konsultasi_${selectedMood}.pdf`);
      toast.success('Rekomendasi AI berhasil diunduh dalam format PDF!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memproses ekspor PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

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

      const apiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({ profile, question: question.trim(), mood: selectedMood })
      });

      if (!apiRes.ok) {
        throw new Error("Gagal terhubung ke AI server.");
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
      if (token && token !== 'demo-token' && auth.currentUser) {
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
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <p className="text-xs font-black text-slate-700 dark:text-slate-200">Pilih Kepribadian Advisor:</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            type="button"
            onClick={() => setSelectedMood('Profesional')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Profesional' ? 'bg-teal-650 text-white border-teal-650 shadow-md shadow-teal-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100'}`}
          >
            <HeartHandshake className="w-3.5 h-3.5" /> Profesional
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Savage')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Savage' ? 'bg-rose-650 text-white border-rose-650 shadow-md shadow-rose-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100'}`}
          >
            <Skull className="w-3.5 h-3.5" /> Savage/Blunt 🔥
          </button>
          <button 
            type="button"
            onClick={() => setSelectedMood('Empathetic')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${selectedMood === 'Empathetic' ? 'bg-indigo-650 text-white border-indigo-650 shadow-md shadow-indigo-500/20' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-100'}`}
          >
            <Bot className="w-3.5 h-3.5" /> Empathetic 🤗
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
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xl glow-card-teal">
            <div 
              onClick={() => setIsProfileExpanded(!isProfileExpanded)}
              className="flex items-center justify-between cursor-pointer lg:cursor-default mb-5 pb-4 border-b border-slate-100 dark:border-slate-800 select-none"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm font-display flex items-center gap-2">
                    Profil Finansialmu
                    <span className="lg:hidden text-[9px] font-black bg-teal-500/10 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded-md">
                      {isProfileExpanded ? 'TUTUP' : 'LIHAT/UBAH'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed font-mono">IDR AUTO-FORMATTING AKTIF</p>
                </div>
              </div>
              <div className="lg:hidden">
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isProfileExpanded ? 'rotate-180' : ''}`} />
              </div>
            </div>
  
            <div className={`${isProfileExpanded ? 'block' : 'hidden lg:block'} space-y-4`}>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pemasukan Bulanan (Rp)</label>
                    <span className="text-[10px] font-mono text-slate-400">Auto-Format</span>
                  </div>
                  <input 
                    type="text" 
                    value={incomeInput}
                    onChange={(e) => setIncomeInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Total Tabungan Saat Ini (Rp)</label>
                  <input 
                    type="text" 
                    value={savingsInput}
                    onChange={(e) => setSavingsInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Pengeluaran Bulanan Rata-Rata (Rp)</label>
                  <input 
                    type="text" 
                    value={expensesInput}
                    onChange={(e) => setExpensesInput(formatRupiah(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-extrabold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Keuangan Terdekat</label>
                  <input 
                    type="text" 
                    value={goals}
                    onChange={(e) => setGoals(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                    placeholder="Contoh: Menikah, beli laptop..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Profil Risiko</label>
                  <select 
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-teal-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
                  >
                    <option value="Konservatif">🛡️ Konservatif (Sangat Cari Aman)</option>
                    <option value="Moderat">⚖️ Moderat (Seimbang)</option>
                    <option value="Agresif">⚡ Agresif (Siap Rugi demi Untung Besar)</option>
                  </select>
                </div>
              </form>
            </div>
          </div>

          {/* Diagnostics sidebar block */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-5 shadow-lg space-y-4">
            <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-mono">
              <ShieldAlert className="w-4 h-4 text-teal-600" /> Diagnostik Finansial Instan
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Rasio Belanja</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white font-mono mt-1">{dtiRatio}%</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-2 text-center w-full block ${dtiStatus.color}`}>
                  {dtiStatus.label}
                </span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Savings Rate</p>
                  <p className="text-xl font-black text-slate-800 dark:text-white font-mono mt-1">{savingsRate}%</p>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-2 text-center w-full block ${savingsRate >= 20 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
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
          className="lg:col-span-7 flex flex-col h-[750px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden glow-card-indigo"
        >
          {/* Header */}
          <div className="p-4 bg-slate-50/50 dark:bg-slate-950/20 border-b border-slate-150 dark:border-slate-850 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-650/10">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 font-display">SiKaya Advisor Copilot</p>
                <p className="text-[9px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest font-mono">Asisten Finansial Berdaya AI</p>
              </div>
            </div>
            
            {/* Quick Session Counter */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-xl text-slate-600 dark:text-slate-400">
              <History className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-[10px] font-black font-mono">{chatHistory.length}</span>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Session History Sidebar widget */}
            <div className="hidden sm:block w-48 border-r border-slate-150 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-950/20 overflow-y-auto p-3 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Riwayat Sesi Chat</p>
              {chatHistory.map((hist, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    setQuestion(hist.question);
                    setResponse(hist.response);
                    setSelectedMood(hist.mood as any);
                  }}
                  className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800 hover:border-teal-500 transition-all cursor-pointer group"
                >
                  <p className="text-[10px] font-black text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600">{hist.question}</p>
                  <div className="flex justify-between items-center mt-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{hist.mood}</span>
                    <span>{hist.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Output Area */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800 space-y-4">
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 p-5 rounded-2xl flex items-start gap-3.5 mb-4"
                  >
                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-450 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-extrabold text-rose-800 dark:text-rose-200 mb-1 uppercase tracking-wider font-mono">Gagal Memuat Rekomendasi AI</h4>
                      <p className="text-xs text-rose-600 dark:text-rose-400 font-medium leading-relaxed">
                        {error}
                      </p>
                    </div>
                  </motion.div>
                )}

                {!response && !loading && !error && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 p-4"
                  >
                    <Bot className="w-16 h-16 mb-4 opacity-15 animate-float" />
                    <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mb-1 font-display">Tanyakan Apapun Ke AI</h4>
                    <p className="text-xs font-medium max-w-sm leading-relaxed">
                      Halo! Ceritakan dilema finansialmu atau tanyakan tips investasi. Saya siap menganalisis berdasarkan profilmu di sebelah kiri.
                    </p>
                  </motion.div>
                )}
                
                {loading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full flex flex-col items-center justify-center py-10 text-teal-600 dark:text-teal-400"
                  >
                    <Loader2 className="w-9 h-9 animate-spin mb-3" />
                    <p className="text-xs font-bold uppercase tracking-widest animate-pulse font-mono">Sedang Menganalisis Profilmu...</p>
                    
                    {/* Bouncing typing indicators */}
                    <div className="flex gap-1.5 mt-4">
                      <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-bounce"></span>
                    </div>
                  </motion.div>
                )}

                {response && !loading && (
                  <motion.div 
                    ref={reportRef}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50/50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm prose prose-sm dark:prose-invert prose-teal max-w-none prose-headings:font-extrabold prose-p:leading-relaxed"
                  >
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-200/60 dark:border-slate-800 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 dark:text-slate-200">SiKaya Advisor ({selectedMood})</p>
                          <p className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase font-mono tracking-wider">Rekomendasi Berdasar Profil & Kepribadian</p>
                        </div>
                      </div>
                      
                      <button 
                        type="button"
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 text-white font-bold rounded-lg text-[10px] uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        {isExporting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                        <span>Unduh PDF</span>
                      </button>
                    </div>

                    {/* Quick Metadata summary for PDF export visibility */}
                    <div className="mb-4 p-3 bg-white dark:bg-slate-950 rounded-xl border border-slate-150 dark:border-slate-850 grid grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 font-mono">
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase">Pemasukan</span>
                        <span className="text-slate-850 dark:text-slate-200">Rp {numericIncome.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase">Tabungan</span>
                        <span className="text-slate-850 dark:text-slate-200">Rp {numericSavings.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase">Pengeluaran</span>
                        <span className="text-slate-850 dark:text-slate-200">Rp {numericExpenses.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    <div className="markdown-body text-[13px] sm:text-sm leading-relaxed space-y-2">
                      <ReactMarkdown>{response}</ReactMarkdown>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-150 dark:border-slate-850 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="px-3.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-teal-500 dark:hover:border-teal-500 rounded-full text-[10px] font-bold text-slate-600 dark:text-slate-300 transition-all hover:shadow-xs active:scale-95 cursor-pointer"
              >
                💡 {chip}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <form onSubmit={handleSubmit} className="relative flex items-center">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Contoh: Apakah aman kalau saya cicil HP pakai paylater?"
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-4 pr-12 py-3.5 text-xs sm:text-sm focus:outline-none focus:border-teal-500 disabled:opacity-50 transition-colors text-slate-800 dark:text-slate-100 font-medium"
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute right-2 p-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95 duration-150 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
