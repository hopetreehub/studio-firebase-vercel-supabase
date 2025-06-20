
'use client';

import type React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Allow access to public pages
      const publicPaths = ['/', '/sign-in', '/sign-up', '/blog', '/encyclopedia', '/community'];
      const isPublicRootPath = publicPaths.includes(pathname);
      const isPublicSubPath = pathname.startsWith('/blog/') || pathname.startsWith('/encyclopedia/');
      
      if (!isPublicRootPath && !isPublicSubPath) {
        router.push('/sign-in?redirect=' + encodeURIComponent(pathname));
      }
    }
  }, [user, loading, router, pathname]);

  // Show a spinner while auth state is loading for protected pages
  const protectedPaths = ['/reading', '/profile', '/settings', '/admin'];
  const isProtectedPath = protectedPaths.some(p => pathname.startsWith(p));

  if (loading && isProtectedPath) { 
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" />
      </div>
    );
  }
  
  // If it's a protected page and auth has loaded but there's no user,
  // the useEffect above will handle redirection.
  // We prevent rendering children here to avoid flicker before redirect.
  if (!loading && !user && isProtectedPath) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="large" /> {/* Or a more specific "Redirecting..." message */}
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
