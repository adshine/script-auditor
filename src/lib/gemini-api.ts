import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import type { ScriptAnalysis } from './api';

export async function analyzeWithGemini(script: string): Promise<ScriptAnalysis> {
  try {
    console.log('Gemini API: Initializing...');
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
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
    const prompt = `You are an experienced script writer and instructional designer. Analyze and enhance the given script that will be performed by the user's trained AI avatar.
Follow these requirements strictly:
1. Respond ONLY with a valid JSON object
2. Do not include any explanatory text or markdown formatting
3. The JSON must include all required fields as shown in the example
4. Ensure all string values are properly escaped

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
   - Add [VISUAL CUE] markers for demos/graphics
   - Highlight key concepts
   - Add on-screen text suggestions
   - Include visual metaphors and examples
   - Suggest data visualization moments

4. Instructional Design:
   - Progressive complexity
   - Real-world examples
   - Practice opportunities
   - Memory retention techniques
   - Active learning prompts

5. Accessibility & Clarity:
   - Simple language for complex concepts
   - Define technical terms
   - Maintain consistent terminology
   - Ensure cultural sensitivity
   - Use inclusive language

For each improvement made, mark it with [IMPLEMENTED] to track progress.

Script to analyze:
${script}

Respond with this exact JSON structure (replace example values with real analysis):
{
  "analysis": {
    "technicalTerms": ["List all technical terms found in the script"],
    "readabilityScore": 9.0,
    "suggestions": [
      "Add a strong opening hook [IMPLEMENTED]",
      "Break down complex concepts into simpler terms",
      "Add more visual elements for engagement"
    ],
    "overallScore": 9.0,
    "prioritizedImprovements": [
      "Add clear learning objectives at the start [IMPLEMENTED]",
      "Include more interactive elements",
      "Enhance visual integration"
    ],
    "sections": {
      "introduction": {
        "score": 8.5,
        "suggestions": [
          "Add an attention-grabbing opening [IMPLEMENTED]",
          "Include clear objectives"
        ],
        "readabilityMetrics": {
          "fleschKincaid": 12.5,
          "wordsPerSentence": 21,
          "technicalTerms": ["List technical terms in this section"]
        },
        "aiEnhancements": "Specific text with [VISUAL CUE] markers for this section"
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": [
      "List specific, measurable learning objectives",
      "What learners will achieve from this script"
    ],
    "introduction": "Enhanced introduction with [VISUAL CUE] markers",
    "mainContent": "Enhanced main content with [VISUAL CUE] markers",
    "conclusion": "Enhanced conclusion with [VISUAL CUE] markers",
    "callToAction": "Clear, actionable next steps with [VISUAL CUE] markers"
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