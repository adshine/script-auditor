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

    console.log('analyzeText: Making request to OpenRouter API');
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
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://script-auditor.vercel.app',
          'X-Title': 'Script Auditor',
        },
      }
    );

    console.log('analyzeText: Received response from OpenRouter API');
    console.log('analyzeText: Response data:', JSON.stringify(response.data, null, 2));

    if (!response.data || !response.data.choices || !response.data.choices.length) {
      console.error('analyzeText: Invalid API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('analyzeText: No content in API response:', response.data.choices[0]);
      throw new Error('No content in API response');
    }

    console.log('analyzeText: Successfully extracted content from response');
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
          headers: error.config?.headers,
        }
      });
    } else {
      console.error('analyzeText: Unexpected error:', error);
    }
    throw error;
  }
}

export async function analyzeScript(script: string, model: string): Promise<ScriptAnalysis> {
  console.log('analyzeScript: Starting script analysis');
  
  try {
    const prompt = `
      Analyze this tutorial script and provide:
      1. Technical terms used
      2. Readability score (0-10)
      3. Suggestions for improvement
      4. A rewritten version with:
         - Clear learning objectives
         - Engaging introduction
         - Well-structured main content
         - Strong conclusion
         - Clear call to action

      Script:
      ${script}

      Respond in JSON format:
      {
        "analysis": {
          "technicalTerms": ["term1", "term2", ...],
          "readabilityScore": number,
          "suggestions": ["suggestion1", "suggestion2", ...],
          "overallScore": number,
          "prioritizedImprovements": ["improvement1", "improvement2", ...]
        },
        "rewrittenScript": {
          "learningObjectives": ["objective1", "objective2", ...],
          "introduction": "text",
          "mainContent": "text",
          "conclusion": "text",
          "callToAction": "text"
        }
      }
    `;

    console.log('analyzeScript: Sending prompt to analyzeText');
    const result = await analyzeText(prompt, model);
    console.log('analyzeScript: Received result from analyzeText');
    
    try {
      console.log('analyzeScript: Cleaning and parsing response');
      // Clean the response by removing any potential BOM or hidden characters
      const cleanResult = result
        .replace(/^\uFEFF/, '') // Remove BOM
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces

      // If response starts with "```json" and ends with "```", extract just the JSON
      const jsonMatch = cleanResult.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : cleanResult;

      console.log('analyzeScript: Cleaned JSON string:', jsonString);
      
      const parsedResult = JSON.parse(jsonString);
      console.log('analyzeScript: Successfully parsed JSON');
      
      // Validate the parsed result has the expected structure
      if (!parsedResult.analysis || !parsedResult.rewrittenScript) {
        console.error('analyzeScript: API response missing required fields:', parsedResult);
        throw new Error('API response missing required fields');
      }
      
      console.log('analyzeScript: Analysis completed successfully');
      return parsedResult as ScriptAnalysis;
    } catch (parseError) {
      console.error('analyzeScript: Failed to parse API response as JSON. Error:', parseError);
      console.error('analyzeScript: Raw response:', result);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('analyzeScript: Script analysis failed:', error);
    throw error;
  }
} 