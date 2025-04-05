
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const Header = () => {
  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Telemedicine', href: '/telemedicine' },
    { label: 'Mental Health', href: '/mental-health' },
    { label: 'Emergency', href: '/emergency' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-bold">HealthBridge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" className="text-sm font-medium">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
