import { NextResponse } from 'next/server';
import { claudeSonnetPrompt } from '@/lib/prompts/claude-3-sonnet';
import { ModelPrompt } from '@/lib/prompts/base-prompt';

interface AnalysisResponse {
  analysis: {
    technicalTerms: string[];
    readabilityScore: number;
    suggestions: string[];
    overallScore: number;
    prioritizedImprovements: string[];
    sections: {
      introduction: {
        score: number;
        suggestions: string[];
        readabilityMetrics: {
          fleschKincaid: number;
          wordsPerSentence: number;
          technicalTerms: string[];
        };
      };
    };
  };
  rewrittenScript: {
    learningObjectives: string[];
    introduction: string;
    mainContent: string;
    conclusion: string;
    callToAction: string;
  };
}

// Function to create a default response structure
const createDefaultResponse = (content: string = ""): AnalysisResponse => ({
  analysis: {
    technicalTerms: [],
    readabilityScore: 7.0,
    suggestions: ["Improve content structure"],
    overallScore: 7.0,
    prioritizedImprovements: ["Add more detail"],
    sections: {
      introduction: {
        score: 7.0,
        suggestions: ["Expand content"],
        readabilityMetrics: {
          fleschKincaid: 60,
          wordsPerSentence: 15,
          technicalTerms: []
        }
      }
    }
  },
  rewrittenScript: {
    learningObjectives: ["Understand the content"],
    introduction: content ? content.substring(0, 200) + "..." : "Introduction needs to be added.",
    mainContent: "Content needs to be restructured.",
    conclusion: "Please review and revise the content.",
    callToAction: "Review and improve the script structure."
  }
});

// Helper function to validate JSON structure
const validateResult = (result: any, content: string): AnalysisResponse => {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid JSON structure');
  }
  
  // Ensure all required fields exist with correct types
  const { analysis, rewrittenScript } = result;
  
  if (!analysis || !rewrittenScript) {
    console.log('Missing required top-level fields, attempting to reconstruct');
    return createDefaultResponse(content);
  }

  // Validate and sanitize analysis section
  analysis.technicalTerms = Array.isArray(analysis.technicalTerms) ? analysis.technicalTerms : [];
  analysis.readabilityScore = Number(analysis.readabilityScore) || 7.0;
  analysis.suggestions = Array.isArray(analysis.suggestions) ? analysis.suggestions : [];
  analysis.overallScore = Number(analysis.overallScore) || 7.0;
  analysis.prioritizedImprovements = Array.isArray(analysis.prioritizedImprovements) ? analysis.prioritizedImprovements : [];

  // Validate and sanitize rewrittenScript section
  rewrittenScript.learningObjectives = Array.isArray(rewrittenScript.learningObjectives) ? 
    rewrittenScript.learningObjectives : ["Understand the content"];
  rewrittenScript.introduction = String(rewrittenScript.introduction || "").trim() || "Introduction needs to be added.";
  rewrittenScript.mainContent = String(rewrittenScript.mainContent || "").trim() || "Main content needs to be added.";
  rewrittenScript.conclusion = String(rewrittenScript.conclusion || "").trim() || "Conclusion needs to be added.";
  rewrittenScript.callToAction = String(rewrittenScript.callToAction || "").trim() || "Call to action needs to be added.";

  return result as AnalysisResponse;
};

