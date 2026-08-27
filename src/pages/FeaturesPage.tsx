import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Calculator, LineChart, Users, BrainCircuit, Target, Lightbulb, 
  TrendingUp, ShieldCheck, Gamepad2, GraduationCap, Video, FileText, Compass, 
  ArrowUpRight, CheckCircle2, ChevronRight, X, Sparkles, Award, Shield, 
  AlertTriangle, Calendar, Send, RefreshCw, Briefcase, ShieldAlert, Award as MedalIcon,
  Home, Car, Heart, Coins, PiggyBank, CreditCard, Wallet, Banknote, Percent, PieChart,
  Building, Rocket, Zap, Clock, Activity, Globe, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketDashboard } from '../components/MarketDashboard';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { featureLessons, LessonContent } from '../data/featureLessons';
import { PageHeader } from '../components/PageHeader';

interface FeatureItem {
  icon: any;
  title: string;
  desc: string;
  color: string;
  bg: string;
  category: 'dasar' | 'simulasi' | 'komunitas' | 'materi';
}

const features: FeatureItem[] = [
  { icon: FileText, title: "Modul Dasar Finansial", desc: "Pelajari cara mengatur arus kas, membedakan kebutuhan dan keinginan, serta membuat budget bulanan.", color: "text-blue-600", bg: "bg-blue-50", category: "dasar" },
  { icon: ShieldCheck, title: "Panduan Dana Darurat", desc: "Langkah demi langkah membangun jaring pengaman finansial sebelum mulai berinvestasi.", color: "text-teal-600", bg: "bg-teal-50", category: "dasar" },
  { icon: Lightbulb, title: "Mindset Investor", desc: "Pahami psikologi keuangan untuk menghindari FOMO (Fear of Missing Out) dan penipuan investasi.", color: "text-amber-600", bg: "bg-amber-50", category: "dasar" },
  { icon: LineChart, title: "Pengenalan Saham", desc: "Pahami konsep kepemilikan bisnis, dividen, dan capital gain dengan bahasa yang sederhana.", color: "text-emerald-600", bg: "bg-emerald-50", category: "materi" },
  { icon: Target, title: "Reksa Dana 101", desc: "Belajar menyerahkan pengelolaan dana kepada profesional dan konsep diversifikasi yang aman.", color: "text-purple-600", bg: "bg-purple-50", category: "materi" },
  { icon: Calculator, title: "Kalkulator Compound Interest", desc: "Visualisasikan keajaiban bunga majemuk dan betapa pentingnya mulai berinvestasi sejak usia muda.", color: "text-teal-600", bg: "bg-teal-50", category: "simulasi" },
  { icon: Gamepad2, title: "Game Trading Virtual", desc: "Beli dan jual instrumen keuangan dengan uang virtual menggunakan data pergerakan pasar nyata.", color: "text-rose-600", bg: "bg-rose-50", category: "simulasi" },
  { icon: BrainCircuit, title: "Kuis Literasi Keuangan", desc: "Uji pemahaman Anda tentang keuangan dan dapatkan lencana digital sebagai tanda penguasaan.", color: "text-blue-600", bg: "bg-blue-50", category: "simulasi" },
  { icon: Users, title: "Forum Diskusi Gen Z", desc: "Ruang aman untuk bertanya, berdebat, dan berbagi pengalaman keuangan tanpa takut dihakimi.", color: "text-emerald-600", bg: "bg-emerald-50", category: "komunitas" },
  { icon: Video, title: "Webinar Mentor Ahli", desc: "Ikuti kelas siaran langsung bulanan bersama praktisi pasar modal dan perencana keuangan bersertifikat.", color: "text-amber-600", bg: "bg-amber-50", category: "komunitas" },
  { icon: Compass, title: "Peta Jalan Karier Finansial", desc: "Rancang karier di masa depan untuk memaksimalkan income dan menyeimbangkannya dengan investasi.", color: "text-purple-600", bg: "bg-purple-50", category: "dasar" },
  { icon: CheckCircle2, title: "Klinik Portofolio", desc: "Sesi bedah portofolio simulasi bersama komunitas untuk mengetahui letak kesalahan alokasi.", color: "text-teal-600", bg: "bg-teal-50", category: "komunitas" },
  { icon: Home, title: "Kalkulator KPR Rumah", desc: "Simulasikan cicilan KPR rumah impian Anda dengan berbagai skenario suku bunga dan tenor.", color: "text-indigo-600", bg: "bg-indigo-50", category: "simulasi" },
  { icon: Target, title: "Simulasi Pensiun Dini", desc: "Hitung berapa dana yang Anda butuhkan untuk mencapai kebebasan finansial dan pensiun dini.", color: "text-emerald-600", bg: "bg-emerald-50", category: "simulasi" },
  { icon: ShieldAlert, title: "Detektor Investasi Bodong", desc: "Analisis ciri-ciri penawaran investasi yang mencurigakan sebelum Anda menyetorkan dana.", color: "text-rose-600", bg: "bg-rose-50", category: "dasar" },
  { icon: TrendingUp, title: "Kalkulator Inflasi", desc: "Lihat bagaimana inflasi menggerus nilai uang Anda di masa depan jika hanya disimpan di bawah bantal.", color: "text-orange-600", bg: "bg-orange-50", category: "simulasi" },
  { icon: Briefcase, title: "Kalkulator Pajak PPh 21", desc: "Estimasi potongan pajak penghasilan dari gaji kotor bulanan Anda berdasarkan aturan terbaru.", color: "text-blue-600", bg: "bg-blue-50", category: "dasar" },
  { icon: Car, title: "Simulasi Kredit Kendaraan", desc: "Hitung cicilan mobil atau motor baru beserta estimasi biaya asuransi dan perawatannya.", color: "text-teal-600", bg: "bg-teal-50", category: "simulasi" },
  { icon: RefreshCw, title: "Kalkulator Debt Snowball", desc: "Strategi melunasi hutang dengan cepat mulai dari saldo terkecil hingga terbesar.", color: "text-red-600", bg: "bg-red-50", category: "dasar" },
  { icon: GraduationCap, title: "Biaya Pendidikan Anak", desc: "Proyeksikan biaya pendidikan anak di masa depan dengan memperhitungkan inflasi dana pendidikan.", color: "text-purple-600", bg: "bg-purple-50", category: "simulasi" },
  { icon: Heart, title: "Kalkulator Zakat & Sedekah", desc: "Hitung kewajiban zakat maal atau zakat penghasilan Anda secara akurat dan mudah.", color: "text-emerald-600", bg: "bg-emerald-50", category: "dasar" },
  { icon: Compass, title: "Beli vs Sewa Rumah", desc: "Bandingkan secara finansial apakah lebih menguntungkan membeli atau menyewa properti saat ini.", color: "text-amber-600", bg: "bg-amber-50", category: "simulasi" },
  { icon: BookOpen, title: "Jurnal Trading Harian", desc: "Catat setiap transaksi saham atau kripto Anda beserta alasan emosional di baliknya.", color: "text-slate-600", bg: "bg-slate-50", category: "simulasi" },
  { icon: BrainCircuit, title: "Analisis Fundamental 101", desc: "Pelajari cara membaca laporan keuangan sederhana seperti PER, PBV, dan ROE.", color: "text-blue-600", bg: "bg-blue-50", category: "materi" },
  { icon: Coins, title: "Simulasi Crypto Dasar", desc: "Pahami cara kerja blockchain dan pergerakan aset kripto tanpa risiko kehilangan uang.", color: "text-yellow-600", bg: "bg-yellow-50", category: "simulasi" },
  { icon: Users, title: "P2P Lending Guide", desc: "Panduan aman menjadi lender di platform Peer-to-Peer Lending berizin OJK.", color: "text-green-600", bg: "bg-green-50", category: "materi" },
  { icon: Calendar, title: "Perencana Dana Liburan", desc: "Buat target tabungan liburan dan pecah menjadi nominal menabung harian/mingguan.", color: "text-sky-600", bg: "bg-sky-50", category: "simulasi" },
  { icon: Video, title: "Video Edukasi Premium", desc: "Akses ke perpustakaan video materi finansial mendalam dari para ahli terkemuka.", color: "text-rose-600", bg: "bg-rose-50", category: "materi" },
  { icon: Target, title: "Tantangan Hemat 30 Hari", desc: "Ikuti challenge mengurangi pengeluaran terselubung (latte factor) selama sebulan penuh.", color: "text-teal-600", bg: "bg-teal-50", category: "komunitas" },
  { icon: Shield, title: "Klinik Asuransi", desc: "Konsultasikan kebutuhan asuransi jiwa dan kesehatan Anda agar tidak salah beli produk (unit link).", color: "text-indigo-600", bg: "bg-indigo-50", category: "komunitas" },
  { icon: PiggyBank, title: "Kalkulator Deposito", desc: "Hitung bunga deposito bank umum dan BPR secara real time dengan potongan pajak.", color: "text-emerald-600", bg: "bg-emerald-50", category: "simulasi" },
  { icon: CreditCard, title: "Manajemen Kartu Kredit", desc: "Simulasi jeratan bunga kartu kredit jika Anda hanya membayar minimum payment setiap bulan.", color: "text-red-600", bg: "bg-red-50", category: "dasar" },
  { icon: Wallet, title: "Sistem Amplop Digital", desc: "Belajar metode budgeting tradisional yang didigitalisasi untuk mencegah overspending.", color: "text-blue-600", bg: "bg-blue-50", category: "dasar" },
  { icon: Banknote, title: "Simulasi Kurs Valuta Asing", desc: "Pantau dan simulasikan keuntungan menyimpan dana dalam bentuk mata uang asing (USD/EUR).", color: "text-emerald-600", bg: "bg-emerald-50", category: "simulasi" },
  { icon: Percent, title: "Kalkulator ROI", desc: "Hitung Return on Investment dari modal usaha atau investasi bisnis franchise Anda.", color: "text-purple-600", bg: "bg-purple-50", category: "simulasi" },
  { icon: PieChart, title: "Template Alokasi Gaji", desc: "Berbagai template alokasi (50/30/20, 40/30/20/10, dll) yang bisa disesuaikan dengan profil Anda.", color: "text-teal-600", bg: "bg-teal-50", category: "dasar" },
  { icon: Building, title: "Investasi Properti 101", desc: "Panduan memulai investasi tanah, rumah kost, atau apartemen untuk pemula.", color: "text-amber-600", bg: "bg-amber-50", category: "materi" },
  { icon: Rocket, title: "Startup & Saham Pre-IPO", desc: "Mengenal risiko dan peluang berinvestasi pada perusahaan rintisan melalui platform equity crowdfunding.", color: "text-orange-600", bg: "bg-orange-50", category: "materi" },
  { icon: Zap, title: "Kalkulator Listrik Token", desc: "Estimasi pengeluaran listrik bulanan berdasarkan daya dan pemakaian alat elektronik di rumah.", color: "text-yellow-600", bg: "bg-yellow-50", category: "simulasi" },
  { icon: Clock, title: "Time Value of Money", desc: "Pahami secara mendalam konsep nilai waktu dari uang untuk mengambil keputusan finansial.", color: "text-blue-600", bg: "bg-blue-50", category: "materi" },
  { icon: Activity, title: "Cek Kesehatan Finansial", desc: "Kuesioner komprehensif untuk mendiagnosis rasio utang, likuiditas, dan tabungan Anda.", color: "text-emerald-600", bg: "bg-emerald-50", category: "simulasi" },
  { icon: Globe, title: "Investasi Pasar Global", desc: "Panduan legal dan aman berinvestasi pada saham-saham perusahaan raksasa dunia seperti Apple & Google.", color: "text-indigo-600", bg: "bg-indigo-50", category: "materi" }
];

