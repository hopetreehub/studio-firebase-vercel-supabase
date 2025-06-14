'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative py-20 md:py-32 bg-gradient-to-br from-background via-primary/5 to-primary/10 overflow-hidden rounded-xl shadow-lg border border-primary/10">
      <div className="absolute inset-0 opacity-5">
        {/* Decorative background pattern or subtle image */}
        {/* For example, a very faint star pattern or mystical symbols */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Unlock Your Destiny
            </span>
            <h1 className="font-headline text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary mb-6">
              Discover Your Path with MysticSight Tarot
            </h1>
            <p className="text-lg sm:text-xl text-foreground/80 mb-8 max-w-xl mx-auto md:mx-0">
              Gain clarity and insight with AI-powered tarot readings. Explore ancient wisdom interpreted for the modern seeker. Your journey to self-discovery starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md transition-transform hover:scale-105">
                <Link href="/reading">
                  Start Your Reading
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary/50 text-primary hover:bg-primary/5 shadow-md transition-transform hover:scale-105">
                <Link href="/encyclopedia">
                  Explore Cards
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="aspect-square max-w-md mx-auto md:max-w-none rounded-xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-105 group">
              <Image
                src="https://placehold.co/600x600.png"
                alt="Mystical Tarot Cards"
                width={600}
                height={600}
                priority
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                data-ai-hint="mystical tarot"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-8">
                <p className="text-primary-foreground text-center text-lg font-semibold">Unveil the Mysteries Within</p>
              </div>
            </div>
             <div className="absolute -top-8 -left-8 w-24 h-24 bg-primary/20 rounded-full filter blur-2xl animate-pulse opacity-50"></div>
             <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-accent/20 rounded-full filter blur-2xl animate-pulse opacity-50 animation-delay-2000"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
