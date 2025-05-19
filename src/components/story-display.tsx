"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { FullStoryData } from "@/types";
import { ScrollText, Users, Lightbulb, ImageIcon, BookOpen } from "lucide-react";

interface StoryDisplayProps {
  storyData: FullStoryData;
}

export function StoryDisplay({ storyData }: StoryDisplayProps) {
  const { storyOutput, illustrations, inputCharacters } = storyData;

  // Split story into paragraphs for better readability and potential illustration interleaving
  const storyParagraphs = storyOutput.story.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="w-full max-w-3xl mx-auto mt-12 shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-2">
          <BookOpen className="h-10 w-10 text-primary" />
        </div>
        <CardTitle className="text-4xl font-bold text-primary">{storyOutput.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-2 text-accent">
            <Users className="h-6 w-6" /> Characters
          </h2>
          <p className="text-muted-foreground text-lg">{inputCharacters}</p>
        </div>
        <Separator />
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-3 text-accent">
            <ScrollText className="h-6 w-6" /> Story
          </h2>
          <div className="space-y-4 text-lg leading-relaxed">
            {storyParagraphs.map((paragraph, index) => (
              <div key={index}>
                <p>{paragraph}</p>
                {illustrations[index] && (
                   <div className="my-4 rounded-lg overflow-hidden shadow-md aspect-video relative w-full max-w-md mx-auto">
                     <Image
                       src={illustrations[index]}
                       alt={`Illustration for story part ${index + 1}`}
                       layout="fill"
                       objectFit="contain"
                       data-ai-hint="children story illustration"
                       className="bg-secondary/30"
                     />
                   </div>
                )}
              </div>
            ))}
            {/* Display remaining illustrations if any */}
            {illustrations.length > storyParagraphs.length && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {illustrations.slice(storyParagraphs.length).map((illustrationUrl, index) => (
                  <div key={`extra-${index}`} className="my-2 rounded-lg overflow-hidden shadow-md aspect-video relative w-full mx-auto">
                    <Image
                       src={illustrationUrl}
                       alt={`Extra illustration ${index + 1}`}
                       layout="fill"
                       objectFit="contain"
                       data-ai-hint="children story illustration"
                       className="bg-secondary/30"
                     />
                  </div>
                ))}
              </div>
            )}
             {illustrations.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                    <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                    <p>No illustrations generated for this story.</p>
                </div>
            )}
          </div>
        </div>
        <Separator />
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-semibold mb-2 text-accent">
            <Lightbulb className="h-6 w-6" /> Moral of the Story
          </h2>
          <p className="text-lg italic text-primary font-medium">{storyOutput.moralOfTheStory}</p>
        </div>
      </CardContent>
    </Card>
  );
}
