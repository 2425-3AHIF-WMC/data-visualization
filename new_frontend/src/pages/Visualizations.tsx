
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Dashboard } from '../components/dashboard/Dashboard';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { AlertCircle, FileUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { ProcessedData } from '../utils/dataProcessor';
import { ChartCustomizer, ChartConfig } from '../components/dashboard/ChartCustomizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';

export default function Visualizations() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [activeChartConfigs, setActiveChartConfigs] = useState<ChartConfig[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);
  const [availableDatasets, setAvailableDatasets] = useState<{id: string, name: string}[]>([]);

  // Load datasets from localStorage
  useEffect(() => {
    // Check for last dataset
    const lastData = localStorage.getItem('data-canvas-last-data');
    if (lastData) {
      try {
        setData(JSON.parse(lastData));
      } catch (e) {
        console.error("Fehler beim Laden der gespeicherten Daten:", e);
      }
    }

    // Check for all available datasets
    const datasets: {id: string, name: string}[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('data-canvas-dataset-')) {
        const id = key.replace('data-canvas-dataset-', '');
        const meta = localStorage.getItem(`data-canvas-meta-${id}`);
        let name = `Dataset ${id}`;
        
        if (meta) {
          try {
            const metaData = JSON.parse(meta);
            name = metaData.name || name;
          } catch (e) {
            console.error("Fehler beim Parsen der Metadaten:", e);
          }
        }
        
        datasets.push({ id, name });
      }
    }
    
    setAvailableDatasets(datasets);
    
    if (datasets.length > 0 && !selectedDataset) {
      setSelectedDataset(datasets[0].id);
      
      // Load the dataset
      const datasetData = localStorage.getItem(`data-canvas-dataset-${datasets[0].id}`);
      if (datasetData) {
        try {
          setData(JSON.parse(datasetData));
        } catch (e) {
          console.error("Fehler beim Laden des Datensatzes:", e);
        }
      }
    }
  }, []);

  // Load a specific dataset
  const loadDataset = (id: string) => {
    setSelectedDataset(id);
    const datasetData = localStorage.getItem(`data-canvas-dataset-${id}`);
    if (datasetData) {
      try {
        setData(JSON.parse(datasetData));
        // Reset chart configs when changing dataset
        setActiveChartConfigs([]);
      } catch (e) {
        console.error("Fehler beim Laden des Datensatzes:", e);
      }
    }
  };

  const handleApplyChartConfig = (config: ChartConfig) => {
    setActiveChartConfigs(prev => [...prev, config]);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visualisierungen</h1>
          <p className="text-muted-foreground mt-1">
            Interaktive Diagramme und Visualisierungen deiner Daten.
          </p>
        </div>

        {!data ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Keine Daten verfügbar</AlertTitle>
              <AlertDescription>
                Es wurden noch keine Daten importiert. Bitte lade zuerst eine Datei hoch.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-center">
              <Button asChild>
                <Link to="/import">
                  <FileUp className="mr-2 h-4 w-4" />
                  Daten importieren
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {availableDatasets.length > 1 && (
              <Card>
                <CardContent className="py-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-medium">Datensatz auswählen</h3>
                    <div className="flex flex-wrap gap-2">
                      {availableDatasets.map(dataset => (
                        <Button
                          key={dataset.id}
                          variant={selectedDataset === dataset.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => loadDataset(dataset.id)}
                        >
                          {dataset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="charts" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                <TabsTrigger value="charts">Diagramme</TabsTrigger>
                <TabsTrigger value="customize">Anpassen</TabsTrigger>
              </TabsList>
              
              <TabsContent value="charts" className="space-y-4 animate-in">
                <div className="rounded-lg border bg-card">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Deine Visualisierungen</h2>
                    {activeChartConfigs.length > 0 ? (
                      <Dashboard 
                        data={data.records} 
                        chartConfigs={activeChartConfigs}
                      />
                    ) : (
                      <div className="text-center p-10 bg-muted/20 rounded-md border border-dashed">
                        <p className="text-muted-foreground">
                          Keine Diagramme konfiguriert. Wechsle zum "Anpassen" Tab, um Diagramme zu erstellen.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="customize" className="animate-in">
                <ChartCustomizer 
                  data={data.records}
                  numericColumns={data.summary.numericColumns}
                  categoricalColumns={data.summary.categoricalColumns}
                  onApply={handleApplyChartConfig}
                />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </Layout>
  );
}
