import { describe, it, expect } from 'vitest';
import { calculateFinancialHealthScore } from '../financialHealth';
import { FinancialProfile } from '../../types/financial';

describe('calculateFinancialHealthScore', () => {
  it('should calculate score correctly for ideal case', () => {
    const profile: FinancialProfile = {
      monthlyIncome: 10000000,
      monthlyExpenses: 5000000,
      emergencyFund: 30000000, // 6 months
      monthlyDebtPayment: 1000000, // 10%
      totalInvestments: 20000000,
      totalCash: 10000000,
      totalDebt: 5000000,
      riskTolerance: 'Moderat',
      goals: []
    };
    
    const result = calculateFinancialHealthScore(profile);
    
    expect(result.overallScore).toBeGreaterThanOrEqual(90);
    expect(result.grade).toBe('A+');
    expect(result.ratios.emergencyFundRatio.value).toBe(6);
    expect(result.ratios.savingsRate.value).toBe(50);
    expect(result.ratios.debtToIncomeRatio.value).toBe(10);
  });

  it('should handle zero income and zero expenses gracefully', () => {
    const profile: FinancialProfile = {
      monthlyIncome: 0,
      monthlyExpenses: 0,
      emergencyFund: 0,
      monthlyDebtPayment: 0,
      totalInvestments: 0,
      totalCash: 0,
      totalDebt: 0,
      riskTolerance: 'Konservatif',
      goals: []
    };
    
    const result = calculateFinancialHealthScore(profile);
    // Even with 0, it shouldn't NaN or throw
    expect(result.overallScore).not.toBeNaN();
    expect(result.ratios.emergencyFundRatio.value).toBe(0);
    expect(result.ratios.savingsRate.value).toBe(0);
    expect(result.ratios.debtToIncomeRatio.value).toBe(0);
    expect(result.ratios.investmentRatio.value).toBe(0);
  });

  it('should calculate bad score for high debt and low savings', () => {
    const profile: FinancialProfile = {
      monthlyIncome: 5000000,
      monthlyExpenses: 6000000, // deficit
      emergencyFund: 1000000,
      monthlyDebtPayment: 3000000, // 60% DTI
      totalInvestments: 0,
      totalCash: 1000000,
      totalDebt: 50000000,
      riskTolerance: 'Agresif',
      goals: []
    };
    
    const result = calculateFinancialHealthScore(profile);
    expect(result.grade).toBe('F');
    expect(result.ratios.savingsRate.score).toBe(10);
    expect(result.ratios.debtToIncomeRatio.score).toBe(20);
  });
  
  it('should handle negative input edge case by clamping logic', () => {
     const profile: FinancialProfile = {
      monthlyIncome: -5000,
      monthlyExpenses: -100,
      emergencyFund: -200,
      monthlyDebtPayment: -500,
      totalInvestments: -1000,
      totalCash: -500,
      totalDebt: -5000,
      riskTolerance: 'Moderat',
      goals: []
    };
    
    const result = calculateFinancialHealthScore(profile);
    expect(result.overallScore).not.toBeNaN();
  });
  
  it('should handle extremely large numbers properly', () => {
    const profile: FinancialProfile = {
      monthlyIncome: 1e12,
      monthlyExpenses: 2e11,
      emergencyFund: 1.2e12,
      monthlyDebtPayment: 5e10,
      totalInvestments: 5e12,
      totalCash: 1e12,
      totalDebt: 0,
      riskTolerance: 'Moderat',
      goals: []
    };
    const result = calculateFinancialHealthScore(profile);
    expect(result.ratios.savingsRate.value).toBe(80); // (1e12 - 2e11) / 1e12 * 100 = 80
    expect(result.overallScore).toBeGreaterThan(80);
  });
});
