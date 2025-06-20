
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/actions/blogActions'; // Import from actions
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: '블로그 - InnerSpell',
  description: '타로, 영성, 자아 발견에 대한 최신 기사와 깊이 있는 통찰을 만나보세요. InnerSpell 블로그에서 영감을 얻으세요.',
  openGraph: {
    title: 'InnerSpell 블로그 - 영적 사색과 타로 이야기',
    description: '타로 카드 해석, 영적 성장 팁, 명상 가이드 등 다양한 주제의 글을 탐색하세요.',
    // images: (Can be set if there's a generic blog OG image)
  },
};

// Revalidate this page every 60 seconds (or choose a suitable interval)
export const revalidate = 60; 

export default async function BlogPage() { 
  const posts = await getAllPosts(); 

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">영적 사색</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요. 저희의 글들이 당신의 여정에 영감을 주기를 바랍니다.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => {
            const displayDate = format(new Date(post.date), 'yyyy년 MM월 dd일');
            return (
              <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group border border-transparent hover:border-primary/30">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    {post.imageSrc && (
                      <Image
                        src={post.imageSrc}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        data-ai-hint={post.dataAiHint}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                  </div>
                </Link>
                <CardHeader>
                  <Link href={`/blog/${post.slug}`}>
                    <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{post.title}</CardTitle>
                  </Link>
                  <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                    <CalendarDays className="h-4 w-4 mr-1.5" /> {displayDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-foreground/70 line-clamp-3">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80">
                    <Link href={`/blog/${post.slug}`}>더 읽어보기 &rarr;</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-muted-foreground py-10 text-lg">
          아직 게시된 글이 없습니다. 곧 흥미로운 내용으로 찾아뵙겠습니다!
        </p>
      )}
    </div>
  );
}
