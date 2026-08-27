import { QuizQuestion } from '../../types/classroom';

export const BUDGETING_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Berapa persen alokasi ideal untuk pos "Needs" (Kebutuhan Pokok) menurut aturan 50/30/20?',
    options: [
      { text: 'A. Maksimal 50% dari total pendapatan bersih', isCorrect: true },
      { text: 'B. Minimal 80% untuk belanja gaya hidup', isCorrect: false },
      { text: 'C. 10% saja agar sisa uang bisa buat liburan', isCorrect: false }
    ],
    explanation: 'Aturan 50/30/20 menyarankan 50% untuk kebutuhan pokok (makan, sewa/kos, transportasi), 30% untuk keinginan, dan 20% untuk tabungan/investasi.'
  },
  {
    id: 2,
    q: 'Apa yang harus dilakukan saat baru pertama kali menerima uang saku bulanan atau gaji?',
    options: [
      { text: 'A. Langsung habiskan untuk checkout keranjang belanja online', isCorrect: false },
      { text: 'B. Sisihkan porsi tabungan/investasi terlebih dahulu (Pay Yourself First)', isCorrect: true },
      { text: 'C. Tunggu sampai akhir bulan, kalau ada sisa baru ditabung', isCorrect: false }
    ],
    explanation: 'Prinsip "Pay Yourself First" memastikan tabungan masa depanmu aman sebelum kamu tergoda membelanjakan sisanya untuk pos konsumtif.'
  }
];

export const DEBT_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Teman se-geng mengajak kamu nonton konser internasional seharga Rp 2.500.000 dengan sistem "Paylater" cicilan bunga 12% per bulan. Kamu tidak punya tabungan sekarang. Apa tindakanmu?',
    options: [
      { text: 'A. Ambil paylater, mumpung konser sekali seumur hidup. Masalah bayar dipikir belakangan biar gak FOMO.', isCorrect: false },
      { text: 'B. Menolak dengan sopan. Konser adalah keinginan ("wants"), bukan kebutuhan primer. Berhutang untuk konsumsi gaya hidup dengan bunga tinggi adalah jebakan finansial.', isCorrect: true }
    ],
    explanation: 'Paylater atau utang konsumtif untuk kebutuhan non-mendesak dengan bunga tinggi adalah awal petaka finansial Gen Z. Selalu beli keinginan menggunakan dana dingin yang sudah ditabung sebelumnya!'
  },
  {
    id: 2,
    q: 'Kamu melihat iklan di sosial media yang menawarkan pinjaman instan tanpa KTP rumit, cair dalam 5 menit, tapi tidak ada logo OJK (Otoritas Jasa Keuangan) di website-nya. Bagaimana kamu merespon?',
    options: [
      { text: 'A. Langsung ajukan pinjaman buat ganti HP baru, mumpung syaratnya gampang banget.', isCorrect: false },
      { text: 'B. Segera abaikan dan laporkan ke OJK. Pinjol ilegal memeras peminjam dengan bunga mencekik, denda harian tidak masuk akal, serta ancaman sebar data pribadi.', isCorrect: true }
    ],
    explanation: 'Pinjol ilegal tidak terdaftar OJK dan menggunakan taktik intimidasi serta peretasan kontak ponsel untuk menagih. Jangan pernah menyentuh platform pinjaman non-OJK!'
  }
];

export const PORTFOLIO_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Apa tujuan utama dari melakukan "Rebalancing" (penyeimbangan kembali) portofolio investasi secara berkala (misal tiap 6 atau 12 bulan sekali)?',
    options: [
      { text: 'A. Mengambil keuntungan dari aset yang naik tajam, lalu memindahkannya untuk membeli aset murah yang sedang terdiskon, guna meredam volatilitas portofolio sesuai profil risiko.', isCorrect: true },
      { text: 'B. Mencari sensasi trading harian agar portofolio berganti isi setiap hari.', isCorrect: false },
      { text: 'C. Membayar biaya administrasi bulanan perantara broker saham.', isCorrect: false }
    ],
    explanation: 'Rebalancing mengembalikan alokasi aset ke porsi idealnya. Saat saham naik tinggi, porsinya melebihi target dan meningkatkan profil risiko portofolio secara tidak sadar. Menjual sebagian saham (sell high) dan membeli aset yang underperforming (buy low) mengunci keuntunganmu secara otomatis!'
  }
];

export const CAREER_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Mengapa meningkatkan "Active Income" (pendapatan aktif) lewat belajar high-income skill lebih penting dibanding sekadar berhemat secara ekstrem bagi anak muda?',
    options: [
      { text: 'A. Karena berhemat ekstrem mematikan kreativitas dan pertumbuhan karir, sementara porsi tabungan dari gaji besar jauh lebih besar dibanding sisa hasil berhemat dari gaji kecil.', isCorrect: true },
      { text: 'B. Karena jika gaji besar kita wajib berfoya-foya membeli mobil mewah baru secara kredit.', isCorrect: false },
      { text: 'C. Karena pendapatan aktif pasti dikirim langsung oleh pemerintah setiap bulan.', isCorrect: false }
    ],
    explanation: 'Berhemat memiliki batas bawah (kamu tidak bisa memotong biaya makan pokok hingga Rp 0), sementara pendapatan aktif tidak memiliki batas atas jika kamu terus melatih keahlian bernilai tinggi!'
  }
];

