
// src/ai/flows/generate-text-flow.ts
'use server';
/**
 * @fileOverview Implements a text generation flow using Genkit.
 *
 * - generateText - A function that generates text based on a user query.
 * - GenerateTextInput - The input type for the generateText function.
 * - GenerateTextOutput - The return type for the generateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTextInputSchema = z.object({
  query: z.string().describe('The user query or command to respond to.'),
});
export type GenerateTextInput = z.infer<typeof GenerateTextInputSchema>;

const GenerateTextOutputSchema = z.object({
  responseText: z.string().describe('The AI-generated response text.'),
});
export type GenerateTextOutput = z.infer<typeof GenerateTextOutputSchema>;

export async function generateText(input: GenerateTextInput): Promise<GenerateTextOutput> {
  return generateTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTextPrompt',
  input: {schema: GenerateTextInputSchema},
  output: {schema: GenerateTextOutputSchema},
  prompt: `You are a helpful AI assistant integrated into a command-line interface.
Respond to the user's query.
If you are providing code examples, make sure to wrap them in markdown code blocks with the language specified, like:
\`\`\`python
print("Hello, world!")
\`\`\`
User Query: {{{query}}}`,
});

const generateTextFlow = ai.defineFlow(
  {
    name: 'generateTextFlow',
    inputSchema: GenerateTextInputSchema,
    outputSchema: GenerateTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
