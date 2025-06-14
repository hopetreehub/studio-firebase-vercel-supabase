
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
import { Trash2, PlusCircle } from 'lucide-react';

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

export function AIPromptConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptTemplate: `당신은 타로 카드 전문가입니다. 사용자의 질문과 관련된 카드 스프레드에 대한 통찰력 있는 해석을 제공해주세요.

질문: {{{question}}}
카드 스프레드: {{{cardSpread}}}
카드 해석: {{{cardInterpretations}}}

해석: `,
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_MEDIUM_AND_ABOVE',
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
      const result = await configureAIPromptSettings(values);
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
                      className="min-h-[200px] bg-background/70 text-sm"
                    />
                  </FormControl>
                  <FormDescription>
                    {
                      '`{{{question}}}`, `{{{cardSpread}}}`, `{{{cardInterpretations}}}`와 같은 플레이스홀더를 사용하세요.'
                    }
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel className="mb-2 block text-lg font-semibold text-foreground/90">
                안전 설정
              </FormLabel>

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
              {loading ? '저장 중…' : 'AI 설정 저장'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
