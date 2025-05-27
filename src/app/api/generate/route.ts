
// src/app/api/generate/route.ts
import {NextRequest, NextResponse} from 'next/server';

// Define the expected input shape (matches TerminalView's expectation)
interface GenerateApiInput {
  query: string;
}

// Define the expected output shape (matches TerminalView's expectation)
interface GenerateApiOutput {
  responseText?: string;
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {query} = body as GenerateApiInput;

    if (!query) {
      return NextResponse.json({error: 'Query is required'}, {status: 400});
    }

    // --- START: CUSTOM MODEL INTEGRATION POINT ---
    // Replace this section with the logic to call your custom model.
    // For example, you might make a fetch request to your model's endpoint:
    /*
    const modelResponse = await fetch('YOUR_MODEL_ENDPOINT', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: query }), // Adjust payload as needed
    });

    if (!modelResponse.ok) {
      const errorData = await modelResponse.json().catch(() => ({ detail: 'Failed to call model and parse error' }));
      throw new Error(errorData.detail || `Model request failed with status ${modelResponse.status}`);
    }

    const modelResult = await modelResponse.json();
    // Assuming your model returns something like { generated_text: "..." }
    const responseText = modelResult.generated_text;
    */

    // Simulating a delay and a response for demonstration purposes:
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    // Changed to provide a generic response without echoing the query.
    let responseText = "This is a simulated response from your custom model.";
    
    if (query.toLowerCase().includes("error example")) {
        // The error message here will be caught by TerminalView and displayed as "Some error occurred"
        return NextResponse.json({ error: "This is a simulated error from your model." }, { status: 500 });
    }
    if (query.toLowerCase().includes("code example")) {
        // Changed to provide code without echoing the query.
        responseText = `Here's some example code:
\`\`\`python
def greet(name):
  print(f"Hello, {name}!")

greet("Developer")
\`\`\`
And some JavaScript:
\`\`\`javascript
console.log("Hello from JavaScript!");
\`\`\``;
    }

    // --- END: CUSTOM MODEL INTEGRATION POINT ---

    return NextResponse.json({responseText});

  } catch (error) {
    console.error('Error in /api/generate:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    // This error response will also be displayed as "Some error occurred" by TerminalView if it reaches there.
    return NextResponse.json({error: 'Failed to generate text: ' + errorMessage}, {status: 500});
  }
}