export const CRYPTO_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Seorang teman mengajakmu membeli token kripto baru bernama "MoonSafeDoge" karena harganya murah dan menjanjikan keuntungan 1000% besok. Apa yang harus kamu lakukan?',
    options: [
      { text: 'A. Beli langsung dengan dana darurat mumpung masih murah', isCorrect: false },
      { text: 'B. Tolak. Ini kemungkinan besar adalah "shitcoin" atau scam (pump and dump)', isCorrect: true }
    ],
    explanation: 'Token tanpa utilitas/proyek nyata, tim anonim, dan menjanjikan return fantastis instan biasanya adalah penipuan (scam).'
  },
  {
    id: 2,
    q: 'Kamu ingin berinvestasi jangka panjang di Bitcoin. Di mana tempat terbaik untuk menyimpannya dengan aman?',
    options: [
      { text: 'A. Tinggalkan saja semuanya di aplikasi bursa kripto tanpa 2FA', isCorrect: false },
      { text: 'B. Simpan di "Cold Wallet" (Hardware Wallet) di mana kamu memegang Private Key sendiri', isCorrect: true }
    ],
    explanation: 'Bursa kripto bisa diretas atau bangkrut. Untuk investasi jangka panjang dan nominal besar, Hardware Wallet adalah yang paling aman.'
  }
];

export const REKSADANA_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Manakah jenis reksa dana yang memiliki tingkat risiko paling rendah dan paling cocok untuk tempat parkir sementara dana darurat?',
    options: [
      { text: 'A. Reksa Dana Saham (RDS) karena keuntungannya paling tinggi.', isCorrect: false },
      { text: 'B. Reksa Dana Pasar Uang (RDPU) karena portofolionya ditempatkan pada instrumen pasar uang berjangka pendek dan sangat likuid.', isCorrect: true },
      { text: 'C. Reksa Dana Campuran karena membagi porsi merata ke emas dan saham gorengan.', isCorrect: false }
    ],
    explanation: 'RDPU menempatkan dana pada deposito perbankan dan surat utang jangka pendek (<1 tahun), memiliki risiko paling rendah dan fluktuasi stabil, sangat cocok untuk dana darurat.'
  },
  {
    id: 2,
    q: 'Mengapa Surat Berharga Negara (SBN) ritel seperti ORI atau SR disebut investasi bebas risiko gagal bayar (Zero Default Risk)?',
    options: [
      { text: 'A. Karena dikelola oleh influencer bercentang biru di instagram.', isCorrect: false },
      { text: 'B. Karena pembayaran kupon (bunga) dan pengembalian modal pokok dijamin penuh oleh Undang-Undang APBN Negara RI.', isCorrect: true },
      { text: 'C. Karena SBN tidak menggunakan mata uang Rupiah.', isCorrect: false }
    ],
    explanation: 'SBN adalah surat utang negara resmi. Pembayaran bunga dan modal pokoknya dijamin 100% oleh Undang-Undang Republik Indonesia, menjadikannya sangat aman.'
  }
];

export const SAHAM_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Apa arti dari Price to Earnings (P/E) Ratio yang terlalu tinggi secara tidak wajar (misal P/E > 150x) bagi investor pemula?',
    options: [
      { text: 'A. Perusahaan tersebut sangat murah dan pasti menguntungkan.', isCorrect: false },
      { text: 'B. Saham tersebut sudah sangat mahal (Overvalued) dibandingkan laba bersih yang dihasilkannya.', isCorrect: true },
      { text: 'C. Saham tersebut pasti membagikan dividen tunai besok pagi.', isCorrect: false }
    ],
    explanation: 'P/E Ratio membandingkan harga saham dengan laba per lembar saham. P/E yang sangat tinggi mengindikasikan harga saham sudah terlampau mahal ("priced to perfection") dan rawan koreksi.'
  },
  {
    id: 2,
    q: 'Bagaimana cara terbaik meminimalkan risiko fluktuasi harga saham bagi seorang investor jangka panjang?',
    options: [
      { text: 'A. Melakukan "Dollar Cost Averaging" (DCA) secara konsisten di saham blue-chip berfundamental kuat.', isCorrect: true },
      { text: 'B. Membeli saham yang sedang viral di media sosial menggunakan pinjol.', isCorrect: false },
      { text: 'C. Melakukan "All-In" modal pada saham gorengan.', isCorrect: false }
    ],
    explanation: 'DCA (mencicil investasi rutin secara berkala) merata-ratakan harga perolehan sahammu, menghindarkanmu dari kepanikan menebak arah pasar (Market Timing).'
  }
];
