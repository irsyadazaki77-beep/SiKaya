export type AssetType = 'Saham' | 'Reksa Dana' | 'Kripto' | 'Emas' | 'Kas & Deposito' | 'SBN / Obligasi' | 'Properti' | 'Lainnya';

export interface ManualAsset {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  buyPrice: number;
  currentPrice: number;
  shares: number;
  notes?: string;
  createdAt?: string;
}

export interface BudgetEnvelope {
  id: string;
  category: 'Makan & Minum' | 'Transportasi' | 'Tempat Tinggal' | 'Pendidikan & Skill' | 'Hiburan & Lifestyle' | 'Tagihan & Utilitas' | 'Kesehatan' | 'Investasi & Tabungan' | 'Lainnya';
  monthlyBudget: number;
  spent: number;
  color?: string;
  icon?: string;
}

export interface FinancialGoal {
  id: string;
  name: string;
  category: 'Dana Darurat' | 'Gadget / Laptop' | 'Kendaraan' | 'Rumah' | 'Pernikahan' | 'Pendidikan' | 'Liburan' | 'Investasi' | 'Pensiun' | 'Custom';
  targetAmount: number;
  currentSaved: number;
  targetDate: string; // ISO date string (YYYY-MM-DD)
  monthlyContribution: number;
  isCompleted?: boolean;
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
  persona?: {
    condition: 'Mahasiswa' | 'Pekerja Baru' | 'Profesional' | 'Freelancer / Wirausaha';
    primaryGoal: 'darurat' | 'utang' | 'investasi' | 'rumah' | 'budgeting' | 'pensiun' | 'pendidikan';
    knowledgeLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  };
  goals: string[];
  financialGoals?: FinancialGoal[];
  budgetEnvelopes?: BudgetEnvelope[];
}

export interface FinancialHealthRatio {
  name: string;
  pillar: 'cashflow' | 'emergency' | 'debt' | 'savings' | 'investment';
  value: number;
  target: string;
  formattedValue: string;
  scoreOutOf20: number; // 0 - 20
  score: number; // 0 - 100 equivalent
  status: 'A' | 'B' | 'C' | 'D' | 'F';
  whyThisScore: string;
  howToImprove: string;
  relatedModuleId?: string;
}

export interface FinancialHealthScoreResult {
  overallScore: number; // 0 - 100
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  statusLabel: string;
  summary: string;
  pillars: {
    cashflow: FinancialHealthRatio;
    emergencyFund: FinancialHealthRatio;
    debtRatio: FinancialHealthRatio;
    savingsRate: FinancialHealthRatio;
    investmentAllocation: FinancialHealthRatio;
  };
  recommendations: {
    title: string;
    description: string;
    moduleId?: string;
    priority: 'high' | 'medium' | 'low';
  }[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  xpReward: number;
  coinReward?: number;
  progress: number;
  target: number;
  completed: boolean;
  claimed?: boolean;
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
  fee: number;
  totalAmount: number;
  timestamp: string;
  status: 'EXECUTED' | 'PENDING' | 'CANCELLED';
  journalThesis?: string;
  journalRisk?: string;
  journalTarget?: string;
}

export interface TradingJournalEntry {
  id: string;
  tradeId: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  date: string;
  buyPrice: number;
  shares: number;
  thesis: string;
  riskPlan: string;
  targetPrice: number;
  reviewDecision?: string;
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
  stressLevel: number; // 0 - 100
  happinessLevel: number; // 0 - 100
  milestones: string[];
  decisionLogs: {
    age: number;
    title: string;
    choice: string;
    impact: string;
  }[];
  yearlyLogs: {
    year: number;
    age: number;
    salary: number;
    netWorth: number;
    liquidCash: number;
    investments: number;
    debt: number;
    event?: string;
  }[];
}
