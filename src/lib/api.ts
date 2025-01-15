import axios from 'axios';

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
    sections: Record<string, Section>;
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

    // Try to parse the content as JSON to validate it early
    try {
      JSON.parse(content);
    } catch (parseError) {
      console.error('analyzeText: Response is not valid JSON:', content);
      throw new Error('API response is not valid JSON');
    }

    console.log('analyzeText: Successfully validated JSON response');
    return content;
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
    const prompt = `
      As an experienced script writer and instructional designer, analyze and enhance this script that will be performed by the user's trained AI avatar.
      DO NOT add any AI introductions - the avatar is already trained with the user's persona.
      
      Evaluate and improve the script based on these key areas:

      1. Engagement & Structure:
         - Hook and attention-grabbing opening
         - Clear learning objectives
         - Logical flow and transitions
         - Effective conclusion and call-to-action
         - Knowledge check points

      2. Delivery & Pacing:
         - Natural conversational tone
         - Strategic pauses for emphasis
         - Varied sentence lengths
         - Chunked information
         - Clear transitions between topics

      3. Visual Integration:
         - Visual cue markers [VISUAL CUE] for demos/graphics
         - Emphasis points for key concepts
         - Opportunities for on-screen text
         - Visual metaphors and examples
         - Data visualization moments

      4. Instructional Design:
         - Progressive complexity
         - Real-world examples
         - Practice opportunities
         - Memory retention techniques
         - Active learning prompts

      5. Accessibility & Clarity:
         - Simple language for complex concepts
         - Defined technical terms
         - Consistent terminology
         - Cultural sensitivity
         - Inclusive language

      For each improvement made, mark it with [IMPLEMENTED] to track progress.

      Script to analyze:
      ${script}

      Respond in JSON format:
      {
        "analysis": {
          "technicalTerms": ["term1", "term2", ...],
          "readabilityScore": number (between 8.0 and 10.0),
          "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2", ...],
          "overallScore": number (between 8.0 and 10.0),
          "prioritizedImprovements": ["improvement1 [IMPLEMENTED]", "improvement2", ...],
          "sections": {
            "introduction": {
              "score": number,
              "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2"],
              "readabilityMetrics": {
                "fleschKincaid": number,
                "wordsPerSentence": number,
                "technicalTerms": ["term1", "term2"]
              },
              "aiEnhancements": "text with [VISUAL CUE] markers"
            }
          }
        },
        "rewrittenScript": {
          "learningObjectives": ["objective1", "objective2", ...],
          "introduction": "text with [VISUAL CUE] markers (no AI introductions)",
          "mainContent": "text with [VISUAL CUE] markers",
          "conclusion": "text with [VISUAL CUE] markers",
          "callToAction": "text with [VISUAL CUE] markers"
        }
      }

      Ensure each improvement is clearly marked [IMPLEMENTED] when applied in the rewritten script.
      The rewritten script should achieve a readability score of at least 8.0 and incorporate all the marked improvements.
    `;

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