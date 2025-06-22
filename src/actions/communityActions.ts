
'use server';

import { z } from 'zod';
import { firestore } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import type { CommunityPost, CommunityPostCategory } from '@/types';
import { CommunityPostFormSchema, CommunityPostFormData, ReadingSharePostFormData, ReadingSharePostFormSchema } from '@/types';

// Helper to map Firestore doc to CommunityPost type
function mapDocToCommunityPost(doc: FirebaseFirestore.DocumentSnapshot): CommunityPost {
  const data = doc.data()!;
  const createdAtTimestamp = data.createdAt as Timestamp;
  const updatedAtTimestamp = data.updatedAt as Timestamp;

  const createdAt = createdAtTimestamp ? createdAtTimestamp.toDate() : new Date();
  const updatedAt = updatedAtTimestamp ? updatedAtTimestamp.toDate() : createdAt;

  return {
    id: doc.id,
    authorId: data.authorId,
    authorName: data.authorName,
    authorPhotoURL: data.authorPhotoURL || '',
    title: data.title,
    content: data.content,
    viewCount: data.viewCount || 0,
    commentCount: data.commentCount || 0,
    category: data.category || 'free-discussion',
    readingQuestion: data.readingQuestion || '',
    cardsInfo: data.cardsInfo || '',
    createdAt: createdAt,
    updatedAt: updatedAt,
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
    category: 'free-discussion',
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
    category: 'reading-share',
    readingQuestion: '저의 현재 직장운은 어떤가요?',
    cardsInfo: '과거: The Hermit (은둔자), 현재: Two of Cups (컵 2), 미래: Ace of Wands (완드 에이스)',
    createdAt: new Date('2024-05-21T14:30:00Z'),
    updatedAt: new Date('2024-05-21T14:30:00Z'),
  },
   {
    id: 'fallback-3',
    authorId: 'user-456',
    authorName: '진리탐구자',
    title: '여황제 카드와 여사제 카드의 차이가 궁금해요!',
    content: '두 카드 모두 강력한 여성적 에너지를 상징하는 것 같은데, 해석할 때마다 헷갈립니다. 두 카드의 핵심적인 차이점은 무엇일까요? 다른 분들의 의견이 궁금합니다.',
    viewCount: 42,
    commentCount: 3,
    category: 'q-and-a',
    createdAt: new Date('2024-05-22T11:00:00Z'),
    updatedAt: new Date('2024-05-22T11:00:00Z'),
  },
  {
    id: 'fallback-4',
    authorId: 'user-789',
    authorName: '컬렉터K',
    title: '라이더-웨이트 덱의 다양한 에디션 비교!',
    content: '가장 클래식한 라이더-웨이트 덱도 여러 버전이 있는 것 아시나요? 제가 가진 스미스-웨이트 센테니얼 에디션과 알비노-웨이트 덱을 간단히 비교해봤습니다. 색감이나 카드 질감이 미묘하게 달라서 리딩할 때 느낌도 달라요!',
    viewCount: 35,
    commentCount: 4,
    category: 'deck-review',
    createdAt: new Date('2024-05-23T09:00:00Z'),
    updatedAt: new Date('2024-05-23T09:00:00Z'),
  },
    {
    id: 'fallback-5',
    authorId: 'user-study-lead',
    authorName: '스터디리더',
    title: '[스터디 모집] 초보자를 위한 라이더-웨이트 타로 스터디',
    content: '타로에 입문하고 싶지만 어디서부터 시작해야 할지 막막하신 분들을 위해 기초 스터디를 개설합니다. 매주 주말에 온라인으로 만나 함께 배우고 리딩 연습도 할 예정입니다. 관심 있는 분들은 댓글로 문의해주세요!',
    viewCount: 25,
    commentCount: 8,
    category: 'study-group',
    createdAt: new Date('2024-05-24T18:00:00Z'),
    updatedAt: new Date('2024-05-24T18:00:00Z'),
  },
];

// Get community posts for a specific category
export async function getCommunityPosts(category: CommunityPostCategory): Promise<CommunityPost[]> {
  try {
    const snapshot = await firestore.collection('communityPosts')
      .where('category', '==', category)
      .orderBy('createdAt', 'desc')
      .get();
      
    if (snapshot.empty) {
      return fallbackCommunityPosts.filter(p => p.category === category);
    }
    return snapshot.docs.map(mapDocToCommunityPost);
  } catch (error) {
    console.error(`Error fetching ${category} posts from Firestore, returning fallback posts:`, error);
    return fallbackCommunityPosts.filter(p => p.category === category);
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
    
    // After getting the post, refetch to get the updated view count
    const updatedDoc = await firestore.collection('communityPosts').doc(postId).get();
    return mapDocToCommunityPost(updatedDoc);

  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    const fallbackPost = fallbackCommunityPosts.find(p => p.id === postId);
    return fallbackPost || null;
  }
}


// Create a new free-discussion, q-and-a, deck-review, or study-group post
export async function createCommunityPost(
  formData: CommunityPostFormData,
  author: { uid: string; displayName?: string | null; photoURL?: string | null },
  category: 'free-discussion' | 'q-and-a' | 'deck-review' | 'study-group'
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
      category: category,
      viewCount: 0,
      commentCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection('communityPosts').add(newPostData);
    console.log(`Created new community post with ID: ${docRef.id} in category '${category}'`);
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error('Error creating community post:', error);
    return { success: false, error: error instanceof Error ? error.message : '게시물 생성 중 알 수 없는 오류가 발생했습니다.' };
  }
}

// Create a new reading-share post
export async function createReadingSharePost(
  formData: ReadingSharePostFormData,
  author: { uid: string; displayName?: string | null; photoURL?: string | null }
): Promise<{ success: boolean; postId?: string; error?: string | object }> {
  try {
    const validationResult = ReadingSharePostFormSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }
    if (!author || !author.uid) {
      return { success: false, error: "글을 작성하려면 로그인이 필요합니다." };
    }

    const { title, readingQuestion, cardsInfo, content } = validationResult.data;

    const newPostData = {
      authorId: author.uid,
      authorName: author.displayName || '익명 사용자',
      authorPhotoURL: author.photoURL || '',
      title,
      readingQuestion,
      cardsInfo,
      content,
      category: 'reading-share' as CommunityPostCategory,
      viewCount: 0,
      commentCount: 0,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const docRef = await firestore.collection('communityPosts').add(newPostData);
    console.log(`Created new reading-share post with ID: ${docRef.id}`);
    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error('Error creating reading share post:', error);
    return { success: false, error: error instanceof Error ? error.message : '리딩 공유 게시물 생성 중 알 수 없는 오류가 발생했습니다.' };
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
    console.log(`Successfully deleted community post with ID: ${postId}`);
    // In a real app, you might want to delete associated comments as well.
    return { success: true };
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    return { success: false, error: error instanceof Error ? error.message : '게시물 삭제 중 오류가 발생했습니다.' };
  }
}
