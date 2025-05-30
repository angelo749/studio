"use client";

import { useState } from "react";
import { StoryForm, type StoryFormValues } from "@/components/story-form";
import { StoryDisplay } from "@/components/story-display";
import { handleGenerateFullStoryAction } from "@/lib/actions";
import type { FullStoryData } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

export default function HomePage() {
  const [storyData, setStoryData] = useState<FullStoryData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (values: StoryFormValues) => {
    setIsLoading(true);
    setError(null);
    setStoryData(null);

    const result = await handleGenerateFullStoryAction(values);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "¡Oh no! Algo salió mal.",
        description: result.error,
      });
    } else if (result.data) {
      setStoryData(result.data);
      toast({
        title: "¡Cuento Generado!",
        description: "Tu cuento mágico ha sido tejido.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen flex flex-col items-center">
      <header className="text-center mb-10 md:mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight">
          Tejedor de Historias
        </h1>
        <p className="mt-3 text-xl text-muted-foreground max-w-2xl mx-auto">
          Crea encantadores cuentos infantiles con la magia de la IA. ¡Solo comparte tus ideas y mira cómo se desarrolla una historia única!
        </p>
      </header>

      <main className="w-full">
        <StoryForm onSubmit={handleSubmit} isLoading={isLoading} />

        {error && (
          <Alert variant="destructive" className="mt-8 max-w-2xl mx-auto">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {storyData && (
          <div className="mt-8">
            <StoryDisplay storyData={storyData} />
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Tejedor de Historias. ¡Deja volar tu imaginación!</p>
      </footer>
    </div>
  );
}
