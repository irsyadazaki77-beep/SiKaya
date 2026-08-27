export interface LessonContent {
  id: string;
  title: string;
  subtitle: string;
  introduction: string;
  keyTakeaways: string[];
  detailedSections: {
    title: string;
    content: string;
  }[];
  sources: {
    name: string;
    description: string;
  }[];
}

export const featureLessons: { [key: string]: LessonContent } = {
  "Modul Dasar Finansial": {
    id: `dasar_finansial`,
    title: `Modul Dasar Finansial`,
    subtitle: `Seni Mengatur Arus Kas & Budgeting 50/30/20`,
    introduction: `Langkah pertama menuju kebebasan finansial bukan tentang seberapa besar investasi Anda, melainkan seberapa baik Anda mengelola uang masuk dan keluar setiap bulan. Tanpa fondasi arus kas yang sehat, investasi Anda hanya akan menjadi spekulasi berisiko tinggi.`,
    keyTakeaways: [
      `Bedakan secara tegas antara Kebutuhan (Needs), Keinginan (Wants), dan Tabungan/Investasi (Savings).`,
      `Gunakan metode 50/30/20 sebagai baseline sederhana namun sangat efektif.`,
      `Lacak setiap pengeluaran terkecil sekalipun untuk menghindari fenomena kebocoran halus (latte factor).`
    ],
    detailedSections: [
      {
        title: `Memahami Aturan 50/30/20`,
        content: `Dipopulerkan oleh Senator Elizabeth Warren dalam bukunya 'All Your Worth', metode ini membagi pendapatan setelah pajak menjadi tiga kategori utama:\n\n1. 50% untuk Kebutuhan Pokok (Needs): Makanan, cicilan rumah/kontrakan, tagihan utilitas, asuransi dasar, dan transportasi minimum.\n2. 30% untuk Keinginan (Wants): Hiburan, makan di restoran, langganan streaming, hobi, dan gaya hidup.\n3. 20% untuk Tabungan & Investasi (Savings): Dana darurat, investasi saham/reksadana, dan pelunasan utang non-hipotek.`
      },
      {
        title: `Menghindari Latte Factor`,
        content: `Latte Factor adalah pengeluaran kecil harian yang tidak disadari namun memiliki dampak besar secara akumulatif. Contoh: Kopi kekinian seharga Rp 40.000 setiap hari kerja. Dalam sebulan (20 hari kerja), ini mencapai Rp 800.000. Jika diinvestasikan dengan bunga majemuk 8% per tahun selama 10 tahun, nilainya bisa tumbuh menjadi puluhan juta rupiah!`
      }
    ],
    sources: [
      { name: `Otoritas Jasa Keuangan (OJK)`, description: `Buku Saku Perencanaan Keuangan Keluarga tentang teknik penyusunan anggaran bulanan mandiri.` },
      { name: `All Your Worth: The Ultimate Lifetime Money Plan`, description: `Elizabeth Warren & Amelia Warren Tyagi (Aturan alokasi 50/30/20).` }
    ]
  },
  "Panduan Dana Darurat": {
    id: `dana_darurat`,
    title: `Panduan Dana Darurat`,
    subtitle: `Membangun Jaring Pengaman Finansial yang Kokoh`,
    introduction: `Dana darurat (Emergency Fund) adalah uang tunai yang disisihkan khusus untuk keadaan mendesak yang tidak terduga, seperti kehilangan pekerjaan, kecelakaan medis, atau kerusakan aset penting. Ini adalah perisai pelindung agar Anda tidak terjerumus ke dalam utang konsumtif saat krisis melanda.`,
    keyTakeaways: [
      `Dana darurat wajib disimpan di instrumen yang sangat likuid dan bebas risiko (tabungan biasa, deposito harian, atau reksadana pasar uang).`,
      `Jumlah ideal bervariasi antara 3 hingga 12 kali pengeluaran bulanan tergantung tanggung jawab keluarga.`,
      `Jangan pernah menggunakan dana darurat untuk investasi atau keinginan konsumtif.`
    ],
    detailedSections: [
      {
        title: `Berapa Jumlah Ideal Dana Daruratmu?`,
        content: `Aturan umum dari perencana keuangan profesional bersertifikat:\n\n• Lajang (Tanpa Tanggungan): Minimal 3 hingga 6 kali pengeluaran bulanan.\n• Menikah (Tanpa Anak): Minimal 6 kali pengeluaran bulanan.\n• Menikah (Memiliki Anak): Minimal 9 hingga 12 kali pengeluaran bulanan.\n• Freelancer / Pengusaha: Minimal 12 kali pengeluaran bulanan karena ketidakpastian arus pendapatan harian.`
      },
      {
        title: `Tempat Menyimpan Dana Darurat`,
        content: `Prioritas utama penyimpanan adalah LIKUIDITAS (kemudahan dicairkan) dan KEAMANAN POKOK (tidak berfluktuasi). Pilihan terbaik:\n\n1. Rekening Bank Terpisah: Bebas biaya admin bulanan untuk mencegah erosi saldo.\n2. Deposito Berjangka: Dengan jangka waktu pendek (misal 1 bulan).\n3. Reksadana Pasar Uang (RDPU): Sangat aman, potensi return sedikit di atas deposito, dan bebas pajak.`
      }
    ],
    sources: [
      { name: `Standard Certified Financial Planner (CFP) Board`, description: `Pedoman Penentuan Rasio Likuiditas & Kebutuhan Dana Darurat Keluarga Sehat.` },
      { name: `OJK Indonesia`, description: `Modul Literasi Keuangan Kelas Menengah tentang pentingnya dana darurat sebelum memulai investasi.` }
    ]
  },
  "Mindset Investor": {
    id: `mindset_investor`,
    title: `Mindset Investor`,
    subtitle: `Psikologi Keuangan & Mengendalikan FOMO`,
    introduction: `Banyak investor pemula gagal bukan karena kurang pintar secara teknis, tetapi karena tidak bisa mengendalikan emosi mereka. Di pasar keuangan, ketakutan (Fear) dan ketamakan (Greed) adalah musuh terbesar Anda. Memiliki mindset jangka panjang adalah kunci keberhasilan sejati.`,
    keyTakeaways: [
      `FOMO (Fear of Missing Out) adalah pemicu utama pembelian aset di harga puncak yang berujung kerugian besar.`,
      `Investasi adalah maraton, bukan sprint pendek untuk cepat kaya.`,
      `Diversifikasi portofolio adalah satu-satunya 'makan siang gratis' di dunia keuangan.`
    ],
    detailedSections: [
      {
        title: `Memahami Bias Kognitif dalam Berinvestasi`,
        content: `Beberapa bias psikologis populer yang sering merusak portofolio:\n\n• Loss Aversion: Dorongan emosional menghindari kerugian jauh lebih kuat daripada kepuasan mendapat keuntungan, membuat orang menahan aset bermasalah terlalu lama.\n• Confirmation Bias: Hanya mencari berita positif yang mendukung keputusan investasi kita, mengabaikan tanda-tanda bahaya nyata.\n• Herding Behavior: Mengikuti keputusan keramaian (ikut-ikutan influencer/pom-pom) tanpa melakukan analisis mandiri (DYOR).`
      },
      {
        title: `Filosofi 'Waktu di Pasar' (Time in the Market)`,
        content: `Mencoba memprediksi naik turunnya pasar (Market Timing) hampir selalu berujung kegagalan bagi investor retail. Data historis membuktikan bahwa investor yang konsisten melakukan Dollar-Cost Averaging (DCA) atau investasi berkala secara jangka panjang selalu mengalahkan mereka yang mencoba berspekulasi mencari waktu termurah.`
      }
    ],
    sources: [
      { name: `Thinking, Fast and Slow - Daniel Kahneman`, description: `Pemenang Nobel Ekonomi tentang psikologi pengambilan keputusan keuangan dan bias kognitif manusia.` },
      { name: `The Psychology of Money - Morgan Housel`, description: `Buku legendaris tentang bagaimana perilaku dan emosi mempengaruhi keputusan keuangan jauh lebih besar daripada rumus matematika keuangan.` }
    ]
  },
  "Pengenalan Saham": {
    id: `pengenalan_saham`,
    title: `Pengenalan Saham`,
    subtitle: `Dasar-Dasar Kepemilikan Bisnis & Analisis Saham`,
    introduction: `Membeli saham berarti Anda membeli porsi kepemilikan riil dari suatu perusahaan. Saham bukan sekadar kode 4 huruf di layar HP yang naik turun tanpa alasan, melainkan representasi bisnis nyata yang memproduksi barang, mempekerjakan karyawan, dan menghasilkan keuntungan.`,
    keyTakeaways: [
      `Ada dua sumber keuntungan utama saham: Capital Gain (kenaikan harga) dan Dividen (pembagian laba bersih perusahaan).`,
      `Gunakan analisis fundamental untuk menilai kesehatan bisnis perusahaan sebelum membeli sahamnya.`,
      `Harga saham jangka panjang selalu mengikuti kinerja pertumbuhan laba bersih perusahaan tersebut.`
    ],
    detailedSections: [
      {
        title: `Perbedaan Analisis Fundamental vs. Teknikal`,
        content: `• Analisis Fundamental: Berfokus pada laporan keuangan, rasio utang, pertumbuhan laba, keunggulan kompetitif (moat), dan manajemen perusahaan. Sangat cocok untuk investor jangka panjang.\n• Analisis Teknikal: Berfokus pada chart pergerakan harga historis, volume transaksi, dan tren pasar jangka pendek menggunakan indikator seperti Moving Average (MA) atau RSI. Sangat cocok untuk trader aktif.`
      },
      {
        title: `Rasio Keuangan Utama yang Wajib Diketahui`,
        content: `1. Price to Earnings Ratio (PER): Menilai murah/mahalnya harga saham dibanding laba per saham.\n2. Return on Equity (ROE): Mengukur efisiensi perusahaan dalam menghasilkan keuntungan dari modal investor.\n3. Debt to Equity Ratio (DER): Menilai tingkat kesehatan utang perusahaan dibanding modalnya.`
      }
    ],
    sources: [
      { name: `Bursa Efek Indonesia (BEI)`, description: `Panduan Pemula Sekolah Pasar Modal (SPM) Kelas Fundamental Saham.` },
      { name: `The Intelligent Investor - Benjamin Graham`, description: `Buku wajib yang diakui oleh Warren Buffett sebagai kitab suci dasar-dasar Value Investing.` }
    ]
  },
  "Reksa Dana 101": {
    id: `reksa_dana`,
    title: `Reksa Dana 101`,
    subtitle: `Solusi Praktis untuk Diversifikasi Instan & Otomatis`,
    introduction: `Reksa Dana adalah wadah yang dipergunakan untuk menghimpun dana dari masyarakat pemodal untuk selanjutnya diinvestasikan dalam Portofolio Efek oleh Manajer Investasi (MI) profesional yang berizin resmi OJK. Sangat cocok untuk pemula yang belum memiliki banyak waktu untuk riset saham individual.`,
    keyTakeaways: [
      `Cocok untuk pemula dengan modal awal yang sangat terjangkau (bisa mulai dari Rp 10.000).`,
      `Diversifikasi otomatis mengurangi risiko kejatuhan nilai investasi secara drastis.`,
      `Pilih jenis reksa dana yang sesuai dengan profil risiko dan jangka waktu target keuangan Anda.`
    ],
    detailedSections: [
      {
        title: `Jenis-Jenis Reksa Dana di Indonesia`,
        content: `1. Reksa Dana Pasar Uang (RDPU): Investasi pada deposito bank dan obligasi jangka pendek (< 1 tahun). Sangat stabil, rendah risiko, cocok untuk target jangka pendek (< 1 tahun).\n2. Reksa Dana Pendapatan Tetap (RDPT): Investasi minimal 80% pada obligasi (surat utang) pemerintah atau korporasi. Risiko moderat, return stabil, cocok untuk jangka menengah (1-3 tahun).\n3. Reksa Dana Campuran (RDC): Investasi kombinasi saham, obligasi, dan pasar uang. Risiko menengah-tinggi.\n4. Reksa Dana Saham (RDS): Investasi minimal 80% pada saham. Risiko tinggi, potensi return jangka panjang sangat besar, cocok untuk jangka panjang (> 5 tahun).`
      },
      {
        title: `Tips Memilih Manajer Investasi (MI) yang Baik`,
        content: `Selalu periksa lembar informasi bulanan (Fund Fact Sheet):\n\n• Cari MI yang memiliki Asset Under Management (AUM) atau dana kelolaan yang besar dan bereputasi.\n• Perhatikan tingkat biaya manajemen (Expense Ratio) - semakin rendah, semakin efisien bagi hasil return pemodal.\n• Bandingkan kinerja historis reksa dana tersebut dengan benchmark indikasinya (misal IHSG).`
      }
    ],
    sources: [
      { name: `Undang-Undang Pasar Modal No. 8 Tahun 1995`, description: `Definisi, legalitas, regulasi, dan hak-hak investor dalam produk Reksa Dana di Indonesia.` },
      { name: `Otoritas Jasa Keuangan (OJK)`, description: `Sistem Informasi Reksa Dana (Sinergi) tentang pengawasan Manajer Investasi aktif.` }
    ]
  },
  "Kalkulator Compound Interest": {
    id: `compound_interest`,
    title: `Kalkulator Compound Interest`,
    subtitle: `Memahami Kedahsyatan Efek Bola Salju Finansial`,
    introduction: `Albert Einstein kabarnya menyebut bunga majemuk (Compound Interest) sebagai keajaiban dunia kedelapan. Siapa yang memahaminya akan mendapatkannya, siapa yang tidak memahaminya akan membayarnya. Ini adalah konsep di mana bunga investasi Anda menghasilkan bunga kembali secara berulang.`,
    keyTakeaways: [
      `Bunga majemuk adalah kunci utama pertumbuhan eksponensial kekayaan jangka panjang.`,
      `Faktor penentu terbesar dalam formula bunga majemuk adalah WAKTU, bukan sekadar nominal modal awal.`,
      `Mulai sedini mungkin memberikan dampak yang luar biasa besar karena efek penggandaan di tahun-tahun akhir.`
    ],
    detailedSections: [
      {
        title: `Formula Matematika Bunga Majemuk`,
        content: `Formula standar bunga majemuk adalah:\n\nA = P (1 + r/n)^(nt)\n\nDimana:\n• A = Jumlah akhir (Nilai masa depan)\n• P = Modal awal (Principal)\n• r = Tingkat bunga tahunan (Desimal)\n• n = Frekuensi pemajemukan bunga per tahun\n• t = Jangka waktu tahunan\n\nKarena variabel waktu (t) berada di posisi eksponen (pangkat), maka pertumbuhan aset Anda tidak bergerak lurus (linear), melainkan melengkung ke atas secara tajam (eksponensial).`
      },
      {
        title: `Kisah Dua Sahabat: Ali dan Budi`,
        content: `• Ali mulai berinvestasi Rp 1.000.000/bulan pada usia 20 tahun dan berhenti di usia 30 tahun (total investasi Rp 120 juta). Dengan return 10% per tahun, di usia 60 tahun uang Ali tumbuh menjadi sekitar Rp 2,2 Miliar!\n• Budi baru mulai berinvestasi Rp 1.000.000/bulan pada usia 30 tahun dan terus berinvestasi hingga usia 60 tahun (total investasi Rp 360 juta). Di usia 60 tahun, uang Budi hanya tumbuh menjadi sekitar Rp 1,9 Miliar!\n\nMeskipun Ali menyetor uang 3 kali lipat lebih sedikit dibanding Budi, Ali menang karena memulai 10 tahun lebih awal!`
      }
    ],
    sources: [
      { name: `Principles of Corporate Finance - Brealey, Myers, Allen`, description: `Buku teks keuangan universitas global tentang prinsip Time Value of Money (Nilai Waktu dari Uang).` },
      { name: `OJK Sikapi`, description: `Artikel Literasi Keuangan tentang konsep bunga majemuk dan perencanaan dana hari tua.` }
    ]
  },
  "Game Trading Virtual": {
    id: `trading_virtual`,
    title: `Game Trading Virtual`,
    subtitle: `Berlatih Trading Saham Tanpa Risiko Kehilangan Uang Asli`,
    introduction: `Belajar teori tanpa praktik langsung seringkali kurang efektif. Game Trading Virtual dirancang untuk memberikan pengalaman bertransaksi yang sepenuhnya aman menggunakan simulasi harga pasar waktu nyata. Anda bisa bereksperimen, membuat kesalahan, dan menguji strategi trading Anda tanpa risiko finansial.`,
    keyTakeaways: [
      `Praktik langsung membantu membiasakan diri dengan antarmuka beli (Buy) dan jual (Sell) sebelum terjun dengan uang asli.`,
      `Uji berbagai strategi teknikal (scalping, swing trading, atau position trading) dalam kondisi pasar riil.`,
      `Belajar mengendalikan emosi ketika melihat nilai portofolio virtual naik atau turun tajam.`
    ],
    detailedSections: [
      {
        title: `Strategi Dasar Sebelum Mulai Transaksi`,
        content: `1. Manajemen Risiko (Position Sizing): Jangan menempatkan seluruh modal virtual Anda pada satu saham saja. Batasi maksimal 10% modal untuk satu posisi.\n2. Stop Loss & Take Profit: Tentukan batas toleransi kerugian (misal maksimal rugi 5%) dan target keuntungan yang realistis sejak awal sebelum mengklik tombol beli.\n3. Jurnal Trading: Catat alasan Anda membeli suatu saham virtual untuk dievaluasi kinerjanya di kemudian hari.`
      },
      {
        title: `Memahami Bid dan Ask (Antrean Harga)`,
        content: `Di pasar saham, Anda akan melihat papan antrean:\n\n• Bid: Daftar harga antrean orang yang ingin MEMBELI saham. Jika ingin langsung memiliki saham instan, belilah di harga Ask terendah (HAKA - Hajar Kanan).\n• Ask (Offer): Daftar harga antrean orang yang ingin MENJUAL saham. Jika ingin langsung menjual instan, juallah di harga Bid tertinggi (HAKI - Hajar Kiri).`
      }
    ],
    sources: [
      { name: `Bursa Efek Indonesia (BEI)`, description: `Panduan Penggunaan Sistem Online Trading System (COTS) untuk transaksi pasar modal Indonesia.` },
      { name: `Technical Analysis of the Financial Markets - John J. Murphy`, description: `Kitab panduan komprehensif analisis teknikal untuk menentukan titik masuk dan keluar pasar.` }
    ]
  },
  "Kuis Literasi Keuangan": {
    id: `kuis_literasi`,
    title: `Kuis Literasi Keuangan`,
    subtitle: `Uji Sejauh Mana Pemahaman Finansialmu!`,
    introduction: `Literasi keuangan bukan sekadar teori hafalan, melainkan kecakapan dalam mengambil keputusan praktis sehari-hari. Kuis ini dirancang untuk menantang pemahamanmu tentang manajemen uang pribadi, investasi, utang, dan asuransi secara objektif.`,
    keyTakeaways: [
      `Menguji pemahaman objektif berdasarkan studi kasus kehidupan nyata.`,
      `Menemukan celah dalam pengetahuan keuangan Anda yang perlu diperbaiki.`,
      `Mendapatkan sertifikat digital virtual internal sebagai apresiasi atas tingkat kompetensi literasi.`
    ],
    detailedSections: [
      {
        title: `Tiga Pilar Utama Survei Literasi Nasional`,
        content: `Menurut standar OJK dan OECD (Organisation for Economic Co-operation and Development):\n\n1. Pengetahuan Keuangan (Financial Knowledge): Pemahaman dasar tentang inflasi, suku bunga, bunga majemuk, dan diversifikasi.\n2. Perilaku Keuangan (Financial Behavior): Kebiasaan melacak pengeluaran, membayar tagihan tepat waktu, membuat perencanaan anggaran.\n3. Sikap Keuangan (Financial Attitude): Bagaimana Anda memandang masa depan vs kesenangan instan jangka pendek (delayed gratification).`
      }
    ],
    sources: [
      { name: `OJK Survei Nasional Literasi dan Inklusi Keuangan (SNLIK)`, description: `Metodologi dan indikator penilaian tingkat kecakapan literasi keuangan masyarakat Indonesia.` },
      { name: `OECD INFE (International Network on Financial Education)`, description: `Standar penilaian kecakapan finansial global untuk anak muda dan dewasa.` }
    ]
  },
  "Forum Diskusi Gen Z": {
    id: `forum_diskus`,
    title: `Forum Diskusi Gen Z`,
    subtitle: `Ruang Aman Berbagi Tips Finansial Anak Muda`,
    introduction: `Membicarakan uang seringkali dianggap tabu di masyarakat. Forum Diskusi Gen Z hadir sebagai wadah inklusif dan ramah untuk bertukar cerita, tips hemat anak kos, cara negosiasi gaji pertama, hingga strategi investasi pemula bersama ribuan anak muda lainnya secara sehat.`,
    keyTakeaways: [
      `Komunitas membantu Anda merasa tidak sendirian dalam menghadapi tantangan ekonomi generasi saat ini.`,
      `Dapatkan tips praktis sehari-hari (frugal living, resep hemat, trik mencari tambahan income).`,
      `Gunakan fitur ini untuk belajar dari kesalahan finansial orang lain agar Anda tidak perlu mengalaminya sendiri.`
    ],
    detailedSections: [
      {
        title: `Etika Berdiskusi Keuangan yang Sehat`,
        content: `• Saling Menghargai: Setiap orang memiliki latar belakang ekonomi dan garis start yang berbeda. Hindari merendahkan orang lain.\n• No Financial Advice (Bukan Saran Keuangan Resmi): Gunakan diskusi sebagai bahan referensi belajar, bukan instruksi mutlak beli/jual aset.\n• Waspada Penipuan / Spam: Jangan pernah membagikan nomor rekening, data pribadi KTP, atau kode OTP kepada siapa pun di forum.`
      }
    ],
    sources: [
      { name: `Komunitas Frugal Living Indonesia`, description: `Prinsip hidup hemat berkualitas yang mengutamakan nilai manfaat barang dibanding gengsi sosial.` },
      { name: `Indonesia Gen Z Report`, description: `Analisis kebiasaan finansial, preferensi menabung, dan tantangan ekonomi generasi muda Indonesia.` }
    ]
  },
  "Webinar Mentor Ahli": {
    id: `webinar_mentor`,
    title: `Webinar Mentor Ahli`,
    subtitle: `Belajar Live Interaktif Bersama Ahli Finansial CFP & Praktisi`,
    introduction: `Ada kalanya membaca modul tertulis belum cukup memuaskan rasa ingin tahu Anda. SiKaya menyelenggarakan sesi webinar interaktif bulanan gratis bersama perencana keuangan bersertifikat (Certified Financial Planner - CFP) dan analis pasar modal profesional untuk membahas studi kasus nyata.`,
    keyTakeaways: [
      `Mendapatkan bimbingan langsung dari ahli yang memiliki lisensi kompetensi resmi.`,
      `Kesempatan emas untuk mengajukan pertanyaan kasus pribadi Anda secara langsung pada sesi tanya jawab (Q&A).`,
      `Pembahasan topik hangat terkini yang terjadi di pasar modal minggu ini secara langsung.`
    ],
    detailedSections: [
      {
        title: `Mengenal Perencana Keuangan Bersertifikat (CFP)`,
        content: `CFP adalah gelar profesional global di bidang perencanaan keuangan pribadi. Seorang CFP dilatih untuk menganalisis arus kas secara menyeluruh, perencanaan asuransi, perencanaan hari tua, pajak, waris, hingga rencana investasi nasabah secara objektif tanpa benturan kepentingan produk.`
      }
    ],
    sources: [
      { name: `FPSB Indonesia (Financial Planning Standards Board)`, description: `Asosiasi penyelenggara sertifikasi resmi profesi CFP® dan RFP® di Indonesia yang diakui secara global.` }
    ]
  },
  "Peta Jalan Karier Finansial": {
    id: `peta_jalan`,
    title: `Peta Jalan Karier Finansial`,
    subtitle: `Merancang Jalur Karier untuk Memaksimalkan Nilai Penghasilan`,
    introduction: `Seringkali orang terlalu fokus mencari return investasi 10-15% per tahun, padahal modalnya masih kecil. Cara tercepat melipatgandakan kekayaan di usia muda adalah dengan memaksimalkan pendapatan aktif (Active Income) melalui pengembangan karier dan keterampilan khusus.`,
    keyTakeaways: [
      `Investasi terbaik di usia muda adalah investasi pada leher ke atas (edukasi, keterampilan, sertifikasi).`,
      `Kombinasikan High-Income Skill dengan disiplin investasi berkala untuk menciptakan kekayaan jangka panjang.`,
      `Rancang peta jalan karier yang terukur dengan target kompensasi yang realistis.`
    ],
    detailedSections: [
      {
        title: `Pentingnya High-Income Skills`,
        content: `High-Income Skill adalah keahlian spesifik yang dihargai mahal oleh pasar tenaga kerja global karena membutuhkan kompetensi khusus. Contoh:\n\n• Pemrograman & Rekayasa Perangkat Lunak (Software Engineering)\n• Analisis Data & Kecerdasan Buatan (Data Analytics & AI)\n• Manajemen Produk (Product Management)\n• Copywriting & Digital Marketing Tingkat Lanjut`
      },
      {
        title: `Siklus Keuangan Karier`,
        content: `1. Fase Akumulasi (Usia 20-35): Fokus meningkatkan active harian dan keahlian profesi. Tabungan dialokasikan agresif ke aset pertumbuhan tinggi.\n2. Fase Konsolidasi (Usia 35-50): Portofolio mulai diseimbangkan dengan aset berpendapatan tetap.\n3. Fase Distribusi (Usia 50+): Menikmati dividen/bunga pasif untuk menopang kebutuhan hidup sehari-hari.`
      }
    ],
    sources: [
      { name: `Kementerian Ketenagakerjaan RI (Kemnaker)`, description: `Survei Tren Pekerjaan Masa Depan dengan Permintaan Tinggi dan Skala Kompensasi di Indonesia.` },
      { name: `The Millionaire Next Door - Thomas J. Stanley`, description: `Studi mendalam tentang bagaimana para jutawan mandiri membangun kekayaan mereka melalui kombinasi pendapatan profesional tinggi dan gaya hidup sederhana.` }
    ]
  },
  "Klinik Portofolio": {
    id: `klinik_portofolio`,
    title: `Klinik Portofolio`,
    subtitle: `Evaluasi Komprehensif Alokasi Aset Portofoliomu`,
    introduction: `Klinik Portofolio adalah ruang evaluasi interaktif di mana Anda dapat memasukkan alokasi portofolio Anda saat ini (saham, reksadana, emas, crypto, kas) untuk dinilai kesehatannya berdasarkan teori portofolio modern dan tingkat profil toleransi risikomu.`,
    keyTakeaways: [
      `Memastikan portofolio Anda tidak terlalu terkonsentrasi pada satu kelas aset yang berisiko ekstrem.`,
      `Menyeimbangkan kembali (rebalancing) portofolio secara berkala untuk mempertahankan rasio target risiko.`,
      `Menghindari tumpang tindih reksa dana (overlap) yang membuat diversifikasi menjadi tidak efektif.`
    ],
    detailedSections: [
      {
        title: `Teori Portofolio Modern (Modern Portfolio Theory - MPT)`,
        content: `Ditemukan oleh Harry Markowitz, teori ini menjelaskan bahwa dengan mengkombinasikan berbagai aset yang memiliki tingkat korelasi rendah (misal saham yang volatil dengan emas yang stabil), investor dapat meminimalkan risiko portofolio secara keseluruhan tanpa mengorbankan tingkat pengembalian (return) yang diharapkan.`
      },
      {
        title: `Konsep Rebalancing Portofolio`,
        content: `Ketika salah satu kelas aset naik sangat tajam (misal crypto melesat), porsi alokasinya dalam keseluruhan portofolio akan membengkak melebihi rencana awal (misal dari target 5% menjadi 30%). Rebalancing adalah tindakan menjual sebagian aset berkinerja tinggi tersebut untuk dipindahkan kembali ke kelas aset lain agar rasio risiko portofolio kembali sesuai profil awal investor.`
      }
    ],
    sources: [
      { name: `Modern Portfolio Theory - Harry Markowitz (Peraih Nobel Ekonomi)`, description: `Formulasi matematis hubungan optimal antara risiko (standar deviasi) dan tingkat pengembalian portofolio efek.` },
      { name: `OJK Regulasi Pasar Modal`, description: `Pedoman Penilaian Profil Risiko dan Kesesuaian Produk Investasi bagi Pemodal Ritel.` }
    ]
  }
,
  "Detektor Investasi Bodong": {
    id: `investasi_bodong`,
    title: `Detektor Investasi Bodong`,
    subtitle: `Mengenali dan Menghindari Skema Ponzi`,
    introduction: `Setiap tahun, masyarakat Indonesia kehilangan triliunan rupiah akibat investasi ilegal. Penipu bersembunyi di balik janji keuntungan fantastis yang tidak masuk akal dan memanfaatkan celah ketidaktahuan serta sifat serakah (greed).`,
    keyTakeaways: [
      `Prinsip utama: Jika terlalu indah untuk menjadi kenyataan (Too Good To Be True), maka itu pasti penipuan.`,
      `Waspadai janji 'Pasti Untung' (Fixed Return) tinggi per bulan tanpa risiko.`,
      `Selalu cek legalitas entitas di website resmi OJK (SikapiUangmu).`
    ],
    detailedSections: [
      {
        title: `Ciri-Ciri Skema Ponzi / Money Game`,
        content: `1. Janji imbal hasil tidak wajar (misal: 10% per bulan pasti cair).
2. Mengandalkan perekrutan anggota baru (member get member) dengan bonus referral besar.
3. Produk yang dijual hanya kedok, keuntungan sebenarnya dari setoran member baru.
4. Tidak memiliki izin dari regulator resmi (OJK, Bappebti, atau BI).`
      },
      {
        title: `Trik Psikologis Penipu`,
        content: `Penipu sering memamerkan kekayaan fiktif (flexing) seperti mobil mewah dan jam tangan mahal (seringkali sewaan) untuk menciptakan ilusi kesuksesan. Mereka juga sering menggunakan tokoh agama atau tokoh masyarakat sebagai endorsement agar terlihat kredibel.`
      }
    ],
    sources: [
      { name: `Satgas Waspada Investasi (SWI)`, description: `Daftar entitas investasi ilegal yang diblokir pemerintah.` },
      { name: `Catch Me If You Can - Frank Abagnale`, description: `Buku tentang sejarah dan metode penipuan finansial.` }
    ]
  },
  "Analisis Fundamental 101": {
    id: `analisis_fundamental`,
    title: `Analisis Fundamental 101`,
    subtitle: `Membaca Kesehatan Bisnis di Balik Saham`,
    introduction: `Analisis fundamental adalah metode menilai nilai intrinsik sebuah saham dengan memeriksa faktor ekonomi dan keuangan terkait. Tujuannya sederhana: mencari tahu apakah saham sebuah perusahaan sedang dijual lebih murah (undervalued) atau lebih mahal (overvalued) dari nilai aslinya.`,
    keyTakeaways: [
      `Laporan keuangan adalah rahasia dapur perusahaan; pelajari cara membacanya.`,
      `Fokus pada rasio valuasi seperti Price-to-Earnings (PER) dan Price-to-Book Value (PBV).`,
      `Perusahaan yang hebat adalah yang memiliki 'Economic Moat' (keunggulan kompetitif jangka panjang).`
    ],
    detailedSections: [
      {
        title: `3 Laporan Keuangan Utama`,
        content: `1. Laporan Laba Rugi (Income Statement): Menunjukkan pendapatan, beban, dan laba/rugi perusahaan selama satu periode.
2. Neraca (Balance Sheet): Potret aset, kewajiban (utang), dan ekuitas (modal bersih) pada waktu tertentu.
3. Laporan Arus Kas (Cash Flow): Melacak uang riil yang masuk dan keluar. Ingat: Laba bisa direkayasa secara akuntansi, tetapi arus kas tunai adalah fakta absolut.`
      },
      {
        title: `Rasio Penting untuk Pemula`,
        content: `• PER (Price to Earnings Ratio): Mengukur seberapa mahal harga saham dibandingkan laba bersih per saham. Semakin rendah semakin murah (secara umum).
• PBV (Price to Book Value): Membandingkan harga saham dengan nilai buku aset perusahaan.
• ROE (Return on Equity): Seberapa efisien manajemen menghasilkan laba dari modal investor.`
      }
    ],
    sources: [
      { name: `The Intelligent Investor - Benjamin Graham`, description: `Buku suci investasi nilai (Value Investing).` },
      { name: `One Up on Wall Street - Peter Lynch`, description: `Cara orang awam mengalahkan manajer investasi Wall Street dengan analisa sederhana.` }
    ]
  },
  "P2P Lending Guide": {
    id: `p2p_lending`,
    title: `P2P Lending Guide`,
    subtitle: `Menjadi Pendana Modern Pengganti Bank`,
    introduction: `Peer-to-Peer (P2P) Lending adalah platform yang mempertemukan pihak yang membutuhkan pinjaman (Borrower) dengan pihak yang ingin memberikan pinjaman (Lender). Ini adalah cara alternatif mengembangkan dana dengan memberikan pinjaman produktif ke UMKM atau pinjaman konsumtif.`,
    keyTakeaways: [
      `Return P2P Lending sangat menarik (10-18% per tahun) namun membawa risiko gagal bayar (default).`,
      `Diversifikasi (menyebar pinjaman ke ratusan peminjam berbeda) adalah kewajiban mutlak.`,
      `Hanya gunakan platform yang telah BERIZIN dan DIAWASI oleh OJK.`
    ],
    detailedSections: [
      {
        title: `Risiko Kredit Macet (NPL / TKB90)`,
        content: `Perhatikan angka TKB90 (Tingkat Keberhasilan Bayar 90 Hari) di setiap platform. TKB90 sebesar 98% artinya ada 2% pinjaman yang macet di atas 90 hari. Risiko ini sepenuhnya ditanggung oleh Anda sebagai Lender, kecuali ada asuransi pendanaan khusus dari platform.`
      },
      {
        title: `Strategi Mitigasi Risiko P2P`,
        content: `Jangan pernah menaruh Rp 10.000.000 pada 1 pinjaman/borrower. Lebih baik pecah menjadi Rp 100.000 ke 100 borrower yang berbeda. Pilihlah pinjaman produktif (pembiayaan invoice/modal kerja UMKM) dibandingkan pinjaman konsumtif (paylater orang pribadi) karena UMKM memiliki arus kas dari bisnis untuk membayar cicilan.`
      }
    ],
    sources: [
      { name: `Asosiasi Fintech Pendanaan Bersama Indonesia (AFPI)`, description: `Regulasi, etika penagihan, dan pedoman P2P Lending legal.` },
      { name: `Otoritas Jasa Keuangan (OJK)`, description: `Daftar penyelenggara Fintech Lending yang berizin.` }
    ]
  },
  "Video Edukasi Premium": {
    id: `video_edukasi`,
    title: `Video Edukasi Premium`,
    subtitle: `Perpustakaan Visual Ilmu Keuangan`,
    introduction: `Fitur Video Edukasi Premium berisi rekaman kelas dan materi mendalam dari pakar keuangan. Karena beberapa konsep (seperti membaca grafik teknikal atau menghitung valuasi Excel) sangat sulit dipahami hanya dari teks, panduan visual langkah demi langkah sangat diperlukan.`,
    keyTakeaways: [
      `Visualisasi memudahkan pemahaman data keuangan yang kompleks.`,
      `Belajar dengan kecepatan Anda sendiri (pause, rewind, replay).`,
      `Materi disajikan langsung oleh praktisi pasar modal berlisensi (WMI, WPEE, CFP).`
    ],
    detailedSections: [
      {
        title: `Topik Kurikulum Video`,
        content: `Kurikulum video kami mencakup:
1. Analisis Teknikal: Membaca pola candlestick, support & resistance, dan indikator (MACD, RSI, Moving Average).
2. Bedah Emiten: Studi kasus real menganalisis laporan keuangan perusahaan TBK kuartal terbaru.
3. Tutorial Platform: Panduan praktis cara mengoperasikan aplikasi sekuritas untuk membeli saham/reksa dana.`
      },
      {
        title: `Tips Memaksimalkan Video Belajar`,
        content: `Siapkan buku catatan. Untuk video tutorial perhitungan/modeling di Excel, buka laptop Anda dan ikuti langkah instruktur secara langsung (hands-on). Jangan hanya menonton secara pasif seperti menonton film.`
      }
    ],
    sources: [
      { name: `Tim Kurikulum SiKaya`, description: `Disusun bekerja sama dengan lembaga sertifikasi profesi keuangan nasional.` }
    ]
  },
  "Investasi Properti 101": {
    id: `investasi_properti`,
    title: `Investasi Properti 101`,
    subtitle: `Mengenal Aset Berwujud: Tanah dan Bangunan`,
    introduction: `Properti adalah kelas aset klasik yang paling disukai masyarakat Asia. Secara historis, tanah dan rumah dianggap sebagai tempat paling aman menyimpan kekayaan keluarga dan melawan inflasi, sambil memberikan arus kas bulanan melalui sistem sewa.`,
    keyTakeaways: [
      `Properti menawarkan 'Capital Gain' (kenaikan harga tanah) dan 'Yield' (uang sewa bulanan/tahunan).`,
      `Lokasi, Lokasi, dan Lokasi adalah 3 faktor penentu utama kesuksesan investasi properti.`,
      `Properti adalah aset yang TIDAK LIKUID (sulit dijual cepat) dan membutuhkan biaya perawatan.`
    ],
    detailedSections: [
      {
        title: `Keunggulan: Efek Leverage (Daya Ungkit)`,
        content: `Properti adalah satu-satunya aset di mana bank bersedia meminjamkan Anda uang (KPR) dalam jumlah besar dengan jaminan aset itu sendiri. Anda bisa membeli rumah seharga Rp 1 Miliar hanya dengan modal DP Rp 200 Juta. Jika harga rumah naik 10% (menjadi Rp 1,1 Miliar), keuntungan Anda bukan 10%, melainkan 50% dari modal DP Anda yang Rp 200 juta!`
      },
      {
        title: `Risiko dan Biaya Tersembunyi`,
        content: `Membeli properti bukan hanya soal bayar DP dan cicilan. Anda harus memperhitungkan: Biaya Notaris (PPAT), BPHTB (pajak pembeli), asuransi jiwa/kebakaran, biaya provisi bank, serta biaya renovasi dan perawatan bangunan rutin.`
      }
    ],
    sources: [
      { name: `Rich Dad Poor Dad - Robert Kiyosaki`, description: `Buku legendaris tentang kekuatan arus kas dari real estate.` },
      { name: `BPS (Badan Pusat Statistik)`, description: `Data pertumbuhan Indeks Harga Properti Residensial di Indonesia.` }
    ]
  },
  "Startup & Saham Pre-IPO": {
    id: `startup_pre_ipo`,
    title: `Startup & Saham Pre-IPO`,
    subtitle: `Investasi Risiko Tinggi pada Bisnis Rintisan`,
    introduction: `Dulu, berinvestasi pada startup raksasa saat mereka masih kecil hanya bisa dilakukan oleh Venture Capital atau orang super kaya. Kini, melalui platform Securities Crowdfunding (SCF), masyarakat biasa bisa membeli saham perusahaan rintisan sebelum mereka melantai di bursa (IPO).`,
    keyTakeaways: [
      `Risiko SANGAT TINGGI. 9 dari 10 startup gagal pada 3 tahun pertama. Uang Anda bisa hilang 100%.`,
      `Potensi return tidak terbatas (bisa naik 10x hingga 100x lipat) jika startup berhasil menjadi Unicorn.`,
      `Gunakan uang dingin yang Anda ikhlas kehilangannya. Jangan gunakan dana darurat.`
    ],
    detailedSections: [
      {
        title: `Cara Kerja Securities Crowdfunding (SCF)`,
        content: `SCF seperti Kickstarter, namun alih-alih mendapat produk/merchandise, Anda mendapat lembar kepemilikan saham/dividen. Bisnis UMKM atau startup yang butuh modal (misal ekspansi cabang restoran) menawarkan saham mereka ke publik. Anda bisa patungan membelinya mulai dari Rp 1 Juta melalui platform SCF berizin OJK.`
      },
      {
        title: `Masalah Likuiditas (Pasar Sekunder)`,
        content: `Tidak seperti saham di BEI (Bursa Efek Indonesia) yang bisa dijual kapan saja dalam hitungan detik, saham SCF sangat sulit dijual (tidak likuid). Anda biasanya harus menunggu jendela 'Pasar Sekunder' dibuka platform (biasanya hanya 2x setahun), dan itupun harus ada pembeli yang mau.`
      }
    ],
    sources: [
      { name: `Otoritas Jasa Keuangan (POJK 57)`, description: `Peraturan OJK tentang Penawaran Efek Melalui Layanan Urun Dana Berbasis Teknologi Informasi.` },
      { name: `Zero to One - Peter Thiel`, description: `Buku tentang inovasi dan cara kerja investasi startup di Silicon Valley.` }
    ]
  },
  "Time Value of Money": {
    id: `time_value_money`,
    title: `Time Value of Money`,
    subtitle: `Konsep Inti Ilmu Keuangan (Nilai Waktu dari Uang)`,
    introduction: `Time Value of Money (TVM) menyatakan bahwa Rp 10.000.000 yang Anda terima HARI INI bernilai LEBIH TINGGI dibandingkan Rp 10.000.000 yang baru akan Anda terima 5 tahun lagi. Mengapa? Karena inflasi akan menggerus daya belinya, dan kehilangan potensi bunga/investasi selama 5 tahun tersebut.`,
    keyTakeaways: [
      `Inilah alasan mengapa Anda tidak boleh membiarkan uang 'tidur' di bawah kasur atau celengan.`,
      `Konsep ini menjadi dasar perhitungan KPR, Asuransi, Dana Pensiun, dan Valuasi Saham.`,
      `Kekuatan Bunga Majemuk (Compound Interest) adalah penerapan langsung dari TVM.`
    ],
    detailedSections: [
      {
        title: `Present Value vs Future Value`,
        content: `• Present Value (PV): Berapa nilai uang masa depan jika ditarik ke hari ini (setelah didiskon oleh inflasi).
• Future Value (FV): Berapa nilai uang hari ini di masa depan jika diinvestasikan pada tingkat suku bunga tertentu. Rumus sederhananya adalah: FV = PV x (1+r)^n, di mana r adalah suku bunga dan n adalah jumlah tahun.`
      },
      {
        title: `Dampak Terhadap Utang`,
        content: `TVM adalah alasan mengapa pihak bank mau meminjamkan uang, dan mengapa melunasi KPR lebih lambat akan membuat total uang yang Anda bayarkan ke bank menjadi 2x lipat lebih besar dari harga rumah aslinya. Bank meminta kompensasi atas 'waktu' tersebut.`
      }
    ],
    sources: [
      { name: `Prinsip Corporate Finance`, description: `Buku teks standar universitas tentang manajemen keuangan perusahaan.` },
      { name: `Investopedia`, description: `Ensiklopedia istilah-istilah ekonomi dan pasar modal.` }
    ]
  },
  "Investasi Pasar Global": {
    id: `pasar_global`,
    title: `Investasi Pasar Global`,
    subtitle: `Membeli Saham Perusahaan Raksasa Dunia`,
    introduction: `Di era digital saat ini, masyarakat Indonesia tidak hanya terbatas berinvestasi di perusahaan lokal. Anda bisa membeli pecahan saham (fractional shares) perusahaan-perusahaan terkuat di dunia seperti Apple, Microsoft, Google, dan Tesla langsung dari smartphone.`,
    keyTakeaways: [
      `Diversifikasi geografis: Melindungi aset Anda dari ketidakstabilan politik atau ekonomi suatu negara tunggal.`,
      `Aset dalam US Dollar (USD) memberikan lindung nilai (hedging) alami terhadap pelemahan nilai tukar Rupiah.`,
      `Anda bisa berinvestasi pada perusahaan teknologi disruptif dan AI yang belum ada bandingannya di bursa lokal.`
    ],
    detailedSections: [
      {
        title: `Mengenal Index S&P 500`,
        content: `Indeks S&P 500 adalah kumpulan 500 perusahaan publik terbesar di Amerika Serikat (mewakili perekonomian AS). Alih-alih menebak saham mana yang akan naik, tokoh sekelas Warren Buffett merekomendasikan investor pemula untuk membeli reksa dana indeks ETF S&P 500 (seperti VOO atau SPY). Ini adalah cara paling efisien dan murah untuk 'memiliki sedikit bagian dari seluruh Amerika'.`
      },
      {
        title: `Legalitas & Pajak`,
        content: `Pastikan Anda menggunakan pialang (broker) luar negeri yang diawasi oleh SEC/FINRA AS (seperti Interactive Brokers/Charles Schwab) atau platform lokal yang bekerjasama dengan broker luar dan berizin Bappebti. Pahami juga aturan pajak dividen AS (Withholding Tax) dan pelaporan di SPT Pajak tahunan Indonesia.`
      }
    ],
    sources: [
      { name: `The Little Book of Common Sense Investing - John C. Bogle`, description: `Buku panduan investasi index fund dari pendiri Vanguard.` },
      { name: `Bappebti (Kementerian Perdagangan)`, description: `Regulasi Penyaluran Amanat Nasabah ke Bursa Luar Negeri (PALN).` }
    ]
  },
  "Manajemen Kartu Kredit": {
    id: `kartu_kredit`,
    title: `Manajemen Kartu Kredit`,
    subtitle: `Pedang Bermata Dua dalam Keuangan`,
    introduction: `Kartu kredit bukanlah uang tambahan atau dana gaib. Ini adalah instrumen utang tanpa agunan dengan bunga SANGAT TINGGI (bisa mencapai >20% per tahun efektif). Namun, jika digunakan dengan bijak, kartu kredit bisa membangun skor kredit (SLIK OJK) yang bagus dan memberikan banyak diskon/cashback.`,
    keyTakeaways: [
      `LUNASI PENUH (Full Payment) tagihan Anda sebelum jatuh tempo SETIAP BULAN tanpa kecuali.`,
      `Jangan pernah hanya membayar 'Minimum Payment' (biasanya 10%), karena sisa hutang akan digulung dengan bunga tinggi.`,
      `Jangan gunakan fitur tarik tunai (Cash Advance) dari kartu kredit karena bunganya dikenakan seketika.`
    ],
    detailedSections: [
      {
        title: `Perangkap Bunga Berbunga`,
        content: `Jika Anda memiliki tagihan Rp 10 Juta dan hanya membayar minimum (Rp 1 Juta), sisa Rp 9 Juta akan dikenakan bunga. Bulan depan, bunga tersebut ditambahkan ke pokok utang. Jika terus dibiarkan, tagihan akan meledak menjadi bola salju yang tidak terkendali. Inilah penyebab utama kebangkrutan rumah tangga modern.`
      },
      {
        title: `Cara Benar Menggunakan Kartu Kredit`,
        content: `Jadikan kartu kredit sebagai alat BANYAR, bukan alat NGUTANG. Artinya, jika Anda menggesek kartu senilai Rp 500.000 di restoran, pastikan Anda SAAT ITU JUGA memiliki uang tunai Rp 500.000 di rekening bank untuk melunasinya akhir bulan. Manfaatkan promo, kumpulkan miles penerbangan, lalu nikmati keuntungannya.`
      }
    ],
    sources: [
      { name: `Bank Indonesia (BI)`, description: `Aturan batas maksimal suku bunga kartu kredit di Indonesia.` },
      { name: `SLIK OJK (Sistem Layanan Informasi Keuangan)`, description: `Pusat data historis riwayat kelancaran kredit setiap warga negara.` }
    ]
  },
  "Sistem Amplop Digital": {
    id: `amplop_digital`,
    title: `Sistem Amplop Digital`,
    subtitle: `Mencegah Overspending dengan Pos Anggaran Disiplin`,
    introduction: `Metode Amplop (Envelope System) adalah teknik klasik dari nenek moyang kita: memisahkan uang tunai fisik ke dalam beberapa amplop berdasarkan tujuan pengeluaran. Ketika uang di amplop 'Belanja Dapur' habis, Anda tidak boleh mengambil dari amplop 'Bayar Listrik'. Saat ini, metode tersebut didigitalisasi menggunakan fitur multi-rekening bank.`,
    keyTakeaways: [
      `Membuat pagar psikologis: Uang yang sudah dipisahkan tidak boleh diganggu gugat untuk keperluan lain.`,
      `Gunakan fitur 'Kantong' atau 'Sub-rekening' dari Bank Digital modern (seperti Jago, Blu, Jenius, atau Neo).`,
      `Otomatisasi pemindahan dana (auto-debet) di hari pertama gajian agar tidak terpakai foya-foya.`
    ],
    detailedSections: [
      {
        title: `Implementasi Sistem Amplop`,
        content: `Segera setelah gaji masuk, pecah uang ke beberapa amplop digital: 
1. Amplop Tagihan Pasti (Cicilan, KPR, Listrik, Internet)
2. Amplop Kebutuhan Harian (Bensin, Makan Siang, Groceries)
3. Amplop Sedekah/Keluarga
4. Amplop Keinginan (Ngopi, Beli Baju, Game)
5. Amplop Tabungan (LANGSUNG ditransfer ke Reksadana/Saham).`
      },
      {
        title: `Hukum Parkinson dalam Keuangan`,
        content: `Hukum Parkinson menyatakan: 'Pengeluaran akan selalu naik menyesuaikan dengan pendapatan yang tersedia.' Semakin besar sisa saldo rekening utama yang Anda lihat, semakin besar hasrat untuk menghabiskannya. Sistem amplop digital membuat Anda merasa 'miskin' (saldo utama kosong), memaksa Anda untuk lebih hemat.`
      }
    ],
    sources: [
      { name: `Total Money Makeover - Dave Ramsey`, description: `Buku pedoman praktis melunasi utang dan menggunakan sistem amplop tunai.` },
      { name: `Buku Saku OJK`, description: `Disiplin alokasi anggaran rumah tangga bulanan.` }
    ]
  },
  "Template Alokasi Gaji": {
    id: `alokasi_gaji`,
    title: `Template Alokasi Gaji`,
    subtitle: `Rasio Kesehatan Arus Kas Berdasarkan Profil`,
    introduction: `Aturan 50/30/20 sangat populer, namun tidak cocok untuk semua orang. Seseorang dengan gaji UMR yang hidup di Jakarta mungkin harus mengalokasikan 80% gajinya untuk kebutuhan dasar. Sebaliknya, eksekutif dengan gaji Rp 50 Juta mungkin bisa menabung hingga 60%.`,
    keyTakeaways: [
      `Tidak ada rumus baku; sesuaikan rasio dengan realitas kondisi ekonomi dan tanggung jawab keluarga Anda.`,
      `Generasi Sandwich (menanggung orang tua & anak) memerlukan rasio khusus.`,
      `Fokus pada meningkatkan persentase TABUNGAN seiring naiknya gaji bulanan.`
    ],
    detailedSections: [
      {
        title: `Template 40/30/20/10 (Cocok untuk Pegawai & Keluarga Biasa)`,
        content: `• 40% Kebutuhan Hidup (Makan, Transport, Tagihan Dasar)
• 30% Cicilan Produktif (KPR, Kredit Mobil) - Catatan: Total cicilan TIDAK BOLEH melebihi 30% dari total gaji bulanan!
• 20% Tabungan, Investasi, dan Dana Darurat
• 10% Kebaikan (Zakat, Sedekah, Memberi ke Orang Tua).`
      },
      {
        title: `Template 60/20/20 (Untuk Fresh Graduate Penghasilan Pas-pasan)`,
        content: `• 60% Kebutuhan Pokok (Terutama biaya kos/kontrak dan makan harian)
• 20% Pengembangan Diri & Hiburan (Beli buku, kursus online, nongkrong secukupnya)
• 20% Dana Darurat (Mutlak! Sisihkan ini di awal, bukan sisa akhir bulan).`
      }
    ],
    sources: [
      { name: `Perencanaan Keuangan Syariah`, description: `Alokasi anggaran komprehensif termasuk unsur zakat dan pembersihan harta.` },
      { name: `All Your Worth - Elizabeth Warren`, description: `Modifikasi formula dasar untuk profil keluarga kelas menengah.` }
    ]
  }

,

  "Kalkulator Debt Snowball": {
    id: `debt_snowball`,
    title: `Kalkulator Debt Snowball`,
    subtitle: `Strategi Psikologis Melunasi Utang`,
    introduction: `Metode Debt Snowball (Bola Salju Utang) dipopulerkan oleh pakar keuangan Dave Ramsey. Alih-alih melunasi utang dengan bunga tertinggi lebih dulu (secara matematis lebih hemat), metode ini menyarankan melunasi utang dengan SALDO TERKECIL lebih dulu untuk membangun momentum dan kemenangan kecil (small wins).`,
    keyTakeaways: [
      `Secara psikologis, melihat satu utang lunas sepenuhnya memberikan motivasi besar untuk melunasi utang berikutnya.`,
      `Bayar pembayaran minimum pada SEMUA utang, lalu serang utang terkecil dengan seluruh sisa dana yang ada.`,
      `Setelah utang terkecil lunas, gunakan uang cicilannya untuk menggempur utang terkecil kedua (seperti bola salju yang membesar).`
    ],
    detailedSections: [
      {
        title: `Langkah-Langkah Debt Snowball`,
        content: `1. Urutkan utang: Tulis semua utang Anda dari saldo terkecil hingga terbesar (abaikan besaran bunga).
2. Bayar minimum: Pastikan Anda tetap membayar cicilan minimum bulanan untuk utang nomor 2 hingga terakhir agar tidak terkena denda keterlambatan.
3. Serangan total: Gunakan sisa uang dari anggaran bulan ini untuk melunasi utang nomor 1 secepat mungkin.
4. Gulung: Setelah utang nomor 1 lunas, alihkan anggaran cicilan utang 1 tadi untuk melunasi utang nomor 2. Terus gulung hingga utang terbesar (seperti KPR) lunas.`
      },
      {
        title: `Kenapa Matematika Saja Tidak Cukup?`,
        content: `Banyak orang gagal melunasi utang karena kehilangan motivasi. Jika Anda mencoba melunasi utang KPR yang bunganya tinggi tapi saldonya ratusan juta, Anda mungkin tidak akan melihat kemajuan berarti selama bertahun-tahun dan akhirnya menyerah. Debt Snowball mengutamakan 'perubahan perilaku' (behavioral change).`
      }
    ],
    sources: [
      { name: `The Total Money Makeover`, description: `Buku panduan Dave Ramsey tentang Baby Steps menuju kebebasan utang.` },
      { name: `Harvard Business Review`, description: `Studi empiris mengapa strategi penyelesaian tujuan bertahap lebih berhasil secara psikologis.` }
    ]
  },
  "Kalkulator Pajak PPh 21": {
    id: `pajak_pph_21`,
    title: `Kalkulator Pajak PPh 21`,
    subtitle: `Memahami Potongan Penghasilan Negara`,
    introduction: `Pajak Penghasilan Pasal 21 (PPh 21) adalah pajak atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain dengan nama dan dalam bentuk apapun sehubungan dengan pekerjaan atau jabatan, jasa, dan kegiatan yang dilakukan oleh Wajib Pajak orang pribadi dalam negeri.`,
    keyTakeaways: [
      `Tidak semua gaji Anda dipajaki. Ada batas PTKP (Penghasilan Tidak Kena Pajak).`,
      `Sistem pajak Indonesia bersifat progresif: Semakin besar gaji, semakin besar persentase pajaknya.`,
      `Mulai 2024, perhitungan PPh 21 bulanan menggunakan sistem TER (Tarif Efektif Rata-rata).`
    ],
    detailedSections: [
      {
        title: `Konsep PTKP (Penghasilan Tidak Kena Pajak)`,
        content: `Negara berbaik hati membebaskan pajak untuk batas pendapatan minimum agar warganya bisa hidup layak. Saat ini, PTKP untuk orang lajang tanpa tanggungan (TK/0) adalah Rp 54.000.000 per tahun (atau Rp 4.500.000 per bulan). Artinya, jika gaji Anda Rp 5.000.000 sebulan, yang dikenakan pajak BUKAN Rp 5 juta, melainkan hanya selisihnya (Penghasilan Kena Pajak).`
      },
      {
        title: `Lapisan Tarif Progresif (UU HPP)`,
        content: `Tarif pajak berdasarkan rentang Penghasilan Kena Pajak (PKP) per tahun (setelah dikurangi PTKP):
• PKP Rp 0 - Rp 60 Juta: 5%
• PKP >Rp 60 Juta - Rp 250 Juta: 15%
• PKP >Rp 250 Juta - Rp 500 Juta: 25%
• PKP >Rp 500 Juta - Rp 5 Miliar: 30%
• PKP >Rp 5 Miliar: 35%`
      }
    ],
    sources: [
      { name: `Direktorat Jenderal Pajak (DJP) Kemenkeu`, description: `Peraturan Menteri Keuangan tentang PPh 21 dan Tarif Efektif Rata-rata.` },
      { name: `Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP)`, description: `Aturan tarif PPh progresif terbaru tahun 2021.` }
    ]
  },
  "Kalkulator Zakat & Sedekah": {
    id: `zakat_sedekah`,
    title: `Kalkulator Zakat & Sedekah`,
    subtitle: `Pembersihan Harta dan Filantropi Finansial`,
    introduction: `Dalam perencanaan keuangan yang holistik, tidak semua uang yang kita peroleh adalah mutlak hak kita. Terdapat porsi yang wajib disalurkan kepada mereka yang membutuhkan (mustahik) untuk membersihkan harta, membawa keberkahan, dan menciptakan keadilan sosial dalam perekonomian.`,
    keyTakeaways: [
      `Zakat Maal (Harta) memiliki syarat Nishab (batas minimum) dan Haul (mengendap 1 tahun kalender Hijriah).`,
      `Zakat Penghasilan / Profesi wajib dikeluarkan setiap kali menerima gaji (bisa langsung potong 2,5%).`,
      `Berbagi tidak akan membuat miskin; sedekah adalah asuransi langit (spiritual protection).`
    ],
    detailedSections: [
      {
        title: `Perhitungan Zakat Profesi / Penghasilan`,
        content: `Jika penghasilan bulanan Anda telah mencapai nishab (setara nilai 85 gram emas per tahun dibagi 12 bulan), maka Anda diwajibkan mengeluarkan zakat sebesar 2,5%. Contoh: Jika harga emas Rp 1.000.000/gram, nishab pertahun adalah Rp 85.000.000 (atau sekitar Rp 7.083.000/bulan). Jika gaji bulanan Anda Rp 10 Juta, zakatnya adalah: Rp 10.000.000 x 2,5% = Rp 250.000.`
      },
      {
        title: `Dampak Sedekah Terhadap Psikologi Keuangan`,
        content: `Memberi secara teratur melatih mental 'Kelimpahan' (Abundance Mindset) daripada mental 'Kekurangan' (Scarcity Mindset). Saat Anda bersedekah, alam bawah sadar Anda diyakinkan bahwa Anda memiliki 'lebih dari cukup' sehingga berani berbagi. Ini menghapus sifat serakah yang sering menghancurkan investor di pasar modal.`
      }
    ],
    sources: [
      { name: `Badan Amil Zakat Nasional (BAZNAS)`, description: `Lembaga resmi negara untuk panduan perhitungan nishab dan tarif zakat terkini.` },
      { name: `Fatwa Majelis Ulama Indonesia (MUI)`, description: `Pedoman pelaksanaan zakat profesi dan investasi.` }
    ]
  }

,
  "Klinik Asuransi": {
    id: `klinik_asuransi`,
    title: `Klinik Asuransi`,
    subtitle: `Proteksi Risiko Kehidupan Secara Cerdas`,
    introduction: `Asuransi BUKANLAH instrumen investasi, melainkan instrumen transfer risiko (proteksi). Kesalahan terbesar masyarakat adalah mencampuradukkan investasi dengan asuransi (seperti produk Unit Link) yang justru membuat biaya akuisisi (potongan) menjadi sangat mahal.`,
    keyTakeaways: [
      `BPJS Kesehatan adalah asuransi wajib pertama yang HARUS Anda miliki sebelum membeli asuransi swasta apapun.`,
      `Pisahkan antara Asuransi (beli Asuransi Jiwa Murni / Term Life) dan Investasi (beli Reksa Dana terpisah). Strategi ini disebut 'Buy Term and Invest the Rest'.`,
      `Pencari nafkah utama wajib memiliki asuransi jiwa. Anak-anak TIDAK butuh asuransi jiwa, melainkan asuransi kesehatan.`
    ],
    detailedSections: [
      {
        title: `Membongkar Ilusi 'Uang Kembali'`,
        content: `Banyak agen menjual asuransi dengan iming-iming 'Kalau tidak sakit, uang premi Anda akan kembali di tahun ke-10 (Endowment/Dwiguna).' Faktanya, uang yang 'kembali' tersebut nilainya sudah sangat tergerus inflasi (Time Value of Money), dan preminya jauh lebih mahal dibanding asuransi murni hangus.`
      },
      {
        title: `Menghitung Uang Pertanggungan (UP) Jiwa`,
        content: `Berapa asuransi jiwa yang Anda butuhkan? Gunakan metode Sederhana (Income Replacement). Jika pengeluaran keluarga Rp 10 Juta/bulan (Rp 120 Juta/tahun), dan Anda ingin keluarga bisa bertahan hidup dari bunga deposito 6% per tahun jika Anda meninggal dunia, maka UP yang dibutuhkan adalah: Rp 120 Juta / 6% = Rp 2 Miliar.`
      }
    ],
    sources: [
      { name: `Dewan Asuransi Indonesia`, description: `Literasi dasar asuransi kerugian dan asuransi jiwa.` },
      { name: `Buku Perencanaan Keuangan`, description: `Strategi mitigasi risiko (Risk Management) untuk keluarga.` }
    ]
  }

,

  "Tantangan Hemat 30 Hari": {
    id: `tantangan_hemat`,
    title: `Tantangan Hemat 30 Hari`,
    subtitle: `Detoksifikasi Pengeluaran Tidak Sadar (Latte Factor)`,
    introduction: `Tantangan Hemat (No-Spend Challenge) bukanlah soal menyiksa diri menjadi pelit, melainkan sebuah eksperimen psikologis selama 30 hari untuk me-reset ulang batasan antara 'kebutuhan' dan 'keinginan' yang selama ini kabur akibat kebiasaan gaya hidup modern.`,
    keyTakeaways: [
      `Selama 30 hari, Anda dilarang mengeluarkan uang untuk kebutuhan sekunder/tersier (kopi di luar, baju baru, bioskop).`,
      `Kebutuhan primer (makan, tagihan rutin, transport ke kantor) tentu saja diperbolehkan.`,
      `Tantangan ini membantu Anda menyadari bahwa banyak pengeluaran harian yang sebenarnya bersifat otomatis tanpa memberi kebahagiaan (mindless spending).`
    ],
    detailedSections: [
      {
        title: `Aturan Permainan 30 Hari`,
        content: `• Hapus semua aplikasi e-commerce dan food delivery dari HP Anda selama 30 hari.
• Unfollow akun-akun brand atau influencer yang memicu hasrat berbelanja Anda.
• Bawa bekal makanan dari rumah (atau masak sederhana).
• Tulis 'Log Hasrat': Jika Anda sangat ingin membeli sesuatu, tulis barangnya di kertas. Tunggu hingga tantangan berakhir (Hari ke-31). Biasanya hasrat itu sudah hilang.`
      },
      {
        title: `Kemanakan Uang yang Berhasil Dihemat?`,
        content: `Kumpulkan semua selisih uang yang berhasil Anda hemat setiap harinya ke rekening terpisah. Di akhir bulan, gunakan uang tersebut untuk hal produktif: melunasi utang berbunga paling tinggi, atau langsung investasikan ke instrumen pasar uang sebagai embrio Dana Darurat.`
      }
    ],
    sources: [
      { name: `The Year of Less - Cait Flanders`, description: `Buku memori tentang pengalaman puasa belanja selama satu tahun penuh.` },
      { name: `Psikologi Konsumen`, description: `Jurnal tentang pelepasan dopamin dalam aktivitas berbelanja (shopping addiction).` }
    ]
  }

};