export function FeaturesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // 1. Budget 50/30/20 state
  const [monthlyIncome, setMonthlyIncome] = useState<number>(5000000);

  // 2. Emergency Fund state
  const [maritalStatus, setMaritalStatus] = useState<'single' | 'married' | 'kids'>('single');
  const [monthlyExpense, setMonthlyExpense] = useState<number>(3000000);
  const [currentSavings, setCurrentSavings] = useState<number>(1000000);

  // 3. Mindset / FOMO state
  const [fomoAnswers, setFomoAnswers] = useState<{ [key: number]: boolean }>({});
  const [showFomoResult, setShowFomoResult] = useState<boolean>(false);

  // 4. Stock simulator state
  const [stockInitial, setStockInitial] = useState<number>(1000000);
  const [dividendYield, setDividendYield] = useState<number>(4); // 4%
  const [annualGrowth, setAnnualGrowth] = useState<number>(8); // 8%

  // 5. Mutual fund profile
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  // 6. Compound Interest Calculator State
  const [ciPrincipal, setCiPrincipal] = useState<number>(1000000);
  const [ciMonthly, setCiMonthly] = useState<number>(200000);
  const [ciRate, setCiRate] = useState<number>(10);
  const [ciYears, setCiYears] = useState<number>(10);

  // 7. Trading Virtual Mini game state
  const [tradingPrice, setTradingPrice] = useState<number>(15000);
  const [tradingCash, setTradingCash] = useState<number>(10000000); // 10jt IDR
  const [tradingHoldings, setTradingHoldings] = useState<number>(0);
  const [tradingLogs, setTradingLogs] = useState<string[]>([]);

  // 8. Trivia quiz state
  const [triviaAnswers, setTriviaAnswers] = useState<{ [key: number]: number }>({});
  const [triviaSubmitted, setTriviaSubmitted] = useState<boolean>(false);

  // 9. Community mini board
  const [communityPosts, setCommunityPosts] = useState<{ name: string; content: string; time: string; likes: number }[]>([
    { name: "Andi Saputra", content: "Sumpah baru tau aturan 50/30/20 ngebantu banget hemat uang bulanan kost! Gak ada lagi drama akhir bulan makan indomie mulu.", time: "Baru saja", likes: 8 },
    { name: "Dewi Lestari", content: "Kemarin coba beli saham virtual BBRI di game simulasi, seru banget pas dapet profit dividen teoritisnya haha.", time: "2 menit lalu", likes: 3 }
  ]);
  const [newPostText, setNewPostText] = useState<string>("");

  // 10. Webinar booking state
  const [webinarSeats, setWebinarSeats] = useState<number>(42);
  const [webinarBooked, setWebinarBooked] = useState<boolean>(false);

  // 11. Career Roadmap Selector
  const [selectedCareer, setSelectedCareer] = useState<string>("tech");

  // 12. Portfolio clinic state
  const [allocStocks, setAllocStocks] = useState<number>(40);
  const [allocMutual, setAllocMutual] = useState<number>(30);
  const [allocCash, setAllocCash] = useState<number>(20);
  const [allocCrypto, setAllocCrypto] = useState<number>(10);

  // States for Cek Kesehatan Finansial
  const [fhsIncome, setFhsIncome] = useState<number>(6000000);
  const [fhsSavings, setFhsSavings] = useState<number>(1500000);
  const [fhsDebt, setFhsDebt] = useState<number>(1000000);
  const [fhsExpenses, setFhsExpenses] = useState<number>(3500000);
  const [fhsReport, setFhsReport] = useState<any | null>(null);

  // States for Sistem Amplop Digital / Budget Tracker
  const [btIncome, setBtIncome] = useState<number>(6000000);
  const [btSavingsTarget, setBtSavingsTarget] = useState<number>(1200000);
  const [envelopes, setEnvelopes] = useState<any[]>([
    { id: '1', name: '🍔 Makan & Transport', allocated: 2000000, spent: 850000, color: 'bg-orange-500' },
    { id: '2', name: '🏠 Kos, Listrik & Tagihan', allocated: 1500000, spent: 1500000, color: 'bg-indigo-500' },
    { id: '3', name: '🛍️ Belanja & Hobi', allocated: 1000000, spent: 950000, color: 'bg-rose-500' },
    { id: '4', name: '📈 Tabungan & Investasi', allocated: 1500000, spent: 0, color: 'bg-emerald-500' }
  ]);
  const [newExpenseName, setNewExpenseName] = useState<string>('');
  const [newExpenseAmount, setNewExpenseAmount] = useState<string>('');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<string>('1');

  // Auto fluctuating simulator price for Virtual Trading Game
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedFeature?.title === "Game Trading Virtual") {
      interval = setInterval(() => {
        setTradingPrice(prev => {
          const changePercent = (Math.random() - 0.49) * 4; // -2% to +2%
          const nextPrice = Math.round(prev * (1 + changePercent / 100));
          return Math.max(5000, nextPrice);
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [selectedFeature]);

  const handleStartLearning = () => {
    if (user) {
      navigate('/belajar');
    } else {
      navigate('/login');
    }
  };

  const categories = [
    { id: 'all', label: 'Semua Fitur' },
    { id: 'dasar', label: 'Dasar Finansial' },
    { id: 'materi', label: 'Materi Investasi' },
    { id: 'simulasi', label: 'Simulasi & Tools' },
    { id: 'komunitas', label: 'Komunitas' }
  ];

  const filteredFeatures = features.filter(f => {
    const matchesCategory = activeCategory === 'all' || f.category === activeCategory;
    const matchesSearch = f.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          f.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Custom JSX for each specialized interactive widget
  const renderInteractiveWidget = (title: string) => {
    switch (title) {
      case "Modul Dasar Finansial":
        const needs = monthlyIncome * 0.5;
        const wants = monthlyIncome * 0.3;
        const savings = monthlyIncome * 0.2;
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-blue-600" /> Simulasi Arus Kas 50/30/20 Anda
            </h4>
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 block">Masukkan Pendapatan Bersih Bulanan (Rp):</label>
              <input 
                type="number" 
                value={monthlyIncome} 
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl text-center">
                <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400">50% Kebutuhan Pokok</p>
                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">Rp {needs.toLocaleString('id-ID')}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Kontrakan, makan, tagihan.</p>
              </div>
              <div className="p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-center">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400">30% Keinginan (Wants)</p>
                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">Rp {wants.toLocaleString('id-ID')}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Kopi, hangout, streaming.</p>
              </div>
              <div className="p-3 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-center">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">20% Tabungan/Investasi</p>
                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">Rp {savings.toLocaleString('id-ID')}</p>
                <p className="text-[9px] text-slate-500 mt-0.5">Dana darurat, reksadana.</p>
              </div>
            </div>
          </div>
        );

      case "Panduan Dana Darurat":
        const multipliers = { single: 6, married: 9, kids: 12 };
        const targetMonths = multipliers[maritalStatus];
        const targetAmount = monthlyExpense * targetMonths;
        const progress = Math.min(100, Math.round((currentSavings / targetAmount) * 100)) || 0;
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" /> Kalkulator Target Dana Darurat
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Status Rumah Tangga:</label>
                <select 
                  value={maritalStatus} 
                  onChange={(e) => setMaritalStatus(e.target.value as any)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="single">Single / Lajang (Target 6 Bln)</option>
                  <option value="married">Menikah (Target 9 Bln)</option>
                  <option value="kids">Menikah + Anak (Target 12 Bln)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 block">Pengeluaran Bulanan (Rp):</label>
                <input 
                  type="number" 
                  value={monthlyExpense} 
                  onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block">Dana Darurat yang Dimiliki Sekarang (Rp):</label>
              <input 
                type="number" 
                value={currentSavings} 
                onChange={(e) => setCurrentSavings(Number(e.target.value))}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-100"
              />
            </div>
            <div className="p-4 bg-teal-500/10 rounded-xl border border-teal-500/20">
              <div className="flex justify-between text-xs font-black text-slate-800 dark:text-slate-200">
                <span>Total Target ({targetMonths} Bulan):</span>
                <span>Rp {targetAmount.toLocaleString('id-ID')}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-2 overflow-hidden">
                <div className="bg-teal-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
                <span>Progres Kesiapan: <strong>{progress}%</strong></span>
                {progress === 100 ? (
                  <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-0.5">✓ Sangat Aman</span>
                ) : (
                  <span>Sisa: Rp {(targetAmount - currentSavings).toLocaleString('id-ID')}</span>
                )}
              </div>
            </div>
          </div>
        );

      case "Mindset Investor":
        const handleFomoCheck = (idx: number) => {
          setFomoAnswers(prev => ({ ...prev, [idx]: !prev[idx] }));
        };
        const fomoScore = Object.values(fomoAnswers).filter(Boolean).length;
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" /> Detektor Kerentanan FOMO Anda
            </h4>
            <p className="text-[11px] text-slate-500 font-medium">Centang pernyataan berikut yang mencerminkan diri Anda:</p>
            <div className="space-y-2">
              {[
                "Saya sering merasa gatal ingin beli aset yang harganya sedang naik tajam (hijau pekat).",
                "Saya membeli koin/saham hanya karena influencer favorit saya membahasnya.",
                "Saya sering mengecek grafik harga portofolio lebih dari 5 kali sehari.",
                "Saya merasa stres atau menyesal jika melihat orang lain cuan melimpah dari koin yang tidak saya punya."
              ].map((text, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleFomoCheck(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                    fomoAnswers[idx] 
                      ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-400 text-amber-900 dark:text-amber-200' 
                      : 'bg-white dark:bg-slate-900 border-slate-150 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 text-[10px] ${fomoAnswers[idx] ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'}`}>
                    {fomoAnswers[idx] && "✓"}
                  </div>
                  <span>{text}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFomoResult(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Analisis Tingkat FOMO
            </button>
            {showFomoResult && (
              <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 text-xs">
                <span className="font-extrabold text-amber-900 dark:text-amber-300 block mb-1">Hasil Diagnosis:</span>
                {fomoScore === 0 && "Luar biasa! Anda memiliki mindset stoik dan kebal terhadap FOMO."}
                {fomoScore > 0 && fomoScore <= 2 && "Tingkat moderat. Anda masih bisa mengendalikan diri, tingkatkan analisis fundamental ya."}
                {fomoScore > 2 && "Bahaya! Anda sangat rentan terkena jebakan pom-pom. Segera kuasai prinsip 'Do Your Own Research' (DYOR)."}
              </div>
            )}
          </div>
        );

      case "Pengenalan Saham":
        const totalGrowth = 1 + (annualGrowth + dividendYield) / 100;
        const projectedValue = Math.round(stockInitial * Math.pow(totalGrowth, 5));
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <LineChart className="w-4 h-4 text-emerald-600" /> Proyeksi Return Saham (5 Tahun)
            </h4>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Modal Awal (Rp):</label>
                  <input 
                    type="number" 
                    value={stockInitial} 
                    onChange={(e) => setStockInitial(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Estimasi Kenaikan Harga (%/Thn):</label>
                  <input 
                    type="number" 
                    value={annualGrowth} 
                    onChange={(e) => setAnnualGrowth(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500">Estimasi Dividen Yield (%/Thn):</label>
                  <input 
                    type="number" 
                    value={dividendYield} 
                    onChange={(e) => setDividendYield(Number(e.target.value))}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 text-xs font-bold"
                  />
                </div>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Estimasi Nilai Portofolio Saham dalam 5 Tahun</p>
                <p className="text-xl font-black text-slate-800 dark:text-white mt-1">Rp {projectedValue.toLocaleString('id-ID')}</p>
                <p className="text-[10px] text-slate-500 mt-1">Total pertumbuhan bersih sebesar <strong>+{Math.round(((projectedValue - stockInitial)/stockInitial)*100)}%</strong></p>
              </div>
            </div>
          </div>
        );

      case "Reksa Dana 101":
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-600" /> Temukan Jenis Reksa Dana yang Sesuai
            </h4>
            <div className="space-y-3 text-xs">
              <label className="text-[11px] font-bold text-slate-500 block">Pilih profil toleransi risiko Anda:</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'conservative', label: 'Konservatif', desc: 'Sangat takut rugi, target investasi jangka pendek (<1 tahun).' },
                  { id: 'moderate', label: 'Moderat', desc: 'Bisa toleransi fluktuasi sedang, target menengah (1-3 tahun).' },
                  { id: 'aggressive', label: 'Agresif', desc: 'Siap hadapi penurunan tajam demi imbal hasil besar, jangka panjang (>5 tahun).' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setRiskProfile(item.id as any)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      riskProfile === item.id 
                        ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-500 text-purple-900 dark:text-purple-200' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <p className="font-extrabold text-xs">{item.label}</p>
                    <p className="text-[9px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </button>
                ))}
              </div>
              <div className="p-3.5 bg-purple-500/10 rounded-xl border border-purple-500/20">
                <span className="font-black text-purple-700 dark:text-purple-400 block mb-1">Rekomendasi Produk:</span>
                {riskProfile === 'conservative' && "🛡️ Reksa Dana Pasar Uang (RDPU). Keamanan pokok adalah prioritas utama. Risiko fluktuasi mendekati nol."}
                {riskProfile === 'moderate' && "📊 Reksa Dana Pendapatan Tetap (RDPT) atau Obligasi Negara. Menawarkan keuntungan di atas inflasi secara stabil."}
                {riskProfile === 'aggressive' && "🚀 Reksa Dana Saham (RDS). Memaksimalkan efek pertumbuhan compounding dari emiten-emiten bluechip."}
              </div>
            </div>
          </div>
        );

      case "Kalkulator Compound Interest":
        let currentTotal = ciPrincipal;
        for (let i = 0; i < ciYears; i++) {
          currentTotal = (currentTotal + ciMonthly * 12) * (1 + ciRate / 100);
        }
        const totalInvested = ciPrincipal + (ciMonthly * 12 * ciYears);
        const totalInterest = Math.max(0, currentTotal - totalInvested);
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-teal-600" /> Visualisasi Bola Salju Compound Interest
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Modal Awal (Rp):</label>
                <input type="number" value={ciPrincipal} onChange={(e) => setCiPrincipal(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2 py-1 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Saku Bulanan (Rp):</label>
                <input type="number" value={ciMonthly} onChange={(e) => setCiMonthly(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2 py-1 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Imbal Hasil (%/Thn):</label>
                <input type="number" value={ciRate} onChange={(e) => setCiRate(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2 py-1 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Durasi (Tahun):</label>
                <input type="number" value={ciYears} onChange={(e) => setCiYears(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2 py-1 font-bold" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-center text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
                <p className="text-[10px] text-slate-500 font-bold">Total Uang Disetor</p>
                <p className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">Rp {Math.round(totalInvested).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl">
                <p className="text-[10px] text-teal-600 font-bold">Hasil Bunga Majemuk</p>
                <p className="text-sm font-black text-teal-600 mt-1">Rp {Math.round(totalInterest).toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3 bg-teal-600 text-white rounded-xl">
                <p className="text-[10px] font-bold opacity-80">Nilai Akhir Estimasi</p>
                <p className="text-sm font-black mt-1">Rp {Math.round(currentTotal).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>
        );

      case "Game Trading Virtual":
        const handleBuyVirtual = () => {
          if (tradingCash >= tradingPrice) {
            setTradingCash(prev => prev - tradingPrice);
            setTradingHoldings(prev => prev + 1);
            setTradingLogs(prev => [`Beli 1 unit SKYA seharga Rp ${tradingPrice.toLocaleString('id-ID')}`, ...prev.slice(0, 4)]);
          }
        };
        const handleSellVirtual = () => {
          if (tradingHoldings > 0) {
            setTradingCash(prev => prev + tradingPrice);
            setTradingHoldings(prev => prev - 1);
            setTradingLogs(prev => [`Jual 1 unit SKYA seharga Rp ${tradingPrice.toLocaleString('id-ID')}`, ...prev.slice(0, 4)]);
          }
        };
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-rose-600 animate-pulse" /> Mini Paper Trading: SiKaya Coin (SKYA)
              </h4>
              <span className="text-[10px] font-black bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full animate-pulse">LIVE</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-white dark:bg-slate-900 border rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold">Harga SKYA Saat Ini</p>
                <p className="text-lg font-black text-rose-600 mt-1">Rp {tradingPrice.toLocaleString('id-ID')}</p>
              </div>
              <div className="p-3.5 bg-white dark:bg-slate-900 border rounded-xl text-center">
                <p className="text-[10px] text-slate-500 font-bold">Kekayaan Anda (Kas + Koin)</p>
                <p className="text-lg font-black text-slate-800 dark:text-white mt-1">
                  Rp {(tradingCash + tradingHoldings * tradingPrice).toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center text-xs text-slate-600 dark:text-slate-300">
              <span>Kas Virtual: <strong>Rp {tradingCash.toLocaleString('id-ID')}</strong></span>
              <span>Jumlah Koin: <strong>{tradingHoldings} SKYA</strong></span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleBuyVirtual}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
              >
                BELI 1 SKYA
              </button>
              <button 
                onClick={handleSellVirtual}
                disabled={tradingHoldings === 0}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-black py-2.5 rounded-xl transition-all disabled:opacity-45 cursor-pointer"
              >
                JUAL 1 SKYA
              </button>
            </div>
            {tradingLogs.length > 0 && (
              <div className="space-y-1 text-[10px] text-slate-500 pt-2 border-t font-mono">
                <p className="font-bold text-slate-700 dark:text-slate-400">Log Transaksi Terakhir:</p>
                {tradingLogs.map((log, lIdx) => (
                  <p key={lIdx}>• {log}</p>
                ))}
              </div>
            )}
          </div>
        );

      case "Kuis Literasi Keuangan":
        const triviaQuestions = [
          { id: 1, q: "Apa dampak inflasi yang tinggi terhadap uang tunai yang Anda simpan di bawah bantal?", options: ["A. Nilai belinya turun karena harga barang naik.", "B. Nilainya tetap sama karena tidak diapa-apakan.", "C. Nilainya bertambah karena uang semakin langka."], correct: 0 },
          { id: 2, q: "Jika Anda meminjam uang melalui pinjol ilegal, pilar manajemen risiko apa yang dilanggar?", options: ["A. Diversifikasi", "B. Keamanan Hukum & Regulasi", "C. Leverage Pasar"], correct: 1 }
        ];
        const handleSelectTrivia = (qId: number, optIdx: number) => {
          setTriviaAnswers(prev => ({ ...prev, [qId]: optIdx }));
        };
        const handleCheckTrivia = () => {
          setTriviaSubmitted(true);
        };
        const correctTriviaCount = triviaQuestions.filter(q => triviaAnswers[q.id] === q.correct).length;
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-blue-600" /> Kuis Kecakapan Finansial Cepat
            </h4>
            <div className="space-y-4 text-xs">
              {triviaQuestions.map((q) => (
                <div key={q.id} className="space-y-2">
                  <p className="font-bold text-slate-800 dark:text-slate-200">{q.id}. {q.q}</p>
                  <div className="grid grid-cols-1 gap-1.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = triviaAnswers[q.id] === oIdx;
                      let btnBg = isSelected ? "bg-blue-50 border-blue-500 dark:bg-blue-950/20" : "bg-white dark:bg-slate-900";
                      if (triviaSubmitted) {
                        if (oIdx === q.correct) {
                          btnBg = "bg-emerald-50 border-emerald-500 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300";
                        } else if (isSelected) {
                          btnBg = "bg-rose-50 border-rose-500 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300";
                        }
                      }
                      return (
                        <button
                          key={oIdx}
                          disabled={triviaSubmitted}
                          onClick={() => handleSelectTrivia(q.id, oIdx)}
                          className={`p-2.5 rounded-xl border text-left font-bold transition-all text-[11px] cursor-pointer ${btnBg}`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!triviaSubmitted ? (
                <button
                  onClick={handleCheckTrivia}
                  disabled={Object.keys(triviaAnswers).length < triviaQuestions.length}
                  className="w-full bg-slate-900 text-white font-black py-2 rounded-xl text-xs disabled:opacity-45 cursor-pointer"
                >
                  Kirim Jawaban
                </button>
              ) : (
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center font-bold text-emerald-600">
                  <span className="flex items-center justify-center gap-1.5 text-xs">
                    <MedalIcon className="w-4 h-4" /> Skor Anda: {correctTriviaCount} / {triviaQuestions.length} Benar!
                  </span>
                </div>
              )}
            </div>
          </div>
        );

      case "Forum Diskusi Gen Z":
        const handleSendPost = () => {
          if (newPostText.trim()) {
            setCommunityPosts(prev => [
              { name: "Sobat SiKaya", content: newPostText, time: "Baru saja", likes: 0 },
              ...prev
            ]);
            setNewPostText("");
          }
        };
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-emerald-600" /> Diskusi Terkini Komunitas
            </h4>
            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
              {communityPosts.map((post, pIdx) => (
                <div key={pIdx} className="p-3 bg-white dark:bg-slate-900 border rounded-xl text-xs">
                  <div className="flex justify-between font-extrabold text-slate-800 dark:text-slate-200 mb-1">
                    <span>{post.name}</span>
                    <span className="text-[9px] text-slate-400">{post.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">{post.content}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Bagikan pengalaman hemat atau investasimu..." 
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                className="flex-1 bg-white dark:bg-slate-900 border text-xs px-3 rounded-xl focus:outline-none"
              />
              <button 
                onClick={handleSendPost}
                className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-500 transition-colors shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        );

      case "Webinar Mentor Ahli":
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Video className="w-4 h-4 text-amber-500" /> Sesi Live Webinar Mendatang
              </h4>
              <span className="text-[9px] font-black bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded uppercase">Gratis</span>
            </div>
            <div className="p-3.5 bg-white dark:bg-slate-900 border rounded-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5" /> <span>Sabtu ini, Pukul 19:30 WIB</span>
              </div>
              <p className="font-extrabold text-slate-800 dark:text-white leading-snug">Bedah Kasus Perencanaan Masa Depan Gen Z Tanpa Beban Finansial</p>
              <p className="text-[10px] text-slate-500">Bersama: <strong>Raka Adiputra, CFP®</strong> (Senior Wealth Advisor)</p>
            </div>
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-bold">Tersisa: <strong className="text-teal-600">{webinarSeats} Kursi</strong></span>
              {!webinarBooked ? (
                <button
                  onClick={() => {
                    setWebinarSeats(prev => Math.max(0, prev - 1));
                    setWebinarBooked(true);
                  }}
                  className="bg-teal-600 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-teal-500 cursor-pointer"
                >
                  Amankan Kursi Saya
                </button>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1">✓ Berhasil Terdaftar!</span>
              )}
            </div>
          </div>
        );

      case "Peta Jalan Karier Finansial":
        const careerData: { [key: string]: { skill: string; starting: string; roadmap: string[] } } = {
          tech: { skill: "Software Engineer / AI Dev", starting: "Rp 8M - Rp 15M / bulan", roadmap: ["Kuasai Dasar JavaScript/Python", "Bangun Portfolio Project Riil", "Belajar Cloud Computing & API Integration"] },
          product: { skill: "Product Manager", starting: "Rp 7M - Rp 12M / bulan", roadmap: ["Pahami Metodologi Agile / Scrum", "Pelajari Analisis Data & Metrik", "Kuasai User Research & Desain Dasar"] },
          design: { skill: "UI/UX Designer", starting: "Rp 6M - Rp 10M / bulan", roadmap: ["Kuasai Tools Figma & Prototyping", "Pahami Teori Psikologi Warna & Layout", "Rancang Portfolio Studi Kasus Riil"] }
        };
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-purple-600" /> Peta Jalan High-Income Skill
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex gap-1.5">
                {[
                  { id: "tech", label: "Tech / Dev" },
                  { id: "product", label: "Product" },
                  { id: "design", label: "UI/UX" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setSelectedCareer(btn.id)}
                    className={`flex-1 py-1 px-2.5 border rounded-lg font-bold text-[10px] transition-all cursor-pointer ${
                      selectedCareer === btn.id 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white dark:bg-slate-900 text-slate-600'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
              <div className="p-3 bg-white dark:bg-slate-900 border rounded-xl space-y-1.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase">Rekomendasi Profesi:</p>
                <p className="font-extrabold text-sm text-slate-800 dark:text-white">{careerData[selectedCareer].skill}</p>
                <p className="text-[10px] text-emerald-600 font-bold">Gaji Awal Estimasi: {careerData[selectedCareer].starting}</p>
                <div className="pt-1 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Milestone Pembelajaran:</p>
                  {careerData[selectedCareer].roadmap.map((step, sIdx) => (
                    <p key={sIdx}>📍 {step}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "Klinik Portofolio":
        const handleHealthCheck = () => {
          setFomoAnswers({ ...fomoAnswers, [99]: true });
        };
        const clinicTotal = allocStocks + allocMutual + allocCash + allocCrypto;
        const totalValid = clinicTotal === 100;
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-teal-600" /> Cek Kesehatan Portofolio Anda
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-[10px] text-slate-500 font-bold mb-1">Sesuaikan alokasi portofolio Anda saat ini (Total wajib 100%):</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border p-2 rounded-xl">
                  <span>Saham:</span>
                  <input type="number" value={allocStocks} onChange={(e) => setAllocStocks(Number(e.target.value))} className="w-12 text-right font-black" />
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border p-2 rounded-xl">
                  <span>Reksa Dana:</span>
                  <input type="number" value={allocMutual} onChange={(e) => setAllocMutual(Number(e.target.value))} className="w-12 text-right font-black" />
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border p-2 rounded-xl">
                  <span>Uang Kas / Deposito:</span>
                  <input type="number" value={allocCash} onChange={(e) => setAllocCash(Number(e.target.value))} className="w-12 text-right font-black" />
                </div>
                <div className="flex items-center justify-between bg-white dark:bg-slate-900 border p-2 rounded-xl">
                  <span>Aset Crypto / Spekulatif:</span>
                  <input type="number" value={allocCrypto} onChange={(e) => setAllocCrypto(Number(e.target.value))} className="w-12 text-right font-black" />
                </div>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-[10px] text-slate-500">Akumulasi Total: <strong className={totalValid ? "text-emerald-600" : "text-rose-500"}>{clinicTotal}%</strong></span>
                <button
                  disabled={!totalValid}
                  onClick={handleHealthCheck}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-black px-4 py-1.5 rounded-xl text-[10px] disabled:opacity-40 cursor-pointer"
                >
                  Analisis Risiko Portofolio
                </button>
              </div>
              {fomoAnswers[99] && totalValid && (
                <div className="p-3 bg-teal-500/10 rounded-xl border border-teal-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <span className="font-extrabold text-teal-800 dark:text-teal-400 block">Rekomendasi Diagnostik:</span>
                  {allocCrypto > 15 && <p className="text-amber-600 dark:text-amber-400 font-bold">⚠️ Warning: Alokasi Crypto terlalu besar ({allocCrypto}%). Sangat volatil, batasi maksimal 5-10% untuk pemula.</p>}
                  {allocCash < 15 && <p className="text-rose-600 dark:text-rose-400 font-bold">⚠️ Warning: Kas cair Anda terlalu rendah ({allocCash}%). Risiko kesulitan likuiditas bila ada kebutuhan darurat mendesak.</p>}
                  {allocStocks + allocMutual > 70 && <p className="text-emerald-600 dark:text-emerald-400 font-bold">📈 Sangat Agresif. Cocok untuk Anda yang memiliki target jangka panjang di atas 5-10 tahun.</p>}
                  {allocCash > 40 && <p className="text-blue-600">🛡️ Sangat Konservatif. Aman dari inflasi ringan, namun pertimbangkan memindahkan sebagian kas menganggur ke reksa dana pendapatan tetap agar tumbuh lebih efisien.</p>}
                </div>
              )}
            </div>
          </div>
        );

      case "Cek Kesehatan Finansial":
        const handleCalculateFhs = () => {
          const savingsRate = (fhsSavings / fhsIncome) * 100;
          const debtRatio = (fhsDebt / fhsIncome) * 100;
          const expensesRatio = (fhsExpenses / fhsIncome) * 100;
          const cashFlow = fhsIncome - fhsSavings - fhsDebt - fhsExpenses;

          // Compute scores
          let savingsScore = savingsRate >= 20 ? 100 : (savingsRate / 20) * 100;
          let debtScore = debtRatio <= 30 ? 100 : Math.max(0, 100 - (debtRatio - 30) * 2);
          let expensesScore = expensesRatio <= 50 ? 100 : Math.max(0, 100 - (expensesRatio - 50) * 2);
          let cashFlowScore = cashFlow >= 0 ? 100 : 30;

          const finalScore = Math.round((savingsScore * 0.3) + (debtScore * 0.3) + (expensesScore * 0.2) + (cashFlowScore * 0.2));

          let fhsStatus = "Sangat Sehat";
          let fhsColor = "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
          let advicesList: string[] = [];

          if (finalScore < 50) {
            fhsStatus = "Sakit Finansial (Kritis)";
            fhsColor = "text-rose-500 bg-rose-500/10 border-rose-500/20";
          } else if (finalScore < 75) {
            fhsStatus = "Butuh Perbaikan (Kuning)";
            fhsColor = "text-amber-500 bg-amber-500/10 border-amber-500/20";
          }

          if (savingsRate < 20) {
            advicesList.push(`⚠️ Alokasi tabungan Anda (${savingsRate.toFixed(1)}%) di bawah batas aman 20%. Cobalah memangkas pengeluaran non-esensial.`);
          } else {
            advicesList.push(`✓ Rasio tabungan Anda (${savingsRate.toFixed(1)}%) sangat baik dan disiplin.`);
          }

          if (debtRatio > 30) {
            advicesList.push(`⚠️ Cicilan utang Anda (${debtRatio.toFixed(1)}%) melebihi batas aman 30%. Batasi penambahan utang baru atau konsolidasi utang Anda.`);
          } else {
            advicesList.push(`✓ Cicilan utang Anda (${debtRatio.toFixed(1)}%) terkontrol dengan aman di bawah 30%.`);
          }

          if (cashFlow < 0) {
            advicesList.push(`🚨 Defisit Arus Kas: Anda membelanjakan Rp ${Math.abs(cashFlow).toLocaleString('id-ID')} lebih banyak dari pendapatan Anda! Risiko tinggi terjerat utang.`);
          } else {
            advicesList.push(`✓ Arus Kas Positif: Sisa surplus bulanan Anda adalah Rp ${cashFlow.toLocaleString('id-ID')}. Sangat baik!`);
          }

          setFhsReport({
            score: finalScore,
            status: fhsStatus,
            color: fhsColor,
            advices: advicesList,
            savingsRate,
            debtRatio,
            expensesRatio,
            cashFlow
          });
        };

        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-emerald-600 animate-pulse" /> Diagnosis Kesehatan Finansial
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Pendapatan Bulanan (Rp):</label>
                <input type="number" value={fhsIncome} onChange={(e) => setFhsIncome(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Alokasi Tabungan (Rp):</label>
                <input type="number" value={fhsSavings} onChange={(e) => setFhsSavings(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Cicilan Utang Bulanan (Rp):</label>
                <input type="number" value={fhsDebt} onChange={(e) => setFhsDebt(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500">Pengeluaran Lainnya (Rp):</label>
                <input type="number" value={fhsExpenses} onChange={(e) => setFhsExpenses(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
            </div>

            <button
              onClick={handleCalculateFhs}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl transition-all cursor-pointer"
            >
              Mulai Diagnosis Kesehatan Keuangan
            </button>

            {fhsReport && (
              <div className={`p-4 rounded-xl border ${fhsReport.color.split(' ')[1]} ${fhsReport.color.split(' ')[2]} space-y-3`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Health Score Anda</p>
                    <p className={`text-xl font-black ${fhsReport.color.split(' ')[0]}`}>{fhsReport.score} / 100</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase border ${fhsReport.color}`}>
                    {fhsReport.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs">
                  {fhsReport.advices.map((adv: string, idx: number) => (
                    <p key={idx} className="leading-snug font-medium text-slate-700 dark:text-slate-300">{adv}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case "Sistem Amplop Digital":
      case "Template Alokasi Gaji":
        const handleAddExpense = (e: React.FormEvent) => {
          e.preventDefault();
          if (!newExpenseName || !newExpenseAmount) return;
          const amt = Number(newExpenseAmount);
          if (isNaN(amt) || amt <= 0) return;

          setEnvelopes(prev => prev.map(env => {
            if (env.id === selectedEnvelopeId) {
              const updatedSpent = env.spent + amt;
              return { ...env, spent: updatedSpent };
            }
            return env;
          }));

          setNewExpenseName('');
          setNewExpenseAmount('');
        };

        const handleResetEnvelopes = () => {
          setEnvelopes(prev => prev.map(e => ({ ...e, spent: 0 })));
        };

        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/80 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-blue-600" /> Amplop Digital & Pelacak Pengeluaran
              </h4>
              <button onClick={handleResetEnvelopes} className="text-[10px] font-bold text-rose-500 hover:underline">Reset Spend</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-slate-500 block">Saku Bulanan (Income):</label>
                <input type="number" value={btIncome} onChange={(e) => setBtIncome(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 block">Target Tabungan Bulanan:</label>
                <input type="number" value={btSavingsTarget} onChange={(e) => setBtSavingsTarget(Number(e.target.value))} className="w-full bg-white dark:bg-slate-900 border rounded-xl px-2.5 py-1.5 font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-500 uppercase font-mono">Daftar Amplop Anda (Sisa Saldo):</p>
              {envelopes.map((env) => {
                const remaining = env.allocated - env.spent;
                const percent = Math.min(100, Math.round((env.spent / env.allocated) * 100));
                return (
                  <div key={env.id} className="p-3 bg-white dark:bg-slate-900 border rounded-xl text-xs space-y-1.5">
                    <div className="flex justify-between font-bold">
                      <span className="text-slate-800 dark:text-slate-200">{env.name}</span>
                      <span className={remaining < 0 ? "text-rose-500 font-extrabold font-mono" : "text-slate-600 dark:text-slate-400 font-mono"}>
                        Sisa: Rp {remaining.toLocaleString('id-ID')} / Rp {env.allocated.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${remaining < 0 ? 'bg-rose-500' : 'bg-blue-500'} h-2 rounded-full transition-all duration-300`} style={{ width: `${percent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-400 font-semibold font-mono">
                      <span>Terpakai: {percent}%</span>
                      {remaining < 0 && <span className="text-rose-500 font-extrabold animate-pulse">OVER BUDGET!</span>}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAddExpense} className="p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 space-y-2.5">
              <p className="text-[10px] font-black text-blue-600 uppercase font-mono">Belanja / Kurangi Amplop:</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <select 
                  value={selectedEnvelopeId} onChange={(e) => setSelectedEnvelopeId(e.target.value)}
                  className="bg-white dark:bg-slate-900 border rounded-lg px-2 py-1.5 font-bold cursor-pointer"
                >
                  {envelopes.map(e => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
                <input 
                  type="text" placeholder="Deskripsi (misal: Kopi)" value={newExpenseName} onChange={(e) => setNewExpenseName(e.target.value)} required
                  className="bg-white dark:bg-slate-900 border rounded-lg px-2 py-1.5"
                />
                <input 
                  type="number" placeholder="Nominal (Rp)" value={newExpenseAmount} onChange={(e) => setNewExpenseAmount(e.target.value)} required
                  className="bg-white dark:bg-slate-900 border rounded-lg px-2 py-1.5 font-bold font-mono"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all uppercase tracking-wider cursor-pointer">
                Catat Pengeluaran Amplop
              </button>
            </form>
          </div>
        );

      default:
        return (
          <div className="bg-slate-50 dark:bg-slate-800/40 p-8 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
              Interactive Tool: {title}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              Fitur simulasi interaktif ini sedang dalam tahap pengembangan akhir dan akan segera rilis pada update versi SiKaya berikutnya. 
            </p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-black rounded-full uppercase tracking-widest mt-2">
              <Clock className="w-3 h-3" /> Coming Soon
            </span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 transition-colors py-6 sm:py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          category="Belajar"
          title="Pusat Modul & Simulasi Finansial"
          description="Mulai dari cara membuat anggaran hingga simulasi kalkulator, temukan semua alat yang Anda butuhkan untuk mencapai kebebasan finansial."
          badge="35+ ALAT & MODUL"
        />
      </div>

      {/* Main Content */}
      <section className="py-2 relative z-20">
        <div className="max-w-7xl mx-auto">
          
          {/* Feature Category Tabs & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center md:justify-start gap-1.5 bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex-1 md:flex-none min-w-[100px] cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                      : 'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-72 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Cari modul atau tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-base sm:text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-sm"
              />
            </div>
          </div>

          <MarketDashboard />

          {/* Features Responsive Grid */}
          <motion.div 
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 transition-all"
          >
            <AnimatePresence>
              {filteredFeatures.map((feat, index) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2, delay: index * 0.02 }}
                  key={feat.title} 
                  onClick={() => {
                    setSelectedFeature(feat);
                    // Reset temporary widget states
                    setShowFomoResult(false);
                    setTriviaAnswers({});
                    setTriviaSubmitted(false);
                  }}
                  className="bg-white dark:bg-slate-900 p-4.5 sm:p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full"
                >
                  <div>
                    <div className={`w-10 h-10 rounded-xl ${feat.bg} dark:bg-slate-800/80 flex items-center justify-center mb-3.5 shadow-xs transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      <feat.icon className={`h-5 w-5 ${feat.color} dark:text-teal-400`} />
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-100 mb-1.5 group-hover:text-teal-700 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-3">
                      {feat.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between w-full">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-teal-600 dark:text-teal-400 group-hover:translate-x-1 transition-transform">
                      <span>Buka Materi</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full uppercase">
                      {feat.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Fallback empty view */}
          {filteredFeatures.length === 0 && (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 font-medium">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
                <BrainCircuit className="w-6 h-6 text-slate-300 dark:text-slate-600" />
              </div>
              Modul tidak ditemukan. Silakan pilih kategori lain.
            </div>
          )}
        </div>
      </section>

      {/* Feature Lesson Modal Overlay */}
      <AnimatePresence>
        {selectedFeature && (() => {
          const lesson: LessonContent | undefined = featureLessons[selectedFeature.title];
          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto bg-slate-900/60 backdrop-blur-xs">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-250 dark:border-slate-800 overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Top Bar */}
                <div className="flex justify-between items-center p-5 border-b border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${selectedFeature.bg} dark:bg-slate-800`}>
                      <selectedFeature.icon className={`w-5 h-5 ${selectedFeature.color}`} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">SIKAYA STUDY MODULE</p>
                      <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight">{selectedFeature.title}</h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedFeature(null)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-300">
                  {lesson ? (
                    <>
                      {/* Subtitle & Introduction */}
                      <div>
                        <h4 className="text-base font-black text-teal-600 dark:text-teal-400 tracking-tight leading-snug">{lesson.subtitle}</h4>
                        <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-500 dark:text-slate-400 mt-2 italic">
                          "{lesson.introduction}"
                        </p>
                      </div>

                      {/* Interactive Widget Area */}
                      <div>
                        {renderInteractiveWidget(selectedFeature.title)}
                      </div>

                      {/* Key Takeaways */}
                      <div className="p-4 bg-teal-500/5 rounded-2xl border border-teal-500/10 space-y-2">
                        <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest block flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Hal Penting yang Wajib Dipahami (Key Takeaways)
                        </span>
                        <div className="space-y-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200">
                          {lesson.keyTakeaways.map((takeaway, tIdx) => (
                            <div key={tIdx} className="flex items-start gap-2">
                              <span className="text-teal-600 font-bold shrink-0">✔</span>
                              <p className="leading-relaxed">{takeaway}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Detailed Sections */}
                      <div className="space-y-5">
                        {lesson.detailedSections.map((sec, sIdx) => (
                          <div key={sIdx} className="space-y-2">
                            <h5 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5">
                              <span className="w-1.5 h-3 bg-teal-600 rounded-full"></span>
                              {sec.title}
                            </h5>
                            <p className="text-xs sm:text-sm font-medium leading-relaxed text-slate-600 dark:text-slate-400 whitespace-pre-line">
                              {sec.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Source attribution to combat "ilmu bodong" */}
                      <div className="p-4 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-2">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" /> Referensi Sumber Kredibel (Anti Ilmu Bodong)
                        </span>
                        <div className="space-y-2 text-xs">
                          {lesson.sources.map((src, srcIdx) => (
                            <div key={srcIdx} className="space-y-0.5">
                              <p className="font-extrabold text-slate-800 dark:text-slate-200">{src.name}</p>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{src.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        {renderInteractiveWidget(selectedFeature.title)}
                      </div>
                      <div className="text-center py-6 text-slate-400 dark:text-slate-500 font-medium text-xs bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <BookOpen className="w-8 h-8 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                        Pembahasan detail modul tertulis sedang dalam proses penyusunan kurikulum lengkap oleh tim ahli.
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center shrink-0">
                  <p className="text-[10px] font-bold text-slate-400">SiKaya Cerdas Finansial • Kurikulum OJK & OECD</p>
                  <button
                    onClick={handleStartLearning}
                    className="px-5 py-2 text-xs font-black text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all hover:shadow-lg hover:shadow-teal-600/15 cursor-pointer"
                  >
                    Buka Kelas Ujian & Sertifikasi
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>
      
      {/* Mini CTA */}
      <section className="bg-slate-50 dark:bg-slate-900 py-16 border-t border-slate-200 dark:border-slate-800 text-center transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center justify-center mx-auto mb-6 transform -rotate-3 hover:rotate-0 transition-transform">
            <MedalIcon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 tracking-tight">Siap tingkatkan skor literasimu?</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
            Bergabung dengan kelas interaktif pertama kami dan pelajari ilmu penting yang tidak diajarkan di bangku sekolah.
          </p>
          <button 
            onClick={handleStartLearning}
            className="px-8 py-3.5 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-xl transition-all shadow-xl shadow-teal-600/20 hover:shadow-teal-600/30 active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
          >
            <BookOpen className="w-4 h-4" /> Buka Kelas Sekarang
          </button>
        </div>
      </section>
    </div>
  );
}
