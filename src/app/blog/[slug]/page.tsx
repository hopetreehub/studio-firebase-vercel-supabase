
import { getPostBySlug, getAllPosts, getPreviousPost, getNextPost } from '@/lib/blog-data';
import type { BlogPost } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, User } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

type Props = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug); // Changed to await

  if (!post) {
    return {
      title: '게시물을 찾을 수 없습니다 - InnerSpell',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${post.title} - InnerSpell 블로그`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: [
        {
          url: post.imageSrc,
          width: 1200, 
          height: 630, 
          alt: post.title,
        },
        ...previousImages,
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.imageSrc],
    },
  };
}

export async function generateStaticParams() {
  const posts = await getAllPosts(); // Changed to await
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) { // Changed to async
  const post = await getPostBySlug(params.slug); // Changed to await

  if (!post) {
    notFound();
  }

  const previousPost = await getPreviousPost(params.slug); // Changed to await
  const nextPost = await getNextPost(params.slug); // Changed to await

  const displayDate = format(new Date(post.date), 'yyyy년 MM월 dd일');

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <article className="bg-card shadow-xl rounded-lg overflow-hidden border border-primary/10">
        <header className="p-6 sm:p-8">
          <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-3">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center space-x-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" /> {displayDate}
            </div>
            {post.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1.5" /> {post.author}
              </div>
            )}
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-accent/10 text-accent rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="relative aspect-video w-full">
          <Image
            src={post.imageSrc}
            alt={post.title}
            fill
            className="object-cover"
            data-ai-hint={post.dataAiHint}
            priority
          />
        </div>

        <div className="p-6 sm:p-8 prose prose-lg max-w-none text-foreground/80 prose-headings:text-primary prose-headings:font-headline prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-primary/90"
             style={{ whiteSpace: 'pre-line' }}>
          {post.content}
        </div>
      </article>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        {previousPost ? (
          <Button asChild variant="outline" size="sm" className="group hover:bg-primary/5 w-full sm:w-auto">
            <Link href={`/blog/${previousPost.slug}`}>
              <span className="flex items-center justify-center">
                <ChevronLeft className="mr-1 h-4 w-4 group-hover:text-primary transition-colors" />
                이전 글
              </span>
            </Link>
          </Button>
        ) : (
          <div className="w-full sm:w-auto" /> 
        )}

        <Button asChild variant="outline" className="group hover:bg-primary/5 w-full sm:w-auto">
          <Link href="/blog">
            <span className="flex items-center justify-center">
              블로그로 돌아가기
            </span>
          </Link>
        </Button>

        {nextPost ? (
          <Button asChild variant="outline" size="sm" className="group hover:bg-primary/5 w-full sm:w-auto">
            <Link href={`/blog/${nextPost.slug}`}>
              <span className="flex items-center justify-center">
                다음 글
                <ChevronRight className="ml-1 h-4 w-4 group-hover:text-primary transition-colors" />
              </span>
            </Link>
          </Button>
        ) : (
          <div className="w-full sm:w-auto" />
        )}
      </div>
    </div>
  );
}
