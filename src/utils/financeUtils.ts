/**
 * Finance Math Utility Functions for SiKaya
 * Strictly pure, tested, and reliable financial calculations
 */

export function calculateSimpleInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number
): number {
  if (principal < 0 || monthlyContribution < 0 || annualRatePercent < 0 || years < 0) {
    return 0;
  }

  const r = annualRatePercent / 100;
  const totalPrincipal = principal + (monthlyContribution * 12 * years);
  const interestFromPrincipal = principal * r * years;
  
  const totalContributions = monthlyContribution * 12;
  let interestFromContributions = 0;
  for (let i = 0; i < years; i++) {
    interestFromContributions += totalContributions * r * (years - i - 0.5);
  }

  return Math.round(totalPrincipal + interestFromPrincipal + interestFromContributions);
}

export function formatRupiah(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return 'Rp 0';
  const rounded = Math.round(amount);
  return 'Rp ' + rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function parseRupiah(str: string): number {
  if (!str) return 0;
  const cleaned = str.replace(/[^0-9]/g, '');
  return parseInt(cleaned, 10) || 0;
}

export interface InvestmentProjectionYear {
  year: number;
  totalContributions: number;
  totalInterest: number;
  balanceBase: number;
  balanceConservative: number;
  balanceAggressive: number;
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number,
  compoundingPerYear: number = 12
): number {
  if (principal < 0 || monthlyContribution < 0 || annualRatePercent < 0 || years < 0) {
    return 0;
  }

  const r = annualRatePercent / 100;
  const n = compoundingPerYear;
  const t = years;

  if (r === 0) {
    return Math.round(principal + (monthlyContribution * 12 * t));
  }

  // Future value of initial principal: P * (1 + r/n)^(n*t)
  const fvPrincipal = principal * Math.pow(1 + r / n, n * t);

  // Future value of monthly contributions made at end of each period:
  // PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]
  const monthlyRate = r / n;
  const totalPeriods = n * t;
  const fvAnnuity = monthlyContribution * ((Math.pow(1 + monthlyRate, totalPeriods) - 1) / monthlyRate);

  return Math.round(fvPrincipal + fvAnnuity);
}

export function calculateInvestmentProjections(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number
): {
  finalBalance: number;
  totalInvested: number;
  totalGains: number;
  yearlyData: InvestmentProjectionYear[];
} {
  const yearlyData: InvestmentProjectionYear[] = [];
  const rateCons = Math.max(0, annualRatePercent - 3);
  const rateAggr = annualRatePercent + 3;

  for (let y = 1; y <= years; y++) {
    const totalContr = principal + (monthlyContribution * 12 * y);
    const balanceBase = calculateCompoundInterest(principal, monthlyContribution, annualRatePercent, y);
    const balanceCons = calculateCompoundInterest(principal, monthlyContribution, rateCons, y);
    const balanceAggr = calculateCompoundInterest(principal, monthlyContribution, rateAggr, y);
    const totalInt = Math.max(0, balanceBase - totalContr);

    yearlyData.push({
      year: y,
      totalContributions: totalContr,
      totalInterest: totalInt,
      balanceBase,
      balanceConservative: balanceCons,
      balanceAggressive: balanceAggr
    });
  }

  const finalBalance = yearlyData.length > 0 ? yearlyData[yearlyData.length - 1].balanceBase : principal;
  const totalInvested = principal + (monthlyContribution * 12 * years);
  const totalGains = Math.max(0, finalBalance - totalInvested);

  return {
    finalBalance,
    totalInvested,
    totalGains,
    yearlyData
  };
}

export interface FirePlanInput {
  currentAge: number;
  targetAge: number;
  monthlyExpenses: number;
  currentInvestments: number;
  monthlyInvestment: number;
  expectedReturnPercent: number; // e.g. 10%
  inflationPercent: number;      // e.g. 4%
  withdrawalRatePercent: number; // e.g. 4% (25x)
}

export interface FirePlanResult {
  fireNumberToday: number;
  fireNumberFuture: number;
  projectedCorpusAtTargetAge: number;
  shortfallOrSurplus: number;
  isGoalAchieved: boolean;
  requiredMonthlySavings: number;
  annualPassiveIncomeAtRetirement: number;
  monthlyPassiveIncomeAtRetirement: number;
  yearsToRetirement: number;
  yearlyProjection: {
    age: number;
    investedCapital: number;
    projectedCorpus: number;
    fireTarget: number;
  }[];
}

export function calculateFirePlan(input: FirePlanInput): FirePlanResult {
  const yearsToRetirement = Math.max(0, input.targetAge - input.currentAge);
  const annualExpensesToday = input.monthlyExpenses * 12;
  const swr = input.withdrawalRatePercent / 100 || 0.04;

  // FIRE Number today = Annual Expense / SWR
  const fireNumberToday = Math.round(annualExpensesToday / swr);

  // Future expense accounting for inflation: Exp_future = Exp_today * (1 + infl)^years
  const inflRate = input.inflationPercent / 100;
  const futureAnnualExpense = annualExpensesToday * Math.pow(1 + inflRate, yearsToRetirement);
  const fireNumberFuture = Math.round(futureAnnualExpense / swr);

  // Net real rate of return = (1 + r) / (1 + infl) - 1 or nominal calculation
  const projectedCorpusAtTargetAge = calculateCompoundInterest(
    input.currentInvestments,
    input.monthlyInvestment,
    input.expectedReturnPercent,
    yearsToRetirement
  );

  const shortfallOrSurplus = projectedCorpusAtTargetAge - fireNumberFuture;
  const isGoalAchieved = shortfallOrSurplus >= 0;

  // Required monthly savings if shortfall > 0
  let requiredMonthlySavings = input.monthlyInvestment;
  if (!isGoalAchieved && yearsToRetirement > 0) {
    const r = input.expectedReturnPercent / 100 / 12;
    const n = yearsToRetirement * 12;
    const fvInitial = input.currentInvestments * Math.pow(1 + r, n);
    const targetRemainder = Math.max(0, fireNumberFuture - fvInitial);
    
    if (r > 0) {
      requiredMonthlySavings = Math.round(targetRemainder * (r / (Math.pow(1 + r, n) - 1)));
    } else {
      requiredMonthlySavings = Math.round(targetRemainder / n);
    }
  }

  const annualPassiveIncomeAtRetirement = Math.round(projectedCorpusAtTargetAge * swr);
  const monthlyPassiveIncomeAtRetirement = Math.round(annualPassiveIncomeAtRetirement / 12);

  // Generate milestone curve
  const yearlyProjection: { age: number; investedCapital: number; projectedCorpus: number; fireTarget: number }[] = [];
  for (let y = 0; y <= yearsToRetirement; y++) {
    const age = input.currentAge + y;
    const invested = input.currentInvestments + (input.monthlyInvestment * 12 * y);
    const corpus = calculateCompoundInterest(input.currentInvestments, input.monthlyInvestment, input.expectedReturnPercent, y);
    const targetAtY = Math.round((annualExpensesToday * Math.pow(1 + inflRate, y)) / swr);
    yearlyProjection.push({
      age,
      investedCapital: invested,
      projectedCorpus: corpus,
      fireTarget: targetAtY
    });
  }

  return {
    fireNumberToday,
    fireNumberFuture,
    projectedCorpusAtTargetAge,
    shortfallOrSurplus,
    isGoalAchieved,
    requiredMonthlySavings,
    annualPassiveIncomeAtRetirement,
    monthlyPassiveIncomeAtRetirement,
    yearsToRetirement,
    yearlyProjection
  };
}

export function calculateEmergencyFundTarget(
  monthlyExpense: number,
  status: 'single' | 'married' | 'kids' | 'freelancer'
): { targetMonths: number; targetAmount: number; rationale: string } {
  let targetMonths = 3;
  let rationale = '';

  switch (status) {
    case 'single':
      targetMonths = 3;
      rationale = 'Lajang tanpa tanggungan idealnya menyiapkan 3-6 bulan biaya hidup dasar.';
      break;
    case 'married':
      targetMonths = 6;
      rationale = 'Sudah berkeluarga tanpa anak disarankan memiliki 6 bulan dana darurat untuk melindungi pasangan.';
      break;
    case 'kids':
      targetMonths = 9;
      rationale = 'Berkeluarga dengan anak membutuhkan 9-12 bulan dana darurat untuk ketahanan kesehatan & pendidikan.';
      break;
    case 'freelancer':
      targetMonths = 12;
      rationale = 'Pekerja lepas / wirausaha dengan pendapatan fluktuatif membutuhkan minimal 12 bulan dana darurat.';
      break;
  }

  return {
    targetMonths,
    targetAmount: monthlyExpense * targetMonths,
    rationale
  };
}

export function calculatePortfolioValue(
  assets: { amount: number; changePercent: number }[]
): { totalValue: number; totalChangeAmount: number; totalChangePercent: number } {
  let totalValue = 0;
  let previousTotalValue = 0;

  assets.forEach(asset => {
    if (asset.amount < 0) return;
    totalValue += asset.amount;
    const prevAssetValue = asset.amount / (1 + asset.changePercent / 100);
    previousTotalValue += prevAssetValue;
  });

  const totalChangeAmount = totalValue - previousTotalValue;
  const totalChangePercent = previousTotalValue > 0 ? (totalChangeAmount / previousTotalValue) * 100 : 0;

  return {
    totalValue: Math.round(totalValue),
    totalChangeAmount: Math.round(totalChangeAmount),
    totalChangePercent: Number(totalChangePercent.toFixed(2))
  };
}
