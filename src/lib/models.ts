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
    id: 'gryphe/mythomax-l2-13b:free',
    name: 'MythoMax 13B',
    provider: 'Gryphe',
    description: 'One of the highest performing and most popular fine-tunes of Llama 2 13B',
    contextWindow: 4096,
    isFree: true
  },
  {
    id: 'anthropic/claude-3-opus-20240229',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable model, best for complex tasks',
    contextWindow: 200000,
    isFree: false
  },
  {
    id: 'anthropic/claude-3-sonnet-20240229',
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
    id: 'deepseek/deepseek-chat',
    name: 'Deepseek Chat',
    provider: 'Deepseek',
    description: 'Specialized in technical analysis and detailed explanations',
    contextWindow: 32000,
    isFree: true
  },
  {
    id: 'meta-llama/llama-3.2-1b-instruct:free',
    name: 'Llama 3.2 Instruct',
    provider: 'Meta',
    description: 'Fast and efficient instruction-following model',
    contextWindow: 4096,
    isFree: true
  }
]; 