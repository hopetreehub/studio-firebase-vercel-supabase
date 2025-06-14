import { AIPromptConfigForm } from '@/components/admin/AIPromptConfigForm';
import type { Metadata } from 'next';
import { ShieldCheck, Cog } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Admin: AI Prompt Configuration - MysticSight Tarot',
  description: 'Configure AI prompt settings for tarot interpretations.',
};

export default function AdminAIPromptConfigPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
       <header className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-3 rounded-full mb-4">
         <Cog className="h-12 w-12 text-primary" />
        </div>
        <h1 className="font-headline text-4xl font-bold text-primary">AI Prompt Configuration</h1>
        <p className="mt-2 text-lg text-foreground/80">
          Manage and update the AI's prompt template and safety settings for generating tarot interpretations.
        </p>
      </header>
      <AIPromptConfigForm />
    </div>
  );
}
