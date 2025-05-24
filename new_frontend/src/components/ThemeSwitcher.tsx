import React from 'react';
import { ColorScheme, ThemeType, useTheme } from '../utils/themeContext';
import { Check, Moon, Palette, Sun } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from './ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function ThemeSwitcher() {
  const {
    theme,
    setTheme,
    themes,
    toggleMode,
    currentMode,
    currentColorScheme,
    setColorScheme,
  } = useTheme();

  // Gruppiere Themes nach Modus
  const lightThemes = themes.filter(t => t.mode === 'light');
  const darkThemes = themes.filter(t => t.mode === 'dark');

  // Alle Farbschemata einmalig extrahieren
  const colorSchemes = [...new Set(themes.map(t => t.colorScheme))];

  // Farbschema Namen auf Deutsch
  const colorSchemeNames: Record<string, string> = {
    blue: 'Blau',
    green: 'Grün',
    purple: 'Lila',
    pink: 'Rosa',
    orange: 'Orange',
    red: 'Rot',
    teal: 'Türkis',
  };

  // Modus Namen auf Deutsch
  const modeNames: Record<string, string> = {
    light: 'Helles Design',
    dark: 'Dunkles Design',
  };

  // Farbschema ändern und gleichzeitig Theme setzen (modus + farbe)
  const onColorSchemeChange = (newScheme: string) => {
    setColorScheme(newScheme as ColorScheme);
    setTheme(`${currentMode}-${newScheme}` as any);
  };

  return (
      <div className="flex gap-2">
        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-md">
                    <Palette className="h-5 w-5" />
                    <span className="sr-only">Farbschema wählen</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Farbschema anpassen</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Design anpassen</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Modus</DropdownMenuLabel>
            <div className="p-1 space-y-1">
              {['light', 'dark'].map((mode) => (
                  <Button
                      key={mode}
                      variant={currentMode === mode ? 'default' : 'outline'}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => setTheme(`${mode}-${currentColorScheme}` as any)}
                  >
                    {mode === 'light' ? (
                        <Sun className="mr-2 h-4 w-4" />
                    ) : (
                        <Moon className="mr-2 h-4 w-4" />
                    )}
                    {modeNames[mode]}
                    {currentMode === mode && <Check className="ml-auto h-4 w-4" />}
                  </Button>
              ))}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Farbschema</DropdownMenuLabel>
            <div className="grid grid-cols-2 gap-1 p-1">
              {colorSchemes.map((scheme) => (
                  <Button
                      key={scheme}
                      variant={currentColorScheme === scheme ? 'default' : 'outline'}
                      size="sm"
                      className="justify-start"
                      onClick={() => onColorSchemeChange(scheme)}
                  >
                    
                    {colorSchemeNames[scheme]}
                    {currentColorScheme === scheme && <Check className="ml-auto h-3 w-3" />}
                  </Button>
              ))}
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Palette className="mr-2 h-4 w-4" />
                <span>Alle Themes</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="w-56">
                <DropdownMenuLabel>Lichtmodus</DropdownMenuLabel>
                {lightThemes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: `hsl(var(--${t.colorScheme === 'blue' ? 'primary' : t.colorScheme}))`,
                            }}
                        />
                        {t.label}
                      </div>
                      {theme === t.value && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Dunkelmodus</DropdownMenuLabel>
                {darkThemes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className="flex items-center justify-between"
                    >
                      <div className="flex items-center">
                        <div
                            className="mr-2 h-3 w-3 rounded-full"
                            style={{
                              backgroundColor: `hsl(var(--${t.colorScheme === 'blue' ? 'primary' : t.colorScheme}))`,
                            }}
                        />
                        {t.label}
                      </div>
                      {theme === t.value && <Check className="h-4 w-4 ml-2" />}
                    </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
  );
}