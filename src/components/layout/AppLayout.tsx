'use client';

import type React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation'; // usePathname 추가
import { useEffect } from 'react';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth(); // 이 loading 값은 AppLayout이 렌더링될 때 false입니다.
  const router = useRouter();
  const pathname = usePathname(); // window.location.pathname 대신 사용

  useEffect(() => {
    // AuthProvider가 초기 로딩 스피너를 처리합니다.
    // 이 useEffect는 AuthProvider의 로딩이 false일 때 실행됩니다.
    if (!loading && !user) { // 인증 상태가 확인되었고 사용자가 없는 경우
      const publicPaths = ['/', '/blog', '/encyclopedia']; 
      
      // 현재 경로가 공개 경로가 아니라면 /sign-in으로 리디렉션합니다.
      // /sign-in, /sign-up 경로는 RootLayoutClient에서 처리되므로 AppLayout에 도달하지 않습니다.
      if (!publicPaths.includes(pathname)) {
        router.push('/sign-in?redirect=' + encodeURIComponent(pathname));
      }
    }
  }, [user, loading, router, pathname]);

  // AuthProvider가 초기 로딩 화면을 처리하므로 여기서는 스피너가 필요 없습니다.
  // 이 지점에 도달했다면 AuthProvider의 loading은 false입니다.

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
