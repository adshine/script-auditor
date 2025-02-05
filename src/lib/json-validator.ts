import { z } from 'zod';
import { ScriptAnalysis, Section, ReadabilityMetrics } from './api';

// Define Zod schemas for our types
const ReadabilityMetricsSchema = z.object({
  fleschKincaid: z.number(),
  wordsPerSentence: z.number(),
  technicalTerms: z.array(z.string())
}).strict();

const SectionSchema = z.object({
  score: z.number(),
  suggestions: z.array(z.string()),
  readabilityMetrics: ReadabilityMetricsSchema,
  aiEnhancements: z.string().optional()
}).strict();

// Complete schema that requires all fields
const CompleteScriptAnalysisSchema = z.object({
  analysis: z.object({
    technicalTerms: z.array(z.string()),
    readabilityScore: z.number(),
    suggestions: z.array(z.string()),
    overallScore: z.number(),
    prioritizedImprovements: z.array(z.string()),
    sections: z.object({
      introduction: SectionSchema,
      mainContent: SectionSchema,
      conclusion: SectionSchema
    })
  }),
  rewrittenScript: z.object({
    learningObjectives: z.array(z.string()),
    introduction: z.string(),
    mainContent: z.string(),
    conclusion: z.string(),
    callToAction: z.string()
  })
}).strict();

// Partial schema that allows missing fields
const PartialScriptAnalysisSchema = z.object({
  analysis: z.object({
    technicalTerms: z.array(z.string()),
    readabilityScore: z.number(),
    suggestions: z.array(z.string()),
    overallScore: z.number(),
    prioritizedImprovements: z.array(z.string()),
    sections: z.object({
      introduction: SectionSchema,
      mainContent: SectionSchema.optional(),
      conclusion: SectionSchema.optional()
    })
  }),
  rewrittenScript: z.object({
    learningObjectives: z.array(z.string()),
    introduction: z.string(),
    mainContent: z.string().optional(),
    conclusion: z.string().optional(),
    callToAction: z.string().optional()
  }),
  isComplete: z.boolean().optional()
}).strict();

// Helper type for tracking missing fields
interface MissingFields {
  analysis?: {
    sections?: {
      mainContent?: boolean;
      conclusion?: boolean;
    };
  };
  rewrittenScript?: {
    mainContent?: boolean;
    conclusion?: boolean;
    callToAction?: boolean;
  };
}

const findMissingFields = (data: z.infer<typeof PartialScriptAnalysisSchema>): MissingFields => {
  const missing: MissingFields = {};

  // Check analysis sections
  if (!data.analysis.sections.mainContent || !data.analysis.sections.conclusion) {
    missing.analysis = { sections: {} };
    if (!data.analysis.sections.mainContent) missing.analysis.sections!.mainContent = true;
    if (!data.analysis.sections.conclusion) missing.analysis.sections!.conclusion = true;
  }

  // Check rewrittenScript fields
  if (!data.rewrittenScript.mainContent || !data.rewrittenScript.conclusion || !data.rewrittenScript.callToAction) {
    missing.rewrittenScript = {};
    if (!data.rewrittenScript.mainContent) missing.rewrittenScript.mainContent = true;
    if (!data.rewrittenScript.conclusion) missing.rewrittenScript.conclusion = true;
    if (!data.rewrittenScript.callToAction) missing.rewrittenScript.callToAction = true;
  }

  return missing;
};

const generateFollowUpPrompt = (missing: MissingFields): string => {
  const missingFields: string[] = [];

  if (missing.analysis?.sections) {
    if (missing.analysis.sections.mainContent) missingFields.push('analysis.sections.mainContent');
    if (missing.analysis.sections.conclusion) missingFields.push('analysis.sections.conclusion');
  }

  if (missing.rewrittenScript) {
    if (missing.rewrittenScript.mainContent) missingFields.push('rewrittenScript.mainContent');
    if (missing.rewrittenScript.conclusion) missingFields.push('rewrittenScript.conclusion');
    if (missing.rewrittenScript.callToAction) missingFields.push('rewrittenScript.callToAction');
  }

  return `The previous response was incomplete. Please provide ONLY the missing content for these fields: ${missingFields.join(', ')}. 
Return the response as a JSON object with ONLY the missing fields in their correct structure.
Example format if missing conclusion:
{
  "rewrittenScript": {
    "conclusion": "The conclusion text here"
  }
}`;
};

