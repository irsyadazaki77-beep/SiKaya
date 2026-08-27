export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number
): number {
  if (principal < 0 || monthlyContribution < 0 || annualRatePercent < 0 || years < 0) {
    return 0; // Invalid inputs
  }

  let total = principal;
  const r = annualRatePercent / 100;

  for (let i = 0; i < years; i++) {
    total = total * (1 + r);
    // Simplified average compound for mid-year deposits
    total += (monthlyContribution * 12) * (1 + r / 2);
  }

  return Math.round(total);
}

export function calculateSimpleInterest(
  principal: number,
  monthlyContribution: number,
  annualRatePercent: number,
  years: number
): number {
  if (principal < 0 || monthlyContribution < 0 || annualRatePercent < 0 || years < 0) {
    return 0; // Invalid inputs
  }

  const r = annualRatePercent / 100;
  const totalPrincipal = principal + (monthlyContribution * 12 * years);
  const interestFromPrincipal = principal * r * years;
  
  // Average interest for contributions over time
  // First year contribution earns (years - 0.5) * r, last year earns 0.5 * r
  const totalContributions = monthlyContribution * 12;
  let interestFromContributions = 0;
  for (let i = 0; i < years; i++) {
    interestFromContributions += totalContributions * r * (years - i - 0.5);
  }

  return Math.round(totalPrincipal + interestFromPrincipal + interestFromContributions);
}

export function calculatePortfolioValue(
  assets: { amount: number; changePercent: number }[]
): { totalValue: number; totalChangeAmount: number; totalChangePercent: number } {
  let totalValue = 0;
  let previousTotalValue = 0;

  assets.forEach(asset => {
    if (asset.amount < 0) return; // ignore invalid asset amounts
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
