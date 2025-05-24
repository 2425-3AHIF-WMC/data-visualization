import React, { createContext, useContext, useEffect, useState } from "react";

export type Mode = "light" | "dark";
export type ColorScheme = "blue" | "green" | "purple" | "pink" | "orange" | "red" | "teal";
export type ThemeType = `${Mode}-${ColorScheme}`;

interface ThemeContextValue {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleMode: () => void;
  currentMode: Mode;
  currentColorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
  themes: { value: ThemeType; mode: Mode; colorScheme: ColorScheme; label: string }[];
}

const themes: ThemeContextValue["themes"] = [
  { value: "light-blue", mode: "light", colorScheme: "blue", label: "Blau (Hell)" },
  { value: "dark-blue", mode: "dark", colorScheme: "blue", label: "Blau (Dunkel)" },
  { value: "light-green", mode: "light", colorScheme: "green", label: "Grün (Hell)" },
  { value: "dark-green", mode: "dark", colorScheme: "green", label: "Grün (Dunkel)" },
  { value: "light-purple", mode: "light", colorScheme: "purple", label: "Lila (Hell)" },
  { value: "dark-purple", mode: "dark", colorScheme: "purple", label: "Lila (Dunkel)" },
  { value: "light-pink", mode: "light", colorScheme: "pink", label: "Rosa (Hell)" },
  { value: "dark-pink", mode: "dark", colorScheme: "pink", label: "Rosa (Dunkel)" },
  { value: "light-orange", mode: "light", colorScheme: "orange", label: "Orange (Hell)" },
  { value: "dark-orange", mode: "dark", colorScheme: "orange", label: "Orange (Dunkel)" },
  { value: "light-red", mode: "light", colorScheme: "red", label: "Rot (Hell)" },
  { value: "dark-red", mode: "dark", colorScheme: "red", label: "Rot (Dunkel)" },
  { value: "light-teal", mode: "light", colorScheme: "teal", label: "Türkis (Hell)" },
  { value: "dark-teal", mode: "dark", colorScheme: "teal", label: "Türkis (Dunkel)" },
];

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Startwert - default Theme
  const [theme, setThemeState] = useState<ThemeType>("light-blue");

  const currentMode = theme.split("-")[0] as Mode;
  const currentColorScheme = theme.split("-")[1] as ColorScheme;

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);

    if (typeof window !== "undefined") {
      const root = document.documentElement;

      // Vorherige Klassen entfernen
      root.classList.remove("dark");
      root.classList.remove(
          "theme-blue", "theme-green", "theme-purple",
          "theme-pink", "theme-orange", "theme-red", "theme-teal"
      );

      const [mode, color] = newTheme.split("-") as [Mode, ColorScheme];

      // Dark Mode Klasse setzen
      if (mode === "dark") {
        root.classList.add("dark");
      }

      // Farbschema Klasse setzen
      root.classList.add(`theme-${color}`);
    }
  };


  const toggleMode = () => {
    const newMode: Mode = currentMode === "light" ? "dark" : "light";
    setTheme(`${newMode}-${currentColorScheme}`);
  };

  const setColorScheme = (scheme: ColorScheme) => {
    setTheme(`${currentMode}-${scheme}`);
  };

  // Beim initialen Laden einmal Klasse setzen
  useEffect(() => {
    setTheme(theme);
  }, []);

  return (
      <ThemeContext.Provider
          value={{
            theme,
            setTheme,
            toggleMode,
            currentMode,
            currentColorScheme,
            setColorScheme,
            themes,
          }}
      >
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
