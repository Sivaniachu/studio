// src/ai/flows/suggest-command.ts
'use server';

/**
 * @fileOverview Implements the command suggestion flow using Genkit.
 *
 * - suggestCommand - A function that suggests command continuations based on user input.
 * - SuggestCommandInput - The input type for the suggestCommand function.
 * - SuggestCommandOutput - The return type for the suggestCommand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCommandInputSchema = z.object({
  commandPrefix: z.string().describe('The current command prefix entered by the user.'),
});
export type SuggestCommandInput = z.infer<typeof SuggestCommandInputSchema>;

const SuggestCommandOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested command continuations.'),
});
export type SuggestCommandOutput = z.infer<typeof SuggestCommandOutputSchema>;

export async function suggestCommand(input: SuggestCommandInput): Promise<SuggestCommandOutput> {
  return suggestCommandFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCommandPrompt',
  input: {schema: SuggestCommandInputSchema},
  output: {schema: SuggestCommandOutputSchema},
  prompt: `You are a command-line assistant helping users by suggesting command continuations.

  Given the following command prefix, suggest up to 5 valid command continuations that the user might want to type next.
  Return suggestions as a JSON array of strings.

  Command Prefix: {{{commandPrefix}}}`,
});

const suggestCommandFlow = ai.defineFlow(
  {
    name: 'suggestCommandFlow',
    inputSchema: SuggestCommandInputSchema,
    outputSchema: SuggestCommandOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
