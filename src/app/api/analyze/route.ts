import { NextResponse } from 'next/server';

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
            content: `You are a script analysis assistant. You must respond with ONLY a JSON object.
Do not include any text before or after the JSON.
Do not use markdown.
Do not explain your response.
The JSON must follow this structure exactly:
{
  "analysis": {
    "technicalTerms": ["term1", "term2"],
    "readabilityScore": 8.5,
    "suggestions": ["suggestion1", "suggestion2"],
    "overallScore": 8.5,
    "prioritizedImprovements": ["improvement1", "improvement2"],
    "sections": {
      "introduction": {
        "score": 8.5,
        "suggestions": ["suggestion1", "suggestion2"],
        "readabilityMetrics": {
          "fleschKincaid": 65,
          "wordsPerSentence": 15,
          "technicalTerms": ["term1", "term2"]
        }
      }
    }
  },
  "rewrittenScript": {
    "learningObjectives": ["objective1", "objective2"],
    "introduction": "Introduction text here",
    "mainContent": "Main content text here",
    "conclusion": "Conclusion text here",
    "callToAction": "Call to action text here"
  }
}`
          },
          {
            role: 'user',
            content: `Analyze this script and respond with ONLY a JSON object following the exact structure specified. Do not include any other text or explanations:\n\n${script}`
          }
        ],
        temperature: 0.3,
        max_tokens: 4000,
        top_p: 0.8,
        frequency_penalty: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API Route: Raw OpenRouter response:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response structure from OpenRouter');
    }

    let content = data.choices[0].message.content;
    console.log('API Route: Model response content:', content);
    
    // Try to parse the content as JSON
    try {
      // Clean the content string - be more aggressive with cleaning for Llama
      content = content
        .replace(/^[^{]*/, '')       // Remove everything before the first {
        .replace(/}[^}]*$/, '}')     // Remove everything after the last }
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
        .replace(/\n/g, ' ')         // Replace newlines with spaces
        .replace(/\s+/g, ' ')        // Normalize whitespace
        .replace(/,\s*}/g, '}')      // Remove trailing commas
        .replace(/,\s*]/g, ']')      // Remove trailing commas in arrays
        .trim();
      
      console.log('API Route: Cleaned content:', content);
      
      const result = JSON.parse(content);
      
      // Validate the parsed result has the expected structure
      if (!result.analysis || !result.rewrittenScript) {
        throw new Error('Response missing required fields');
      }
      
      console.log('API Route: Analysis completed successfully');
      return NextResponse.json(result);
    } catch (parseError) {
      console.error('API Route: JSON parse error:', parseError);
      return NextResponse.json(
        { 
          error: 'Analysis failed', 
          details: `Failed to parse model response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Route: Error:', error);
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
} 