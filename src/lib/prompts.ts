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

export function getPromptForModel(model: string): string {
  switch (model) {
    case 'anthropic/claude-3-opus-20240229':
      return basePrompt;
    case 'anthropic/claude-3-sonnet-20240229':
      return basePrompt;
    case 'google/gemini-pro':
      return geminiProPrompt;
    case 'meta-llama/llama-2-70b-chat':
      return basePrompt;
    default:
      return basePrompt;
  }
}