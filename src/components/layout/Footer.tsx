
import Image from 'next/image';

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
        <div className="flex justify-center items-center mb-4">
           {/* Assuming logo is placed in public/logo.png */}
          <Image src="/logo.png" alt="InnerSpell 로고" width={24} height={24} className="h-6 w-6 mr-2" />
          <span className="font-headline text-xl text-primary/70">InnerSpell</span>
        </div>
        <p className="text-sm">
          &copy; {currentYear} InnerSpell. 모든 권리 보유.
        </p>
        <p className="text-xs mt-2">
          타로 서비스는 오락 목적으로 제공됩니다.
        </p>
      </div>
    </footer>
  );
}
