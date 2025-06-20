
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather, Tag, ListChecks } from 'lucide-react';
import type { Metadata } from 'next';
import { getAllPosts } from '@/actions/blogActions';
import { format } from 'date-fns';

export const metadata: Metadata = {
  title: '블로그', // Template in layout will append '- InnerSpell'
  description: '타로, 영성, 자아 발견에 대한 최신 기사와 깊이 있는 통찰을 만나보세요. InnerSpell 블로그에서 영감을 얻으세요.',
  openGraph: { // Specific OG for this page
    title: 'InnerSpell 블로그 - 영적 사색과 타로 이야기',
    description: '타로 카드 해석, 영적 성장 팁, 명상 가이드 등 다양한 주제의 글을 탐색하세요.',
  },
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();

  // Dummy data for sidebar - replace with actual data fetching if needed
  const categories = ['타로 해석', '영적 성장', '명상 가이드', '카드 이야기'];
  const recentPosts = posts.slice(0, 3).map(p => ({ title: p.title, slug: p.slug }));
  const popularTags = ['운세', '사랑', '직업', '조언', '치유'];

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">영적 사색</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요. 저희의 글들이 당신의 여정에 영감을 주기를 바랍니다.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Blog Posts Area */}
        <div className="w-full lg:w-2/3 space-y-8">
          {posts.length > 0 ? (
            posts.map((post) => {
              const displayDate = format(new Date(post.date), 'yyyy년 MM월 dd일');
              return (
                <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group border border-transparent hover:border-primary/30">
                  <Link href={`/blog/${post.slug}`} className="block md:flex md:flex-row h-full">
                    {/* Image Section */}
                    <div className="w-full md:w-1/3 lg:w-2/5 shrink-0 relative aspect-video md:aspect-auto overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
                      {post.imageSrc && (
                        <Image
                          src={post.imageSrc}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          data-ai-hint={post.dataAiHint}
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 40vw"
                        />
                      )}
                    </div>
                    {/* Content Section */}
                    <div className="w-full md:w-2/3 lg:w-3/5 p-4 sm:p-5 flex flex-col">
                      <CardHeader className="p-0 pb-2">
                        <CardTitle className="font-headline text-xl lg:text-2xl text-primary group-hover:text-accent transition-colors line-clamp-2">{post.title}</CardTitle>
                        <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
                          <CalendarDays className="h-4 w-4 mr-1.5" /> {displayDate}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 mt-2 flex-grow">
                        <p className="text-foreground/70 line-clamp-3 sm:line-clamp-4">{post.excerpt}</p>
                      </CardContent>
                      <CardFooter className="p-0 mt-3 pt-3 border-t border-border/10">
                        <Button variant="link" asChild className="text-accent p-0 hover:text-accent/80 text-sm">
                          <span>더 읽어보기 &rarr;</span>
                        </Button>
                      </CardFooter>
                    </div>
                  </Link>
                </Card>
              );
            })
          ) : (
            <p className="text-center text-muted-foreground py-10 text-lg">
              아직 게시된 글이 없습니다. 곧 흥미로운 내용으로 찾아뵙겠습니다!
            </p>
          )}
        </div>

        {/* Sidebar Area */}
        <aside className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-20 self-start">
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><ListChecks className="mr-2 h-5 w-5"/>카테고리</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {categories.map(category => (
                  <li key={category}>
                    <Link href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-muted-foreground hover:text-primary transition-colors">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">최근 게시물</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {recentPosts.map(post => (
                  <li key={post.slug}>
                    <Link href={`/blog/${post.slug}`} className="text-muted-foreground hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card className="shadow-md border-primary/10">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary flex items-center"><Tag className="mr-2 h-5 w-5"/>인기 태그</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}>
                  <Button variant="outline" size="sm" className="text-xs bg-accent/5 border-accent/20 text-accent hover:bg-accent/10">
                    #{tag}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
