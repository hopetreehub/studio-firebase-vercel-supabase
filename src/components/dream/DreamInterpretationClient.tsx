
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateDreamInterpretation } from '@/ai/flows/generate-dream-interpretation';
import { Sparkles, Loader2, Info, MessageSquare, Brain, Heart, Palette, User, Building, Wind, Calendar, Eye, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const dreamQuestions = [
  { id: 'q1', name: 'start', label: '꿈은 어떻게 시작되었나요?', placeholder: '장소, 시간, 처음 등장한 장면 등을 구체적으로 묘사해주세요.', icon: <Calendar className="mr-2 h-4 w-4" /> },
  { id: 'q2', name: 'characters', label: '꿈속에서 만난 인물들은 누구였으며, 현실에서 어떤 관계인가요?', placeholder: '인물의 외형, 역할, 행동을 포함하여 구체적으로 작성해주세요.', icon: <User className="mr-2 h-4 w-4" /> },
  { id: 'q3', name: 'events', label: '꿈의 중반부에서 어떤 사건이나 변화가 일어났나요?', placeholder: '꿈의 흐름에 영향을 준 사건을 설명해주세요.', icon: <Wind className="mr-2 h-4 w-4" /> },
  { id: 'q4', name: 'atmosphere', label: '꿈의 분위기나 배경은 어떤 느낌이었나요?', placeholder: '예: 어둡다, 따뜻하다, 혼란스럽다 등', icon: <Palette className="mr-2 h-4 w-4" /> },
  { id: 'q5', name: 'emotions', label: '꿈을 꾸는 동안 어떤 감정을 가장 강하게 느꼈나요?', placeholder: '그 감정은 어떤 상황에서 나타났나요?', icon: <Heart className="mr-2 h-4 w-4" /> },
  { id: 'q6', name: 'actions', label: '꿈 속에서 당신이 한 행동 중 인상 깊었던 장면은 무엇이었나요?', placeholder: '왜 그렇게 행동했는지 이유를 포함해서 설명해주세요.', icon: <Eye className="mr-2 h-4 w-4" /> },
  { id: 'q7', name: 'recurrence', label: '이 꿈을 이전에도 비슷하게 꾼 적이 있나요?', placeholder: '있다면 어떤 점이 유사했나요?', icon: <HelpCircle className="mr-2 h-4 w-4" /> },
  { id: 'q8', name: 'ending', label: '꿈이 끝날 때 어떤 장면이 있었고, 당신은 어떤 기분이었나요?', placeholder: '마지막 장면과 그때의 감정을 묘사해주세요.', icon: <MessageSquare className="mr-2 h-4 w-4" /> },
  { id: 'q9', name: 'symbols', label: '꿈 속 특정 인물이나 사물이 상징적으로 느껴졌나요?', placeholder: '예: 동물, 탈 것, 건물 등. 그것이 무엇을 의미한다고 생각하나요?', icon: <Building className="mr-2 h-4 w-4" /> },
  { id: 'q10', name: 'connection', label: '이 꿈이 당신의 현실 생활과 어떤 관련이 있다고 느끼나요?', placeholder: '최근 일, 고민, 관계 등을 연결지어 설명해주세요.', icon: <Brain className="mr-2 h-4 w-4" /> },
];

type QuestionnaireFormData = Record<typeof dreamQuestions[number]['name'], string>;

export function DreamInterpretationClient() {
  const { user } = useAuth();
  const [step, setStep] = useState<'initial' | 'questions'>('initial');
  const [initialDescription, setInitialDescription] = useState<string>('');
  const [interpretation, setInterpretation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const form = useForm<QuestionnaireFormData>();

  const handleNextStep = () => {
    if (!initialDescription.trim()) {
      toast({
        variant: 'destructive',
        title: '입력 필요',
        description: '해석을 받기 전에 꿈 내용을 먼저 입력해주세요.',
      });
      return;
    }
    setStep('questions');
  };

  const handleGetInterpretation: SubmitHandler<QuestionnaireFormData> = async (data) => {
    setIsLoading(true);
    setInterpretation('');

    const questionnaireAnswers = dreamQuestions
      .map(q => {
        const answer = data[q.name as keyof QuestionnaireFormData];
        return answer ? `질문: ${q.label}\n답변: ${answer}\n` : '';
      })
      .filter(Boolean)
      .join('\n');

    try {
      const result = await generateDreamInterpretation({ 
        dreamDescription: initialDescription,
        questionnaireAnswers: questionnaireAnswers || undefined, // Send only if there are answers
        sajuInfo: user?.sajuInfo,
      });
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

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-accent" />
            AI 꿈 해몽 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="ml-3 text-muted-foreground">AI가 당신의 꿈을 분석하고 있습니다...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (interpretation) {
     return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <Sparkles className="mr-2 h-6 w-6 text-accent" />
            AI 꿈 해몽 결과
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:text-accent prose-p:text-foreground/90 prose-strong:text-primary/90 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{interpretation}</ReactMarkdown>
          </div>
          <Button onClick={() => { setInterpretation(''); setStep('initial'); setInitialDescription(''); form.reset(); }} className="mt-8">
            새로운 꿈 해몽하기
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {step === 'initial' && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">1단계: 꿈 이야기</CardTitle>
            <CardDescription>기억나는 대로 꿈의 내용을 자세하게 적어주세요. 전체적인 그림을 그리는 단계입니다.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dream-description" className="text-lg font-semibold text-foreground/90">어떤 꿈을 꾸셨나요?</Label>
              <Textarea
                id="dream-description"
                placeholder="예: 높은 산을 오르다가 정상에서 빛나는 보석을 발견했어요..."
                value={initialDescription}
                onChange={(e) => setInitialDescription(e.target.value)}
                className="min-h-[200px] bg-background/70 text-base"
                disabled={isLoading}
              />
            </div>
            <Button onClick={handleNextStep} size="lg" className="w-full sm:w-auto">
              다음 단계로
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'questions' && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary">2단계: 세부 질문</CardTitle>
            <CardDescription>더 깊이 있는 해석을 위해 아래 질문에 답해주세요. 답변하고 싶은 항목만 작성하시면 됩니다.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleGetInterpretation)} className="space-y-6">
                {dreamQuestions.map((q) => (
                  <FormField
                    key={q.id}
                    control={form.control}
                    name={q.name as keyof QuestionnaireFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-md font-semibold">{q.icon} {q.label}</FormLabel>
                        <FormControl>
                          <Textarea placeholder={q.placeholder} {...field} className="bg-background/70" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                
                {user?.sajuInfo && (
                  <div className="flex items-start rounded-md border border-primary/20 bg-primary/5 p-3 text-sm text-primary/80">
                    <Info className="mr-2.5 mt-0.5 h-4 w-4 shrink-0" />
                    <p>프로필에 저장된 사주 정보를 바탕으로 더 개인화된 해석을 제공합니다.</p>
                  </div>
                )}
                {!user?.sajuInfo && user && (
                  <div className="flex items-start rounded-md border border-accent/20 bg-accent/5 p-3 text-sm text-accent/80">
                    <Info className="mr-2.5 mt-0.5 h-4 w-4 shrink-0" />
                    <p>
                      더 깊이 있는 해석을 원하시나요?{' '}
                      <Link href="/profile" className="font-semibold underline hover:text-accent">프로필</Link>
                      에 사주 정보를 추가해보세요.
                    </p>
                  </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep('initial')}>이전 단계로</Button>
                  <Button type="submit" size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Sparkles className="mr-2 h-5 w-5" />
                    AI 꿈 해몽 받기
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
