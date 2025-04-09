import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Record } from '@/utils/dataProcessor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, LineChart, PieChart } from 'lucide-react';
import { ChartConfig as WrapperChartConfig } from './ChartWrapper';

export type ChartType = 'bar' | 'line' | 'pie' | 'area' | 'scatter';

interface ChartCustomizerProps {
  data: Record[];
  numericColumns: string[];
  categoricalColumns: string[];
  onApply: (config: WrapperChartConfig) => void;
}

export interface ChartConfig extends WrapperChartConfig {}

export function ChartCustomizer({ data, numericColumns, categoricalColumns, onApply }: ChartCustomizerProps) {
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [xAxis, setXAxis] = useState<string>(categoricalColumns[0] || '');
  const [yAxis, setYAxis] = useState<string>(numericColumns[0] || '');
  const [groupBy, setGroupBy] = useState<string>('');
  const [title, setTitle] = useState('Neues Diagramm');

  const handleApply = () => {
    const id = `chart-${Date.now()}`;
    
    const series = [{
      name: yAxis,
      dataKey: yAxis
    }];
    
    onApply({
      id,
      type: chartType,
      title,
      description: `Visualisierung von ${yAxis} über ${xAxis}`,
      xAxis,
      series,
      labels: [],
      showLegend: true
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diagramm anpassen</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Diagrammtyp</Label>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Balken
            </Button>
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChart className="mr-2 h-4 w-4" />
              Linie
            </Button>
            <Button
              variant={chartType === 'pie' ? 'default' : 'outline'}
              size="sm" 
              onClick={() => setChartType('pie')}
            >
              <PieChart className="mr-2 h-4 w-4" />
              Kreis
            </Button>
            <Button
              variant={chartType === 'area' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('area')}
            >
              <LineChart className="mr-2 h-4 w-4" />
              Fläche
            </Button>
            <Button
              variant={chartType === 'scatter' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('scatter')}
            >
              <span className="mr-2">⚬</span>
              Streuung
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="xAxis">X-Achse</Label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger id="xAxis">
                <SelectValue placeholder="X-Achse auswählen" />
              </SelectTrigger>
              <SelectContent>
                {[...categoricalColumns, ...numericColumns].map((column) => (
                  <SelectItem key={column} value={column}>{column}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="yAxis">Y-Achse</Label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger id="yAxis">
                <SelectValue placeholder="Y-Achse auswählen" />
              </SelectTrigger>
              <SelectContent>
                {numericColumns.map((column) => (
                  <SelectItem key={column} value={column}>{column}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="groupBy">Gruppieren nach (optional)</Label>
          <Select value={groupBy} onValueChange={setGroupBy}>
            <SelectTrigger id="groupBy">
              <SelectValue placeholder="Gruppierung auswählen (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Keine Gruppierung</SelectItem>
              {categoricalColumns.map((column) => (
                <SelectItem key={column} value={column}>{column}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <input
            id="title"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <Button className="w-full" onClick={handleApply}>
          Diagramm anwenden
        </Button>
      </CardContent>
    </Card>
  );
}
