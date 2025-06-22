
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateDreamInterpretation } from '@/ai/flows/generate-dream-interpretation';
import { Sparkles, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';

export function DreamInterpretationClient() {
  const [dreamDescription, setDreamDescription] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGetInterpretation = async () => {
    if (!dreamDescription.trim()) {
      toast({
        variant: 'destructive',
        title: '입력 필요',
        description: '해석을 받기 전에 꿈 내용을 입력해주세요.',
      });
      return;
    }
    setIsLoading(true);
    setInterpretation('');

    try {
      const result = await generateDreamInterpretation({ dreamDescription });
      setInterpretation(result.interpretation);
    } catch (error) {
      console.error('꿈 해석 생성 오류:', error);
      toast({
        variant: 'destructive',
        title: '해석 오류',
        description: 'AI 꿈 해석을 생성하는 데 실패했습니다. 잠시 후 다시 시도해주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">
            꿈 이야기
          </CardTitle>
          <CardDescription>
            기억나는 대로 꿈의 내용을 자세하게 적어주세요.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dream-description" className="text-lg font-semibold text-foreground/90">
              어떤 꿈을 꾸셨나요?
            </Label>
            <Textarea
              id="dream-description"
              placeholder="예: 높은 산을 오르다가 정상에서 빛나는 보석을 발견했어요..."
              value={dreamDescription}
              onChange={(e) => setDreamDescription(e.target.value)}
              className="min-h-[200px] bg-background/70 text-base"
              disabled={isLoading}
            />
          </div>
          <Button onClick={handleGetInterpretation} disabled={isLoading || !dreamDescription} size="lg" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-5 w-5" />
            )}
            {isLoading ? '해몽 중...' : 'AI 꿈 해몽 받기'}
          </Button>
        </CardContent>
      </Card>

      {(isLoading || interpretation) && (
        <Card className="mt-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-accent" />
              AI 꿈 해몽 결과
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !interpretation && (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-10 w-10 animate-spin text-accent" />
                <p className="ml-3 text-muted-foreground">AI가 당신의 꿈을 분석하고 있습니다...</p>
              </div>
            )}
            {interpretation && (
              <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:text-accent prose-p:text-foreground/90 prose-strong:text-primary/90 leading-relaxed">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
