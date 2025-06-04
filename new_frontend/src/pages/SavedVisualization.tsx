// src/pages/SavedVisualizations.tsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Layout } from '../components/Layout';
import { Trash2, Expand, Download } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { createPortal } from 'react-dom';
import { useToast } from '@/hooks/use-toast';
import { apiFetch } from '@/utils/api';
import ChartFactory from '@/components/charts/ChartFactory';
import { ChartConfig } from '@/components/charts/visualization'; // Müsst ihr evtl. anpassen, je nach Pfad

interface SavedVisualization {
  id: string;
  title: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed';
  data: any[];
  xaxis: string;
  yaxis?: string;
  /** 
   * Wenn dein Backend z.B. ausgewählte Datensätze als "selectedDatasets" liefert,
   * kannst du das hier mit aufnehmen. Für einen einfachen Single-Dataset-Chart
   * brauchst du es nicht zwingend.
   */
  selectedDatasets?: {
    id: string;
    name: string;
    yAxisField: string;
    color: string;
  }[];
}

export const SavedVisualizations: React.FC = () => {
  const [visualizations, setVisualizations] = useState<SavedVisualization[]>([]);
  const [fullscreenConfig, setFullscreenConfig] = useState<ChartConfig | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const token = localStorage.getItem('jwt');

  /** Erzeugt aus einer gespeicherten Visualisierung das ChartConfig-Objekt */
  const buildChartConfig = (viz: SavedVisualization, preview: boolean): ChartConfig => {
    return {
      id: viz.id,
      type: viz.type as any,
      data: viz.data,
      xAxis: viz.type !== 'pie' ? viz.xaxis : undefined,
      yAxis: viz.yaxis,
      title: viz.title,
      library: 'recharts',
      width: preview ? 250 : Math.round(window.innerWidth * 0.90),
      height: preview ? 150 : Math.round(window.innerHeight * 0.7),
      interactions: [
        { type: 'tooltip', enabled: true },
        { type: 'zoom', enabled: true },
      ],
      // optional: Aggregation / Filter etc. hier ergänzen, wenn gespeichert
    };
  };

  /** Lädt alle Visualisierungen vom Backend */
  const loadVisualizations = async () => {
    if (!token) {
      toast({ title: 'Nicht angemeldet', description: 'Bitte melde dich an.' });
      return;
    }
    try {
      const data = await apiFetch<SavedVisualization[]>('visualizations', 'GET', undefined, {
        Authorization: `Bearer ${token}`,
      });
      setVisualizations(data);
    } catch (err: any) {
      toast({ title: 'Fehler', description: err.message });
      console.error('Fehler beim Laden der Visualizations:', err);
    }
  };

  /** Löscht eine Visualisierung über DELETE /api/visualizations/:id */
  const deleteVisualization = async (id: string) => {
    if (!token) return;
    try {
      await apiFetch(`visualizations/${id}`, 'DELETE', undefined, {
        Authorization: `Bearer ${token}`,
      });
      loadVisualizations();
      toast({ title: 'Gelöscht', description: 'Visualisierung wurde entfernt.' });
    } catch (err: any) {
      toast({ title: 'Fehler', description: err.message || 'Löschen fehlgeschlagen.' });
      console.error('Fehler beim Löschen der Visualisierung:', err);
    }
  };

  /** Download-Funktion: rendert das DOM-Element als JPEG */
  const downloadChartAsImage = async (id: string) => {
    const node = document.getElementById(`chart-${id}`);
    if (!node) return;
    try {
      const dataUrl = await toJpeg(node, { quality: 0.95 });
      const link = document.createElement('a');
      link.download = `${id}.jpeg`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      toast({ title: 'Fehler', description: 'Download fehlgeschlagen.' });
      console.error('Fehler beim Erstellen des JPEGs:', err);
    }
  };

  /** Öffnet das Chart per ChartConfig im Vollbild-Portal */
  const openFullscreen = (config: ChartConfig) => {
    setFullscreenConfig(config);
  };
  const closeFullscreen = () => {
    setFullscreenConfig(null);
  };

  useEffect(() => {
    loadVisualizations();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gespeicherte Visualisierungen</h1>
          <Button asChild>
            <Link to="/chart-visualization">+ Neue Visualisierung</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {visualizations.length === 0 ? (
            <p className="text-gray-600 col-span-full">Keine Visualisierungen gefunden. Erstelle zuerst welche!</p>
          ) : (
            visualizations.map((viz) => {
              const previewConfig = buildChartConfig(viz, true);
              const fullConfig = buildChartConfig(viz, false);

              return (
                <Card key={viz.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{viz.title}</CardTitle>
                    <CardDescription>{viz.type.toUpperCase()} Diagramm</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div
                      id={`chart-${viz.id}`}
                      className="bg-white p-2 rounded cursor-pointer hover:shadow-lg transition-shadow"
                     style={{ height: '20rem' }}
                      onClick={() => openFullscreen(fullConfig)}
                    >
                      {/* Vorschau im Card (klein) */}
                      <ChartFactory config={previewConfig} />
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between">
                    <div className="flex gap-4">
                      <button
                        onClick={() => downloadChartAsImage(viz.id)}
                        className="flex items-center text-sm font-medium"
                      >
                        <Download className="w-4 h-4 mr-1" strokeWidth={1.5} />
                        Download
                      </button>

                      <button
                        onClick={() => openFullscreen(fullConfig)}
                        className="flex items-center text-sm font-medium"
                      >
                        <Expand className="w-4 h-4 mr-1" strokeWidth={1.5} />
                        Vollbild
                      </button>

                      <button
                        onClick={() => deleteVisualization(viz.id)}
                        className="flex items-center text-sm font-medium"
                      >
                        <Trash2 className="w-4 h-4 mr-1" strokeWidth={1.5} />
                        Löschen
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        {fullscreenConfig &&
          createPortal(
            <div
              onClick={closeFullscreen}
              className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center p-4 cursor-pointer"
            >
              <div onClick={(e) => e.stopPropagation()}
                 className="bg-white rounded-lg overflow-auto"
                  style={{ width: '95vw', height: '80vh' }}>
                {/* Vollbild-Chart */}
                <ChartFactory config={fullscreenConfig} />
              </div>
            </div>,
            document.body
          )}
      </div>
    </Layout>
  );
};

export default SavedVisualizations;
