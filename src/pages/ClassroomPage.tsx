import { useState, useEffect, useMemo, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { 
  BookOpen, Trophy, Sparkles, AlertTriangle, CheckCircle2, 
  ArrowRight, ShieldCheck, HelpCircle, ChevronRight, Download, Award,
  Search, Hexagon, RefreshCw, Wallet, TrendingUp, Bookmark, Maximize2, Minimize2,
  MessageSquare, Send, Loader2, Sparkle, ListTodo, Star, Info, Lightbulb, Check, GraduationCap,
  Lock, Gift, Volume2, VolumeX, Play, Pause, RotateCcw, Flame, Clock, Copy, Heart, Filter, Shuffle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';

// Import our modular classroom sub-components
import { BudgetingModule } from '../components/classroom/BudgetingModule';
import { DebtModule } from '../components/classroom/DebtModule';
import { CompoundModule } from '../components/classroom/CompoundModule';
import { InvestingModule } from '../components/classroom/InvestingModule';
import { EmergencyModule } from '../components/classroom/EmergencyModule';
import { CryptoModule } from '../components/classroom/CryptoModule';
import { ReksadanaModule } from '../components/classroom/ReksadanaModule';
import { SahamModule } from '../components/classroom/SahamModule';
import { CareerModule } from '../components/classroom/CareerModule';
import { PortfolioModule } from '../components/classroom/PortfolioModule';
import { GLOSSARY_ITEMS } from '../data/glossary';
import { featureLessons, LessonContent } from '../data/featureLessons';
import { auth } from '../lib/firebase';

const DAILY_QUIZ_QUESTIONS = [
  {
    id: 1,
    q: "Jika inflasi tahunan sebesar 5% dan return investasi riil Anda hanya 3%, apa yang terjadi pada daya beli uang Anda?",
    options: [
      { text: "Daya beli uang berkurang (tergerus inflasi)", correct: true },
      { text: "Daya beli uang bertambah seiring waktu", correct: false },
      { text: "Daya beli uang tetap stabil", correct: false }
    ],
    explanation: "Luar biasa! Jawaban Anda 100% Benar. Daya beli uang tergerus karena inflasi lebih tinggi dari tingkat imbal hasil investasi."
  },
  {
    id: 2,
    q: "Manakah yang merupakan definisi terbaik dari 'Dana Darurat'?",
    options: [
      { text: "Uang tunai atau aset likuid yang disisihkan khusus untuk kondisi tak terduga seperti medis atau PHK", correct: true },
      { text: "Dana sisa belanja yang digunakan untuk membeli tiket konser atau liburan mendadak", correct: false },
      { text: "Investasi berisiko tinggi seperti kripto atau saham gorengan untuk mempercepat keuntungan", correct: false }
    ],
    explanation: "Benar sekali! Dana darurat harus disimpan di instrumen yang aman dan likuid (mudah dicairkan) agar siap kapan saja saat ada situasi darurat."
  },
  {
    id: 3,
    q: "Apa keuntungan utama menerapkan strategi 'Dollar Cost Averaging' (DCA)?",
    options: [
      { text: "Menghindari jebakan menebak waktu pasar (market timing) dengan membeli secara konsisten dan terjadwal", correct: true },
      { text: "Menjamin 100% keuntungan pasti setiap hari tanpa ada fluktuasi harga", correct: false },
      { text: "Mendapatkan diskon biaya admin dari Manajer Investasi", correct: false }
    ],
    explanation: "Tepat sekali! DCA melatih kedisiplinan dan membantu Anda membeli lebih banyak unit saat harga turun serta lebih sedikit unit saat harga tinggi."
  },
  {
    id: 4,
    q: "Apa maksud dari prinsip diversifikasi 'Don't put all your eggs in one basket'?",
    options: [
      { text: "Menyebarkan modal investasi ke berbagai instrumen untuk mengurangi risiko kerugian total", correct: true },
      { text: "Membeli sebanyak mungkin jenis telur saat berbelanja bahan makanan", correct: false },
      { text: "Menyimpan seluruh aset keuangan Anda dalam satu rekening bank saja", correct: false }
    ],
    explanation: "Benar! Jika salah satu instrumen mengalami penurunan, portofolio Anda secara keseluruhan masih disokong oleh performa instrumen lainnya."
  }
];

const MODULES_DATA = [
  { id: 'budgeting', num: 1, title: 'Aturan 50/30/20', desc: 'Atur alokasi bulanan tanpa pusing', tag: 'Praktek Budgeting', icon: BookOpen },
  { id: 'debt', num: 2, title: 'Anti-FOMO & Pinjol', desc: 'Menghindari jerat pinjol ilegal', tag: 'Kelola Utang', icon: AlertTriangle },
  { id: 'compound', num: 3, title: 'Compound Interest', desc: 'Keajaiban bunga majemuk', tag: 'Efek Pengganda', icon: Sparkles },
  { id: 'investing', num: 4, title: 'Profil Risiko & Aset', desc: 'Mencocokkan instrumen yang tepat', tag: 'Mulai Langkahmu', icon: Trophy },
  { id: 'emergency', num: 5, title: 'Dana Darurat & Uji Stres', desc: 'Uji kesiapan finansialmu dari krisis', tag: 'Pondasi Utama', icon: ShieldCheck },
  { id: 'crypto', num: 6, title: 'Crypto & Web3', desc: 'Memahami Bitcoin & menjauhi scam', tag: 'Aset Digital', icon: Hexagon },
  { id: 'reksadana', num: 7, title: 'Reksa Dana & SBN', desc: 'Investasi aman pengusir inflasi', tag: 'Pendapatan Stabil', icon: TrendingUp },
  { id: 'saham', num: 8, title: 'Dasar Analisis Saham', desc: 'Bongkar laporan emiten riil', tag: 'Pasar Saham', icon: TrendingUp },
  { id: 'career', num: 9, title: 'Peta Jalan Karir Baru', desc: 'Asah skill penambah modal', tag: 'Karir & Income', icon: Wallet },
  { id: 'portfolio', num: 10, title: 'Rebalancing Portofolio', desc: 'Koreksi arah diversifikasi aset', tag: 'Klinik Portofolio', icon: RefreshCw },
];

const DIFFICULTY_LEVELS = [
  {
    id: 'pemula',
    title: 'Tingkat Pemula',
    subtitle: 'Dasar Finansial',
    description: 'Menguasai budgeting, mengelola utang, dan memahami bunga majemuk.',
    modules: ['budgeting', 'debt', 'compound'],
    certificateTitle: 'Pondasi Finansial Pemula'
  },
  {
    id: 'menengah',
    title: 'Tingkat Menengah',
    subtitle: 'Investasi Praktis',
    description: 'Menguasai profil risiko, dana darurat, dan reksa dana/SBN.',
    modules: ['investing', 'emergency', 'reksadana'],
    certificateTitle: 'Investasi Praktis Menengah'
  },
  {
    id: 'mahir',
    title: 'Tingkat Mahir',
    subtitle: 'Aset Kompleks & Portofolio',
    description: 'Menguasai crypto, analisis saham, karir, dan rebalancing.',
    modules: ['crypto', 'saham', 'career', 'portfolio'],
    certificateTitle: 'Manajemen Portofolio Mahir'
  }
];

const QUIZ_TOPICS_DATA = [
  {
    id: 'dasar',
    title: 'Dasar-Dasar Finansial & Budgeting',
    icon: Wallet,
    xpReward: 100,
    questions: [
      {
        q: "Berapa alokasi ideal untuk pos tabungan dan investasi menurut aturan budgeting 50/30/20?",
        options: ["10%", "20%", "30%", "50%"],
        correct: 1,
        explanation: "Aturan 50/30/20 menyarankan menyisihkan 20% pendapatan untuk tabungan, investasi, atau pelunasan utang demi pertumbuhan keuangan jangka panjang."
      },
      {
        q: "Apa yang dimaksud dengan fenomena 'Latte Factor'?",
        options: [
          "Kebiasaan membeli kopi mahal setiap pagi",
          "Pengeluaran kecil harian yang tidak disadari namun berdampak besar secara akumulatif jika dijumlahkan",
          "Inflasi harga susu di pasar global"
        ],
        correct: 1,
        explanation: "Latte Factor adalah pengeluaran kecil rutin (seperti kopi harian, biaya transfer antarbank, parkir) yang tanpa kita sadari menguras tabungan kita."
      },
      {
        q: "Mengapa uang tunai yang disimpan di dalam lemari/celengan nilainya tergerus seiring waktu?",
        options: [
          "Karena dimakan rayap",
          "Karena inflasi menurunkan daya beli uang tersebut",
          "Karena biaya admin bank"
        ],
        correct: 1,
        explanation: "Inflasi adalah kenaikan harga barang secara umum yang menyebabkan daya beli uang tunai terus berkurang dari tahun ke tahun jika tidak diinvestasikan."
      }
    ]
  },
  {
    id: 'saham_rd',
    title: 'Investasi Saham & Reksa Dana',
    icon: TrendingUp,
    xpReward: 100,
    questions: [
      {
        q: "Manakah definisi yang paling tepat untuk produk Reksa Dana?",
        options: [
          "Surat utang negara jangka panjang",
          "Wadah menghimpun dana masyarakat untuk diinvestasikan ke portofolio efek oleh Manajer Investasi berizin",
          "Aset kripto dengan jaminan emas fisik"
        ],
        correct: 1,
        explanation: "Reksa dana mengumpulkan dana dari pemodal publik dan dikelola oleh profesional (Manajer Investasi) untuk disebar ke berbagai portofolio saham, obligasi, atau pasar uang."
      },
      {
        q: "Apa sebutan untuk pembagian keuntungan bersih perusahaan kepada para pemegang sahamnya?",
        options: ["Capital Gain", "Dividen", "Reksadana", "Interest"],
        correct: 1,
        explanation: "Dividen adalah porsi laba bersih perusahaan yang secara resmi dibagikan kepada pemegang saham berdasarkan jumlah lembar kepemilikannya."
      },
      {
        q: "Jika Anda memiliki profil risiko moderat, jenis Reksa Dana apa yang paling direkomendasikan?",
        options: [
          "Reksa Dana Saham (RDS)",
          "Reksa Dana Pasar Uang (RDPU)",
          "Reksa Dana Pendapatan Tetap (RDPT) atau Obligasi Negara"
        ],
        correct: 2,
        explanation: "Reksa Dana Pendapatan Tetap (RDPT) menawarkan hasil di atas inflasi dengan risiko fluktuasi yang sedang/moderat, sangat cocok untuk profil risiko moderat."
      }
    ]
  },
  {
    id: 'debt_pinjol',
    title: 'Manajemen Utang & Bahaya Pinjol',
    icon: AlertTriangle,
    xpReward: 100,
    questions: [
      {
        q: "Berapakah batas rasio utang/cicilan bulanan maksimal yang dianggap aman dari total pemasukan Anda?",
        options: ["10%", "30% - 35%", "50%", "70%"],
        correct: 1,
        explanation: "Para perencana keuangan menyarankan total seluruh cicilan utang bulanan Anda tidak boleh melebihi 30% hingga 35% dari pemasukan bersih untuk menjaga kesehatan arus kas."
      },
      {
        q: "Manakah ciri-ciri utama Pinjaman Online (Pinjol) ilegal yang wajib kita hindari?",
        options: [
          "Bunga sangat rendah dan tenor cicilan panjang",
          "Meminta akses ke seluruh kontak, foto galeri HP, dan bunga harian mencekik yang tidak transparan",
          "Terdaftar dan diawasi secara resmi di Otoritas Jasa Keuangan (OJK)"
        ],
        correct: 1,
        explanation: "Pinjol ilegal biasanya tidak terdaftar di OJK, mengenakan bunga harian tidak terbatas, meneror seluruh kontak di HP peminjam saat penagihan, dan menyebarkan data pribadi."
      },
      {
        q: "Strategi melunasi utang dengan memprioritaskan saldo utang terkecil lebih dulu untuk membangun momentum psikologis disebut:",
        options: ["Debt Avalanche", "Debt Snowball", "Consolidation", "DCA"],
        correct: 1,
        explanation: "Metode Debt Snowball berfokus pada pelunasan dari saldo terkecil agar peminjam mendapat 'kemenangan psikologis cepat' yang memicu semangat melunasi utang selanjutnya."
      }
    ]
  },
  {
    id: 'crypto_scam',
    title: 'Aset Kripto & Keamanan Web3',
    icon: Hexagon,
    xpReward: 100,
    questions: [
      {
        q: "Teknologi dasar di balik Bitcoin yang menjamin transparansi dan keamanan transaksi terdesentralisasi adalah:",
        options: ["Cloud SQL", "Blockchain", "Artificial Intelligence", "Central Bank Digital Currency"],
        correct: 1,
        explanation: "Blockchain adalah buku besar terdistribusi dan terdesentralisasi yang mencatat seluruh riwayat transaksi secara aman, permanen, dan tidak bisa diubah sepihak."
      },
      {
        q: "Apa yang dimaksud dengan frasa 'Do Your Own Research' (DYOR) di dunia kripto?",
        options: [
          "Membeli koin yang paling banyak di-pom-pom oleh influencer di TikTok",
          "Melakukan analisis mandiri terhadap whitepaper, utilitas, dan profil pendiri proyek sebelum menempatkan dana",
          "Mengikuti saran sinyal trading VIP berbayar"
        ],
        correct: 1,
        explanation: "DYOR melatih kedisiplinan kritis untuk melakukan riset mendalam secara mandiri sebelum membeli koin apa pun, alih-alih ikut-ikutan spekulasi."
      },
      {
        q: "Apa nama skema penipuan di mana developer kripto tiba-tiba kabur membawa seluruh dana investor?",
        options: ["Phishing", "Rug Pull", "Airdrop", "Mining"],
        correct: 1,
        explanation: "Rug Pull adalah kejahatan di mana pencipta koin memompa harga token fiktif, lalu menarik seluruh likuiditas secara mendadak, menyisakan token bernilai nol untuk investor."
      }
    ]
  }
];

export function ClassroomPage() {
  const { user, loading, completeModule, addXp, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'kurikulum' | 'perpustakaan' | 'kuis' | 'ai-tutor'>('kurikulum');
  const [activeModuleId, setActiveModuleId] = useState<string>('budgeting');
  const [bookmarkedModules, setBookmarkedModules] = useState<string[]>([]);
  const [moduleSearch, setModuleSearch] = useState('');
  const [showOnlyBookmarks, setShowOnlyBookmarks] = useState(false);

  // Glossary states
  const [showGlossaryModal, setShowGlossaryModal] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');
  const [glossaryCategory, setGlossaryCategory] = useState('all');

  // Interactive Library states
  const [librarySearch, setLibrarySearch] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<LessonContent | null>(null);
  const [readLessons, setReadLessons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('read_lessons');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Quiz Arena states
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [completedQuizzes, setCompletedQuizzes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('completed_quizzes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // AI Tutor states
  const [aiInput, setAiInput] = useState('');
  const [chatLogs, setChatLogs] = useState<{ sender: 'user' | 'ai'; text: string }[]>([
    { 
      sender: 'ai', 
      text: 'Halo! Saya **Sikaya AI Tutor**, guru keuangan pintar Anda. 🎓✨\n\nSaya di sini untuk membantu Anda memahami segala hal tentang perencanaan uang, investasi, dana darurat, hingga menghindari pinjol ilegal.\n\nTanyakan apa saja, atau klik salah satu pilihan topik di bawah untuk memulai!' 
    }
  ]);
  const [aiLoading, setAiLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Handle direct navigation to a module or glossary via router state
  useEffect(() => {
    if (location.state) {
      if (location.state.activeModuleId) {
        setActiveTab('kurikulum');
        setActiveModuleId(location.state.activeModuleId);
      }
      if (location.state.showGlossary) {
        setShowGlossaryModal(true);
      }
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Auto scroll to bottom in chat log
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLogs, aiLoading]);

  // Memoized glossary filtering and sorting for optimal render performance
  const sortedGlossaryItems = useMemo(() => {
    const filtered = GLOSSARY_ITEMS.filter((item) => {
      const matchSearch = item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                          item.simpleExplanation.toLowerCase().includes(glossarySearch.toLowerCase()) ||
                          item.advancedExplanation.toLowerCase().includes(glossarySearch.toLowerCase());
      const matchCat = glossaryCategory === 'all' || item.category === glossaryCategory;
      return matchSearch && matchCat;
    });
    return [...filtered].sort((a, b) => a.term.localeCompare(b.term));
  }, [glossarySearch, glossaryCategory]);

  // Memoized module searching and filtering based on search input and bookmarks
  const filteredModules = useMemo(() => {
    return MODULES_DATA.filter((mod) => {
      const matchesSearch = mod.title.toLowerCase().includes(moduleSearch.toLowerCase()) || 
                            mod.desc.toLowerCase().includes(moduleSearch.toLowerCase()) || 
                            mod.tag.toLowerCase().includes(moduleSearch.toLowerCase());
      const matchesBookmark = !showOnlyBookmarks || bookmarkedModules.includes(mod.id);
      return matchesSearch && matchesBookmark;
    });
  }, [moduleSearch, showOnlyBookmarks, bookmarkedModules]);

  // Redirection to Login if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  // Handle Confetti on All Completed
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [showLevelCertModal, setShowLevelCertModal] = useState<string | null>(null);
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [customCertName, setCustomCertName] = useState('');
  
  const [isFocusMode, setIsFocusMode] = useState(false);

  // Audio TTS Reader state
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);

  // Pomodoro Focus Study Timer state
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(25 * 60);
  const [isPomodoroActive, setIsPomodoroActive] = useState(false);

  useEffect(() => {
    let timerInterval: any = null;
    if (isPomodoroActive && pomodoroSeconds > 0) {
      timerInterval = setInterval(() => {
        setPomodoroSeconds((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroSeconds === 0 && isPomodoroActive) {
      setIsPomodoroActive(false);
      addXp(30);
      toast.success('🎉 Sesi Belajar Fokus 25 Menit Selesai! Anda mendapatkan +30 XP!');
      confetti({ particleCount: 30, spread: 70 });
    }
    return () => clearInterval(timerInterval);
  }, [isPomodoroActive, pomodoroSeconds]);

  const formatTimer = (totalSecs: number) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Audio TTS Handler
  const handleToggleAudioSummary = (textToRead: string) => {
    if (!('speechSynthesis' in window)) {
      toast.error('Browser Anda tidak mendukung fitur pemutaran audio teks.');
      return;
    }

    if (isSpeakingAudio) {
      window.speechSynthesis.cancel();
      setIsSpeakingAudio(false);
      toast.info('Audio dihentikan.');
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'id-ID';
      utterance.rate = 0.95;
      utterance.onend = () => setIsSpeakingAudio(false);
      utterance.onerror = () => setIsSpeakingAudio(false);

      window.speechSynthesis.speak(utterance);
      setIsSpeakingAudio(true);
      toast.success('🔊 Memutar ringkasan edukasi keuangan...');
    }
  };

  // Daily Claim Bonus XP
  const [lastClaimDate, setLastClaimDate] = useState<string>(() => {
    return localStorage.getItem('last_daily_claim_date') || '';
  });

  const todayStr = new Date().toISOString().slice(0, 10);
  const canClaimDailyBonus = lastClaimDate !== todayStr;

  const handleClaimDailyBonus = () => {
    if (!canClaimDailyBonus) {
      toast.info('Anda sudah mengklaim bonus harian hari ini. Kembali lagi besok!');
      return;
    }
    addXp(25);
    setLastClaimDate(todayStr);
    localStorage.setItem('last_daily_claim_date', todayStr);
    toast.success('🔥 Bonus Harian Diklaim! +25 XP ditambahkan ke profil Anda!');
    confetti({ particleCount: 25, spread: 60 });
  };

  // Flashcards Mastered & Shuffle state
  const [masteredCards, setMasteredCards] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mastered_flashcards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [flashcardFilter, setFlashcardFilter] = useState<'all' | 'unmastered'>('all');

  const toggleMasteredFlashcard = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: number[];
    if (masteredCards.includes(idx)) {
      updated = masteredCards.filter((i) => i !== idx);
      toast.info('Status dikuasai dibatalkan.');
    } else {
      updated = [...masteredCards, idx];
      toast.success('👏 Bagus! Istilah ditandai telah dikuasai!');
    }
    setMasteredCards(updated);
    localStorage.setItem('mastered_flashcards', JSON.stringify(updated));
  };

  // Article Bookmarks & Categories
  const [articleCategory, setArticleCategory] = useState<string>('all');
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bookmarked_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmarkArticle = (articleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated: string[];
    if (bookmarkedArticles.includes(articleId)) {
      updated = bookmarkedArticles.filter((id) => id !== articleId);
      toast.info('Artikel dihapus dari bookmark.');
    } else {
      updated = [...bookmarkedArticles, articleId];
      toast.success('⭐ Artikel disimpan ke bookmark!');
    }
    setBookmarkedArticles(updated);
    localStorage.setItem('bookmarked_articles', JSON.stringify(updated));
  };

  // Glossary Favorites
  const [favoriteGlossaryTerms, setFavoriteGlossaryTerms] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('favorite_glossary');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavoriteGlossary = (term: string) => {
    let updated: string[];
    if (favoriteGlossaryTerms.includes(term)) {
      updated = favoriteGlossaryTerms.filter((t) => t !== term);
    } else {
      updated = [...favoriteGlossaryTerms, term];
      toast.success(`⭐ "${term}" ditambahkan ke Istilah Favorit!`);
    }
    setFavoriteGlossaryTerms(updated);
    localStorage.setItem('favorite_glossary', JSON.stringify(updated));
  };

  const [dailyQuizAnswered, setDailyQuizAnswered] = useState<boolean | null>(null);
  const [dailyQuizFeedback, setDailyQuizFeedback] = useState<string>('');
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [answeredQuizIds, setAnsweredQuizIds] = useState<number[]>([]);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);

  const toggleBookmark = (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (bookmarkedModules.includes(moduleId)) {
      setBookmarkedModules(bookmarkedModules.filter(id => id !== moduleId));
      toast.success('Bookmark dihapus');
    } else {
      setBookmarkedModules([...bookmarkedModules, moduleId]);
      toast.success('Materi ditambahkan ke bookmark');
    }
  };

  useEffect(() => {
    if (user && !customCertName) {
      setCustomCertName(user.fullName);
    }
  }, [user, customCertName]);

  const totalModules = 10;
  const completedCount = user ? user.completedModules.length : 0;
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  useEffect(() => {
    if (completedCount === totalModules && !hasCelebrated) {
      triggerConfetti();
      setHasCelebrated(true);
    }
  }, [completedCount, hasCelebrated]);

  const triggerConfetti = () => {
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0d9488', '#2563eb', '#d97706', '#a855f7']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0d9488', '#2563eb', '#d97706', '#a855f7']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (!user) return null;

  const handleCompleteModuleAction = (moduleId: string) => {
    completeModule(moduleId, 100);
    // Switch to next module automatically to keep user flow seamless
    if (moduleId === 'budgeting') setActiveModuleId('debt');
    else if (moduleId === 'debt') setActiveModuleId('compound');
    else if (moduleId === 'compound') setActiveModuleId('investing');
    else if (moduleId === 'investing') setActiveModuleId('emergency');
    else if (moduleId === 'emergency') setActiveModuleId('crypto');
    else if (moduleId === 'crypto') setActiveModuleId('reksadana');
    else if (moduleId === 'reksadana') setActiveModuleId('saham');
    else if (moduleId === 'saham') setActiveModuleId('career');
    else if (moduleId === 'career') setActiveModuleId('portfolio');
    else if (moduleId === 'portfolio') {
      if (completedCount + 1 >= totalModules) {
        setShowCertificateModal(true);
      }
    }
  };

  // Lesson Reading complete handoff
  const handleMarkLessonAsRead = (lessonId: string) => {
    if (readLessons.includes(lessonId)) {
      toast.info("Anda sudah menyelesaikan artikel ini sebelumnya!");
      return;
    }
    const updated = [...readLessons, lessonId];
    setReadLessons(updated);
    localStorage.setItem('read_lessons', JSON.stringify(updated));
    addXp(25);
    toast.success("Hebat! Anda mendapatkan +25 XP karena rajin membaca.");
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0d9488', '#2563eb']
    });
  };

  // Start specific quiz topic
  const handleStartQuizTopic = (topicId: string) => {
    setActiveQuizId(topicId);
    setQuizQuestionIndex(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  // Submit and calculate Quiz Arena results
  const handleSelectQuizAnswer = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const handleNextQuizQuestion = (questionsLength: number) => {
    if (quizQuestionIndex < questionsLength - 1) {
      setQuizQuestionIndex(prev => prev + 1);
    } else {
      // Complete & Grade Quiz
      const currentTopic = QUIZ_TOPICS_DATA.find(t => t.id === activeQuizId);
      if (!currentTopic) return;

      let score = 0;
      currentTopic.questions.forEach((q, idx) => {
        if (quizAnswers[idx] === q.correct) {
          score++;
        }
      });

      setQuizScore(score);
      setQuizSubmitted(true);

      // Reward XP based on score
      let reward = 0;
      if (score === 3) reward = 100;
      else if (score === 2) reward = 60;
      else if (score === 1) reward = 30;

      if (!completedQuizzes.includes(currentTopic.id)) {
        const updatedQuizzes = [...completedQuizzes, currentTopic.id];
        setCompletedQuizzes(updatedQuizzes);
        localStorage.setItem('completed_quizzes', JSON.stringify(updatedQuizzes));
        if (reward > 0) {
          addXp(reward);
          toast.success(`Selamat! Anda menyelesaikan kuis dan mendapatkan +${reward} XP!`);
        }
      } else {
        toast.info(`Anda menyelesaikan kuis! Skor Anda: ${score}/3.`);
      }

      if (score === 3) {
        confetti({
          particleCount: 30,
          spread: 80,
          origin: { y: 0.8 },
          colors: ['#fbbf24', '#f59e0b', '#10b981']
        });
      }
    }
  };

  // Send message to AI Finance Tutor
  const handleSendAiMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setAiInput('');
    setChatLogs(prev => [...prev, { sender: 'user', text: trimmed }]);
    setAiLoading(true);

    try {
      let activeToken: string | null = null;
      if (auth.currentUser) {
        try {
          activeToken = await auth.currentUser.getIdToken();
        } catch {
          // Token error
        }
      }

      if (!activeToken) {
        setChatLogs(prev => [
          ...prev,
          {
            sender: 'ai',
            text: '🔒 **Autentikasi Diperlukan:** Untuk keamanan dan perlindungan data, Anda perlu login menggunakan akun Google untuk berdiskusi dengan AI Tutor SiKaya. Silakan masuk melalui halaman login.'
          }
        ]);
        return;
      }

      const apiRes = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeToken}`
        },
        body: JSON.stringify({ 
          profile: {
            income: user.xp,
            savings: 1000000,
            expenses: 0,
            goals: "Edukasi Keuangan",
            riskTolerance: user.literacyLevel
          }, 
          question: `[Anda adalah Tutor Keuangan Kepercayaan Akademi SiKaya. Berikan penjelasan edukatif finansial yang mudah dimengerti, interaktif, ramah, jujur, serta gunakan istilah yang relevan untuk Gen Z dalam bahasa Indonesia. Jangan pakai kata-kata kaku. Selalu beri tips nyata & hindari saran menyesatkan] Pertanyaan Siswa: ${trimmed}`, 
          mood: 'Bijak & Humor' 
        })
      });

      if (!apiRes.ok) {
        const errJson = await apiRes.json().catch(() => null);
        throw new Error(errJson?.error?.message || "Gagal terhubung dengan server tutor.");
      }
      const data = await apiRes.json();
      
      setChatLogs(prev => [...prev, { sender: 'ai', text: data.reply || "Maaf, silakan coba ajukan pertanyaan kembali." }]);
    } catch (e: any) {
      setChatLogs(prev => [...prev, { sender: 'ai', text: `⚠️ ${e.message || 'Terjadi kendala saat menghubungi AI tutor. Silakan coba lagi.'}` }]);
    } finally {
      setAiLoading(false);
    }
  };

  // Dynamic filter for educational articles
  const filteredLibraryLessons = useMemo(() => {
    return Object.values(featureLessons).filter(lesson => {
      const matchSearch = lesson.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        lesson.subtitle.toLowerCase().includes(librarySearch.toLowerCase()) ||
        lesson.introduction.toLowerCase().includes(librarySearch.toLowerCase());

      let matchCat = true;
      if (articleCategory === 'bookmarks') {
        matchCat = bookmarkedArticles.includes(lesson.id);
      } else if (articleCategory === 'budgeting') {
        matchCat = lesson.id.includes('budget') || lesson.title.toLowerCase().includes('budget') || lesson.title.toLowerCase().includes('uang');
      } else if (articleCategory === 'investing') {
        matchCat = lesson.id.includes('saham') || lesson.id.includes('invest') || lesson.title.toLowerCase().includes('reksa');
      } else if (articleCategory === 'crypto') {
        matchCat = lesson.id.includes('crypto') || lesson.title.toLowerCase().includes('kripto') || lesson.title.toLowerCase().includes('web3');
      } else if (articleCategory === 'debt') {
        matchCat = lesson.id.includes('pinjol') || lesson.title.toLowerCase().includes('utang');
      }

      return matchSearch && matchCat;
    });
  }, [librarySearch, articleCategory, bookmarkedArticles]);

  // Pure High-Resolution Canvas drawing of the Level Certificate
  const downloadLevelCertificate = (levelTitle: string, levelSubtitle: string, recipientName: string, xpPoints: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 840;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background
    const grad = ctx.createRadialGradient(600, 420, 100, 600, 420, 700);
    grad.addColorStop(0, '#fbfbf9');
    grad.addColorStop(1, '#f1f5f2');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1200, 840);

    // Outer border
    ctx.strokeStyle = '#0d9488'; // Teal
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1140, 780);

    // Inner gold border
    ctx.strokeStyle = '#d97706'; // Gold/Amber
    ctx.lineWidth = 3;
    ctx.strokeRect(45, 45, 1110, 750);

    // Corner decorations
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(45, 45, 30, 30);
    ctx.fillRect(1125, 45, 30, 30);
    ctx.fillRect(45, 765, 30, 30);
    ctx.fillRect(1125, 765, 30, 30);

    // Brand Header
    ctx.textAlign = 'center';
    ctx.fillStyle = '#475569';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('AKADEMI LITERASI KEUANGAN SIKAYA', 600, 110);

    // Gold Medal/Badge Seal
    ctx.beginPath();
    ctx.arc(600, 185, 40, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Seal ribbon left
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.moveTo(580, 215);
    ctx.lineTo(570, 265);
    ctx.lineTo(595, 255);
    ctx.lineTo(595, 220);
    ctx.closePath();
    ctx.fill();

    // Seal ribbon right
    ctx.beginPath();
    ctx.moveTo(620, 215);
    ctx.lineTo(630, 265);
    ctx.lineTo(605, 255);
    ctx.lineTo(605, 220);
    ctx.closePath();
    ctx.fill();

    // Star in the middle of badge
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('★', 600, 193);

    // Certificate Type Main
    ctx.fillStyle = '#1e293b';
    ctx.font = '900 36px sans-serif';
    ctx.fillText('SERTIFIKAT PENCAPAIAN', 600, 315);

    ctx.fillStyle = '#0d9488';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText(`${levelTitle.toUpperCase()} - ${levelSubtitle.toUpperCase()}`, 600, 355);

    // Text: Given to
    ctx.fillStyle = '#64748b';
    ctx.font = 'italic 16px sans-serif';
    ctx.fillText('Diberikan secara terhormat kepada:', 600, 425);

    // Custom name
    ctx.fillStyle = '#0f172a';
    ctx.font = 'italic bold 34px "Georgia", serif';
    ctx.fillText(recipientName.toUpperCase(), 600, 485);

    // Decorative underline line
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(350, 505);
    ctx.lineTo(850, 505);
    ctx.stroke();

    // Description text paragraphs
    ctx.fillStyle = '#334155';
    ctx.font = '500 15px sans-serif';
    ctx.fillText(`Atas kelulusan gemilang menyelesaikan seluruh modul pembelajaran tingkat ${levelTitle}`, 600, 550);
    ctx.fillText(`serta menguasai latihan simulasi finansial dengan perolehan total ${xpPoints} XP di SiKaya.`, 600, 575);

    // Verification details
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 11px monospace';
    const uniqueHash = 'SIKAYA-CERT-' + levelTitle.toUpperCase().slice(0, 3) + '-' + Math.random().toString(36).substr(2, 8).toUpperCase();
    ctx.fillText(`ID VERIFIKASI: ${uniqueHash} • TERVERIFIKASI AMAN, BEBAS PINJOL & PROMOSI PALSU`, 600, 630);

    // Signature Left
    ctx.textAlign = 'left';
    ctx.fillStyle = '#334155';
    ctx.font = 'bold italic 15px "Georgia", serif';
    ctx.fillText('Robo SiKaya Academic', 200, 715);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px sans-serif';
    ctx.fillText('Platform Kurikulum Finansial AI', 200, 735);

    // Signature line left
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 720);
    ctx.lineTo(380, 720);
    ctx.stroke();

    // Signature Right
    ctx.textAlign = 'right';
    ctx.fillStyle = '#334155';
    const dateString = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(dateString, 1000, 715);
    ctx.fillStyle = '#64748b';
    ctx.font = '600 11px sans-serif';
    ctx.fillText('Tanggal Kelulusan Resmi', 1000, 735);

    // Signature line right
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(820, 720);
    ctx.lineTo(1000, 720);
    ctx.stroke();

    // Trigger download
    const link = document.createElement('a');
    link.download = `Sertifikat_SiKaya_${levelTitle.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner Dashboard */}
      {!isFocusMode && (
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-teal-950 rounded-3xl p-5 sm:p-7 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-teal-500/10 border border-teal-500/30 rounded-2xl flex items-center justify-center text-3xl shadow-inner relative group shrink-0">
              <span className="relative z-10">{user.avatar}</span>
              <div className="absolute inset-0 bg-teal-500/5 rounded-2xl animate-pulse"></div>
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[9px] font-black tracking-widest text-teal-300 uppercase bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800">
                  AKADEMI SIKAYA
                </span>
                <span className="text-[9px] font-extrabold text-indigo-300 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-900">
                  Level: {user.literacyLevel}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">Halo, {user.fullName}!</h2>
              <p className="text-slate-400 text-xs font-semibold">
                Skor finansialmu: <span className="text-teal-400 font-bold">{user.xp} XP</span> • Tetap konsisten belajar setiap hari!
              </p>
            </div>
          </div>

          {/* Progress Tracker Widget & Quick Action Buttons */}
          <div className="relative z-10 flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-3 w-full md:w-auto">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 p-3.5 rounded-2xl w-full sm:w-72 shadow-lg space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-300">Progres Belajar</span>
                <span className="font-black text-teal-400 bg-teal-950/60 px-2 py-0.5 rounded-md border border-teal-900/50">
                  {completedCount} / {totalModules} Modul ({progressPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/30">
                <div 
                  className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(20,184,166,0.3)]" 
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full justify-end">
              {/* Daily Streak & Bonus Claim Button */}
              <button
                onClick={handleClaimDailyBonus}
                disabled={!canClaimDailyBonus}
                className={`py-2 px-3 text-xs font-black rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  canClaimDailyBonus
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 animate-pulse shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 border-slate-700 opacity-80'
                }`}
                title={canClaimDailyBonus ? 'Klik untuk klaim +25 XP bonus harian' : 'Bonus harian sudah diklaim hari ini'}
              >
                <Flame className={`w-3.5 h-3.5 ${canClaimDailyBonus ? 'text-slate-950 fill-amber-950' : 'text-slate-500'}`} />
                {canClaimDailyBonus ? 'Klaim Bonus (+25 XP)' : 'Streak Aktif 🔥'}
              </button>

              {/* Pomodoro Timer Toggle */}
              <button
                onClick={() => setShowPomodoro(!showPomodoro)}
                className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  showPomodoro
                    ? 'bg-indigo-600 text-white border-indigo-500'
                    : 'bg-slate-800/80 hover:bg-slate-750 text-indigo-300 border-indigo-500/30'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Fokus 25m</span>
              </button>

              <button
                onClick={() => setShowGlossaryModal(true)}
                className="py-2 px-3 bg-slate-800/80 hover:bg-slate-750 text-teal-300 text-xs font-bold rounded-xl border border-teal-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-400" /> Glosarium
              </button>
              
              <button
                onClick={() => setShowCertificateModal(true)}
                className="py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-md shadow-amber-500/10"
              >
                <Award className="w-3.5 h-3.5" /> Sertifikat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pomodoro Focus Study Companion Widget Bar */}
      {!isFocusMode && showPomodoro && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-indigo-950/90 border border-indigo-800 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-900/80 rounded-xl border border-indigo-700 text-indigo-300">
              <Clock className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black tracking-widest uppercase bg-indigo-900 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700">
                  SESI BELAJAR FOKUS (POMODORO)
                </span>
                <span className="text-[10px] font-bold text-amber-300">+30 XP saat selesai</span>
              </div>
              <p className="text-xs text-indigo-200 font-semibold mt-0.5">
                Fokus membaca modul tanpa distraksi selama 25 menit.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-2xl font-black text-amber-400 bg-indigo-900/80 px-4 py-1.5 rounded-xl border border-indigo-700">
              {formatTimer(pomodoroSeconds)}
            </span>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPomodoroActive(!isPomodoroActive)}
                className="px-3.5 py-2 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 cursor-pointer border-none"
              >
                {isPomodoroActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                {isPomodoroActive ? 'Jeda' : 'Mulai'}
              </button>

              <button
                onClick={() => {
                  setIsPomodoroActive(false);
                  setPomodoroSeconds(25 * 60);
                }}
                className="p-2 bg-indigo-900 hover:bg-indigo-850 text-indigo-300 rounded-xl transition-all cursor-pointer border-none"
                title="Reset Timer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Interactive Main Navigation Tabs */}
      {!isFocusMode && (
        <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 p-1.5 rounded-2xl overflow-x-auto scrollbar-none gap-1.5">
          <button
            onClick={() => setActiveTab('kurikulum')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex-1 justify-center cursor-pointer border-none ${
              activeTab === 'kurikulum'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <GraduationCap className="w-4 h-4 text-teal-500" />
            <span>Peta Jalan Modul</span>
          </button>

          <button
            onClick={() => setActiveTab('kuis')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex-1 justify-center cursor-pointer border-none ${
              activeTab === 'kuis'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-indigo-500" />
            <span>Kuis & Kartu Memori</span>
          </button>

          <button
            onClick={() => setActiveTab('perpustakaan')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex-1 justify-center cursor-pointer border-none ${
              activeTab === 'perpustakaan'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Perpustakaan Artikel</span>
          </button>

          <button
            onClick={() => setActiveTab('ai-tutor')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all flex-1 justify-center cursor-pointer border-none ${
              activeTab === 'ai-tutor'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm border border-slate-200/40 dark:border-slate-800'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
            <span>Tanya AI Sikaya Tutor</span>
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* ==================== TAB 1: KURIKULUM AKADEMIK ==================== */}
        {activeTab === 'kurikulum' && (
          <motion.div
            key="kurikulum-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Level Stepper Progression Filter */}
            {!isFocusMode && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <div>
                    <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 tracking-wider uppercase flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-teal-500" /> TINGKAT KELAS FINANSIAL
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                      Pilih tingkat kelas untuk memfokuskan pembelajaran Anda langkah demi langkah.
                    </p>
                  </div>

                  {/* Level Sertifikat Quick Claim */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                    {DIFFICULTY_LEVELS.map((lvl) => {
                      const completedLvlCount = lvl.modules.filter(mId => user.completedModules.includes(mId)).length;
                      const isLvlDone = completedLvlCount === lvl.modules.length;
                      return isLvlDone ? (
                        <button
                          key={lvl.id}
                          onClick={() => {
                            setShowLevelCertModal(lvl.id);
                            triggerConfetti();
                          }}
                          className="px-2.5 py-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[10px] font-black rounded-lg hover:bg-amber-100 transition-all cursor-pointer shrink-0 flex items-center gap-1"
                        >
                          <Gift className="w-3 h-3 text-amber-500" /> Sertifikat {lvl.title.replace('Tingkat ', '')}
                        </button>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {DIFFICULTY_LEVELS.map((lvl) => {
                    const completedLvlCount = lvl.modules.filter(mId => user.completedModules.includes(mId)).length;
                    const isLvlDone = completedLvlCount === lvl.modules.length;
                    const pct = Math.round((completedLvlCount / lvl.modules.length) * 100);

                    return (
                      <div
                        key={lvl.id}
                        className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                          isLvlDone
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/60'
                            : 'bg-slate-50/70 dark:bg-slate-850/50 border-slate-200 dark:border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <span className="text-[8px] font-black uppercase tracking-wider text-slate-400">{lvl.subtitle}</span>
                            <h4 className="text-xs font-black text-slate-850 dark:text-slate-100">{lvl.title}</h4>
                          </div>
                          {isLvlDone ? (
                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full flex items-center gap-0.5">
                              ✓ SELESAI
                            </span>
                          ) : (
                            <span className="text-[9px] font-black text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700">
                              {completedLvlCount}/{lvl.modules.length}
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold line-clamp-2 leading-snug">
                          {lvl.description}
                        </p>

                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
                          <div 
                            className={`h-full rounded-full transition-all duration-300 ${isLvlDone ? 'bg-emerald-500' : 'bg-teal-500'}`} 
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Split Workspace Layout */}
            <div className="grid lg:grid-cols-12 gap-6 items-start">
              {/* Navigation Sidebar */}
              {!isFocusMode && (
                <div className="lg:col-span-4 space-y-4">
                  <div className="ui-card p-0 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Daftar Modul Belajar</h3>
                        <span className="text-xs font-medium text-slate-500 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-md">{filteredModules.length} Modul</span>
                      </div>
  
                      {/* Real-time Module Search Input */}
                      <div className="relative mb-3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Cari modul..."
                          value={moduleSearch}
                          onChange={(e) => setModuleSearch(e.target.value)}
                          className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 transition-all"
                        />
                        {moduleSearch && (
                          <button 
                            onClick={() => setModuleSearch('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none"
                          >
                            Tutup
                          </button>
                        )}
                      </div>
  
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowOnlyBookmarks(false)}
                          className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer border-solid ${
                            !showOnlyBookmarks 
                              ? 'bg-slate-900 text-white border-transparent shadow-sm dark:bg-slate-800' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          Semua
                        </button>
                        <button
                          onClick={() => setShowOnlyBookmarks(true)}
                          className={`flex-1 text-center py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer border-solid flex items-center justify-center gap-1.5 ${
                            showOnlyBookmarks 
                              ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-sm dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' 
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <Bookmark className="w-3.5 h-3.5" /> Tersimpan
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[480px] overflow-y-auto scrollbar-thin divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredModules.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 space-y-2">
                          <HelpCircle className="w-8 h-8 mx-auto text-slate-300" />
                          <p className="text-sm font-semibold">Modul tidak ditemukan</p>
                          <p className="text-xs max-w-[200px] mx-auto text-slate-400">Coba kata kunci lain atau nonaktifkan filter bookmark.</p>
                        </div>
                      ) : (
                        filteredModules.map((mod) => {
                          const IconComponent = mod.icon;
                          const isCompleted = user.completedModules.includes(mod.id);
                          const isActive = activeModuleId === mod.id;
                          return (
                            <button
                              key={mod.id}
                              onClick={() => setActiveModuleId(mod.id)}
                              className={`w-full p-4 text-left transition-all flex items-start gap-3 relative cursor-pointer border-none bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 ${
                                isActive
                                  ? 'bg-teal-50/50 dark:bg-teal-900/20'
                                  : ''
                              }`}
                            >
                              {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />}
                              <div className={`p-2 rounded-xl shrink-0 ${isCompleted ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <IconComponent className="w-4 h-4" />}
                              </div>
                              <div className="flex-1 min-w-0 pt-0.5">
                                <p className="text-xs font-medium text-slate-500 mb-0.5">Modul {mod.num} • {mod.tag}</p>
                                <h4 className={`text-sm font-semibold truncate ${isActive ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-slate-100'}`}>{mod.title}</h4>
                                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{mod.desc}</p>
                              </div>
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div className="pt-1 text-center">
                    <button
                      onClick={() => navigate('/')}
                      className="text-[11px] font-bold text-slate-500 hover:text-teal-600 transition-colors inline-flex items-center gap-1 cursor-pointer bg-transparent border-none"
                    >
                      ← Kembali ke Beranda Utama
                    </button>
                  </div>
                </div>
              )}

              {/* Workspace Area */}
              <div className={`${isFocusMode ? 'col-span-full' : 'lg:col-span-8'} ui-card p-6 sm:p-8 transition-all`}>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/30 px-3 py-1 rounded-md">
                      Modul Pembelajaran
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-3">
                      {activeModuleId === 'budgeting' && 'Aturan 50/30/20'}
                      {activeModuleId === 'debt' && 'Kelola Utang & Anti-Pinjol'}
                      {activeModuleId === 'compound' && 'Keajaiban Bunga Majemuk'}
                      {activeModuleId === 'investing' && 'Profil Risiko & Alokasi Aset'}
                      {activeModuleId === 'emergency' && 'Dana Darurat & Uji Stres'}
                      {activeModuleId === 'crypto' && 'Kripto & Web3 Aman'}
                      {activeModuleId === 'reksadana' && 'Reksa Dana & SBN'}
                      {activeModuleId === 'saham' && 'Analisis Pasar Saham'}
                      {activeModuleId === 'career' && 'Peta Jalan Karir & Income'}
                      {activeModuleId === 'portfolio' && 'Rebalancing Portofolio'}
                    </h2>
                  </div>
  
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Audio TTS Ringkasan Modul */}
                    <button
                      onClick={() => {
                        const currentMod = MODULES_DATA.find(m => m.id === activeModuleId);
                        const text = currentMod ? `${currentMod.title}. ${currentMod.desc}. Kategori: ${currentMod.tag}.` : 'Modul Pembelajaran Keuangan SiKaya.';
                        handleToggleAudioSummary(text);
                      }}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border border-slate-200 dark:border-slate-800 ${
                        isSpeakingAudio 
                          ? 'bg-teal-600 text-white border-teal-600 animate-pulse' 
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                      }`}
                      title="Dengarkan Ringkasan Modul lewat Audio Suara"
                    >
                      {isSpeakingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      <span className="hidden sm:inline">{isSpeakingAudio ? 'Hentikan Audio' : 'Dengarkan Topik'}</span>
                    </button>
  
                    <button
                      onClick={(e) => toggleBookmark(activeModuleId, e)}
                      className={`p-2.5 rounded-xl transition-all border cursor-pointer ${bookmarkedModules.includes(activeModuleId) ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800 hover:bg-slate-50'}`}
                      title={bookmarkedModules.includes(activeModuleId) ? 'Hapus Bookmark' : 'Bookmark Materi'}
                    >
                      <Bookmark className="w-5 h-5" fill={bookmarkedModules.includes(activeModuleId) ? 'currentColor' : 'none'} />
                    </button>
  
                    <button
                      onClick={() => setIsFocusMode(!isFocusMode)}
                      className="p-2.5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
                      title={isFocusMode ? 'Keluar Mode Belajar' : 'Mode Belajar (Fokus)'}
                    >
                      {isFocusMode ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModuleId}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {activeModuleId === 'budgeting' && (
                      <BudgetingModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('budgeting')} 
                      />
                    )}

                    {activeModuleId === 'debt' && (
                      <DebtModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('debt')} 
                      />
                    )}

                    {activeModuleId === 'compound' && (
                      <CompoundModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('compound')} 
                      />
                    )}

                    {activeModuleId === 'investing' && (
                      <InvestingModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('investing')} 
                      />
                    )}

                    {activeModuleId === 'emergency' && (
                      <EmergencyModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('emergency')} 
                      />
                    )}

                    {activeModuleId === 'crypto' && (
                      <CryptoModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('crypto')} 
                      />
                    )}

                    {activeModuleId === 'reksadana' && (
                      <ReksadanaModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('reksadana')} 
                      />
                    )}

                    {activeModuleId === 'saham' && (
                      <SahamModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('saham')} 
                      />
                    )}

                    {activeModuleId === 'career' && (
                      <CareerModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('career')} 
                      />
                    )}

                    {activeModuleId === 'portfolio' && (
                      <PortfolioModule 
                        user={user} 
                        onComplete={handleCompleteModuleAction} 
                        completed={user.completedModules.includes('portfolio')} 
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}

        {/* ==================== TAB 2: ARENA KUIS & KARTU MEMORI ==================== */}
        {activeTab === 'kuis' && (
          <motion.div
            key="kuis-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top Interactive Widgets: Daily Quiz & Flashcard Memory */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Daily Quiz Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-teal-650 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded-md border border-teal-100 dark:border-slate-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse"></span>
                      🎯 Kuis Literasi Harian ({currentQuizIdx + 1}/{DAILY_QUIZ_QUESTIONS.length})
                    </span>
                    <span className="text-[10px] font-extrabold text-amber-500 flex items-center gap-1 font-mono bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded border border-amber-100/30">
                      💎 +50 XP
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-extrabold text-slate-850 dark:text-slate-100 leading-snug">
                    {DAILY_QUIZ_QUESTIONS[currentQuizIdx].q}
                  </p>
                  
                  {dailyQuizAnswered === null ? (
                    <div className="grid gap-2 mt-4">
                      {DAILY_QUIZ_QUESTIONS[currentQuizIdx].options.map((opt, oIdx) => (
                        <button
                          key={oIdx}
                          onClick={() => {
                            if (opt.correct) {
                              setDailyQuizAnswered(true);
                              setDailyQuizFeedback(DAILY_QUIZ_QUESTIONS[currentQuizIdx].explanation);
                              if (!answeredQuizIds.includes(DAILY_QUIZ_QUESTIONS[currentQuizIdx].id)) {
                                setAnsweredQuizIds([...answeredQuizIds, DAILY_QUIZ_QUESTIONS[currentQuizIdx].id]);
                                addXp(50);
                                toast.success("Jawaban Benar! +50 XP berhasil ditambahkan.");
                              } else {
                                toast.success("Jawaban Benar!");
                              }
                            } else {
                              setDailyQuizAnswered(false);
                              setDailyQuizFeedback("Kurang tepat. " + DAILY_QUIZ_QUESTIONS[currentQuizIdx].explanation);
                              toast.error("Jawaban kurang tepat. Pelajari penjelasannya!");
                            }
                          }}
                          className="w-full text-left p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-750 border border-slate-200 dark:border-slate-750 text-xs font-bold rounded-xl transition-all cursor-pointer text-slate-800 dark:text-slate-200"
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-750 space-y-3">
                      <div className="flex items-center gap-1.5">
                        {dailyQuizAnswered ? (
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded uppercase">✓ BENAR</span>
                        ) : (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded uppercase">✗ BELUM TEPAT</span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed italic">
                        {dailyQuizFeedback}
                      </p>
                      
                      <div className="flex items-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setDailyQuizAnswered(null);
                            setDailyQuizFeedback('');
                          }}
                          className="text-[10px] font-black text-teal-650 hover:underline uppercase cursor-pointer bg-transparent border-none"
                        >
                          Coba Ulang
                        </button>
                        {currentQuizIdx < DAILY_QUIZ_QUESTIONS.length - 1 ? (
                          <button
                            onClick={() => {
                              setCurrentQuizIdx(prev => prev + 1);
                              setDailyQuizAnswered(null);
                              setDailyQuizFeedback('');
                            }}
                            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase cursor-pointer flex items-center gap-0.5 ml-auto bg-transparent border-none"
                          >
                            Kuis Selanjutnya →
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setCurrentQuizIdx(0);
                              setDailyQuizAnswered(null);
                              setDailyQuizFeedback('');
                            }}
                            className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase cursor-pointer flex items-center gap-0.5 ml-auto bg-transparent border-none"
                          >
                            Kembali ke Awal ↺
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Flashcard Memory Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between min-h-[260px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-md border border-indigo-100 dark:border-slate-800 uppercase tracking-widest font-mono">
                    🎴 Kartu Memori Finansial
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const randomIdx = Math.floor(Math.random() * GLOSSARY_ITEMS.length);
                        setFlashcardIdx(randomIdx);
                        setFlashcardFlipped(false);
                      }}
                      className="text-[10px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 cursor-pointer"
                      title="Acak Kartu"
                    >
                      <Shuffle className="w-3 h-3" /> Acak
                    </button>
                    
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/40">
                      Dikuasai: {masteredCards.length}/{GLOSSARY_ITEMS.length}
                    </span>
                  </div>
                </div>

                <div style={{ perspective: 1000 }} className="my-2 w-full h-[140px] relative select-none">
                  <motion.div
                    style={{ transformStyle: 'preserve-3d' }}
                    animate={{ rotateY: flashcardFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="w-full h-full relative cursor-pointer"
                    onClick={() => setFlashcardFlipped(!flashcardFlipped)}
                  >
                    {/* Front Side */}
                    <div 
                      style={{ backfaceVisibility: 'hidden' }}
                      className="absolute inset-0 p-4 bg-slate-50 dark:bg-slate-850 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-750 flex flex-col justify-center items-center shadow-inner"
                    >
                      <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase mb-1 flex items-center gap-1">
                        ISTILAH {masteredCards.includes(flashcardIdx) && <span className="text-emerald-500">✓ DIKUASAI</span>}
                      </span>
                      <h4 className="text-sm sm:text-base font-black text-teal-600 uppercase tracking-wide">
                        {GLOSSARY_ITEMS[flashcardIdx].term}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                        <span>💡 Klik untuk Membalik</span>
                      </p>
                    </div>

                    {/* Back Side */}
                    <div 
                      style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                      className="absolute inset-0 p-4 bg-slate-50 dark:bg-slate-850 text-center rounded-2xl border-2 border-solid border-slate-200 dark:border-slate-750 flex flex-col justify-center items-center shadow-inner overflow-y-auto"
                    >
                      <p className="text-xs font-bold text-slate-850 dark:text-slate-100 leading-relaxed">
                        {GLOSSARY_ITEMS[flashcardIdx].simpleExplanation}
                      </p>
                      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/40 px-2 py-1 rounded-lg text-[9px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide block mt-2 max-w-[95%]">
                        ⚠️ Realita: {GLOSSARY_ITEMS[flashcardIdx].antiMisleading.slice(0, 85)}...
                      </div>
                    </div>
                  </motion.div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-black text-slate-400">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlashcardIdx((prev) => (prev > 0 ? prev - 1 : GLOSSARY_ITEMS.length - 1));
                      setFlashcardFlipped(false);
                    }}
                    className="hover:text-slate-700 dark:hover:text-slate-200 uppercase cursor-pointer bg-transparent border-none text-slate-400"
                  >
                    &larr; Prev
                  </button>

                  <button
                    onClick={(e) => toggleMasteredFlashcard(flashcardIdx, e)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] font-black transition-all cursor-pointer border ${
                      masteredCards.includes(flashcardIdx)
                        ? 'bg-emerald-500 text-white border-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {masteredCards.includes(flashcardIdx) ? '✓ Dikuasai' : '+ Tandai Dikuasai'}
                  </button>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFlashcardIdx((prev) => (prev < GLOSSARY_ITEMS.length - 1 ? prev + 1 : 0));
                      setFlashcardFlipped(false);
                    }}
                    className="hover:text-slate-700 dark:hover:text-slate-200 uppercase cursor-pointer bg-transparent border-none text-slate-400"
                  >
                    Next &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Quiz Arena Section */}
            {activeQuizId ? (
              // Active Quiz Game Board
              (() => {
                const quizTopic = QUIZ_TOPICS_DATA.find(t => t.id === activeQuizId);
                if (!quizTopic) return null;
                const currentQuestion = quizTopic.questions[quizQuestionIndex];
                const totalQuestions = quizTopic.questions.length;
                const isSelected = quizAnswers[quizQuestionIndex] !== undefined;

                return (
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl shadow-sm space-y-6 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div>
                        <span className="text-[9px] font-black text-indigo-650 bg-indigo-50 dark:bg-indigo-950/30 px-2.5 py-1 rounded">
                          TANTANGAN ARENA KUIS
                        </span>
                        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mt-1">{quizTopic.title}</h3>
                      </div>
                      <button
                        onClick={() => setActiveQuizId(null)}
                        className="text-xs font-black text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                      >
                        [X] Keluar Kuis
                      </button>
                    </div>

                    {!quizSubmitted ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                          <span>Pertanyaan {quizQuestionIndex + 1} dari {totalQuestions}</span>
                          <span className="text-teal-600">Skor: {Object.keys(quizAnswers).filter((qIdx) => quizAnswers[parseInt(qIdx)] === quizTopic.questions[parseInt(qIdx)].correct).length} / {totalQuestions}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${((quizQuestionIndex + 1) / totalQuestions) * 100}%` }}></div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-base sm:text-lg font-black text-slate-850 dark:text-slate-100 leading-snug">
                            {currentQuestion.q}
                          </p>
                          <div className="grid gap-2">
                            {currentQuestion.options.map((opt, oIdx) => {
                              const isChecked = quizAnswers[quizQuestionIndex] === oIdx;
                              return (
                                <button
                                  key={oIdx}
                                  onClick={() => handleSelectQuizAnswer(quizQuestionIndex, oIdx)}
                                  className={`w-full text-left p-3 border rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                                    isChecked 
                                      ? 'bg-indigo-50 border-indigo-500 text-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300' 
                                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-200'
                                  }`}
                                >
                                  <span>{opt}</span>
                                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${isChecked ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'}`}>
                                    {isChecked && "✓"}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-150 space-y-2">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded ${quizAnswers[quizQuestionIndex] === currentQuestion.correct ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              {quizAnswers[quizQuestionIndex] === currentQuestion.correct ? '✓ JAWABAN BENAR' : '✗ KURANG TEPAT'}
                            </span>
                            <p className="text-xs font-semibold text-slate-650 dark:text-slate-300 italic leading-relaxed">
                              {currentQuestion.explanation}
                            </p>
                          </div>
                        )}

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => handleNextQuizQuestion(totalQuestions)}
                            disabled={!isSelected}
                            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white px-5 py-2.5 rounded-xl text-xs font-black disabled:opacity-45 transition-all flex items-center gap-1.5 cursor-pointer border-none"
                          >
                            {quizQuestionIndex === totalQuestions - 1 ? 'Selesaikan Kuis' : 'Lanjut Kuis'} <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 text-center py-4">
                        <div className="inline-flex p-3 bg-amber-500/10 rounded-full text-amber-500">
                          <Trophy className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                          <h4 className="text-xl font-black text-slate-850 dark:text-slate-100">Kuis Selesai!</h4>
                          <p className="text-slate-500 text-xs font-semibold max-w-sm mx-auto leading-relaxed">
                            Kerja bagus! Anda telah menguji pemahaman keuangan Anda tentang materi <strong>{quizTopic.title}</strong>.
                          </p>
                        </div>

                        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl max-w-xs mx-auto border border-slate-200">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase">Skor Anda</p>
                          <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{quizScore} / {totalQuestions}</p>
                          <p className="text-[10px] text-slate-500 font-semibold mt-1">
                            {quizScore === 3 && '🥇 Nilai Sempurna! Master Finansial.'}
                            {quizScore === 2 && '🥈 Sangat Baik! Kuasai lagi materi.'}
                            {quizScore === 1 && '🥉 Terus Belajar! Fondasi penting.'}
                            {quizScore === 0 && '❌ Belum Beruntung! Baca lagi modul.'}
                          </p>
                        </div>

                        <div className="text-xs font-bold flex justify-center items-center gap-1.5 bg-amber-50 border border-amber-500/20 max-w-xs mx-auto p-2 rounded-xl text-amber-900">
                          <Sparkle className="w-4 h-4 text-amber-500" />
                          <span>XP Didapatkan: <strong>+{quizScore === 3 ? 100 : quizScore === 2 ? 60 : quizScore === 1 ? 30 : 0} XP</strong></span>
                        </div>

                        <div className="flex justify-center gap-3 pt-3">
                          <button
                            onClick={() => handleStartQuizTopic(quizTopic.id)}
                            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-black transition-all cursor-pointer border-none"
                          >
                            Ulang Kuis
                          </button>
                          <button
                            onClick={() => setActiveQuizId(null)}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer border-none"
                          >
                            Kembali ke Daftar Kuis
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm">
                  <span className="text-[9px] font-black tracking-wider text-teal-650 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded border border-teal-100 dark:border-teal-900/40 uppercase font-mono">
                    🕹️ ARENA KUIS TEMATIK
                  </span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight mt-2.5">Kuis Topik Finansial Spesifik</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                    Pilih topik kuis di bawah ini untuk menguji pemahaman Anda dan mengumpulkan bonus XP tambahan!
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  {QUIZ_TOPICS_DATA.map((topic) => {
                    const IconComponent = topic.icon;
                    const isCompleted = completedQuizzes.includes(topic.id);

                    return (
                      <div
                        key={topic.id}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3.5">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                            <IconComponent className="w-6 h-6 animate-pulse" style={{ animationDuration: '4s' }} />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-black text-slate-855 dark:text-slate-100 leading-snug">
                              {topic.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5">
                              HADIAH: <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100/30 font-black">+{topic.xpReward} XP</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4 mt-1">
                          <span className="text-[10px] font-black text-slate-500">
                            {isCompleted ? (
                              <span className="text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-150 px-2.5 py-0.5 rounded-full text-[9px] font-black flex items-center gap-1">
                                <Check className="w-3 h-3" /> SELESAI
                              </span>
                            ) : (
                              '3 Soal Pilihan Ganda'
                            )}
                          </span>
                          <button
                            onClick={() => handleStartQuizTopic(topic.id)}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer border-none"
                          >
                            Mulai Kuis
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ==================== TAB 3: PERPUSTAKAAN ARTIKEL & E-BOOK ==================== */}
        {activeTab === 'perpustakaan' && (
          <motion.div
            key="perpustakaan-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Header & Category Filters */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-5">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[9px] font-black tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded border border-amber-200/50 dark:border-amber-900/40 uppercase font-mono">
                    📚 LITERASI & PANDUAN PRAKTIS
                  </span>
                  <h3 className="text-xl font-black text-slate-850 dark:text-slate-100 tracking-tight mt-2">
                    Perpustakaan Artikel & Panduan Finansial
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">
                    Jelajahi panduan mendalam tentang strategi alokasi uang, tips investasi, hingga perlindungan dari jebakan utang.
                  </p>
                </div>

                {/* Article Search Bar */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari artikel literasi..."
                    value={librarySearch}
                    onChange={(e) => setLibrarySearch(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                  />
                  {librarySearch && (
                    <button
                      onClick={() => setLibrarySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {[
                  { id: 'all', label: 'Semua Artikel' },
                  { id: 'bookmarks', label: `⭐ Bookmark (${bookmarkedArticles.length})` },
                  { id: 'budgeting', label: '💰 Budgeting' },
                  { id: 'investing', label: '📈 Investasi' },
                  { id: 'crypto', label: '🪙 Kripto & Web3' },
                  { id: 'debt', label: '🛡️ Kelola Utang' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setArticleCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wide whitespace-nowrap transition-all cursor-pointer border ${
                      articleCategory === cat.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-750'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLibraryLessons.length === 0 ? (
                <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center space-y-3">
                  <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
                  <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">Tidak ada artikel ditemukan</h4>
                  <p className="text-xs text-slate-400">Coba ubah kata kunci pencarian atau pilih kategori artikel lain.</p>
                </div>
              ) : (
                filteredLibraryLessons.map((lesson) => {
                  const isRead = readLessons.includes(lesson.id);
                  const isBookmarked = bookmarkedArticles.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all duration-300 relative group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200/40">
                            PANDUAN PRAKTIS
                          </span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 font-mono">
                              <Clock className="w-3 h-3 text-slate-400" /> 4 min
                            </span>
                            <button
                              onClick={(e) => toggleBookmarkArticle(lesson.id, e)}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                isBookmarked
                                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-600 border-amber-300'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700 hover:text-amber-500'
                              }`}
                              title={isBookmarked ? 'Hapus Bookmark' : 'Simpan Artikel'}
                            >
                              <Star className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                            </button>
                          </div>
                        </div>

                        <h4 className="text-base font-black text-slate-850 dark:text-slate-100 leading-snug group-hover:text-amber-600 transition-colors">
                          {lesson.title}
                        </h4>

                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                          {lesson.subtitle}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                        {isRead ? (
                          <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                            <Check className="w-3 h-3" /> DIBACA
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold text-slate-400">Belum dibaca</span>
                        )}

                        <button
                          onClick={() => setSelectedLesson(lesson)}
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer border-none flex items-center gap-1"
                        >
                          Baca Artikel <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Article Detail Reader Modal */}
            <AnimatePresence>
              {selectedLesson && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl space-y-6"
                  >
                    <div className="flex justify-between items-start border-b border-slate-150 dark:border-slate-800 pb-4">
                      <div>
                        <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded border border-amber-200/50 uppercase font-mono">
                          LITERASI FINANCIAL
                        </span>
                        <h3 className="text-lg sm:text-xl font-black text-slate-850 dark:text-slate-100 mt-2">
                          {selectedLesson.title}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                          {selectedLesson.subtitle}
                        </p>
                      </div>
                      <button
                        onClick={() => setSelectedLesson(null)}
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer border-none"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm font-medium leading-relaxed space-y-4">
                      <p className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200/40 text-amber-900 dark:text-amber-300 font-semibold italic">
                        💡 {selectedLesson.introduction}
                      </p>

                      <div className="space-y-4 pt-2">
                        {selectedLesson.detailedSections && selectedLesson.detailedSections.map((sec, sIdx) => (
                          <div key={sIdx} className="space-y-1.5">
                            <h4 className="text-sm sm:text-base font-black text-slate-800 dark:text-slate-100">
                              {sec.title}
                            </h4>
                            <p className="text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                              {sec.content}
                            </p>
                          </div>
                        ))}
                      </div>

                      {selectedLesson.keyTakeaways && selectedLesson.keyTakeaways.length > 0 && (
                        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-750 space-y-2">
                          <h5 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-amber-500" /> Poin Penting (Key Takeaways)
                          </h5>
                          <ul className="list-disc list-inside text-xs text-slate-600 dark:text-slate-300 space-y-1">
                            {selectedLesson.keyTakeaways.map((point, pIdx) => (
                              <li key={pIdx}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex justify-between items-center">
                      <button
                        onClick={(e) => toggleBookmarkArticle(selectedLesson.id, e)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 cursor-pointer ${
                          bookmarkedArticles.includes(selectedLesson.id)
                            ? 'bg-amber-100 text-amber-800 border-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <Star className="w-3.5 h-3.5" fill={bookmarkedArticles.includes(selectedLesson.id) ? 'currentColor' : 'none'} />
                        {bookmarkedArticles.includes(selectedLesson.id) ? 'Tersimpan di Bookmark' : 'Simpan Artikel'}
                      </button>

                      <button
                        onClick={() => {
                          if (!readLessons.includes(selectedLesson.id)) {
                            const updated = [...readLessons, selectedLesson.id];
                            setReadLessons(updated);
                            localStorage.setItem('read_lessons', JSON.stringify(updated));
                            addXp(25);
                            toast.success('🎉 Selesai Membaca! +25 XP ditambahkan!');
                            confetti({ particleCount: 25, spread: 60 });
                          } else {
                            toast.info('Artikel ini sudah ditandai dibaca.');
                          }
                          setSelectedLesson(null);
                        }}
                        className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer border-none flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Tandai Selesai Dibaca (+25 XP)
                      </button>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ==================== TAB 4: SIKAYA AI TUTOR CHATBOT ==================== */}
        {activeTab === 'ai-tutor' && (
          <motion.div
            key="ai-tutor-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-6 items-start"
          >
            {/* Quick Suggestions Left Block */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
              <div>
                <span className="text-[8px] font-black tracking-wider text-teal-650 bg-teal-50 dark:bg-teal-950/40 px-2.5 py-1 rounded border border-teal-100 dark:border-teal-900/40 uppercase font-mono">
                  💡 REKOMENDASI TOPIK
                </span>
                <h3 className="text-base font-black text-slate-850 dark:text-slate-100 mt-2.5">Rekomendasi Pertanyaan</h3>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold mt-1">Klik salah satu chip di bawah untuk ditanyakan langsung ke Guru AI.</p>
              </div>

              <div className="flex flex-col gap-2">
                {[
                  "Apa bedanya RDPU, RDPT, dan RDS?",
                  "Mengapa bunga majemuk disebut keajaiban kedelapan dunia?",
                  "Bagaimana cara menghindari Pinjol ilegal?",
                  "Bagaimana menyiasati Latte Factor?",
                  "Jelaskan arti Inflasi seperti saya berumur 5 tahun.",
                  "Apa arti Diversifikasi investasi?"
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleSendAiMessage(chip)}
                    disabled={aiLoading}
                    className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-300 transition-all hover:translate-x-1 cursor-pointer border-solid disabled:opacity-50"
                  >
                    ✨ {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Chatbot Board Right Block */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col h-[520px] overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-slate-150 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-600 text-white rounded-xl animate-bounce" style={{ animationDuration: '3s' }}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-850 dark:text-slate-100">Sikaya AI Financial Tutor</h3>
                    <span className="text-[10px] text-teal-650 dark:text-teal-400 font-extrabold uppercase flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping"></span> Online • Tutor Kepercayaan Anda
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setChatLogs([
                      { 
                        sender: 'ai', 
                        text: 'Halo! Saya **Sikaya AI Tutor**, guru keuangan pintar Anda. 🎓✨\n\nSaya di sini untuk membantu Anda memahami segala hal tentang perencanaan uang, investasi, dana darurat, hingga menghindari pinjol ilegal.\n\nTanyakan apa saja, atau klik salah satu pilihan topik di bawah untuk memulai!' 
                      }
                    ]);
                  }}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 bg-transparent border-none cursor-pointer uppercase tracking-wider"
                >
                  Bersihkan Chat
                </button>
              </div>

              {/* Chat Message Lists */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                {chatLogs.map((msg, mIdx) => {
                  const isUser = msg.sender === 'user';
                  return (
                    <div
                      key={mIdx}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-xs leading-relaxed font-semibold shadow-sm relative group ${
                        isUser
                          ? 'bg-slate-900 text-white rounded-br-none dark:bg-slate-800'
                          : 'bg-slate-50 text-slate-800 border rounded-bl-none dark:bg-slate-950 dark:text-slate-200 dark:border-slate-850'
                      }`}>
                        {isUser ? (
                          <p>{msg.text}</p>
                        ) : (
                          <>
                            <div className="markdown-body text-slate-700 dark:text-slate-300">
                              <ReactMarkdown>{msg.text}</ReactMarkdown>
                            </div>
                            <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-800 flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleAudioSummary(msg.text.replace(/[*#]/g, ''))}
                                className="text-[10px] font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                title="Dengarkan Audio Suara"
                              >
                                <Volume2 className="w-3 h-3" /> Suara
                              </button>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(msg.text);
                                  toast.success('Jawaban disalin ke clipboard!');
                                }}
                                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 bg-transparent border-none cursor-pointer"
                                title="Salin Teks"
                              >
                                <Copy className="w-3 h-3" /> Salin
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 dark:bg-slate-950 text-slate-850 border rounded-2xl rounded-bl-none p-3.5 flex items-center gap-2.5">
                      <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                      <span className="text-[10px] font-bold text-slate-400">Tutor sedang merenungkan jawabannya...</span>
                    </div>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Input Chat Block */}
              <div className="p-3 border-t border-slate-150 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950 flex gap-2">
                <input
                  type="text"
                  placeholder="Tanyakan istilah finansial atau simulasi di sini..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSendAiMessage(aiInput);
                    }
                  }}
                  disabled={aiLoading}
                  className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 placeholder-slate-400 text-slate-800 dark:text-slate-100"
                />
                <button
                  onClick={() => handleSendAiMessage(aiInput)}
                  disabled={aiLoading || !aiInput.trim()}
                  className="bg-teal-600 hover:bg-teal-500 text-white p-3 rounded-2xl transition-all active:scale-95 cursor-pointer border-none shrink-0 disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RENDER CERTIFICATE MODAL */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative space-y-6"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCertificateModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-extrabold text-sm p-2 rounded-lg hover:bg-slate-50 dark:bg-slate-800 cursor-pointer border-none bg-transparent"
            >
              Tutup [X]
            </button>

            {/* Certificate Core Printable container */}
            <div className="border-8 border-double border-slate-800 p-8 sm:p-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-50/20 via-white to-indigo-50/20 text-center space-y-6 relative overflow-hidden shadow-inner">
              
              {/* Background watermark icon */}
              <Award className="absolute inset-0 m-auto text-teal-600/5 w-64 h-64 -z-0 pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex justify-center">
                  <span className="px-3 py-1 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-[10px] font-black uppercase tracking-widest">
                    AKADEMI LITERASI KEUANGAN SIKAYA
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-sans">
                  SERTIFIKAT KELULUSAN
                </h2>
                
                <p className="text-slate-500 font-medium text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  Dengan bangga diberikan kepada peserta didik teladan atas penyelesaian seluruh materi edukasi manajemen aset:
                </p>

                {/* Graduate's Name */}
                <div className="py-4 space-y-2">
                  <div className="max-w-md mx-auto">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase block mb-1">
                      Kustomisasi Nama Penerima Sertifikat:
                    </label>
                    <input
                      type="text"
                      value={customCertName}
                      onChange={(e) => setCustomCertName(e.target.value)}
                      className="w-full text-center font-black text-xl sm:text-2xl text-teal-600 border-b-2 border-dashed border-teal-500/40 focus:border-teal-600 focus:outline-none bg-transparent italic pb-1 uppercase placeholder-teal-300 text-slate-900 dark:text-slate-100"
                      placeholder="NAMA LENGKAP ANDA"
                    />
                  </div>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider mt-2">
                    Skor Pencapaian: {user.xp} XP • GELAR: {user.literacyLevel}
                  </p>
                </div>

                <p className="text-slate-500 font-semibold text-xs leading-relaxed max-w-lg mx-auto">
                  Telah mendalami dan sukses mensimulasikan penyeimbangan anggaran bulanan (50/30/20), menangkis jeratan pinjol konsumtif, mengkalkulasi pertumbuhan bunga majemuk, serta memetakan profil alokasi aset.
                </p>

                {/* Footer signatures */}
                <div className="pt-8 grid grid-cols-2 gap-8 text-xs font-bold text-slate-600 max-w-md mx-auto">
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-800 dark:text-slate-100 italic underline">Robo SiKaya Academic</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Platform Kurikulum Edukasi</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-extrabold text-slate-800 dark:text-slate-100">1 Juli 2026</p>
                    <p className="text-[9px] text-slate-400 font-semibold uppercase">Tanggal Kelulusan</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cert actions */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={triggerConfetti}
                className="px-6 py-3 bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-black rounded-xl border border-teal-200 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Ledakkan Selebrasi!
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`Saya baru saja menyelesaikan seluruh materi edukasi keuangan di Akademi Literasi Keuangan SiKaya dengan predikat ${user.literacyLevel}! Mari tingkatkan skor literasi finansial Anda di SiKaya!`);
                  toast.success("Teks selebrasi LinkedIn berhasil disalin ke papan klip!");
                }}
                className="px-6 py-3 bg-indigo-650 hover:bg-indigo-600 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Award className="w-4 h-4" /> Bagikan ke LinkedIn
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-none"
              >
                <Download className="w-4 h-4" /> Cetak / Simpan PDF
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* RENDER LEVEL CERTIFICATE CLAIM MODAL */}
      {showLevelCertModal && (() => {
        const lvl = DIFFICULTY_LEVELS.find(l => l.id === showLevelCertModal);
        if (!lvl) return null;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 border border-slate-200 dark:border-slate-850 shadow-2xl relative flex flex-col space-y-4"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-200 flex items-center gap-1">
                      👑 {lvl.subtitle}
                    </span>
                    <span className="text-[10px] text-slate-400 font-extrabold">✓ Terverifikasi SiKaya Academic</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-100 font-sans tracking-tight mt-1">
                    Klaim Sertifikat Pencapaian {lvl.title}
                  </h3>
                  <p className="text-slate-500 text-xs font-semibold">
                    Silakan unduh atau cetak sertifikat kelulusan resmi Anda di bawah ini.
                  </p>
                </div>
                <button
                  onClick={() => setShowLevelCertModal(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer font-bold text-xs border-none bg-transparent"
                >
                  Tutup [X]
                </button>
              </div>

              {/* Recipient Name Customization Box */}
              <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-2xl border border-slate-150 dark:border-slate-800 space-y-2">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Nama Penerima Sertifikat (Dapat Diubah)
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda..."
                  value={customCertName}
                  onChange={(e) => setCustomCertName(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Miniature Certificate Preview Frame */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 bg-amber-50/25 relative overflow-hidden text-center shadow-inner">
                {/* Gold Seal background pattern */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-teal-500/5 rounded-full border border-teal-500/10 pointer-events-none"></div>

                <div className="border-4 border-teal-600/40 dark:border-teal-500/30 p-4 rounded-xl relative space-y-3">
                  <span className="text-[8px] font-black tracking-widest text-slate-400 block">AKADEMI LITERASI KEUANGAN SIKAYA</span>
                  
                  <div className="w-10 h-10 bg-amber-500/20 border border-amber-500 rounded-full flex items-center justify-center mx-auto">
                    <Trophy className="w-5 h-5 text-amber-600 animate-pulse" />
                  </div>

                  <h4 className="text-sm font-black text-slate-850 dark:text-slate-100 font-sans tracking-wide uppercase">SERTIFIKAT PENCAPAIAN</h4>
                  <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none">{lvl.certificateTitle.toUpperCase()}</p>

                  <p className="text-[9px] text-slate-400 font-semibold italic mt-1">Diberikan secara terhormat kepada:</p>
                  <p className="text-base font-extrabold italic text-slate-900 dark:text-slate-100 uppercase tracking-wide border-b border-dashed border-slate-300 max-w-xs mx-auto pb-0.5 mt-1 font-serif">
                    {customCertName || user.fullName}
                  </p>

                  <p className="text-[10px] text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
                    Atas kelulusan gemilang menyelesaikan seluruh modul pembelajaran <span className="font-bold text-slate-800 dark:text-slate-200">{lvl.title} ({lvl.subtitle})</span> dan berhasil mengumpulkan total pencapaian sebesar <span className="font-bold text-teal-600">{user.xp} XP</span> di platform SiKaya.
                  </p>

                  {/* Tiny signature rows */}
                  <div className="pt-2 grid grid-cols-2 gap-4 text-[8px] font-bold text-slate-400">
                    <div>
                      <p className="font-extrabold text-slate-700 dark:text-slate-300 italic underline">Robo SiKaya Academic</p>
                      <p className="uppercase tracking-wider">Kurikulum Finansial AI</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-700 dark:text-slate-300">
                        {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                      <p className="uppercase tracking-wider">Tanggal Kelulusan</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2.5 justify-end">
                <button
                  onClick={() => {
                    triggerConfetti();
                    toast.success("Hore! Mari terus rayakan kelulusan Anda! 🎉");
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-black rounded-xl transition-all cursor-pointer border-none"
                >
                  🎉 Rayakan!
                </button>
                <button
                  onClick={() => {
                    downloadLevelCertificate(lvl.title, lvl.subtitle, customCertName || user.fullName, user.xp);
                  }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border-none shadow-sm"
                >
                  <Download className="w-4 h-4" /> Unduh Sertifikat (PNG)
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* RENDER GLOSSARY MODAL */}
      {showGlossaryModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-slate-900 rounded-3xl max-w-4xl w-full p-6 border border-slate-200 shadow-2xl relative flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-slate-850 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-teal-50 border border-teal-100 rounded-full text-teal-700 text-[10px] font-black uppercase">Edu-Corner</span>
                  <span className="text-[10px] text-slate-400 font-extrabold flex items-center gap-1">✨ Anti-Misleading & Jujur</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 font-sans tracking-tight flex items-center gap-2 mt-1">
                  📖 Glosarium Finansial SiKaya
                </h3>
                <p className="text-slate-500 text-xs font-semibold">
                  Membantu pemula memahami istilah investasi nyata tanpa bumbu-bumbu pemasaran palsu.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowGlossaryModal(false);
                  setGlossarySearch('');
                  setGlossaryCategory('all');
                }}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 dark:bg-slate-800 rounded-xl transition-all cursor-pointer font-bold text-xs border-none bg-transparent"
              >
                Tutup [X]
              </button>
            </div>

            {/* Controls (Search & Category filters) */}
            <div className="py-4 gap-4 flex flex-col sm:flex-row items-center border-b border-slate-100 dark:border-slate-850">
              {/* Search Bar */}
              <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari istilah finansial (misal: Reksadana, Inflasi)..."
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded-xl text-base sm:text-xs font-bold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
                />
                {glossarySearch && (
                  <button
                    onClick={() => setGlossarySearch('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer border-none bg-transparent"
                  >
                    Hapus
                  </button>
                )}
              </div>

              {/* Category selector */}
              <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                {[
                  { id: 'all', label: 'Semua Istilah' },
                  { id: 'pondasi', label: 'Pondasi Finansial' },
                  { id: 'investing', label: 'Investasi' },
                  { id: 'risiko', label: 'Risiko & Utang' },
                  { id: 'umum', label: 'Umum' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setGlossaryCategory(cat.id)}
                    className={`px-3 py-2 text-[10px] font-extrabold rounded-lg whitespace-nowrap transition-all cursor-pointer border-none ${
                      glossaryCategory === cat.id
                        ? 'bg-teal-650 text-white bg-teal-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-850'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Glossary List Area */}
            <div className="flex-1 overflow-y-auto py-5 pr-2 space-y-4 max-h-[50vh] scrollbar-thin">
              {sortedGlossaryItems.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
                  <p className="text-xs font-bold">Istilah tidak ditemukan</p>
                  <p className="text-[10px] max-w-xs mx-auto text-slate-450">Silakan coba dengan kata kunci lain atau pilih kategori yang berbeda.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {sortedGlossaryItems.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/65 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => toggleFavoriteGlossary(item.term)}
                              className={`p-1 rounded-lg border border-none bg-transparent cursor-pointer transition-all ${
                                favoriteGlossaryTerms.includes(item.term)
                                  ? 'text-amber-500'
                                  : 'text-slate-300 hover:text-amber-400'
                              }`}
                              title={favoriteGlossaryTerms.includes(item.term) ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}
                            >
                              <Star className="w-4 h-4" fill={favoriteGlossaryTerms.includes(item.term) ? 'currentColor' : 'none'} />
                            </button>
                            <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 font-sans tracking-tight">
                              {item.term}
                            </h4>
                          </div>

                          <span className="px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-100 dark:bg-teal-950 dark:text-teal-300">
                            {item.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed font-medium">
                          {item.simpleExplanation}
                        </p>
                      </div>

                      {/* Real Talk / Anti-Misleading Box */}
                      <div className="bg-amber-50 border border-amber-500/15 dark:bg-amber-950/20 dark:border-amber-900/40 p-3 rounded-xl text-[11px] leading-relaxed text-amber-900 dark:text-amber-300">
                        <span className="font-extrabold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-0.5">
                          ⚠️ Realita Finansial:
                        </span>
                        <p className="font-semibold text-amber-950 dark:text-amber-250">{item.antiMisleading}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-auto">
              <span>Sikaya Akademi Keuangan Jujur © 2026</span>
              <span className="text-teal-600 font-black">✓ Informasi Terverifikasi OJK & Ahli Finansial</span>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
