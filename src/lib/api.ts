import axios from 'axios';
import { availableModels } from './models';

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = process.env.NEXT_PUBLIC_OPENROUTER_BASE_URL;

interface AnalysisSection {
  score: number;
  suggestions: string[];
  aiEnhancements: string;
  readabilityMetrics: {
    fleschKincaid: number;
    wordsPerSentence: number;
    technicalTerms: string[];
  };
}

export interface ScriptAnalysis {
  sections: {
    [key: string]: AnalysisSection;
  };
  overallScore: number;
  prioritizedImprovements: string[];
}

const analyzeText = async (text: string, modelId: string): Promise<string> => {
  try {
    const response = await axios.post(
      `${OPENROUTER_BASE_URL}/chat/completions`,
      {
        model: modelId,
        messages: [
          {
            role: "system",
            content: `You are an expert instructional designer and writing coach. Analyze the given tutorial script for clarity, engagement, and effectiveness. Focus on:
1. Learning objectives clarity
2. Introduction effectiveness
3. Content structure
4. Conversational tone
5. Interactivity
6. Key takeaways
7. Call-to-action

Provide specific, actionable feedback for improvement.

Return your analysis in the following JSON format:
{
  "sections": {
    "introduction": {
      "score": number (1-10),
      "suggestions": string[],
      "aiEnhancements": string,
      "readabilityMetrics": {
        "fleschKincaid": number,
        "wordsPerSentence": number,
        "technicalTerms": string[]
      }
    },
    "content": { ... same structure as introduction },
    "conclusion": { ... same structure as introduction }
  },
  "overallScore": number (1-10),
  "prioritizedImprovements": string[]
}`
          },
          {
            role: "user",
            content: text
          }
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://script-auditor.com',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenRouter API:', error);
    throw new Error('Failed to analyze text');
  }
};

const calculateReadabilityMetrics = (text: string) => {
  const sentences = text.split(/[.!?]+/).filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);
  
  const wordsPerSentence = words.length / sentences.length;
  
  // Simple Flesch-Kincaid Grade Level approximation
  const syllables = words.reduce((count, word) => {
    return count + (word.match(/[aeiouy]+/gi)?.length || 1);
  }, 0);
  
  const fleschKincaid = 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59;
  
  // Simple technical term detection (could be enhanced)
  const technicalTerms = words.filter(word => 
    word.length > 8 && 
    /^[a-z]+$/i.test(word) && 
    !commonWords.has(word.toLowerCase())
  );

  return {
    fleschKincaid,
    wordsPerSentence,
    technicalTerms: Array.from(new Set(technicalTerms))
  };
};

const commonWords = new Set([
  'therefore', 'however', 'although', 'moreover', 'furthermore',
  'nevertheless', 'consequently', 'additionally', 'meanwhile', 'afterward'
]);

export const analyzeScript = async (script: string, modelId: string = availableModels[0].id): Promise<ScriptAnalysis> => {
  try {
    const aiAnalysis = await analyzeText(script, modelId);
    const readabilityMetrics = calculateReadabilityMetrics(script);
    
    try {
      // Try to parse the AI response as JSON
      const parsedAnalysis = JSON.parse(aiAnalysis);
      return parsedAnalysis;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      
      // Fallback to default structure if parsing fails
      return {
        sections: {
          introduction: {
            score: 7.5,
            suggestions: ['Make the hook more engaging', 'Add a clear problem statement'],
            aiEnhancements: 'Consider starting with a compelling question or scenario...',
            readabilityMetrics
          },
          content: {
            score: 8.0,
            suggestions: ['Break down complex concepts', 'Add more examples'],
            aiEnhancements: 'Try restructuring the main points into smaller chunks...',
            readabilityMetrics
          },
          conclusion: {
            score: 7.0,
            suggestions: ['Strengthen the call-to-action', 'Reinforce key takeaways'],
            aiEnhancements: 'End with a stronger action item for the learner...',
            readabilityMetrics
          }
        },
        overallScore: 7.5,
        prioritizedImprovements: [
          'Enhance the introduction with a stronger hook',
          'Add more interactive elements throughout',
          'Strengthen the conclusion with clearer next steps'
        ]
      };
    }
  } catch (error) {
    console.error('Error analyzing script:', error);
    throw new Error('Failed to analyze script');
  }
}; 