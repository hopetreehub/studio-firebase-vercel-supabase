
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

const DEFAULT_PROMPT = `You are a dream interpreter. The user's dream is: {{{dreamDescription}}}`;

export function DreamInterpretationConfigForm() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [promptTemplate, setPromptTemplate] = useState(DEFAULT_PROMPT);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (promptTemplate.trim().length < 10) {
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
          &#96;{{{dreamDescription}}}&#96; 플레이스홀더를 사용하여 AI가 동적으로 꿈 내용을 채울 수 있도록 하세요.
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
