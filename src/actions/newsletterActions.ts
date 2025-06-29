'use server';

import { z } from 'zod';
import { supabaseAdmin } from '@/lib/supabase/admin';

const NewsletterSubscriptionSchema = z.object({
  email: z.string().email({ message: '유효한 이메일 주소를 입력해주세요.' }),
});

export type NewsletterSubscriptionFormData = z.infer<typeof NewsletterSubscriptionSchema>;

export async function subscribeToNewsletter(
  formData: NewsletterSubscriptionFormData
): Promise<{ success: boolean; message: string }> {
  try {
    const validationResult = NewsletterSubscriptionSchema.safeParse(formData);
    if (!validationResult.success) {
      return { success: false, message: validationResult.error.flatten().fieldErrors.email?.[0] || '유효하지 않은 이메일입니다.' };
    }

    const { email } = validationResult.data;

    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .upsert(
        {
          email: email,
          subscribed_at: new Date().toISOString(),
          status: 'active',
        },
        { onConflict: 'email' } // If email exists, update it
      )
      .select()
      .single();

    if (error) {
      throw error;
    }

    if (data) {
      console.log(`Newsletter: Email ${email} successfully subscribed/updated in Supabase.`);
      return { success: true, message: '뉴스레터 구독이 완료되었습니다! 환영합니다.' };
    } else {
      return { success: false, message: '구독 처리 중 알 수 없는 오류가 발생했습니다.' };
    }

  } catch (error: any) {
    console.error('Error subscribing to newsletter:', error.message);
    const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
    return { success: false, message: `구독 처리 중 오류 발생: ${errorMessage}` };
  }
}
