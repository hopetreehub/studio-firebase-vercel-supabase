'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  configureDreamPromptSettings,
  ConfigureDreamPromptSettingsInput,
} from '@/ai/flows/configure-dream-prompt-settings';

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
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_DREAM_PROMPT_TEMPLATE);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (promptTemplate.length < 10) {
      toast({
        variant: 'destructive',
        title: '오류',
        description: '프롬프트 템플릿은 최소 10자 이상이어야 합니다.',
      });
      setLoading(false);
      return;
    }

    try {
      const values: ConfigureDreamPromptSettingsInput = { promptTemplate };
      const result = await configureDreamPromptSettings(values);
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
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-2">
        <label
          htmlFor="dream-prompt-template"
          className="text-lg font-semibold text-foreground/90"
        >
          꿈 해몽 프롬프트 템플릿
        </label>
        <Textarea
          id="dream-prompt-template"
          value={promptTemplate}
          onChange={(e) => setPromptTemplate(e.target.value)}
          placeholder="AI 꿈 해몽 프롬프트 템플릿을 입력하세요…"
          className="min-h-[300px] bg-background/70 text-sm leading-relaxed"
        />
        <p className="text-sm text-muted-foreground">
          `{{{dreamDescription}}}` 플레이스홀더를 사용하여 AI가 동적으로 꿈 내용을 채울 수 있도록 하세요.
        </p>
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
  );
}
