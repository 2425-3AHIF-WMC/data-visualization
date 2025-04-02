
import {
  BarChart3,
  Clock,
  HelpCircle,
  LayoutDashboard,
  Menu,
  Settings,
  Users
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      title: "Analytics",
      icon: BarChart3,
      path: "/analytics",
    },
    {
      title: "History",
      icon: Clock,
      path: "/history",
    },
    {
      title: "Team",
      icon: Users,
      path: "/team",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings", 
    },
    {
      title: "Help",
      icon: HelpCircle,
      path: "/help",
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      className={`sidebar min-h-screen bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">D</span>
              </div>
              <span className="font-semibold tracking-tight">Personalized Data Visualisation</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-secondary transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.title}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <item.icon size={20} />
                    {!isCollapsed && <span>{item.title}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {user && (
          <div className="p-3 border-t border-border">
            <div className="flex items-center gap-3">
              {user.avatar && (
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 bg-secondary">
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
              )}
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              )}
              {!isCollapsed && (
                <button
                  onClick={logout}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
