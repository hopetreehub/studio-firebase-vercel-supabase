
import { CommunityPostForm } from '@/components/community/CommunityPostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 스터디/모임 모집 - 커뮤니티',
  description: '함께 타로를 공부할 스터디를 만들거나 모임을 제안합니다.',
};

export default function NewStudyGroupPage() {
  return (
    <div>
      <CommunityPostForm category="study-group" />
    </div>
  );
}
