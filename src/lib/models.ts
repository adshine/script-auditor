export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  paid: boolean;
  maxTokens: number;
  useDirectAPI?: boolean;
  pricing?: {
    input: number;
    output: number;
  };
}

export const availableModels: AIModel[] = [
  {
    id: "gemini-pro",
    name: "Gemini Pro (Direct)",
    provider: "Google",
    description: "Direct integration with Gemini Pro API",
    contextWindow: 30000,
    paid: false,
    maxTokens: 30000,
    useDirectAPI: true
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini Flash 2.0 Experimental (OpenRouter)",
    provider: "Google",
    description: "Fast TTFT, 1.05M ctx, 3.56B tokens",
    contextWindow: 1050000,
    paid: false,
    maxTokens: 3560000
  },
  {
    id: "google/gemini-flash-1.5-exp",
    name: "Gemini Flash 1.5 Experimental",
    provider: "Google",
    description: "1M ctx, 1.55B tokens",
    contextWindow: 1000000,
    paid: false,
    maxTokens: 1550000
  },
  {
    id: "google/gemini-flash-1.5-8b",
    name: "Gemini Flash 1.5 8B",
    provider: "Google",
    description: "1M ctx, 22.9B tokens, $0.0375/$0.15 per 1M tokens",
    contextWindow: 1000000,
    paid: true,
    maxTokens: 22900,
    pricing: {
      input: 0.0375,
      output: 0.15
    }
  },
  {
    id: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B Instruct",
    provider: "Meta",
    description: "131K ctx, 14.6B tokens, $0.01/$0.01 per 1M tokens",
    contextWindow: 131000,
    paid: true,
    maxTokens: 14600,
    pricing: {
      input: 0.01,
      output: 0.01
    }
  },
  {
    id: "meta-llama/llama-3.2-1b-instruct:free",
    name: "Llama 3.2 1B Instruct (Free)",
    provider: "Meta",
    description: "4K ctx, 182M tokens",
    contextWindow: 4000,
    paid: false,
    maxTokens: 182000
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Gemma 2 9B (Free)",
    provider: "Google",
    description: "8K ctx, 233M tokens",
    contextWindow: 8000,
    paid: false,
    maxTokens: 233000
  },
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B Instruct (Free)",
    provider: "Meta",
    description: "8K ctx, 132M tokens",
    contextWindow: 8000,
    paid: false,
    maxTokens: 132000
  },
  {
    id: "meta-llama/llama-3.2-11b-vision-instruct:free",
    name: "Llama 3.2 11B Vision Instruct (Free)",
    provider: "Meta",
    description: "8K ctx, 69M tokens, Vision capable",
    contextWindow: 8000,
    paid: false,
    maxTokens: 69000
  }
].sort((a, b) => b.contextWindow - a.contextWindow); // Sort by context window size 