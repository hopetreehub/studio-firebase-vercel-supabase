
import type { BlogPost } from '@/types';
import { getAllPosts as getAllPostsAction } from '@/actions/blogActions'; 

export async function getPostAndNeighbors(slug: string): Promise<{
  post: BlogPost | null;
  posts: BlogPost[]; // For generateStaticParams
  previousPost: BlogPost | undefined;
  nextPost: BlogPost | undefined;
}> {
  try {
    const allPosts = await getAllPostsAction(); 

    if (allPosts.length === 0) {
      return { post: null, posts: [], previousPost: undefined, nextPost: undefined };
    }

    const sortedPosts = allPosts.sort((a, b) => {
        const dateA = a.createdAt?.getTime() || 0;
        const dateB = b.createdAt?.getTime() || 0;
        return dateB - dateA;
    });

    if (!slug) { // For generateStaticParams
        return { post: null, posts: sortedPosts, previousPost: undefined, nextPost: undefined };
    }
    
    const currentIndex = sortedPosts.findIndex(p => p.slug === slug);

    if (currentIndex === -1) {
      return { post: null, posts: sortedPosts, previousPost: undefined, nextPost: undefined };
    }

    const post = sortedPosts[currentIndex];
    const previousPost = currentIndex < sortedPosts.length - 1 ? sortedPosts[currentIndex + 1] : undefined;
    const nextPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : undefined;

    return { post, posts: sortedPosts, previousPost, nextPost };

  } catch (error) {
    console.error(`Error fetching post and neighbors for slug ${slug}:`, error);
    return { post: null, posts: [], previousPost: undefined, nextPost: undefined };
  }
}
