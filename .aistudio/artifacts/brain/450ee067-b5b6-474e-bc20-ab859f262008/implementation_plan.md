# SiKaya Next Update: Weekly Trading Arena & Real-Time Cloud Sync Indicator

Rencana pembaruan berikutnya untuk **SiKaya** dengan menghadirkan **Trading Arena & Turnamen Mingguan** berbasis return investasi virtual (ROI), sistem hadiah XP & lencana juara eksklusif, serta **Indikator Status Sinkronisasi Cloud Real-Time** yang otomatis menghubungkan progres belajar dan portofolio ke Cloud Firestore.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Pilihan yang Dikonfirmasi oleh Pengguna:**
> 1. **Fitur Inovatif Prioritas**: **Trading Arena & Turnamen Mingguan** (Turnamen paper trading kompetitif dengan leaderboard ROI mingguan, hadiah XP, dan lencana profil).
> 2. **Preferensi Sinkronisasi Cloud**: **Otomatis sinkronisasi cloud real-time** dengan indikator status online (*Cloud Synced / Syncing / Offline*) di header dan dasbor.

---

## 1. Overview & Core Concept

1. **Trading Arena (Turnamen Mingguan)**:
   - Pengguna mendaftarkan portofolio simulasi ke dalam kompetisi mingguan (contoh: *"IDX Bluechip Sprint Week #44"*, *"Crypto & Gold Volatility Cup"*).
   - Seluruh peserta memulai dengan modal virtual yang sama (IDR 50.000.000).
   - Peringkat ditentukan secara matematis dan obyektif berdasarkan **persentase Return on Investment (ROI %)** selama periode turnamen berjalan.
   - Peringkat 1–3 mendapatkan hadiah XP masif, avatar frame emas/perak, dan lencana reputasi di profil.
2. **Real-time Cloud Sync & Online Indicator**:
   - Widget halus di header / top-bar yang menampilkan status koneksi ke Cloud Firestore (`Tersinkronisasi ☁️`, `Menyimpan ⚡`, atau `Mode Offline 💾`).
   - Setiap transaksi paper trading atau modul kelas yang diselesaikan otomatis disinkronkan ke dokumen Firestore pengguna tanpa perlu refresh halaman.

---

## 2. User Experience & Visual Design

### A. Turnamen Trading Arena UI
- **Papan Klasemen Kompetisi**:
  - Tabel leaderboard dengan nomor peringkat, foto profil/avatar, nama peserta, nilai portofolio akhir, dan persentase keuntungan hijau/merah (`+14.85%`).
  - Timer countdown waktu tersisa turnamen (`Sisa Waktu: 2 Hari 14 Jam`).
- **Kartu Turnamen Bento**:
  - Status turnamen: `BERLANGSUNG`, `PENDAFTARAN DIBUKA`, `SELESAI`.
  - Detail aturan main: Instrumen yang diperbolehkan (misal: Hanya saham IDX, atau Multi-aset), modal awal seragam, dan batas cut-off mingguan.

### B. Indikator Sinkronisasi Cloud
- Terletak elegan di samping menu pengguna pada Navbar:
  - Dot hijau berkedip halus + teks tenang: `Cloud Aktif`
  - Saat ada mutasi data: animasi berputar singkat `Menyinkronkan...`
  - Jika koneksi terputus: `Offline (Tersimpan Lokal)`

---

## 3. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                   SiKaya Web Client                    │
│  ┌───────────────────────┐  ┌────────────────────────┐ │
│  │ Trading Arena View    │  │ Cloud Sync Indicator   │ │
│  └───────────┬───────────┘  └───────────┬────────────┘ │
│              │                          │              │
│  ┌───────────▼──────────────────────────▼────────────┐ │
│  │        Firestore Sync Hook / Tournament State      │ │
│  └───────────────────────┬───────────────────────────┘ │
└──────────────────────────┼─────────────────────────────┘
                           │
             (Realtime onSnapshot / addDoc)
                           │
┌──────────────────────────▼─────────────────────────────┐
│                 Google Cloud Firestore                 │
│  - /tournaments/{tournamentId}                         │
│  - /tournaments/{tournamentId}/participants/{userId}   │
│  - /users/{userId} (xp, badges, rank)                  │
│  - /investmentHistory (synced trades)                  │
└────────────────────────────────────────────────────────┘
```

---

## 4. Rencana Tahapan Eksekusi

- [ ] **Milestone 1: Modul & Komponen Trading Arena**
  - Membuat komponen `TradingArenaModal` / view turnamen di tab Leaderboard & Simulation.
  - Form gabung turnamen, kalkulasi ROI live dari kepemilikan aset simulasi.
- [ ] **Milestone 2: Cloud Sync Indicator Component**
  - Membuat hook `useCloudSyncStatus` untuk memantau status online & Firestore write state.
  - Komponen indikator visual minimalis di `Header.tsx` dan `UserDashboard.tsx`.
- [ ] **Milestone 3: Sistem Hadiah & Integrasi Profil**
  - Penambahan reward klaim XP turnamen dan lencana juara mingguan.
  - Verifikasi build (`compile_applet`, `lint_applet`) dan pengujian fungsionalitas.
