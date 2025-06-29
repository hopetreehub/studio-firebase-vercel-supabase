
import { getCommunityPosts } from '@/actions/communityActions';
import type { Metadata } from 'next';
import { HelpCircle, FilePlus } from 'lucide-react';
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
  title: '질문과 답변 - 커뮤니티',
  description: 'InnerSpell 커뮤니티에서 타로에 대해 궁금한 점을 질문하고 답변을 얻으세요.',
};

// Revalidate this page every 10 minutes
export const revalidate = 600;

export default async function QnaPage() {
  const posts = await getCommunityPosts('q-and-a');

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-3 mb-3">
             <HelpCircle className="h-10 w-10 text-primary" />
             <h1 className="font-headline text-4xl font-bold text-primary">질문과 답변</h1>
          </div>
          <p className="text-lg text-foreground/80">
            타로 카드, 스프레드, 상징 등 무엇이든 질문하고 답변을 받아보세요.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/community/q-and-a/new">
            <FilePlus className="mr-2 h-4 w-4" />
            새 질문하기
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
                  아직 질문이 없습니다. 첫 번째 질문을 등록해보세요!
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
