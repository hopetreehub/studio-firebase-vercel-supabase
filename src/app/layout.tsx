
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import RootLayoutClient from './RootLayoutClient';
import './globals.css';
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: 'InnerSpell - 당신의 내면을 탐험하세요',
  description: 'AI 기반 타로 해석과 함께 현대적인 영적 타로 서비스를 경험하세요.',
  // Basic Open Graph and Twitter Card setup - can be overridden by specific pages
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://www.innerspell.com', // Replace with your actual domain
    siteName: 'InnerSpell',
    images: [
      {
        url: '/logo-og.png', // Replace with path to your open graph image in /public
        width: 1200,
        height: 630,
        alt: 'InnerSpell 로고',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    // title: (Handled by individual pages or default above)
    // description: (Handled by individual pages or default above)
    // images: ['/logo-twitter.png'], // Replace with path to your twitter card image in /public
    // site: '@yourTwitterHandle', // Optional: your Twitter handle
    // creator: '@creatorTwitterHandle', // Optional: content creator's Twitter handle
  },
  // You can add more global metadata here:
  // keywords: ['tarot', 'AI tarot', '타로', 'AI 타로', '운세', '영적 성장', '명상'],
  // themeColor: '#673AB7', // Example primary color
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
        {/* 
          If you are integrating Google AdSense, the script provided by AdSense
          would typically be placed here, or in a Script component from next/script
          for better performance management. Example:
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_PUBLISHER_ID"
               crossOrigin="anonymous"></script> 
        */}
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <RootLayoutClient>{children}</RootLayoutClient>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

    