
import { getPostBySlug, getPreviousPost, getNextPost } from '@/lib/blog-data';
import { getAllPosts as getAllPostsAction } from '@/actions/blogActions'; // Import action
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
  const post = await getPostBySlug(params.slug); 

  if (!post) {
    return {
      title: '게시물을 찾을 수 없습니다 - InnerSpell',
      description: '요청하신 블로그 게시물을 찾을 수 없습니다.',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Define your site URL

  return {
    title: `${post.title} - InnerSpell 블로그`,
    description: post.excerpt,
    alternates: {
      canonical: `${siteUrl}/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `${siteUrl}/blog/${post.slug}`,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: post.author ? [post.author] : ['InnerSpell 팀'],
      tags: post.tags,
      images: post.imageSrc ? [
        {
          url: post.imageSrc.startsWith('http') ? post.imageSrc : `${siteUrl}${post.imageSrc}`, // Ensure absolute URL
          width: 1200, 
          height: 630, 
          alt: post.title,
        },
        ...previousImages,
      ] : previousImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.imageSrc ? [post.imageSrc.startsWith('http') ? post.imageSrc : `${siteUrl}${post.imageSrc}`] : undefined,
    },
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPostsAction(); // Use Server Action
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Error in generateStaticParams for blog posts:", error);
    return [];
  }
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostBySlug(params.slug); 

  if (!post) {
    notFound();
  }

  const previousPost = await getPreviousPost(params.slug); 
  const nextPost = await getNextPost(params.slug); 

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

        {post.imageSrc && (
          <div className="relative aspect-video w-full">
            <Image
              src={post.imageSrc}
              alt={post.title}
              fill
              className="object-cover"
              data-ai-hint={post.dataAiHint}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 800px"
            />
          </div>
        )}

        <div 
          className="p-6 sm:p-8 prose prose-lg max-w-none text-foreground/80 prose-headings:text-primary prose-headings:font-headline prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-primary/90"
          style={{ whiteSpace: 'pre-line' }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} // Basic Markdown-like newline handling
        />
      </article>

      <nav className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4" aria-label="게시물 탐색">
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
      </nav>
    </div>
  );
}
