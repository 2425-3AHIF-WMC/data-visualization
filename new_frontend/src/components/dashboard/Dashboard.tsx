
import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  ComposedChart
} from 'recharts';
import { VisualizationCard } from './VisualizationCard';
import { ChartWrapper, ChartConfig } from './ChartWrapper';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Database, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { apiFetch } from '@/utils/api';

// Beispieldaten
const sampleData = [
  { name: 'Jan', value: 400, value2: 240 },
  { name: 'Feb', value: 300, value2: 139 },
  { name: 'Mar', value: 200, value2: 980 },
  { name: 'Apr', value: 278, value2: 390 },
  { name: 'May', value: 189, value2: 480 },
  { name: 'Jun', value: 239, value2: 380 },
  { name: 'Jul', value: 349, value2: 430 },
];

const pieData = [
  { name: 'Gruppe A', value: 400 },
  { name: 'Gruppe B', value: 300 },
  { name: 'Gruppe C', value: 300 },
  { name: 'Gruppe D', value: 200 },
];

const COLORS = ['hsl(var(--chart-colour1))', 'hsl(var(--chart-colour2))', 'hsl(var(--chart-colour3))', 'hsl(var(--chart-colour4)), hsl(var(--chart-colour5)), hsl(var(--chart-colour6))'];

interface DashboardProps {
  data?: any[];
  chartConfigs?: ChartConfig[];
}


export function Dashboard({ data = sampleData, chartConfigs = [] }: DashboardProps) {
  
  const [datasetCount, setDatasetCount] = useState<number | null>(null);
const [visualizationCount, setVisualizationCount] = useState<number | null>(null);

 useEffect(() => {
  const token = localStorage.getItem("jwt");
  async function fetchCounts() {
    if (!token) {
      console.warn("Kein Token gefunden");
      return;
    }
    try {
      const datasetResponse = await apiFetch<{ count: number }>('datasets/count', 'GET', undefined, {
        Authorization: `Bearer ${token}`,
      });     
      setDatasetCount(datasetResponse.count);
    } catch (error) {
      console.error('Fehler beim Abrufen der Dataset-Count:', error);
      setDatasetCount(null);
    }

    try {
      const visualizationResponse = await apiFetch<{ count: number }>('visualizations/count', 'GET', undefined, {
        Authorization: `Bearer ${token}`,
      });
      setVisualizationCount(visualizationResponse.count);
    } catch (error) {
      console.error('Fehler beim Abrufen der Visualization-Count:', error);
      setVisualizationCount(null);
    }
  }

  fetchCounts();
}, []);



  const showEmptyState = (!data || data.length === 0) && (!chartConfigs || chartConfigs.length === 0);
  
  if (showEmptyState) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="bg-primary/10 p-6 rounded-full mb-6">
          <Database className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Keine Datensätze verfügbar</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          Importieren Sie Ihre Daten, um mit der Visualisierung zu beginnen
        </p>
        <Button asChild>
          <Link to="/import">
            <Plus className="mr-2 h-4 w-4" />
            Daten importieren
          </Link>
        </Button>
      </div>
    );
  }


  // Otherwise render default charts
  return (
    <>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-purple-500 dark:text-purple-400">Datensätze</p>
              <h3 className="text-2xl font-bold mt-1">{datasetCount ?? "–"}</h3>
            </div>
            <div className="bg-white dark:bg-purple-800/30 p-3 rounded-full">
              <Database className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Erstellte Diagramme</p>
              <h3 className="text-2xl font-bold mt-1">{visualizationCount ?? "–"}</h3>
            </div>
            <div className="bg-white dark:bg-blue-800/30 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

      </div>
      
      <div className="dashboard-layout">
        <VisualizationCard 
          title="Balkendiagramm" 
          description="Vergleich von monatlichen Werten"
        >
          <ChartWrapper>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="hsl(var(--chart-colour1))" name="Wert A" />
              <Bar dataKey="value2" fill="hsl(var(--chart-colour2))" name="Wert B" />
            </BarChart>
          </ChartWrapper>
        </VisualizationCard>

        <VisualizationCard 
          title="Liniendiagramm" 
          description="Trend über Zeit"
        >
          <ChartWrapper>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="hsl(var(--chart-colour1))"
                name="Wert A"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke="hsl(var(--chart-colour2))"
                name="Wert B" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ChartWrapper>
        </VisualizationCard>

        <VisualizationCard 
          title="Kreisdiagramm" 
          description="Verteilung nach Kategorien"
        >
          <ChartWrapper>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartWrapper>
        </VisualizationCard>
        <VisualizationCard
            title="Streudiagramm"
            description="Beziehung zwischen zwei Variablen"
        >
          <ChartWrapper>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="value" name="Wert A" />
              <YAxis dataKey="value2" name="Wert B" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter
                  name="Beziehung A-B"
                  data={data}
                  fill="hsl(var(--chart-colour3))"
              />
            </ScatterChart>
          </ChartWrapper>
        </VisualizationCard>

        <VisualizationCard
            title="Flächendiagramm"
            description="Entwicklung über die Zeit"
        >
          <ChartWrapper>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-colour1))"
                  fill="hsl(var(--chart-colour1))"
                  name="Wert A"
              />
              <Area
                  type="monotone"
                  dataKey="value2"
                  stroke="hsl(var(--chart-colour2))"
                  fill="hsl(var(--chart-colour2))"
                  name="Wert B"
              />
            </AreaChart>
          </ChartWrapper>
        </VisualizationCard>

        <VisualizationCard
            title="Kombiniertes Diagramm"
            description="Mehrere Datenreihen in einem Diagramm"
        >
          <ChartWrapper>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                  type="monotone"
                  dataKey="value"
                  fill="hsl(var(--chart-colour1))"
                  stroke="hsl(var(--chart-colour1))"
                  name="Wert A (Fläche)"
              />
              <Bar
                  dataKey="value2"
                  barSize={20}
                  fill="hsl(var(--chart-colour6))"
                  name="Wert B (Balken)"
              />
              <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--chart-colour4))"
                  strokeWidth={2}
                  name="Wert A (Linie)"
              />
            </ComposedChart>
          </ChartWrapper>
        </VisualizationCard>

      </div>
    </>
  );
}
