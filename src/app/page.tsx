
import { HeroSection } from '@/components/home/HeroSection';
import { NewsletterSignup } from '@/components/home/NewsletterSignup';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, Compass, BookOpen } from 'lucide-react';

const features = [
  {
    icon: <Star className="w-8 h-8 text-accent" />,
    title: "AI 기반 통찰",
    description: "당신의 특별한 질문에 맞춰 고급 AI가 생성하는 개인 맞춤형 타로 해석을 받아보세요.",
    dataAiHint: "AI technology"
  },
  {
    icon: <Compass className="w-8 h-8 text-accent" />,
    title: "당신의 길 탐색",
    description: "1카드, 3카드 또는 사용자 정의 배열과 같은 다양한 스프레드 중에서 선택하여 삶의 특정 영역을 탐구하세요.",
    dataAiHint: "tarot spread"
  },
  {
    icon: <BookOpen className="w-8 h-8 text-accent" />,
    title: "타로 백과사전",
    description: "카드 의미, 키워드 및 상징에 대한 포괄적인 가이드로 타로에 대한 이해를 넓혀보세요.",
    dataAiHint: "ancient book"
  }
];


export default function HomePage() {
  return (
    <div className="space-y-16 sm:space-y-24">
      <HeroSection />
      
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl sm:text-4xl font-semibold text-primary">왜 InnerSpell을 선택해야 할까요?</h2>
            <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
              고대의 지혜와 현대 기술을 결합하여 독특하고 통찰력 있는 타로 경험을 제공합니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm border-primary/10 animate-slide-up" style={{animationDelay: `${index * 0.15}s`}}>
                <CardHeader className="items-center text-center">
                  <div className="p-4 bg-accent/10 rounded-full mb-4 inline-block">
                    {feature.icon}
                  </div>
                  <CardTitle className="font-headline text-2xl text-primary">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-foreground/70">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Separator className="my-8 bg-primary/20" />
      <NewsletterSignup />
    </div>
  );
}
