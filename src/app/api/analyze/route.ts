import { NextResponse } from 'next/server';
import { analyzeScript } from '@/lib/api';

export async function POST(request: Request) {
  console.log('API Route: Starting request handling');
  
  try {
    // Validate request method
    if (request.method !== 'POST') {
      console.log('API Route: Invalid method:', request.method);
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('API Route: Request body:', body);
    } catch (parseError) {
      console.error('API Route: Failed to parse request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // Validate required fields
    const { script, model } = body;
    if (!script || !model) {
      console.log('API Route: Missing required fields:', { script: !!script, model: !!model });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate script content
    if (typeof script !== 'string' || script.trim().length === 0) {
      console.log('API Route: Invalid script content');
      return NextResponse.json(
        { error: 'Invalid script content' },
        { status: 400 }
      );
    }

    // Validate model
    if (typeof model !== 'string' || model.trim().length === 0) {
      console.log('API Route: Invalid model identifier');
      return NextResponse.json(
        { error: 'Invalid model identifier' },
        { status: 400 }
      );
    }

    console.log('API Route: Starting script analysis with model:', model);
    const analysis = await analyzeScript(script, model);
    console.log('API Route: Analysis completed successfully');
    
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    // Log the full error details
    if (error instanceof Error) {
      console.error('API Route: Analysis failed. Full error:', {
        name: error.name,
        message: error.message,
        stack: error.stack,
        error
      });
    } else {
      console.error('API Route: Analysis failed with unknown error:', error);
    }
    
    // Return a more detailed error message
    return NextResponse.json(
      { 
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    console.log('API Route: Request handling completed');
  }
} 