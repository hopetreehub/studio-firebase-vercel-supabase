
import { getCommunityPostById } from '@/actions/communityActions';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CalendarDays, MessageCircle, User } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Props = {
  params: { postId: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getCommunityPostById(params.postId);

  if (!post) {
    return {
      title: '게시물을 찾을 수 없습니다',
    };
  }

  return {
    title: `${post.title} - 커뮤니티`,
    description: post.content.substring(0, 150),
  };
}

export default async function CommunityPostPage({ params }: Props) {
  const post = await getCommunityPostById(params.postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary">{post.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.authorPhotoURL} alt={post.authorName} />
                <AvatarFallback>
                  {post.authorName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span>{post.authorName}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-1.5 h-4 w-4" />
              <span>{format(post.createdAt, 'yyyy년 M월 d일 HH:mm', { locale: ko })}</span>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="py-6">
          <div 
            className="prose prose-lg max-w-none text-foreground/80 prose-headings:text-primary prose-headings:font-headline prose-a:text-accent hover:prose-a:text-accent/80 prose-strong:text-primary/90"
            style={{ whiteSpace: 'pre-line' }}
          >
            {post.content}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-2xl font-headline text-primary flex items-center">
          <MessageCircle className="mr-2 h-6 w-6" />
          댓글 ({post.commentCount})
        </h2>
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
                <p>댓글 기능은 현재 준비 중입니다.</p>
                <p className="text-sm">곧 활발한 토론을 할 수 있도록 업데이트하겠습니다!</p>
            </CardContent>
        </Card>
      </div>

       <div className="text-center mt-8">
        <Button asChild variant="outline">
          <Link href="/community">
            목록으로 돌아가기
          </Link>
        </Button>
      </div>
    </div>
  );
}
