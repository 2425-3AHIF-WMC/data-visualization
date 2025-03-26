
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme based on system preference
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-full bg-secondary/80 hover:bg-secondary border border-border hover:border-primary/20 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        <Sun
          className={`w-4 h-4 absolute transition-all duration-300 ${
            isDarkMode
              ? "opacity-0 rotate-90 translate-y-2"
              : "opacity-100 rotate-0 translate-y-0"
          }`}
        />
        <Moon
          className={`w-4 h-4 absolute transition-all duration-300 ${
            isDarkMode
              ? "opacity-100 rotate-0 translate-y-0"
              : "opacity-0 -rotate-90 -translate-y-2"
          }`}
        />
      </div>
    </button>
  );
};
