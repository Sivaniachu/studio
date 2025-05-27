
// src/app/api/generate/route.ts
import {NextRequest, NextResponse} from 'next/server';

// Define the expected input shape (matches TerminalView's expectation)
interface GenerateApiInput {
  query: string;
}

// Define the expected output shape from your successful model call
interface YourModelSuccessOutput {
  generated_text: string; // Example field, adjust to your model's output
}

// Define a potential error shape from your model if it handles errors internally
interface YourModelErrorOutput {
  detail: string; // Example field, adjust as needed
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {query} = body as GenerateApiInput;

    if (!query) {
      return NextResponse.json({error: 'Query is required'}, {status: 400});
    }

    let responseText: string | undefined;

    // --- START: CUSTOM MODEL INTEGRATION POINT ---
    // Replace this section with the logic to call your custom model.
    // Example structure:
    /*
    try {
      const modelApiResponse = await fetch('YOUR_MODEL_ENDPOINT', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: query }), // Adjust payload as needed by your model
      });

      if (!modelApiResponse.ok) {
        // Try to parse error from your model's response
        const errorData: YourModelErrorOutput = await modelApiResponse.json().catch(() => ({ detail: 'Model responded with an error, but error details are unparseable.' }));
        // This error will be caught by the outer catch and returned as a 500
        throw new Error(errorData.detail || `Model request failed with status ${modelApiResponse.status}`);
      }

      const modelResult: YourModelSuccessOutput = await modelApiResponse.json();
      responseText = modelResult.generated_text; // Assuming your model returns this structure

    } catch (modelError) {
      console.error('Error calling custom model:', modelError);
      // This error will be caught by the main try-catch of this API route
      throw modelError;
    }
    */
    // If your model integration logic is not implemented or doesn't set responseText,
    // it will remain undefined.
    // --- END: CUSTOM MODEL INTEGRATION POINT ---

    if (responseText !== undefined) {
      // If your model successfully produced text, return it.
      return NextResponse.json({responseText});
    } else {
      // If responseText is still undefined, it means the custom model logic
      // was not implemented, or it was implemented but did not produce a responseText.
      // In this case, we return a 503 error. TerminalView.tsx's fetchWithTimeout
      // will handle its own 15-second timeout if this API itself takes too long to send this 503.
      // If this 503 is returned quickly, TerminalView will immediately process it as an error.
      return NextResponse.json({ error: "Model service not available or did not produce a response." }, { status: 503 });
    }

  } catch (error) {
    console.error('Error in /api/generate route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    // This catches errors from JSON parsing, or errors thrown from the custom model integration.
    return NextResponse.json({error: `API Error: ${errorMessage}`}, {status: 500});
  }
}
