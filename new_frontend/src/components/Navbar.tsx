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
import {useNavigate} from 'react-router-dom';
import AccountSettings from "@/pages/AccountSettings.tsx";


export function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  //  const [isLoggedIn, setIsLoggedIn] = useState(false); // Zustand für Login-Status
    const location = useLocation();
    const navigate = useNavigate();

    const token = localStorage.getItem('jwt');
const isLoggedIn= Boolean(token);

    const user = {
        name: 'Benutzer',
        email: 'benutzer@beispiel.de',
    };

    const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);


    const handleLogout = () => {
     //   setIsLoggedIn(false);
        localStorage.removeItem('jwt')
        navigate("/");
    };

    return (
        <header className="w-full bg-background border-b border-border/30 sticky top-0 z-30">
            <div className="container mx-auto flex h-16 items-center px-4">
                {/* Logo links */}
                <div className="flex-1">
                    <Link to="/" className="flex items-center">
                        <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400"/>
                        <span
                            className="ml-2 text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Data-Visualisation</span>
                    </Link>
                </div>

                {/* Navigation in der Mitte */}
                <NavigationMenu className="hidden md:flex mx-auto">
                    <NavigationMenuList className="flex space-x-2">
                        <NavigationMenuItem>
                            <Link
                                to="/"
                                className={cn(
                                    "font-medium px-4 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    location.pathname === "/" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                )}
                            >
                                Home
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/datasets"
                                className={cn(
                                    "font-medium px-4 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    location.pathname === "/datasets" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                )}
                            >
                              Datensätze
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/diagrams"
                                className={cn(
                                    "font-medium px-4 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    location.pathname === "/diagrams" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                )}
                            >
                                Erstellen
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/saved"
                                className={cn(
                                    "font-medium px-4 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    location.pathname === "/saved" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                )}
                            >
                                Diagramme
                            </Link>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <Link
                                to="/import"
                                className={cn(
                                    "font-medium px-4 py-2 rounded-md transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/20",
                                    location.pathname === "/import" && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                                )}
                            >
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
                        <Menu className="h-5 w-5"/>
                    </Button>

                    <ThemeSwitcher/>

                    {/*Account-Einstellungen nur anzeigen, wenn JWT vorhanden === */}
                    {isLoggedIn && (
                        <Button
                            variant="outline"
                            className="border border-purple-300 text-black hover:bg-purple-50 dark:hover:bg-purple-900/20"
                            asChild
                        >
                            <Link to="/accountSettings">
                                <User className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400" />
                                Account-Einstellungen
                            </Link>
                        </Button>
                    )}

                    {/* Bedingte Anzeige von Login oder Benutzer-Avatar */}
                    {isLoggedIn ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full">
                                    <Avatar
                                        className="h-8 w-8 border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/30">
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
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem>
                                    <Link to="/accountSettings" className="cursor-pointer flex items-center">
                                        <User className="mr-2 h-4 w-4"/>
                                        <span>Account-Einstellungen</span>
                                    </Link>

                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link to="/settings" className="cursor-pointer flex items-center">
                                        <Settings className="mr-2 h-4 w-4"/>
                                        <span>Einstellungen</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator/>
                                <DropdownMenuItem onClick={handleLogout}
                                                  className="cursor-pointer text-red-500 hover:text-red-500 focus:text-red-500">
                                    <LogOut className="mr-2 h-4 w-4"/>
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
                                <LogIn className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400"/>
                                Anmelden
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={toggleMobileMenu}/>
                    <div
                        className="fixed top-0 right-0 h-full w-3/4 max-w-xs bg-background p-6 shadow-lg animate-in slide-in-from-right">
                        {/* Mobile menu content */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400"/>
                                <span
                                    className="font-bold text-xl bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">DataViz</span>
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
                                    <path d="M18 6 6 18"/>
                                    <path d="m6 6 12 12"/>
                                </svg>
                            </Button>
                        </div>
                        <nav className="grid gap-2">
                            <div>
                                <h3 className="font-medium text-lg mb-2 text-purple-700 dark:text-purple-300">Übersicht</h3>
                                <ul className="grid gap-1 pl-2">
                                    <li>
                                        <Link
                                            to="/"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Home
                                        </Link>
                                    </li>
                                    <li>

                                    </li>
                                    <li>
                                        <Link
                                            to="/datasets"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                          Datensätze
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/diagrams"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Erstellen
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/saved"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Diagramme
                                        </Link>
                                    </li>

                                    <li>
                                        <Link
                                            to="/import"
                                            className="block py-2 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                            onClick={toggleMobileMenu}
                                        >
                                            Daten importieren
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
                                        <LogIn className="h-4 w-4 mr-2 text-purple-600 dark:text-purple-400"/>
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
