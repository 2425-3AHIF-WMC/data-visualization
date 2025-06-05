// src/pages/ChartVisualisation.tsx
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { apiFetch } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Layout } from '../components/Layout';
import ChartConfigPanel from '@/components/ChartConfigPanel';
import ChartFactory from '@/components/charts/ChartFactory';
import { 
  ArrowLeft, 
  Save, 
  Download, 
  Maximize,
  BarChart3,
  PieChart,
  LineChart,
  ScatterChart,
  AreaChart,
  TrendingUp,
  Filter,
  ZoomIn
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ChartConfig ,DataSource,ChartFilter} from '@/components/charts/visualization';
/*interface DataSource {
  id: string;
  name: string;
  type: string;
  data: any[];
  columns: string[];
}
*/
/*interface ChartFilter {
  field: string;
  operator: string;
  value: string;
}*/

interface ChartInteraction {
  type: string;
  enabled: boolean;
}

/*interface ChartConfig {
  id: string;
  type: string;
  data: any[];
  xAxis?: string;
  yAxis?: string;
  title: string;
  library: string;
  width: number;
  height: number;
  aggregation?: string;
  filters?: ChartFilter[];
  interactions: ChartInteraction[];
}*/

const ChartVisualization: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const token = localStorage.getItem("jwt");

  // Zustände für Daten und Konfiguration
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area' | 'scatter'>('bar');
  const [title, setTitle] = useState('Neue Visualisierung');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [aggregation, setAggregation] = useState<'none' | 'sum' | 'avg' | 'count' | 'min' | 'max'>('none');
  const [filters, setFilters] = useState<ChartFilter[]>([]);
  const [enableZooming, setEnableZooming] = useState(false);
  const [enableFiltering, setEnableFiltering] = useState(false);
  const [dataHandling, setDataHandling] = useState<'all' | 'sample' | 'every-nth'>('all');
  const [sampleSize, setSampleSize] = useState(100);
  const [nthValue, setNthValue] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Datenquellen laden
  useEffect(() => {
    const fetchUserDatasets = async () => {
      if (!token) return;
      try {
        const response: any = await apiFetch(
          `datasets?full=true`,
          "GET",
          undefined,
          { Authorization: `Bearer ${token}` }
        );

         console.log("API-Antwort:", response.datasets);
        if (Array.isArray(response.datasets)) {
          const userDS: DataSource[] = response.datasets.map((ds: any) => ({
            id: ds.id,
            name: ds.name,
            type: ds.fileType,
            data: ds.data,
            columns: ds.columns || Object.keys(ds.data[0] || {})
          }));
          setDataSources(userDS);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Datensätze:", error);
        toast({
          title: "Fehler",
          description: "Konnte Datensätze nicht laden.",
          variant: "destructive",
        });
      }
    };
    fetchUserDatasets();
  }, [toast, token]);

  // Verarbeitete Daten generieren
  const getProcessedData = (): any[] => {
    if (!selectedDataSource) return [];
    
    let processedData = [...selectedDataSource.data];
    
    // Filter anwenden
    if (filters.length > 0) {
      processedData = processedData.filter(item => {
        return filters.every(filter => {
          const value = item[filter.field];
          switch (filter.operator) {
            case 'eq': return value === filter.value;
            case 'ne': return value !== filter.value;
            case 'gt': return Number(value) > Number(filter.value);
            case 'lt': return Number(value) < Number(filter.value);
            case 'contains': return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            default: return true;
          }
        });
      });
    }

    // Datenbehandlung
    switch (dataHandling) {
      case 'sample':
        return processedData.slice(0, sampleSize);
      case 'every-nth':
        return processedData.filter((_, i) => i % nthValue === 0);
      default:
        return processedData;
    }
  };

  // Visualisierung exportieren
  const exportVisualization = async () => {
    try {
      const canvas = document.createElement('canvas');
      const chartElement = document.querySelector('.chart-container');
      
      if (!chartElement) {
        throw new Error("Chart container nicht gefunden");
      }

      const html2canvas = (await import('html2canvas')).default;
      const canvasEl = await html2canvas(chartElement as HTMLElement, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${title}.png`;
      link.href = canvasEl.toDataURL('image/png');
      link.click();

      toast({ title: 'Export erfolgreich', description: 'Visualisierung wurde als PNG exportiert' });
    } catch (error) {
      console.error('Export fehlgeschlagen:', error);
      toast({
        title: 'Export fehlgeschlagen',
        description: 'Beim Export ist ein Fehler aufgetreten',
        variant: 'destructive'
      });
    }
  };

  // Vollbildmodus umschalten
  const toggleFullscreen = () => {
    const chartContainer = document.querySelector('.chart-container');
    if (!chartContainer) return;

    if (!document.fullscreenElement) {
      chartContainer.requestFullscreen().catch(err => {
        console.error(`Fehler beim Aktivieren des Vollbildmodus: ${err}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Visualisierung speichern
  const saveVisualization = () => {
    if (!selectedDataSource) return;
    
    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: chartType,
      data: getProcessedData(),
      xAxis: chartType !== 'pie' ? xAxis : undefined,
      yAxis,
      title,
      library: 'recharts',
      width: 800,
      height: 400,
      interactions: [
        { type: 'tooltip', enabled: true },
        { type: 'zoom', enabled: enableZooming }
      ]
    };

    try{
      apiFetch(
        'visualizations',
        'POST',
        {
          owner: localStorage.getItem('userId') || '',
          type: chartType,
          title,
          library: 'recharts',
          width: 800,
          height: 400,
          data: config.data,
          xaxis: config.xAxis,
          yaxis: config.yAxis,
          aggregation,
          filters: filters.length > 0 ? filters : undefined,
          interactions: config.interactions
        },
        { Authorization: `Bearer ${token}` }
      );

       toast({ 
      title: 'Gespeichert', 
      description: 'Visualisierung wurde gespeichert' 
    });
    }
    catch (error) {
      console.error('Fehler beim Speichern der Visualisierung:', error);
        toast({
      title: 'Speichern fehlgeschlagen',
      description: 'Beim Speichern auf dem Server ist ein Fehler aufgetreten.',
      variant: 'destructive',
    });}

    /*const existing = JSON.parse(localStorage.getItem('savedVisualizations') || '[]');
    localStorage.setItem('savedVisualizations', JSON.stringify([...existing, config]));
    */
   

    navigate('/visualizations');
  };

  // Vorschaudaten und Konfiguration
  const previewData = getProcessedData();
  const previewConfig: ChartConfig | null = selectedDataSource ? {
    id: 'preview',
    type: chartType,
    data: previewData,
    xAxis: chartType !== 'pie' ? xAxis : undefined,
    yAxis,
    title,
    library: 'recharts',
    width: 700,
    height: 350,
    interactions: [
      { type: 'tooltip', enabled: true },
      { type: 'zoom', enabled: enableZooming }
    ]
  } : null;

  return (
    <Layout>
      <div className="min-h-screen ">
        <div className="  px-6 py-4">
          <div className="flex items-center justify-between">
            <div>

              <h1 className="text-2xl font-bold  mt-2">
                Datenvisualisierung erstellen
              </h1>
              <p className="text-gray-400 mt-1">
                Wählen Sie einen Datensatz und konfigurieren Sie Ihre Visualisierung
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportVisualization}>
                <Download className="h-4 w-4 mr-2" /> Export
              </Button>
              <Button variant="outline" onClick={toggleFullscreen}>
                <Maximize className="h-4 w-4 mr-2" /> Vollbild
              </Button>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Linke Sidebar - Konfiguration */}
          <div className="w-96 h-screen overflow-y-auto">
            <div className="p-6">
              <ChartConfigPanel
                selectedDataSource={selectedDataSource}
                chartType={chartType}
                setChartType={setChartType}
                title={title}
                setTitle={setTitle}
                xAxis={xAxis}
                setXAxis={setXAxis}
                yAxis={yAxis}
                setYAxis={setYAxis}
                aggregation={aggregation}
                setAggregation={setAggregation}
                enableFiltering={enableFiltering}
                setEnableFiltering={setEnableFiltering}
                enableZooming={enableZooming}
                setEnableZooming={setEnableZooming}
                filters={filters}
                setFilters={setFilters}
                onSave={saveVisualization}
                onAdvanced={() => navigate('/advanced-visualization')}
              />

              {/* Datensatzauswahl */}
              <Card className="p-6 mb-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Datensätze
                  </label>
                  <Select
                    onValueChange={(value) => {
                      const source = dataSources.find(ds => ds.id === value);
                      setSelectedDataSource(source || null);
                      if (source && source.columns.length > 0) {
                        setXAxis(source.columns[0]);
                        setYAxis(source.columns[1] || source.columns[0]);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Datensatz auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map(source => (
                        <SelectItem key={source.id} value={source.id}>
                          {source.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Datenbehandlung */}
                {selectedDataSource && selectedDataSource.data.length > 100 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium  mb-2">
                      Datenbehandlung ({selectedDataSource.data.length} Datensätze)
                    </label>
                    <Select 
                      value={dataHandling} 
                      onValueChange={(value: any) => setDataHandling(value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Daten anzeigen</SelectItem>
                        <SelectItem value="sample">Stichprobe verwenden</SelectItem>
                        <SelectItem value="every-nth">Jeden n-ten Wert anzeigen</SelectItem>
                      </SelectContent>
                    </Select>

                    {dataHandling === 'sample' && (
                      <div className="mt-3">
                        <label className="block text-xs  mb-1">
                          Stichprobengröße
                        </label>
                        <Input
                          type="number"
                          value={sampleSize}
                          onChange={(e) => setSampleSize(Number(e.target.value))}
                          min="10"
                          max="1000"
                          className="w-full"
                        />
                      </div>
                    )}

                    {dataHandling === 'every-nth' && (
                      <div className="mt-3">
                        <label className="block text-xs text-gray-400 mb-1">
                          Jeden n-ten Wert (z.B. 2 = jeden 2. Wert)
                        </label>
                        <Input
                          type="number"
                          value={nthValue}
                          onChange={(e) => setNthValue(Number(e.target.value))}
                          min="2"
                          max="10"
                          className="w-full"
                        />
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-400">
                      Resultat: {previewData.length} Datenpunkte werden angezeigt
                      {filters.length > 0 && ` (${filters.length} Filter aktiv)`}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Hauptbereich - Vorschau */}
          <div className="flex-1 p-8">
            <div className="max-w-none mx-auto">
              <div className=" rounded-lg shadow-sm border p-8">
                <h2 className="text-lg font-semibold mb-6">
                  {title}
                </h2>
                
                {!selectedDataSource ? (
                  <div className="text-center py-16">
                    <div className=" mb-4">
                      <BarChart3 className="w-16 h-16 mx-auto" />
                    </div>
                    <p className="text-md text-gray-400 mb-2">
                      Wählen Sie einen Datensatz und konfigurieren Sie die Visualisierung
                    </p>
                  </div>
                ) : (
                  <div>
                    <div className="mb-6 w-full chart-container">
                      {previewConfig && (
                        <ChartFactory config={previewConfig as ChartConfig} />
                      )}
                    </div>
                    
                    <div className="border-t pt-6">
                      <h4 className="font-medium  mb-3">
                        Aktive Konfiguration
                      </h4>
                      <div className="flex items-center space-x-4 flex-wrap">
                        <Badge variant="outline">{selectedDataSource.name}</Badge>
                        <Badge variant="secondary">
                          {selectedDataSource.data.length} Gesamtdatensätze
                        </Badge>
                        <Badge variant="secondary">
                          {previewData.length} Angezeigte Datensätze
                        </Badge>
                        <Badge variant="secondary">
                          {selectedDataSource.columns.length} Spalten
                        </Badge>
                        {aggregation !== 'none' && (
                          <Badge variant="default">
                            {aggregation === 'sum' && 'Summe'}
                            {aggregation === 'avg' && 'Durchschnitt'}
                            {aggregation === 'count' && 'Anzahl'}
                            {aggregation === 'min' && 'Minimum'}
                            {aggregation === 'max' && 'Maximum'}
                          </Badge>
                        )}
                        {filters.length > 0 && (
                          <Badge variant="default">{filters.length} Filter</Badge>
                        )}
                        {enableZooming && (
                          <Badge variant="default">Zoom aktiviert</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChartVisualization;