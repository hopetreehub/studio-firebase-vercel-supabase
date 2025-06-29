
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase/client';
import { Spinner } from '@/components/ui/spinner';
import { getUserProfile, type AppUser } from '@/actions/userActions';

interface AuthContextType {
  user: AppUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const devAdminUser: AppUser = {
  uid: 'dev-admin-uid',
  email: 'admin@innerspell.com',
  displayName: '개발자 관리자',
  photoURL: `https://i.pravatar.cc/150?u=dev-admin`,
  role: 'admin',
  subscriptionStatus: 'paid', // Dev admin is a paid user to hide ads
  creationTime: new Date().toISOString(),
  lastSignInTime: new Date().toISOString(),
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUser = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    // --- Development Mode: Auto-login as Admin ---
    if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
      console.warn("DEV MODE: Logged in as mock admin user. To disable, remove NEXT_PUBLIC_DEV_MODE from .env file.");
      setUser(devAdminUser);
      setFirebaseUser(null); // No real Firebase user in this mode
      setLoading(false);
      return;
    }
    // --- End Development Mode ---

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentFirebaseUser) => {
        setLoading(true);
        if (currentFirebaseUser) {
          setFirebaseUser(currentFirebaseUser);
          const profile = await getUserProfile(currentFirebaseUser.uid);
          
          if (profile) {
             setUser(profile);
          } else {
            // Fallback for when profile doc doesn't exist yet for a new user
            setUser({
              uid: currentFirebaseUser.uid,
              email: currentFirebaseUser.email,
              displayName: currentFirebaseUser.displayName,
              photoURL: currentFirebaseUser.photoURL,
              role: 'user', // Default to 'user'
              subscriptionStatus: 'free',
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
      // If firebase auth is not configured, stop loading and set user to null
      setLoading(false);
      setUser(null);
      setFirebaseUser(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // While waiting for the initial auth state, show a loader
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }

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
