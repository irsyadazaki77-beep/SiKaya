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
          riskTolerance: payload.profile?.riskTolerance || 'Moderat',
          goals: payload.profile?.goals?.join(', ') || 'Kebebasan finansial'
        }
      })
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.error || `Server responded with status ${res.status}`);
    }

    const data = await res.json();
    return {
      answer: data.answer || 'Maaf, tidak ada respon dari asisten.',
      disclaimer: data.disclaimer || 'Edukasi literasi finansial. Bukan rekomendasi investasi.',
      suggestedFollowUps: data.suggestedFollowUps || []
    };
  }
};
