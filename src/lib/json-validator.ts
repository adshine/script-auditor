import { ScriptAnalysis, Section, ReadabilityMetrics } from './api';

export class JSONValidator {
  private validateReadabilityMetrics(metrics: any): metrics is ReadabilityMetrics {
    return (
      typeof metrics.fleschKincaid === 'number' &&
      typeof metrics.wordsPerSentence === 'number' &&
      Array.isArray(metrics.technicalTerms) &&
      metrics.technicalTerms.every((term: any) => typeof term === 'string')
    );
  }

  private validateSection(section: any): section is Section {
    return (
      typeof section.score === 'number' &&
      Array.isArray(section.suggestions) &&
      section.suggestions.every((s: any) => typeof s === 'string') &&
      this.validateReadabilityMetrics(section.readabilityMetrics) &&
      (section.aiEnhancements === undefined || typeof section.aiEnhancements === 'string')
    );
  }

  public validateScriptAnalysis(data: any): data is ScriptAnalysis {
    try {
      // Validate top-level structure
      if (!data || typeof data !== 'object') {
        throw new Error('Response must be an object');
      }

      if (!data.analysis || !data.rewrittenScript) {
        throw new Error('Missing required top-level fields: analysis and rewrittenScript');
      }

      // Validate analysis section
      const analysis = data.analysis;
      if (!Array.isArray(analysis.technicalTerms) ||
          typeof analysis.readabilityScore !== 'number' ||
          !Array.isArray(analysis.suggestions) ||
          typeof analysis.overallScore !== 'number' ||
          !Array.isArray(analysis.prioritizedImprovements) ||
          !analysis.sections) {
        throw new Error('Invalid analysis structure');
      }

      // Validate sections
      if (!analysis.sections.introduction || 
          !this.validateSection(analysis.sections.introduction)) {
        throw new Error('Invalid introduction section');
      }

      if (analysis.sections.mainContent && 
          !this.validateSection(analysis.sections.mainContent)) {
        throw new Error('Invalid mainContent section');
      }

      if (analysis.sections.conclusion && 
          !this.validateSection(analysis.sections.conclusion)) {
        throw new Error('Invalid conclusion section');
      }

      // Validate rewrittenScript
      const script = data.rewrittenScript;
      if (!Array.isArray(script.learningObjectives) ||
          typeof script.introduction !== 'string' ||
          typeof script.mainContent !== 'string' ||
          typeof script.conclusion !== 'string' ||
          typeof script.callToAction !== 'string') {
        throw new Error('Invalid rewrittenScript structure');
      }

      return true;
    } catch (error) {
      throw new Error(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export class LLMResponseHandler {
  private validator: JSONValidator;

  constructor() {
    this.validator = new JSONValidator();
  }

  private normalizeNewlines(text: string): string {
    // First convert all escaped newlines to actual newlines
    text = text.replace(/\\n/g, '\n');
    // Then properly escape them back
    return text.replace(/\n/g, '\\n');
  }

  private normalizeMarkdown(text: string): string {
    // Handle markdown special characters
    return text
      .replace(/\*/g, '\\*')
      .replace(/`/g, '\\`')
      .replace(/#/g, '\\#')
      .replace(/\[/g, '\\[')
      .replace(/\]/g, '\\]')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)')
      .replace(/>/g, '\\>')
      .replace(/_/g, '\\_');
  }

  public cleanResponse(response: string): string {
    console.log('cleanResponse: Original response:', response);
    
    // Step 1: Remove any leading/trailing whitespace and special characters
    let cleaned = response
      .replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
      .replace(/^[\u200B-\u200D\uFEFF\uFFFE\uFEFF]/, '') // Remove BOM and zero-width spaces
      .replace(/^[^{]*{/, '{') // Remove any text before the first {
      .replace(/}[^}]*$/, '}'); // Remove any text after the last }

    console.log('cleanResponse: After initial cleaning:', cleaned);

    // Step 2: Remove markdown code blocks
    cleaned = cleaned
      .replace(/^```json\s*|\s*```$/g, '')
      .replace(/```/g, '');

    console.log('cleanResponse: After removing code blocks:', cleaned);

    // Step 3: Ensure the response starts with { and ends with }
    if (!cleaned.startsWith('{')) {
      cleaned = '{' + cleaned;
    }
    if (!cleaned.endsWith('}')) {
      cleaned = cleaned + '}';
    }

    // Step 4: Handle escaped characters
    cleaned = cleaned
      // First unescape any double-escaped characters
      .replace(/\\\\/g, '\\')
      // Handle newlines
      .replace(/\\n/g, '\n')
      .replace(/\n/g, '\\n')
      // Handle quotes
      .replace(/\\"/g, '"')
      .replace(/(?<!\\)"/g, '\\"')
      // Handle other escaped characters
      .replace(/\\t/g, '\t')
      .replace(/\\r/g, '\r')
      .replace(/\\\\/g, '\\');

    console.log('cleanResponse: After handling escaped characters:', cleaned);

    // Step 5: Handle markdown content within strings
    try {
      const parsed = JSON.parse(cleaned);
      console.log('cleanResponse: Successfully parsed initial JSON');
      
      const processValue = (value: any): any => {
        if (typeof value === 'string') {
          return this.normalizeMarkdown(this.normalizeNewlines(value));
        }
        if (Array.isArray(value)) {
          return value.map(processValue);
        }
        if (value && typeof value === 'object') {
          const processed: Record<string, any> = {};
          for (const [key, val] of Object.entries(value)) {
            processed[key] = processValue(val);
          }
          return processed;
        }
        return value;
      };
      
      const result = JSON.stringify(processValue(parsed));
      console.log('cleanResponse: Final cleaned result:', result);
      return result;
    } catch (e) {
      console.error('cleanResponse: Error during JSON processing:', e);
      console.error('cleanResponse: Problematic JSON:', cleaned);
      
      // Try to fix common JSON issues
      try {
        // Remove any potential trailing commas
        cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
        // Ensure property names are quoted
        cleaned = cleaned.replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
        // Replace single quotes with double quotes
        cleaned = cleaned.replace(/'/g, '"');
        
        console.log('cleanResponse: After additional fixes:', cleaned);
        
        // Try parsing one more time
        JSON.parse(cleaned);
        return cleaned;
      } catch (finalError) {
        console.error('cleanResponse: Final error:', finalError);
        // If we still can't fix it, return the cleaned string for further processing
        return cleaned;
      }
    }
  }

  public parseAndValidate(response: string): ScriptAnalysis {
    try {
      // Clean the response
      const cleanedResponse = this.cleanResponse(response);
      
      // Parse JSON
      let parsedData: any;
      try {
        parsedData = JSON.parse(cleanedResponse);
      } catch (parseError) {
        // Try parsing with relaxed JSON rules
        const relaxedJSON = cleanedResponse
          .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":') // Quote unquoted keys
          .replace(/'/g, '"'); // Replace single quotes with double quotes
        parsedData = JSON.parse(relaxedJSON);
      }

      // Validate the structure
      if (!this.validator.validateScriptAnalysis(parsedData)) {
        throw new Error('Invalid script analysis structure');
      }

      return parsedData as ScriptAnalysis;
    } catch (error) {
      throw new Error(`Failed to parse and validate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public enhancePrompt(prompt: string): string {
    return `
${prompt}

IMPORTANT FORMATTING INSTRUCTIONS:
1. Respond ONLY with a valid JSON object
2. Do not include any text, markdown, or explanations outside the JSON
3. All string values must use double quotes
4. Escape any quotes within strings with backslash
5. Follow the exact field names and data types specified
6. Include all required fields
7. Ensure numbers are actual numbers, not strings
8. Arrays must contain elements of the specified type
9. Do not include any comments or extra whitespace
10. Properly escape all special characters in strings (\\n, \\", etc.)
11. If response would be too long, reduce content length but maintain complete JSON structure

Example response format:
{
  "analysis": {
    "technicalTerms": ["term1", "term2"],
    "readabilityScore": 9.0,
    "suggestions": ["suggestion1"],
    "overallScore": 8.5,
    "prioritizedImprovements": ["improvement1"],
    "sections": {
      "introduction": {
        "score": 8.5,
        "suggestions": ["suggestion1"],
        "readabilityMetrics": {
          "fleschKincaid": 8.0,
          "wordsPerSentence": 15.5,
          "technicalTerms": ["term1"]
        }
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": ["objective1"],
    "introduction": "Introduction text",
    "mainContent": "Main content text",
    "conclusion": "Conclusion text",
    "callToAction": "Call to action text"
  }
}`;
  }
} 
