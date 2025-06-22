
import type { BlogPost } from '@/types';
import { firestore } from '@/lib/firebase/admin';
import { getAllPosts as getAllPostsAction } from '@/actions/blogActions'; 
import { fallbackBlogPosts, mapDocToBlogPost } from '@/lib/blog-utils';

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const snapshot = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
      if (fallbackPost) {
        return { 
          ...fallbackPost, 
          createdAt: new Date(fallbackPost.date), 
          updatedAt: new Date(fallbackPost.date) 
        };
      }
      return undefined;
    }
    return mapDocToBlogPost(snapshot.docs[0]);
  } catch (error) {
    console.error(`Error fetching post by slug ${slug} from Firestore, trying fallback posts:`, error);
    const fallbackPost = fallbackBlogPosts.find(post => post.slug === slug);
     if (fallbackPost) {
        return { 
          ...fallbackPost, 
          createdAt: new Date(fallbackPost.date), 
          updatedAt: new Date(fallbackPost.date) 
        };
      }
    return undefined;
  }
}

async function getSortedPosts(order: 'asc' | 'desc'): Promise<BlogPost[]> {
  const posts = await getAllPostsAction(); // This action already handles fallbacks.

  return posts.sort((a, b) => {
    // The action ensures createdAt is a Date object.
    const dateA = a.createdAt!.getTime();
    const dateB = b.createdAt!.getTime();
    return order === 'asc' ? dateA - dateB : dateB - dateA;
  });
}


export async function getPreviousPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPosts('desc'); 
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex !== -1 && currentIndex < sortedPosts.length - 1) {
    return sortedPosts[currentIndex + 1]; 
  }
  return undefined;
}

export async function getNextPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPosts('desc'); 
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);

  if (currentIndex > 0) {
    return sortedPosts[currentIndex - 1]; 
  }
  return undefined;
}
