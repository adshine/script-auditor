import { NextResponse } from 'next/server';
import { analyzeScript } from '@/lib/api';

export async function POST(request: Request) {
  console.log('API Route: Starting request handling');
  
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('API Route: Request body:', body);
    } catch (parseError: unknown) {
      console.error('API Route: Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body', details: parseError instanceof Error ? parseError.message : 'Failed to parse request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { script, model } = body;
    if (!script || !model) {
      console.log('API Route: Missing required fields:', { script: !!script, model: !!model });
      return NextResponse.json(
        { error: 'Missing required fields', details: 'Both script and model are required' },
        { status: 400 }
      );
    }

    // Validate script content
    if (typeof script !== 'string' || script.trim().length === 0) {
      console.log('API Route: Invalid script content');
      return NextResponse.json(
        { error: 'Invalid script content', details: 'Script must be a non-empty string' },
        { status: 400 }
      );
    }

    // Validate model
    if (typeof model !== 'string' || model.trim().length === 0) {
      console.log('API Route: Invalid model identifier');
      return NextResponse.json(
        { error: 'Invalid model identifier', details: 'Model must be a non-empty string' },
        { status: 400 }
      );
    }

    console.log('API Route: Starting script analysis with model:', model);
    try {
      const analysis = await analyzeScript(script, model);
      console.log('API Route: Analysis completed successfully');
      
      // Validate analysis structure before returning
      if (!analysis || typeof analysis !== 'object') {
        console.error('API Route: Invalid analysis result structure:', analysis);
        return NextResponse.json(
          { error: 'Invalid analysis result', details: 'Analysis result has invalid structure' },
          { status: 500 }
        );
      }

      if (!analysis.analysis || !analysis.rewrittenScript) {
        console.error('API Route: Missing required fields in analysis:', analysis);
        return NextResponse.json(
          { error: 'Invalid analysis result', details: 'Analysis result missing required fields' },
          { status: 500 }
        );
      }

      return NextResponse.json(analysis);
    } catch (analysisError) {
      console.error('API Route: Analysis failed:', analysisError);
      if (analysisError instanceof Error) {
        console.error('API Route: Error details:', {
          name: analysisError.name,
          message: analysisError.message,
          stack: analysisError.stack
        });
      }
      return NextResponse.json(
        { 
          error: 'Analysis failed',
          details: analysisError instanceof Error ? analysisError.message : 'Unknown error during analysis'
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('API Route: Unexpected error:', error);
    if (error instanceof Error) {
      console.error('API Route: Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  } finally {
    console.log('API Route: Request handling completed');
  }
} 