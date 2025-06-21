
'use server';

import { z } from 'zod';
import { firestore } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { CommunityPost } from '@/types';
import { CommunityPostFormSchema, CommunityPostFormData } from '@/types';

// Helper to map Firestore doc to CommunityPost type
function mapDocToCommunityPost(doc: FirebaseFirestore.DocumentSnapshot): CommunityPost {
  const data = doc.data()!;
  return {
    id: doc.id,
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhotoURL: data.authorPhotoURL || '',
    title: data.title,
    content: data.content,
    viewCount: data.viewCount || 0,
    commentCount: data.commentCount || 0,
    createdAt: (data.createdAt as Timestamp).toDate(),
    updatedAt: (data.updatedAt as Timestamp).toDate(),
  };
}

// Fallback data for development/testing
const fallbackCommunityPosts: CommunityPost[] = [
  {
    id: 'fallback-1',
    authorId: 'system',
    authorName: 'InnerSpell 운영자',
    title: 'InnerSpell 커뮤니티에 오신 것을 환영합니다!',
    content: '이곳은 타로와 영성에 대해 자유롭게 이야기를 나누는 공간입니다. 서로 존중하며 즐거운 커뮤니티를 함께 만들어가요.',
    viewCount: 150,
    commentCount: 2,
    createdAt: new Date('2024-05-20T10:00:00Z'),
    updatedAt: new Date('2024-05-20T10:00:00Z'),
  },
  {
    id: 'fallback-2',
    authorId: 'user-123',
    authorName: '별빛여행자',
    title: '최근에 뽑았던 3카드 스프레드 공유해요',
    content: '최근 직장 문제로 3카드 스프레드를 뽑아봤는데, 과거-은둔자, 현재-컵2, 미래-완드에이스가 나왔어요. 혹시 다른 분들은 어떻게 해석하시나요?',
    viewCount: 78,
    commentCount: 5,
    createdAt: new Date('2024-05-21T14:30:00Z'),
    updatedAt: new Date('2024-05-21T14:30:00Z'),
  }
];

// Get all community posts
export async function getCommunityPosts(): Promise<CommunityPost[]> {
  try {
    const snapshot = await firestore.collection('communityPosts').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      return fallbackCommunityPosts;
    }
    return snapshot.docs.map(mapDocToCommunityPost);
  } catch (error) {
    console.error("Error fetching community posts from Firestore, returning fallback posts:", error);
    return fallbackCommunityPosts;
  }
}

// Get a single community post by ID
export async function getCommunityPostById(postId: string): Promise<CommunityPost | null> {
  try {
    const doc = await firestore.collection('communityPosts').doc(postId).get();
    if (!doc.exists) {
      const fallbackPost = fallbackCommunityPosts.find(p => p.id === postId);
      return fallbackPost || null;
    }
    // Increment view count
    await doc.ref.update({ viewCount: FieldValue.increment(1) });
    return mapDocToCommunityPost(doc);
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    return null;
  }
}

// Create a new community post
export async function createCommunityPost(
  formData: CommunityPostFormData,
  author: { uid: string; displayName?: string | null; photoURL?: string | null }
): Promise<{ success: boolean; postId?: string; error?: string | object }> {
  try {
    const validationResult = CommunityPostFormSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }
    if (!author || !author.uid) {
        return { success: false, error: "글을 작성하려면 로그인이 필요합니다." };
    }

    const { title, content } = validationResult.data;

    const newPostData = {
      authorId: author.uid,
      authorName: author.displayName || '익명 사용자',
      authorPhotoURL: author.photoURL || '',
      title,
      content,
      viewCount: 0,
      commentCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection('communityPosts').add(newPostData);
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error('Error creating community post:', error);
    return { success: false, error: error instanceof Error ? error.message : '게시물 생성 중 알 수 없는 오류가 발생했습니다.' };
  }
}

// Delete a community post
export async function deleteCommunityPost(
  postId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const postRef = firestore.collection('communityPosts').doc(postId);
    const doc = await postRef.get();

    if (!doc.exists) {
      return { success: false, error: '삭제할 게시물을 찾을 수 없습니다.' };
    }

    const postData = doc.data();
    // In a real app, you might also allow admins to delete posts
    if (postData?.authorId !== userId) {
      return { success: false, error: '이 게시물을 삭제할 권한이 없습니다.' };
    }

    await postRef.delete();
    // In a real app, you might want to delete associated comments as well.
    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : '게시물 삭제 중 오류가 발생했습니다.' };
  }
}
