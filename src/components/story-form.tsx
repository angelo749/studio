"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StoryFormSchema, type StoryFormValues, storyLengths, readingLevels } from "@/lib/schema";
import { Loader2, Sparkles, BookOpen, Users, Award, Wand2, Palette, Brain, Scaling, GraduationCap } from "lucide-react";

interface StoryFormProps {
  onSubmit: (values: StoryFormValues) => Promise<void>;
  isLoading: boolean;
}

const storyLengthDisplay: Record<typeof storyLengths[number], string> = {
  short: "Corto",
  medium: "Medio",
  long: "Largo",
};

const readingLevelDisplay: Record<typeof readingLevels[number], string> = {
  easy: "Fácil",
  intermediate: "Intermedio",
  advanced: "Avanzado",
};

export function StoryForm({ onSubmit, isLoading }: StoryFormProps) {
  const form = useForm<StoryFormValues>({
    resolver: zodResolver(StoryFormSchema),
    defaultValues: {
      theme: "",
      characters: "",
      moral: "",
      length: "medium",
      readingLevel: "intermediate",
    },
  });

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center mb-4">
          <Wand2 className="h-12 w-12 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold">Teje Tu Cuento</CardTitle>
        <CardDescription className="text-muted-foreground">
          Completa los detalles a continuación y deja que la IA cree una historia única para ti.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg"><Palette className="h-5 w-5 text-primary" />Tema del Cuento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Aventura en el Bosque Encantado, El Misterio del Juguete Perdido" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="characters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg"><Users className="h-5 w-5 text-primary" />Personajes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ej: Un zorrito valiente llamado Finn, un búho sabio y una ardilla traviesa"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moral"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-lg"><Award className="h-5 w-5 text-primary" />Moraleja del Cuento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: La importancia de la amistad, La honestidad es la mejor política" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg"><Scaling className="h-5 w-5 text-primary" />Extensión del Cuento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la extensión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {storyLengths.map((len) => (
                          <SelectItem key={len} value={len}>
                            {storyLengthDisplay[len]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readingLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-primary" />Nivel de Lectura</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el nivel de lectura" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {readingLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {readingLevelDisplay[level]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full text-lg py-6">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Tejiendo tu cuento...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generar Cuento
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
