import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, BookOpen, LogOut, User, Sun, Moon, Flame, Sparkles, Activity, HelpCircle, Home, Search, ArrowRight, ChevronRight, FileText, Compass, MessageSquare, Video, HelpCircle as HelpIcon, Bot, Globe, ChevronDown, Award, Shield, Target, Hexagon, Trophy, PieChart, TrendingUp, Skull, Wallet, Users } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { motion, AnimatePresence } from 'motion/react';
import { OnboardingModal } from './OnboardingModal';

interface SearchItem {
  id: string;
  title: string;
  category: 'Kamus Finansial' | 'Modul Belajar' | 'Fitur & Tools' | 'Komunitas';
  desc: string;
  details?: string;
  tip?: string;
  url: string;
  state?: any;
  tags: string[];
}

const SEARCH_INDEX: SearchItem[] = [
  // GLOSSARY ITEMS (mapped to /belajar or /features)
  {
    id: "reksa-dana",
    title: "Reksa Dana (Mutual Fund)",
    category: "Kamus Finansial",
    desc: "Wadah untuk menghimpun dana masyarakat yang kemudian dikelola oleh Manajer Investasi (MI) profesional.",
    details: "Dana dari ratusan investor digabungkan untuk dibelikan bermacam-macam instrumen keuangan seperti saham, obligasi, atau deposito pasar uang. Sangat cocok bagi pemula karena dikelola oleh profesional.",
    tip: "Selalu perhatikan Expense Ratio (biaya pengelolaan) dan rekam jejak reputasi Manajer Investasi sebelum membeli. Masa lalu tidak menjamin kinerja masa depan!",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["mutual fund", "reksadana", "investasi", "modal", "pemula", "manajer investasi"]
  },
  {
    id: "inflasi",
    title: "Inflasi (Inflation)",
    category: "Kamus Finansial",
    desc: "Kondisi penurunan daya beli uang akibat kenaikan harga barang dan jasa secara terus menerus.",
    details: "Kondisi ekonomi di mana nilai mata uang mengalami kemerosotan nilai beli secara kumulatif. Uang Rp 100.000 hari ini tidak akan bernilai sama dengan Rp 100.000 sepuluh tahun ke depan.",
    tip: "Menaruh seluruh uangmu di tabungan bank biasa atau di bawah kasur dijamin nilainya akan habis termakan inflasi. Investasi adalah cara sehat melawan inflasi.",
    url: "/belajar",
    state: { activeModuleId: "budgeting" },
    tags: ["inflasi", "harga naik", "daya beli", "ekonomi", "uang", "pondasi"]
  },
  {
    id: "bullish-bearish",
    title: "Bullish & Bearish",
    category: "Kamus Finansial",
    desc: "Dua istilah utama tren pasar modal: naik pesat (Bullish) vs merosot tajam (Bearish).",
    details: "Bullish dianalogikan seperti banteng yang menyerang ke atas dengan tanduknya (pasar naik optimis). Bearish dianalogikan seperti beruang yang mencakar ke bawah (pasar turun lesu/pesimis).",
    tip: "Di saat pasar Bullish, jangan terjebak FOMO membeli di puncak harga! Di saat pasar Bearish, justru kesempatan emas membeli aset bagus di harga murah secara konsisten (Dollar Cost Averaging).",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["saham", "bullish", "bearish", "pasar modal", "tren", "fomo", "investasi"]
  },
  {
    id: "compound-interest",
    title: "Compound Interest (Bunga Majemuk)",
    category: "Kamus Finansial",
    desc: "Konsep imbal hasil yang diinvestasikan kembali sehingga modal baru yang lebih besar menghasilkan keuntungan lebih besar pula.",
    details: "Keajaiban dunia kedelapan di mana bunga menghasilkan bunga lagi (bunga-berbunga). Menghasilkan efek bola salju eksponensial dalam jangka panjang.",
    tip: "Bunga majemuk butuh waktu tahunan agar terlihat nyata hasilnya. Jangan tertipu tawaran investasi bodong yang menjanjikan bunga majemuk harian pasti untung!",
    url: "/belajar",
    state: { activeModuleId: "compound" },
    tags: ["bunga majemuk", "compound interest", "bunga berbunga", "visual", "masa depan", "investasi"]
  },
  {
    id: "diversifikasi",
    title: "Diversifikasi (Diversification)",
    category: "Kamus Finansial",
    desc: "Strategi membagi modal ke berbagai aset berbeda untuk memperkecil risiko kerugian total.",
    details: "Populer dengan ungkapan 'Don't put all your eggs in one basket'. Jika satu keranjang jatuh, kamu masih punya telur di keranjang lain (misal: membagi uang ke saham, emas, dan kas).",
    tip: "Diversifikasi terlalu berlebih juga bisa mereduksi return potensial. Alokasikan porsi aset secara seimbang sesuai dengan profil risikomu sendiri.",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["diversifikasi", "risiko", "aset", "emas", "kerugian", "saham", "reksadana"]
  },
  {
    id: "profil-risiko",
    title: "Profil Risiko (Risk Profile)",
    category: "Kamus Finansial",
    desc: "Tingkat kenyamanan dan ketahanan mental seorang investor terhadap naik turunnya nilai investasi.",
    details: "Setiap orang punya profil risiko berbeda: Konservatif (sangat menghindari fluktuasi), Moderat (menengah), atau Agresif (siap fluktuasi besar demi hasil tinggi).",
    tip: "Pahami diri sendiri. Jangan memaksakan diri menjadi investor Agresif membeli saham/kripto jika kamu panik dan tidak bisa tidur nyenyak saat melihat portofolio turun 5%!",
    url: "/features",
    tags: ["profil risiko", "risk profile", "konservatif", "moderat", "agresif", "psikologi"]
  },
  {
    id: "dana-darurat",
    title: "Dana Darurat (Emergency Fund)",
    category: "Kamus Finansial",
    desc: "Tabungan kas yang dipisahkan khusus hanya untuk pengeluaran mendesak yang tak terduga.",
    details: "Misal untuk musibah sakit, perbaikan laptop utama, atau kehilangan pekerjaan. Dana darurat biasanya bernilai 3-6 kali pengeluaran bulanan dan harus disimpan di instrumen likuid.",
    tip: "Jangan taruh dana darurat di saham atau aset fluktuatif lainnya! Jika pasar crash dan kamu butuh uang tunai darurat, kamu akan terpaksa mencairkan dalam kondisi rugi.",
    url: "/belajar",
    state: { activeModuleId: "emergency" },
    tags: ["dana darurat", "tabungan", "likuid", "darurat", "jaring pengaman", "pondasi"]
  },
  {
    id: "deposito-syariah",
    title: "Deposito Syariah & Deposito Biasa",
    category: "Kamus Finansial",
    desc: "Simpanan berjangka di bank dengan bunga atau bagi hasil tetap yang cenderung lebih tinggi.",
    details: "Uang dikunci dalam tenor tertentu (misal 1, 3, 6 bulan). Jika diambil sebelum jatuh tempo, umumnya ada denda pinalti (kecuali deposito digital modern tertentu).",
    tip: "Gunakan deposito untuk dana jangka pendek yang sudah direncanakan (misal dana bayar semesteran tahun depan). Jangan gunakan uang belanja harian untuk didepositokan!",
    url: "/belajar",
    state: { activeModuleId: "budgeting" },
    tags: ["deposito", "syariah", "bank", "bunga", "bagi hasil", "simpanan", "likuid"]
  },
  {
    id: "saham-glossary",
    title: "Saham (Stocks)",
    category: "Kamus Finansial",
    desc: "Lembar bukti kepemilikan modal atas suatu perusahaan, berhak atas dividen dan capital gain.",
    details: "Membeli saham berarti kamu resmi menjadi pemilik sebagian kecil dari perusahaan terbuka tersebut. Kamu berhak atas pembagian keuntungan (dividen) dan selisih harga (capital gain).",
    tip: "Saham berfluktuasi tajam. Menaruh seluruh modal di satu saham 'gorengan' tanpa riset fundamental adalah bentuk spekulasi judi, bukan investasi cerdas!",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["saham", "stocks", "modal", "capital gain", "dividen", "bursa efek"]
  },
  {
    id: "obligasi-sbn",
    title: "Obligasi & SBN (Surat Berharga Negara)",
    category: "Kamus Finansial",
    desc: "Surat utang yang diterbitkan pemerintah atau korporasi dengan jaminan pengembalian modal dan kupon.",
    details: "Pemerintah meminjam dana ke masyarakat untuk pembangunan negara, dan sebagai imbalannya, memberikan kupon (bunga) bulanan yang dijamin undang-undang. Sangat aman.",
    tip: "SBN ritel (seperti ORI atau Sukuk) aman dari risiko gagal bayar, namun likuiditasnya terbatas karena tidak semuanya bisa dicairkan sewaktu-waktu di bursa efek.",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["obligasi", "sbn", "surat berharga", "ori", "sukuk", "pemerintah", "aman"]
  },
  {
    id: "paylater-pinjol",
    title: "Paylater & Pinjol Ilegal",
    category: "Kamus Finansial",
    desc: "Fasilitas kredit instan digital. Pinjol ilegal berbahaya dengan denda mencekik dan intimidasi.",
    details: "Sistem belanja dulu bayar nanti (paylater) menciptakan ilusi kemampuan beli yang palsu. Pinjol ilegal menjebak korbannya dengan suku bunga yang melanggar aturan dan penagihan kasar.",
    tip: "Kemudahan paylater memotong pendapatan masa depanmu ditambah denda bunga. Gunakan hanya untuk barang produktif mendesak, bukan gaya hidup konsumtif!",
    url: "/belajar",
    state: { activeModuleId: "debt" },
    tags: ["paylater", "pinjol", "pinjaman online", "kredit", "utang", "bunga", "risiko"]
  },
  {
    id: "asset-allocation",
    title: "Asset Allocation (Alokasi Aset)",
    category: "Kamus Finansial",
    desc: "Pembagian porsi portofolio investasi ke dalam beberapa kategori seperti kas, obligasi, dan saham.",
    details: "Alokasi disesuaikan dengan target finansial dan jangka waktu. Usia muda cenderung bisa mengalokasikan porsi saham lebih besar dibanding kas/obligasi.",
    tip: "Formula alokasi aset harus dinamis. Sesuaikan porsinya seiring dengan pertambahan usia, jumlah tanggungan, atau target pengeluaran besar terdekat.",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["alokasi aset", "asset allocation", "portofolio", "kas", "saham", "obligasi", "seimbang"]
  },

  // INTERACTIVE CLASSROOM MODULES
  {
    id: "modul-budgeting",
    title: "Atur Arus Kas (Budgeting 50/30/20)",
    category: "Modul Belajar",
    desc: "Kuasai cara membagi anggaran bulananmu secara presisi dengan simulator interaktif.",
    details: "Simulasikan uang saku bulananmu dan bagi ke dalam pos Kebutuhan Pokok (50%), Keinginan/Gaya Hidup (30%), dan Investasi/Tabungan (20%). Uji feedback langsung dari perencana keuangan virtual.",
    tip: "Ingat prinsip 'Pay Yourself First'. Begitu menerima uang saku atau gaji, langsung amankan porsi tabungan/investasi (20%) terlebih dahulu sebelum membelanjakan sisanya!",
    url: "/belajar",
    state: { activeModuleId: "budgeting" },
    tags: ["budgeting", "arus kas", "pemasukan", "kebutuhan", "keinginan", "tabungan", "praktik"]
  },
  {
    id: "modul-debt",
    title: "Kelola Utang & Pinjol (Debt Management)",
    category: "Modul Belajar",
    desc: "Bongkar bahaya paylater, pinjol ilegal, dan buat strategi keluar dari jeratan utang.",
    details: "Petualangan interaktif memilah pengeluaran produktif vs konsumtif. Pelajari bagaimana bunga berbunga bekerja melawan dirimu saat kamu menunggak cicilan kredit.",
    tip: "Aturan utang sehat: Total cicilan utang bulananmu TIDAK BOLEH melebihi 30% dari total pendapatan bersihanmu. Lebih dari itu, keuanganmu berada di zona bahaya!",
    url: "/belajar",
    state: { activeModuleId: "debt" },
    tags: ["utang", "kredit", "paylater", "pinjol", "bunga", "cicilan", "keuangan sehat"]
  },
  {
    id: "modul-compound",
    title: "Simulasi Bunga Majemuk (Compound Interest)",
    category: "Modul Belajar",
    desc: "Mainkan simulator grafik bunga berbunga untuk melihat pertumbuhan modal jangka panjang.",
    details: "Lihat perbedaan dahsyat antara berinvestasi sejak dini vs menunda investasi meskipun dengan jumlah modal bulanan yang sama besar. Simulasi efek bola salju waktu.",
    tip: "Modal kecil yang diinvestasikan konsisten selama 20 tahun akan menghasilkan uang jauh lebih banyak dibanding modal besar yang baru diinvestasikan selama 5 tahun. Waktu adalah sahabat terbaik investor!",
    url: "/belajar",
    state: { activeModuleId: "compound" },
    tags: ["bunga majemuk", "compound", "simulasi", "grafik", "bunga berbunga", "visual"]
  },
  {
    id: "modul-investing",
    title: "Investasi Saham & Reksa Dana",
    category: "Modul Belajar",
    desc: "Simulasikan pembelian saham virtual dan reksa dana berdasarkan data real-time.",
    details: "Belajar melakukan analisis sederhana, melihat return per tahun dari reksa dana pasar uang, obligasi, dan saham, serta mengelola portofolio agar terhindar dari rugi besar.",
    tip: "Gunakan uang simulasi di bursa virtual untuk menguji seberapa kuat mentalmu menanggung fluktuasi naik turun sebelum terjun dengan uang asli!",
    url: "/belajar",
    state: { activeModuleId: "investing" },
    tags: ["saham", "reksadana", "virtual trading", "bursa efek", "portofolio", "praktik"]
  },
  {
    id: "modul-emergency",
    title: "Dana Darurat (Emergency Fund Setup)",
    category: "Modul Belajar",
    desc: "Simulasikan kesiapan keuanganmu menghadapi musibah mendadak di skenario fiktif.",
    details: "Membangun jaring pengaman finansial sebelum mulai berinvestasi. Simulator ini akan memicu skenario acak tak terduga (sakit, gawai rusak) untuk menguji seberapa aman alokasi danamu.",
    tip: "Dana darurat ideal: Minimal 3 kali pengeluaran bulanan bagi yang lajang, dan 6-12 kali pengeluaran bulanan bagi yang sudah berkeluarga.",
    url: "/belajar",
    state: { activeModuleId: "emergency" },
    tags: ["dana darurat", "emergency fund", "jaring pengaman", "skenario", "mitigasi risiko"]
  },

  // ADDITIONAL FEATURES & PLATFORM TOOLS
  {
    id: "ai-advisor",
    title: "Chatbot Financial Advisor",
    category: "Fitur & Tools",
    desc: "Konsultan finansial personal berbasis aturan untuk Gen Z.",
    details: "Masukkan profil keuanganmu (pemasukan, pengeluaran, tabungan) dan tanyakan apa saja terkait tips mengelola uang atau rencana investasi.",
    tip: "Berikan detail yang jelas pada pertanyaanmu agar chatbot bisa memberikan saran yang relevan!",
    url: "/ai-advisor",
    tags: ["chatbot", "advisor", "konsultan", "tanya jawab", "rekomendasi"]
  },
  {
    id: "kalkulator-compound",
    title: "Kalkulator Compound Interest Canggih",
    category: "Fitur & Tools",
    desc: "Visualisasikan pertumbuhan dana investasimu dengan kalkulator bunga majemuk.",
    details: "Ubah variabel setoran awal, kontribusi bulanan, persentase return tahunan, dan jangka waktu untuk menghitung persis nilai masa depan investasimu secara interaktif.",
    tip: "Tekan tombol 'Coba Simulasi' di halaman utama atau temukan kalkulator ini di bagian bawah halaman materi.",
    url: "/features",
    tags: ["kalkulator", "compound interest", "bunga majemuk", "simulasi", "bunga berbunga"]
  },
  {
    id: "game-trading",
    title: "Virtual Trading Game",
    category: "Fitur & Tools",
    desc: "Alat perdagangan bursa saham tiruan dengan pergerakan data riil bursa saham.",
    details: "Rasakan serunya membeli saham-saham Blue Chip Indonesia dan melihat keuntungan/kerugian virtual berkembang seiring waktu berjalan.",
    tip: "Buka halaman Fitur & Layanan atau masuk ke Kelas Belajar Saya untuk langsung mempraktekkannya tanpa takut rugi sepeser pun.",
    url: "/features",
    tags: ["game trading", "saham virtual", "bursa efek", "market simulator"]
  },
  {
    id: "kuis-literasi",
    title: "Kuis Literasi Finansial & Sertifikat",
    category: "Fitur & Tools",
    desc: "Tes kemampuan keuanganmu dan dapatkan Sertifikat Kelulusan SiKaya.",
    details: "Uji seberapa melek kamu tentang keuangan dengan menjawab kuis pilihan berganda di akhir setiap modul pembelajaran. Kumpulkan seluruh XP dan cetak sertifikat pribadimu.",
    tip: "Dapatkan skor kelulusan minimal 80% untuk membuka kunci unduhan Sertifikat Digital berformat PDF resmi dari SiKaya!",
    url: "/belajar",
    tags: ["kuis", "test", "sertifikat", "kelulusan", "lencana", "xp", "reward"]
  },
  {
    id: "forum-komunitas",
    title: "Forum Diskusi & Tanya Jawab Komunitas",
    category: "Komunitas",
    desc: "Gabung dan berdiskusi seputar keuangan dan tips tabungan bersama Generasi Z lainnya.",
    details: "Tanyakan apa saja mulai dari 'Bagusan beli emas atau reksadana?' hingga 'Gimana cara hemat anak kos?'. Ruang aman bercerita finansial tanpa intimidasi istilah rumit.",
    tip: "Tetap waspada, jangan pernah membagikan nomor rekening, saldo asli, atau data pribadi sensitif lainnya di forum publik!",
    url: "/features",
    tags: ["forum", "diskusi", "tanya jawab", "komunitas", "sharing", "tips", "anak kos"]
  },
  {
    id: "webinar-mentor",
    title: "Webinar Bulanan Bersama Certified Financial Planner (CFP)",
    category: "Komunitas",
    desc: "Ikuti siaran langsung gratis membahas tren investasi, karir, dan budgeting.",
    details: "Belajar langsung dari praktisi keuangan berlisensi yang siap menjawab keluh kesah keuanganmu secara blak-blakan dan interaktif.",
    tip: "Jadwal webinar diumumkan setiap tanggal 1 di papan pengumuman kelas atau halaman Fitur.",
    url: "/features",
    tags: ["webinar", "kelas online", "financial planner", "cfp", "belajar langsung"]
  }
];

