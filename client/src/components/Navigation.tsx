import React from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from "@/components/ui/button";
import { Home, Repeat2, Wallet, Settings } from 'lucide-react';

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex gap-6 md:gap-8">
          <Link href="/">
            <Button variant={location === '/' ? 'default' : 'ghost'} size="sm">
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          <Link href="/swap">
            <Button variant={location === '/swap' ? 'default' : 'ghost'} size="sm">
              <Repeat2 className="h-4 w-4 mr-2" />
              Swap
            </Button>
          </Link>
          <Link href="/tokens">
            <Button variant={location === '/tokens' ? 'default' : 'ghost'} size="sm">
              <Wallet className="h-4 w-4 mr-2" />
              Tokens
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant={location === '/admin' ? 'default' : 'ghost'} size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}