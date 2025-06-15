
'use server';

import type { BlogPost } from '@/types';
import { z } from 'zod';
import { firestore } from '@/lib/firebase/admin';
import { FieldValue } from 'firebase-admin/firestore';

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

export async function submitBlogPost(
  formData: BlogFormData
): Promise<{ success: boolean; postId?: string; error?: string | object }> {
  try {
    const validationResult = BlogFormDataSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }

    const { title, slug, excerpt, content, imageSrc, dataAiHint, author, tags } = validationResult.data;

    // Check if slug already exists to prevent duplicates
    const slugExistsQuery = await firestore.collection('blogPosts').where('slug', '==', slug).limit(1).get();
    if (!slugExistsQuery.empty) {
      return { success: false, error: { slug: 'This slug is already in use. Please choose a unique slug.' } };
    }

    const newPostData = {
      title,
      slug,
      excerpt,
      content,
      imageSrc: imageSrc || 'https://placehold.co/600x400.png',
      dataAiHint: dataAiHint || 'placeholder image',
      author: author || 'InnerSpell 팀',
      tags: tags || [],
      createdAt: FieldValue.serverTimestamp(), // Firestore server-side timestamp
      // 'date' field will be derived from 'createdAt' when fetching
    };

    const docRef = await firestore.collection('blogPosts').add(newPostData);

    return { success: true, postId: docRef.id };
  } catch (error) {
    console.error('Error submitting blog post to Firestore:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred while saving to database' };
  }
}
