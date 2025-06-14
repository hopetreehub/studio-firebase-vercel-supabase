
import { AIPromptConfigForm } from '@/components/admin/AIPromptConfigForm';
import type { Metadata } from 'next';
import { ShieldCheck, Cog } from 'lucide-react';

export const metadata: Metadata = {
  title: '관리자: AI 프롬프트 설정 - InnerSpell',
  description: '타로 해석을 위한 AI 프롬프트 설정을 구성합니다.',
};

export default function AdminAIPromptConfigPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <header className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
         <Cog className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">AI 프롬프트 설정</h1>
        <p className="mt-2 text-lg text-foreground/80">
          타로 해석 생성을 위한 AI의 프롬프트 템플릿 및 안전 설정을 관리하고 업데이트합니다.
        </p>
      </header>
      <AIPromptConfigForm />
    </div>
  );
}
