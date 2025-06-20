
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Share2, HelpCircle, CalendarDays, BookOpen, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '커뮤니티 - InnerSpell',
  description: 'InnerSpell 타로 커뮤니티에서 타로에 대한 이야기를 나누고, 리딩을 공유하며, 함께 배워가세요. (준비 중)',
};

const plannedFeatures = [
  {
    icon: <MessageSquare className="h-8 w-8 text-accent" />,
    title: "자유 토론",
    description: "타로 카드, 스프레드, 상징, 개인적인 경험 등 다양한 주제에 대해 자유롭게 이야기를 나눌 수 있는 공간입니다."
  },
  {
    icon: <Share2 className="h-8 w-8 text-accent" />,
    title: "리딩 공유 및 피드백",
    description: "자신의 타로 리딩 결과를 익명 또는 공개적으로 공유하고, 다른 사용자들로부터 피드백을 받거나 다른 사람의 리딩에 대한 의견을 나눌 수 있습니다."
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-accent" />,
    title: "질문 & 답변 (Q&A)",
    description: "타로에 대한 궁금증을 질문하고 숙련된 사용자나 운영자로부터 답변을 얻을 수 있습니다. 초보자를 위한 기초 지식부터 심도 있는 질문까지 환영합니다."
  },
  {
    icon: <CalendarDays className="h-8 w-8 text-accent" />,
    title: "온라인 이벤트 및 워크숍",
    description: "정기적 또는 비정기적으로 온라인 타로 스터디 그룹, 특정 주제에 대한 워크숍, 그룹 리딩 이벤트 등을 진행할 예정입니다."
  },
  {
    icon: <BookOpen className="h-8 w-8 text-accent" />,
    title: "학습 가이드 및 자료실",
    description: "타로 카드 의미, 스프레드 방법, 리딩 팁 등 학습에 도움이 되는 가이드와 자료들을 공유합니다."
  }
];

export default function CommunityPage() {
  return (
    <div className="space-y-12">
      <header className="text-center">
        <div className="inline-flex items-center justify-center bg-primary/10 p-4 rounded-full mb-6 shadow-md">
          <MessageSquare className="h-16 w-16 text-primary" />
        </div>
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">InnerSpell 커뮤니티</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로와 영적 성장에 관심 있는 모든 분들을 위한 열린 공간입니다. 함께 배우고, 나누고, 성장해요!
        </p>
        <p className="mt-2 text-md text-accent font-semibold">(현재 페이지는 준비 중입니다. 곧 멋진 모습으로 찾아뵙겠습니다!)</p>
      </header>

      <section>
        <Card className="shadow-xl border-primary/10">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center">
              <Lightbulb className="mr-3 h-8 w-8 text-accent" />
              커뮤니티에서 무엇을 할 수 있을까요?
            </CardTitle>
            <CardDescription>
              InnerSpell 커뮤니티는 다음과 같은 기능들을 통해 여러분의 타로 여정을 더욱 풍요롭게 만들 것입니다.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 pt-6">
            {plannedFeatures.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center text-center p-6 bg-card/50 rounded-lg shadow-lg border border-border/20 hover:shadow-primary/20 transition-shadow duration-300">
                <div className="p-3 bg-accent/10 rounded-full mb-4 border-2 border-accent/30">
                  {feature.icon}
                </div>
                <h3 className="font-headline text-xl text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      <section className="text-center">
        <h2 className="font-headline text-2xl text-primary mb-3">커뮤니티 활성화를 기다리며...</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          본격적인 커뮤니티 기능이 오픈되기 전까지, InnerSpell의 다른 기능들(타로 읽기, 카드 백과사전, 블로그)을 충분히 즐겨주세요! 여러분의 많은 관심과 참여가 커뮤니티를 더욱 빠르게 성장시키는 원동력이 됩니다.
        </p>
      </section>
    </div>
  );
}
