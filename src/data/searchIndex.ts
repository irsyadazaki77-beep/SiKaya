export interface SearchItem {
  id: string;
  title: string;
  category: 'Kamus Finansial' | 'Modul Belajar' | 'Fitur & Tools' | 'Komunitas';
  desc: string;
  details?: string;
  tip?: string;
  url: string;
  state?: Record<string, unknown>;
  tags: string[];
}

export const SEARCH_INDEX: SearchItem[] = [
  // GLOSSARY ITEMS
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
