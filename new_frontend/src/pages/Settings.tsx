
import React from 'react';
import { Layout } from '../components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { useTheme } from '../utils/themeContext';
import { Trash2 } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, themes } = useTheme();

  const clearData = () => {
    localStorage.removeItem('data-canvas-last-data');
    toast({
      title: "Daten gelöscht",
      description: "Alle importierten Daten wurden gelöscht.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
          <p className="text-muted-foreground mt-1">
            Passe das Erscheinungsbild und Verhalten der Anwendung an.
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Erscheinungsbild</CardTitle>
              <CardDescription>
                Passe das Farbschema und Design der Anwendung an.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Farbschema</Label>
                <RadioGroup 
                  value={theme} 
                  onValueChange={(value) => setTheme(value as any)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2"
                >
                  {themes.map((t) => (
                    <div key={t.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={t.value} id={t.value} />
                      <Label htmlFor={t.value} className="cursor-pointer">{t.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daten</CardTitle>
              <CardDescription>
                Verwalte die importierten Daten und deren Darstellung.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Gespeicherte Daten</Label>
                <p className="text-sm text-muted-foreground">
                  Löscht alle importierten Daten aus dem lokalen Speicher.
                </p>
                <Button 
                  variant="destructive"
                  onClick={clearData}
                  className="mt-2"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Daten löschen
                </Button>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Über Data Canvas</Label>
                <p className="text-sm text-muted-foreground">
                  Data Canvas ist eine Anwendung zur Visualisierung von Daten aus verschiedenen Quellen.
                  Import und Visualisierung von JSON und CSV-Dateien werden unterstützt.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
