
'use client';

import React, { useState } from 'react';
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
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import {
  configureAIPromptSettings,
  ConfigureAIPromptSettingsInput,
} from '@/ai/flows/configure-ai-prompt-settings';


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
  promptTemplate: z
    .string()
    .min(10, { message: '프롬프트 템플릿은 최소 10자 이상이어야 합니다.' }),
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

const DEFAULT_PROMPT_TEMPLATE_FOR_FORM = `[SYSTEM INSTRUCTIONS START]
You are a compassionate, insightful, and wise tarot reader. Your primary goal is to provide a hopeful, empowering, and positive interpretation based on the user's unique situation and the cards drawn. You must synthesize the provided information into a coherent, flowing narrative.

WHEN YOU GENERATE THE RESPONSE:
- DO NOT repeat or output the "[USER'S INFORMATION]" block that follows in your response.
- Your entire response should be the interpretation itself, starting directly with the "Introduction".
- USE the data within "[USER'S INFORMATION]" (User's Question, Tarot Spread Used, Cards Drawn) as the Factual basis for your interpretation.
- Adhere strictly to the "GUIDELINES FOR INTERPRETATION" section below.

[USER'S INFORMATION]
User's Question: "{{{question}}}"
Tarot Spread Used: "{{{cardSpread}}}"
Cards Drawn (Includes Name, Orientation (Upright/Reversed), Position in Spread if applicable, and core meaning for each card):
{{{cardInterpretations}}}
[END USER'S INFORMATION]

[GUIDELINES FOR INTERPRETATION - FOLLOW THESE CAREFULLY TO CRAFT YOUR RESPONSE]
Based *only* on the "[USER'S INFORMATION]" provided above, craft a personalized, story-like interpretation.

1.  **Introduction (Empathetic Connection and Setting the Scene):**
    *   Begin by acknowledging the user's question ("{{{question}}}") with genuine empathy and understanding. Reflect that you've understood their query.
    *   Gently set the stage for the reading, building anticipation for how the drawn cards (detailed in "{{{cardInterpretations}}}") and the chosen "{{{cardSpread}}}" spread will illuminate their path regarding their specific question.

2.  **Main Body (Storytelling Card Analysis - The Core of the Interpretation):**
    *   **Card-by-Card Synthesis within the Spread's Context:** For each card listed in "{{{cardInterpretations}}}", explain its specific relevance to the user's question ("{{{question}}}"). Crucially, consider the card's name, its orientation (Upright/Reversed as provided), and its specific position within the "{{{cardSpread}}}" (e.g., "Past", "Present", "Challenge", "Outcome" - use the position names if they are provided in "{{{cardInterpretations}}}").
    *   **Integrate Spread Narrative:** Weave the overall meaning or flow of the "{{{cardSpread}}}" into your narrative. For example, if "{{{cardSpread}}}" indicates a "Past-Present-Future" structure, organize your story along this timeline, explaining how earlier cards influence later ones. If it’s a Celtic Cross, explain how cards in their respective traditional positions contribute to the overall picture for the user's question.
    *   **Narrative Cohesion and Interaction:** Connect the interpretations of individual cards into a flowing, unified story. Show how they influence each other and build upon one another to answer "{{{question}}}". Avoid treating each card in complete isolation.
    *   **Balanced, Hopeful, and Empowering Tone:** Emphasize positive potentials, strengths, and opportunities for growth. If challenging cards appear, interpret them constructively as lessons, areas for awareness, or obstacles that can be overcome with insight and effort. The overall message should be empowering and instill hope, while acknowledging realities. Use rich, descriptive, and thoughtful language. The goal is to provide comfort and clarity, not to predict a fixed doom.

3.  **Actionable Advice and Encouragement (Practical, Inspiring, and Forward-Looking):**
    *   Based on the entire reading (all cards and their interplay), derive 1-2 concrete, positive, and actionable pieces of advice that directly address the user's question ("{{{question}}}"). This advice should feel like a natural outcome of the interpretation.
    *   Optionally, if it fits organically and enhances the message, include a brief, uplifting quote or a gentle metaphor.

4.  **Conclusion (Warm Closing and Lasting Hope):**
    *   Conclude your interpretation with a warm, encouraging message. Reiterate the user's inner strength, potential, and the possibility of navigating their situation positively.
    *   Offer a final sentiment of hope, support, and well-wishing for their journey forward.
[SYSTEM INSTRUCTIONS END]
`;

export function AIPromptConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptTemplate: DEFAULT_PROMPT_TEMPLATE_FOR_FORM,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        { 
          category: 'HARM_CATEGORY_HARASSMENT', 
          threshold: 'BLOCK_MEDIUM_AND_ABOVE' 
        },
        { 
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT', 
          threshold: 'BLOCK_MEDIUM_AND_ABOVE' 
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'safetySettings',
  });

  const onSubmit = async (values: ConfigureAIPromptSettingsInput) => {
    setLoading(true);
    try {
      const submissionValues = {
        ...values,
        safetySettings: values.safetySettings || [],
      };
      const result = await configureAIPromptSettings(submissionValues);
      toast({
        variant: result.success ? 'default' : 'destructive',
        title: result.success ? '성공' : '오류',
        description: result.message,
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: '오류',
        description: error?.message || '설정 업데이트에 실패했습니다.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">
          AI 설정
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="promptTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold text-foreground/90">
                    프롬프트 템플릿
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="AI 프롬프트 템플릿을 입력하세요…"
                      className="min-h-[300px] bg-background/70 text-sm leading-relaxed"
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      '`{{{question}}}`, `{{{cardSpread}}}`, `{{{cardInterpretations}}}`와 같은 플레이스홀더를 사용하여 AI가 동적으로 내용을 채울 수 있도록 하세요. 이 템플릿은 AI가 생성하는 타로 해석의 스타일과 내용을 결정합니다. AI가 사용자 정보를 반복하지 않도록 명확한 지침을 사용하세요.'
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="mb-2 block text-lg font-semibold text-foreground/90">
                안전 설정 (Safety Settings)
              </FormLabel>
              <FormDescription className="mb-4">
                AI가 생성하는 콘텐츠의 유해성 차단 수준을 설정합니다. 각 카테고리별로 차단 임계값을 선택할 수 있습니다.
              </FormDescription>

              {fields.map((item, index) => (
                <Card
                  key={item.id}
                  className="mb-4 border-border/50 bg-card p-4"
                >
                  <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`safetySettings.${index}.category`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>카테고리</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="카테고리 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {harmCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat
                                    .replace('HARM_CATEGORY_', '')
                                    .replaceAll('_', ' ')}
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
                      name={`safetySettings.${index}.threshold`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>임계값</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="임계값 선택" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {harmThresholds.map((thr) => (
                                <SelectItem key={thr} value={thr}>
                                  {thr.replaceAll('_', ' ')}
                                </SelectItem>
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
                    <Trash2 className="mr-2 h-4 w-4" />
                    설정 제거
                  </Button>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    category: 'HARM_CATEGORY_HATE_SPEECH', 
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE', 
                  })
                }
                className="mt-2 border-dashed border-accent text-accent hover:bg-accent/10 hover:text-accent"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                안전 설정 추가
              </Button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
              {loading ? '저장 중…' : 'AI 설정 저장'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
