export interface Asset {
  symbol: string;
  name: string;
  market: 'IDX' | 'US' | 'CRYPTO' | 'COMMODITY';
  price: number;
  change: number;
  prevClose: number;
  volume: string;
  marketCap: string;
  peRatio: string;
  dividendYield: string;
  dayRange: string;
  description: string;
  sector: string;
  chartData: { time: string; value: number }[];
}

export interface PendingOrder {
  id: string;
  symbol: string;
  type: 'LIMIT_BELI' | 'LIMIT_JUAL' | 'STOP_LOSS';
  targetPrice: number;
  shares: number;
}

export interface Transaction {
  id: string;
  type: 'BELI' | 'JUAL' | 'DEVIDEN' | 'BONUS';
  symbol: string;
  shares: number;
  price: number;
  total: number;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  desc: string;
  unlocked: boolean;
  icon: string;
}

export const initialAssets: Asset[] = [
  {
    symbol: "BBRI", name: "Bank Rakyat Indonesia Tbk", market: "IDX", price: 4850, change: 1.2, prevClose: 4790,
    volume: "124M", marketCap: "Rp 735T", peRatio: "11.4x", dividendYield: "6.1%", dayRange: "4780-4900", sector: "Keuangan",
    description: "Bank BUMN terbesar berfokus pada pembiayaan UMKM nasional.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 4700 + Math.random() * 200 }))
  },
  {
    symbol: "TLKM", name: "Telkom Indonesia Tbk", market: "IDX", price: 3620, change: -0.8, prevClose: 3650,
    volume: "45M", marketCap: "Rp 358T", peRatio: "14.8x", dividendYield: "5.2%", dayRange: "3600-3680", sector: "Infrastruktur",
    description: "Raksasa telekomunikasi digital dan seluler Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 3550 + Math.random() * 150 }))
  },
  {
    symbol: "GOTO", name: "GoTo Gojek Tokopedia Tbk", market: "IDX", price: 64, change: 3.2, prevClose: 62,
    volume: "1.2B", marketCap: "Rp 76T", peRatio: "N/A", dividendYield: "0%", dayRange: "61-66", sector: "Teknologi",
    description: "Ekosistem digital on-demand, e-commerce, dan fintech terbesar.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 60 + Math.random() * 8 }))
  },
  {
    symbol: "BBCA", name: "Bank Central Asia Tbk", market: "IDX", price: 10125, change: 0.5, prevClose: 10075,
    volume: "85M", marketCap: "Rp 1,240T", peRatio: "24.1x", dividendYield: "2.8%", dayRange: "10000-10200", sector: "Keuangan",
    description: "Bank swasta terbesar di Indonesia dengan likuiditas tinggi.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 9950 + Math.random() * 300 }))
  },
  {
    symbol: "AAPL", name: "Apple Inc.", market: "US", price: 184.5, change: 1.4, prevClose: 181.86,
    volume: "58M", marketCap: "$2.89T", peRatio: "29.4x", dividendYield: "0.5%", dayRange: "181-186", sector: "Teknologi",
    description: "Pencipta iPhone, MacOS, dan ekosistem digital premium global.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 180 + Math.random() * 8 }))
  },
  {
    symbol: "NVDA", name: "NVIDIA Corp.", market: "US", price: 864.1, change: 4.8, prevClose: 823.89,
    volume: "47M", marketCap: "$2.16T", peRatio: "74.2x", dividendYield: "0.02%", dayRange: "820-870", sector: "Teknologi",
    description: "Pionir super chip GPU dan kecerdasan buatan (AI) dunia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 810 + Math.random() * 60 }))
  },
  {
    symbol: "TSLA", name: "Tesla Inc.", market: "US", price: 177.2, change: -2.3, prevClose: 181.46,
    volume: "89M", marketCap: "$564B", peRatio: "42.1x", dividendYield: "0%", dayRange: "175-183", sector: "Otomotif",
    description: "Inovator mobil listrik, baterai, dan energi bersih milik Elon Musk.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 173 + Math.random() * 12 }))
  },
  {
    symbol: "BTC", name: "Bitcoin", market: "CRYPTO", price: 62450, change: 1.8, prevClose: 61320,
    volume: "28B", marketCap: "$1.22T", peRatio: "N/A", dividendYield: "0%", dayRange: "61000-63500", sector: "Kripto",
    description: "Mata uang digital kripto desentralisasi pertama di dunia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 60500 + Math.random() * 2500 }))
  },
  {
    symbol: "GOLD", name: "Emas Berjangka", market: "COMMODITY", price: 2320, change: 0.7, prevClose: 2304,
    volume: "120K", marketCap: "N/A", peRatio: "N/A", dividendYield: "0%", dayRange: "2290-2340", sector: "Komoditas",
    description: "Aset lindung nilai (safe haven) fisik global terpopuler.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 2280 + Math.random() * 50 }))
  },
  {
    symbol: "ASII", name: "Astra International Tbk", market: "IDX", price: 5200, change: 0.5, prevClose: 5175,
    volume: "34M", marketCap: "Rp 210T", peRatio: "7.2x", dividendYield: "8.5%", dayRange: "5150-5250", sector: "Otomotif & Multisektor",
    description: "Konglomerasi otomotif, alat berat, dan agribisnis terbesar di Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 5100 + Math.random() * 150 }))
  },
  {
    symbol: "AMMN", name: "Amman Mineral Internasional", market: "IDX", price: 8750, change: 2.1, prevClose: 8570,
    volume: "21M", marketCap: "Rp 634T", peRatio: "15.4x", dividendYield: "0%", dayRange: "8500-8800", sector: "Pertambangan",
    description: "Perusahaan tambang tembaga dan emas raksasa di Indonesia.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 8500 + Math.random() * 300 }))
  },
  {
    symbol: "ANTM", name: "Aneka Tambang Tbk", market: "IDX", price: 1650, change: -1.2, prevClose: 1670,
    volume: "45M", marketCap: "Rp 39T", peRatio: "12.8x", dividendYield: "3.2%", dayRange: "1640-1680", sector: "Pertambangan",
    description: "BUMN pertambangan emas, nikel, dan bauksit terkemuka.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 1620 + Math.random() * 60 }))
  },
  {
    symbol: "MSFT", name: "Microsoft Corp.", market: "US", price: 420.5, change: 0.8, prevClose: 417.1,
    volume: "22M", marketCap: "$3.1T", peRatio: "35.2x", dividendYield: "0.7%", dayRange: "415-425", sector: "Teknologi",
    description: "Raksasa software dan cloud computing, pemimpin tren AI global.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 410 + Math.random() * 15 }))
  },
  {
    symbol: "AMZN", name: "Amazon.com Inc.", market: "US", price: 185.3, change: -0.4, prevClose: 186.0,
    volume: "35M", marketCap: "$1.9T", peRatio: "42.5x", dividendYield: "0%", dayRange: "182-188", sector: "Konsumer & Cloud",
    description: "Pemimpin e-commerce global dan penyedia layanan cloud AWS.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 180 + Math.random() * 10 }))
  },
  {
    symbol: "META", name: "Meta Platforms Inc.", market: "US", price: 505.2, change: 1.5, prevClose: 497.7,
    volume: "18M", marketCap: "$1.28T", peRatio: "28.3x", dividendYield: "0.4%", dayRange: "495-510", sector: "Teknologi",
    description: "Induk perusahaan Facebook, Instagram, dan WhatsApp.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 490 + Math.random() * 20 }))
  },
  {
    symbol: "ETH", name: "Ethereum", market: "CRYPTO", price: 3450, change: -2.5, prevClose: 3540,
    volume: "12B", marketCap: "$415B", peRatio: "N/A", dividendYield: "0%", dayRange: "3400-3580", sector: "Kripto",
    description: "Platform blockchain terbesar untuk smart contract dan DeFi.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 3400 + Math.random() * 150 }))
  },
  {
    symbol: "SOL", name: "Solana", market: "CRYPTO", price: 145.2, change: 5.4, prevClose: 137.8,
    volume: "4.2B", marketCap: "$65B", peRatio: "N/A", dividendYield: "0%", dayRange: "135-148", sector: "Kripto",
    description: "Blockchain kecepatan tinggi dengan biaya transaksi sangat rendah.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 135 + Math.random() * 15 }))
  },
  {
    symbol: "SBN019", name: "Sukuk Ritel 019", market: "COMMODITY", price: 1000000, change: 0, prevClose: 1000000,
    volume: "N/A", marketCap: "N/A", peRatio: "N/A", dividendYield: "5.95%", dayRange: "1000000-1000000", sector: "Obligasi",
    description: "Surat Berharga Syariah Negara, investasi aman dijamin pemerintah.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 1000000 }))
  },
  {
    symbol: "SILVER", name: "Perak Berjangka", market: "COMMODITY", price: 28.5, change: 1.2, prevClose: 28.1,
    volume: "65K", marketCap: "N/A", peRatio: "N/A", dividendYield: "0%", dayRange: "28.0-28.8", sector: "Komoditas",
    description: "Logam mulia industri dengan pergerakan lebih volatil dibanding emas.",
    chartData: Array.from({ length: 8 }, (_, i) => ({ time: `${9 + i}:00`, value: 27.5 + Math.random() * 1.5 }))
  }
];

