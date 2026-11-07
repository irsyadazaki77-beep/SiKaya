import { AIAdvisorRequest, AIAdvisorResponse } from '../types/ai';

export const aiService = {
  async askAdvisor(payload: AIAdvisorRequest, token?: string | null): Promise<AIAdvisorResponse> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/advisor/chat', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        question: payload.question,
        mood: payload.mood || 'Profesional',
        history: payload.history || [],
        profile: {
          income: payload.profile?.monthlyIncome || 0,
          expenses: payload.profile?.monthlyExpenses || 0,
          emergencyFund: payload.profile?.emergencyFund || 0,
          savings: payload.profile?.totalCash || 0,
          totalDebt: payload.profile?.totalDebt || 0,
          monthlyDebt: payload.profile?.monthlyDebtPayment || 0,
          cash: payload.profile?.totalCash || 0,
          investments: payload.profile?.totalInvestments || 0,
          healthScore: 75,
          healthGrade: 'B',
          maritalStatus: (payload.profile as any)?.maritalStatus || 'Lajang',
          riskTolerance: payload.profile?.riskTolerance || 'Moderat',
          goals: payload.profile?.goals?.join(', ') || 'Kebebasan finansial'
        }
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      const errorMsg = errorJson.error?.message || errorJson.error || `Server responded with status ${res.status}`;
      throw new Error(errorMsg);
    }

    const data = await res.json();
    return {
      answer: data.reply || data.answer || 'Maaf, tidak ada respon dari asisten.',
      disclaimer: data.disclaimer || 'Edukasi literasi finansial berbasis metodologi CFP. Bukan rekomendasi investasi.',
      suggestedFollowUps: data.suggestedFollowUps || []
    };
  }
};