const mergeResponses = (
  original: z.infer<typeof PartialScriptAnalysisSchema>,
  supplement: Partial<z.infer<typeof PartialScriptAnalysisSchema>>
): z.infer<typeof PartialScriptAnalysisSchema> => {
  return {
    ...original,
    analysis: {
      ...original.analysis,
      sections: {
        ...original.analysis.sections,
        ...(supplement.analysis?.sections || {})
      }
    },
    rewrittenScript: {
      ...original.rewrittenScript,
      ...(supplement.rewrittenScript || {})
    }
  };
};

const cleanJSON = (jsonString: string): string => {
  // Remove any non-JSON content first
  let cleaned = jsonString
    .replace(/^[^{]*({[\s\S]*})[^}]*$/, '$1')
    .replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1')
    .replace(/<think>[\s\S]*?<\/think>/g, '')
    .replace(/<system>[\s\S]*?<\/system>/g, '')
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return JSON.stringify(parsed);
  } catch (e) {
    console.error('Failed to parse cleaned JSON:', e);
    throw new Error(`JSON parsing failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
};

const safeParseJSON = (content: string): unknown => {
  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    const cleaned = cleanJSON(content);
    return JSON.parse(cleaned);
  }
};

const cleanInputText = (text: string): string => {
  return text
    // Remove zero-width spaces and other invisible characters
    .replace(/[\u200B-\u200D\uFEFF\uFFFE\uFEFF]/g, '')
    // Replace smart quotes with straight quotes
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    // Replace em dash and en dash with regular dash
    .replace(/[\u2013\u2014]/g, '-')
    // Replace multiple spaces with single space
    .replace(/\s+/g, ' ')
    // Replace multiple newlines with double newline
    .replace(/\n{3,}/g, '\n\n')
    // Remove null characters
    .replace(/\0/g, '')
    // Remove control characters except newlines and tabs
    .replace(/[\x00-\x09\x0B\x0C\x0E-\x1F]/g, '')
    // Fix common typographic issues
    .replace(/\.{3,}/g, '...') // Replace multiple dots with ellipsis
    .replace(/\s+([.,!?;:])/g, '$1') // Remove spaces before punctuation
    .replace(/([.,!?;:])\s*/g, '$1 ') // Ensure single space after punctuation
    // Trim whitespace
    .trim();
};

export class JSONValidator {
  public validateScriptAnalysis(data: unknown): data is ScriptAnalysis {
    try {
      // First try complete schema
      const completeResult = CompleteScriptAnalysisSchema.safeParse(data);
      if (completeResult.success) {
        return true;
      }

      // If complete validation fails, try partial schema
      const partialResult = PartialScriptAnalysisSchema.safeParse(data);
      if (partialResult.success) {
        console.warn('Partial response detected. Missing fields:', findMissingFields(partialResult.data));
        return false;
      }

      console.error('Validation errors:', completeResult.error.format());
      return false;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }
}

export class LLMResponseHandler {
  private validator: JSONValidator;
  private readonly SYSTEM_PROMPT = `You MUST follow these rules for JSON responses:
1. Return ONLY valid JSON
2. Use straight quotes (") not smart quotes
3. Include ALL required fields:
   - analysis.technicalTerms (array)
   - analysis.readabilityScore (number)
   - analysis.suggestions (array)
   - analysis.overallScore (number)
   - analysis.prioritizedImprovements (array)
   - analysis.sections.introduction (object)
   - analysis.sections.mainContent (object)
   - analysis.sections.conclusion (object)
   - rewrittenScript.learningObjectives (array)
   - rewrittenScript.introduction (string)
   - rewrittenScript.mainContent (string)
   - rewrittenScript.conclusion (string)
   - rewrittenScript.callToAction (string)
4. Do not include any text outside the JSON
5. If you cannot complete the entire response, set "isComplete": false and include as many fields as you can
6. Each field must be properly formatted and complete - no placeholders or partial content`;

  constructor() {
    this.validator = new JSONValidator();
  }

  public async processResponse(response: string, retryCount: number = 0): Promise<ScriptAnalysis> {
    const MAX_RETRIES = 3;
    
    try {
      const parsedData = safeParseJSON(response);
      
      // Try complete schema first
      const completeResult = CompleteScriptAnalysisSchema.safeParse(parsedData);
      if (completeResult.success) {
        return completeResult.data;
      }

      // If complete validation fails, try partial schema
      const partialResult = PartialScriptAnalysisSchema.safeParse(parsedData);
      if (partialResult.success) {
        if (retryCount >= MAX_RETRIES) {
          throw new Error('Max retries reached. Unable to get complete response.');
        }

        const missingFields = findMissingFields(partialResult.data);
        const followUpPrompt = generateFollowUpPrompt(missingFields);
        
        // Here you would make another call to the LLM with followUpPrompt
        // For now, we'll throw an error with the follow-up prompt
        throw new Error(`Incomplete response. Follow-up prompt: ${followUpPrompt}`);
      }

      throw new Error('Invalid response structure');
    } catch (error) {
      console.error('processResponse error:', error);
      throw error;
    }
  }

  public cleanResponse(response: string): string {
    console.log('cleanResponse: Original response:', response);
    
    try {
      const parsedData = safeParseJSON(response);
      const result = CompleteScriptAnalysisSchema.safeParse(parsedData);
      
      if (!result.success) {
        console.error('Schema validation errors:', result.error.format());
        throw new Error('Invalid script analysis structure: ' + result.error.message);
      }
      
      return JSON.stringify(result.data);
    } catch (e) {
      console.error('cleanResponse: Error during processing:', e);
      throw new Error(`Failed to process response: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
  }

  public parseAndValidate(response: string): ScriptAnalysis {
    try {
      const parsedData = safeParseJSON(response);
      const result = CompleteScriptAnalysisSchema.safeParse(parsedData);
      
      if (!result.success) {
        console.error('Schema validation errors:', result.error.format());
        throw new Error('Invalid script analysis structure: ' + result.error.message);
      }
      
      return result.data;
    } catch (error) {
      console.error('parseAndValidate: Error:', error);
      throw new Error(`Failed to validate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public enhancePrompt(prompt: string): string {
    return `${this.SYSTEM_PROMPT}

${prompt}`;
  }

  public sanitizeInput(script: string): string {
    // Basic text cleanup
    let cleaned = cleanInputText(script);

    // Additional script-specific cleanup
    cleaned = cleaned
      // Standardize section headers
      .replace(/^(Introduction|Main Content|Conclusion|Call to Action):\s*/gim, '$1:\n')
      // Ensure consistent list formatting
      .replace(/^[-*•]\s*/gm, '- ')
      // Fix numbered lists
      .replace(/^\d+\)\s*/gm, '$1. ')
      // Standardize visual cue markers
      .replace(/\[visual:?\s*(cue:?)?\s*/gi, '[VISUAL CUE: ')
      .replace(/\[\s*visual\s+cue\s*\]/gi, '[VISUAL CUE]')
      // Fix common markdown issues
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markers
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markers
      .replace(/_{2,}/g, '_')          // Fix multiple underscores
      // Ensure consistent spacing around visual cues
      .replace(/\]\s*\[/g, ']\n[')
      // Fix common typos in technical terms
      .replace(/ai\s+avatar/gi, 'AI Avatar')
      .replace(/machine\s+learning/gi, 'Machine Learning')
      .replace(/deep\s+learning/gi, 'Deep Learning')
      // Ensure proper spacing after periods
      .replace(/\.(?=[A-Z])/g, '. ')
      // Remove excessive exclamation marks
      .replace(/!{2,}/g, '!')
      // Remove HTML tags if any
      .replace(/<[^>]*>/g, '')
      // Ensure proper paragraph spacing
      .replace(/\n{3,}/g, '\n\n');

    console.log('Input sanitization - Original:', script);
    console.log('Input sanitization - Cleaned:', cleaned);

    return cleaned;
  }
} 
