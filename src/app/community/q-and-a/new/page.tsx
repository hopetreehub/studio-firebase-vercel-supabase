
import { CommunityPostForm } from '@/components/community/CommunityPostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 질문 작성 - 커뮤니티',
  description: '타로에 대해 궁금한 점을 질문합니다.',
};

export default function NewQnaPage() {
  return (
    <div>
      <CommunityPostForm category="q-and-a" />
    </div>
  );
}
