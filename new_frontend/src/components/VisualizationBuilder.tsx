
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BarChart3, Save } from 'lucide-react';
import { ChartConfig, DataSource, ChartFilter, ChartInteraction, DataPoint } from './charts/visualization';
import ChartFactory from './charts/ChartFactory';
import ChartConfigPanel from './ChartConfigPanel';
import AdvancedChartSelector from './AdvancedChartSelector';

interface VisualizationBuilderProps {
  dataSources: DataSource[];
  onChartCreate: (config: ChartConfig) => void;
  onBack: () => void;
}

const VisualizationBuilder: React.FC<VisualizationBuilderProps> = ({ 
  dataSources, 
  onChartCreate, 
  onBack 
}) => {
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie' | 'area' | 'scatter'>('area');
  const [title, setTitle] = useState('Neue Visualisierung');
  const [xAxis, setXAxis] = useState('');
  const [yAxis, setYAxis] = useState('');
  const [dataHandling, setDataHandling] = useState<'all' | 'sample' | 'every-nth'>('all');
  const [sampleSize, setSampleSize] = useState(100);
  const [nthValue, setNthValue] = useState(2);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Advanced features
  const [aggregation, setAggregation] = useState<'none' | 'sum' | 'avg' | 'count' | 'min' | 'max'>('none');
  const [filters, setFilters] = useState<ChartFilter[]>([]);
  const [enableFiltering, setEnableFiltering] = useState(false);
  const [enableZooming, setEnableZooming] = useState(false);

  const aggregationTypes = [
    { value: 'none', label: 'Keine Aggregation' },
    { value: 'sum', label: 'Summe' },
    { value: 'avg', label: 'Durchschnitt' },
    { value: 'count', label: 'Anzahl' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' }
  ];

  const applyAggregation = (data: DataPoint[], xField: string, yField: string, aggregationType: string): DataPoint[] => {
    if (aggregationType === 'none' || !xField || !yField) return data;

    // Group data by xField
    const grouped = data.reduce((acc, item) => {
      const key = item[xField];
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as Record<string, DataPoint[]>);

    // Apply aggregation
    return Object.entries(grouped).map(([key, items]) => {
      const yValues = items.map(item => parseFloat(item[yField])).filter(v => !isNaN(v));
      
      let aggregatedValue: number;
      switch (aggregationType) {
        case 'sum':
          aggregatedValue = yValues.reduce((sum, val) => sum + val, 0);
          break;
        case 'avg':
          aggregatedValue = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
          break;
        case 'count':
          aggregatedValue = yValues.length;
          break;
        case 'min':
          aggregatedValue = Math.min(...yValues);
          break;
        case 'max':
          aggregatedValue = Math.max(...yValues);
          break;
        default:
          aggregatedValue = yValues[0] || 0;
      }

      return {
        ...items[0],
        [xField]: key,
        [yField]: aggregatedValue
      };
    });
  };

  const getProcessedData = (data: DataPoint[]): DataPoint[] => {
    if (!data || data.length === 0) return [];

    let processedData = [...data];

    // Apply filters first
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

    // Apply aggregation
    if (aggregation !== 'none' && xAxis && yAxis) {
      processedData = applyAggregation(processedData, xAxis, yAxis, aggregation);
    }

    // Apply data sampling
    switch (dataHandling) {
      case 'sample':
        if (processedData.length <= sampleSize) return processedData;
        const step = Math.floor(processedData.length / sampleSize);
        return processedData.filter((_, index) => index % step === 0).slice(0, sampleSize);
      
      case 'every-nth':
        return processedData.filter((_, index) => index % nthValue === 0);
      
      case 'all':
      default:
        return processedData;
    }
  };

  const handleSave = () => {
    if (!selectedDataSource) return;

    const processedData = getProcessedData(selectedDataSource.data);

    // Update interactions based on toggle states with proper typing
    const updatedInteractions: ChartInteraction[] = [
      { type: 'tooltip' as const, enabled: true },
      { type: 'zoom' as const, enabled: enableZooming },
      { type: 'pan' as const, enabled: enableZooming }, // Enable pan with zoom
    ];

    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: chartType,
      data: processedData,
      xAxis: chartType !== 'pie' ? xAxis : undefined,
      yAxis,
      title,
      library: 'recharts',
      width: 800, // Make charts wider by default
      height: 400,
      aggregation: aggregation !== 'none' ? aggregation : undefined,
      filters: filters.length > 0 ? filters : undefined,
      interactions: updatedInteractions.filter(i => i.enabled)
    };
    
    console.log('Creating chart with config:', config);
    onChartCreate(config);
  };

  const previewData = selectedDataSource ? getProcessedData(selectedDataSource.data) : [];
  const previewConfig: ChartConfig | null = selectedDataSource ? {
    id: 'preview',
    type: chartType,
    data: previewData,
    xAxis: chartType !== 'pie' ? xAxis : undefined,
    yAxis,
    title,
    library: 'recharts',
    width: 700, // Wider preview
    height: 350,
    aggregation: aggregation !== 'none' ? aggregation : undefined,
    filters: filters.length > 0 ? filters : undefined,
    interactions: [
      { type: 'tooltip' as const, enabled: true },
      { type: 'zoom' as const, enabled: enableZooming },
      { type: 'pan' as const, enabled: enableZooming }
    ].filter(i => i.enabled)
  } : null;

  if (showAdvanced && selectedDataSource) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <AdvancedChartSelector
          dataSource={selectedDataSource}
          onChartCreate={onChartCreate}
          onClose={() => setShowAdvanced(false)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Zurück</span>
              </Button>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mt-2">Visualisierung erstellen</h1>
            <p className="text-gray-600 mt-1">Wählen Sie einen Datensatz für Ihre Datenvisualisierung</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-96 bg-white border-r border-gray-200 h-screen overflow-y-auto">
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
              onSave={handleSave}
              onAdvanced={() => setShowAdvanced(true)}
            />

            {/* Data Source Selection */}
            <Card className="p-6 mb-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Datensätze hinzufügen</label>
                <Select onValueChange={(value) => {
                  const source = dataSources.find(ds => ds.id === value);
                  setSelectedDataSource(source || null);
                  if (source && source.columns.length > 0) {
                    setXAxis(source.columns[0]);
                    setYAxis(source.columns[1] || source.columns[0]);
                  }
                }}>
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
                <Button className="w-full mt-2 bg-blue-100 text-blue-700 hover:bg-blue-200">
                  Hinzufügen
                </Button>
              </div>

              {/* Data Handling Options */}
              {selectedDataSource && selectedDataSource.data.length > 100 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Datenbehandlung ({selectedDataSource.data.length} Datensätze)
                  </label>
                  <Select value={dataHandling} onValueChange={(value: any) => setDataHandling(value)}>
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
                      <label className="block text-xs text-gray-600 mb-1">Stichprobengröße</label>
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
                      <label className="block text-xs text-gray-600 mb-1">Jeden n-ten Wert (z.B. 2 = jeden 2. Wert)</label>
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

                  <div className="mt-2 text-xs text-gray-500">
                    Resultat: {previewData.length} Datenpunkte werden angezeigt
                    {filters.length > 0 && ` (${filters.length} Filter aktiv)`}
                    {aggregation !== 'none' && ` (${aggregationTypes.find(a => a.value === aggregation)?.label} angewendet)`}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Main Content Area - Made responsive */}
        <div className="flex-1 p-8">
          <div className="max-w-none mx-auto">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Neue Visualisierung</h2>
              
              {!selectedDataSource ? (
                <div className="text-center py-16">
                  <div className="text-gray-400 mb-4">
                    <BarChart3 className="w-16 h-16 mx-auto" />
                  </div>
                  <p className="text-lg text-gray-600 mb-2">Wählen Sie Datensätze und Achsen für die Visualisierung</p>
                </div>
              ) : (
                <div>
                  {previewConfig && (
                    <div className="mb-6 w-full">
                      <ChartFactory config={previewConfig} className="w-full" />
                    </div>
                  )}
                  
                  <div className="border-t pt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Ausgewählter Datensatz</h4>
                    <div className="flex items-center space-x-4 flex-wrap">
                      <Badge variant="outline">{selectedDataSource.name}</Badge>
                      <Badge variant="secondary">{selectedDataSource.data.length} Gesamtdatensätze</Badge>
                      <Badge variant="secondary">{previewData.length} Angezeigte Datensätze</Badge>
                      <Badge variant="secondary">{selectedDataSource.columns.length} Spalten</Badge>
                      {aggregation !== 'none' && (
                        <Badge variant="default">{aggregationTypes.find(a => a.value === aggregation)?.label}</Badge>
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
  );
};

export default VisualizationBuilder;
