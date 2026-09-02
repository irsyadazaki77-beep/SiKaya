import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  MoreHorizontal, 
  PenSquare, 
  Hash, 
  TrendingUp, 
  Users, 
  Send, 
  Search, 
  Award, 
  Sparkles, 
  Filter, 
  Trash2, 
  Plus, 
  ThumbsUp, 
  Check, 
  Zap,
  Flame,
  Volume2
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { PageHeader } from '../components/PageHeader';

interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  time: string;
  content: string;
  likes: number;
  comments: Comment[];
  tags: string[];
  isLikedByUser?: boolean;
  isCustom?: boolean;
}

interface Shout {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export function CommunityPage() {
  const { toast } = useToast();
  
  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string | null>(null);
  
  // Posting states
  const [postContent, setPostContent] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🤠');
  const [customTagInput, setCustomTagInput] = useState('');
  const [postTags, setPostTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState(false);

  // Expanded comment accordions list
  const [expandedCommentPostId, setExpandedCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentAuthor, setNewCommentAuthor] = useState('');

  // Shoutbox states
  const [shoutText, setShoutText] = useState('');
  const [shoutAuthor, setShoutAuthor] = useState('');
  const [shoutAvatar, setShoutAvatar] = useState('🦊');

  // Database of posts
  const [posts, setPosts] = useState<Post[]>([]);
  // Database of shouts
  const [shouts, setShouts] = useState<Shout[]>([]);

  const AVATARS = ['🤠', '🧕', '👨‍💻', '🦊', '🦁', '🦄', '👩‍💼', '🏂', '🐯', '🤖'];

  const defaultPosts: Post[] = [
    {
      id: 'default-1',
      author: 'Budi Santoso',
      avatar: '👨‍💼',
      time: '2 jam yang lalu',
      content: 'Akhirnya bisa mencapai target dana darurat 6 bulan pengeluaran! 🚀 Terima kasih SiKaya untuk fitur tracking dan edukasinya. Sekarang fokus mulai cicil reksa dana indeks.',
      likes: 124,
      tags: ['DanaDarurat', 'Milestone', 'Saham'],
      comments: [
        { id: 'c1', author: 'Siti Aminah', avatar: '🧕', content: 'Keren mas! Semoga konsisten terus ya.', time: '1 jam yang lalu' },
        { id: 'c2', author: 'Wawan Value', avatar: '🧔', content: 'Selamat mas! Langkah awal yang sangat kuat.', time: '45m lalu' }
      ]
    },
    {
      id: 'default-2',
      author: 'Siti Aminah',
      avatar: '🧕',
      time: '5 jam yang lalu',
      content: 'Ada yang punya rekomendasi reksa dana pasar uang syariah yang return-nya stabil? Mau buat tabungan umroh nih.',
      likes: 45,
      tags: ['RDPU', 'Syariah', 'TanyaJawab'],
      comments: [
        { id: 'c3', author: 'Rudi Ardiansyah', avatar: '🦁', content: 'RDPU Syariah dari Sucor atau Bahana biasanya stabil mbak, silakan dicek prospektusnya.', time: '3 jam yang lalu' }
      ]
    },
    {
      id: 'default-3',
      author: 'Alex Chandra',
      avatar: '👨‍💻',
      time: '1 hari yang lalu',
      content: 'Market IHSG lagi koreksi dalam, waktunya serok saham blue chip! BBCA dan BBRI kelihatan menarik di harga segini. Tetap DYOR (Do Your Own Research) ya teman-teman.',
      likes: 210,
      tags: ['IHSG', 'Saham', 'ValueInvesting'],
      comments: [
        { id: 'c4', author: 'Scalper Pro', avatar: '⚡', content: 'Nunggu di support bawah lagi deh bro biar dapet diskon gede haha.', time: '18 jam yang lalu' }
      ]
    }
  ];

  const defaultShouts: Shout[] = [
    { id: 's1', author: 'Rian_HODL', avatar: '🐯', text: 'Bitcoin nembus All-Time-High baru guys! 🔥', time: '10:14' },
    { id: 's2', author: 'Dian_Puspita', avatar: '🦄', text: 'Hari ini dapet cashback reksadana 50rb lumayan buat nambah unit.', time: '09:45' },
    { id: 's3', author: 'Ahmad_Bursa', avatar: '🤖', text: 'BBRI mantul di area support kuat, serok tipis-tipis.', time: '09:12' }
  ];

  const trendingTopics = [
    { tag: 'DanaDarurat', count: '1.2k diskusi' },
    { tag: 'Saham', count: '948 diskusi' },
    { tag: 'RDPU', count: '456 diskusi' },
    { tag: 'IHSG', count: '312 diskusi' },
    { tag: 'TanyaJawab', count: '280 diskusi' }
  ];

  const topContributors = [
    { name: 'Alex Chandra', badge: 'Sultan Dividen 👑', score: '1,520 pts', avatar: '👨‍💻', color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/30' },
    { name: 'Budi Santoso', badge: 'HODL King 💎', score: '1,280 pts', avatar: '👨‍💼', color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30' },
    { name: 'Siti Aminah', badge: 'Syariah Guru 📿', score: '950 pts', avatar: '🧕', color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30' },
    { name: 'Rian_HODL', badge: 'Crypto Scout 🚀', score: '740 pts', avatar: '🐯', color: 'text-rose-500 bg-rose-50 dark:bg-rose-950/30' }
  ];

  // Load state from localStorage
  useEffect(() => {
    const savedPosts = localStorage.getItem('sikaya_forum_posts_v2');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts(defaultPosts);
      }
    } else {
      setPosts(defaultPosts);
    }

    const savedShouts = localStorage.getItem('sikaya_shoutbox_v2');
    if (savedShouts) {
      try {
        setShouts(JSON.parse(savedShouts));
      } catch (e) {
        setShouts(defaultShouts);
      }
    } else {
      setShouts(defaultShouts);
    }
  }, []);

  const savePostsToLocalStorage = (updated: Post[]) => {
    setPosts(updated);
    localStorage.setItem('sikaya_forum_posts_v2', JSON.stringify(updated));
  };

  const saveShoutsToLocalStorage = (updated: Shout[]) => {
    setShouts(updated);
    localStorage.setItem('sikaya_shoutbox_v2', JSON.stringify(updated));
  };

  // AI Moderation Rules
  const FORBIDDEN_WORDS = ['slot', 'judol', 'gacor', 'pinjol ilegal', 'garansi untung', 'investasi bodong', 'transfer wa', 'wa.me', 'pasti kaya instant'];
  
  const checkContentSafety = (text: string): boolean => {
    const lower = text.toLowerCase();
    return !FORBIDDEN_WORDS.some(word => lower.includes(word));
  };

  // Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) {
      toast.error('Konten postingan tidak boleh kosong!');
      return;
    }

    if (!checkContentSafety(postContent)) {
      toast.error('Postingan ditolak AI Moderasi: Terdeteksi kata kunci promosi ilegal / terlarang.');
      return;
    }

    const finalAuthor = postAuthor.trim() || 'Anonim Kaya';
    const newPost: Post = {
      id: Math.random().toString(36).substring(2, 9),
      author: finalAuthor,
      avatar: selectedAvatar,
      time: 'Baru saja',
      content: postContent.trim(),
      likes: 0,
      tags: postTags.length > 0 ? postTags : ['GenerasiKaya'],
      comments: [],
      isCustom: true
    };

    const updated = [newPost, ...posts];
    savePostsToLocalStorage(updated);
    
    // Reset posting state
    setPostContent('');
    setPostTags([]);
    setCustomTagInput('');
    setShowTagInput(false);
    toast.success('Postingan lolos AI Moderasi & berhasil diterbitkan!');
  };

