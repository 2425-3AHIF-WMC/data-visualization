
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { PieChart, BarChart3, LineChart, ScatterChart, AreaChart, TrendingUp, Filter, ZoomIn } from 'lucide-react';
import { DataSource, ChartFilter } from '@/components/charts/visualization';

interface ChartConfigPanelProps {
  selectedDataSource: DataSource | null;
  chartType: 'line' | 'bar' | 'pie' | 'area' | 'scatter';
  setChartType: (type: 'line' | 'bar' | 'pie' | 'area' | 'scatter') => void;
  title: string;
  setTitle: (title: string) => void;
  xAxis: string;
  setXAxis: (axis: string) => void;
  yAxis: string;
  setYAxis: (axis: string) => void;
  aggregation: 'none' | 'sum' | 'avg' | 'count' | 'min' | 'max';
  setAggregation: (agg: 'none' | 'sum' | 'avg' | 'count' | 'min' | 'max') => void;
  enableFiltering: boolean;
  setEnableFiltering: (enable: boolean) => void;
  enableZooming: boolean;
  setEnableZooming: (enable: boolean) => void;
  filters: ChartFilter[];
  setFilters: (filters: ChartFilter[]) => void;
  onSave: () => void;
  onAdvanced: () => void;
}

const ChartConfigPanel: React.FC<ChartConfigPanelProps> = ({
  selectedDataSource,
  chartType,
  setChartType,
  title,
  setTitle,
  xAxis,
  setXAxis,
  yAxis,
  setYAxis,
  aggregation,
  setAggregation,
  enableFiltering,
  setEnableFiltering,
  enableZooming,
  setEnableZooming,
  filters,
  setFilters,
  onSave,
  onAdvanced
}) => {
  const chartTypes = [
    { value: 'pie', label: 'Kreis', icon: PieChart },
    { value: 'area', label: 'Fläche', icon: AreaChart },
    { value: 'line', label: 'Linie', icon: LineChart },
    { value: 'bar', label: 'Balken', icon: BarChart3 },
    { value: 'scatter', label: 'Punkt', icon: ScatterChart },
    { value: 'line', label: 'Kombiniert', icon: TrendingUp },
  ];

  const aggregationTypes = [
    { value: 'none', label: 'Keine Aggregation' },
    { value: 'sum', label: 'Summe' },
    { value: 'avg', label: 'Durchschnitt' },
    { value: 'count', label: 'Anzahl' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' }
  ];

  const addFilter = () => {
    if (!selectedDataSource) return;
    setFilters([...filters, {
      field: selectedDataSource.columns[0],
      operator: 'eq',
      value: ''
    }]);
  };

  const removeFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const updateFilter = (index: number, field: keyof ChartFilter, value: any) => {
    const updatedFilters = [...filters];
    updatedFilters[index] = { ...updatedFilters[index], [field]: value };
    setFilters(updatedFilters);
  };

  return (
    <Card className="p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold ">Visualisierungseinstellungen</h3>
        {selectedDataSource && (
          <Button
            size="sm"
            variant="outline"
            onClick={onAdvanced}
            className="text-xs"
          >
            Erweitert
          </Button>
        )}
      </div>
      <p className="text-gray-400 text-sm mb-6">Wählen Sie den Diagrammtyp und die Datenfelder</p>
      
      {/* Chart Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium  mb-3">Diagrammtyp</label>
        <div className="grid grid-cols-3 gap-2">
          {chartTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = chartType === type.value && (
              type.label !== 'Kombiniert' || 
              (type.label === 'Kombiniert' && chartType === 'line')
            );
            return (
              <Button
                key={`${type.value}-${type.label}`}
                variant={isSelected ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChartType(type.value as any)}
                className="flex flex-col items-center space-y-1 h-auto py-3"
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{type.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <label className="block text-sm font-medium  mb-2">Titel</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Aggregation */}
      {selectedDataSource && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Aggregation</label>
          <Select value={aggregation} onValueChange={(value: any) => setAggregation(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {aggregationTypes.map(agg => (
                <SelectItem key={agg.value} value={agg.value}>{agg.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {aggregation !== 'none' && xAxis && yAxis && (
            <p className="text-xs text-gray-500 mt-1">
              Daten werden nach {xAxis} gruppiert und {yAxis} {aggregationTypes.find(a => a.value === aggregation)?.label.toLowerCase()}
            </p>
          )}
        </div>
      )}

      {/* Interactive Features */}
      {selectedDataSource && (
        <div className="mb-6">
          <label className="block text-sm font-medium  mb-2">Interaktive Funktionen</label>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableZooming}
                onCheckedChange={(checked) => setEnableZooming(checked === true)}
              />
              <ZoomIn className="w-4 h-4 " />
              <Label className="text-sm">Zoomen aktivieren</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={enableFiltering}
                onCheckedChange={(checked) => setEnableFiltering(checked === true)}
              />
              <Filter className="w-4 h-4 " />
                <Label className="text-sm">Filtern aktivieren</Label>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      {enableFiltering && selectedDataSource && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium ">Filter</label>
            <Button size="sm" variant="outline" onClick={addFilter}>
              Filter hinzufügen
            </Button>
          </div>
          {filters.map((filter, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
              <Select value={filter.field} onValueChange={(value) => updateFilter(index, 'field', value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedDataSource.columns.map(col => (
                    <SelectItem key={col} value={col}>{col}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filter.operator} onValueChange={(value) => updateFilter(index, 'operator', value)}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eq">=</SelectItem>
                  <SelectItem value="ne">≠</SelectItem>
                  <SelectItem value="gt">&gt;</SelectItem>
                  <SelectItem value="lt">&lt;</SelectItem>
                  <SelectItem value="contains">enthält</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={filter.value}
                onChange={(e) => updateFilter(index, 'value', e.target.value)}
                className="flex-1"
                placeholder="Wert"
              />
              <Button size="sm" variant="outline" onClick={() => removeFilter(index)}>
                ×
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Axis Selection */}
      {selectedDataSource && chartType !== 'pie' && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium  mb-2">X-Achse</label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedDataSource.columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium  mb-2">Y-Achse</label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {selectedDataSource.columns.map(col => (
                  <SelectItem key={col} value={col}>{col}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {selectedDataSource && chartType === 'pie' && (
        <div className="mb-6">
          <label className="block text-sm font-medium  mb-2">Werte</label>
          <Select value={yAxis} onValueChange={setYAxis}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {selectedDataSource.columns.map(col => (
                <SelectItem key={col} value={col}>{col}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        onClick={onSave} 
        className="w-full "
        disabled={!selectedDataSource || !yAxis}
      >
        Visualisierung speichern
      </Button>
    </Card>
  );
};

export default ChartConfigPanel;
