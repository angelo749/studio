'use server';
/**
 * @fileOverview Generates unique children's stories based on user-provided themes, characters, and morals.
 *
 * - generateStory - A function that generates a story based on the provided input.
 * - GenerateStoryInput - The input type for the generateStory function.
 * - GenerateStoryOutput - The return type for the generateStory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStoryInputSchema = z.object({
  theme: z.string().describe('The theme of the story (e.g., friendship, courage, honesty).'),
  characters: z.string().describe('The characters in the story (e.g., a brave knight, a wise owl, a playful cat).'),
  moral: z.string().describe('The moral of the story (e.g., honesty is the best policy, kindness matters, never give up).'),
  length: z.enum(['short', 'medium', 'long']).default('medium').describe('The desired length of the story.'),
  readingLevel: z.enum(['easy', 'intermediate', 'advanced']).default('intermediate').describe('The reading level of the story.'),
  includeIllustrations: z.boolean().default(true).describe('Whether to include illustrations in the story.'),
});

export type GenerateStoryInput = z.infer<typeof GenerateStoryInputSchema>;

const GenerateStoryOutputSchema = z.object({
  title: z.string().describe('The title of the generated story.'),
  story: z.string().describe('The generated story text.'),
  moralOfTheStory: z.string().describe('The moral of the story derived from the story content'),
  illustrationPrompt: z.string().optional().describe('A prompt for generating an illustration for the story.'),
});

export type GenerateStoryOutput = z.infer<typeof GenerateStoryOutputSchema>;

export async function generateStory(input: GenerateStoryInput): Promise<GenerateStoryOutput> {
  return generateStoryFlow(input);
}

const storyPrompt = ai.definePrompt({
  name: 'storyPrompt',
  input: {schema: GenerateStoryInputSchema},
  output: {schema: GenerateStoryOutputSchema},
  prompt: `Eres un escritor de cuentos infantiles. Genera un cuento único en **español latinoamericano (Perú)** basado en los siguientes criterios:

Tema: {{{theme}}}
Personajes: {{{characters}}}
Moraleja: {{{moral}}}
Extensión: {{{length}}}
Nivel de lectura: {{{readingLevel}}}

Escribe un cuento que sea apropiado para niños y que transmita eficazmente la moraleja. Asegúrate de que el cuento sea atractivo y fácil de entender. El título debe ser cautivador y relevante para la historia. Todos los textos generados, incluyendo título, cuento y moraleja, deben estar en **español latinoamericano (Perú)**.

Si includeIllustrations es true, genera una frase (prompt) de una oración en **español latinoamericano (Perú)**, adecuada para generar una ilustración que complemente el cuento. De lo contrario, déjalo indefinido.

Asegúrate de que el cuento transmita la moraleja y extrae la moraleja central del cuento generado en el campo moralOfTheStory.

Formato de salida: JSON.
`,
});

const generateStoryFlow = ai.defineFlow(
  {
    name: 'generateStoryFlow',
    inputSchema: GenerateStoryInputSchema,
    outputSchema: GenerateStoryOutputSchema,
  },
  async input => {
    const {output} = await storyPrompt(input);
    return output!;
  }
);
