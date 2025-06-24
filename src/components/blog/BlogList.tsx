
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { CalendarDays, ChevronLeft, ChevronRight, ListChecks, Tag } from 'lucide-react';
import { format } from 'date-fns';
import type { BlogPost } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { AdBanner } from '@/components/ads/AdBanner';


const ITEMS_PER_PAGE_OPTIONS = [5, 10, 15];

interface BlogListProps {
  initialPosts: BlogPost[];
  sidebarData: {
      categories: string[];
      popularTags: string[];
      recentPosts: { title: string, slug: string }[];
  }
}

function PostList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10 text-lg">
        표시할 게시물이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post) => {
        const displayDate = post.date ? format(new Date(post.date), 'yyyy년 MM월 dd일') : '날짜 없음';
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
      })}
    </div>
  );
}


export function BlogList({ initialPosts, sidebarData }: BlogListProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(ITEMS_PER_PAGE_OPTIONS[0]);

    const handleItemsPerPageChange = (value: string) => {
        setItemsPerPage(value === 'all' ? 'all' : parseInt(value, 10));
        setCurrentPage(1);
    };
    
    const postsToDisplay = itemsPerPage === 'all' 
        ? initialPosts 
        : initialPosts.slice((currentPage - 1) * (itemsPerPage as number), currentPage * (itemsPerPage as number));
    
    const totalPages = itemsPerPage === 'all' ? 1 : (initialPosts.length > 0 && typeof itemsPerPage === 'number' ? Math.ceil(initialPosts.length / itemsPerPage) : 1);

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="mt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-y py-4 mb-8">
                <div className="flex items-center gap-2">
                    <Label htmlFor="items-per-page-select-blog" className="text-sm font-medium text-muted-foreground">페이지당 글 수:</Label>
                    <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                        <SelectTrigger id="items-per-page-select-blog" className="w-[120px] h-9 text-sm"><SelectValue placeholder="선택" /></SelectTrigger>
                        <SelectContent>
                            {ITEMS_PER_PAGE_OPTIONS.map(option => <SelectItem key={option} value={option.toString()}>{option}개</SelectItem>)}
                            <SelectItem value="all">모두 보기</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {totalPages > 1 && (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /><span className="ml-1">이전</span></Button>
                        <span className="text-sm text-muted-foreground">{currentPage} / {totalPages} 페이지</span>
                        <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}><span className="mr-1">다음</span><ChevronRight className="h-4 w-4" /></Button>
                    </div>
                )}
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="w-full lg:w-2/3">
                    <PostList posts={postsToDisplay} />
                </div>
                <aside className="w-full lg:w-1/3 space-y-6 lg:sticky lg:top-20 self-start">
                    <Card className="shadow-md border-primary/10">
                        <CardHeader><CardTitle className="font-headline text-xl text-primary flex items-center"><ListChecks className="mr-2 h-5 w-5"/>카테고리</CardTitle></CardHeader>
                        <CardContent><ul className="space-y-2">{sidebarData.categories.map(category => (<li key={category}><Link href={`/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}`} className="text-muted-foreground hover:text-primary transition-colors">{category}</Link></li>))}</ul></CardContent>
                    </Card>
                    <Card className="shadow-md border-primary/10">
                        <CardHeader><CardTitle className="font-headline text-xl text-primary">최근 게시물</CardTitle></CardHeader>
                        <CardContent><ul className="space-y-3">{sidebarData.recentPosts.map(post => (<li key={post.slug}><Link href={`/blog/${post.slug}`} className="text-muted-foreground hover:text-primary transition-colors line-clamp-2">{post.title}</Link></li>))}</ul></CardContent>
                    </Card>
                    <Card className="shadow-md border-primary/10">
                        <CardHeader><CardTitle className="font-headline text-xl text-primary flex items-center"><Tag className="mr-2 h-5 w-5"/>인기 태그</CardTitle></CardHeader>
                        <CardContent className="flex flex-wrap gap-2">{sidebarData.popularTags.map(tag => (<Link key={tag} href={`/blog/tag/${tag.toLowerCase()}`}><Button variant="outline" size="sm" className="text-xs bg-accent/5 border-accent/20 text-accent hover:bg-accent/10">#{tag}</Button></Link>))}
                        </CardContent>
                    </Card>
                    <AdBanner />
                </aside>
            </div>
             {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <Button variant="outline" size="sm" onClick={handlePrevPage} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /><span className="ml-1">이전</span></Button>
                    <span className="text-sm text-muted-foreground">{currentPage} / {totalPages} 페이지</span>
                    <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}><span className="mr-1">다음</span><ChevronRight className="h-4 w-4" /></Button>
                </div>
            )}
        </div>
    );
}
