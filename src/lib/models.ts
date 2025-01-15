export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  isFree: boolean;
}

export const availableModels: AIModel[] = [
  {
    id: 'anthropic/claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable model, best for complex tasks',
    contextWindow: 200000,
    isFree: false
  },
  {
    id: 'anthropic/claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent balance of intelligence and speed',
    contextWindow: 200000,
    isFree: false
  },
  {
    id: 'google/gemini-pro',
    name: 'Gemini Pro',
    provider: 'Google',
    description: 'Advanced model with strong reasoning capabilities',
    contextWindow: 100000,
    isFree: true
  },
  {
    id: 'meta-llama/llama-2-70b-chat',
    name: 'Llama 2 70B',
    provider: 'Meta',
    description: 'Open source model with broad capabilities',
    contextWindow: 4096,
    isFree: true
  }
]; 