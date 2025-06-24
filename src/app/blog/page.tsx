
import { getAllPosts } from '@/actions/blogActions';
import { Feather } from 'lucide-react';
import type { Metadata } from 'next';
import { BlogList } from '@/components/blog/BlogList';

export const metadata: Metadata = {
  title: '영적 사색 - 블로그',
  description: '타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요. 저희의 글들이 당신의 여정에 영감을 주기를 바랍니다.',
};

// Revalidate this page every hour
export const revalidate = 3600;

export default async function BlogPage() {
  // Fetch data on the server
  const allPosts = await getAllPosts();
  // Ensure posts are sorted for consistency
  const sortedPosts = allPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Data for the sidebar
  const categories = ['타로 해석', '영적 성장', '명상 가이드', '카드 이야기'];
  const popularTags = ['운세', '사랑', '직업', '조언', '치유'];
  const recentPosts = sortedPosts.slice(0, 5).map(p => ({ title: p.title, slug: p.slug }));

  const sidebarData = {
    categories,
    popularTags,
    recentPosts,
  }

  return (
    <div className="space-y-8">
      <header className="text-center">
        <Feather className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-primary">영적 사색</h1>
        <p className="mt-4 text-lg text-foreground/80 max-w-2xl mx-auto">
          타로, 영성, 개인적 성장에 대한 기사, 통찰, 이야기를 탐험하세요. 저희의 글들이 당신의 여정에 영감을 주기를 바랍니다.
        </p>
      </header>

      {/* BlogList component now handles its own layout including sidebar */}
      <BlogList initialPosts={sortedPosts} sidebarData={sidebarData} />
    </div>
  );
}
