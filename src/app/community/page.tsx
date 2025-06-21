
import { getCommunityPosts } from '@/actions/communityActions';
import type { Metadata } from 'next';
import { MessageSquare, FilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

export const metadata: Metadata = {
  title: '커뮤니티 - 자유 토론',
  description: 'InnerSpell 커뮤니티에서 타로와 영성에 대한 이야기를 자유롭게 나누세요.',
};

// Revalidate this page every 10 minutes
export const revalidate = 600;

export default async function CommunityPage() {
  const posts = await getCommunityPosts();

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-3 mb-3">
             <MessageSquare className="h-10 w-10 text-primary" />
             <h1 className="font-headline text-4xl font-bold text-primary">자유 토론</h1>
          </div>
          <p className="text-lg text-foreground/80">
            타로, 영성, 명상 등 다양한 주제에 대해 자유롭게 이야기를 나누는 공간입니다.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/community/new">
            <FilePlus className="mr-2 h-4 w-4" />
            새 글 작성하기
          </Link>
        </Button>
      </header>

      <div className="border rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60%]">제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead className="text-center hidden md:table-cell">댓글</TableHead>
              <TableHead className="text-right">작성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    <Link href={`/community/post/${post.id}`} className="hover:underline hover:text-accent">
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.authorName}</TableCell>
                  <TableCell className="text-center hidden md:table-cell">
                    <Badge variant="secondary">{post.commentCount}</Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {format(post.createdAt, 'yy.MM.dd HH:mm', { locale: ko })}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  아직 작성된 글이 없습니다. 첫 번째 글을 작성해보세요!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Add pagination controls here in the future */}
    </div>
  );
}
