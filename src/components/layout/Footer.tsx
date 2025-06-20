
import Image from 'next/image';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/reading', label: 'Tarot Reading' },
  { href: '/encyclopedia', label: 'Card Encyclopedia' },
  { href: '/blog', label: 'Blog' },
  // { href: '/admin', label: 'Admin'} // Admin link might not be suitable for a public footer
];

const policyItems = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  // Add more policy links if needed, e.g., Cookie Policy
];

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-border/40 bg-background/95 py-12 text-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          {/* Left Section: Logo and Copyright */}
          <div className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="inline-flex items-center space-x-2 mb-3 group">
              <Image src="/logo.png" alt="InnerSpell Logo" width={32} height={32} className="h-8 w-8 group-hover:opacity-80 transition-opacity" />
              <span className="font-headline text-2xl font-bold text-primary group-hover:text-primary/80 transition-colors">InnerSpell</span>
            </Link>
            <p className="text-xs text-muted-foreground">
              © {currentYear} InnerSpell. All rights reserved.
            </p>
          </div>

          {/* Middle Section: Navigation Links */}
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="font-semibold text-foreground mb-3 uppercase tracking-wider text-xs">Menu</h3>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section: Policy Links & Contact (Example) */}
          <div className="md:col-span-1 text-center md:text-left">
            <h3 className="font-semibold text-foreground mb-3 uppercase tracking-wider text-xs">Legal</h3>
            <nav className="flex flex-col space-y-2">
              {policyItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            {/* Optional: Add contact info or other links here */}
            {/* <p className="text-muted-foreground mt-4">contact@innerspell.com</p> */}
          </div>
        </div>
        
        {/* Optional: Add a small disclaimer or social media links at the very bottom if needed */}
        {/* <div className="mt-8 pt-8 border-t border-border/20 text-center text-xs text-muted-foreground/70">
          Tarot readings are for entertainment purposes.
        </div> */}
      </div>
    </footer>
  );
}
