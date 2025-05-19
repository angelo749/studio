// src/ai/flows/generate-illustrations.ts
'use server';

/**
 * @fileOverview Flow to generate context-aware illustrations for a children's story.
 *
 * - generateIllustrations - A function that generates illustrations for the story.
 * - GenerateIllustrationsInput - The input type for the generateIllustrations function.
 * - GenerateIllustrationsOutput - The return type for the generateIllustrations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateIllustrationsInputSchema = z.object({
  storyText: z.string().describe('The text of the children\u0027s story to illustrate.'),
  theme: z.string().describe('The theme of the story (e.g., adventure, friendship, courage).'),
});
export type GenerateIllustrationsInput = z.infer<typeof GenerateIllustrationsInputSchema>;

const GenerateIllustrationsOutputSchema = z.object({
  illustrations: z
    .array(z.string())
    .describe(
      'An array of data URIs, each representing an illustration relevant to a specific part of the story.'
    ),
});
export type GenerateIllustrationsOutput = z.infer<typeof GenerateIllustrationsOutputSchema>;

export async function generateIllustrations(input: GenerateIllustrationsInput): Promise<GenerateIllustrationsOutput> {
  return generateIllustrationsFlow(input);
}

const generateIllustrationsPrompt = ai.definePrompt({
  name: 'generateIllustrationsPrompt',
  input: {schema: GenerateIllustrationsInputSchema},
  output: {schema: GenerateIllustrationsOutputSchema},
  prompt: `You are a children's book illustrator. Given the story text and theme, you will generate a list of illustrations that would enhance the storytelling.

Instructions:
1.  Analyze the story text to identify key scenes, characters, and objects that would benefit from visual representation.
2.  Consider the story's theme to ensure the illustrations align with the overall message and tone.
3.  Generate a list of concise descriptions for each illustration.
4.  Use each description to generate an image using the googleai/gemini-2.0-flash-exp model.
5.  Return the image data URIs in an array.

Story Theme: {{{theme}}}
Story Text: {{{storyText}}}

Output Format: An array of data URIs representing the images.`,
});

const generateIllustrationsFlow = ai.defineFlow(
  {
    name: 'generateIllustrationsFlow',
    inputSchema: GenerateIllustrationsInputSchema,
    outputSchema: GenerateIllustrationsOutputSchema,
  },
  async input => {
    const storyText = input.storyText;
    const sentences = storyText.split('.').map(s => s.trim());
    const illustrations: string[] = [];

    for (const sentence of sentences) {
      if (sentence.length > 0) {
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-exp',
          prompt: [
            {text: `Generate an illustration for the following sentence: ${sentence}`},
            {text: `The theme of the story is ${input.theme}`},
          ],
          config: {responseModalities: ['TEXT', 'IMAGE']},
        });
        if (media?.url) {
          illustrations.push(media.url);
        }
      }
    }

    return {illustrations};
  }
);
