
'use server';

import type { BlogPost } from '@/types';
import { z } from 'zod';
import { firestore } from '@/lib/firebase/admin';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { mapDocToBlogPost, fallbackBlogPosts } from '@/lib/blog-data'; 

const BlogFormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug must be lowercase, numbers, and hyphens only.' }),
  excerpt: z.string().min(1, "Excerpt is required"),
  content: z.string().min(1, "Content is required"),
  imageSrc: z.string().url().optional().or(z.literal('')),
  dataAiHint: z.string().optional().or(z.literal('')),
  author: z.string().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
});

export type BlogFormData = z.infer<typeof BlogFormDataSchema>;

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const snapshot = await firestore.collection('blogPosts').orderBy('createdAt', 'desc').get();
    if (snapshot.empty) {
      // console.log("No posts found in Firestore, returning fallback posts from action.");
      return fallbackBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(post => ({
        ...post,
        createdAt: new Date(post.date), // Ensure createdAt for fallback
        updatedAt: new Date(post.date), // Ensure updatedAt for fallback
      }));
    }
    return snapshot.docs.map(mapDocToBlogPost);
  } catch (error) {
    console.error("Error fetching all posts from Firestore in action, returning fallback posts:", error);
    return fallbackBlogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(post => ({
      ...post,
      createdAt: new Date(post.date),
      updatedAt: new Date(post.date),
    }));
  }
}

export async function submitBlogPost(
  formData: BlogFormData,
  postId?: string 
): Promise<{ success: boolean; postId?: string; error?: string | object }> {
  try {
    const validationResult = BlogFormDataSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }

    const { title, slug, excerpt, content, imageSrc, dataAiHint, author, tags } = validationResult.data;

    if (!postId) { 
      const slugExistsQuery = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
      if (!slugExistsQuery.empty) {
        return { success: false, error: { slug: '이 슬러그는 이미 사용 중입니다. 고유한 슬러그를 선택해주세요.' } };
      }
    } else { 
      const slugExistsQuery = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
      if (!slugExistsQuery.empty && slugExistsQuery.docs[0].id !== postId) {
         return { success: false, error: { slug: '이 슬러그는 다른 게시물에서 이미 사용 중입니다. 고유한 슬러그를 선택해주세요.' } };
      }
    }

    const postData = {
      title,
      slug,
      excerpt,
      content,
      imageSrc: imageSrc || 'https://placehold.co/600x400.png',
      dataAiHint: dataAiHint || 'placeholder image',
      author: author || 'InnerSpell 팀',
      tags: tags || [],
      updatedAt: FieldValue.serverTimestamp(), // Always update this
    };

    if (postId) {
      const postRef = firestore.collection('blogPosts').doc(postId);
      await postRef.update(postData);
      // console.log(`Blog post ${postId} updated successfully.`);
      return { success: true, postId: postId };
    } else {
      const newPostDataWithTimestamp = {
        ...postData,
        createdAt: FieldValue.serverTimestamp(), 
      };
      const docRef = await firestore.collection('blogPosts').add(newPostDataWithTimestamp);
      // console.log(`New blog post created successfully with ID: ${docRef.id}.`);
      return { success: true, postId: docRef.id };
    }

  } catch (error) {
    console.error('Error submitting blog post to Firestore:', error);
    return { success: false, error: error instanceof Error ? error.message : '데이터베이스 저장 중 알 수 없는 오류가 발생했습니다.' };
  }
}

export async function deleteBlogPost(
  postId: string
): Promise<{ success: boolean; error?: string }> {
  if (!postId) {
    return { success: false, error: '게시물 ID가 제공되지 않았습니다.' };
  }
  try {
    await firestore.collection('blogPosts').doc(postId).delete();
    // console.log(`Blog post ${postId} deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error('Error deleting blog post from Firestore:', error);
    return { success: false, error: error instanceof Error ? error.message : '데이터베이스에서 게시물을 삭제하는 중 오류가 발생했습니다.' };
  }
}
