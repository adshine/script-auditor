import { basePrompt } from './prompts/base-prompt';

const geminiProPrompt = `You are a script analysis assistant. Your task is to analyze the script and return ONLY a JSON object with no additional text or formatting.

${basePrompt}

CRITICAL INSTRUCTIONS:
1. Return ONLY a JSON object
2. Do not include any markdown formatting (no \`\`\`json or \`\`\`)
3. Do not include any explanatory text
4. Ensure the JSON is properly formatted with all required fields
5. Do not include any content outside the JSON structure

The response should be a single JSON object containing:
{
  "analysis": {
    "technicalTerms": string[],
    "readabilityScore": number,
    "suggestions": string[],
    "overallScore": number,
    "prioritizedImprovements": string[],
    "sections": {
      "introduction": {
        "score": number,
        "suggestions": string[],
        "readabilityMetrics": {
          "fleschKincaid": number,
          "wordsPerSentence": number,
          "technicalTerms": string[]
        }
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": string[],
    "introduction": string,
    "mainContent": string,
    "conclusion": string,
    "callToAction": string
  }
}`;

const deepseekPrompt = `You are a specialized script analysis assistant with expertise in technical content. Your task is to analyze the script and provide a detailed JSON response.

${basePrompt}

Additional Instructions for Deepseek:
1. Focus on technical accuracy and clarity
2. Provide detailed, actionable suggestions
3. Ensure thorough readability analysis
4. Maintain precise JSON formatting
5. Return only the JSON object, no additional text

The response must be a valid JSON object with no markdown or extra text.`;

const llama32Prompt = `You are a script analysis assistant optimized for quick and efficient analysis. Your task is to analyze the script and return a clean JSON response.

${basePrompt}

Special Instructions for Llama 3.2:
1. Keep analysis concise but thorough
2. Focus on essential improvements
3. Prioritize clarity in suggestions
4. Maintain strict JSON format
5. No additional text or formatting

Return only the JSON object, no explanations or markdown.`;

export function getPromptForModel(model: string): string {
  switch (model) {
    case 'anthropic/claude-3-opus-20240229':
      return basePrompt;
    case 'anthropic/claude-3-sonnet-20240229':
      return basePrompt;
    case 'google/gemini-pro':
      return geminiProPrompt;
    case 'deepseek/deepseek-chat':
      return deepseekPrompt;
    case 'meta-llama/llama-3.2-1b-instruct:free':
      return llama32Prompt;
    default:
      return basePrompt;
  }
}