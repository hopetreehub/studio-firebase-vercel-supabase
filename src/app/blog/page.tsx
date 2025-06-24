
import { getAllPosts } from '@/actions/blogActions';
import { Feather, ListChecks, Tag } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlogList } from '@/components/blog/BlogList';
import type { Metadata } from 'next';
import { AdBanner } from '@/components/ads/AdBanner';

export const metadata: Metadata = {
  title: '영적 사색 - 블로그',
  description: '타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요. 저희의 글들이 당신의 여정에 영감을 주기를 바랍니다.',
};

// Revalidate this page every hour
export const revalidate = 3600;

export default async function BlogPage() {
  // Fetch data on the server
  const allPosts = await getAllPosts();
  // Ensure posts are sorted for consistency
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Data for the sidebar
  const categories = ['타로 해석', '영적 성장', '명상 가이드', '카드 이야기'];
  const popularTags = ['운세', '사랑', '직업', '조언', '치유'];
  const recentPosts = sortedPosts.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }));

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
        <div className="w-full lg:w-2/3">
          {/* Client component for interactive list, pass posts as props */}
          <BlogList initialPosts={sortedPosts} />
        </div>

        {/* Sidebar remains part of the server component */}
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
          <AdBanner />
        </aside>
      </div>
    </div>
  );
}