export const mockNews = [
  { text: "NVIDIA merilis superkomputer AI generasi terbaru, saham NVDA melonjak!", impact: { NVDA: 0.06 } },
  { text: "Inflasi AS melandai, sentimen positif untuk pasar saham Wall Street.", impact: { AAPL: 0.02, TSLA: 0.03 } },
  { text: "Bank Indonesia menahan suku bunga acuan, sektor finansial IDX stabil.", impact: { BBRI: 0.015, BBCA: 0.01 } },
  { text: "GoTo meluncurkan fitur integrasi AI baru untuk mitra driver, GOTO menguat.", impact: { GOTO: 0.05 } },
  { text: "Volatilitas Kripto meningkat tajam menjelang regulasi baru AS.", impact: { BTC: -0.04 } },
  { text: "Emas dunia kembali menjadi incaran seiring ketidakpastian geopolitik.", impact: { GOLD: 0.025 } },
  { text: "Tesla mengumumkan efisiensi pabrik Gigafactory baru, ongkos produksi turun.", impact: { TSLA: 0.04 } },
  { text: "Layanan broadband Telkomsel mengalami gangguan singkat, harga saham terkoreksi.", impact: { TLKM: -0.02 } },
  { text: "The Fed memutuskan untuk menaikkan suku bunga, saham teknologi terkoreksi.", impact: { AAPL: -0.03, MSFT: -0.02, META: -0.025 } },
  { text: "Pemerintah meluncurkan insentif kendaraan listrik besar-besaran.", impact: { ASII: 0.04, AMMN: 0.02 } },
  { text: "Ethereum menyelesaikan upgrade besar, biaya gas turun drastis.", impact: { ETH: 0.05, SOL: -0.01 } },
  { text: "Permintaan perhiasan meningkat jelang musim perayaan India dan Tiongkok.", impact: { GOLD: 0.015, SILVER: 0.02 } },
];

