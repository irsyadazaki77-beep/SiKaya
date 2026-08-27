export interface GlossaryItem {
  term: string;
  category: string;
  definition: string;
  antiMisleading: string;
}

export const GLOSSARY_ITEMS: GlossaryItem[] = [
  {
    term: "Reksa Dana (Mutual Fund)",
    category: "investasi",
    definition: "Wadah untuk menghimpun dana masyarakat yang kemudian dikelola oleh Manajer Investasi (MI) profesional untuk dimasukkan ke berbagai instrumen investasi seperti pasar uang, obligasi, atau saham.",
    antiMisleading: "Manajer Investasi mengenakan biaya pengelolaan (Expense Ratio). Selalu cek rekam jejak MI di prospektus resmi, dan pahami bahwa kinerja masa lalu tidak menjamin hasil masa depan!"
  },
  {
    term: "Inflasi (Inflation)",
    category: "umum",
    definition: "Kondisi di mana harga barang dan jasa secara umum mengalami kenaikan terus-menerus dalam jangka waktu tertentu, yang mengakibatkan daya beli uangmu menurun.",
    antiMisleading: "Menaruh uang 100% di tabungan bank biasa di bawah kasur dijamin akan termakan inflasi. Investasi adalah cara melawan inflasi, namun pilihlah instrumen yang risikonya sesuai dengan jangka waktu tujuanmu."
  },
  {
    term: "Bullish & Bearish",
    category: "investasi",
    definition: "Istilah tren pasar modal. Bullish merujuk pada kondisi pasar yang sedang naik pesat (optimis), sedangkan Bearish merujuk pada kondisi pasar yang terus merosot turun (pesimis).",
    antiMisleading: "Di saat pasar Bullish, semua orang merasa pintar dan pamer keuntungan di media sosial. Jangan terjebak FOMO membeli di puncak harga! Tetap konsisten investasi berkala (Dollar Cost Averaging)."
  },
  {
    term: "Compound Interest (Bunga Majemuk)",
    category: "pondasi",
    definition: "Bunga atau hasil imbal balik dari investasi yang diinvestasikan kembali, sehingga di periode berikutnya menghasilkan imbal hasil lagi atas modal baru yang lebih besar. Sering disebut efek bola salju.",
    antiMisleading: "Bunga majemuk membutuhkan horizon waktu tahunan bahkan puluhan tahun agar terasa dampaknya secara signifikan. Jangan percaya aplikasi ilegal yang menjanjikan 'bunga majemuk harian/mingguan' yang pasti untung!"
  },
  {
    term: "Diversifikasi (Diversification)",
    category: "risiko",
    definition: "Strategi menyebarkan modal investasimu ke beberapa instrumen yang berbeda (misal: emas, reksa dana pasar uang, dan saham) demi meminimalisir risiko kerugian total. Populer dengan istilah: 'Don't put all your eggs in one basket'.",
    antiMisleading: "Diversifikasi berlebihan juga bisa mengurangi potensi return optimal. Sesuaikan sebaran aset dengan profil risikomu sendiri, jangan sekadar ikut-ikutan portofolio orang lain."
  },
  {
    term: "Profil Risiko (Risk Profile)",
    category: "risiko",
    definition: "Tingkat toleransi dan kesiapan mental seorang investor dalam menghadapi fluktuasi naik-turunnya nilai portofolio investasinya. Terbagi menjadi Konservatif, Moderat, dan Agresif.",
    antiMisleading: "Jangan pernah memaksakan diri menjadi investor Agresif (membeli 100% saham/kripto) jika kamu masih panik dan tidak bisa tidur nyenyak saat melihat portofoliomu minus 5%!"
  },
  {
    term: "Dana Darurat (Emergency Fund)",
    category: "pondasi",
    definition: "Tabungan khusus berupa uang tunai atau aset sangat likuid (seperti RDPU atau deposito) yang sengaja dipisahkan hanya untuk menutup pengeluaran tidak terduga seperti sakit mendadak, gawai utama rusak, atau kehilangan pekerjaan.",
    antiMisleading: "Dana darurat tidak boleh ditaruh di saham atau instrumen berisiko tinggi karena jika terjadi krisis di saat pasar crash, nilai dana daruratmu terpaksa dilikuidasi dalam kondisi rugi besar."
  },
  {
    term: "Deposito Syariah / Biasa",
    category: "umum",
    definition: "Produk simpanan bank dengan jangka waktu tertentu (misal 1, 3, atau 6 bulan) di mana uangmu 'dikunci' dan kamu mendapatkan bagi hasil atau bunga tetap yang umumnya lebih tinggi dari tabungan biasa.",
    antiMisleading: "Mencairkan deposito sebelum jatuh tempo biasanya dikenakan denda penalti (kecuali deposito digital tertentu). Pastikan uang yang didepositokan bukan uang belanja mingguan!"
  },
  {
    term: "Saham (Stocks)",
    category: "investasi",
    definition: "Bukti kepemilikan nilai sebuah perusahaan. Dengan membeli saham, kamu resmi menjadi pemilik sebagian kecil dari perusahaan tersebut dan berhak atas dividen (jika dibagikan) serta potensi capital gain.",
    antiMisleading: "Saham berfluktuasi sangat tajam setiap hari dan tidak ada jaminan modal kembali. Menaruh seluruh modal di satu saham gorengan tanpa analisis fundamental adalah spekulasi judi, bukan investasi!"
  },
  {
    term: "Obligasi / SBN (Surat Berharga Negara)",
    category: "investasi",
    definition: "Surat utang yang diterbitkan oleh pemerintah (seperti ORI, SBR, Sukuk) atau perusahaan swasta. Investor meminjamkan uang kepada penerbit dan mendapatkan imbalan kupon (bunga) berkala hingga jatuh tempo.",
    antiMisleading: "SBN ritel yang dijamin undang-undang sangat aman dari risiko gagal bayar, namun likuiditasnya terbatas. Beberapa tipe SBN (seperti SBR atau ST) tidak bisa diperjualbelikan di pasar sekunder sebelum jatuh tempo."
  },
  {
    term: "Paylater & Pinjol Ilegal",
    category: "risiko",
    definition: "Fasilitas kredit digital instan untuk konsumsi. Pinjol ilegal adalah pinjaman tanpa izin OJK yang mengenakan bunga selangit, denda mencekik, dan cara penagihan yang tidak beretika.",
    antiMisleading: "Kemudahan paylater menciptakan ilusi bahwa kamu 'mampu membeli', padahal kamu sedang merampok pendapatan masa depanmu sendiri ditambah bunga denda. Gunakan HANYA jika sangat mendesak untuk hal produktif!"
  },
  {
    term: "Asset Allocation (Alokasi Aset)",
    category: "risiko",
    definition: "Cara membagi porsi portofolio investasi ke dalam berbagai kelas aset (seperti kas, obligasi, saham, komoditas) untuk menyeimbangkan risiko dan imbal hasil sesuai target waktu investasimu.",
    antiMisleading: "Tidak ada satu formula alokasi aset yang cocok untuk semua orang seumur hidup. Alokasi asetmu harus berubah seiring bertambahnya usia, pendapatan, atau perubahan tanggung jawab keluarga."
  }
];
