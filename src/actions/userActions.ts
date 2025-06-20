
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
  role?: string; // Added for custom claims
  // Add other relevant fields if needed
}

export async function listFirebaseUsers(
  limit: number = 100,
  pageToken?: string
): Promise<{ users: AppUser[]; nextPageToken?: string; error?: string }> {
  try {
    const listUsersResult = await admin.auth().listUsers(limit, pageToken);
    const users: AppUser[] = listUsersResult.users.map((userRecord: UserRecord) => {
      let role = '사용자'; // Default role
      if (userRecord.customClaims && userRecord.customClaims.role) {
        role = userRecord.customClaims.role as string;
      }
      return {
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        creationTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastSignInTime,
        role: role,
      };
    });

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

// Placeholder for future role change action - requires backend logic (e.g., Firebase Function)
// export async function changeUserRole(uid: string, newRole: string): Promise<{ success: boolean, error?: string }> {
//   try {
//     // THIS REQUIRES A FIREBASE FUNCTION OR SIMILAR BACKEND TO SET CUSTOM CLAIMS
//     // await admin.auth().setCustomUserClaims(uid, { role: newRole });
//     console.log(`(시뮬레이션) 사용자 ${uid}의 역할을 ${newRole}(으)로 변경 요청됨. 백엔드 구현 필요.`);
//     return { success: true };
//   } catch (error: any) {
//     console.error('Error changing user role (simulation):', error);
//     return { success: false, error: `역할 변경 실패 (시뮬레이션): ${error.message}` };
//   }
// }
