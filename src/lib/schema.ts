import { z } from 'zod';

export const storyLengths = ['short', 'medium', 'long'] as const;
export const readingLevels = ['easy', 'intermediate', 'advanced'] as const;

export const StoryFormSchema = z.object({
  theme: z.string().min(3, { message: "El tema debe tener al menos 3 caracteres." }).max(100, { message: "El tema debe tener como máximo 100 caracteres." }),
  characters: z.string().min(3, { message: "La descripción de los personajes debe tener al menos 3 caracteres." }).max(200, { message: "La descripción de los personajes debe tener como máximo 200 caracteres." }),
  moral: z.string().min(3, { message: "La moraleja debe tener al menos 3 caracteres." }).max(150, { message: "La moraleja debe tener como máximo 150 caracteres." }),
  length: z.enum(storyLengths),
  readingLevel: z.enum(readingLevels),
});

export type StoryFormValues = z.infer<typeof StoryFormSchema>;
