
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/blog-data'; // Import from new location

export const metadata: Metadata = {
  title: '블로그 - InnerSpell',
  description: '타로, 영성, 자아 발견에 대한 기사와 통찰.',
};

export default function BlogPage() {
  const posts = getAllPosts();

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
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group">
            <Link href={`/blog/${post.slug}`} className="block">
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
              <Link href={`/blog/${post.slug}`}>
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
                <Link href={`/blog/${post.slug}`}>더 읽어보기 &rarr;</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
