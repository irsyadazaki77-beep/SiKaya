import { Quest } from '../types/financial';

export const INITIAL_QUESTS: Quest[] = [
  // Daily Quests
  {
    id: 'd1',
    title: 'Check-in Harian Literasi',
    description: 'Buka SiKaya hari ini untuk mengklaim bonus energi belajar & disiplin finansial.',
    type: 'daily',
    xpReward: 15,
    progress: 1,
    target: 1,
    completed: false,
    category: 'literacy'
  },
  {
    id: 'd2',
    title: 'Pelajari 1 Modul/Artikel',
    description: 'Selesaikan atau baca 1 modul kelas/artikel di Perpustakaan Finansial.',
    type: 'daily',
    xpReward: 35,
    progress: 0,
    target: 1,
    completed: false,
    category: 'literacy'
  },
  {
    id: 'd3',
    title: 'Jalankan 1 Simulasi Trade/Kuis',
    description: 'Lakukan 1 kali simulasi beli/jual saham atau ikuti kuis harian.',
    type: 'daily',
    xpReward: 30,
    progress: 0,
    target: 1,
    completed: false,
    category: 'simulation'
  },

  // Weekly Quests
  {
    id: 'w1',
    title: 'Cek Financial Health Score',
    description: 'Lakukan evaluasi skor kesehatan keuangan Anda minggu ini di Dashboard.',
    type: 'weekly',
    xpReward: 50,
    progress: 0,
    target: 1,
    completed: false,
    category: 'budgeting'
  },
  {
    id: 'w2',
    title: 'Mainkan Simulasi Perjalanan Hidup',
    description: 'Simulasikan 10-30 tahun karir dan investasi Anda di Life Simulator.',
    type: 'weekly',
    xpReward: 75,
    progress: 0,
    target: 1,
    completed: false,
    category: 'simulation'
  },
  {
    id: 'w3',
    title: 'Konsultasi 1x dengan AI Tutor',
    description: 'Tanyakan strategi penghematan atau investasi pada Sikaya AI Advisor.',
    type: 'weekly',
    xpReward: 40,
    progress: 0,
    target: 1,
    completed: false,
    category: 'investment'
  }
];

export function getStoredQuests(): Quest[] {
  const saved = localStorage.getItem('sikaya_quests');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading quests:', e);
    }
  }
  return INITIAL_QUESTS;
}

export function saveQuests(quests: Quest[]) {
  localStorage.setItem('sikaya_quests', JSON.stringify(quests));
}
