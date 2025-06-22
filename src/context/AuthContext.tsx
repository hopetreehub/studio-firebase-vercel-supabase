
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Spinner } from '@/components/ui/spinner';
import { getUserProfile } from '@/actions/userActions';

// A more useful user object for the app, including the role and profile data
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
  birthDate?: string;
  sajuInfo?: string;
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // NOTE: This is a temporary setup for development to bypass login.
  const mockUser: AppUser = {
    uid: 'dev-user-01',
    email: 'dev@example.com',
    displayName: '개발자 계정',
    photoURL: null,
    role: 'admin',
    birthDate: '1990-01-01',
    sajuInfo: '이곳에 사주 정보 예시를 입력합니다. 예를 들어, 갑자일주, 식신격 등.',
  };
  const mockFirebaseUser = {
    uid: 'dev-user-01',
    email: 'dev@example.com',
    displayName: '개발자 계정',
    photoURL: null,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
  } as FirebaseUser;

  const [user, setUser] = useState<AppUser | null>(mockUser);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(mockFirebaseUser);
  const [loading, setLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUser = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  /* --- Original Auth Logic - Commented out for development ---
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
        setLoading(true);
        if (currentFirebaseUser) {
          setFirebaseUser(currentFirebaseUser);
          const profile = await getUserProfile(currentFirebaseUser.uid);
          
          if (profile) {
             setUser(profile);
          } else {
            // Fallback for when profile doc doesn't exist yet
            setUser({
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              photoURL: currentFirebaseUser.photoURL,
              role: 'user', // Default to 'user'
            });
          }
        } else {
          setUser(null);
          setFirebaseUser(null);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [refreshTrigger]); // re-run on refresh

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }
  */

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
