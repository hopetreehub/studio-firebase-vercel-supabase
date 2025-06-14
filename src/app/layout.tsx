
import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import RootLayoutClient from './RootLayoutClient'; // New client component
import './globals.css';

export const metadata: Metadata = {
  title: 'MysticSight Tarot',
  description: 'Modern spiritual tarot services with AI-powered interpretations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <RootLayoutClient>{children}</RootLayoutClient>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
