import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ScriptAnalysis } from './api';

const GEMINI_API_KEY = 'AIzaSyA4GCiEUmLH5YP0S7w69lCYyBcBT2fMEt0';

export async function analyzeWithGemini(script: string): Promise<ScriptAnalysis> {
  try {
    console.log('Gemini API: Initializing...');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    console.log('Gemini API: Model initialized, sending prompt...');
    const prompt = `You are an AI script analyzer. Your task is to analyze and enhance the given script.
Follow these requirements strictly:
1. Respond ONLY with a valid JSON object
2. Do not include any explanatory text or markdown formatting
3. The JSON must include all required fields as shown in the example
4. Ensure all string values are properly escaped

Analyze this script based on these criteria:
${script}

Required JSON structure:
{
  "analysis": {
    "technicalTerms": ["term1", "term2"],
    "readabilityScore": 9.0,
    "suggestions": ["suggestion1 [IMPLEMENTED]", "suggestion2"],
    "overallScore": 9.0,
    "prioritizedImprovements": ["improvement1 [IMPLEMENTED]", "improvement2"],
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
    "learningObjectives": ["objective1", "objective2"],
    "introduction": "text with [VISUAL CUE] markers",
    "mainContent": "text with [VISUAL CUE] markers",
    "conclusion": "text with [VISUAL CUE] markers",
    "callToAction": "text with [VISUAL CUE] markers"
  }
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Gemini API: Received response, cleaning and parsing...');
    console.log('Raw response:', text);

    try {
      // Clean and parse the response
      const cleanText = text
        .replace(/^```json\s*/, '')
        .replace(/\s*```$/, '')
        .replace(/^\s+|\s+$/g, '')
        .replace(/[\u200B-\u200D\uFEFF]/g, '')
        .trim();

      console.log('Cleaned response:', cleanText);

      let parsedResult;
      try {
        parsedResult = JSON.parse(cleanText);
      } catch (jsonError) {
        console.error('JSON parse error:', jsonError);
        // Try to extract JSON from the response if it's wrapped in other text
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          console.log('Attempting to parse extracted JSON...');
          parsedResult = JSON.parse(jsonMatch[0]);
        } else {
          throw jsonError;
        }
      }

      // Validate the structure
      if (!parsedResult || typeof parsedResult !== 'object') {
        throw new Error('Invalid response format: not an object');
      }

      if (!parsedResult.analysis || !parsedResult.rewrittenScript) {
        throw new Error('Invalid response format: missing required fields');
      }

      // Validate required fields
      const { analysis, rewrittenScript } = parsedResult;
      const requiredAnalysisFields = ['technicalTerms', 'readabilityScore', 'suggestions', 'overallScore', 'prioritizedImprovements', 'sections'];
      const missingAnalysisFields = requiredAnalysisFields.filter(field => !(field in analysis));
      
      if (missingAnalysisFields.length > 0) {
        throw new Error(`Missing required analysis fields: ${missingAnalysisFields.join(', ')}`);
      }

      const requiredRewrittenFields = ['learningObjectives', 'introduction', 'mainContent', 'conclusion', 'callToAction'];
      const missingRewrittenFields = requiredRewrittenFields.filter(field => !(field in rewrittenScript));
      
      if (missingRewrittenFields.length > 0) {
        throw new Error(`Missing required rewrittenScript fields: ${missingRewrittenFields.join(', ')}`);
      }

      console.log('Gemini API: Successfully validated response structure');
      return parsedResult as ScriptAnalysis;
    } catch (parseError: unknown) {
      console.error('Failed to parse Gemini response:', parseError);
      console.error('Raw response:', text);
      throw new Error(`Failed to parse Gemini response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`);
    }
  } catch (error) {
    console.error('Gemini API error:', error);
    if (error instanceof Error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
    throw error;
  }
} 