export interface AIModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  contextWindow: number;
  paid: boolean;
  maxTokens: number;
  pricing?: {
    input: number;
    output: number;
  };
  hidden?: boolean;
}

export const availableModels: AIModel[] = [
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini Flash 2.0 Experimental",
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
    maxTokens: 1550000,
    hidden: true
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
    },
    hidden: true
  }
].filter(model => !model.hidden).sort((a, b) => b.contextWindow - a.contextWindow); // Filter out hidden models and sort by context window size