  // Add Tag
  const handleAddTag = () => {
    if (!customTagInput.trim()) return;
    const cleanTag = customTagInput.trim().replace(/#/g, '');
    if (!postTags.includes(cleanTag)) {
      setPostTags([...postTags, cleanTag]);
    }
    setCustomTagInput('');
  };

  // Remove Tag from being added
  const handleRemoveTag = (tagToRemove: string) => {
    setPostTags(postTags.filter(t => t !== tagToRemove));
  };

  // Delete Custom Post
  const handleDeletePost = (id: string) => {
    const filtered = posts.filter(p => p.id !== id);
    savePostsToLocalStorage(filtered);
    toast.success('Postingan berhasil dihapus');
  };

  // Handle Likes
  const handleLikePost = (postId: string) => {
    const updated = posts.map(post => {
      if (post.id === postId) {
        const alreadyLiked = post.isLikedByUser;
        return {
          ...post,
          likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
          isLikedByUser: !alreadyLiked
        };
      }
      return post;
    });
    savePostsToLocalStorage(updated);
  };

  // Handle Post Comment
  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) {
      toast.error('Komentar tidak boleh kosong!');
      return;
    }

    if (!checkContentSafety(newCommentText)) {
      toast.error('Komentar ditolak AI Moderasi: Mengandung konten sensitif/spam.');
      return;
    }

