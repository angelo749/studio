import { z } from 'zod';

export const storyLengths = ['short', 'medium', 'long'] as const;
export const readingLevels = ['easy', 'intermediate', 'advanced'] as const;

export const StoryFormSchema = z.object({
  theme: z.string().min(3, { message: "Theme must be at least 3 characters long." }).max(100, { message: "Theme must be at most 100 characters long." }),
  characters: z.string().min(3, { message: "Characters description must be at least 3 characters long." }).max(200, { message: "Characters description must be at most 200 characters long." }),
  moral: z.string().min(3, { message: "Moral must be at least 3 characters long." }).max(150, { message: "Moral must be at most 150 characters long." }),
  length: z.enum(storyLengths),
  readingLevel: z.enum(readingLevels),
});

export type StoryFormValues = z.infer<typeof StoryFormSchema>;