export async function POST(request: Request) {
  console.log('API Route: Starting request handling');
  
  try {
    const body = await request.json();
    console.log('API Route: Request body:', body);
    
    const { script, model } = body;
    
    if (!script || !model) {
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Script and model are required' },
        { status: 400 }
      );
    }

    // Get the appropriate prompt for the model
    let modelPrompt: ModelPrompt;
    switch (model) {
      case 'anthropic/claude-3-sonnet-20240229':
        modelPrompt = claudeSonnetPrompt;
        break;
      // Add other model cases here
      default:
        throw new Error(`Unsupported model: ${model}`);
    }
    
    console.log('API Route: Starting script analysis with model:', model);
    
    // Make the API request to OpenRouter
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content: modelPrompt.systemPrompt
          },
          {
            role: 'user',
            content: modelPrompt.userPromptTemplate(script)
          }
        ],
        temperature: modelPrompt.temperature,
        max_tokens: modelPrompt.maxTokens,
        top_p: modelPrompt.topP,
        presence_penalty: modelPrompt.presencePenalty,
        frequency_penalty: modelPrompt.frequencyPenalty
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Route: Raw OpenRouter response:', data);
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid response structure from OpenRouter');
    }

    let content = data.choices[0].message.content;
    console.log('API Route: Model response content:', content);
    
    // Helper function to clean JSON content
    const cleanJsonContent = (str: string): string => {
      // Remove any non-JSON content before { and after }
      const jsonStart = str.indexOf('{');
      const jsonEnd = str.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1 || jsonStart > jsonEnd) {
        throw new Error('No valid JSON object found');
      }
      str = str.slice(jsonStart, jsonEnd + 1);

      // Fix common JSON issues
      let cleaned = str
        // Fix newlines in strings
        .replace(/\n/g, '\\n')
        // Fix escaped quotes
        .replace(/\\"/g, '\\\\"')
        // Fix unescaped quotes in strings
        .replace(/(?<!\\)"/g, '\\"')
        .replace(/^/, '"')
        .replace(/$/, '"');

      try {
        // Parse and stringify to ensure valid JSON
        cleaned = JSON.stringify(JSON.parse(cleaned));
      } catch (e) {
        // If parsing fails, return the cleaned string as is
        console.log('Warning: Could not parse intermediate JSON:', e);
      }

      // Fix any remaining issues
      return cleaned
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/\\\\/g, '\\')
        .replace(/\\"/g, '"')
        .replace(/"\{/g, '{')
        .replace(/\}"/g, '}')
        .replace(/\}\s*\{/g, '}')
        .trim();
    };
    
    // Try to parse the content as JSON
    try {
      // First attempt: Try to parse as-is
      try {
        const result = validateResult(JSON.parse(content), content);
        return NextResponse.json(result);
      } catch (directParseError) {
        console.log('Direct parse failed:', directParseError);
      }

      // Second attempt: Clean and parse
      try {
        content = content.trim();
        
        // Remove markdown code blocks
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        
        // Clean and parse JSON
        content = cleanJsonContent(content);
        console.log('Cleaned content:', content);
        
        const result = validateResult(JSON.parse(content), content);
        return NextResponse.json(result);
      } catch (cleanupError) {
        console.log('Cleanup parse failed:', cleanupError);
        
        // Try one more time with more aggressive cleaning
        try {
          // Remove all whitespace
          content = content.replace(/\s+/g, ' ').trim();
          
          // Find the largest valid JSON object
          const jsonMatches = content.match(/\{(?:[^{}]|(\{[^{}]*\}))*\}/g) || [];
          const validJson = jsonMatches
            .map((match: string) => {
              try {
                const cleaned = cleanJsonContent(match);
                JSON.parse(cleaned); // Test if valid
                return cleaned;
              } catch {
                return '';
              }
            })
            .filter(Boolean)
            .sort((a: string, b: string) => b.length - a.length)[0];
            
          if (validJson) {
            const result = validateResult(JSON.parse(validJson), content);
            return NextResponse.json(result);
          }
        } catch (aggressiveCleanupError) {
          console.log('Aggressive cleanup failed:', aggressiveCleanupError);
        }
      }

      // Final attempt: Create a default response with the content
      console.log('All parsing attempts failed, creating default response');
      return NextResponse.json(createDefaultResponse(content));
      
    } catch (parseError) {
      console.error('API Route: JSON parse error:', parseError);
      // Return default response instead of error
      return NextResponse.json(createDefaultResponse(content));
    }
  } catch (error) {
    console.error('API Route: Error:', error);
    return NextResponse.json(createDefaultResponse(""));
  }
} 