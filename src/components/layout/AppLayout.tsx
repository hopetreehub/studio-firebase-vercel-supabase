
'use client';

import type React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // /sign-in, /sign-up 경로를 publicPaths에 추가하여 AppLayout이 리디렉션하지 않도록 합니다.
      // RootLayoutClient에서 이 경로들은 AuthLayout으로 처리되지만, 안전장치로 추가합니다.
      const publicPaths = ['/', '/blog', '/encyclopedia', '/sign-in', '/sign-up'];
      
      if (!publicPaths.includes(pathname)) {
        router.push('/sign-in?redirect=' + encodeURIComponent(pathname));
      }
    }
  }, [user, loading, router, pathname]);

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
