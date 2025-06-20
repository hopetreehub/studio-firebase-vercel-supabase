
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
    console.log(`Successfully listed ${users.length} Firebase users.`);
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
  console.log("This is a placeholder action. Actual role change requires Firebase Functions and admin.auth().setCustomUserClaims().");
  
  // Simulate a delay as if a backend operation was happening
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real app, you would:
  // 1. Verify the requester has admin privileges.
  // 2. Call a Firebase Function that uses the Admin SDK:
  //    await admin.auth().setCustomUserClaims(uid, { role: newRole });
  // 3. Potentially update a 'user_roles' collection in Firestore for easier querying if needed,
  //    but Firebase Auth custom claims are the source of truth for roles.
  //    e.g., await firestore.collection('user_meta').doc(uid).set({ role: newRole }, { merge: true });

  // For now, return a success message indicating simulation.
  const message = `(시뮬레이션) 사용자 ${uid}의 역할을 '${newRole}'(으)로 변경하는 요청을 처리했습니다. 실제 역할은 Firebase Custom Claims 설정을 통해 적용됩니다.`;
  return { success: true, message: message };
}

