import { z } from 'zod';

export const ChatMoodEnum = z.enum(['Profesional', 'Savage', 'Empathetic']);

export const FinancialProfileSchema = z.object({
  income: z.number({ message: "Pemasukan harus berupa angka" })
    .min(0, "Pemasukan bulanan tidak boleh bernilai negatif")
    .default(0),
  expenses: z.number({ message: "Pengeluaran harus berupa angka" })
    .min(0, "Pengeluaran bulanan tidak boleh bernilai negatif")
    .default(0),
  emergencyFund: z.number()
    .min(0, "Dana darurat tidak boleh bernilai negatif")
    .optional(),
  savings: z.number()
    .min(0, "Tabungan tidak boleh bernilai negatif")
    .optional(),
  cash: z.number()
    .min(0, "Saldo kas tidak boleh bernilai negatif")
    .default(0),
  investments: z.number()
    .min(0, "Nilai investasi tidak boleh bernilai negatif")
    .default(0),
  totalDebt: z.number()
    .min(0, "Total utang tidak boleh bernilai negatif")
    .default(0),
  monthlyDebt: z.number()
    .min(0, "Cicilan utang bulanan tidak boleh bernilai negatif")
    .default(0),
  healthScore: z.number()
    .min(0, "Skor kesehatan keuangan minimal 0")
    .max(100, "Skor kesehatan keuangan maksimal 100")
    .default(50),
  healthGrade: z.string().max(10).optional().default('C'),
  riskTolerance: z.string().max(64).default('Moderat'),
  goals: z.string().max(500).default('Mencapai Kestabilan Finansial')
});

export const ChatRequestSchema = z.object({
  question: z.string({ message: "Pertanyaan tidak boleh kosong" })
    .trim()
    .min(1, "Pertanyaan tidak boleh kosong")
    .max(2000, "Pertanyaan maksimal 2000 karakter"),
  mood: ChatMoodEnum.default('Profesional'),
  profile: FinancialProfileSchema.optional().default({
    income: 0,
    expenses: 0,
    cash: 0,
    investments: 0,
    totalDebt: 0,
    monthlyDebt: 0,
    healthScore: 50,
    healthGrade: 'C',
    riskTolerance: 'Moderat',
    goals: 'Mencapai Kestabilan Finansial'
  })
});

export type ChatRequest = z.infer<typeof ChatRequestSchema>;

export const InvestmentTransactionTypeEnum = z.enum(['BELI', 'JUAL', 'BONUS', 'DEVIDEN']);

export const CreateInvestmentSchema = z.object({
  symbol: z.string({ message: "Symbol wajib diisi" })
    .trim()
    .min(1, "Symbol wajib diisi")
    .max(32, "Symbol maksimal 32 karakter"),
  type: InvestmentTransactionTypeEnum,
  shares: z.number({ message: "Jumlah lembar/unit wajib diisi" })
    .positive("Jumlah lembar/unit harus lebih besar dari 0"),
  price: z.number({ message: "Harga per unit wajib diisi" })
    .min(0, "Harga per unit tidak boleh bernilai negatif"),
  total: z.number().min(0, "Total transaksi tidak boleh bernilai negatif").optional()
});

export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;

export const CompleteModuleSchema = z.object({
  moduleId: z.string().min(1).max(64),
  score: z.number().min(0).max(100).optional()
});

export const UserProfileUpdateSchema = z.object({
  fullName: z.string().min(1).max(128).optional(),
  avatar: z.string().max(256).optional(),
  language: z.string().max(10).optional(),
  preferences: z.record(z.string(), z.unknown()).optional()
});
