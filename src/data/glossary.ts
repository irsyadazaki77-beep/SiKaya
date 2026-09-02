export interface GlossaryItem {
  id: string;
  term: string;
  category: 'Pondasi Finansial' | 'Investasi' | 'Pasar Modal' | 'Manajemen Risiko & Utang' | 'Perencanaan Masa Depan';
  simpleExplanation: string;
  advancedExplanation: string;
  example: string;
  formula?: string;
  relatedTerms: string[];
  moduleId?: string; // id modul di classroom untuk direct link
  antiMisleading: string;
}

export const GLOSSARY_CATEGORIES = [
  'Semua',
  'Pondasi Finansial',
  'Investasi',
  'Pasar Modal',
  'Manajemen Risiko & Utang',
  'Perencanaan Masa Depan'
] as const;

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    id: 'compound-interest',
    term: "Compound Interest (Bunga Majemuk)",
    category: "Pondasi Finansial",
    simpleExplanation: "Bunga yang ikut menghasilkan bunga. Diibaratkan seperti bola salju kecil yang menggelinding dan semakin lama semakin membesar.",
    advancedExplanation: "Proses reinvestasi imbal hasil (bunga/dividen/capital gain) ke pokok investasi awal secara kontinu, sehingga pada periode perhitungan berikutnya bunga dihitung dari saldo total baru yang lebih besar (pertumbuhan eksponensial).",
    example: "Investasi Rp 10.000.000 dengan imbal hasil 10% per tahun. Di tahun ke-1 dapat Rp 1.000.000 (total Rp 11 jt). Di tahun ke-2 bukan lagi dapat Rp 1 jt, melainkan 10% dari Rp 11 jt = Rp 1.100.000.",
    formula: "A = P × (1 + r/n)^(n×t)",
    relatedTerms: ["Rule of 72", "Dollar Cost Averaging", "Time Value of Money"],
    moduleId: "compound",
    antiMisleading: "Bunga majemuk membutuhkan horizon waktu tahunan bahkan puluhan tahun agar terasa dampaknya secara signifikan. Waspadai tawaran investasi bodong yang menjanjikan bunga majemuk harian pasti untung!"
  },
  {
    id: 'dana-darurat',
    term: "Dana Darurat (Emergency Fund)",
    category: "Pondasi Finansial",
    simpleExplanation: "Tabungan khusus yang dipisahkan dan hanya boleh disentuh saat terjadi kejadian tak terduga seperti sakit mendadak atau kehilangan pekerjaan.",
    advancedExplanation: "Cadangan likuiditas minimum (setara 3-12 bulan pengeluaran rutin) yang dialokasikan pada instrumen tanpa risiko volatilitas pasar modal demi melindungi portofolio jangka panjang dari likuidasi paksa di saat kondisi pasar crash.",
    example: "Pengeluaran rutin bulanan seorang lajang Rp 4.000.000. Dana darurat ideal minimal 3 × Rp 4.000.000 = Rp 12.000.000, disimpan di rekening terpisah atau Reksa Dana Pasar Uang (RDPU).",
    formula: "Target Dana Darurat = Pengeluaran Bulanan × (3 s.d. 12 bulan)",
    relatedTerms: ["Rasio Likuiditas", "Reksa Dana Pasar Uang", "Cashflow"],
    moduleId: "emergency",
    antiMisleading: "Dana darurat tidak boleh ditaruh di saham berisiko tinggi atau kripto karena jika terjadi krisis di saat pasar jatuh, nilainya akan tergerus saat harus dicairkan mendesak."
  },
  {
    id: 'aturan-50-30-20',
    term: "Aturan Budgeting 50/30/20",
    category: "Pondasi Finansial",
    simpleExplanation: "Panduan membagi gaji: 50% untuk kebutuhan pokok, 30% untuk keinginan/lifestyle, dan 20% untuk tabungan & investasi.",
    advancedExplanation: "Kerangka kerja alokasi arus kas proporsional yang dipopulerkan oleh Elizabeth Warren untuk memastikan stabilitas keuangan dengan membatasi biaya hidup tetap (Needs ≤ 50%), mengendalikan pengeluaran diskresioner (Wants ≤ 30%), dan mengunci akumulasi aset (Savings/Debt Repayment ≥ 20%).",
    example: "Gaji bersih Rp 5.000.000: Rp 2.500.000 untuk kos, makan pokok, listrik, transport; Rp 1.500.000 untuk nongkrong, streaming, hobi; Rp 1.000.000 untuk tabungan dana darurat / reksa dana.",
    formula: "Kebutuhan (50%) + Keinginan (30%) + Tabungan/Investasi (20%) = 100% Penghasilan",
    relatedTerms: ["Cashflow", "Sistem Amplop Digital", "Latte Factor"],
    moduleId: "budgeting",
    antiMisleading: "Aturan 50/30/20 adalah pedoman fleksibel. Bagi yang memiliki cicilan utang tinggi, porsi keinginan sebaiknya dipangkas untuk melunasi utang terlebih dahulu."
  },
  {
    id: 'dti-ratio',
    term: "Debt-to-Income Ratio (DTI)",
    category: "Manajemen Risiko & Utang",
    simpleExplanation: "Persentase gaji bulanan yang habis digunakan untuk membayar cicilan utang.",
    advancedExplanation: "Rasio kelayakan kredit dan beban utang yang mengukur proporsi pembayaran kewajiban utang bulanan terhadap total pendapatan kotor atau bersih bulanan. Batas sehat perbankan di Indonesia adalah di bawah 30-35%.",
    example: "Gaji Rp 6.000.000 per bulan, cicilan paylater & KPR total Rp 1.800.000. Maka DTI = (1.800.000 / 6.000.000) × 100% = 30% (Batas Aman).",
    formula: "DTI = (Total Cicilan Bulanan / Pendapatan Bulanan) × 100%",
    relatedTerms: ["Debt Snowball", "Paylater & Pinjol", "Financial Health Score"],
    moduleId: "debt",
    antiMisleading: "DTI di atas 40% sangat berbahaya karena sedikit saja kenaikan biaya hidup atau perlambatan ekonomi dapat memicu gagal bayar (default)."
  },
  {
    id: 'fire-number',
    term: "FIRE Number (Financial Independence, Retire Early)",
    category: "Perencanaan Masa Depan",
    simpleExplanation: "Jumlah total kekayaan bersih yang harus Anda kumpulkan agar hasil investasinya dapat membiayai seluruh kebutuhan hidup Anda seumur hidup tanpa perlu bekerja lagi.",
    advancedExplanation: "Target akumulasi modal berdasarkan Trinity Study yang menggunakan 'Aturan 4% Safe Withdrawal Rate (SWR)'. Nilai ini setara dengan 25 kali total pengeluaran tahunan seseorang.",
    example: "Pengeluaran hidup Anda Rp 60.000.000 per tahun (Rp 5.000.000/bulan). FIRE Number Anda adalah 25 × Rp 60.000.000 = Rp 1.500.000.000.",
    formula: "FIRE Number = Pengeluaran Tahunan × 25 (atau Pengeluaran Tahunan / SWR%)",
    relatedTerms: ["Safe Withdrawal Rate (SWR)", "Compound Interest", "Asset Allocation"],
    moduleId: "investing",
    antiMisleading: "Menghitung FIRE wajib memperhitungkan inflasi masa depan dan kenaikan biaya kesehatan. Menggunakan angka biaya hidup hari ini tanpa penyesuaian inflasi adalah kesalahan fatal."
  },
  {
    id: 'rule-of-72',
    term: "Rule of 72 (Aturan 72)",
    category: "Pondasi Finansial",
    simpleExplanation: "Rumus cepat untuk memperkirakan berapa tahun yang dibutuhkan agar uang investasi Anda berlipat ganda menjadi 2 kali lipat.",
    advancedExplanation: "Aproksimasi matematis dari fungsi logaritma natural ln(2) / ln(1 + r) yang membagi angka 72 dengan tingkat imbal hasil tahunan (dalam persen) untuk mengetahui periode penggandaan modal.",
    example: "Investasi di instrumen dengan imbal hasil 8% per tahun. Waktu yang dibutuhkan agar uang berlipat 2x adalah 72 / 8 = 9 tahun.",
    formula: "Tahun Penggandaan = 72 / Tingkat Imbal Hasil (%)",
    relatedTerms: ["Compound Interest", "Inflasi"],
    moduleId: "compound",
    antiMisleading: "Aturan 72 adalah estimasi cepat dan paling akurat pada rentang imbal hasil antara 4% hingga 15% per tahun."
  },
  {
    id: 'dca-strategy',
    term: "Dollar Cost Averaging (DCA)",
    category: "Investasi",
    simpleExplanation: "Strategi menabung investasi dalam jumlah uang yang sama secara rutin di tanggal yang sama, tanpa peduli harga pasar sedang naik atau turun.",
    advancedExplanation: "Pendekatan investasi sistematis di mana investor membeli aset dalam interval waktu yang konsisten terlepas dari volatilitas pasar, sehingga menurunkan harga beli rata-rata per unit dan mengeliminasi risiko psikologis market timing.",
    example: "Membeli Reksa Dana Saham sebesar Rp 500.000 setiap tanggal 25 setelah gajian. Saat harga turun dapat lebih banyak unit, saat harga naik dapat lebih sedikit unit.",
    formula: "Harga Rata-Rata = Total Modal yang Dikeluarkan / Total Unit yang Diperoleh",
    relatedTerms: ["Lump Sum", "Diversifikasi", "Profil Risiko"],
    moduleId: "investing",
    antiMisleading: "DCA efektif untuk instrumen aset yang memiliki tren jangka panjang positif (seperti IHSG / S&P 500 / Reksa Dana Indeks). DCA pada saham gorengan yang sedang bangkrut justru akan memperbesar kerugian."
  },
  {
    id: 'reksadana',
    term: "Reksa Dana (Mutual Fund)",
    category: "Investasi",
    simpleExplanation: "Wadah untuk mengumpulkan dana bersama investor lain yang kemudian dikelola oleh manajer investasi profesional untuk dibelikan saham, obligasi, atau pasar uang.",
    advancedExplanation: "Entitas kolektif investasi berbadan hukum (KIK - Kontrak Investasi Kolektif) yang diawasi oleh OJK, di mana portofolio efek dikelola oleh Manajer Investasi (MI) dan aset disimpan secara aman oleh Bank Kustodian.",
    example: "Membeli Reksa Dana Pendapatan Tetap dengan modal mulai Rp 10.000, dana Anda otomatis disebarkan ke puluhan seri obligasi pemerintah dan korporasi berperingkat tinggi.",
    formula: "NAB per Unit = (Total Aset Bersih Reksa Dana - Biaya Operasional) / Total Unit Penyertaan",
    relatedTerms: ["Expense Ratio", "Bank Kustodian", "NAB"],
    moduleId: "reksadana",
    antiMisleading: "Cek Expense Ratio di prospektus resmi. Kinerja masa lalu tidak menjamin hasil masa depan, namun mencerminkan konsistensi manajer investasi."
  },
  {
    id: 'saham-analisis',
    term: "Saham & Analisis Fundamental",
    category: "Pasar Modal",
    simpleExplanation: "Bukti kepemilikan sebagian kecil dari sebuah perusahaan nyata, di mana keuntungan diperoleh dari kenaikan harga saham (capital gain) dan pembagian laba (dividen).",
    advancedExplanation: "Instrumen ekuitas yang merepresentasikan hak klaim atas aset dan laba emiten. Analisis fundamental mengevaluasi laporan keuangan (Neraca, Laba Rugi, Arus Kas), rasio valuasi (PER, PBV), serta keunggulan kompetitif (moat) bisnis.",
    example: "Membeli 10 lot saham PT Bank Rakyat Indonesia Tbk (BBRI). Anda berhak hadir di RUPS dan menerima dividen tunai tahunan sesuai proporsi kepemilikan lembar saham.",
    formula: "Price to Earnings Ratio (PER) = Harga Saham / Laba Bersih per Saham (EPS)",
    relatedTerms: ["Dividen Yield", "Capital Gain", "IHSG"],
    moduleId: "saham",
    antiMisleading: "Saham berfluktuasi setiap hari. Menaruh 100% uang belanja di satu saham gorengan tanpa analisis fundamental adalah spekulasi judi berisiko kehilangan seluruh modal."
  },
  {
    id: 'sbn-obligasi',
    term: "SBN & Obligasi (Surat Berharga Negara)",
    category: "Investasi",
    simpleExplanation: "Surat utang yang diterbitkan oleh Pemerintah Indonesia di mana kita meminjamkan uang dan mendapatkan imbalan bunga/kupon bulanan yang dijamin negara.",
    advancedExplanation: "Instrumen surat pengakuan utang berjangka (seperti ORI, SR, SBR, ST) yang pembayaran pokok dan imbalannya dijamin penuh oleh Undang-Undang APBN Republik Indonesia, menjadikannya salah satu aset investasi teraman bebas risiko gagal bayar negara.",
    example: "Membeli Sukuk Ritel SR020 senilai Rp 10.000.000 dengan kupon tetap 6.4% per tahun. Setiap bulan Anda menerima transfer kupon pasif langsung ke rekening bank Anda.",
    formula: "Kupon Bulanan = (Modal Investasi × Tingkat Kupon Tahunan × (1 - Pajak 10%)) / 12",
    relatedTerms: ["Reksa Dana", "Yield", "Deposito Syariah"],
    moduleId: "reksadana",
    antiMisleading: "Meskipun aman dari risiko gagal bayar, perhatikan tipe SBN: tipe non-tradable (seperti SBR dan ST) tidak bisa dijual sebelum jatuh tempo kecuali memanfaatkan fasilitas early redemption."
  },
  {
    id: 'crypto-web3',
    term: "Aset Kripto & Web3",
    category: "Pasar Modal",
    simpleExplanation: "Mata uang dan aset digital yang diamankan dengan teknologi blockchain terdesentralisasi tanpa otoritas bank sentral tunggal.",
    advancedExplanation: "Aset digital kriptografis yang beroperasi di atas jaringan peer-to-peer terdistribusi (seperti Bitcoin dan Ethereum) menggunakan mekanisme konsensus Proof of Work atau Proof of Stake. Di Indonesia diatur oleh Bappebti sebagai komoditas perdagangan berjangka.",
    example: "Membeli Bitcoin (BTC) sebagai aset digital terdesentralisasi dengan suplai terbatas 21 juta koin untuk diversifikasi portofolio risiko tinggi.",
    formula: "Market Cap Kripto = Harga Koin Saat Ini × Total Koin Beredar (Circulating Supply)",
    relatedTerms: ["Blockchain", "Volatilitas", "Profil Risiko"],
    moduleId: "crypto",
    antiMisleading: "Aset kripto memiliki volatilitas ekstrem (bisa turun >50% dalam hitungan hari) dan rawan proyek scam/rug-pull. Jangan alokasikan lebih dari 5-10% dari total portofolio Anda jika belum memahami risikonya."
  },
  {
    id: 'net-worth',
    term: "Net Worth (Kekayaan Bersih)",
    category: "Pondasi Finansial",
    simpleExplanation: "Jumlah total seluruh uang dan harta yang Anda miliki dikurangi dengan seluruh utang dan cicilan yang belum lunas.",
    advancedExplanation: "Metrik absolut kesehatan finansial yang menghitung selisih antara Total Nilai Pasar Seluruh Aset (kas, investasi, properti, barang berharga) dengan Total Liabilitas (KPR, pinjol, kartu kredit, utang pribadi).",
    example: "Total aset Anda Rp 50.000.000 (tabungan Rp 10 jt + motor Rp 15 jt + reksa dana Rp 25 jt). Total sisa utang motor Rp 8.000.000. Kekayaan bersih Anda adalah Rp 42.000.000.",
    formula: "Net Worth = Total Aset (Aktiva) - Total Liabilitas (Utang)",
    relatedTerms: ["Aset", "Liabilitas", "Financial Health Score"],
    moduleId: "portfolio",
    antiMisleading: "Barang konsumtif yang nilainya terus turun (depresiasi cepat seperti pakaian atau gawai lama) tidak boleh dicatat dengan nilai beli baru dalam perhitungan kekayaan bersih."
  }
];
