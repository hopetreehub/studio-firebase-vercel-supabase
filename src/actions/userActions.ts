
'use server';

import { admin } from '@/lib/firebase/admin';
import type { UserRecord } from 'firebase-admin/auth';

export interface AppUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  creationTime?: string;
  lastSignInTime?: string;
  // Add other relevant fields if needed
}

export async function listFirebaseUsers(
  limit: number = 100,
  pageToken?: string
): Promise<{ users: AppUser[]; nextPageToken?: string; error?: string }> {
  try {
    const listUsersResult = await admin.auth().listUsers(limit, pageToken);
    const users: AppUser[] = listUsersResult.users.map((userRecord: UserRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
    }));

    return {
      users,
      nextPageToken: listUsersResult.pageToken,
    };
  } catch (error: any) {
    console.error('Error listing Firebase users:', error);
    return {
      users: [],
      error: `사용자 목록을 가져오는 데 실패했습니다: ${error.message}`,
    };
  }
}

    