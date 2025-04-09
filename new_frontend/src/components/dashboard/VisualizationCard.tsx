
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../../lib/utils';
import { ChevronsUpDown, Download, Maximize2, Minimize2, MoreVertical, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '../ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ResizablePanel, ResizablePanelGroup, ResizableHandle } from '../ui/resizable';

interface VisualizationCardProps {
  title: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}

export function VisualizationCard({
  title,
  description,
  className,
  children,
}: VisualizationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isWindowOpen, setIsWindowOpen] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const toggleWindow = () => {
    setIsWindowOpen(!isWindowOpen);
  };

  return (
    <>
      <Card 
        className={cn(
          "h-full transition-all duration-300 border-slate-200 dark:border-slate-800 overflow-hidden",
          isExpanded && "col-span-full row-span-2 z-10",
          isFullscreen && "fixed inset-0 z-50 m-0 rounded-none shadow-2xl",
          className
        )}
      >
        <CardHeader className="pb-2 flex flex-row items-start justify-between bg-slate-50 dark:bg-slate-900/50">
          <div>
            <CardTitle className="text-lg font-medium">{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleWindow} 
              className="h-8 w-8 rounded-full"
              title="In separatem Fenster öffnen"
            >
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleExpand} 
              className="h-8 w-8 rounded-full"
              title="Erweitern"
            >
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={toggleFullscreen}>
                  {isFullscreen ? "Vollbild beenden" : "Vollbild"}
                </DropdownMenuItem>
                <DropdownMenuItem>Bearbeiten</DropdownMenuItem>
                <DropdownMenuItem>Duplizieren</DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Exportieren
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Löschen</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className={cn(
            "transition-all duration-300",
            isExpanded && "h-[calc(100vh-200px)]"
          )}>
            {children}
          </div>
        </CardContent>
      </Card>

      {/* Floating window implementation with Drawer */}
      <Drawer open={isWindowOpen} onOpenChange={setIsWindowOpen}>
        <DrawerContent className="h-[85vh]">
          <DrawerHeader className="border-b">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Schließen</span>
            </DrawerClose>
          </DrawerHeader>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={80}>
              <div className="p-6">
                {children}
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20}>
              <div className="p-4 border-t">
                <h3 className="text-sm font-medium mb-2">Einstellungen</h3>
                <p className="text-sm text-muted-foreground">
                  Hier können zusätzliche Konfigurations- und Filterungsoptionen angezeigt werden.
                </p>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
          <DrawerFooter className="border-t">
            <Button onClick={() => setIsWindowOpen(false)}>Schließen</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