    const commentAuthorName = newCommentAuthor.trim() || 'Pembaca Pintar';
    const newCommentObj: Comment = {
      id: Math.random().toString(36).substring(2, 9),
      author: commentAuthorName,
      avatar: '👤',
      content: newCommentText.trim(),
      time: 'Baru saja'
    };

    const updated = posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newCommentObj]
        };
      }
      return post;
    });

    savePostsToLocalStorage(updated);
    setNewCommentText('');
    toast.success('Komentar ditambahkan!');
  };

  // Handle Shout Box Submit
  const handleSendShout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shoutText.trim()) return;

    if (!checkContentSafety(shoutText)) {
      toast.error('Pesan ditolak AI Moderasi: Kata kunci terlarang.');
      return;
    }

    const timeString = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const finalAuthor = shoutAuthor.trim() || 'Warga_Kaya';
    const newShout: Shout = {
      id: Math.random().toString(36).substring(2, 9),
      author: finalAuthor.replace(/\s+/g, '_'),
      avatar: shoutAvatar,
      text: shoutText.trim(),
      time: timeString
    };

    const updated = [newShout, ...shouts].slice(0, 30); // limit to 30 shouts
    saveShoutsToLocalStorage(updated);
    setShoutText('');
    toast.success('Shout dikirim!');
  };

  // Copy Post Share Link
  const handleSharePost = (post: Post) => {
    navigator.clipboard.writeText(`https://sikaya.com/community/post/${post.id}`);
    toast.success(`Tautan diskusi "${post.author}" disalin ke papan klip!`);
  };

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTagFilter ? post.tags.includes(selectedTagFilter) : true;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Header */}
        <PageHeader
          category="Komunitas"
          title="Forum Diskusi & Simulasi Komunitas Finansial"
          description="Tempat berlatih berbagi wawasan finansial, studi kasus investasi, serta simulasi diskusi sesama pembelajar literasi keuangan."
          badge="DEMO KOMUNITAS"
        />

        {/* Data Provenance & Transparency Notice */}
        <div className="bg-indigo-500/10 border border-indigo-500/20 dark:bg-indigo-950/20 dark:border-indigo-900/40 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2 font-medium">
            <span className="font-bold bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider">
              SIMULASI RUANG DISKUSI
            </span>
            <span>Ruang diskusi ini merupakan simulator forum edukasi. Diskusi tersimpan di penyimpanan browser lokal Anda untuk latihan menyampaikan opini finansial yang bijak.</span>
          </div>
        </div>

        {/* Global Stats Widget */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/30 rounded-xl text-teal-600 dark:text-teal-400 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Topik Terbuka</p>
              <p className="text-base font-black text-slate-950 dark:text-white font-mono">{posts.length} Diskusi</p>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Shoutbox Interaktif</p>
              <p className="text-base font-black text-slate-950 dark:text-white font-mono">{shouts.length} Pesan</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl text-amber-600 dark:text-amber-400 shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Topik Pilihan</p>
              <p className="text-base font-black text-slate-950 dark:text-white font-mono">#DanaDarurat</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-xs flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl text-emerald-600 dark:text-emerald-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase font-mono">Status Moderasi</p>
              <p className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">Filter Otomatis</p>
            </div>
          </div>
        </div>

        {/* Dynamic Controls Grid */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kata kunci atau kontributor..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100"
            />
          </div>

          {/* Quick Active Filters row */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Filter Topik:</span>
            <button
              onClick={() => setSelectedTagFilter(null)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTagFilter === null ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-850'}`}
            >
              Semua
            </button>
            {['DanaDarurat', 'Saham', 'RDPU', 'IHSG', 'TanyaJawab'].map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTagFilter(tag)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${selectedTagFilter === tag ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200 dark:border-slate-850'}`}
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Split Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Block: Create Post & Feed list */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Create Post Widget Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-850">
                <PenSquare className="w-5 h-5 text-indigo-500" />
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">Bagikan Pemikiran Keuangan Anda</h3>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4">
                
                {/* Nickname & Avatar row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Nama Samaran Anda</label>
                    <input 
                      type="text"
                      placeholder="Contoh: PejuangDanaDarurat"
                      value={postAuthor}
                      onChange={e => setPostAuthor(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-2.5 text-xs font-black text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Pilih Avatar Emojimu</label>
                    <div className="flex flex-wrap gap-1">
                      {AVATARS.map((av) => (
                        <button
                          key={av}
                          type="button"
                          onClick={() => setSelectedAvatar(av)}
                          className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${selectedAvatar === av ? 'bg-indigo-100 dark:bg-indigo-950/40 border-2 border-indigo-500 scale-110' : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100'}`}
                        >
                          {av}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Textarea description body */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 font-mono">Apa yang ingin kamu diskusikan?</label>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-950 rounded-2xl p-4 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none placeholder-slate-400 leading-relaxed"
                    rows={3}
                    value={postContent}
                    onChange={e => setPostContent(e.target.value)}
                    placeholder="Bahas target dana darurat, nanya prospek saham perbankan, atau diskusikan reksa dana syariah impianmu..."
                  ></textarea>
                </div>

                {/* Tags management block */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">Tag Diskusi:</span>
                    {postTags.map(tag => (
                      <span 
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-1 rounded-md"
                      >
                        #{tag}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-rose-500 text-[11px]"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                    
                    {!showTagInput ? (
                      <button
                        type="button"
                        onClick={() => setShowTagInput(true)}
                        className="inline-flex items-center gap-1 text-[9px] font-black text-slate-500 hover:text-indigo-600 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 px-2 py-1 rounded-md border border-slate-200 dark:border-slate-850 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Tambah Tag
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          placeholder="tag_baru"
                          value={customTagInput}
                          onChange={e => setCustomTagInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                          className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-md px-2 py-0.5 text-[10px] font-bold focus:outline-none focus:border-indigo-500 font-mono text-slate-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[10px] font-bold cursor-pointer"
                        >
                          OK
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowTagInput(false)}
                          className="p-1 text-slate-400 text-[10px]"
                        >
                          Batal
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Post Submit Row */}
                <div className="flex justify-end pt-2 border-t border-slate-50 dark:border-slate-850">
                  <button 
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer"
                  >
                    <PenSquare className="w-4 h-4" /> Publikasikan Diskusi
                  </button>
                </div>

              </form>
            </div>

            {/* Forums Feeds Block */}
            <div className="space-y-5">
              <h3 className="font-black text-sm text-slate-400 uppercase tracking-widest font-mono flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Aliran Diskusi Terkini
              </h3>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl space-y-2">
                  <p className="font-extrabold text-slate-700 dark:text-slate-300">Tidak ada postingan diskusi cocok</p>
                  <p className="text-xs text-slate-400">Coba buat postingan baru pertama Anda atau ubah kata kunci filter pencarian.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPosts.map((post) => {
                    const isExpanded = expandedCommentPostId === post.id;
                    return (
                      <motion.div 
                        key={post.id}
                        layout="position"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4 relative"
                      >
                        
                        {/* Header metadata row */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-xl shadow-inner shrink-0">
                              {post.avatar}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="font-extrabold text-slate-900 dark:text-white leading-tight text-sm">{post.author}</h4>
                                {post.isCustom ? (
                                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-450 text-[8px] px-1 py-0.2 rounded font-black font-mono uppercase">Lokal</span>
                                ) : (
                                  <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[8px] px-1.5 py-0.2 rounded font-black font-mono uppercase flex items-center gap-0.5"><Award className="w-2 h-2" /> Top Contributor</span>
                                )}
                              </div>
                              <p className="text-[10px] font-bold text-slate-400">{post.time}</p>
                            </div>
                          </div>

                          {post.isCustom && (
                            <button 
                              onClick={() => handleDeletePost(post.id)}
                              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                              title="Hapus Diskusi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        {/* Content text */}
                        <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>

                        {/* Tags list */}
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map(tag => (
                            <button 
                              key={tag} 
                              onClick={() => setSelectedTagFilter(tag)}
                              className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 px-2 py-0.5 rounded-md hover:bg-indigo-100/60 transition-colors"
                            >
                              #{tag}
                            </button>
                          ))}
                        </div>

                        {/* Actions bar row */}
                        <div className="flex items-center gap-4 pt-3.5 border-t border-slate-50 dark:border-slate-850 text-slate-500">
                          
                          {/* Like button */}
                          <button 
                            onClick={() => handleLikePost(post.id)}
                            className={`flex items-center gap-1.5 text-xs font-black transition-colors cursor-pointer ${post.isLikedByUser ? 'text-rose-600 dark:text-rose-400' : 'hover:text-rose-500'}`}
                          >
                            <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-current text-rose-500' : ''}`} />
                            <span>{post.likes}</span>
                          </button>

                          {/* Comment trigger button */}
                          <button 
                            onClick={() => setExpandedCommentPostId(isExpanded ? null : post.id)}
                            className={`flex items-center gap-1.5 text-xs font-black transition-colors cursor-pointer ${isExpanded ? 'text-indigo-600 dark:text-indigo-400' : 'hover:text-indigo-600'}`}
                          >
                            <MessageSquare className="w-4 h-4" />
                            <span>{post.comments.length} Komentar</span>
                          </button>

                          {/* Share button */}
                          <button 
                            onClick={() => handleSharePost(post)}
                            className="flex items-center gap-1.5 text-xs font-bold hover:text-teal-600 transition-colors ml-auto cursor-pointer"
                          >
                            <Share2 className="w-4 h-4" />
                            <span className="hidden sm:inline">Bagikan</span>
                          </button>
                        </div>

                        {/* Collapsible Comment Thread Accordion */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden bg-slate-50 dark:bg-slate-950/55 rounded-2xl p-4 mt-2 border border-slate-150 dark:border-slate-850 space-y-4"
                            >
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Utas Percakapan ({post.comments.length})</h5>
                              
                              {post.comments.length === 0 ? (
                                <p className="text-[11px] text-slate-400 font-bold italic">Belum ada tanggapan. Jadilah yang pertama memberikan saran atau pandangan!</p>
                              ) : (
                                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                                  {post.comments.map((comm) => (
                                    <div key={comm.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-2.5">
                                      <div className="w-7 h-7 rounded-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-sm shadow-inner shrink-0">
                                        {comm.avatar}
                                      </div>
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center mb-0.5">
                                          <span className="text-[11px] font-extrabold text-slate-900 dark:text-white">{comm.author}</span>
                                          <span className="text-[9px] font-bold text-slate-400">{comm.time}</span>
                                        </div>
                                        <p className="text-[11px] sm:text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">{comm.content}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Write new comment form */}
                              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-850">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input 
                                    type="text"
                                    placeholder="Nama Komentator..."
                                    value={newCommentAuthor}
                                    onChange={e => setNewCommentAuthor(e.target.value)}
                                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-[10px] font-black focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                                  />
                                </div>
                                <div className="relative">
                                  <input 
                                    type="text"
                                    placeholder="Ketik tanggapan Anda..."
                                    value={newCommentText}
                                    onChange={e => setNewCommentText(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleAddComment(post.id)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-10 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddComment(post.id)}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors cursor-pointer"
                                  >
                                    <Send className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                            </motion.div>
                          )}
                        </AnimatePresence>

                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Gamified elements & Shoutbox Live widget */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Live Shoutbox Chat Room Container */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm flex flex-col justify-between h-[450px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg animate-pulse">
                      <Volume2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs text-slate-950 dark:text-white uppercase tracking-wider font-display">Shoutbox Finansial</h3>
                      <p className="text-[9px] font-bold text-slate-400">Papan Sapa Real-time Warga SiKaya</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black font-mono px-2 py-0.5 rounded-full uppercase">● Live</span>
                </div>

                {/* Shouts stream lists */}
                <div className="space-y-2.5 overflow-y-auto max-h-[250px] scrollbar-thin pr-1 flex flex-col-reverse">
                  {shouts.map((sh) => (
                    <div key={sh.id} className="p-2.5 bg-slate-50 dark:bg-slate-950/40 rounded-xl border border-slate-100/60 dark:border-slate-850/40 text-xs font-semibold">
                      <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-1 font-mono text-[10px]">
                          <span className="text-xs shrink-0">{sh.avatar}</span>
                          <span className="font-black text-slate-850 dark:text-slate-200">@{sh.author}</span>
                        </div>
                        <span className="text-[8px] text-slate-400 font-mono font-bold">{sh.time}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-600 dark:text-slate-350">{sh.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shout Input form footer */}
              <form onSubmit={handleSendShout} className="pt-4 border-t border-slate-100 dark:border-slate-850 space-y-2">
                <div className="grid grid-cols-3 gap-1.5">
                  <input 
                    type="text"
                    placeholder="Nama_Sapa"
                    value={shoutAuthor}
                    onChange={e => setShoutAuthor(e.target.value)}
                    className="col-span-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-1.5 text-[9px] font-black focus:outline-none focus:border-indigo-500 font-mono text-slate-800 dark:text-white"
                  />
                  <select
                    value={shoutAvatar}
                    onChange={e => setShoutAvatar(e.target.value)}
                    className="col-span-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-lg p-1 text-[11px] font-bold focus:outline-none text-slate-850 dark:text-white"
                  >
                    <option value="🦊">🦊 Rubah</option>
                    <option value="🐯">🐯 Harimau</option>
                    <option value="🦄">🦄 Unikorn</option>
                    <option value="🤖">🤖 Bot</option>
                    <option value="🦖">🦖 Dinosaurus</option>
                  </select>
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Kirim sapaan kilat ke forum..."
                    value={shoutText}
                    onChange={e => setShoutText(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-3 pr-10 py-2.5 text-xs font-bold focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-rose-500 hover:bg-rose-400 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Top Contributors & Badges Leaderboard */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wider font-display">
                <Award className="w-4 h-4 text-amber-500" /> Peringkat Kontributor Teraktif
              </h3>
              
              <div className="space-y-3">
                {topContributors.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-transparent hover:border-slate-200 transition-colors">
                    <span className="font-mono text-xs font-black text-slate-400 shrink-0 w-4">#{idx+1}</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-base">
                      {c.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">{c.name}</h4>
                      <span className={`inline-block text-[8px] font-black px-1.5 py-0.2 rounded font-mono ${c.color} mt-0.5`}>
                        {c.badge}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 font-mono">{c.score}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Trending Topics list */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/60 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-xs text-slate-900 dark:text-white flex items-center gap-2 mb-4 uppercase tracking-wider font-display">
                <TrendingUp className="w-4 h-4 text-amber-500" /> Topik Tag Populer
              </h3>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setSelectedTagFilter(topic.tag)}
                    className="w-full flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div>
                      <p className="font-extrabold text-xs text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 transition-colors">#{topic.tag}</p>
                      <p className="text-[10px] text-slate-500 font-bold">{topic.count}</p>
                    </div>
                    <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600 dark:group-hover:bg-indigo-950/20 transition-colors">
                      <Hash className="w-3 h-3" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
