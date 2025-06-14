'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { configureAIPromptSettings, ConfigureAIPromptSettingsInput } from '@/ai/flows/configure-ai-prompt-settings';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';

const safetySettingSchema = z.object({
  category: z.enum([
    'HARM_CATEGORY_HATE_SPEECH',
    'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    'HARM_CATEGORY_HARASSMENT',
    'HARM_CATEGORY_DANGEROUS_CONTENT',
    'HARM_CATEGORY_CIVIC_INTEGRITY',
  ]),
  threshold: z.enum([
    'BLOCK_LOW_AND_ABOVE',
    'BLOCK_MEDIUM_AND_ABOVE',
    'BLOCK_ONLY_HIGH',
    'BLOCK_NONE',
  ]),
});

const formSchema = z.object({
  promptTemplate: z.string().min(10, { message: 'Prompt template must be at least 10 characters.' }),
  safetySettings: z.array(safetySettingSchema).optional(),
});

const harmCategories = [
  'HARM_CATEGORY_HATE_SPEECH',
  'HARM_CATEGORY_SEXUALLY_EXPLICIT',
  'HARM_CATEGORY_HARASSMENT',
  'HARM_CATEGORY_DANGEROUS_CONTENT',
  'HARM_CATEGORY_CIVIC_INTEGRITY',
] as const;

const harmThresholds = [
  'BLOCK_LOW_AND_ABOVE',
  'BLOCK_MEDIUM_AND_ABOVE',
  'BLOCK_ONLY_HIGH',
  'BLOCK_NONE',
] as const;


export function AIPromptConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptTemplate: `You are a tarot card expert. Provide an insightful interpretation of the card spread in relation to the user's question.

Question: {{{question}}}
Card Spread: {{{cardSpread}}}
Card Interpretations: {{{cardInterpretations}}}

Interpretation: `,
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "safetySettings"
  });

  const onSubmit = async (values: ConfigureAIPromptSettingsInput) => {
    setLoading(true);
    try {
      // In a real app, you'd check if the user is an admin here.
      // For now, we proceed.
      const result = await configureAIPromptSettings(values);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Error', description: error.message || 'Failed to update settings.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">AI Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="promptTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground/90">Prompt Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the AI prompt template..."
                      className="min-h-[200px] text-sm bg-background/70 border-input focus:border-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Use placeholders like `{{{question}}}`, `{{{cardSpread}}}`, `{{{cardInterpretations}}}`.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="text-lg font-semibold text-foreground/90 block mb-2">Safety Settings</FormLabel>
              {fields.map((item, index) => (
                <Card key={item.id} className="mb-4 p-4 bg-card border-border/50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`safetySettings.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {harmCategories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat.replace('HARM_CATEGORY_', '').replace('_', ' ')}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`safetySettings.${index}.threshold`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Threshold</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a threshold" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {harmThresholds.map(thr => (
                                <SelectItem key={thr} value={thr}>{thr.replace('_', ' ')}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                   <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => remove(index)}
                      className="mt-4"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> Remove Setting
                    </Button>
                </Card>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' })}
                className="mt-2 border-dashed border-accent text-accent hover:bg-accent/10 hover:text-accent"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Safety Setting
              </Button>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3" disabled={loading}>
              {loading ? 'Saving Settings...' : 'Save AI Settings'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