export const quizQuestions = [
  {
    q: "Apa arti rasio Price-to-Earnings (P/E Ratio) yang tinggi?",
    a: ["Saham relatif mahal atau investor mengharapkan pertumbuhan tinggi", "Perusahaan pasti akan membagikan dividen besar", "Perusahaan memiliki hutang yang sangat sedikit"],
    correct: 0, reward: 5000000
  },
  {
    q: "Mana kelas aset yang dianggap sebagai lindung nilai inflasi klasik?",
    a: ["Emas (GOLD)", "Saham Teknologi Berisiko", "Uang Tunai Fiat"],
    correct: 0, reward: 5000000
  },
  {
    q: "Apa yang terjadi pada pemegang saham jika perusahaan melakukan Stock Split?",
    a: ["Jumlah lembar saham bertambah, nilai per lembar turun proporsional", "Saham mereka ditarik kembali oleh bursa", "Dividen per lembar naik otomatis 2 kali lipat"],
    correct: 0, reward: 5000000
  },
  {
    q: "Apa keuntungan utama membeli Surat Berharga Negara (SBN)?",
    a: ["Dijamin oleh negara sehingga bebas risiko gagal bayar", "Return lebih tinggi dari saham", "Bisa digunakan sebagai mata uang kripto"],
    correct: 0, reward: 5000000
  },
  {
    q: "Berapa lama waktu penyelesaian (settlement) transaksi saham di Bursa Efek Indonesia?",
    a: ["T+2 (Dua hari bursa setelah transaksi)", "T+0 (Hari itu juga)", "T+7 (Satu minggu)"],
    correct: 0, reward: 5000000
  },
  {
    q: "Apa fungsi utama dari Stop Loss dalam trading?",
    a: ["Membatasi kerugian jika harga bergerak berlawanan", "Otomatis membeli di harga bawah", "Mencairkan dividen lebih cepat"],
    correct: 0, reward: 5000000
  },
  {
    q: "Dalam investasi kripto, apa yang dimaksud dengan 'Halving' Bitcoin?",
    a: ["Pengurangan imbalan penambang (miner) menjadi setengahnya", "Harga Bitcoin turun 50%", "Koin Bitcoin dibakar setengahnya"],
    correct: 0, reward: 5000000
  },
  {
    q: "Faktor mana yang paling mempengaruhi pergerakan harga emas dunia?",
    a: ["Inflasi dan ketidakpastian ekonomi global", "Laporan keuangan perusahaan perhiasan", "Musim panen komoditas pertanian"],
    correct: 0, reward: 5000000
  },
  {
    q: "Jika saham memiliki Dividend Yield 5% dan harga saham naik 10%, berapa Total Return kotor Anda?",
    a: ["15%", "5%", "10%"],
    correct: 0, reward: 5000000
  },
];
