
import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';
import { Database, Plus } from 'lucide-react';

interface HomeHeroProps {
  hasData?: boolean;
}

export function HomeHero({ hasData = false }: HomeHeroProps) {
  return (
    <div className="py-12 px-4 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary  to-primary/70 bg-clip-text text-transparent">
        Personalisierte Data Visualisierung
      </h1>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        Importieren Sie Ihre Daten und erstellen Sie ansprechende Visualisierungen mit nur wenigen Klicks
      </p>
      
      {!hasData && (
        <Button asChild size="lg">
          <Link to="/import">
            <Database className="mr-2 h-4 w-4" />
            Daten importieren
          </Link>
        </Button>
      )}
      
      {hasData && (
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild variant="default">
            <Link to="/visualizations">
              Visualisierungen erstellen
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/import">
              <Plus className="mr-2 h-4 w-4" />
              Neue Daten importieren
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
