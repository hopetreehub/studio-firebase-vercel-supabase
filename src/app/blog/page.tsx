
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '블로그 - InnerSpell',
  description: '타로, 영성, 자아 발견에 대한 기사와 통찰.',
};

const blogPosts = [
  {
    id: '1',
    title: '타로 리딩 초보자 가이드',
    date: '2023년 10월 26일',
    excerpt: '타로가 처음이신가요? 이 가이드는 첫 덱 선택부터 카드 의미 이해까지 타로 리딩의 기초를 안내합니다.',
    imageSrc: 'https://placehold.co/600x400.png', // 실제 이미지 경로로 교체하세요.
    dataAiHint: 'tarot cards guide',
    slug: '/blog/beginners-guide-to-tarot',
  },
  {
    id: '2',
    title: '메이저 아르카나 이해하기: 원형의 여정',
    date: '2023년 11월 5일',
    excerpt: '메이저 아르카나에 깊이 빠져들어 우리 삶의 여정을 안내하는 강력한 원형 에너지를 탐험하세요.',
    imageSrc: 'https://placehold.co/600x400.png', // 실제 이미지 경로로 교체하세요.
    dataAiHint: 'major arcana',
    slug: '/blog/major-arcana-journey',
  },
  {
    id: '3',
    title: 'AI는 어떻게 타로 리딩을 혁신하고 있는가',
    date: '2023년 11월 15일',
    excerpt: '고대 지혜와 현대 기술의 교차점을 탐험하세요. AI는 타로에 대한 우리의 이해와 경험을 어떻게 향상시킬 수 있을까요?',
    imageSrc: 'https://placehold.co/600x400.png', // 실제 이미지 경로로 교체하세요.
    dataAiHint: 'AI tarot',
    slug: '/blog/ai-tarot-revolution',
  },
];

export default function BlogPage() {
  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">영적 사색</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group">
            <Link href={post.slug} className="block">
              <div className="aspect-video relative overflow-hidden">
                <Image
                  src={post.imageSrc}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  data-ai-hint={post.dataAiHint}
                />
              </div>
            </Link>
            <CardHeader>
              <Link href={post.slug}>
                <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{post.title}</CardTitle>
              </Link>
              <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                <CalendarDays className="h-4 w-4 mr-1.5" /> {post.date}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-foreground/70 line-clamp-3">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" asChild className="text-accent p-0">
                <Link href={post.slug}>더 읽어보기 &rarr;</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
