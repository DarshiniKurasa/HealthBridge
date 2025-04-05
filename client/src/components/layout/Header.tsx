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
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold">HealthBridge</span>
        </Link>
        <nav className="flex items-center space-x-6 ml-6">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost">{item.label}</Button>
            </Link>
          ))}
        </nav>
        <div className="ml-auto">
          <Button variant="default">Try Demo</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;