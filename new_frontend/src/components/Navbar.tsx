
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Database, BarChart3, Home, LogIn, Menu, Settings, ChevronDown, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { ThemeSwitcher } from './ThemeSwitcher';
import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '../lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './ui/navigation-menu';

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="w-full bg-background border-b border-border/30">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center">
          <Link to="/" className="flex items-center mr-6">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Data Visualisation</span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "bg-primary/10 text-primary font-medium",
                  location.pathname === "/" && "bg-primary text-primary-foreground"
                )}>
                  Dashboard <ChevronDown className="h-4 w-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 md:w-[500px] lg:w-[600px]">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center mb-2">
                        <Home className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Übersicht</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Alle Ihre Daten und Visualisierungen auf einen Blick</p>
                    </div>
                    <Link to="/dashboards" className="block p-4 hover:bg-accent rounded-lg">
                      <div className="flex items-center mb-1">
                        <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Meine Dashboards</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Gespeicherte Dashboards anzeigen und bearbeiten</p>
                    </Link>
                    <Link to="/datasets" className="block p-4 hover:bg-accent rounded-lg">
                      <div className="flex items-center mb-1">
                        <Database className="h-5 w-5 mr-2 text-primary" />
                        <h3 className="text-base font-medium">Meine Datensätze</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">Alle hochgeladenen Datensätze verwalten</p>
                    </Link>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "font-medium",
                  location.pathname.startsWith("/analytics") && "bg-primary text-primary-foreground"
                )}>
                  Analytik <ChevronDown className="h-4 w-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 md:w-[400px]">
                    <ul className="grid gap-3">
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/analytics/reports" className="block">Berichte</Link>
                      </li>
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/analytics/trends" className="block">Trends</Link>
                      </li>
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/analytics/metrics" className="block">Kennzahlen</Link>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className={cn(
                  "font-medium",
                  location.pathname === "/visualizations" && "bg-primary text-primary-foreground"
                )}>
                  Visualisierungen <ChevronDown className="h-4 w-4 ml-1" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-4 md:w-[400px]">
                    <ul className="grid gap-3">
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/visualizations/charts" className="block">Diagramme</Link>
                      </li>
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/visualizations/maps" className="block">Karten</Link>
                      </li>
                      <li className="p-2 hover:bg-accent rounded-md">
                        <Link to="/visualizations/tables" className="block">Tabellen</Link>
                      </li>
                    </ul>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="hidden md:flex items-center bg-white dark:bg-background border-slate-200 dark:border-slate-700"
            asChild
          >
            <Link to="/import">
              <Database className="h-4 w-4 mr-2" />
              Daten importieren
            </Link>
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <ThemeSwitcher />
          
          <Button variant="ghost" size="icon" asChild className="rounded-full">
            <Link to="/login">
              <Avatar className="h-8 w-8 border border-border">
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-background p-6 shadow-lg animate-in slide-in-from-right">
            {/* Mobile menu content */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="font-bold text-xl">DataViz</span>
              </div>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            </div>
            <nav className="grid gap-2">
              <div>
                <h3 className="font-medium text-lg mb-2">Dashboard</h3>
                <ul className="grid gap-1 pl-2">
                  <li>
                    <Link
                      to="/"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Übersicht
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/dashboards"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Meine Dashboards
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/datasets"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Meine Datensätze
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Analytik</h3>
                <ul className="grid gap-1 pl-2">
                  <li>
                    <Link
                      to="/analytics/reports"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Berichte
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/analytics/trends"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Trends
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Visualisierungen</h3>
                <ul className="grid gap-1 pl-2">
                  <li>
                    <Link
                      to="/visualizations"
                      className="block py-2 hover:text-primary"
                      onClick={toggleMobileMenu}
                    >
                      Alle Visualisierungen
                    </Link>
                  </li>
                </ul>
              </div>
              
              <Button
                className="mt-4"
                asChild
              >
                <Link to="/import" onClick={toggleMobileMenu}>
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
