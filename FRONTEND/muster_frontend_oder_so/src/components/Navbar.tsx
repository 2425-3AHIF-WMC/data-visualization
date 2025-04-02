import { Bell, Search, Settings } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/hooks/useAuth";

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="w-full bg-background/50 backdrop-blur-sm border-b border-border sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center">
          <div className="relative mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-72 h-9 pl-10 pr-4 text-sm rounded-md bg-secondary/60 border border-border focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors">
            <Settings size={20} />
          </button>

          <div className="h-5 w-[1px] bg-border mx-1"></div>

          <ThemeToggle />

          {isAuthenticated && user && (
            <div className="flex items-center gap-2 ml-2">
              <div className="text-right mr-2">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{user.email}</p>
              </div>
              <div className="relative">
                <button className="h-9 w-9 rounded-full overflow-hidden border border-border hover:border-primary/40 transition-colors">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
                      {user.name.charAt(0)}
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


