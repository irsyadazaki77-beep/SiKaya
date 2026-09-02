import { FinancialProfile, FinancialHealthScoreResult, FinancialHealthRatio } from '../types/financial';

export function calculateFinancialHealthScore(profile: FinancialProfile): FinancialHealthScoreResult {
  const {
    monthlyIncome = 0,
    monthlyExpenses = 0,
    emergencyFund = 0,
    monthlyDebtPayment = 0,
    totalInvestments = 0,
    totalCash = 0,
  } = profile;

  const validIncome = Math.max(monthlyIncome, 1);
  const validExpenses = Math.max(monthlyExpenses, 1);

  // --- PILLAR 1: Cashflow (Max 20 Pts) ---
  const netCashflow = monthlyIncome - monthlyExpenses;
  const cashflowMargin = (netCashflow / validIncome) * 100;
  let cfScoreOutOf20 = 0;
  let cfStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let cfWhy = '';
  let cfHow = '';

  if (cashflowMargin >= 25) {
    cfScoreOutOf20 = 20;
    cfStatus = 'A';
    cfWhy = `Cashflow surplus sangat sehat (${cashflowMargin.toFixed(1)}% dari pemasukan). Anda memiliki ruang gerak leluasa untuk menabung dan investasi.`;
    cfHow = 'Pertahankan disiplin gaya hidup dan alirkan surplus secara otomatis ke instrumen investasi produktif.';
  } else if (cashflowMargin >= 15) {
    cfScoreOutOf20 = 16;
    cfStatus = 'B';
    cfWhy = `Surplus arus kas positif (${cashflowMargin.toFixed(1)}% margin). Masih cukup aman untuk kebutuhan bulanan.`;
    cfHow = 'Lakukan audit berkala pada pos pengeluaran gaya hidup untuk memperlebar margin surplus hingga di atas 20%.';
  } else if (cashflowMargin >= 5) {
    cfScoreOutOf20 = 11;
    cfStatus = 'C';
    cfWhy = `Surplus kas sangat tipis (${cashflowMargin.toFixed(1)}%). Rentan mengalami defisit jika ada lonjakan biaya hidup harian.`;
    cfHow = 'Gunakan sistem amplop digital dan batasi pos pengeluaran tersier (wants) maksimal 30%.';
  } else if (cashflowMargin >= 0) {
    cfScoreOutOf20 = 7;
    cfStatus = 'D';
    cfWhy = 'Arus kas pas-pasan (impas). Gaji habis tepat di akhir bulan tanpa cadangan penahan.';
    cfHow = 'Terapkan aturan pay yourself first: sisihkan minimal 10% di awal gajian sebelum mulai membelanjakan uang.';
  } else {
    cfScoreOutOf20 = 2;
    cfStatus = 'F';
    cfWhy = `Arus kas defisit (${Math.abs(cashflowMargin).toFixed(1)}% melebihi pemasukan). Anda berisiko membiayai hidup dengan utang konsumtif.`;
    cfHow = 'Segera pangkas pengeluaran non-esensial dan evaluasi peluang menambah sumber pendapatan sampingan.';
  }

  // --- PILLAR 2: Emergency Fund (Max 20 Pts) ---
  const emergencyMonths = emergencyFund / validExpenses;
  let efScoreOutOf20 = 0;
  let efStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let efWhy = '';
  let efHow = '';

  if (emergencyMonths >= 6) {
    efScoreOutOf20 = 20;
    efStatus = 'A';
    efWhy = `Dana darurat sangat kokoh (${emergencyMonths.toFixed(1)} bulan pengeluaran). Anda terlindungi dari guncangan darurat seperti PHK atau sakit mendadak.`;
    efHow = 'Pastikan dana tetap tersimpan di instrumen likuid bebas fluktuasi seperti Reksa Dana Pasar Uang (RDPU) atau deposito.';
  } else if (emergencyMonths >= 3) {
    efScoreOutOf20 = 15;
    efStatus = 'B';
    efWhy = `Dana darurat cukup baik (${emergencyMonths.toFixed(1)} bulan). Cukup untuk menopang kebutuhan jangka pendek.`;
    efHow = 'Secara bertahap tingkatkan dana darurat hingga mencapai standar ideal 6 bulan pengeluaran.';
  } else if (emergencyMonths >= 1) {
    efScoreOutOf20 = 9;
    efStatus = 'C';
    efWhy = `Dana darurat baru mencakup ${emergencyMonths.toFixed(1)} bulan. Terlalu berisiko jika terjadi situasi krisis tak terduga.`;
    efHow = 'Prioritaskan pengumpulan dana darurat sebelum menambah porsi investasi berisiko tinggi seperti saham/kripto.';
  } else {
    efScoreOutOf20 = 3;
    efStatus = 'F';
    efWhy = 'Dana darurat hampir tidak ada (< 1 bulan). Setiap kejutan finansial dapat langsung memaksa Anda berutang.';
    efHow = 'Fokuskan 50% surplus bulanan untuk membangun pos dana darurat hingga minimal setara 1 bulan pengeluaran.';
  }

  // --- PILLAR 3: Debt-to-Income Ratio (Max 20 Pts) ---
  const dtiPercent = (monthlyDebtPayment / validIncome) * 100;
  let dtiScoreOutOf20 = 0;
  let dtiStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let dtiWhy = '';
  let dtiHow = '';

  if (dtiPercent === 0) {
    dtiScoreOutOf20 = 20;
    dtiStatus = 'A';
    dtiWhy = 'Bebas utang (DTI 0%). Pendapatan Anda sepenuhnya bebas dari beban cicilan bulanan.';
    cfHow = 'Pertahankan kondisi bebas utang konsumtif dan gunakan kapasitas tabungan untuk investasi produktif.';
    dtiHow = 'Hindari mengambil cicilan konsumtif (seperti paylater tanpa rencana) yang tidak menghasilkan nilai tambah.';
  } else if (dtiPercent <= 15) {
    dtiScoreOutOf20 = 18;
    dtiStatus = 'A';
    dtiWhy = `Beban cicilan sangat ringan (${dtiPercent.toFixed(1)}% dari pemasukan). Berada jauh di bawah batas aman 30%.`;
    dtiHow = 'Lakukan pembayaran tepat waktu dan hindari menambah cicilan baru jika tidak mendesak.';
  } else if (dtiPercent <= 30) {
    dtiScoreOutOf20 = 14;
    dtiStatus = 'B';
    dtiWhy = `Beban cicilan moderat (${dtiPercent.toFixed(1)}%). Masih dalam rentang batas aman perbankan.`;
    dtiHow = 'Jangan menambah fasilitas pinjaman baru hingga sebagian cicilan selesai.';
  } else if (dtiPercent <= 40) {
    dtiScoreOutOf20 = 8;
    dtiStatus = 'C';
    dtiWhy = `Beban cicilan tinggi (${dtiPercent.toFixed(1)}%). Mendekati zona bahaya over-leverage.`;
    dtiHow = 'Gunakan metode Debt Snowball atau Debt Avalanche untuk mempercepat pelunasan utang dengan bunga tertinggi.';
  } else {
    dtiScoreOutOf20 = 3;
    dtiStatus = 'F';
    dtiWhy = `Beban cicilan kritis (${dtiPercent.toFixed(1)}% pendapatan). Sebagian besar gaji terkuras hanya untuk melunasi utang.`;
    dtiHow = 'Hentikan penggunaan kartu kredit/paylater baru dan segera hubungi kreditur untuk restrukturisasi tenor jika diperlukan.';
  }

  // --- PILLAR 4: Savings Rate (Max 20 Pts) ---
  const savingsPercent = (netCashflow / validIncome) * 100;
  let srScoreOutOf20 = 0;
  let srStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let srWhy = '';
  let srHow = '';

  if (savingsPercent >= 30) {
    srScoreOutOf20 = 20;
    srStatus = 'A';
    srWhy = `Tingkat tabungan istimewa (${savingsPercent.toFixed(1)}% dari penghasilan). Melebihi target standar 20%.`;
    srHow = 'Diversifikasikan tabungan ke instrumen investasi agar daya belinya tidak tergerus inflasi jangka panjang.';
  } else if (savingsPercent >= 20) {
    srScoreOutOf20 = 16;
    srStatus = 'B';
    srWhy = `Tingkat tabungan sesuai standar ideal 50/30/20 (${savingsPercent.toFixed(1)}%).`;
    srHow = 'Terapkan auto-debet investasi setiap tanggal gajian untuk menjaga konsistensi menabung.';
  } else if (savingsPercent >= 10) {
    srScoreOutOf20 = 11;
    srStatus = 'C';
    srWhy = `Tingkat tabungan baru mencapai ${savingsPercent.toFixed(1)}%. Masih di bawah batas optimal 20%.`;
    srHow = 'Tantang diri Anda untuk memangkas satu pos pengeluaran langganan/hiburan agar savings rate naik 5%.';
  } else if (savingsPercent > 0) {
    srScoreOutOf20 = 6;
    srStatus = 'D';
    srWhy = `Tingkat tabungan sangat rendah (${savingsPercent.toFixed(1)}%). Akumulasi kekayaan akan berjalan lambat.`;
    srHow = 'Catat pengeluaran harian menggunakan fitur Budgeting untuk menemukan kebocoran dana tersembunyi (latte factor).';
  } else {
    srScoreOutOf20 = 1;
    srStatus = 'F';
    srWhy = 'Tidak ada tabungan yang berhasil disisihkan bulan ini.';
    srHow = 'Terapkan metode amplop digital agar pengeluaran harian tidak melebihi alokasi yang ditentukan.';
  }

  // --- PILLAR 5: Investment Allocation (Max 20 Pts) ---
  const totalLiquidAssets = totalCash + totalInvestments;
  const investPercent = totalLiquidAssets > 0 ? (totalInvestments / totalLiquidAssets) * 100 : 0;
  let invScoreOutOf20 = 0;
  let invStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let invWhy = '';
  let invHow = '';

  if (investPercent >= 25 && investPercent <= 70) {
    invScoreOutOf20 = 20;
    invStatus = 'A';
    invWhy = `Alokasi aset sangat proporsional (${investPercent.toFixed(1)}% diinvestasikan, sisanya kas likuid).`;
    invHow = 'Lakukan rebalancing portofolio setiap 6-12 bulan untuk mempertahankan porsi risiko yang seimbang.';
  } else if (investPercent > 70 && investPercent <= 85) {
    invScoreOutOf20 = 16;
    invStatus = 'B';
    invWhy = `Alokasi investasi agresif (${investPercent.toFixed(1)}%). Sangat produktif namun pastikan kas harian tetap aman.`;
    invHow = 'Pastikan Anda tidak terpaksa mencairkan investasi saat pasar sedang koreksi demi menutup biaya mendadak.';
  } else if (investPercent >= 10) {
    invScoreOutOf20 = 12;
    invStatus = 'C';
    invWhy = `Porsi investasi baru ${investPercent.toFixed(1)}%. Sebagian besar dana masih mengendap di rekening bank biasa.`;
    invHow = 'Mulai alokasikan dana dingin secara rutin ke instrumen reksa dana atau SBN untuk melawan laju inflasi.';
  } else {
    invScoreOutOf20 = 5;
    invStatus = 'D';
    invWhy = `Porsi investasi sangat minim (${investPercent.toFixed(1)}%). Uang tunai rentan kehilangan daya beli akibat inflasi.`;
    invHow = 'Pelajari profil risiko Anda dan mulailah berinvestasi dengan modal kecil mulai Rp 10.000 di reksa dana pasar uang.';
  }

  // --- Total Calculation (Sum of 5 pillars: max 100) ---
  const overallScore = cfScoreOutOf20 + efScoreOutOf20 + dtiScoreOutOf20 + srScoreOutOf20 + invScoreOutOf20;

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  let statusLabel = 'Cukup Stabil';
  let summary = '';

  if (overallScore >= 90) {
    grade = 'A+';
    statusLabel = 'Sangat Sehat & Mandiri';
    summary = 'Kondisi finansial Anda sangat kokoh dengan arus kas surplus, dana darurat lengkap, dan alokasi aset yang terencana.';
  } else if (overallScore >= 75) {
    grade = 'A';
    statusLabel = 'Sehat & Terencana';
    summary = 'Struktur keuangan Anda berada dalam kondisi baik dengan rasio utang dan tabungan yang disiplin.';
  } else if (overallScore >= 60) {
    grade = 'B';
    statusLabel = 'Cukup Stabil';
    summary = 'Keuangan Anda relatif stabil, namun terdapat ruang optimasi pada pos dana darurat atau porsi investasi berkala.';
  } else if (overallScore >= 45) {
    grade = 'C';
    statusLabel = 'Perlu Perhatian';
    summary = 'Terdapat beberapa kelemahan pada arus kas atau beban cicilan yang perlu segera dibenahi agar tidak memicu krisis.';
  } else {
    grade = 'F';
    statusLabel = 'Zona Waspada';
    summary = 'Struktur keuangan Anda membutuhkan perbaikan mendesak. Prioritaskan pengendalian pengeluaran dan pemulihan dana darurat.';
  }

  // Adaptive Recommendations
  const recommendations: {
    title: string;
    description: string;
    moduleId?: string;
    priority: 'high' | 'medium' | 'low';
  }[] = [];

  if (efScoreOutOf20 < 14) {
    recommendations.push({
      title: 'Perkuat Dana Darurat Minimal 3 Bulan',
      description: efHow,
      moduleId: 'emergency',
      priority: 'high',
    });
  }

  if (dtiScoreOutOf20 < 14) {
    recommendations.push({
      title: 'Kendalikan Rasio Utang & Pinjol',
      description: dtiHow,
      moduleId: 'debt',
      priority: 'high',
    });
  }

  if (cfScoreOutOf20 < 14 || srScoreOutOf20 < 14) {
    recommendations.push({
      title: 'Terapkan Aturan Budgeting 50/30/20',
      description: cfHow,
      moduleId: 'budgeting',
      priority: 'medium',
    });
  }

  if (invScoreOutOf20 < 14) {
    recommendations.push({
      title: 'Mulai Investasi Terencana Sesuai Profil Risiko',
      description: invHow,
      moduleId: 'investing',
      priority: 'medium',
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: 'Pertahankan Disiplin & Optimalkan Portofolio',
      description: 'Struktur finansial Anda sudah sangat baik. Lakukan rebalancing berkala dan review target jangka panjang Anda.',
      moduleId: 'portfolio',
      priority: 'low',
    });
  }

  return {
    overallScore,
    grade,
    statusLabel,
    summary,
    pillars: {
      cashflow: {
        name: 'Arus Kas (Cashflow)',
        pillar: 'cashflow',
        value: cashflowMargin,
        target: 'Surplus ≥ 20%',
        formattedValue: `${cashflowMargin >= 0 ? '+' : ''}${cashflowMargin.toFixed(1)}%`,
        scoreOutOf20: cfScoreOutOf20,
        score: Math.round((cfScoreOutOf20 / 20) * 100),
        status: cfStatus,
        whyThisScore: cfWhy,
        howToImprove: cfHow,
        relatedModuleId: 'budgeting',
      },
      emergencyFund: {
        name: 'Dana Darurat',
        pillar: 'emergency',
        value: emergencyMonths,
        target: '3 - 6 Bulan Biaya Hidup',
        formattedValue: `${emergencyMonths.toFixed(1)} Bln`,
        scoreOutOf20: efScoreOutOf20,
        score: Math.round((efScoreOutOf20 / 20) * 100),
        status: efStatus,
        whyThisScore: efWhy,
        howToImprove: efHow,
        relatedModuleId: 'emergency',
      },
      debtRatio: {
        name: 'Rasio Beban Utang (DTI)',
        pillar: 'debt',
        value: dtiPercent,
        target: '≤ 30% dari Penghasilan',
        formattedValue: `${dtiPercent.toFixed(1)}%`,
        scoreOutOf20: dtiScoreOutOf20,
        score: Math.round((dtiScoreOutOf20 / 20) * 100),
        status: dtiStatus,
        whyThisScore: dtiWhy,
        howToImprove: dtiHow,
        relatedModuleId: 'debt',
      },
      savingsRate: {
        name: 'Tingkat Tabungan (Savings)',
        pillar: 'savings',
        value: savingsPercent,
        target: '≥ 20% dari Penghasilan',
        formattedValue: `${savingsPercent.toFixed(1)}%`,
        scoreOutOf20: srScoreOutOf20,
        score: Math.round((srScoreOutOf20 / 20) * 100),
        status: srStatus,
        whyThisScore: srWhy,
        howToImprove: srHow,
        relatedModuleId: 'budgeting',
      },
      investmentAllocation: {
        name: 'Alokasi Investasi',
        pillar: 'investment',
        value: investPercent,
        target: '25% - 70% Aset Likuid',
        formattedValue: `${investPercent.toFixed(1)}%`,
        scoreOutOf20: invScoreOutOf20,
        score: Math.round((invScoreOutOf20 / 20) * 100),
        status: invStatus,
        whyThisScore: invWhy,
        howToImprove: invHow,
        relatedModuleId: 'investing',
      },
    },
    recommendations,
  };
}

