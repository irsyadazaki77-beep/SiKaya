import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Medal, 
  Star, 
  Flame, 
  Crown, 
  ChevronUp, 
  ChevronDown, 
  Minus, 
  Target, 
  CheckCircle2, 
  Award, 
  Zap, 
  BookOpen,
  Search,
  User,
  Gift,
  ShoppingBag,
  Sparkles,
  Smile,
  RefreshCw,
  ChevronRight,
  Lock,
  Play,
  HelpCircle,
  TrendingUp,
  Check,
  Camera,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/PageHeader';
import confetti from 'canvas-confetti';

interface Player {
  name: string;
  xp: number;
  avatar: string;
  level: string;
  title: string;
  isCurrentUser?: boolean;
  change?: 'up' | 'down' | 'same';
}

interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const renderAvatarContent = (avatar: string, fallback: string = '🦊') => {
  const currentAvatar = avatar || fallback;
  if (currentAvatar.startsWith('data:image/') || currentAvatar.startsWith('http') || currentAvatar.includes('/')) {
    return <img src={currentAvatar} alt="Avatar" className="w-full h-full object-cover rounded-full" referrerPolicy="no-referrer" />;
  }
  return <span>{currentAvatar}</span>;
};

export function LeaderboardPage() {
  const { user, addXp, updateProfile } = useAuth();
  const { toast } = useToast();
  
  // Tab states
  const [activeTab, setActiveTab] = useState<'peringkat' | 'misi' | 'pencapaian' | 'toko'>('peringkat');
  
  // Leaderboard filters
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'semua' | 'mingguan' | 'harian'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('Semua');

  // Claimed state from localStorage
  const [claimedMissions, setClaimedMissions] = useState<number[]>([]);
  const [claimedChest, setClaimedChest] = useState<boolean>(false);
  
  // Trivia challenge states
  const [triviaIndex, setTriviaIndex] = useState<number>(0);
  const [selectedTriviaOption, setSelectedTriviaOption] = useState<number | null>(null);
  const [triviaAnswered, setTriviaAnswered] = useState<boolean>(false);
  const [triviaIsCorrect, setTriviaIsCorrect] = useState<boolean | null>(null);

  // Shop states
  const [unlockedAvatars, setUnlockedAvatars] = useState<string[]>(['🦊', '😎', '🤠', '👩‍💼', '👨‍🎓', '🧕']);
  const [unlockedTitles, setUnlockedTitles] = useState<string[]>(['Investor Pemula 🎓', 'Pejuang Rupiah 💸']);
  const [selectedTitle, setSelectedTitle] = useState<string>('Investor Pemula 🎓');

  // Profile customization modal/edit states
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');

  // Camera Profile Photo states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Daily missions database
  const dailyMissions = [
    { id: 1, title: 'Kunjungan Harian', desc: 'Sapa warga SiKaya hari ini dengan membuka aplikasi.', xp: 20, done: true },
    { id: 2, title: 'Menyelesaikan Modul', desc: 'Baca dan tuntaskan setidaknya 1 modul di Kelas Belajar.', xp: 50, done: (user?.completedModules?.length || 0) > 0 },
    { id: 3, title: 'Simulasi Keuangan Perdana', desc: 'Investasikan modal awalmu pada portofolio virtual.', xp: 40, done: true }, // Defaults to completed for fun engagement
    { id: 4, title: 'Tanya Jawab AI Advisor', desc: 'Diskusikan rencana keuanganmu bersama AI Advisor pintar.', xp: 30, done: true },
  ];

  // Achievements database
  const achievements = [
    { id: 1, title: 'Langkah Pertama', desc: 'Selesaikan modul belajar pertama.', icon: <Star className="w-6 h-6 text-amber-500" />, unlocked: (user?.completedModules?.length || 0) >= 1 },
    { id: 2, title: 'Investor Virtual', desc: 'Beli aset pertama Anda di Portofolio Virtual.', icon: <Zap className="w-6 h-6 text-blue-500" />, unlocked: true },
    { id: 3, title: 'Kutu Buku Finansial', desc: 'Selesaikan 5 modul kelas.', icon: <BookOpen className="w-6 h-6 text-emerald-500" />, unlocked: (user?.completedModules?.length || 0) >= 5 },
    { id: 4, title: 'Suhu Finansial', desc: 'Capai level Master (di atas 6,000 XP).', icon: <Crown className="w-6 h-6 text-purple-500" />, unlocked: (user?.xp || 0) >= 6000 },
  ];

  // Trivia questions bank
  const triviaQuestions: TriviaQuestion[] = [
    {
      question: "Manakah instrumen investasi dengan risiko paling rendah namun tetap menawarkan imbal hasil di atas tingkat inflasi?",
      options: [
        "Saham gorengan harian",
        "Surat Berharga Negara (SBN) / Obligasi Pemerintah",
        "Deposito bank konvensional jangka panjang",
        "Aset Kripto berkapitalisasi pasar kecil (Memecoin)"
      ],
      correctIndex: 1,
      explanation: "Surat Berharga Negara (SBN) dijamin penuh oleh undang-undang sehingga risikonya mendekati nol, dengan imbal hasil yang cenderung stabil dan sering kali berada di atas rata-rata inflasi tahunan."
    },
    {
      question: "Apa yang dimaksud dengan formula 50/30/20 dalam metode penganggaran (budgeting)?",
      options: [
        "50% Investasi, 30% Kebutuhan, 20% Keinginan Pribadi",
        "50% Kebutuhan Pokok, 30% Keinginan Hiburan, 20% Tabungan & Investasi",
        "50% Cicilan Utang, 30% Belanja Bulanan, 20% Dana Darurat",
        "50% Belanja, 30% Tabungan Umroh, 20% Biaya Transportasi"
      ],
      correctIndex: 1,
      explanation: "Dipopulerkan oleh Senator Elizabeth Warren, formula 50/30/20 membagi pendapatan bersih menjadi 50% untuk kebutuhan pokok, 30% untuk keinginan gaya hidup, dan 20% untuk masa depan berupa tabungan atau investasi."
    },
    {
      question: "Mengapa inflasi sering disebut sebagai 'pencuri tak terlihat' bagi dana tunai yang disimpan di bawah kasur?",
      options: [
        "Karena uang tunai rawan dicuri oleh pencuri fisik",
        "Karena daya beli uang riil menyusut seiring naiknya harga barang",
        "Karena nilai nominal angka pada lembaran kertas uang menyusut",
        "Karena ada potongan biaya administrasi bulanan non-bank"
      ],
      correctIndex: 1,
      explanation: "Inflasi meningkatkan harga barang secara umum dari tahun ke tahun. Jika uang Anda hanya diam tanpa berputar di instrumen investasi, daya beli uang tersebut akan turun drastis meskipun jumlah fisiknya tetap."
    }
  ];

  // Shop items inventory
  const shopAvatars = [
    { emoji: '🐉', name: 'Naga Emas Kuat', cost: 200 },
    { emoji: '🦉', name: 'Burung Hantu Bijak', cost: 150 },
    { emoji: '🦁', name: 'Singa Bullish', cost: 120 },
    { emoji: '🤖', name: 'Robot Algoritma', cost: 100 },
    { emoji: '🦄', name: 'Unikorn Unicorn', cost: 130 },
    { emoji: '🐋', name: 'Paus Finansial (Whale)', cost: 250 }
  ];

  const shopTitles = [
    { title: 'Sultan Cuan 💎', desc: 'Gelar bangsawan dengan likuiditas tinggi', cost: 300 },
    { title: 'Pawang Inflasi 🛡️', desc: 'Kebal terhadap devaluasi nilai mata uang', cost: 180 },
    { title: 'Penakluk IHSG 📈', desc: 'Dapat menebak arah support dan resistance', cost: 200 },
    { title: 'GigaChad Saham 🦾', desc: 'Pemegang saham mayoritas yang kokoh', cost: 250 },
    { title: 'Pencari Dividen 👑', desc: 'Pecinta passive income jangka panjang', cost: 150 }
  ];

  // Helper for computing level tiers
  const getLevelTier = (xp: number) => {
    if (xp >= 10000) return 'Grandmaster';
    if (xp >= 6000) return 'Master';
    if (xp >= 3000) return 'Diamond';
    if (xp >= 1000) return 'Platinum';
    return 'Gold';
  };

  // Helper for computing level tier color classes
  const getTierColorClass = (level: string) => {
    switch(level) {
      case 'Grandmaster': return 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Master': return 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'Diamond': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Platinum': return 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300 border-teal-200 dark:border-teal-800';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  // Load from localStorage
  useEffect(() => {
    const savedMissions = localStorage.getItem('sikaya_claimed_missions');
    if (savedMissions) {
      try { setClaimedMissions(JSON.parse(savedMissions)); } catch(e) {}
    }

    const savedChest = localStorage.getItem('sikaya_claimed_chest');
    if (savedChest === 'true') setClaimedChest(true);

    const savedTriviaAns = localStorage.getItem('sikaya_trivia_answered');
    if (savedTriviaAns === 'true') {
      setTriviaAnswered(true);
      const correct = localStorage.getItem('sikaya_trivia_correct');
      setTriviaIsCorrect(correct === 'true');
      const idx = localStorage.getItem('sikaya_trivia_index');
      if (idx) setTriviaIndex(parseInt(idx));
      const chosen = localStorage.getItem('sikaya_trivia_chosen');
      if (chosen) setSelectedTriviaOption(parseInt(chosen));
    } else {
      // Pick a trivia question of the day based on date
      const day = new Date().getDate();
      setTriviaIndex(day % triviaQuestions.length);
    }

    const savedAvatars = localStorage.getItem('sikaya_unlocked_avatars');
    if (savedAvatars) {
      try { setUnlockedAvatars(JSON.parse(savedAvatars)); } catch(e) {}
    }

    const savedTitles = localStorage.getItem('sikaya_unlocked_titles');
    if (savedTitles) {
      try { setUnlockedTitles(JSON.parse(savedTitles)); } catch(e) {}
    }

    const savedSelTitle = localStorage.getItem('sikaya_selected_title');
    if (savedSelTitle) setSelectedTitle(savedSelTitle);
  }, []);

  // Save states
  const saveClaimedMissions = (updated: number[]) => {
    setClaimedMissions(updated);
    localStorage.setItem('sikaya_claimed_missions', JSON.stringify(updated));
  };

  const saveUnlockedAvatars = (updated: string[]) => {
    setUnlockedAvatars(updated);
    localStorage.setItem('sikaya_unlocked_avatars', JSON.stringify(updated));
  };

  const saveUnlockedTitles = (updated: string[]) => {
    setUnlockedTitles(updated);
    localStorage.setItem('sikaya_unlocked_titles', JSON.stringify(updated));
  };

  // Initial peer players database
  const basePlayers: Player[] = [
    { name: "Reza Rahadian", xp: 12500, avatar: "👑", level: "Grandmaster", title: "Sultan Dividen 👑", change: "up" },
    { name: "Dian Sastro", xp: 11200, avatar: "👩‍💼", level: "Grandmaster", title: "Pawang Inflasi 🛡️", change: "same" },
    { name: "Iqbaal Ramadhan", xp: 10800, avatar: "👨‍🎓", level: "Grandmaster", title: "GigaChad Saham 🦾", change: "up" },
    { name: "Chelsea Islan", xp: 9500, avatar: "👩‍🎨", level: "Master", title: "Pencari Dividen 👑", change: "down" },
    { name: "Joe Taslim", xp: 9200, avatar: "🥷", level: "Master", title: "Penakluk IHSG 📈", change: "up" },
    { name: "Maudy Ayunda", xp: 7900, avatar: "👩‍🏫", level: "Master", title: "Guru Keuangan 🧠", change: "down" },
    { name: "Pevita Pearce", xp: 6200, avatar: "🧚‍♀️", level: "Master", title: "Pejuang Rupiah 💸", change: "up" },
    { name: "Ariel Noah", xp: 4800, avatar: "🎤", level: "Diamond", title: "Investor Pemula 🎓", change: "same" },
    { name: "Nicholas Saputra", xp: 3400, avatar: "🕶️", level: "Diamond", title: "Investor Pemula 🎓", change: "down" },
  ];

  // Dynamically assemble leaderboard with the current user inserted & sorted
  const currentUserXp = user?.xp ?? 150;
  const currentLevel = getLevelTier(currentUserXp);
  
  const currentUserObj: Player = {
    name: user?.fullName || "Siswa Tamu (Demo)",
    xp: currentUserXp,
    avatar: user?.avatar || "🦊",
    level: currentLevel,
    title: selectedTitle,
    isCurrentUser: true,
    change: "up"
  };

  const fullPlayersList: Player[] = [...basePlayers, currentUserObj];
  
  // Sort players descending based on XP
  const sortedLeaderboard = [...fullPlayersList].sort((a, b) => b.xp - a.xp);

  // Assign ranks
  const rankedLeaderboard = sortedLeaderboard.map((player, idx) => ({
    ...player,
    rank: idx + 1
  }));

  // Find user's current rank
  const userRankIndex = rankedLeaderboard.findIndex(p => p.isCurrentUser);
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : rankedLeaderboard.length;

  // Next player on top of the user
  const nextPlayerAbove = userRankIndex > 0 ? rankedLeaderboard[userRankIndex - 1] : null;
  const xpNeededToOvertake = nextPlayerAbove ? (nextPlayerAbove.xp - currentUserXp + 50) : 0;

  // Filtered leaderboard list based on search and selected tier filter
  const filteredLeaderboard = rankedLeaderboard.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          player.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = selectedTierFilter === 'Semua' ? true : player.level === selectedTierFilter;
    return matchesSearch && matchesTier;
  });

  // Handle claiming mission
  const handleClaimMission = (id: number, xp: number) => {
    if (claimedMissions.includes(id)) return;
    const updated = [...claimedMissions, id];
    saveClaimedMissions(updated);
    addXp(xp);
    
    // Confetti blast
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });

    toast.success(`Selamat! Misi berhasil diklaim. +${xp} XP telah ditambahkan ke profil Anda! 🎉`);
  };

  // Handle claiming all available completed missions
  const handleClaimAllMissions = () => {
    const unclaimedCompleted = dailyMissions.filter(m => m.done && !claimedMissions.includes(m.id));
    if (unclaimedCompleted.length === 0) {
      toast.info("Tidak ada misi selesai yang tersisa untuk diklaim saat ini!");
      return;
    }

    let totalXpGained = 0;
    const newClaimed = [...claimedMissions];
    unclaimedCompleted.forEach(m => {
      newClaimed.push(m.id);
      totalXpGained += m.xp;
    });

    saveClaimedMissions(newClaimed);
    addXp(totalXpGained);

    // Dynamic firework confetti
    const duration = 2 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    toast.success(`Luar biasa! Seluruh misi terselesaikan telah diklaim. +${totalXpGained} XP berhasil dikumpulkan! 🔥`);
  };

  // Claim Chest
  const handleClaimChest = () => {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    if (unlockedCount < 3) {
      toast.error("Maaf, Anda harus membuka minimal 3 pencapaian untuk membuka Peti Harta Karun!");
      return;
    }
    if (claimedChest) return;

    setClaimedChest(true);
    localStorage.setItem('sikaya_claimed_chest', 'true');
    addXp(150);

    // Big confetti burst
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    toast.success("Hooray! Anda membuka Peti Legendaris! +150 XP telah ditambahkan! 🎁🏆");
  };

  // Submit Trivia Answer
  const handleTriviaAnswer = (optionIdx: number) => {
    if (triviaAnswered) return;
    
    setSelectedTriviaOption(optionIdx);
    const correct = optionIdx === triviaQuestions[triviaIndex].correctIndex;
    setTriviaIsCorrect(correct);
    setTriviaAnswered(true);

    localStorage.setItem('sikaya_trivia_answered', 'true');
    localStorage.setItem('sikaya_trivia_correct', correct ? 'true' : 'false');
    localStorage.setItem('sikaya_trivia_index', triviaIndex.toString());
    localStorage.setItem('sikaya_trivia_chosen', optionIdx.toString());

    if (correct) {
      addXp(50);
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.8 }
      });
      toast.success("Jawaban Anda Benar! Anda mendapatkan +50 XP! 🧠💡");
    } else {
      toast.error("Sayang sekali, jawaban Anda kurang tepat. Baca penjelasan untuk belajar ya!");
    }
  };

  // Reset trivia for testing/learning
  const handleNextTrivia = () => {
    const nextIdx = (triviaIndex + 1) % triviaQuestions.length;
    setTriviaIndex(nextIdx);
    setTriviaAnswered(false);
    setTriviaIsCorrect(null);
    setSelectedTriviaOption(null);
    
    localStorage.removeItem('sikaya_trivia_answered');
    localStorage.removeItem('sikaya_trivia_correct');
    localStorage.removeItem('sikaya_trivia_chosen');
    localStorage.setItem('sikaya_trivia_index', nextIdx.toString());
    toast.info("Tantangan trivia finansial diperbarui! Ayo asah otakmu.");
  };

  // Purchase avatar in Shop
  const handleBuyAvatar = (emoji: string, cost: number) => {
    if (unlockedAvatars.includes(emoji)) {
      toast.info(`Anda sudah memiliki avatar ${emoji}`);
      return;
    }
    if (currentUserXp < cost) {
      toast.error(`Koin XP tidak mencukupi! Anda butuh ${cost} XP, namun saat ini hanya memiliki ${currentUserXp} XP.`);
      return;
    }

    addXp(-cost);
    const updated = [...unlockedAvatars, emoji];
    saveUnlockedAvatars(updated);
    toast.success(`Pembelian Berhasil! Avatar '${emoji}' telah terbuka dan siap digunakan! 🛒✨`);
  };

  // Purchase title in Shop
  const handleBuyTitle = (title: string, cost: number) => {
    if (unlockedTitles.includes(title)) {
      toast.info(`Anda sudah memiliki gelar '${title}'`);
      return;
    }
    if (currentUserXp < cost) {
      toast.error(`Koin XP tidak mencukupi! Anda butuh ${cost} XP.`);
      return;
    }

    addXp(-cost);
    const updated = [...unlockedTitles, title];
    saveUnlockedTitles(updated);
    toast.success(`Pembelian Berhasil! Gelar '${title}' kini tersemat di lemari lencanamu! 🏆✨`);
  };

  // Apply customized profile settings
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("Nama kontributor tidak boleh kosong!");
      return;
    }

    try {
      await updateProfile(editName.trim(), editAvatar);
      closeProfileEditor();
      toast.success("Profil Anda berhasil disinkronkan ke dalam Hub Papan Peringkat!");
      
      confetti({
        particleCount: 40,
        spread: 40,
        origin: { y: 0.9 }
      });
    } catch (err) {
      toast.error("Gagal menyinkronkan profil ke server.");
    }
  };

  // Open profile editor preset values
  const openProfileEditor = () => {
    setEditName(user?.fullName || "Siswa Tamu (Demo)");
    setEditAvatar(user?.avatar || "🦊");
    setIsEditingProfile(true);
  };

  const closeProfileEditor = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
    setIsEditingProfile(false);
  };

  // Start Camera Stream
  const startCamera = async () => {
    setIsCameraActive(true);
    setCameraError(null);
    try {
      // Small timeout to let elements render before assigning stream
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 320, facingMode: 'user' } 
      });
      setCameraStream(stream);
      // Wait slightly or trigger on stream set
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error("Error playing video:", e));
        }
      }, 100);
    } catch (err: any) {
      console.error("Gagal membuka kamera:", err);
      setCameraError("Izin kamera ditolak atau perangkat kamera tidak ditemukan.");
      setIsCameraActive(false);
      toast.error("Gagal mengakses kamera.");
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture image from video ref onto a canvas
  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw frame
        ctx.drawImage(videoRef.current, 0, 0, 300, 300);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setEditAvatar(dataUrl);
        stopCamera();
        toast.success("Foto berhasil diambil! 📸");
      }
    }
  };

  // Quick select newly unlocked title
  const handleSelectTitle = (title: string) => {
    setSelectedTitle(title);
    localStorage.setItem('sikaya_selected_title', title);
    toast.success(`Gelar aktif diset ke: "${title}"`);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Page Header */}
        <PageHeader
          category="Komunitas"
          title="Papan Skor & Arena Gamifikasi"
          description="Tingkatkan keterampilan keuangan Anda, tuntaskan misi harian, kumpulkan lencana langka, dan bersainglah dengan ribuan siswa dari seluruh Nusantara."
          badge="ARENA INVESTOR"
        />

        {/* Dynamic Bento Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento Card 1: User Profile & Rank Level status */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-xs relative overflow-hidden flex flex-col justify-between">
            
            {/* Background absolute decorations */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-indigo-500/5 to-teal-500/5 rounded-full blur-3xl -z-10" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="relative group">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-400 to-rose-500 p-1 shadow-md">
                    <div className="w-full h-full rounded-full bg-white dark:bg-slate-950 flex items-center justify-center text-3xl sm:text-4xl shadow-inner overflow-hidden">
                      {renderAvatarContent(user?.avatar || '🦊')}
                    </div>
                  </div>
                  <button 
                    onClick={openProfileEditor}
                    className="absolute -bottom-1 -right-1 bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded-full shadow-md border-2 border-white dark:border-slate-900 transition-transform hover:scale-110 cursor-pointer"
                    title="Ubah Profil & Avatar"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">{user?.fullName || "Siswa Tamu (Demo)"}</h2>
                    <span className="text-[10px] font-black bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-2 py-0.5 rounded-md uppercase font-mono">
                      Level {Math.floor(currentUserXp / 1000) + 1}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono mt-0.5">{selectedTitle}</p>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-indigo-500" /> Kelas Liga: 
                    <span className={`px-1.5 py-0.2 rounded font-black border ${getTierColorClass(currentLevel)}`}>
                      {currentLevel}
                    </span>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Peringkat Anda</p>
                <p className="text-3xl font-black text-slate-900 dark:text-white font-mono flex items-center sm:justify-end gap-1">
                  <span className="text-amber-500 font-sans">#</span>{userRank}
                </p>
                <p className="text-[10px] font-semibold text-slate-400 mt-0.5">Dari total 10 investor kelas</p>
              </div>
            </div>

            {/* XP Progress Bar Slider */}
            <div className="pt-5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-500">Progress Laju Level</span>
                <span className="font-black font-mono text-slate-800 dark:text-white">
                  {currentUserXp % 1000} / 1000 <span className="text-[10px] text-slate-400">XP</span>
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200/40 dark:border-slate-800">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentUserXp % 1000) / 10}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-teal-400 via-indigo-500 to-rose-500 rounded-full"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>LV. {Math.floor(currentUserXp / 1000) + 1} ({currentLevel})</span>
                <span>LV. {Math.floor(currentUserXp / 1000) + 2} ({getLevelTier(currentUserXp + 1000)})</span>
              </div>
            </div>

            {/* Overtake tracker banner */}
            {nextPlayerAbove && (
              <div className="mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-350">
                  <TrendingUp className="w-4 h-4 text-indigo-500" />
                  <span>
                    Butuh <strong className="text-indigo-600 dark:text-indigo-400 font-mono font-black">+{xpNeededToOvertake} XP</strong> lagi untuk menyalip <strong className="text-slate-900 dark:text-white">@{nextPlayerAbove.name}</strong> di peringkat {nextPlayerAbove.rank}!
                  </span>
                </div>
                <button 
                  onClick={() => setActiveTab('misi')}
                  className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:underline uppercase flex items-center gap-0.5 cursor-pointer"
                >
                  Kejar XP <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}

          </div>

          {/* Bento Card 2: Quick Daily Trivia Quiz Challenge of the Day */}
          <div className="md:col-span-4 bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 border border-slate-850 shadow-md flex flex-col justify-between relative overflow-hidden">
            
            {/* Absolute badge decor */}
            <div className="absolute -top-3 -right-3 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl" />
            
            <div>
              <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest font-mono text-indigo-200">Kuis Pengetahuan</span>
                </div>
                <span className="bg-amber-400 text-slate-950 text-[8px] font-black font-mono px-1.5 py-0.5 rounded-full">+50 XP</span>
              </div>
              
              <p className="text-xs font-black text-white/95 leading-relaxed mb-4">
                {triviaQuestions[triviaIndex].question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {triviaQuestions[triviaIndex].options.map((opt, oIdx) => {
                  const isSelected = selectedTriviaOption === oIdx;
                  let btnStyle = "bg-white/5 hover:bg-white/10 border-white/10 text-white/90";
                  
                  if (triviaAnswered) {
                    if (oIdx === triviaQuestions[triviaIndex].correctIndex) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                    } else if (isSelected) {
                      btnStyle = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                    } else {
                      btnStyle = "bg-white/5 border-white/5 opacity-50 text-white/60";
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      disabled={triviaAnswered}
                      onClick={() => handleTriviaAnswer(oIdx)}
                      className={`w-full text-left p-2.5 rounded-xl border text-[11px] font-bold transition-all leading-tight flex items-center justify-between ${btnStyle} ${!triviaAnswered ? 'hover:scale-[1.01] cursor-pointer' : ''}`}
                    >
                      <span className="flex-1 pr-2">{opt}</span>
                      {triviaAnswered && oIdx === triviaQuestions[triviaIndex].correctIndex && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation box after answer */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-[10px]">
              {triviaAnswered ? (
                <div className="space-y-1 w-full text-white/80">
                  <p className="font-extrabold text-amber-300">💡 Penjelasan Finansial:</p>
                  <p className="text-[9px] leading-relaxed text-white/70 italic bg-white/5 p-2 rounded-lg">
                    {triviaQuestions[triviaIndex].explanation}
                  </p>
                  <button 
                    onClick={handleNextTrivia}
                    className="mt-1 text-[9px] font-black text-indigo-300 hover:text-white uppercase flex items-center gap-0.5 ml-auto cursor-pointer"
                  >
                    Kuis Lainnya <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-white/60 font-semibold font-mono">Buka wawasan barumu!</span>
                  <span className="font-bold text-indigo-300">Pilih salah satu opsi</span>
                </>
              )}
            </div>

          </div>

        </div>

        {/* Edit Profile Dialog Overlay Drawer / Modal */}
        <AnimatePresence>
          {isEditingProfile && (
            <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-850">
                  <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center gap-1.5">
                    <User className="w-5 h-5 text-indigo-600" /> Sesuaikan Jati Diri Investor
                  </h3>
                  <button 
                    onClick={closeProfileEditor}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold text-lg cursor-pointer"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">Nama Kontributor</label>
                    <input 
                      type="text"
                      placeholder="Masukkan nama samaran baru..."
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-black text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  {/* Camera Profile Capture Section */}
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">Foto Profil Anda</label>
                    
                    {/* Current Avatar Preview & Camera Trigger */}
                    <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5 shadow-md shrink-0">
                        <div className="w-full h-full bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-3xl overflow-hidden shadow-inner">
                          {renderAvatarContent(editAvatar)}
                        </div>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <h4 className="text-[10px] font-black text-slate-850 dark:text-slate-250 uppercase tracking-wider">Pratinjau Avatar</h4>
                        <div className="flex flex-wrap gap-2">
                          {!isCameraActive ? (
                            <button
                              type="button"
                              onClick={startCamera}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                            >
                              <Camera className="w-3.5 h-3.5" /> Ambil Foto Kamera
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={stopCamera}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all shadow-xs"
                            >
                              Tutup Kamera
                            </button>
                          )}

                          {editAvatar.startsWith('data:image') && (
                            <button
                              type="button"
                              onClick={() => setEditAvatar('🦊')}
                              className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-[9px] uppercase tracking-wider rounded-lg flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus Foto
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Camera View Window */}
                    {isCameraActive && (
                      <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 relative overflow-hidden flex flex-col items-center">
                        <div className="w-full aspect-square max-w-[240px] bg-slate-900 rounded-xl overflow-hidden relative border border-slate-800 flex items-center justify-center">
                          <video 
                            ref={videoRef} 
                            playsInline 
                            muted 
                            className="w-full h-full object-cover scale-x-[-1]" 
                          />
                          {cameraStream && (
                            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-slate-950/70 backdrop-blur-xs px-2 py-1 rounded-md">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              <span className="text-[8px] font-black font-mono text-white tracking-widest uppercase">Kamera Aktif</span>
                            </div>
                          )}
                          {cameraError && (
                            <p className="text-center text-[10px] text-rose-400 px-4 font-bold">{cameraError}</p>
                          )}
                        </div>
                        <div className="flex gap-2 w-full justify-center">
                          <button
                            type="button"
                            onClick={capturePhoto}
                            disabled={!cameraStream}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer transition-all flex items-center gap-1"
                          >
                            <Camera className="w-3.5 h-3.5" /> Tangkap Foto
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="px-4 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl cursor-pointer transition-all"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Avatar Picker Field */}
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">Atau Pilih Avatar Emojimu</label>
                    <div className="grid grid-cols-6 gap-2 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-150 dark:border-slate-850">
                      {unlockedAvatars.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => {
                            setEditAvatar(av);
                            stopCamera();
                          }}
                          className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${editAvatar === av ? 'bg-indigo-100 dark:bg-indigo-950/40 border-2 border-indigo-500 scale-110 shadow-sm' : 'bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title Picker preset Selection */}
                  {unlockedTitles.length > 0 && (
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono mb-1.5">Pilih Gelar Terbuka Anda</label>
                      <div className="flex flex-wrap gap-1.5">
                        {unlockedTitles.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => handleSelectTitle(t)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTitle === t ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-850'}`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Submit buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-850">
                    <button
                      type="button"
                      onClick={closeProfileEditor}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-indigo-600/25 cursor-pointer"
                    >
                      Terapkan Perubahan
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Dynamic Nav Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-px gap-2 overflow-x-auto">
          <div className="flex gap-2">
            {[
              { id: 'peringkat', label: 'Papan Peringkat', icon: <Trophy className="w-4 h-4" /> },
              { id: 'misi', label: 'Misi Harian', icon: <Target className="w-4 h-4" /> },
              { id: 'pencapaian', label: 'Lencana Pencapaian', icon: <Award className="w-4 h-4" /> },
              { id: 'toko', label: 'Toko XP & Gelar', icon: <ShoppingBag className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 font-black text-xs sm:text-sm border-b-2 tracking-wide transition-all uppercase flex items-center gap-2 shrink-0 cursor-pointer ${activeTab === tab.id ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'peringkat' && (
            <div className="flex gap-1 shrink-0">
              {['semua', 'mingguan', 'harian'].map((p) => (
                <button
                  key={p}
                  onClick={() => setLeaderboardPeriod(p as any)}
                  className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md transition-all cursor-pointer ${leaderboardPeriod === p ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold' : 'text-slate-450 hover:text-slate-700'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* TAB CONTENTS CONTAINER */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: PAPAN PERINGKAT */}
          {activeTab === 'peringkat' && (
            <div className="space-y-6">
              
              {/* Podium View for Top 3 */}
              <div className="flex items-end justify-center gap-2 sm:gap-6 pt-12 pb-6 max-w-xl mx-auto overflow-x-auto">
                
                {/* POSITION 2 (LEFT PODIUM) */}
                {rankedLeaderboard[1] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="flex flex-col items-center flex-1 min-w-[120px]"
                  >
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-200 dark:bg-slate-800 rounded-full border-4 border-slate-300/80 flex items-center justify-center text-3xl shadow-lg relative overflow-hidden">
                        {renderAvatarContent(rankedLeaderboard[1].avatar)}
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-slate-400 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs border-2 border-white dark:border-slate-900 z-10 shadow-md">
                        2
                      </div>
                    </div>
                    <div className="w-24 sm:w-28 h-28 bg-gradient-to-t from-slate-200/80 to-slate-100/30 dark:from-slate-800/80 dark:to-slate-800/10 rounded-t-2xl flex flex-col items-center pt-5 border-t-2 border-slate-300">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs text-center truncate w-full px-2">{rankedLeaderboard[1].name}</span>
                      <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 font-mono mt-1">{rankedLeaderboard[1].xp} XP</span>
                      <span className="text-[8px] font-bold text-slate-400 truncate max-w-full px-2 mt-0.5">{rankedLeaderboard[1].title}</span>
                    </div>
                  </motion.div>
                )}

                {/* POSITION 1 (CENTER PODIUM) */}
                {rankedLeaderboard[0] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center flex-1 min-w-[130px] -mt-6"
                  >
                    <div className="relative mb-2">
                      <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 w-8 h-8 text-amber-500 drop-shadow-md z-20 animate-bounce" />
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full border-4 border-amber-400 flex items-center justify-center text-4xl shadow-xl relative overflow-hidden">
                        {renderAvatarContent(rankedLeaderboard[0].avatar)}
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-amber-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-black text-xs border-2 border-white dark:border-slate-900 z-10 shadow-md">
                        1
                      </div>
                    </div>
                    <div className="w-28 sm:w-32 h-36 bg-gradient-to-t from-amber-200/40 to-amber-100/10 dark:from-amber-900/30 dark:to-amber-800/5 rounded-t-2xl flex flex-col items-center pt-6 border-t-2 border-amber-400">
                      <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm text-center truncate w-full px-2">{rankedLeaderboard[0].name}</span>
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono mt-1">{rankedLeaderboard[0].xp} XP</span>
                      <span className="text-[8px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-1.5 py-0.2 rounded-full truncate max-w-[90%] mt-1">{rankedLeaderboard[0].title}</span>
                    </div>
                  </motion.div>
                )}

                {/* POSITION 3 (RIGHT PODIUM) */}
                {rankedLeaderboard[2] && (
                  <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex flex-col items-center flex-1 min-w-[120px]"
                  >
                    <div className="relative mb-2">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-50 dark:bg-orange-950/20 rounded-full border-4 border-orange-350 flex items-center justify-center text-3xl shadow-lg relative overflow-hidden">
                        {renderAvatarContent(rankedLeaderboard[2].avatar)}
                      </div>
                      <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-orange-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-black text-xs border-2 border-white dark:border-slate-900 z-10 shadow-md">
                        3
                      </div>
                    </div>
                    <div className="w-24 sm:w-28 h-24 bg-gradient-to-t from-orange-200/40 to-orange-100/10 dark:from-orange-900/30 dark:to-orange-850/5 rounded-t-2xl flex flex-col items-center pt-5 border-t-2 border-orange-350">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200 text-xs text-center truncate w-full px-2">{rankedLeaderboard[2].name}</span>
                      <span className="text-[10px] font-black text-orange-600 dark:text-orange-400 font-mono mt-1">{rankedLeaderboard[2].xp} XP</span>
                      <span className="text-[8px] font-bold text-slate-400 truncate max-w-full px-2 mt-0.5">{rankedLeaderboard[2].title}</span>
                    </div>
                  </motion.div>
                )}

              </div>

              {/* Leaderboard Table Filters Row */}
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between">
                
                {/* Search Bar Input */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Cari investor / kontributor..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 text-slate-800 dark:text-slate-100"
                  />
                </div>

                {/* Tier Selection Pills */}
                <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Filter Liga:</span>
                  {['Semua', 'Grandmaster', 'Master', 'Diamond', 'Platinum', 'Gold'].map((tier) => (
                    <button
                      key={tier}
                      onClick={() => setSelectedTierFilter(tier)}
                      className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTierFilter === tier ? 'bg-amber-500 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 text-slate-650 dark:text-slate-400 border border-slate-200/60 dark:border-slate-800/60 hover:bg-slate-100'}`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

              </div>

              {/* Main Leaderboard Table */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/70 dark:border-slate-800 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono grid grid-cols-12 gap-2">
                  <div className="col-span-1 text-center">Rank</div>
                  <div className="col-span-7">Kontributor & Gelar</div>
                  <div className="col-span-3 text-right">Liga & XP</div>
                  <div className="col-span-1 text-center">Arah</div>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <AnimatePresence mode="popLayout">
                    {filteredLeaderboard.map((item) => (
                      <motion.div
                        key={item.name}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 sm:p-5 grid grid-cols-12 items-center gap-2 transition-colors ${item.isCurrentUser ? 'bg-amber-500/10 dark:bg-amber-500/5 border-l-4 border-amber-500' : 'hover:bg-slate-50/50 dark:hover:bg-slate-850/30'}`}
                      >
                        {/* Rank indicator */}
                        <div className="col-span-1 text-center font-mono text-xs font-black text-slate-400">
                          {item.rank <= 3 ? (
                            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 font-extrabold text-xs">
                              {item.rank}
                            </span>
                          ) : item.rank}
                        </div>

                        {/* Avatar & Info */}
                        <div className="col-span-7 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/40 dark:border-slate-700/40 flex items-center justify-center text-xl shadow-inner shrink-0 overflow-hidden">
                            {renderAvatarContent(item.avatar)}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-slate-900 dark:text-white truncate flex items-center gap-1.5 text-xs sm:text-sm">
                              {item.name}
                              {item.isCurrentUser && (
                                <span className="text-[8px] font-black bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-mono uppercase tracking-wider">Anda</span>
                              )}
                            </h4>
                            <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 truncate">{item.title}</p>
                          </div>
                        </div>

                        {/* XP Stats */}
                        <div className="col-span-3 text-right">
                          <span className={`inline-block text-[8px] font-black px-1.5 py-0.2 rounded font-mono border ${getTierColorClass(item.level)} mb-1`}>
                            {item.level}
                          </span>
                          <div className="font-black text-slate-900 dark:text-white flex items-center gap-1 justify-end font-mono text-xs sm:text-sm">
                            <Flame className="w-3.5 h-3.5 text-amber-500" /> {item.xp} <span className="text-[9px] font-semibold text-slate-400">XP</span>
                          </div>
                        </div>

                        {/* Chevron Change status */}
                        <div className="col-span-1 flex justify-center shrink-0">
                          {item.change === 'up' && <ChevronUp className="w-4 h-4 text-emerald-500" />}
                          {item.change === 'down' && <ChevronDown className="w-4 h-4 text-rose-500" />}
                          {item.change === 'same' && <Minus className="w-4 h-4 text-slate-350" />}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MISI HARIAN */}
          {activeTab === 'misi' && (
            <div className="space-y-6">
              
              {/* Mission Progress banner card */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center justify-center sm:justify-start gap-1.5 text-base">
                    <Target className="w-5 h-5 text-indigo-500" /> Progress Misi Finansial Hari Ini
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Selesaikan lapor kelas atau tantangan harian, klaim poin XP-mu untuk menaiki tangga peringkat!
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 px-2.5 py-1 rounded-md">
                      Misi Terselesaikan: {dailyMissions.filter(m => m.done).length} dari {dailyMissions.length}
                    </span>
                    <span className="text-[10px] font-black bg-amber-50 text-amber-600 dark:bg-amber-950/20 px-2.5 py-1 rounded-md">
                      Telah Diklaim: {claimedMissions.length} Misi
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  <button
                    onClick={handleClaimAllMissions}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow-md shadow-indigo-600/25 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4 text-amber-400 fill-current animate-pulse" /> Klaim Seluruh Poin
                  </button>
                </div>
              </div>

              {/* Missions Grid List */}
              <div className="space-y-4">
                {dailyMissions.map((m) => {
                  const isClaimed = claimedMissions.includes(m.id);
                  const isDone = m.done;

                  return (
                    <div 
                      key={m.id} 
                      className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isClaimed ? 'opacity-60 border-slate-150' : isDone ? 'border-indigo-150 shadow-xs' : 'border-slate-200'}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl shrink-0 transition-colors ${isClaimed ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : isDone ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-950/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                          {isClaimed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          ) : (
                            <Target className="w-5 h-5 text-slate-450" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{m.title}</h4>
                            {isDone && !isClaimed && (
                              <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono uppercase">Siap Klaim</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{m.desc}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                        <span className="text-[10px] font-black text-amber-500 bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-md font-mono">
                          +{m.xp} XP
                        </span>
                        
                        <button
                          disabled={!isDone || isClaimed}
                          onClick={() => handleClaimMission(m.id, m.xp)}
                          className={`text-xs font-black uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer ${isClaimed ? 'bg-slate-100 text-slate-450 dark:bg-slate-850 dark:text-slate-500 cursor-not-allowed' : isDone ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'}`}
                        >
                          {isClaimed ? 'Diklaim' : isDone ? 'Klaim XP' : 'Belum Selesai'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 3: PENCAPAIAN */}
          {activeTab === 'pencapaian' && (
            <div className="space-y-6">
              
              {/* Achievement stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {achievements.map((ach) => (
                  <div 
                    key={ach.id} 
                    className={`p-5 rounded-2xl border transition-all flex items-start gap-4 ${ach.unlocked ? 'bg-white border-teal-200 dark:bg-slate-900 dark:border-teal-950 shadow-sm' : 'bg-slate-100/50 border-slate-200/60 dark:bg-slate-900/30 dark:border-slate-800/80 opacity-60'}`}
                  >
                    <div className={`p-3 rounded-xl shrink-0 ${ach.unlocked ? 'bg-teal-50 dark:bg-teal-950/20 border border-teal-100/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      {ach.unlocked ? ach.icon : <Lock className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="font-extrabold text-slate-950 dark:text-white text-xs sm:text-sm">{ach.title}</h4>
                        {ach.unlocked && (
                          <span className="text-[8px] font-black bg-teal-100 text-teal-700 px-1.5 py-0.2 rounded font-mono uppercase">Unlocked</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{ach.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Big Treasure Chest lock claim widget */}
              <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/5 to-transparent rounded-3xl p-6 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                  <div className="w-16 h-16 rounded-2xl bg-amber-150 dark:bg-amber-950/30 border border-amber-300 flex items-center justify-center text-3xl shrink-0 animate-pulse">
                    🎁
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider font-display text-sm">Peti Harta Karun Legendaris</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                      Buka minimal 3 Lencana Pencapaian untuk mengklaim bonus rahasia XP ini!
                    </p>
                    <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                      Kemajuan Anda: {achievements.filter(a => a.unlocked).length} dari 3 Lencana Terbuka
                    </p>
                  </div>
                </div>

                <div className="shrink-0 w-full sm:w-auto text-center sm:text-right">
                  <button
                    disabled={achievements.filter(a => a.unlocked).length < 3 || claimedChest}
                    onClick={handleClaimChest}
                    className={`w-full sm:w-auto text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl shadow-md transition-all cursor-pointer ${claimedChest ? 'bg-slate-100 text-slate-450 dark:bg-slate-800 cursor-not-allowed' : achievements.filter(a => a.unlocked).length >= 3 ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20' : 'bg-slate-100 text-slate-400 dark:bg-slate-800 cursor-not-allowed'}`}
                  >
                    {claimedChest ? 'Telah Diklaim' : 'Buka Peti (+150 XP)'}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: SHOP */}
          {activeTab === 'toko' && (
            <div className="space-y-6">
              
              {/* Shop Header Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider font-display flex items-center justify-center sm:justify-start gap-1.5 text-base">
                    <ShoppingBag className="w-5 h-5 text-rose-500" /> Pasar Lencana & Aksesoris Profil
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Gunakan tabungan XP Anda untuk menebus gelar legendaris atau membuka avatar hewan langka baru!
                  </p>
                </div>

                <div className="bg-amber-50 dark:bg-amber-950/20 px-4 py-2.5 rounded-2xl border border-amber-200/40 shrink-0 text-center font-mono">
                  <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Saldo Koin XP Anda</p>
                  <p className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                    <Flame className="w-5 h-5 text-amber-500" /> {currentUserXp} <span className="text-xs text-slate-400">XP</span>
                  </p>
                </div>
              </div>

              {/* Grid split for Avatars and Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Section Avatars */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-450 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Smile className="w-4 h-4 text-indigo-500" /> Avatar Hewan Langka
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2">
                    {shopAvatars.map((item) => {
                      const isUnlocked = unlockedAvatars.includes(item.emoji);
                      return (
                        <div key={item.emoji} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-xl bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-2xl border border-slate-150">
                              {item.emoji}
                            </div>
                            <div>
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{item.name}</h4>
                              <p className="text-[10px] text-slate-400 font-bold">Terbuka untuk disematkan di profil</p>
                            </div>
                          </div>

                          <button
                            disabled={isUnlocked}
                            onClick={() => handleBuyAvatar(item.emoji, item.cost)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${isUnlocked ? 'bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-850 dark:text-slate-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs'}`}
                          >
                            {isUnlocked ? 'Dimiliki' : `${item.cost} XP`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section Titles */}
                <div className="space-y-4">
                  <h3 className="font-black text-xs text-slate-450 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Crown className="w-4 h-4 text-amber-500" /> Gelar Finansial Premium
                  </h3>

                  <div className="grid grid-cols-1 gap-2">
                    {shopTitles.map((item) => {
                      const isUnlocked = unlockedTitles.includes(item.title);
                      return (
                        <div key={item.title} className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-sm">{item.title}</h4>
                              {isUnlocked && (
                                <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded font-mono uppercase">Unlocked</span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-450 dark:text-slate-500 font-semibold mt-0.5">{item.desc}</p>
                          </div>

                          <button
                            disabled={isUnlocked}
                            onClick={() => handleBuyTitle(item.title, item.cost)}
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 ${isUnlocked ? 'bg-slate-50 text-slate-400 border border-slate-200 dark:bg-slate-850 dark:text-slate-500 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs font-bold'}`}
                          >
                            {isUnlocked ? 'Dimiliki' : `${item.cost} XP`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
