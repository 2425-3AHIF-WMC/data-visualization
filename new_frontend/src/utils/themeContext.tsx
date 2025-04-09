
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';

type ColorScheme = 'blue' | 'green' | 'purple' | 'pink' | 'orange' | 'red' | 'teal';
type Mode = 'light' | 'dark';
type Theme = `${Mode}-${ColorScheme}`;

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themes: { value: Theme; label: string; mode: Mode; colorScheme: ColorScheme }[];
  toggleMode: () => void;
  currentMode: Mode;
  currentColorScheme: ColorScheme;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const themes: { value: Theme; label: string; mode: Mode; colorScheme: ColorScheme }[] = [
  { value: 'light-blue', label: 'Licht Blau', mode: 'light', colorScheme: 'blue' },
  { value: 'light-green', label: 'Licht Grün', mode: 'light', colorScheme: 'green' },
  { value: 'light-purple', label: 'Licht Lila', mode: 'light', colorScheme: 'purple' },
  { value: 'light-pink', label: 'Licht Rosa', mode: 'light', colorScheme: 'pink' },
  { value: 'light-orange', label: 'Licht Orange', mode: 'light', colorScheme: 'orange' },
  { value: 'light-red', label: 'Licht Rot', mode: 'light', colorScheme: 'red' },
  { value: 'light-teal', label: 'Licht Türkis', mode: 'light', colorScheme: 'teal' },
  { value: 'dark-blue', label: 'Dunkel Blau', mode: 'dark', colorScheme: 'blue' },
  { value: 'dark-green', label: 'Dunkel Grün', mode: 'dark', colorScheme: 'green' },
  { value: 'dark-purple', label: 'Dunkel Lila', mode: 'dark', colorScheme: 'purple' },
  { value: 'dark-pink', label: 'Dunkel Rosa', mode: 'dark', colorScheme: 'pink' },
  { value: 'dark-orange', label: 'Dunkel Orange', mode: 'dark', colorScheme: 'orange' },
  { value: 'dark-red', label: 'Dunkel Rot', mode: 'dark', colorScheme: 'red' },
  { value: 'dark-teal', label: 'Dunkel Türkis', mode: 'dark', colorScheme: 'teal' },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('light-blue');
  const [currentMode, setCurrentMode] = useState<Mode>('light');
  const [currentColorScheme, setCurrentColorScheme] = useState<ColorScheme>('blue');

  // Load saved theme on initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem('data-canvas-theme') as Theme;
    if (savedTheme && themes.find(t => t.value === savedTheme)) {
      setThemeState(savedTheme);
      const foundTheme = themes.find(t => t.value === savedTheme);
      if (foundTheme) {
        setCurrentMode(foundTheme.mode);
        setCurrentColorScheme(foundTheme.colorScheme);
      }
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    themes.forEach(t => {
      root.classList.remove(`theme-${t.colorScheme}`);
    });
    
    // Add new theme classes
    root.classList.add(currentMode);
    root.classList.add(`theme-${currentColorScheme}`);
    
    // Save theme to localStorage
    localStorage.setItem('data-canvas-theme', theme);
  }, [theme, currentMode, currentColorScheme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    const foundTheme = themes.find(t => t.value === newTheme);
    if (foundTheme) {
      setCurrentMode(foundTheme.mode);
      setCurrentColorScheme(foundTheme.colorScheme);
    }
    
    toast({
      title: 'Theme geändert',
      description: `Design wurde zu "${themes.find(t => t.value === newTheme)?.label}" geändert.`,
    });
  };

  const toggleMode = () => {
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    setCurrentMode(newMode);
    setTheme(`${newMode}-${currentColorScheme}` as Theme);
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    setCurrentColorScheme(colorScheme);
    setTheme(`${currentMode}-${colorScheme}` as Theme);
  };

  return (
    <ThemeContext.Provider 
      value={{ 
        theme, 
        setTheme, 
        themes, 
        toggleMode, 
        currentMode, 
        currentColorScheme,
        setColorScheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme muss innerhalb eines ThemeProviders verwendet werden');
  }
  return context;
};
