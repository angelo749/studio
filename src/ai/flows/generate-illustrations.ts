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
  storyText: z.string().describe('The text of the children\u0027s story to illustrate, expected in Latin American Spanish (Peru).'),
  theme: z.string().describe('The theme of the story (e.g., adventure, friendship, courage), expected in Latin American Spanish (Peru).'),
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
  prompt: `Eres un ilustrador de libros infantiles. Dado el texto del cuento y el tema (ambos en español latinoamericano de Perú), generarás una lista de ilustraciones que mejoren la narración.

Instrucciones:
1.  Analiza el texto del cuento para identificar escenas clave, personajes y objetos que se beneficiarían de una representación visual. El texto del cuento está en **español latinoamericano (Perú)**.
2.  Considera el tema del cuento para asegurar que las ilustraciones se alineen con el mensaje general y el tono. El tema está en **español latinoamericano (Perú)**.
3.  Genera una lista de descripciones concisas para cada ilustración. Estas descripciones deben estar en **español latinoamericano (Perú)**.
4.  Usa cada descripción para generar una imagen usando el modelo googleai/gemini-2.0-flash-exp.
5.  Devuelve los URIs de datos de las imágenes en un arreglo.

Tema del Cuento: {{{theme}}}
Texto del Cuento: {{{storyText}}}

Formato de Salida: Un arreglo de URIs de datos representando las imágenes.`,
});

const generateIllustrationsFlow = ai.defineFlow(
  {
    name: 'generateIllustrationsFlow',
    inputSchema: GenerateIllustrationsInputSchema,
    outputSchema: GenerateIllustrationsOutputSchema,
  },
  async input => {
    const storyText = input.storyText;
    // Dividir el cuento en frases u oraciones para generar ilustraciones más específicas.
    // Considerar párrafos si las frases son muy cortas o para ilustraciones más generales.
    const segments = storyText.split(/[.!?¡¿]\s+/).map(s => s.trim()).filter(s => s.length > 20); // Filtrar segmentos muy cortos
    
    if (segments.length === 0 && storyText.length > 0) { // Si no hay segmentos pero hay texto, usar el texto completo para una ilustración
        segments.push(storyText);
    }

    const illustrations: string[] = [];
    const maxIllustrations = 3; // Limitar el número de ilustraciones para no demorar mucho

    for (let i = 0; i < Math.min(segments.length, maxIllustrations); i++) {
      const segment = segments[i];
      if (segment.length > 0) {
        const imageGenPrompt = `Genera una ilustración para el siguiente segmento de un cuento infantil en español: "${segment}". El tema del cuento es "${input.theme}". Estilo: ilustración colorida y alegre para niños.`;
        const {media} = await ai.generate({
          model: 'googleai/gemini-2.0-flash-exp',
          prompt: [{text: imageGenPrompt}],
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
