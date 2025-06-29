'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { SavedReading, SavedReadingCard, TarotCard } from '@/types';

const SaveReadingInputSchema = z.object({
  userId: z.string().min(1, { message: '사용자 ID가 필요합니다.' }),
  question: z.string().min(1, { message: '질문 내용이 필요합니다.' }),
  spreadName: z.string().min(1, { message: '스프레드 이름이 필요합니다.' }),
  spreadNumCards: z.number().int().positive({ message: '스프레드 카드 수는 양의 정수여야 합니다.' }),
  drawnCards: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      imageSrc: z.string().url(),
      isReversed: z.boolean(),
      position: z.string().optional(),
    })
  ).min(1, { message: '최소 한 장의 카드가 필요합니다.' }),
  interpretationText: z.string().min(1, { message: '해석 내용이 필요합니다.' }),
});

export type SaveReadingInput = z.infer<typeof SaveReadingInputSchema>;

export async function saveUserReading(
  input: SaveReadingInput
): Promise<{ success: boolean; readingId?: string; error?: string | object }> {
  try {
    const validationResult = SaveReadingInputSchema.safeParse(input);
    if (!validationResult.success) {
      return { success: false, error: validationResult.error.flatten().fieldErrors };
    }

    const { userId, question, spreadName, spreadNumCards, drawnCards, interpretationText } = validationResult.data;

    const readingData = {
      user_id: userId,
      question,
      spread_name: spreadName,
      spread_num_cards: spreadNumCards,
      drawn_cards: drawnCards, // JSONB column
      interpretation_text: interpretationText,
    };

    const { data, error } = await supabaseAdmin.from('user_readings').insert([readingData]).select('id').single();
    
    if (error) {
      throw error;
    }

    console.log(`User reading saved successfully with ID: ${data.id} for user ${userId}.`);
    return { success: true, readingId: data.id };

  } catch (error: any) {
    console.error('Error saving user reading to Supabase:', error.message);
    return { success: false, error: error.message || '리딩 저장 중 알 수 없는 오류가 발생했습니다.' };
  }
}

export async function getUserReadings(userId: string): Promise<SavedReading[]> {
  if (!userId) {
    console.warn('getUserReadings called without userId.');
    return [];
  }
  try {
    const { data, error } = await supabaseAdmin
      .from('user_readings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50); // Limit to last 50 readings for performance

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(row => ({
      id: row.id,
      userId: row.user_id || '',
      question: row.question || 'No question provided',
      spreadName: row.spread_name || 'Unknown Spread',
      spreadNumCards: row.spread_num_cards || 0,
      drawnCards: (row.drawn_cards as SavedReadingCard[]) || [],
      interpretationText: row.interpretation_text || 'No interpretation text.',
      createdAt: new Date(row.created_at),
    })) as SavedReading[];
  } catch (error: any) {
    console.error(`Error fetching readings for user ${userId}:`, error.message);
    return []; // Return empty array on error to prevent crashing UI
  }
}

export async function deleteUserReading(userId: string, readingId: string): Promise<{ success: boolean; error?: string }> {
  if (!userId || !readingId) {
    return { success: false, error: '사용자 ID 또는 리딩 ID가 제공되지 않았습니다.' };
  }
  try {
    const { data: reading, error: fetchError } = await supabaseAdmin
      .from('user_readings')
      .select('user_id')
      .eq('id', readingId)
      .single();

    if (fetchError || !reading) {
      return { success: false, error: '삭제할 리딩을 찾을 수 없습니다.' };
    }

    if (reading.user_id !== userId) {
      return { success: false, error: '이 리딩을 삭제할 권한이 없습니다.' };
    }

    const { error: deleteError } = await supabaseAdmin
      .from('user_readings')
      .delete()
      .eq('id', readingId);

    if (deleteError) {
      throw deleteError;
    }

    console.log(`User reading ${readingId} deleted successfully for user ${userId}.`);
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting user reading from Supabase:', error.message);
    return { success: false, error: error.message || '리딩 삭제 중 알 수 없는 오류가 발생했습니다.' };
  }
}
