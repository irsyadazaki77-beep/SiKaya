export type AssetType = 'Saham' | 'Reksa Dana' | 'Kripto' | 'Emas' | 'Kas & Deposito' | 'Lainnya';

export interface ManualAsset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  buyPrice: number;
  currentPrice: number;
  shares: number;
}

export interface FinancialProfile {
  monthlyIncome: number;
  monthlyExpenses: number;
  totalCash: number;
  emergencyFund: number;
  totalDebt: number;
  monthlyDebtPayment: number;
  totalInvestments: number;
  riskTolerance: 'Konservatif' | 'Moderat' | 'Agresif';
  goals: string[];
}

export interface FinancialHealthRatio {
  name: string;
  value: number;
  target: string;
  formattedValue: string;
  score: number; // 0-100
  status: 'A' | 'B' | 'C' | 'D' | 'F';
  advice: string;
}

export interface FinancialHealthScoreResult {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  statusLabel: string;
  summary: string;
  ratios: {
    emergencyFundRatio: FinancialHealthRatio;
    savingsRate: FinancialHealthRatio;
    debtToIncomeRatio: FinancialHealthRatio;
    investmentRatio: FinancialHealthRatio;
  };
  recommendations: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  xpReward: number;
  progress: number; // e.g. 1
  target: number; // e.g. 1
  completed: boolean;
  category: 'literacy' | 'budgeting' | 'investment' | 'simulation';
}

export interface TradeOrder {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  orderType: 'MARKET' | 'LIMIT';
  price: number;
  targetPrice?: number;
  shares: number;
  leverage: number; // 1x, 2x, 5x, 10x
  stopLoss?: number;
  takeProfit?: number;
  fee: number;
  totalAmount: number;
  timestamp: string;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
}

export interface LifeSimulatorState {
  currentAge: number;
  targetAge: number;
  monthlySalary: number;
  monthlyLivingCost: number;
  liquidCash: number;
  totalInvestments: number;
  totalDebt: number;
  careerPath: string;
  riskStyle: 'Aman' | 'Seimbang' | 'Pertumbuhan Tinggi';
  milestones: string[];
  yearlyLogs: {
    year: number;
    age: number;
    salary: number;
    netWorth: number;
    liquidCash: number;
    investments: number;
    event?: string;
  }[];
}

export interface LearningPath {
  id: string;
  title: string;
  persona: 'Mahasiswa / Pemula' | 'First Jobber / Pekerja' | 'Investor & Trader' | 'Pengusaha / Freelance';
  description: string;
  iconName: string;
  moduleIds: string[];
  progressPercent: number;
  badgeTitle: string;
}
