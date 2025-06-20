
'use client'; // Changed to client component for pagination state

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, Feather, Tag, ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';
// Removed Metadata import as it's less common in client components
// import type { Metadata } from 'next';
import { getAllPosts } from '@/actions/blogActions';
import { format } from 'date-fns';
import type { BlogPost } from '@/types';
import { Spinner } from '@/components/ui/spinner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';


// export const metadata: Metadata = { // Metadata is usually set in Server Components or layout files
//   title: '블로그',
//   description: '타로, 영성, 자아 발견에 대한 최신 기사와 깊이 있는 통찰을 만나보세요. InnerSpell 블로그에서 영감을 얻으세요.',
//   openGraph: {
//     title: 'InnerSpell 블로그 - 영적 사색과 타로 이야기',
//     description: '타로 카드 해석, 영적 성장 팁, 명상 가이드 등 다양한 주제의 글을 탐색하세요.',
//   },
// };

// export const revalidate = 60; // Revalidation strategy for Server Components

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15];

export default function BlogPage() {
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(ITEMS_PER_PAGE_OPTIONS[0]);

  // Dummy data for sidebar - replace with actual data fetching if needed
  const categories = ['타로 해석', '영적 성장', '명상 가이드', '카드 이야기'];
  const popularTags = ['운세', '사랑', '직업', '조언', '치유'];
  const [recentPosts, setRecentPosts] = useState<{title: string, slug: string}[]>([]);


  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      setError(null);
      try {
        const posts = await getAllPosts();
        setAllPosts(posts);
        setRecentPosts(posts.slice(0, 3).map(p => ({ title: p.title, slug: p.slug })));
      } catch (err: any) {
        console.error("Failed to fetch blog posts:", err);
        setError('블로그 게시물을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleItemsPerPageChange = (value: string) => {
    if (value === 'all') {
      setItemsPerPage('all');
    } else {
      setItemsPerPage(parseInt(value, 10));
    }
    setCurrentPage(1);
  };

  const postsToDisplay = itemsPerPage === 'all' 
    ? allPosts 
    : allPosts.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));
  
  const totalPages = itemsPerPage === 'all' ? 1 : Math.ceil(allPosts.length / (itemsPerPage as number));

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-400px)]">
        <Spinner size="large" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-destructive py-10 text-lg">{error}</p>;
  }

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
          {/* Pagination Controls Top */}
           {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 p-4 bg-card border border-border rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <Label htmlFor="items-per-page-select-blog" className="text-sm font-medium text-muted-foreground">페이지당 글 수:</Label>
                <Select
                  value={itemsPerPage.toString()}
                  onValueChange={handleItemsPerPageChange}
                >
                  <SelectTrigger id="items-per-page-select-blog" className="w-[120px] h-9 text-sm">
                    <SelectValue placeholder="선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {ITEMS_PER_PAGE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option.toString()}>{option}개</SelectItem>
                    ))}
                    <SelectItem value="all">모두 보기</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">이전</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages} 페이지
                </span>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <span className="mr-1">다음</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {postsToDisplay.length > 0 ? (
            postsToDisplay.map((post) => {
              const displayDate = format(new Date(post.date), 'yyyy년 MM월 dd일');
              return (
                <Card key={post.id} className="overflow-hidden shadow-lg hover:shadow-primary/20 transition-shadow duration-300 group border border-transparent hover:border-primary/30">
                  <Link href={`/blog/${post.slug}`} className="block md:flex md:flex-row h-full">
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
           {/* Pagination Controls Bottom */}
          {itemsPerPage !== 'all' && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
                <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="ml-1">이전</span>
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages} 페이지
                </span>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>
                  <span className="mr-1">다음</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
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
