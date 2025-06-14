'use client';

import type React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Allow access to certain public pages even if not logged in
      const publicPaths = ['/', '/blog', '/encyclopedia']; // Add any other public paths
      const currentPath = window.location.pathname;
      if (!publicPaths.includes(currentPath) && !currentPath.startsWith('/admin')) { // Admin path will be handled separately or assume it needs auth
         // For now, let's assume /reading requires auth.
         // Admin routes should have their own specific protection logic if needed.
         if (currentPath === '/reading' || currentPath === '/admin/ai-config') {
            router.push('/sign-in?redirect=' + encodeURIComponent(currentPath));
         }
      }
    }
  }, [user, loading, router]);

  // Show spinner only if loading and user state is not yet determined.
  // This prevents flicker if auth check is very fast.
  if (loading && user === undefined) {
     return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
