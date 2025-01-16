import axios from 'axios';
import { getPromptForModel } from './prompts';

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface Choice {
  message: Message;
  finish_reason: string;
  index: number;
}

interface OpenRouterResponse {
  id: string;
  choices: Choice[];
  created: number;
  model: string;
  object: string;
}

export interface RewrittenScript {
  title?: string;
  learningObjectives: string[];
  introduction: string;
  mainContent: string;
  conclusion: string;
  callToAction: string;
}

export interface ReadabilityMetrics {
  fleschKincaid: number;
  wordsPerSentence: number;
  technicalTerms: string[];
}

export interface Section {
  score: number;
  suggestions: string[];
  readabilityMetrics: ReadabilityMetrics;
  aiEnhancements?: string;
}

export interface ScriptAnalysis {
  analysis: {
    technicalTerms: string[];
    readabilityScore: number;
    suggestions: string[];
    overallScore: number;
    prioritizedImprovements: string[];
    sections: {
      introduction: Section;
      mainContent?: Section;
      conclusion?: Section;
    };
  };
  rewrittenScript: RewrittenScript;
}

async function analyzeText(prompt: string, model: string): Promise<string> {
  console.log('analyzeText: Starting API request');
  
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      console.error('analyzeText: OPENROUTER_API_KEY is not set in environment variables');
      throw new Error('API key not configured');
    }

    console.log('analyzeText: Making request to OpenRouter API with model:', model);
    const response = await axios.post<OpenRouterResponse>(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "json_object" },
        seed: 42,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Script Auditor',
        },
      }
    );

    console.log('analyzeText: Response status:', response.status);
    
    if (!response.data || !response.data.choices || !response.data.choices.length) {
      console.error('analyzeText: Invalid API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('analyzeText: No content in API response:', response.data.choices[0]);
      throw new Error('No content in API response');
    }

    console.log('analyzeText: Raw content received:', content);

    // Try to parse the content as JSON to validate it early
    let parsedContent;
    try {
      // First clean the content of any markdown formatting or extra whitespace
      const cleanContent = content
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '')
        .trim();
      
      console.log('analyzeText: Cleaned content:', cleanContent);
      parsedContent = JSON.parse(cleanContent);
      
      // Additional validation of the parsed content
      if (!parsedContent || typeof parsedContent !== 'object') {
        throw new Error('Parsed content is not an object');
      }
      
      if (!parsedContent.analysis || !parsedContent.rewrittenScript) {
        throw new Error('Missing required top-level fields');
      }
      
      console.log('analyzeText: Successfully parsed and validated JSON');
      return cleanContent;
    } catch (parseError) {
      console.error('analyzeText: JSON parse error:', parseError);
      console.error('analyzeText: Failed content:', content);
      throw new Error(`API response is not valid JSON: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('analyzeText: OpenRouter API error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: {
            ...error.config?.headers,
            'Authorization': '***'
          }
        }
      });
      throw new Error(`OpenRouter API error: ${error.response?.data?.error || error.message}`);
    } else {
      console.error('analyzeText: Unexpected error:', error);
      throw error;
    }
  }
}

export async function analyzeScript(script: string, model: string): Promise<ScriptAnalysis> {
  console.log('analyzeScript: Starting script analysis');
  
  try {
    const prompt = getPromptForModel(model).replace('{script}', script);

    console.log('analyzeScript: Sending prompt to analyzeText');
    const result = await analyzeText(prompt, model);
    
    try {
      // Clean the response
      const cleanResult = result
        .replace(/^\uFEFF/, '')
        .replace(/^\s+|\s+$/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .replace(/```json\s*|\s*```/g, '');

      console.log('analyzeScript: Cleaned result:', cleanResult);
      
      const parsedResult = JSON.parse(cleanResult);
      
      // Validate the structure
      if (!parsedResult || typeof parsedResult !== 'object') {
        throw new Error('Invalid response format: not an object');
      }

      if (!parsedResult.analysis || !parsedResult.rewrittenScript) {
        throw new Error('Invalid response format: missing required fields');
      }

      // Validate required nested fields
      const requiredAnalysisFields = [
        'technicalTerms',
        'readabilityScore',
        'suggestions',
        'overallScore',
        'prioritizedImprovements',
        'sections'
      ] as const;

      const requiredRewrittenScriptFields = [
        'learningObjectives',
        'introduction',
        'mainContent',
        'conclusion',
        'callToAction'
      ] as const;

      for (const field of requiredAnalysisFields) {
        if (!(field in parsedResult.analysis)) {
          throw new Error(`Invalid response format: missing analysis.${field}`);
        }
      }

      for (const field of requiredRewrittenScriptFields) {
        if (!(field in parsedResult.rewrittenScript)) {
          throw new Error(`Invalid response format: missing rewrittenScript.${field}`);
        }
      }

      return parsedResult as ScriptAnalysis;
    } catch (parseError) {
      console.error('analyzeScript: Failed to parse or validate response:', parseError);
      console.error('analyzeScript: Raw response:', result);
      throw new Error(`Invalid response format: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }
  } catch (error) {
    console.error('analyzeScript: Script analysis failed:', error);
    throw error;
  }
} 