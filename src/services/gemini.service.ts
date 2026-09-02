import { GoogleGenAI } from '@google/genai';
import { AppError } from '../middleware/errorHandler.ts';
import { Logger } from '../utils/logger.ts';

export interface UserFinancialProfile {
  income: number;
  expenses: number;
  emergencyFund?: number;
  savings?: number;
  cash: number;
  investments: number;
  totalDebt: number;
  monthlyDebt: number;
  healthScore: number;
  healthGrade?: string;
  riskTolerance: string;
  goals: string;
}

export interface GeminiChatPayload {
  profile: UserFinancialProfile;
  question: string;
  mood: string;
}

export interface GeminiNormalizedResponse {
  reply: string;
  disclaimer: string;
  generatedAt: string;
}

export class GeminiService {
  private static getClient(): GoogleGenAI {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new AppError(
        'API Key Gemini belum dikonfigurasi pada server.',
        500,
        'GEMINI_CONFIG_ERROR'
      );
    }
    return new GoogleGenAI({ apiKey });
  }

  static buildPrompt(payload: GeminiChatPayload): string {
    const { profile, question, mood } = payload;
    const emergencyFund = profile.emergencyFund ?? profile.savings ?? 0;
    
    return `Anda adalah SiKaya AI Financial Advisor - Perencana Keuangan Terakreditasi dan Tutor Pintar Keuangan Indonesia.
Gunakan profil data keuangan riil pengguna di bawah ini untuk memberikan nasihat terpersonalisasi, konkret, dan berbasis angka yang matematis & praktis.

PROFIL KEUANGAN LENGKAP PENGGUNA:
- Pemasukan Bulanan: Rp ${Number(profile.income).toLocaleString("id-ID")}
- Pengeluaran Bulanan: Rp ${Number(profile.expenses).toLocaleString("id-ID")}
- Dana Darurat Tersedia: Rp ${Number(emergencyFund).toLocaleString("id-ID")}
- Saldo Kas Likuid: Rp ${Number(profile.cash).toLocaleString("id-ID")}
- Total Investasi: Rp ${Number(profile.investments).toLocaleString("id-ID")}
- Total Utang: Rp ${Number(profile.totalDebt).toLocaleString("id-ID")}
- Cicilan Utang Bulanan: Rp ${Number(profile.monthlyDebt).toLocaleString("id-ID")}
- Financial Health Score: ${profile.healthScore} / 100 (${profile.healthGrade || "C"})
- Toleransi Risiko: ${profile.riskTolerance}
- Tujuan Keuangan: ${profile.goals}

GAYA BICARA / TONE OF VOICE: ${mood}
(Jika 'Profesional': Bahasa sopan, obyektif, terstruktur, berbasis analisis finansial.
 Jika 'Savage': Tegas, blak-blakan, realistis tanpa basa-basi, menyentil kebiasaan boros secara cerdas & lucu.
 Jika 'Empathetic': Ramah, hangat, memotivasi, dan menenangkan kekhawatiran finansial pengguna).

PERTANYAAN PENGGUNA: "${question}"

INSTRUKSI JAWABAN:
1. Hubungkan secara langsung dengan angka riil pengguna di atas (seperti rasio utang, ketahanan dana darurat, atau cashflow bulanan).
2. Berikan 2-3 langkah taktis dan konkret yang dapat dieksekusi hari ini.
3. Sertakan angka perhitungan atau simulasi singkat jika relevan.
4. Gunakan format Markdown yang rapi dengan poin-poin dan penekanan cetak tebal.
5. Cantumkan catatan penutup singkat bahwa seluruh analisis bersifat edukasi finansial.`;
  }

  static async generateChatReply(payload: GeminiChatPayload, userUid: string): Promise<GeminiNormalizedResponse> {
    const ai = this.getClient();
    const prompt = this.buildPrompt(payload);

    Logger.info(`[Gemini Service] Sending content generation request`, { userUid });

    const generatePromise = ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(
          new AppError(
            'Permintaan ke AI melebihi batas waktu (timeout). Silakan coba lagi.',
            504,
            'AI_TIMEOUT'
          )
        );
      }, 25000);
    });

    try {
      const response = await Promise.race([generatePromise, timeoutPromise]);
      
      if (!response || !response.text) {
        throw new AppError('Respon kosong diterima dari layanan AI.', 502, 'AI_BAD_GATEWAY');
      }

      return {
        reply: response.text,
        disclaimer: 'Informasi yang diberikan bersifat edukasi dan bukan rekomendasi investasi profesional.',
        generatedAt: new Date().toISOString(),
      };
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error;
      }
      const err = error as { message?: string };
      throw new AppError(
        err?.message || 'Terjadi kesalahan saat berkomunikasi dengan AI.',
        500,
        'AI_SERVICE_ERROR'
      );
    }
  }
}
