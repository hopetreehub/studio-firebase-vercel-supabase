
import type { BlogPost } from '@/types';
import { firestore } from '@/lib/firebase/admin';
import type { Timestamp } from 'firebase-admin/firestore';

// Helper function to convert Firestore document to BlogPost
function mapDocToBlogPost(doc: FirebaseFirestore.DocumentSnapshot): BlogPost {
  const data = doc.data()!;
  const createdAt = data.createdAt as Timestamp;
  return {
    id: doc.id,
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    imageSrc: data.imageSrc,
    dataAiHint: data.dataAiHint,
    author: data.author,
    tags: data.tags || [],
    date: createdAt ? createdAt.toDate().toISOString().split('T')[0] : new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await firestore.collection('blogPosts').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(mapDocToBlogPost);
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  try {
    const snapshot = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (snapshot.empty) {
      return undefined;
    }
    return mapDocToBlogPost(snapshot.docs[0]);
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error);
    return undefined;
  }
}

async function getSortedPostsByDate(order: 'asc' | 'desc'): Promise<BlogPost[]> {
   try {
    const snapshot = await firestore.collection('blogPosts').orderBy('createdAt', order).get();
    if (snapshot.empty) {
      return [];
    }
    return snapshot.docs.map(mapDocToBlogPost);
  } catch (error) {
    console.error(`Error fetching sorted posts (${order}):`, error);
    return [];
  }
}


export async function getPreviousPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPostsByDate('asc'); // Oldest first
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);
  if (currentIndex > 0) {
    return sortedPosts[currentIndex - 1];
  }
  return undefined;
}

export async function getNextPost(currentSlug: string): Promise<BlogPost | undefined> {
  const sortedPosts = await getSortedPostsByDate('asc'); // Oldest first
  const currentIndex = sortedPosts.findIndex(post => post.slug === currentSlug);
  if (currentIndex !== -1 && currentIndex < sortedPosts.length - 1) {
    return sortedPosts[currentIndex + 1];
  }
  return undefined;
}
