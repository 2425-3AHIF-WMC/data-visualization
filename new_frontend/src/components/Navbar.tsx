import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, BarChart3, Home, Menu, ChevronDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
      <header className="w-full bg-background border-b border-border/30">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Data-Visualisation
          </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {/* Dashboard */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                    className={cn(
                        'font-medium',
                        location.pathname === '/' && 'bg-primary text-primary-foreground'
                    )}
                >
                  Dashboard <ChevronDown className="h-4 w-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[500px] lg:w-[600px]">
                    <Link to="/" className="block p-4 hover:bg-accent rounded-lg">
                      <div className="flex items-center mb-2">
                        <Home className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Übersicht</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alle Ihre Daten und Visualisierungen auf einen Blick
                      </p>
                    </Link>
                    <Link to="/dashboards" className="block p-4 hover:bg-accent rounded-lg">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Meine Dashboards</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Gespeicherte Dashboards anzeigen und bearbeiten
                      </p>
                    </Link>
                    <Link to="/datasets" className="block p-4 hover:bg-accent rounded-lg">
                      <div className="flex items-center mb-2">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Meine Datensätze</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alle hochgeladenen Datensätze verwalten
                      </p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Visualisierungen */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                    className={cn(
                        'font-medium',
                        location.pathname.startsWith('/visualizations') && 'bg-primary text-primary-foreground'
                    )}
                >
                  Visualisierungen <ChevronDown className="h-4 w-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 md:w-[400px]">
                    <ul className="grid gap-3">
                      <li>
                        <Link to="/visualizations/charts" className="block p-2 hover:bg-accent rounded-md">
                          Diagramme
                        </Link>
                      </li>
                      <li>
                        <Link to="/visualizations/maps" className="block p-2 hover:bg-accent rounded-md">
                          Karten
                        </Link>
                      </li>
                      <li>
                        <Link to="/visualizations/tables" className="block p-2 hover:bg-accent rounded-md">
                          Tabellen
                        </Link>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button variant="outline" className="hidden md:flex items-center" asChild>
              <Link to="/import">
                <Database className="h-4 w-4 mr-2" />
                Daten importieren
              </Link>
            </Button>
            <ThemeSwitcher />
            <Button variant="ghost" size="icon" asChild className="rounded-full">
              <Link to="/login">
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu} />
              <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-background p-6 shadow-lg animate-in slide-in-from-right">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span className="font-bold text-xl">DataViz</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                    <span className="sr-only">Close</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M18 6 6 18" />
                      <path d="m6 6 12 12" />
                    </svg>
                  </Button>
                </div>
                <nav className="grid gap-4">
                  <div>
                    <h3 className="font-medium text-lg mb-2">Dashboard</h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link to="/" onClick={toggleMobileMenu} className="block py-2 hover:text-primary">
                          Übersicht
                        </Link>
                      </li>
                      <li>
                        <Link to="/dashboards" onClick={toggleMobileMenu} className="block py-2 hover:text-primary">
                          Meine Dashboards
                        </Link>
                      </li>
                      <li>
                        <Link to="/datasets" onClick={toggleMobileMenu} className="block py-2 hover:text-primary">
                          Meine Datensätze
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-lg mb-2">Visualisierungen</h3>
                    <ul className="space-y-1 pl-2">
                      <li>
                        <Link to="/visualizations" onClick={toggleMobileMenu} className="block py-2 hover:text-primary">
                          Alle Visualisierungen
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <Button variant="outline" asChild className="mt-4 w-full">
                    <Link to="/import" onClick={toggleMobileMenu} className="flex items-center justify-center py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      Daten importieren
                    </Link>
                  </Button>
                </nav>
              </div>
            </div>
        )}
      </header>
  );
}
