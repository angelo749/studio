"use server";

import { generateStory, type GenerateStoryInput } from "@/ai/flows/generate-story";
import { generateIllustrations } from "@/ai/flows/generate-illustrations";
import { StoryFormSchema, type StoryFormValues } from "@/lib/schema";
import type { FullStoryData } from "@/types";

export async function handleGenerateFullStoryAction(
  values: StoryFormValues
): Promise<{ data?: FullStoryData; error?: string }> {
  try {
    const validatedFields = StoryFormSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Invalid input data. Please check the form." };
    }

    const { theme, characters, moral, length, readingLevel } = validatedFields.data;

    const storyInput: GenerateStoryInput = {
      theme,
      characters,
      moral,
      length,
      readingLevel,
      includeIllustrations: true, // The generateStory flow uses this to generate an illustration prompt
    };

    const storyOutput = await generateStory(storyInput);

    if (!storyOutput || !storyOutput.story) {
      return { error: "Failed to generate story content." };
    }
    
    // Use the generated story and original theme for illustrations
    const illustrationsOutput = await generateIllustrations({
      storyText: storyOutput.story,
      theme: theme, 
    });
    
    const illustrations = illustrationsOutput.illustrations || [];

    return {
      data: {
        storyOutput,
        illustrations,
        inputCharacters: characters, // Pass through user-input characters
      },
    };
  } catch (e) {
    console.error("Error generating story:", e);
    const errorMessage = e instanceof Error ? e.message : "An unknown error occurred during story generation.";
    return { error: `Failed to generate story. ${errorMessage}` };
  }
}
