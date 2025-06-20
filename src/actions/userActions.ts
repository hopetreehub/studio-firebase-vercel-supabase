
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

// Placeholder for actual role change - requires backend logic (e.g., Firebase Function to set custom claims)
export async function changeUserRole(uid: string, newRole: string): Promise<{ success: boolean, message: string }> {
  // In a real application, this would involve calling a Firebase Function
  // that uses the Admin SDK to set custom claims: admin.auth().setCustomUserClaims(uid, { role: newRole });
  
  // For now, this is a simulation.
  console.log(`(SIMULATION) Role change requested for user ${uid} to '${newRole}'. Backend implementation (e.g., Firebase Function with setCustomUserClaims) is required for this to take actual effect.`);
  
  // Simulate a potential update in a separate user roles collection for display purposes if desired,
  // but this won't affect Firebase Auth custom claims directly.
  try {
    // Example: if you had a 'user_roles' collection to mirror claims for easier querying/display:
    // await firestore.collection('user_roles').doc(uid).set({ role: newRole }, { merge: true });
    
    // This toast message will be shown to the admin in the UI.
    return { success: true, message: `(시뮬레이션) 사용자 ${uid}의 역할을 '${newRole}'(으)로 변경 요청했습니다. 실제 역할 적용은 백엔드 설정(Firebase Custom Claims)이 필요합니다.` };
  } catch (error: any) {
    console.error('Error during simulated role change:', error);
    return { success: false, message: `(시뮬레이션) 역할 변경 중 오류: ${error.message}` };
  }
}
