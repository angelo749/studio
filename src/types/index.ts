import type { GenerateStoryOutput } from "@/ai/flows/generate-story";

export interface FullStoryData {
  storyOutput: GenerateStoryOutput;
  illustrations: string[];
  inputCharacters: string; 
}

export interface Illustration {
  id: string;
  url: string;
  alt: string;
}
