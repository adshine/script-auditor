import axios from 'axios';
import { LLMResponseHandler } from './json-validator';

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

const responseHandler = new LLMResponseHandler();

async function analyzeText(prompt: string, model: string, language: string): Promise<string> {
  console.log('analyzeText: Starting API request');
  
  try {
    let apiKey: string | undefined;
    let baseUrl: string;
    let headers: Record<string, string>;
    let requestBody: any;

    const languageInstruction = language !== 'en' 
      ? `IMPORTANT: You MUST respond ENTIRELY in ${language} language. This includes ALL analysis, feedback, improvements, and the rewritten script. DO NOT use any English. Translate all technical terms, suggestions, and visual cue markers to ${language}.`
      : '';

    // Enhance the prompt with JSON formatting instructions
    const enhancedPrompt = responseHandler.enhancePrompt(prompt);

    if (model.includes('deepseek-r1-distill-llama')) {
      // Groq Cloud API
      apiKey = process.env.NEXT_PUBLIC_GROQ_API_KEY || process.env.GROQ_API_KEY;
      if (!apiKey) {
        console.error('analyzeText: Neither NEXT_PUBLIC_GROQ_API_KEY nor GROQ_API_KEY is set in environment variables');
        throw new Error('Groq API key not configured');
      }
      baseUrl = 'https://api.groq.com/openai/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      };

      // Groq-specific request body
      requestBody = {
        model: 'deepseek-r1-distill-llama-70b',
        messages: [
          {
            role: 'system',
            content: `You are a script analysis and improvement expert who MUST ALWAYS return COMPLETE, VALID JSON responses.

CRITICAL JSON RULES:
1. NEVER truncate or leave JSON incomplete
2. ALWAYS close all brackets and braces
3. ALWAYS escape quotes in strings
4. NEVER include markdown code blocks
5. NEVER include explanatory text outside the JSON
6. VERIFY your response is complete before returning
7. If response is long, reduce verbosity but maintain valid JSON structure
8. Double-check all required fields are present
9. Ensure all arrays and objects are properly terminated
10. Properly escape all special characters in strings

${languageInstruction}`
          },
          {
            role: 'user',
            content: enhancedPrompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000, // Reduced from 4000 to help with rate limits
        top_p: 0.9,
        stream: false
      };
    } else if (model.includes('gemini')) {
      // OpenRouter API for Gemini
      apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        console.error('analyzeText: Neither NEXT_PUBLIC_OPENROUTER_API_KEY nor OPENROUTER_API_KEY is set in environment variables');
        throw new Error('OpenRouter API key not configured');
      }
      baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
      headers = {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': 'Script Auditor',
        'Content-Type': 'application/json'
      };

      // OpenRouter request body for Gemini
      requestBody = {
        model: model, // Keep the full model name for OpenRouter
        messages: [
          {
            role: 'system',
            content: `You are a script analysis and improvement expert who MUST ALWAYS return COMPLETE, VALID JSON responses.

CRITICAL JSON RULES:
1. NEVER truncate or leave JSON incomplete
2. ALWAYS close all brackets and braces
3. ALWAYS escape quotes in strings
4. NEVER include markdown code blocks
5. NEVER include explanatory text outside the JSON
6. VERIFY your response is complete before returning
7. If response is long, reduce verbosity but maintain valid JSON structure
8. Double-check all required fields are present
9. Ensure all arrays and objects are properly terminated
10. Properly escape all special characters in strings

${languageInstruction}`
          },
          {
            role: 'user',
            content: enhancedPrompt,
          },
        ],
        max_tokens: 4000,
        temperature: 0.7,
        response_format: { type: "json_object" },
        seed: 42,
        stream: false,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      };
    } else {
      throw new Error(`Unsupported model: ${model}`);
    }

    console.log('analyzeText: Making request to API with model:', model);
    console.log('analyzeText: Request body:', JSON.stringify(requestBody, null, 2));
    
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 5000; // 5 seconds

    while (retryCount < maxRetries) {
      try {
        const response = await axios.post<OpenRouterResponse>(
          baseUrl,
          requestBody,
          { headers }
        );

        console.log('analyzeText: Response status:', response.status);
        console.log('analyzeText: Full response:', JSON.stringify(response.data, null, 2));
        
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

        // Clean and validate the response
        const cleanedContent = responseHandler.cleanResponse(content);
        console.log('analyzeText: Cleaned content:', cleanedContent);

        // Try to validate the content structure early
        try {
          responseHandler.parseAndValidate(cleanedContent);
          console.log('analyzeText: Successfully validated JSON structure');
          return cleanedContent;
        } catch (validationError) {
          console.error('analyzeText: Validation error:', validationError);
          throw validationError;
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.error?.message || error.response?.data?.error || error.message;
          
          // Check if it's a rate limit error
          if (errorMessage.includes('Rate limit reached')) {
            const waitTimeMatch = errorMessage.match(/try again in (\d+\.?\d*)s/);
            let waitTime = waitTimeMatch ? parseFloat(waitTimeMatch[1]) * 1000 : baseDelay * Math.pow(2, retryCount);
            
            console.log(`analyzeText: Rate limit reached. Waiting ${waitTime/1000}s before retry ${retryCount + 1}/${maxRetries}`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            retryCount++;
            continue;
          }
          
          console.error('analyzeText: API error details:', {
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
          throw new Error(`API error: ${errorMessage}`);
        } else {
          console.error('analyzeText: Unexpected error:', error);
          throw error;
        }
      }
    }

    throw new Error(`Failed after ${maxRetries} retries`);
  } catch (error) {
    console.error('analyzeText: Final error:', error);
    throw error;
  }
}

export async function analyzeScript(script: string, model: string, language: string): Promise<ScriptAnalysis> {
  console.log('analyzeScript: Starting script analysis');
  
  try {
    const prompt = `
As an experienced script writer and instructional designer, analyze and enhance this script that will be performed by the user's trained AI avatar.
DO NOT add any AI introductions — the avatar is already trained with the user's persona.

Evaluate and improve the script based on these key areas:

1. Engagement & Structure:
   - Hook and attention-grabbing opening
   - Hook: Must use either (1) relatable direct question or (2) relatable metaphor [IMPLEMENTED] 
   - Clear learning objectives
   - Learning objectives: MAX 5, start with action verbs (e.g., "Design...", "Execute...")  
   - Logical flow and transitions
   - Effective conclusion and call-to-action
   - Knowledge check points
   - Mandatory knowledge check every 120 seconds (poll/reflection prompt/ MAKE SURE TO INCLUDE THE ANSWER) [IMPLEMENTED]

2. Delivery & Pacing:
   - Natural conversational tone
   - Strategic pauses for emphasis
   - Varied sentence lengths
   - Chunked information
   - Clear transitions between topics
   - Make sure to break up long sentences into paragraphs

3. Visual Integration:
   - Visual cue markers [VISUAL CUE] for demos/graphics
   - Emphasis points for key concepts
   - Opportunities for on-screen text
   - Visual metaphors and examples
   - Data visualization moments
   - **Example**:
     > "To illustrate how our product reaches different audiences, let's look at a quick chart of user demographics. [VISUAL CUE: A chart showing user demographics by age group]."
     >
     > This tells your production team (or AI avatar) exactly what to display on screen.
  - Visual cues MUST specify:  
     > [VISUAL CUE: TYPE|KEY ELEMENTS|DURATION]  
     Example:  
     > [VISUAL CUE: animated_timeline|interview_process_flow|8s]

4. Instructional Design:
   - Progressive complexity
   - Real-world examples
   - Practice opportunities
   - Memory retention techniques
   - Active learning prompts
   - **Incorporate brief role-play or example segments** to illustrate best practices or common pitfalls

5. Accessibility & Clarity:
   - Simple language for complex concepts
   - Defined technical terms
   - Consistent terminology
   - Cultural sensitivity
   - Inclusive language

6. **Ethics & Participant Considerations (if applicable)**:
   - Emphasize the importance of informed consent
   - Address privacy and confidentiality
   - Ensure empathy and respect during interviews or user research
   - Provide disclaimers or reminders about ethical guidelines

7. **Participant Recruitment & Data Analysis (if applicable)**:
   - Mention strategies for finding diverse participants
   - Include steps for synthesizing and organizing interview data
   - Translate insights into actionable recommendations
   - Demonstrate how to verify assumptions and avoid bias

8. **Diversity Requirements**  
   - Examples must include:  
   - ≥2 genders
   - ≥3 ethnicities
   - Age range: 20-65
   - ≥2 professions
   - ≥2 industries
   - ≥2 countries
   - ≥2 languages

9. **Validation Requirements**  
   - Reject scripts with:  
     • Flesch-Kincaid >12.0  
     • Undefined technical terms  
     • >20 words/sentence average
     - Visuals use generic terms ("graphic" → "timeline_art")  
     - Sentences >18 words average  
     - No plain-English explanations for terms like "affinity mapping" 

For each improvement made, mark it with [IMPLEMENTED] to track progress.

Script to analyze:
${script}

**IMPORTANT**:
1. **Your response must be valid JSON**—no extra text, no markdown formatting, no explanations outside the JSON structure.  
2. **Ensure all double quotes inside JSON strings are escaped** (e.g., \\\") to avoid invalid JSON.  
3. **Include all required sections in your JSON** (analysis and rewrittenScript).  
4. The rewritten script should achieve a readability score of at least 8.0 and incorporate all the marked improvements.
5. **Respond in the language of the script** (if provided).

Respond in JSON format exactly as follows:

{
  "analysis": {
    "technicalTerms": ["term1", "term2", ...],
    "readabilityScore": 9.0,
    "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2", ...],
    "overallScore": 9.0,
    "prioritizedImprovements": ["improvement1 [IMPLEMENTED]", "improvement2", ...],
    "sections": {
      "introduction": {
        "score": 8.5,
        "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2"],
        "readabilityMetrics": {
          "fleschKincaid": 12.5,
          "wordsPerSentence": 21,
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

**Absolute Rules:**  
• 1:1 objective-practice alignment
`;

    console.log('analyzeScript: Sending prompt to analyzeText');
    const result = await analyzeText(prompt, model, language);
    
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