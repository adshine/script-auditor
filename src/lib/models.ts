export interface AIModel {
  id: string;
  name: string;
  provider: 'Google' | 'Meta';
  description: string;
  contextWindow: number;
  paid: boolean;
  maxTokens: number;
}

export const availableModels: AIModel[] = [
  {
    id: "google/gemini-flash-1.5",
    name: "Gemini Flash 1.5",
    provider: "Google",
    description: "Fast and efficient model for quick responses",
    contextWindow: 16384,
    paid: false,
    maxTokens: 2048
  },
  {
    id: "google/gemini-flash-1.5-8b",
    name: "Gemini Flash 1.5 8B",
    provider: "Google",
    description: "Optimized 8B parameter model for balanced performance",
    contextWindow: 16384,
    paid: false,
    maxTokens: 2048
  },
  {
    id: "meta-llama/llama-3.2-1b-instruct",
    name: "Llama 3.2 1B Instruct",
    provider: "Meta",
    description: "Compact instruction-following model",
    contextWindow: 4096,
    paid: false,
    maxTokens: 2048
  },
  {
    id: "google/gemini-2.0-flash-exp:free",
    name: "Gemini 2.0 Flash",
    provider: "Google",
    description: "Latest Gemini model optimized for speed",
    contextWindow: 32768,
    paid: false,
    maxTokens: 4096
  },
  {
    id: "google/gemma-2-9b-it:free",
    name: "Gemma 2 9B",
    provider: "Google",
    description: "Efficient 9B parameter model for general tasks",
    contextWindow: 8192,
    paid: false,
    maxTokens: 2048
  },
  {
    id: "meta-llama/llama-3.2-1b-instruct:free",
    name: "Llama 3.2 1B Instruct Free",
    provider: "Meta",
    description: "Free version of Llama 3.2 for instruction tasks",
    contextWindow: 4096,
    paid: false,
    maxTokens: 2048
  },
  {
    id: "meta-llama/llama-3-8b-instruct:free",
    name: "Llama 3 8B Instruct",
    provider: "Meta",
    description: "Larger instruction model with enhanced capabilities",
    contextWindow: 8192,
    paid: false,
    maxTokens: 4096
  },
  {
    id: "meta-llama/llama-3.2-11b-vision-instruct:free",
    name: "Llama 3.2 11B Vision Instruct",
    provider: "Meta",
    description: "Vision-capable instruction model with enhanced understanding",
    contextWindow: 16384,
    paid: false,
    maxTokens: 4096
  }
]; 