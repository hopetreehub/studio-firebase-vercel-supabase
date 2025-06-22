
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
import { Card } from '@/components/ui/card';
import { Trash2, PlusCircle, Loader2 } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import {
  configureDreamPromptSettings,
  ConfigureDreamPromptSettingsInput,
} from '@/ai/flows/configure-dream-prompt-settings';


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

const DEFAULT_DREAM_PROMPT_TEMPLATE = `[SYSTEM INSTRUCTIONS START]
You are a wise and insightful dream interpreter, drawing upon psychological, symbolic, and spiritual traditions. Your primary goal is to provide a comprehensive, balanced, and empowering interpretation of the user's dream.

YOUR ENTIRE RESPONSE MUST BE IN KOREAN.
YOUR RESPONSE MUST USE MARKDOWN for clear formatting. Use headings (e.g., "## 주요 상징 분석"), bullet points, and bold text to structure the interpretation.

RESPONSE STRUCTURE:
1.  **## 꿈의 핵심 요약 (Core Dream Summary):** Briefly summarize the main events and feelings of the dream.
2.  **## 주요 상징 분석 (Key Symbol Analysis):** Identify the key symbols in the dream (e.g., mountains, jewels, animals) and explain their common psychological and spiritual meanings.
3.  **## 심리적 해석 (Psychological Interpretation):** Interpret the dream from a psychological perspective. What might this dream reflect about the user's current emotional state, subconscious thoughts, challenges, or desires?
4.  **## 종합적인 조언 (Integrative Advice):** Synthesize the analysis into practical, encouraging advice. What message is the subconscious trying to send? How can the user apply this insight to their waking life for growth and self-understanding?

[USER'S DREAM DESCRIPTION]
{{{dreamDescription}}}
[END USER'S DREAM DESCRIPTION]

Now, please provide the interpretation based on the structure above.
[SYSTEM INSTRUCTIONS END]
`;

export function DreamInterpretationConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptTemplate: DEFAULT_DREAM_PROMPT_TEMPLATE,
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

  const onSubmit = async (values: ConfigureDreamPromptSettingsInput) => {
    setLoading(true);
    try {
      const submissionValues = {
        ...values,
        safetySettings: values.safetySettings || [],
      };
      const result = await configureDreamPromptSettings(submissionValues);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="promptTemplate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-foreground/90">
                꿈 해몽 프롬프트 템플릿
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="AI 꿈 해몽 프롬프트 템플릿을 입력하세요…"
                  className="min-h-[300px] bg-background/70 text-sm leading-relaxed"
                />
              </FormControl>
              <FormDescription>
                `{{{dreamDescription}}}` 플레이스홀더를 사용하여 AI가 동적으로 꿈 내용을 채울 수 있도록 하세요.
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
            AI가 생성하는 콘텐츠의 유해성 차단 수준을 설정합니다.
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
          {loading ? '저장 중…' : '꿈 해몽 AI 설정 저장'}
        </Button>
      </form>
    </Form>
  );
}
