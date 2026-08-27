import { FinancialProfile, FinancialHealthScoreResult } from '../types/financial';

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
  const netWorth = Math.max(totalCash + totalInvestments - profile.totalDebt, 0);

  // 1. Emergency Fund Ratio (Months of expenses)
  const emergencyMonths = emergencyFund / validExpenses;
  let efScore = 0;
  let efStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let efAdvice = '';

  if (emergencyMonths >= 6) {
    efScore = 100;
    efStatus = 'A';
    efAdvice = 'Sangat Baik! Dana darurat cukup untuk membiayai ≥ 6 bulan kebutuhan.';
  } else if (emergencyMonths >= 3) {
    efScore = 80;
    efStatus = 'B';
    efAdvice = 'Baik. Pertimbangkan untuk melengkapi hingga 6 bulan pengeluaran.';
  } else if (emergencyMonths >= 1) {
    efScore = 50;
    efStatus = 'C';
    efAdvice = 'Kurang Ideal. Tingkatkan dana darurat Anda minimal setara 3 bulan pengeluaran.';
  } else {
    efScore = 20;
    efStatus = 'F';
    efAdvice = 'Bahaya! Segera kumpulkan dana darurat darurat untuk mengantisipasi risiko.';
  }

  // 2. Savings Rate (% of Income saved)
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const savingsPercent = (monthlySavings / validIncome) * 100;
  let srScore = 0;
  let srStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let srAdvice = '';

  if (savingsPercent >= 30) {
    srScore = 100;
    srStatus = 'A';
    srAdvice = 'Luar biasa! Anda menyisihkan ≥ 30% pendapatan tiap bulan.';
  } else if (savingsPercent >= 20) {
    srScore = 85;
    srStatus = 'B';
    srAdvice = 'Sesuai standar ideal (50/30/20). Pertahankan alokasi ini.';
  } else if (savingsPercent >= 10) {
    srScore = 60;
    srStatus = 'C';
    srAdvice = 'Tingkatkan lagi tabungan Anda hingga mencapai target minimal 20%.';
  } else if (savingsPercent >= 0) {
    srScore = 35;
    srStatus = 'D';
    srAdvice = 'Waspada! Cashflow tipis. Evaluasi pengeluaran non-esensial Anda.';
  } else {
    srScore = 10;
    srStatus = 'F';
    srAdvice = 'Defisit! Pengeluaran Anda melebihi pemasukan harian/bulanan.';
  }

  // 3. Debt-to-Income Ratio (% of income going to debt)
  const dtiPercent = (monthlyDebtPayment / validIncome) * 100;
  let dtiScore = 0;
  let dtiStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let dtiAdvice = '';

  if (dtiPercent === 0) {
    dtiScore = 100;
    dtiStatus = 'A';
    dtiAdvice = 'Bebas Utang! Tidak ada cicilan yang membebani pemasukan bulanan.';
  } else if (dtiPercent <= 20) {
    dtiScore = 90;
    dtiStatus = 'A';
    dtiAdvice = 'Aman. Rasio cicilan sangat sehat di bawah batas 20%.';
  } else if (dtiPercent <= 30) {
    dtiScore = 75;
    dtiStatus = 'B';
    dtiAdvice = 'Cukup Aman. Utang masih terjaga di batas aman 30%.';
  } else if (dtiPercent <= 40) {
    dtiScore = 50;
    dtiStatus = 'C';
    dtiAdvice = 'Waspada. Rasio utang mendekati batas krisis. Hindari utang baru.';
  } else {
    dtiScore = 20;
    dtiStatus = 'F';
    dtiAdvice = 'Kritis! Cicilan konsumtif terlalu tinggi. Segera lunasi utang bunga tinggi.';
  }

  // 4. Investment Ratio (% of liquid assets invested)
  const totalAssets = totalCash + totalInvestments;
  const investPercent = totalAssets > 0 ? (totalInvestments / totalAssets) * 100 : 0;
  let invScore = 0;
  let invStatus: 'A' | 'B' | 'C' | 'D' | 'F' = 'F';
  let invAdvice = '';

  if (investPercent >= 20 && investPercent <= 60) {
    invScore = 100;
    invStatus = 'A';
    invAdvice = 'Portofolio Tersebar Seimbang antara Likuiditas (Kas) dan Aset Produktif.';
  } else if (investPercent > 60 && investPercent <= 80) {
    invScore = 85;
    invStatus = 'B';
    invAdvice = 'Agresif Produktif. Pastikan kas likuid tetap mencukupi untuk kebutuhan harian.';
  } else if (investPercent >= 10) {
    invScore = 70;
    invStatus = 'C';
    invAdvice = 'Mulai Cukup. Pertimbangkan menambah alokasi investasi secara rutin.';
  } else {
    invScore = 40;
    invStatus = 'D';
    invAdvice = 'Uang Tunai Terlalu Banyak Terendap. Alokasikan sebagian ke instrumen pasar uang/reksadana.';
  }

  // Calculate Weighted Score
  const overallScore = Math.round(
    efScore * 0.30 +
    srScore * 0.30 +
    dtiScore * 0.25 +
    invScore * 0.15
  );

  let grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F' = 'C';
  let statusLabel = 'Cukup';
  let summary = '';

  if (overallScore >= 90) {
    grade = 'A+';
    statusLabel = 'Sangat Sehat (Sultan Finansial)';
    summary = 'Kondisi keuangan Anda luar biasa kokoh, rasio dana darurat dan cashflow berada di posisi sangat ideal.';
  } else if (overallScore >= 80) {
    grade = 'A';
    statusLabel = 'Sehat & Mandiri';
    summary = 'Struktur keuangan Anda sangat solid dengan manajemen utang dan tabungan yang disiplin.';
  } else if (overallScore >= 65) {
    grade = 'B';
    statusLabel = 'Stabil (Cukup Baik)';
    summary = 'Keuangan Anda stabil, namun ada beberapa peluang optimasi pada porsi dana darurat atau porsi investasi.';
  } else if (overallScore >= 50) {
    grade = 'C';
    statusLabel = 'Waspada (Perlu Perbaikan)';
    summary = 'Ada risiko keuangan yang perlu segera ditangani, terutama pada ketahanan cashflow atau beban utang.';
  } else {
    grade = 'F';
    statusLabel = 'Kritis (Darurat Keuangan)';
    summary = 'Kondisi finansial membutuhkan penanganan darurat. Prioritaskan restrukturisasi utang dan pemangkasan pengeluaran.';
  }

  const recommendations: string[] = [];
  if (efScore < 80) recommendations.push(efAdvice);
  if (srScore < 80) recommendations.push(srAdvice);
  if (dtiScore < 80) recommendations.push(dtiAdvice);
  if (invScore < 70) recommendations.push(invAdvice);
  if (recommendations.length === 0) {
    recommendations.push('Pertahankan disiplin keuangan ini dan lakukan rebalancing portofolio berkala.');
  }

  return {
    overallScore,
    grade,
    statusLabel,
    summary,
    ratios: {
      emergencyFundRatio: {
        name: 'Dana Darurat',
        value: emergencyMonths,
        target: '3 - 6 Bulan',
        formattedValue: `${emergencyMonths.toFixed(1)} Bln`,
        score: efScore,
        status: efStatus,
        advice: efAdvice
      },
      savingsRate: {
        name: 'Tingkat Tabungan',
        value: savingsPercent,
        target: '≥ 20%',
        formattedValue: `${savingsPercent.toFixed(1)}%`,
        score: srScore,
        status: srStatus,
        advice: srAdvice
      },
      debtToIncomeRatio: {
        name: 'Rasio Beban Utang (DTI)',
        value: dtiPercent,
        target: '≤ 30%',
        formattedValue: `${dtiPercent.toFixed(1)}%`,
        score: dtiScore,
        status: dtiStatus,
        advice: dtiAdvice
      },
      investmentRatio: {
        name: 'Rasio Investasi',
        value: investPercent,
        target: '20% - 50%',
        formattedValue: `${investPercent.toFixed(1)}%`,
        score: invScore,
        status: invStatus,
        advice: invAdvice
      }
    },
    recommendations
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
  goals: ['Tabungan Rumah First-Time', 'Dana Pensiun Mandiri']
};
