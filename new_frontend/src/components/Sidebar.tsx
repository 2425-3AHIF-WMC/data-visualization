
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { BarChart3, FileUp, Home, Menu, Settings, X } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';

type SidebarLink = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsOpen(!isOpen);

  const links: SidebarLink[] = [
    { href: '/', label: 'Dashboard', icon: <Home className="h-5 w-5" /> },
    { href: '/import', label: 'Daten Importieren', icon: <FileUp className="h-5 w-5" /> },
    { href: '/visualizations', label: 'Visualisierungen', icon: <BarChart3 className="h-5 w-5" /> },
    { href: '/settings', label: 'Einstellungen', icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <>
      {/* Mobile Trigger */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-40 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar Backdrop on Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 transform lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <h2 className="text-xl font-bold">Data Canvas</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Sidebar Links */}
          <nav className="flex-1 overflow-auto py-4">
            <ul className="space-y-1 px-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className={cn(
                      "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
