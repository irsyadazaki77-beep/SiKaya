import {
  BookOpen, Trophy, Sparkles, AlertTriangle,
  ShieldCheck, Hexagon, RefreshCw, Wallet, TrendingUp
} from 'lucide-react';

export const DAILY_QUIZ_QUESTIONS = [
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

export const MODULES_DATA = [
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

export const DIFFICULTY_LEVELS = [
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

export const QUIZ_TOPICS_DATA = [
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
