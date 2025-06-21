
import { getCommunityPosts } from '@/actions/communityActions';
import type { Metadata } from 'next';
import { Library, FilePlus } from 'lucide-react';
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
  title: '타로덱 리뷰 - 커뮤니티',
  description: '사용자들이 공유하는 다양한 타로덱의 리뷰와 정보를 확인해보세요.',
};

// Revalidate this page every 10 minutes
export const revalidate = 600;

export default async function DeckReviewPage() {
  const posts = await getCommunityPosts('deck-review');

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-left">
          <div className="inline-flex items-center gap-3 mb-3">
             <Library className="h-10 w-10 text-primary" />
             <h1 className="font-headline text-4xl font-bold text-primary">타로덱 리뷰</h1>
          </div>
          <p className="text-lg text-foreground/80">
            아름다운 타로덱을 구경하고, 사용자들의 솔직한 리뷰를 확인해보세요.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href="/community/deck-review/new">
            <FilePlus className="mr-2 h-4 w-4" />
            새 리뷰 작성하기
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
                  아직 작성된 리뷰가 없습니다. 첫 번째 리뷰를 작성해보세요!
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
