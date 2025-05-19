import React, {useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Database, BarChart3, Home, LogIn, Menu, Settings, LogOut, User} from 'lucide-react';
import {Button} from './ui/button';
import {ThemeSwitcher} from './ThemeSwitcher';
import {Avatar, AvatarFallback} from './ui/avatar';
import {cn} from '../lib/utils';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from './ui/navigation-menu';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';


export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für Login-Status
    const location = useLocation();
    const navigate = useNavigate();

    const user = {
        name: 'Benutzer',
        email: 'benutzer@beispiel.de',
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

    // Diese Funktion simuliert den Login/Logout
    const toggleLogin = () => {
        setIsLoggedIn(!isLoggedIn);
    };
    const handleLogout = () => {
        setIsLoggedIn(false);
        navigate("/");
    };

    return (
        <header className="w-full bg-background border-b border-border/30 sticky top-0 z-30">
            <div className="container mx-auto flex h-16 items-center px-4">
                {/* Logo links */}
                <div className="flex-1">
                    <Link to="/" className="flex items-center">
                        <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                        <span className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Data-Visualisation</span>
                    </Link>
                </div>

                {/* Navigation in der Mitte */}
                <NavigationMenu className="hidden md:flex mx-auto">
                    <NavigationMenuList className="flex space-x-2">
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={cn(
                                "font-medium",
                                location.pathname === "/" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            )}>
                                Dashboard
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="grid gap-3 p-4 md:w-[500px] lg:w-[600px]">
                                    <Link to="/" className="block">
                                        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
                                            <div className="flex items-center mb-2">
                                                <Home className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                                                <h3 className="text-base font-medium">Übersicht</h3>
                                            </div>
                                            <p className="text-sm text-muted-foreground">Alle Ihre Daten und Visualisierungen auf einen Blick</p>
                                        </div>
                                    </Link>

                                    <Link to="/dashboards" className="block p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                                        <div className="flex items-center mb-1">
                                            <BarChart3 className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
                                            <h3 className="text-base font-medium">Meine Dashboards</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">Gespeicherte Dashboards anzeigen und bearbeiten</p>
                                    </Link>

                                    <Link to="/datasets" className="block p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors">
                                        <div className="flex items-center mb-1">
                                            <Database className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400" />
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
                                location.pathname === "/visualizations" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            )}>
                                Visualisierungen
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <div className="p-4 md:w-[400px]">
                                    <ul className="grid gap-3">
                                        <li className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors">
                                            <Link to="/visualizations/charts" className="block">Diagramme</Link>
                                        </li>
                                        <li className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors">
                                            <Link to="/visualizations/maps" className="block">Karten</Link>
                                        </li>
                                        <li className="p-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition-colors">
                                            <Link to="/visualizations/tables" className="block">Tabellen</Link>
                                        </li>
                                    </ul>
                                </div>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link to="/import" className="inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20">
                                Import
                            </Link>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Rechte Seite */}
                <div className="flex flex-1 items-center justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                        onClick={toggleMobileMenu}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>

                    <ThemeSwitcher />

                    {/* Bedingte Anzeige von Login oder Benutzer-Avatar */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar className="h-8 w-8 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30">
                                        <AvatarFallback className="text-purple-700 dark:text-purple-300">
                                            {user?.name?.charAt(0).toUpperCase() || 'B'}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <div className="flex items-center justify-start gap-2 p-2">
                                    <div className="flex flex-col space-y-1 leading-none">
                                        <p className="font-medium">{user?.name || 'Benutzer'}</p>
                                        <p className="text-sm text-muted-foreground">{user?.email || 'benutzer@beispiel.de'}</p>
                                    </div>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Link to="/accountSettings" className="cursor-pointer flex items-center">
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>Account-Einstellungen</span>
                                    </Link>

                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="cursor-pointer flex items-center">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Einstellungen</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout}
                                                  className="cursor-pointer text-red-500 hover:text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Abmelden</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button variant="outline"
                                className="border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                                asChild
                        >
                            <Link to="/login">
                                <LogIn className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                                Anmelden
                            </Link>
                        </Button>
                    )}
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
                                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                <span className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">DataViz</span>
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
                                <h3 className="font-medium text-lg mb-2 text-purple-700 dark:text-purple-300">Dashboard</h3>
                                <ul className="grid gap-1 pl-2">
                                    <li>
                                        <Link
                                            to="/"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Übersicht
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/dashboards"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Meine Dashboards
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/datasets"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Meine Datensätze
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="font-medium text-lg mb-2 text-purple-700 dark:text-purple-300">Visualisierungen</h3>
                                <ul className="grid gap-1 pl-2">
                                    <li>
                                        <Link
                                            to="/visualizations"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Alle Visualisierungen
                                        </Link>
                                    </li>
                                </ul>
                            </div>

                            {!isLoggedIn && (
                                <Button
                                    variant="outline"
                                    className="mt-2 border-purple-200 dark:border-purple-800"
                                    asChild
                                    onClick={toggleMobileMenu}
                                >
                                    <Link to="/login">
                                        <LogIn className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                                        Anmelden
                                    </Link>
                                </Button>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
