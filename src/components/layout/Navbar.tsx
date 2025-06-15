
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserNav } from './UserNav'; // Restored
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { href: '/', label: '홈' },
  { href: '/reading', label: '타로 읽기' },
  { href: '/encyclopedia', label: '카드 백과' },
  { href: '/blog', label: '블로그' },
  { href: '/admin', label: '관리자'} // Updated label and href
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="InnerSpell 로고" width={32} height={32} className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold text-primary">InnerSpell</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-primary text-foreground/80"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <UserNav /> {/* Restored */}
        </div>
      </div>
    </header>
  );
}
