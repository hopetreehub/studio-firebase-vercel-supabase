'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { UserNav } from './UserNav';
import { Sparkles } from 'lucide-react'; // Using Sparkles for a mystic touch

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/reading', label: 'Tarot Reading' },
  { href: '/encyclopedia', label: 'Encyclopedia' },
  { href: '/blog', label: 'Blog' },
  { href: '/admin/ai-config', label: 'Admin AI Config'}
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Sparkles className="h-7 w-7 text-primary" />
          <span className="font-headline text-2xl font-bold text-primary">MysticSight Tarot</span>
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
        <div className="flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
