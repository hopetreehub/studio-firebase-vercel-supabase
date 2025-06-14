import { Sparkles } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <div className="flex justify-center items-center mb-4">
          <Sparkles className="h-6 w-6 text-primary/70 mr-2" />
          <span className="font-headline text-xl text-primary/70">MysticSight Tarot</span>
        </div>
        <p className="text-sm">
          &copy; {currentYear} MysticSight Tarot. All rights reserved.
        </p>
        <p className="text-xs mt-2">
          Tarot readings are for entertainment purposes only.
        </p>
      </div>
    </footer>
  );
}
