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

export interface ScriptAnalysis {
  analysis: {
    technicalTerms: string[];
    readabilityScore: number;
    suggestions: string[];
  };
  rewrittenScript: {
    learningObjectives: string[];
    introduction: string;
    mainContent: string;
    conclusion: string;
    callToAction: string;
  };
}

async function analyzeText(prompt: string, model: string): Promise<string> {
  try {
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
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://script-auditor.vercel.app',
          'X-Title': 'Script Auditor',
        },
      }
    );

    console.log('OpenRouter API response:', response.data);

    if (!response.data || !response.data.choices || !response.data.choices.length) {
      console.error('Invalid API response structure:', response.data);
      throw new Error('Invalid API response structure');
    }

    const content = response.data.choices[0]?.message?.content;
    if (!content) {
      console.error('No content in API response:', response.data.choices[0]);
      throw new Error('No content in API response');
    }

    return content;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('OpenRouter API error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    } else {
      console.error('Unexpected error:', error);
    }
    throw error;
  }
}

export async function analyzeScript(script: string, model: string): Promise<ScriptAnalysis> {
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
          "suggestions": ["suggestion1", "suggestion2", ...]
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

    const result = await analyzeText(prompt, model);
    
    try {
      // Clean the response by removing any potential BOM or hidden characters
      const cleanResult = result
        .replace(/^\uFEFF/, '') // Remove BOM
        .replace(/^\s+|\s+$/g, '') // Trim whitespace
        .replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width spaces

      // If response starts with "```json" and ends with "```", extract just the JSON
      const jsonMatch = cleanResult.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonString = jsonMatch ? jsonMatch[1] : cleanResult;

      console.log('Cleaned JSON string:', jsonString);
      
      const parsedResult = JSON.parse(jsonString);
      
      // Validate the parsed result has the expected structure
      if (!parsedResult.analysis || !parsedResult.rewrittenScript) {
        throw new Error('API response missing required fields');
      }
      
      return parsedResult as ScriptAnalysis;
    } catch (parseError) {
      console.error('Failed to parse API response as JSON. Error:', parseError);
      console.error('Raw response:', result);
      throw new Error('Invalid JSON response from API');
    }
  } catch (error) {
    console.error('Script analysis failed:', error);
    throw error;
  }
} 