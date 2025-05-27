
// src/app/api/generate/route.ts
import {NextRequest, NextResponse} from 'next/server';
import {generateText, type GenerateTextInput} from '@/ai/flows/generate-text-flow';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {query} = body as GenerateTextInput;

    if (!query) {
      return NextResponse.json({error: 'Query is required'}, {status: 400});
    }

    const result = await generateText({query});
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in /api/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json({error: 'Failed to generate text: ' + errorMessage}, {status: 500});
  }
}
