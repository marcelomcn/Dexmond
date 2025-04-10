import React from "react";
import { Link } from "wouter";

export const Navbar: React.FC = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);

  React.useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm border-b border-border/50 flex justify-between items-center p-4">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
          Dexmond
        </h1>
        <div className="hidden md:flex gap-4 ml-8">
          <Link href="/">
            <span className={`text-xs font-medium ${currentPath === '/' ? 'text-primary' : 'text-white hover:text-primary'} cursor-pointer`}>
              Trade
            </span>
          </Link>
          <Link href="/pools">
            <span className={`text-xs font-medium ${currentPath === '/pools' ? 'text-primary' : 'text-white hover:text-primary'} cursor-pointer`}>
              Pools
            </span>
          </Link>
          <Link href="/analytics">
            <span className={`text-xs font-medium ${currentPath === '/analytics' ? 'text-primary' : 'text-white hover:text-primary'} cursor-pointer`}>
              Analytics
            </span>
          </Link>
          <Link href="/cross-chain">
            <span className={`text-xs font-medium ${currentPath === '/cross-chain' ? 'text-primary' : 'text-white hover:text-primary'} cursor-pointer`}>
              Cross-Chain
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};