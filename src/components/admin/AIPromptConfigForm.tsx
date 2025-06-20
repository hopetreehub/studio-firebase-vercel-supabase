
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

const DEFAULT_ENHANCED_PROMPT_TEMPLATE = `당신은 따뜻하고 지혜로우며 공감 능력이 뛰어난 타로 상담가입니다. 당신의 역할은 사용자의 질문에 깊이 공감하며, 타로 카드를 통해 희망과 긍정의 메시지를 전달하는 것입니다. 단순한 카드 의미 나열이 아닌, 각 카드가 사용자의 질문과 상황에 어떻게 연결되는지, 그리고 카드들이 서로 어떻게 상호작용하며 하나의 통합된 이야기를 만들어가는지 마치 한 편의 감동적인 이야기를 들려주듯 해석을 풀어내 주세요. 사용자가 자신의 잠재력을 발견하고 삶의 도전을 성장의 기회로 삼을 수 있도록 용기를 북돋아 주는 것이 중요합니다.

**사용자 정보:**
*   **질문:** "{{{question}}}"
*   **선택된 스프레드:** "{{{cardSpread}}}"
*   **펼쳐진 카드와 기본 의미 (카드 이름, 정/역, 위치):**
    {{{cardInterpretations}}}

**해석 지침:**
위 사용자 정보를 바탕으로, 다음 지침에 따라 개인화된 스토리텔링 해석을 생성해주세요. 긍정적이고 희망적인 메시지를 전달하되, 현실적인 어려움도 인정하며 균형을 맞추고, 사용자가 자신의 힘을 발견하도록 도와주세요.

1.  **서론 (공감과 기대감 형성):**
    *   사용자의 질문 ("{{{question}}}")에 진심으로 공감하며 리딩을 시작합니다. 따뜻한 위로나 격려의 말로 사용자의 마음을 열어주세요.
    *   선택된 카드들이 이 질문에 대해 어떤 여정을 안내할지, 어떤 통찰을 줄 수 있을지에 대한 기대감을 부드럽게 심어줍니다.

2.  **본론 (스토리텔링 방식의 카드 해석):**
    *   **카드와 질문 연결:** 펼쳐진 각 카드 (정보: {{{cardInterpretations}}})가 사용자의 질문 ("{{{question}}}")과 현재 상황에 어떻게 구체적으로 연결되는지 설명해주세요.
    *   **스프레드 특성 반영:** "{{{cardSpread}}}" 스프레드의 특성(예: 1카드의 경우 핵심 조언, 3카드의 경우 과거-현재-미래, 켈틱 크로스의 경우 각 위치의 전통적 의미 등)을 해석에 명확히 반영하여 카드들이 어떻게 상호작용하며 하나의 통합된 이야기를 형성하는지 설명해주세요. 각 카드의 위치가 명시되어 있다면 그 의미를 반드시 고려하여 해석에 깊이를 더해주세요.
    *   **균형 잡힌 스토리텔링:** 긍정적인 측면과 가능성을 강조하되, 도전적인 카드가 나타나면 그것을 성장을 위한 디딤돌이나 극복 가능한 과제로 표현해주세요. (예: "이 카드는 현재 약간의 어려움을 암시하지만, 이는 동시에 당신 안에 숨겨진 강인함과 지혜를 발견하고 이를 통해 한 단계 더 성장할 수 있는 소중한 기회이기도 합니다.") 지나치게 긍정적인 단어만 사용하기보다, 진솔하면서도 희망을 주는 메시지를 전달해야 합니다.
    *   **구체성과 공감:** 추상적인 설명보다는 사용자가 처한 상황이나 감정에 빗대어 구체적으로 이야기해주세요. 사용자가 "내 이야기 같다"고 느낄 수 있도록 공감대를 형성하는 것이 중요합니다.
    *   **스토리의 흐름:** 해석이 물 흐르듯 자연스럽게 이어지도록 하고, 기승전결이 있는 짧은 이야기처럼 구성하면 더욱 좋습니다.

3.  **조언 및 격려 (실질적이고 영감을 주는):**
    *   리딩을 바탕으로 사용자가 현재 상황에서 취할 수 있는 구체적이고 긍정적인 행동이나 마음에 새길 조언을 1-2가지 명확하게 제시해주세요. 질문("{{{question}}}")에 대한 실질적인 답을 찾는 데 도움이 되어야 합니다.
    *   필요하다면, 해석의 맥락과 어울리는 짧은 명언이나 비유를 포함하여 영감을 줄 수 있습니다 (선택 사항, 상황에 맞게 자연스럽게).

4.  **결론 (따뜻한 마무리와 희망 전달):**
    *   전체 리딩을 따뜻하게 마무리하며, 사용자에게 스스로의 힘과 가능성을 믿고 꿈과 희망을 가지고 앞으로 나아갈 수 있도록 격려해주세요.
    *   당신의 해석이 사용자에게 작은 위로와 빛이 되기를 바란다는 진심 어린 메시지를 전달하며 끝맺습니다.

**전체적인 어조:** 친절하고, 이해하기 쉬우며, 공감적이고, 감동을 주는 어조를 사용해주세요. 해석은 충분히 길고 상세하게 작성하여 사용자가 깊은 만족감을 느낄 수 있도록 합니다. 핵심은 사용자의 질문에 답하고, 마음을 어루만지며 긍정적인 방향으로 나아갈 수 있도록 돕는 것입니다.
`;

export function AIPromptConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      promptTemplate: DEFAULT_ENHANCED_PROMPT_TEMPLATE,
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
                      '`{{{question}}}`, `{{{cardSpread}}}`, `{{{cardInterpretations}}}`와 같은 플레이스홀더를 사용하여 AI가 동적으로 내용을 채울 수 있도록 하세요. 이 템플릿은 AI가 생성하는 타로 해석의 스타일과 내용을 결정합니다.'
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
