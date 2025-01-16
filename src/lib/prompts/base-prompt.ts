export interface ModelPrompt {
  systemPrompt: string;
  userPromptTemplate: (script: string) => string;
  temperature: number;
  maxTokens: number;
  topP: number;
  presencePenalty: number;
  frequencyPenalty: number;
}

export const baseSystemPrompt = `You are an expert educational content creator specializing in creating clear, engaging, and well-structured learning materials. Your task is to analyze and improve educational scripts.

Your output must be a valid JSON object that follows this exact structure:
{
  "analysis": {
    "technicalTerms": string[],       // List of technical terms used
    "readabilityScore": number,       // Score between 1-10
    "suggestions": string[],          // List of specific improvements
    "overallScore": number,          // Score between 1-10
    "prioritizedImprovements": string[], // Ordered list of improvements
    "sections": {
      "introduction": {
        "score": number,             // Score between 1-10
        "suggestions": string[],     // Section-specific improvements
        "readabilityMetrics": {
          "fleschKincaid": number,   // Standard Flesch-Kincaid score
          "wordsPerSentence": number, // Average words per sentence
          "technicalTerms": string[] // Technical terms in this section
        }
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": string[],  // Clear, measurable objectives
    "introduction": string,          // Engaging opening
    "mainContent": string,           // Well-structured content
    "conclusion": string,            // Clear summary
    "callToAction": string          // Actionable next steps
  }
}`;

export const baseUserPromptTemplate = (script: string) => 
  `Analyze and rewrite this educational script to be more engaging and effective. Focus on clarity, structure, and maintaining the educational value while making it more conversational and easier to follow.

Original script:
${script}

Return a JSON object with your analysis and rewritten version. Ensure all content is detailed and complete.`;

export const baseModelConfig = {
  temperature: 0.3,
  maxTokens: 4000,
  topP: 0.2,
  presencePenalty: 0.0,
  frequencyPenalty: 0.0
}; 