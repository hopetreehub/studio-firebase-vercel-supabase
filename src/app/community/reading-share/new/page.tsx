
import { ReadingSharePostForm } from '@/components/community/ReadingSharePostForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '새 리딩 공유 - 커뮤니티',
  description: '자신의 타로 리딩 경험을 커뮤니티와 공유합니다.',
};

export default function NewReadingSharePage() {
  return (
    <div>
      <ReadingSharePostForm />
    </div>
  );
}
