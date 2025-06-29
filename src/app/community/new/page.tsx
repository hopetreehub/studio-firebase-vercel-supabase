
import { CommunityPostForm } from '@/components/community/CommunityPostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 글 작성 - 커뮤니티',
  description: '자유 토론 게시판에 새로운 글을 작성합니다.',
};

export default function NewPostPage() {
  return (
    <div>
      <CommunityPostForm category="free-discussion" />
    </div>
  );
}
