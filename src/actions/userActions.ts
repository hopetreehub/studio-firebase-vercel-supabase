
'use server';

import { admin, firestore } from '@/lib/firebase/admin';
import type { UserRecord } from 'firebase-admin/auth';

export interface AppUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  creationTime?: string;
  lastSignInTime?: string;
  role?: string; 
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

export async function changeUserRole(uid: string, newRole: string): Promise<{ success: boolean, message: string }> {
  console.log(`(SIMULATION) Role change requested for UID: ${uid} to new role: '${newRole}'.`);
  
  // --- 중요 알림 ---
  // 이 함수는 현재 시뮬레이션으로만 작동합니다.
  // 실제 프로덕션 환경에서 사용자 역할을 변경하려면 Firebase Admin SDK를 사용하여
  // Firebase Functions (또는 다른 보안 백엔드 환경)에서
  // admin.auth().setCustomUserClaims(uid, { role: newRole }); 와 같이 호출해야 합니다.
  // Custom Claims는 Firebase Auth 토큰에 포함되어 클라이언트 및 보안 규칙에서 역할을 확인할 수 있게 합니다.
  // Firestore에 'user_roles' 같은 별도 컬렉션을 두어 역할을 관리할 수도 있지만,
  // Auth Custom Claims가 역할 관리의 주요 권장 방식입니다.
  // -----------------
  
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate backend operation delay

  const message = `(시뮬레이션) 사용자 ${uid}의 역할을 '${newRole}'(으)로 변경하는 요청을 처리했습니다. 실제 역할 변경은 Firebase Functions 및 Custom Claims 설정을 통해 서버에서 안전하게 이루어져야 합니다.`;
  return { success: true, message: message };
}