const renderLayoutAvatar = (avatar: string, fallback: string = '🦊') => {
  const currentAvatar = avatar || fallback;
  if (currentAvatar.startsWith('data:image/') || currentAvatar.startsWith('http') || currentAvatar.includes('/')) {
    return <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover rounded-md" referrerPolicy="no-referrer" />;
  }
  return <span>{currentAvatar}</span>;
};

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const { language, setLanguage, t } = useLanguage();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const [personaName, setPersonaName] = useState<string>('');
  useEffect(() => {
    const saved = localStorage.getItem('sikaya_profile_persona');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.name) {
          setPersonaName(parsed.name);
        }
      } catch (e) {}
    }
  }, []);

  // Explore Dropdown Mega Menu States & Configs
  const [isExploreOpen, setIsExploreOpen] = useState(false);
  const [isMobileExploreOpen, setIsMobileExploreOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const exploreTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Grouped Hover Menu States
  const [activeHoverMenu, setActiveHoverMenu] = useState<'belajar' | 'simulasi' | 'keuangan' | 'komunitas' | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterMenu = (menu: 'belajar' | 'simulasi' | 'keuangan' | 'komunitas') => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveHoverMenu(menu);
  };

  const handleMouseLeaveMenu = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverMenu(null);
    }, 150);
  };

  // Mobile Menu Accordions
  const [isMobileBelajarOpen, setIsMobileBelajarOpen] = useState(false);
  const [isMobileSimulasiOpen, setIsMobileSimulasiOpen] = useState(false);
  const [isMobileKeuanganOpen, setIsMobileKeuanganOpen] = useState(false);
  const [isMobileKomunitasOpen, setIsMobileKomunitasOpen] = useState(false);

  const handleExploreItemClick = (path: string, state?: any) => {
    setIsExploreOpen(false);
    setIsMenuOpen(false);
    setActiveHoverMenu(null);
    if (state) {
      navigate(path, { state });
    } else {
      navigate(path);
    }
  };

  const exploreTopics = [
    { title: 'Beranda Utama', desc: 'Halaman depan & ringkasan info', path: '/', icon: Home },
    { title: 'Investasi & Saham', desc: 'Belajar saham & reksa dana', path: '/belajar', state: { activeModuleId: 'investing' }, icon: Activity, badge: 'Hot' },
    { title: 'Crypto & Web3', desc: 'Pahami dasar aset digital', path: '/belajar', state: { activeModuleId: 'crypto' }, icon: Hexagon, badge: 'Tren' },
    { title: 'Atur Arus Kas (50/30/20)', desc: 'Bagi anggaran & saku bulanan', path: '/belajar', state: { activeModuleId: 'budgeting' }, icon: FileText },
    { title: 'Dana Darurat', desc: 'Siapkan jaring pengaman', path: '/belajar', state: { activeModuleId: 'emergency' }, icon: Shield },
    { title: 'Kalkulator FIRE', desc: 'Rencana pensiun dini', path: '/features', state: { activeFeature: 'fire' }, icon: Target },
  ];

  const exploreFeatures = [
    { title: 'Virtual Trading Simulator', desc: 'Uji trading saham data riil', path: '/simulasi', icon: Activity, badge: 'LIVE' },
    { title: 'Chatbot Financial Advisor', desc: 'Konsultasi kelola uang dengan AI', path: '/ai-advisor', icon: Bot, badge: 'BARU' },
    { title: 'Simulasi Hidup Finansial', desc: 'Simulasi keputusan hidup & karier', path: '/life-simulator', icon: Skull, badge: 'SERU' },
    { title: 'Portfolio Tracker', desc: 'Pantau aset & kekayaan bersih (Net Worth)', path: '/portfolio', icon: PieChart, badge: 'PRO' },
    { title: 'Market News & AI Sentiment', desc: 'Berita pasar dengan sentimen AI', path: '/news', icon: TrendingUp },
  ];

  const explorePrograms = [
    { title: 'Kelas Literasi Saya', desc: 'Masuk ruang belajar interaktif', path: '/belajar', icon: BookOpen },
    { title: 'Papan Peringkat', desc: 'Jadilah investor virtual terbaik', path: '/leaderboard', icon: Trophy, badge: 'KOMPETISI' },
    { title: 'Forum Diskusi Gen Z', desc: 'Tanya jawab & komunitas investasi', path: '/community', icon: MessageSquare, badge: 'RAMAI' },
    { title: 'Sertifikat Kelulusan', desc: 'Klaim sertifikat literasi', path: '/belajar', icon: Award },
  ];

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (exploreRef.current && !exploreRef.current.contains(event.target as Node)) {
        setIsExploreOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (exploreTimeoutRef.current) clearTimeout(exploreTimeoutRef.current);
    };
  }, []);

  // Search Palette States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState<'all' | 'kamus' | 'modul' | 'tools' | 'komunitas'>('all');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === '/') {
        const active = document.activeElement?.tagName;
        if (active !== 'INPUT' && active !== 'TEXTAREA') {
          e.preventDefault();
          setIsSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    } else {
      setSearchQuery('');
      setSearchCategory('all');
      setSelectedIdx(0);
    }
  }, [isSearchOpen]);

  // Reset selection index on search filter
  useEffect(() => {
    setSelectedIdx(0);
  }, [searchQuery, searchCategory]);

  const filteredSearchItems = SEARCH_INDEX.filter(item => {
    const matchesCategory = 
      searchCategory === 'all' ||
      (searchCategory === 'kamus' && item.category === 'Kamus Finansial') ||
      (searchCategory === 'modul' && item.category === 'Modul Belajar') ||
      (searchCategory === 'tools' && item.category === 'Fitur & Tools') ||
      (searchCategory === 'komunitas' && item.category === 'Komunitas');

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query) ||
      item.details?.toLowerCase().includes(query) ||
      item.tags.some(t => t.toLowerCase().includes(query))
    );
  });

  const handleSelectItem = (item: SearchItem) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (item.state) {
      navigate(item.url, { state: item.state });
    } else {
      navigate(item.url);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => (prev + 1) % Math.max(1, filteredSearchItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => (prev - 1 + filteredSearchItems.length) % Math.max(1, filteredSearchItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredSearchItems[selectedIdx]) {
        handleSelectItem(filteredSearchItems[selectedIdx]);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) {
        return saved === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to top on route/page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 selection:bg-teal-100 selection:text-teal-900 dark:selection:bg-teal-950 dark:selection:text-teal-200 antialiased flex flex-col transition-colors duration-355">
      {/* Educational Banner */}
      <div className="bg-slate-900 dark:bg-black text-white py-2 px-4 text-center text-[10px] sm:text-[11px] font-semibold tracking-wider relative z-50">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="leading-tight">{t('nav.banner')}</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className={`sticky top-0 pt-[env(safe-area-inset-top)] z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/85 shadow-lg shadow-slate-100/30 dark:shadow-none py-1.5' 
          : 'bg-white/95 dark:bg-slate-900/95 border-b border-slate-100 dark:border-slate-800/50 py-2'
      }`}>
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
          <div className="flex justify-between items-center h-12 gap-3">
            {/* Logo and Nav Links Group */}
            <div className="flex items-center gap-4 lg:gap-6 xl:gap-8 flex-1">
              <Link 
                to="/"
                className="flex items-center gap-1.5 px-2 py-1 rounded-xl hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-200 text-left cursor-pointer shrink-0"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-teal-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Logo className="w-7 h-7 shrink-0 drop-shadow-xs transition-transform duration-300 hover:scale-105 hover:rotate-2 relative z-10" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-sm sm:text-base tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-0.5 leading-none">
                    SI<span className="text-teal-600 dark:text-teal-450 italic font-semibold">KAYA</span>
                  </span>
                  <span className="text-[7px] font-black text-teal-600/90 dark:text-teal-400/90 tracking-widest uppercase hidden sm:block">
                    AKADEMI
                  </span>
                </div>
              </Link>
              
              {/* Desktop Grouped Nav */}
              <div className="hidden md:flex items-center gap-0.5 xl:gap-1.5 text-xs font-bold text-slate-650 dark:text-slate-300">
                
                {/* 1. Beranda */}
                <Link 
                  to="/" 
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 ${
                    location.pathname === '/' 
                      ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
                      : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <Home className="w-3.5 h-3.5 opacity-85" />
                  <span>Beranda</span>
                </Link>

                {/* 2. Belajar */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnterMenu('belajar')}
                  onMouseLeave={handleMouseLeaveMenu}
                >
                  <button 
                    onClick={() => navigate('/belajar')}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      location.pathname === '/belajar' 
                        ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 opacity-85" />
                    <span>Belajar</span>
                    <ChevronDown className={`w-2.5 h-2.5 text-slate-450 transition-transform duration-200 ${activeHoverMenu === 'belajar' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeHoverMenu === 'belajar' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-1 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
                      >
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/belajar'); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-455">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Ruang Kelas Literasi</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">10 Modul Interaktif & Kuis Seru</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/belajar', { state: { showGlossary: true } }); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-455">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Kamus Glosarium</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Istilah & rumus finansial Gen-Z</p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 3. Simulasi */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnterMenu('simulasi')}
                  onMouseLeave={handleMouseLeaveMenu}
                >
                  <button 
                    onClick={() => navigate('/simulasi')}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      location.pathname === '/simulasi' || location.pathname === '/life-simulator'
                        ? 'text-teal-600 dark:text-teal-455 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span>Simulasi</span>
                    <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'simulasi' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeHoverMenu === 'simulasi' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
                      >
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/simulasi'); }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Virtual Trading Simulator</span>
                              <span className="text-[7px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1 rounded">LIVE</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Uji trading saham data pasar asli</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/life-simulator'); }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-450">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Simulasi Hidup Finansial</span>
                              <span className="text-[7px] font-extrabold bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400 px-1 rounded">SERU</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Simulasi tabungan, karir, & pengeluaran</p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Keuangan */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnterMenu('keuangan')}
                  onMouseLeave={handleMouseLeaveMenu}
                >
                  <button 
                    onClick={() => navigate('/portfolio')}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      location.pathname === '/portfolio' || location.pathname === '/features' || location.pathname === '/ai-advisor'
                        ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Wallet className="w-3.5 h-3.5 opacity-85" />
                    <span>Keuangan</span>
                    <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'keuangan' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeHoverMenu === 'keuangan' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
                      >
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/portfolio'); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-450 shrink-0">
                            <Wallet className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Portfolio & Asset Tracker</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Kekayaan bersih (Net Worth) & Arus Kas</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/features', { state: { activeFeature: 'health' } }); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 shrink-0">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Cek Kesehatan Finansial</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Analisis skor kesehatan finansial digital</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/features', { state: { activeFeature: 'envelope' } }); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-455 shrink-0">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Sistem Amplop Digital</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Atur anggaran bulanan saku kuliah/kerja</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/features', { state: { activeFeature: 'fire' } }); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-450 shrink-0">
                            <Target className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Kalkulator FIRE</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Prediksi target pensiun dini mandiri</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/ai-advisor'); }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">AI Financial Advisor</span>
                              <span className="text-[7px] font-extrabold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400 px-1 rounded animate-pulse">BARU</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Asisten konsultasi investasi Gen-Z</p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 5. Komunitas */}
                <div 
                  className="relative group"
                  onMouseEnter={() => handleMouseEnterMenu('komunitas')}
                  onMouseLeave={handleMouseLeaveMenu}
                >
                  <button 
                    onClick={() => navigate('/community')}
                    className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl transition-all duration-200 cursor-pointer ${
                      location.pathname === '/community' || location.pathname === '/leaderboard' || location.pathname === '/news'
                        ? 'text-teal-600 dark:text-teal-450 bg-teal-50/60 dark:bg-teal-950/20 font-extrabold shadow-xs' 
                        : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5 opacity-85" />
                    <span>Komunitas</span>
                    <ChevronDown className={`w-2.5 h-2.5 text-slate-455 transition-transform duration-200 ${activeHoverMenu === 'komunitas' ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {activeHoverMenu === 'komunitas' && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute left-0 mt-1 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 space-y-1"
                      >
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/community'); }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Forum Diskusi Gen Z</span>
                              <span className="text-[7px] font-extrabold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 px-1 rounded">RAMAI</span>
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Tanya jawab finansial & curhat cuan</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/leaderboard'); }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-450 shrink-0">
                            <Trophy className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Papan Peringkat Investor</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Klasemen portofolio simulasi tertinggi</p>
                          </div>
                        </button>
                        <button
                          onClick={() => { setActiveHoverMenu(null); navigate('/news'); }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all flex items-start gap-3 cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-450 shrink-0">
                            <TrendingUp className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Market News & Sentiment</p>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Analisis berita saham dengan AI real-time</p>
                          </div>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
              
            {/* Right Actions - Desktop only, handled via Hamburger menu drawer on mobile */}
            <div className="hidden md:flex items-center gap-1 xl:gap-1.5 shrink-0">
              <div className="flex items-center gap-1 xl:gap-1.5 border-l border-slate-200/60 dark:border-slate-800 pl-1 xl:pl-3">
                {/* Search Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="hidden xl:flex items-center gap-1.5 bg-slate-50/50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-450 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-all cursor-pointer w-36 xl:w-40 text-left"
                >
                  <Search className="w-3 h-3" />
                  <span className="text-[10px] font-bold flex-1">{t('nav.search_placeholder')}</span>
                  <span className="text-[8px] bg-slate-200/60 dark:bg-slate-700/80 px-1 py-0.2 rounded font-black text-slate-500 dark:text-slate-400 select-none">
                    ⌘K
                  </span>
                </button>

                {/* Medium Screen Search Button Trigger */}
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(true)}
                  className="flex xl:hidden p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
                  aria-label="Cari"
                  title="Cari Materi"
                >
                  <Search className="w-4 h-4" />
                </button>
                
                {/* Language Dropdown Selector */}
                <div className="relative" ref={langRef}>
                  <button
                    type="button"
                    onClick={() => setIsLangOpen(!isLangOpen)}
                    className="px-2 py-1 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
                    aria-label="Select Language"
                    title={language === 'id' ? 'Pilih Bahasa' : 'Select Language'}
                  >
                    <Globe className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-teal-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{language}</span>
                    <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isLangOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 overflow-hidden"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('id');
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            language === 'id' 
                              ? 'text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🇮🇩</span> Indonesia
                          </span>
                          {language === 'id' && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('en');
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            language === 'en' 
                              ? 'text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🇺🇸</span> English
                          </span>
                          {language === 'en' && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('ja');
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            language === 'ja' 
                              ? 'text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🇯🇵</span> 日本語
                          </span>
                          {language === 'ja' && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLanguage('zh');
                            setIsLangOpen(false);
                          }}
                          className={`w-full px-4 py-2 text-left text-xs font-bold transition-colors flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 ${
                            language === 'zh' 
                              ? 'text-teal-600 dark:text-teal-400 bg-teal-50/30 dark:bg-teal-950/10' 
                              : 'text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>🇨🇳</span> 中文
                          </span>
                          {language === 'zh' && <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Theme Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer relative group overflow-hidden border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
                  aria-label="Toggle Theme"
                  title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
                >
                  <div className="transition-transform duration-500 group-hover:rotate-12">
                    {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-500" />}
                  </div>
                </button>

                {/* Reminder Toggle Button */}
                <button
                  type="button"
                  onClick={() => toast.success("Pengingat investasi harian telah diaktifkan.")}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800 transition-all cursor-pointer relative group overflow-hidden border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50"
                  aria-label="Toggle Reminder"
                  title="Aktifkan Reminder Investasi"
                >
                  <Activity className="w-4 h-4 text-emerald-500 group-hover:animate-pulse" />
                </button>

                {user ? (
                  <div className="flex items-center gap-1.5">
                    <Link 
                      to="/belajar" 
                      className="group flex items-center gap-1.5 lg:gap-2 bg-gradient-to-r from-teal-50 to-teal-100/40 dark:from-slate-900 dark:to-slate-800/80 border border-teal-150 dark:border-slate-800 pl-1 lg:pl-1.5 pr-2 lg:pr-2.5 py-1 rounded-xl hover:border-teal-300 dark:hover:border-teal-500/50 shadow-xs hover:shadow-md hover:shadow-teal-100/10 dark:hover:shadow-none transition-all duration-200"
                    >
                      <div className="w-6 h-6 bg-white dark:bg-slate-850 rounded-lg flex items-center justify-center text-md shadow-xs group-hover:scale-105 transition-transform overflow-hidden">
                        {renderLayoutAvatar(user.avatar)}
                      </div>
                      <div className="text-left hidden lg:block">
                        <p className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mb-0.5">{t('nav.class')}</p>
                        <p className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 leading-none max-w-[50px] xl:max-w-[80px] truncate">{user.fullName.split(' ')[0]}</p>
                      </div>
                      <span className="hidden xl:flex items-center gap-0.5 px-1 py-0.5 bg-teal-500/10 text-teal-600 dark:text-teal-400 text-[8px] font-black rounded-md ml-0.5 border border-teal-500/20">
                        <Flame className="w-2 h-2 fill-current text-teal-500" /> {user.xp} XP
                      </span>
                    </Link>

                    <button 
                      onClick={() => { logout(); navigate('/'); }}
                      className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:text-slate-500 dark:hover:text-rose-400 dark:hover:bg-rose-950/20 p-1.5 rounded-lg transition-all cursor-pointer border border-transparent hover:border-rose-100 dark:hover:border-rose-900/40" 
                      title={t('nav.exit')}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    {personaName && (
                      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded-xl mr-2">
                        <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">👋 {personaName}</span>
                        <button 
                          onClick={() => { localStorage.removeItem('sikaya_onboarding_completed'); localStorage.removeItem('sikaya_profile_persona'); window.location.reload(); }}
                          className="text-[10px] text-rose-500 hover:underline font-bold ml-1.5 cursor-pointer"
                          title="Reset Onboarding Profil"
                        >
                          Reset
                        </button>
                      </div>
                    )}
                    <button 
                      onClick={() => navigate('/login')} 
                      className="text-[11px] font-extrabold text-slate-700 dark:text-slate-200 hover:text-teal-600 dark:hover:text-teal-400 px-3 py-1.5 rounded-lg hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                    >
                      {t('nav.login')}
                    </button>
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-[11px] font-black bg-teal-600 text-white px-3.5 py-1.5 rounded-lg hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-600/20 active:scale-95 transition-all flex items-center gap-1 cursor-pointer shadow-xs border border-teal-700/20 group"
                    >
                      <BookOpen className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" /> 
                      <span>{t('nav.start')}</span>
                      <Sparkles className="w-3.5 h-3.5 text-teal-200 animate-pulse ml-0.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center gap-1.5">
              {/* Mobile Search Button */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-xl text-slate-500 hover:text-teal-600 hover:bg-slate-100/50 dark:text-slate-400 dark:hover:text-teal-400 dark:hover:bg-slate-800/50 transition-all cursor-pointer"
                aria-label="Cari Istilah"
                title="Cari Istilah"
              >
                <Search className="w-4.5 h-4.5" />
              </button>

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none p-2 rounded-xl transition-all"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 pt-3 pb-8 space-y-4 shadow-xl animate-fade-in absolute w-full left-0 z-50">
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">{t('nav.main_menu')}</p>
              
              {/* Prominent Search Bar Trigger inside Mobile Menu */}
              <div className="px-3 pb-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/60 dark:border-slate-800 px-3.5 py-2.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-left cursor-pointer"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('nav.search_mobile_placeholder')}</span>
                </button>
              </div>

              {/* Mobile Grouped Nav Chapters */}
              <div className="space-y-2 pt-1">
                
                {/* 1. Belajar Accordion */}
                <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIsMobileBelajarOpen(!isMobileBelajarOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-teal-600" />
                      <span>Belajar</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMobileBelajarOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileBelajarOpen && (
                    <div className="px-2 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 space-y-1 pt-1.5 animate-fade-in">
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/belajar'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Ruang Kelas Literasi</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/belajar', { state: { showGlossary: true } }); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Kamus Glosarium</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. Simulasi Accordion */}
                <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIsMobileSimulasiOpen(!isMobileSimulasiOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
                      <span>Simulasi</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMobileSimulasiOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileSimulasiOpen && (
                    <div className="px-2 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 space-y-1 pt-1.5 animate-fade-in">
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/simulasi'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span className="flex-1">Virtual Trading Simulator</span>
                        <span className="text-[7px] font-black bg-emerald-100 text-emerald-700 px-1 rounded uppercase tracking-wider">LIVE</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/life-simulator'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
                        <span className="flex-1">Simulasi Hidup Finansial</span>
                        <span className="text-[7px] font-black bg-rose-100 text-rose-700 px-1 rounded uppercase">SERU</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Keuangan Accordion */}
                <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIsMobileKeuanganOpen(!isMobileKeuanganOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Wallet className="w-4 h-4 text-teal-650" />
                      <span>Keuangan & Kalkulator</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMobileKeuanganOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileKeuanganOpen && (
                    <div className="px-2 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 space-y-1 pt-1.5 animate-fade-in">
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/portfolio'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Portfolio & Asset Tracker</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/features', { state: { activeFeature: 'health' } }); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Cek Kesehatan Finansial</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/features', { state: { activeFeature: 'envelope' } }); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Sistem Amplop Digital</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/features', { state: { activeFeature: 'fire' } }); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Kalkulator FIRE</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/ai-advisor'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></span>
                        <span className="flex-1">AI Financial Advisor</span>
                        <span className="text-[7px] font-black bg-indigo-100 text-indigo-700 px-1 rounded animate-pulse">AI</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Komunitas Accordion */}
                <div className="border border-slate-200/60 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-50/20 dark:bg-slate-900/10">
                  <button
                    type="button"
                    onClick={() => setIsMobileKomunitasOpen(!isMobileKomunitasOpen)}
                    className="w-full flex items-center justify-between px-3.5 py-3 text-xs font-black text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-teal-600" />
                      <span>Komunitas</span>
                    </span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isMobileKomunitasOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isMobileKomunitasOpen && (
                    <div className="px-2 pb-2.5 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 space-y-1 pt-1.5 animate-fade-in">
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/community'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                        <span className="flex-1">Forum Diskusi Gen Z</span>
                        <span className="text-[7px] font-black bg-emerald-100 text-emerald-700 px-1 rounded">RAMAI</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/leaderboard'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                        <span>Papan Peringkat Investor</span>
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); navigate('/news'); }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/50 rounded-lg flex items-center gap-2.5"
                      >
                        <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                        <span>Market News & Sentiment</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* 5. Profil Link */}
                <button
                  onClick={() => { setIsMenuOpen(false); navigate(user ? '/' : '/login'); }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 text-xs font-black rounded-xl transition-all border ${
                    location.pathname === '/login'
                      ? 'border-teal-500/30 text-teal-600 bg-teal-50/20 dark:bg-teal-950/20'
                      : 'border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <User className="w-4 h-4 text-teal-600" />
                    <span>Profil Saya</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
              <p className="px-3 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">{t('nav.settings_account')}</p>
              
              {/* Mobile Theme Toggle */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  {isDarkMode ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('nav.dark_mode')}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-all cursor-pointer shadow-xs"
                  aria-label="Toggle Theme"
                >
                  {isDarkMode ? t('nav.active') : t('nav.inactive')}
                </button>
              </div>

              {/* Mobile Language Selector */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-teal-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('nav.language')} (Language)</span>
                </div>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setLanguage('id')}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                      language === 'id'
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🇮🇩 IND
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                      language === 'en'
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🇺🇸 ENG
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ja')}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                      language === 'ja'
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🇯🇵 JAP
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('zh')}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-black transition-all cursor-pointer shadow-xs ${
                      language === 'zh'
                        ? 'bg-teal-600 border-teal-600 text-white'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    🇨🇳 CHI
                  </button>
                </div>
              </div>

              {/* Mobile Reminder Toggle */}
              <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Reminder Investasi</span>
                </div>
                <button
                  type="button"
                  onClick={() => toast.success("Pengingat investasi harian telah diaktifkan.")}
                  className="px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-800 text-[10px] font-black text-teal-600 dark:text-teal-400 hover:bg-teal-100 transition-all cursor-pointer shadow-xs"
                >
                  AKTIFKAN
                </button>
              </div>

              {user ? (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-teal-50 to-teal-100/20 dark:from-slate-950 dark:to-slate-900/40 border border-teal-100/50 dark:border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg overflow-hidden shadow-inner shrink-0">
                        {renderLayoutAvatar(user.avatar)}
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-none mb-1">{user.fullName}</p>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wider">{user.literacyLevel}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 bg-teal-500/10 dark:bg-teal-950/80 text-teal-700 dark:text-teal-300 text-[10px] font-black rounded-lg border border-teal-500/20 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-teal-500 fill-current" /> {user.xp} XP
                    </span>
                  </div>
                  
                  <Link 
                    to="/belajar" 
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full py-3 text-xs font-black bg-teal-600 text-white rounded-xl hover:bg-teal-700 flex items-center justify-center gap-2 shadow-md shadow-teal-600/15"
                  >
                    <BookOpen className="w-4 h-4" /> {t('nav.my_learning_room')}
                  </Link>
                  
                  <button 
                    onClick={() => { logout(); setIsMenuOpen(false); navigate('/'); }}
                    className="w-full py-3 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-950/40 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> {t('nav.exit')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button 
                    onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                    className="py-3 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
                  >
                    {t('nav.login')}
                  </button>
                  <button 
                    onClick={() => { setIsMenuOpen(false); navigate('/login'); }}
                    className="py-3 text-xs font-black bg-teal-600 text-white rounded-xl hover:bg-teal-500 flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-teal-600/15"
                  >
                    <BookOpen className="w-4 h-4" /> {t('nav.start')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Bottom Navigation Bar - Superb UX for Mobile Phones */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200/80 dark:border-slate-800/80 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 z-40 flex justify-around items-center shadow-lg shadow-slate-900/20">
        <Link 
          to="/" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all ${
            location.pathname === '/' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Beranda</span>
        </Link>
        <Link 
          to="/simulasi" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all relative ${
            location.pathname === '/simulasi' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Activity className="w-5 h-5 text-emerald-500" />
          <span className="text-[9px] font-bold tracking-tight">Simulasi</span>
        </Link>
        <Link 
          to="/belajar" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all ${
            location.pathname === '/belajar' || location.pathname === '/features'
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Belajar</span>
        </Link>
        <Link 
          to="/ai-advisor" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all ${
            location.pathname === '/ai-advisor' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Bot className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">AI Advisor</span>
        </Link>
        <Link 
          to="/portfolio" 
          className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-xl transition-all ${
            location.pathname === '/portfolio' 
              ? 'text-teal-600 dark:text-teal-400 font-extrabold' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <PieChart className="w-5 h-5" />
          <span className="text-[9px] font-bold tracking-tight">Portofolio</span>
        </Link>
      </div>

      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop overlay with fine blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-slate-900/40 dark:bg-black/75 backdrop-blur-xs"
            />

            {/* Modal Box wrapper */}
            <div className="min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: 15 }}
                transition={{ type: "spring", duration: 0.3, bounce: 0.1 }}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden mt-6 md:mt-12 flex flex-col md:flex-row h-[85vh] md:h-[550px] max-h-[85vh] relative z-50"
              >
                {/* Left Side: Search list */}
                <div className="w-full md:w-3/5 p-4 sm:p-5 flex flex-col h-full border-r border-slate-100 dark:border-slate-800/80">
                  {/* Search input field */}
                  <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-850 border border-slate-200/65 dark:border-slate-800 px-3.5 py-3 rounded-xl mb-4 group focus-within:border-teal-500/50 dark:focus-within:border-teal-400/50 focus-within:bg-white dark:focus-within:bg-slate-950 transition-all duration-200">
                    <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 group-focus-within:text-teal-600 dark:group-focus-within:text-teal-400 transition-colors" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Cari materi kuis, reksa dana, paylater..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="bg-transparent text-xs sm:text-sm outline-none border-none w-full text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-550 font-medium"
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
                      >
                        Hapus
                      </button>
                    )}
                  </div>

                  {/* Navigation Tabs (Pill Buttons) */}
                  <div className="flex items-center gap-1 pb-3 border-b border-slate-100 dark:border-slate-800 overflow-x-auto scrollbar-none shrink-0">
                    {[
                      { id: 'all', label: 'Semua', icon: Compass },
                      { id: 'kamus', label: 'Kamus Finansial', icon: FileText },
                      { id: 'modul', label: 'Modul Belajar', icon: BookOpen },
                      { id: 'tools', label: 'Fitur & Tools', icon: Activity },
                      { id: 'komunitas', label: 'Komunitas', icon: MessageSquare }
                    ].map((cat) => {
                      const Icon = cat.icon;
                      const isActive = searchCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSearchCategory(cat.id as any)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] sm:text-[11px] font-bold rounded-lg whitespace-nowrap cursor-pointer transition-all ${
                            isActive
                              ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                              : 'bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-150/60 dark:hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3 h-3 opacity-80" />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Filtered Results */}
                  <div className="flex-1 overflow-y-auto pt-3 space-y-1 pr-1">
                    {filteredSearchItems.length > 0 ? (
                      filteredSearchItems.map((item, idx) => {
                        const isSelected = idx === selectedIdx;
                        return (
                          <div
                            key={item.id}
                            onMouseEnter={() => setSelectedIdx(idx)}
                            onClick={() => handleSelectItem(item)}
                            className={`flex items-start justify-between p-3 rounded-xl cursor-pointer transition-all ${
                              isSelected
                                ? 'bg-teal-500/10 dark:bg-teal-950/20 border-l-3 border-teal-500 dark:border-teal-400 pl-2.5'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-850/40 border-l-3 border-transparent'
                            }`}
                          >
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
                                  item.category === 'Kamus Finansial'
                                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                    : item.category === 'Modul Belajar'
                                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                    : item.category === 'Fitur & Tools'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                    : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                  {item.category}
                                </span>
                                <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate leading-none">
                                  {item.title}
                                </h4>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                                {item.desc}
                              </p>
                            </div>
                            <div className="shrink-0 flex items-center self-center text-slate-400 dark:text-slate-600">
                              <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'translate-x-0.5 text-teal-600 dark:text-teal-400' : ''}`} />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <HelpIcon className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-800 animate-bounce mb-3" />
                        <p className="text-sm font-bold">Materi atau istilah tidak ditemukan</p>
                        <p className="text-xs max-w-xs mx-auto text-slate-400 dark:text-slate-500 mt-1">
                          Coba gunakan kata kunci lain seperti <span className="font-semibold text-teal-600 dark:text-teal-455">reksadana</span>, <span className="font-semibold text-teal-600 dark:text-teal-455">paylater</span>, atau <span className="font-semibold text-teal-600 dark:text-teal-455">saham</span>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Shortcuts Footer */}
                  <div className="shrink-0 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    <div className="flex items-center gap-3">
                      <span>↑↓ Pilih</span>
                      <span>↵ Buka</span>
                    </div>
                    <span>ESC Tutup</span>
                  </div>
                </div>

                {/* Right Side: Instant detail display (Desktop only) */}
                <div className="hidden md:flex md:w-2/5 p-5 bg-slate-50/50 dark:bg-slate-900/40 flex-col justify-between overflow-y-auto">
                  {filteredSearchItems[selectedIdx] ? (
                    <div className="space-y-4 flex flex-col justify-between h-full">
                      <div className="space-y-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest ${
                          filteredSearchItems[selectedIdx].category === 'Kamus Finansial'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25'
                            : filteredSearchItems[selectedIdx].category === 'Modul Belajar'
                            ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/25'
                            : filteredSearchItems[selectedIdx].category === 'Fitur & Tools'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25'
                            : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25'
                        }`}>
                          Pratinjau {filteredSearchItems[selectedIdx].category}
                        </span>

                        <h3 className="text-base font-black text-slate-850 dark:text-slate-100 tracking-tight leading-tight">
                          {filteredSearchItems[selectedIdx].title}
                        </h3>

                        <div className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed space-y-2">
                          <p className="font-extrabold text-slate-800 dark:text-slate-350">Pengertian Singkat:</p>
                          <p className="bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-xs">
                            {filteredSearchItems[selectedIdx].desc}
                          </p>
                          {filteredSearchItems[selectedIdx].details && (
                            <>
                              <p className="font-extrabold text-slate-800 dark:text-slate-355 mt-2">Penjelasan Mendalam:</p>
                              <p className="text-slate-500 dark:text-slate-400">{filteredSearchItems[selectedIdx].details}</p>
                            </>
                          )}
                        </div>

                        {filteredSearchItems[selectedIdx].tip && (
                          <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 dark:border-rose-900/30 p-3.5 rounded-xl">
                            <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest mb-1">
                              <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                              <span>⚠️ TIPS LITERASI / ANTI-RUGI</span>
                            </div>
                            <p className="text-[11px] text-rose-700 dark:text-rose-400 font-bold leading-relaxed">
                              {filteredSearchItems[selectedIdx].tip}
                            </p>
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectItem(filteredSearchItems[selectedIdx])}
                        className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs py-3 rounded-xl transition-all shadow-md shadow-teal-600/10 flex items-center justify-center gap-2 group cursor-pointer border-t border-teal-500/20"
                      >
                        <span>Pelajari Selengkapnya</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 dark:text-slate-500 py-10">
                      <Compass className="w-10 h-10 text-slate-300 dark:text-slate-850 animate-spin mb-2" />
                      <p className="text-xs font-bold">Sorot materi untuk melihat pratinjau instan di sini.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <OnboardingModal />

      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex-1 flex flex-col"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 pt-16 pb-24 md:pb-8 border-t border-slate-100 dark:border-slate-800/80 transition-colors duration-355">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Logo className="w-9 h-9 shrink-0 drop-shadow-sm" />
                <span className="font-extrabold text-2xl tracking-tight text-slate-800 dark:text-slate-100">SI<span className="text-teal-600 italic font-medium">KAYA</span></span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xs mb-4">
                SiKaya adalah inisiatif literasi finansial yang didedikasikan untuk membekali Generasi Z Indonesia dengan pengetahuan manajemen keuangan dan simulasi investasi yang realistis.
              </p>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-400 text-[10px] font-bold rounded border border-teal-100 dark:border-teal-900/50">100% EDUKASI</span>
                <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-450 text-[10px] font-bold rounded border border-slate-200 dark:border-slate-700">NON-PROFIT</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Materi Belajar</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li><Link to="/belajar" state={{ activeModuleId: 'budgeting' }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Dasar Manajemen Uang</Link></li>
                <li><Link to="/belajar" state={{ activeModuleId: 'reksadana' }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Reksa Dana 101</Link></li>
                <li><Link to="/belajar" state={{ activeModuleId: 'saham' }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Pengantar Pasar Saham</Link></li>
                <li><Link to="/belajar" state={{ activeModuleId: 'debt' }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Psikologi & Kelola Utang</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Fitur & Komunitas</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li><Link to="/community" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Forum Diskusi Gen Z</Link></li>
                <li><Link to="/simulasi" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Virtual Trading Simulator</Link></li>
                <li><Link to="/belajar" state={{ showGlossary: true }} className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Glosarium Investasi</Link></li>
                <li><Link to="/features" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Kalkulator Finansial</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Eksplorasi App</h4>
              <ul className="space-y-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <li><Link to="/ai-advisor" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">AI Financial Advisor</Link></li>
                <li><Link to="/life-simulator" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Simulasi Hidup Finansial</Link></li>
                <li><Link to="/portfolio" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Portfolio & Net Worth</Link></li>
                <li><Link to="/leaderboard" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Papan Peringkat Investor</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
            <p className="text-center md:text-left">
              © 2026 SIKAYA LITERASI FINANSIAL. DIBUAT UNTUK EDUKASI.
            </p>
            <p className="max-w-xl text-center md:text-right leading-relaxed font-semibold text-rose-500">
              DISCLAIMER: SIKAYA BUKANLAH APLIKASI TRADING ATAU BROKER. SELURUH DATA PASAR DAN PORTOFOLIO DI SINI HANYA UNTUK TUJUAN SIMULASI DAN EDUKASI.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