export const DEFAULT_FINANCIAL_PROFILE: FinancialProfile = {
  monthlyIncome: 8500000,
  monthlyExpenses: 5200000,
  totalCash: 12500000,
  emergencyFund: 18000000,
  totalDebt: 3500000,
  monthlyDebtPayment: 850000,
  totalInvestments: 24500000,
  riskTolerance: 'Moderat',
  persona: {
    condition: 'Pekerja Baru',
    primaryGoal: 'darurat',
    knowledgeLevel: 'Intermediate',
  },
  goals: ['Tabungan Rumah Pertama', 'Dana Darurat 6 Bulan'],
  financialGoals: [
    {
      id: 'goal-1',
      name: 'Dana Darurat 6 Bulan',
      category: 'Dana Darurat',
      targetAmount: 31200000,
      currentSaved: 18000000,
      targetDate: '2026-12-31',
      monthlyContribution: 1500000,
    },
    {
      id: 'goal-2',
      name: 'DP Rumah Pertama',
      category: 'Rumah',
      targetAmount: 80000000,
      currentSaved: 24500000,
      targetDate: '2028-12-31',
      monthlyContribution: 2000000,
    }
  ],
  budgetEnvelopes: [
    { id: 'b-1', category: 'Makan & Minum', monthlyBudget: 2000000, spent: 1450000 },
    { id: 'b-2', category: 'Tempat Tinggal', monthlyBudget: 1500000, spent: 1500000 },
    { id: 'b-3', category: 'Transportasi', monthlyBudget: 600000, spent: 420000 },
    { id: 'b-4', category: 'Tagihan & Utilitas', monthlyBudget: 500000, spent: 480000 },
    { id: 'b-5', category: 'Hiburan & Lifestyle', monthlyBudget: 600000, spent: 550000 },
    { id: 'b-6', category: 'Investasi & Tabungan', monthlyBudget: 2000000, spent: 2000000 },
    { id: 'b-7', category: 'Lainnya', monthlyBudget: 500000, spent: 200000 },
  ]
};
