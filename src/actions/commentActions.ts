'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { CommunityComment } from '@/types';
import { CommunityCommentFormSchema, CommunityCommentFormData } from '@/types';

// Helper to map Supabase row to CommunityComment type
function mapRowToCommunityComment(row: any): CommunityComment {
  return {
    id: row.id,
    postId: row.post_id,
    authorId: row.author_id,
    authorName: row.author_name || '익명 사용자',
    authorPhotoURL: row.author_photo_url || '',
    content: row.content,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// Get all comments for a specific post
export async function getCommentsForPost(postId: string): Promise<CommunityComment[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('community_comments')
      .select('*')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }
    
    return data.map(mapRowToCommunityComment);
  } catch (error: any) {
    console.error(`Error fetching comments for post ${postId}:`, error.message);
    return [];
  }
}

// Add a new comment to a post
export async function addComment(
  postId: string,
  formData: CommunityCommentFormData,
  author: { uid: string; displayName?: string | null; photoURL?: string | null }
): Promise<{ success: boolean; commentId?: string; error?: string | object }> {
  try {
    const validationResult = CommunityCommentFormSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }
    if (!author?.uid) {
      return { success: false, error: "댓글을 작성하려면 로그인이 필요합니다." };
    }

    const { content } = validationResult.data;

    const newCommentData = {
      post_id: postId,
      author_id: author.uid,
      author_name: author.displayName || '익명 사용자',
      author_photo_url: author.photoURL || '',
      content,
    };

    const { data: commentData, error: commentError } = await supabaseAdmin
      .from('community_comments')
      .insert([newCommentData])
      .select('id')
      .single();

    if (commentError) {
      throw commentError;
    }

    // Increment comment count in community_posts table
    // Supabase does not have direct FieldValue.increment. Use a RLS-protected function or RPC.
    // For simplicity, we'll use a direct update here, assuming RLS handles permissions.
    // A more robust solution would involve a Supabase function (RPC) for atomic increments.
    const { data: postData, error: fetchPostError } = await supabaseAdmin
      .from('community_posts')
      .select('comment_count')
      .eq('id', postId)
      .single();

    if (fetchPostError || !postData) {
      console.warn(`Failed to fetch post ${postId} for comment count increment:`, fetchPostError?.message);
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('community_posts')
        .update({ comment_count: (postData.comment_count || 0) + 1 })
        .eq('id', postId);

      if (updateError) {
        console.warn(`Failed to increment comment count for post ${postId}:`, updateError.message);
      }
    }

    return { success: true, commentId: commentData.id };
  } catch (error: any) {
    console.error(`Error adding comment to post ${postId}:`, error.message);
    return { success: false, error: error.message || '댓글 작성 중 오류가 발생했습니다.' };
  }
}

// Delete a comment
export async function deleteComment(
  postId: string,
  commentId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('community_comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !comment) {
      throw new Error("삭제할 댓글을 찾을 수 없습니다.");
    }

    if (comment.author_id !== userId) {
      throw new Error("이 댓글을 삭제할 권한이 없습니다.");
    }

    const { error: deleteError } = await supabaseAdmin
      .from('community_comments')
      .delete()
      .eq('id', commentId);

    if (deleteError) {
      throw deleteError;
    }

    // Decrement comment count in community_posts table
    const { data: postData, error: fetchPostError } = await supabaseAdmin
      .from('community_posts')
      .select('comment_count')
      .eq('id', postId)
      .single();

    if (fetchPostError || !postData) {
      console.warn(`Failed to fetch post ${postId} for comment count decrement:`, fetchPostError?.message);
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('community_posts')
        .update({ comment_count: Math.max(0, (postData.comment_count || 0) - 1) })
        .eq('id', postId);

      if (updateError) {
        console.warn(`Failed to decrement comment count for post ${postId}:`, updateError.message);
      }
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error deleting comment ${commentId}:`, error.message);
    return { success: false, error: error.message || '댓글 삭제 중 오류가 발생했습니다.' };
  }
}

// Update a comment
export async function updateComment(
  postId: string,
  commentId: string,
  content: string,
  userId: string
): Promise<{ success: boolean; error?: string | object }> {
  try {
    const validationResult = CommunityCommentFormSchema.safeParse({ content });
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }

    const { data: comment, error: fetchError } = await supabaseAdmin
      .from('community_comments')
      .select('author_id')
      .eq('id', commentId)
      .single();

    if (fetchError || !comment) {
      return { success: false, error: '수정할 댓글을 찾을 수 없습니다.' };
    }
    if (comment.author_id !== userId) {
      return { success: false, error: '이 댓글을 수정할 권한이 없습니다.' };
    }

    const { error: updateError } = await supabaseAdmin
      .from('community_comments')
      .update({
        content: validationResult.data.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', commentId);

    if (updateError) {
      throw updateError;
    }

    return { success: true };
  } catch (error: any) {
    console.error(`Error updating comment ${commentId}:`, error.message);
    return { success: false, error: error.message || '댓글 수정 중 오류가 발생했습니다.' };
  }
}
