
import { CommunityPostForm } from '@/components/community/CommunityPostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 덱 리뷰 작성 - 커뮤니티',
  description: '소장 중인 타로덱에 대한 리뷰를 작성합니다.',
};

export default function NewDeckReviewPage() {
  return (
    <div>
      <CommunityPostForm category="deck-review" />
    </div>
  );
}
