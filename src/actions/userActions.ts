'use server';

import { supabaseAdmin } from '@/lib/supabase/admin';
import type { UserProfileFormData } from '@/types';
import { UserProfileFormSchema } from '@/types';

export interface AppUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  creationTime?: string;
  lastSignInTime?: string;
  role?: string; 
  birthDate?: string;
  sajuInfo?: string;
  subscriptionStatus?: 'free' | 'paid';
}

export async function getUserProfile(uid: string): Promise<AppUser | null> {
  try {
    // Fetch user from Supabase Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(uid);

    if (authError || !authUser) {
      if (authError?.message === 'User not found') {
        return null;
      }
      throw authError;
    }

    // Fetch profile from public.profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('uid', uid)
      .single();

    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
      throw profileError;
    }

    let role = 'user'; // Default role
    // Supabase does not have custom claims like Firebase. Roles would be managed in the profiles table or RLS.
    // For now, we'll keep a simple admin check or rely on the profile table.
    if (authUser.user.email === 'admin@innerspell.com') {
      role = 'admin';
    } else if (profileData?.role) { // Assuming 'role' field in profiles table
      role = profileData.role;
    }

    const appUser: AppUser = {
      uid: authUser.user.id,
      email: authUser.user.email,
      displayName: authUser.user.user_metadata?.display_name || authUser.user.email,
      photoURL: authUser.user.user_metadata?.photo_url || '',
      creationTime: authUser.user.created_at,
      lastSignInTime: authUser.user.last_sign_in_at,
      role: role,
      subscriptionStatus: profileData?.subscription_status || 'free', // Default to free
      birthDate: profileData?.birth_date || '',
      sajuInfo: profileData?.saju_info || '',
    };

    return appUser;

  } catch (error: any) {
    console.error('Error getting user profile:', error.message);
    return null;
  }
}

export async function updateUserProfile(uid: string, data: UserProfileFormData): Promise<{ success: boolean; message: string }> {
  const validation = UserProfileFormSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, message: '유효하지 않은 데이터입니다.' };
  }

  const { displayName, birthDate, sajuInfo } = validation.data;

  try {
    // Update Supabase Auth user metadata
    const { error: authUpdateError } = await supabaseAdmin.auth.admin.updateUserById(uid, {
      user_metadata: { display_name: displayName },
    });

    if (authUpdateError) {
      throw authUpdateError;
    }

    // Upsert (insert or update) profile document in public.profiles table
    const { error: profileUpsertError } = await supabaseAdmin.from('profiles').upsert(
      {
        uid: uid,
        birth_date: birthDate || null,
        saju_info: sajuInfo || null,
      },
      { onConflict: 'uid' }
    );

    if (profileUpsertError) {
      throw profileUpsertError;
    }

    return { success: true, message: '프로필이 성공적으로 업데이트되었습니다.' };

  } catch (error: any) {
    console.error('Error updating user profile:', error.message);
    return { success: false, message: `프로필 업데이트 중 오류가 발생했습니다: ${error.message}` };
  }
}


export async function listSupabaseUsers(
  limit: number = 100,
  offset: number = 0
): Promise<{ users: AppUser[]; nextPageToken?: string; error?: string }> {
  try {
    // Supabase admin.listUsers is not directly available like Firebase.
    // We fetch from auth.users and then enrich with profile data.
    const { data: authUsersData, error: authUsersError } = await supabaseAdmin.auth.admin.listUsers({ limit, offset });

    if (authUsersError) {
      throw authUsersError;
    }

    const users: AppUser[] = await Promise.all(authUsersData.users.map(async (userRecord: any) => {
      // Fetch profile for each user
      const { data: profileData, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('uid', userRecord.id)
        .single();

      let role = 'user';
      if (userRecord.email === 'admin@innerspell.com') {
        role = 'admin';
      } else if (profileData?.role) {
        role = profileData.role;
      }

      return {
        uid: userRecord.id,
        email: userRecord.email,
        displayName: userRecord.user_metadata?.display_name || userRecord.email,
        photoURL: userRecord.user_metadata?.photo_url || '',
        creationTime: userRecord.created_at,
        lastSignInTime: userRecord.last_sign_in_at,
        role: role,
        birthDate: profileData?.birth_date,
        sajuInfo: profileData?.saju_info,
        subscriptionStatus: profileData?.subscription_status || 'free',
      };
    }));

    // Supabase listUsers does not return a nextPageToken directly.
    // You would typically implement pagination using offset/limit.
    // For simplicity, we'll just return the fetched users.
    return {
      users,
      nextPageToken: authUsersData.users.length === limit ? String(offset + limit) : undefined,
    };
  } catch (error: any) {
    console.error('Error listing Supabase users:', error.message);
    return {
      users: [],
      error: `사용자 목록을 가져오는 데 실패했습니다: ${error.message}`,
    };
  }
}

export async function changeUserRole(uid: string, newRole: string): Promise<{ success: boolean, message: string }> {
  try {
    // Update role in the profiles table
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole })
      .eq('uid', uid);

    if (error) {
      throw error;
    }

    return { success: true, message: `사용자 ${uid}의 역할을 '${newRole}'(으)로 성공적으로 변경했습니다.` };
  } catch (error: any) {
    console.error('Error changing user role:', error.message);
    return { success: false, message: `사용자 역할 변경 중 오류가 발생했습니다: ${error.message}` };
  }
}
