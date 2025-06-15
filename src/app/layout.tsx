
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
// import { AuthProvider } from '@/context/AuthContext'; // AuthProvider 제거
import RootLayoutClient from './RootLayoutClient';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: 'InnerSpell - 당신의 내면을 탐험하세요',
  description: 'AI 기반 타로 해석과 함께 현대적인 영적 타로 서비스를 경험하세요.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        {/* Noto Sans KR for Korean text */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* <AuthProvider> */} {/* AuthProvider 제거 */}
            <RootLayoutClient>{children}</RootLayoutClient>
            <Toaster />
          {/* </AuthProvider> */} {/* AuthProvider 제거 */}
        </ThemeProvider>
      </body>
    </html>
  );
}
