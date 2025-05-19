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
        <CardTitle className="text-3xl font-bold">Weave Your Tale</CardTitle>
        <CardDescription className="text-muted-foreground">
          Fill in the details below and let AI craft a unique story for you!
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
                  <FormLabel className="flex items-center gap-2 text-lg"><Palette className="h-5 w-5 text-primary" />Story Theme</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Adventure in the Enchanted Forest, The Mystery of the Missing Toy" {...field} />
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
                  <FormLabel className="flex items-center gap-2 text-lg"><Users className="h-5 w-5 text-primary" />Characters</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., A brave little fox named Finn, a wise old owl, and a mischievous squirrel"
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
                  <FormLabel className="flex items-center gap-2 text-lg"><Award className="h-5 w-5 text-primary" />Moral of the Story</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., The importance of friendship, Honesty is the best policy" {...field} />
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
                    <FormLabel className="flex items-center gap-2 text-lg"><Scaling className="h-5 w-5 text-primary" />Story Length</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select story length" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {storyLengths.map((len) => (
                          <SelectItem key={len} value={len} className="capitalize">
                            {len.charAt(0).toUpperCase() + len.slice(1)}
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
                    <FormLabel className="flex items-center gap-2 text-lg"><GraduationCap className="h-5 w-5 text-primary" />Reading Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reading level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {readingLevels.map((level) => (
                          <SelectItem key={level} value={level} className="capitalize">
                            {level.charAt(0).toUpperCase() + level.slice(1)}
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
                  Weaving your story...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Story
                </>
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
