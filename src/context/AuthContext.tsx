
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Spinner } from '@/components/ui/spinner';

// A more useful user object for the app, including the role
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
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

  /* --- Original Auth Logic - Commented out for development ---
  useEffect(() => {
    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
        if (currentFirebaseUser) {
          setFirebaseUser(currentFirebaseUser);
          try {
            // Force refresh to get the latest custom claims.
            const idTokenResult = await currentFirebaseUser.getIdTokenResult(true);
            const role = idTokenResult.claims.role === 'admin' ? 'admin' : 'user';
            
            setUser({
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              photoURL: currentFirebaseUser.photoURL,
              role: role,
            });
          } catch (error) {
            console.error("Error fetching user custom claims:", error);
            setUser({
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              photoURL: currentFirebaseUser.photoURL,
              role: 'user', // Default to 'user' on error
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
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }
  */

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading }}>
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
