import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Forum', href: '/forum' },
    { label: 'Education', href: '/education' },
    { label: 'About', href: '/about' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/">
            <div className="text-primary-dark text-2xl font-bold flex items-center cursor-pointer">
              <span className="material-icons mr-2">favorite</span>
              <span>HealthBridge</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <span className="text-neutral-700 hover:text-primary-dark font-medium cursor-pointer">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <Button className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Sign In
          </Button>
          
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <button className="md:hidden text-neutral-700">
                <span className="material-icons">menu</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <span 
                      className="text-lg font-medium hover:text-primary cursor-pointer"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
                <Button className="mt-4 w-full">Sign In</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
