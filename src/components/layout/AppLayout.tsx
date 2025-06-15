
'use client';

import type React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
// import { useAuth } from '@/context/AuthContext'; // useAuth 제거
// import { useRouter, usePathname } from 'next/navigation'; // useRouter, usePathname 제거 (필요시 유지)
// import { useEffect } from 'react'; // useEffect 제거 (필요시 유지)

export function AppLayout({ children }: { children: React.ReactNode }) {
  // const { user, loading } = useAuth(); // useAuth 관련 로직 제거
  // const router = useRouter();
  // const pathname = usePathname();

  // useEffect(() => { // 리디렉션 로직 제거
  //   if (!loading && !user) {
  //     const publicPaths = ['/', '/blog', '/encyclopedia', '/sign-in', '/sign-up'];
      
  //     if (!publicPaths.includes(pathname)) {
  //       router.push('/sign-in?redirect=' + encodeURIComponent(pathname));
  //     }
  //   }
  // }, [user, loading, router, pathname]);

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
