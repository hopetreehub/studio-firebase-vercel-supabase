
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { UserNav } from './UserNav';
import { ThemeToggle } from './ThemeToggle';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Menu, X } from 'lucide-react'; // Added X for a potential close button inside sheet if needed

const navItems = [
  { href: '/', label: '홈' },
  { href: '/reading', label: '타로 읽기' },
  { href: '/encyclopedia', label: '카드 백과' },
  { href: '/blog', label: '블로그' },
  { href: '/community', label: '커뮤니티' },
  { href: '/admin', label: '관리자'}
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="InnerSpell 로고" width={32} height={32} className="h-8 w-8" />
          <span className="font-headline text-2xl font-bold text-primary">InnerSpell</span>
        </Link>
        
        {/* Desktop Navigation */}
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
          <UserNav />

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">메뉴 열기</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] sm:w-[320px] bg-background p-0">
                <SheetHeader className="p-4 border-b border-border/40">
                  <SheetTitle className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="InnerSpell 로고" width={28} height={28} />
                    <span className="font-headline text-xl font-bold text-primary">InnerSpell</span>
                  </SheetTitle>
                  {/* Optional: Close button inside sheet if default X is not preferred */}
                  {/* <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="absolute right-4 top-4">
                     <X className="h-5 w-5" />
                     <span className="sr-only">메뉴 닫기</span>
                  </Button> */}
                </SheetHeader>
                <nav className="flex flex-col p-4 space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground/80 hover:bg-accent hover:text-accent-foreground transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
