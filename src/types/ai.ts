import { FinancialProfile } from './financial';

export type ChatMood = 'Profesional' | 'Savage' | 'Empathetic';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  mood?: ChatMood;
  isAiGenerated?: boolean;
  status?: 'delivered' | 'failed' | 'processing';
}

export interface ChatHistory {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatHistoryTurn {
  role: 'user' | 'model' | 'assistant';
  text: string;
}

export interface AIAdvisorRequest {
  question: string;
  mood?: ChatMood;
  history?: ChatHistoryTurn[];
  profile?: Partial<FinancialProfile>;
}

export interface AIAdvisorResponse {
  answer: string;
  disclaimer: string;
  suggestedFollowUps?: string[];
  keyTakeaway?: string;
}
