'use server';

import type { BlogPost } from '@/types';
import { z } from 'zod';

// This schema can be shared or derived from the form's schema
const BlogFormDataSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
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
): Promise<{ success: boolean; post?: BlogPost; error?: string }> {
  try {
    // Validate data (though client-side validation should also exist)
    const validationResult = BlogFormDataSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors_type_error_map };
    }

    const { title, slug, excerpt, content, imageSrc, dataAiHint, author, tags } = validationResult.data;

    const newPost: BlogPost = {
      id: Date.now().toString(), // Simple ID generation for prototype
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      title,
      slug,
      excerpt,
      content,
      imageSrc: imageSrc || 'https://placehold.co/600x400.png', // Default placeholder
      dataAiHint: dataAiHint || 'placeholder image',
      author: author || 'InnerSpell Team',
      tags: tags || [],
    };

    // In a real application, this is where you'd save `newPost` to a database.
    // For this prototype, the AI will handle updating `src/lib/blog-data.ts`
    // based on the successful return of this action.

    return { success: true, post: newPost };
  } catch (error) {
    console.error('Error submitting blog post:', error);
    return { success: false, error: error instanceof Error ? error.message : 'An unknown error occurred' };
  }
}
