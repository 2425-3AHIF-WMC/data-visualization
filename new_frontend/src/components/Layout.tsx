
import React from 'react';
import { Navbar } from './Navbar';
import { cn } from '../lib/utils';
import { useTheme } from '../utils/themeContext';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
  fullWidth?: boolean;
  heroContent?: React.ReactNode;
}

export function Layout({ children, className, fullWidth = false, heroContent }: LayoutProps) {
  const { currentMode } = useTheme();
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      {heroContent && (
        <div className="w-full bg-primary/10 py-8">
          <div className={cn(
            "mx-auto w-full",
            fullWidth ? "max-w-full px-4" : "container px-4"
          )}>
            {heroContent}
          </div>
        </div>
      )}
      
      <main className={cn(
        "flex-1 mx-auto w-full py-6 px-4 transition-all duration-300",
        fullWidth ? "max-w-full" : "container",
        className
      )}>
        <div className="relative z-20">
          {children}
        </div>
      </main>
    </div>
  );
}
