
import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, ScatterChart, Scatter } from 'recharts';
import { VisualizationCard } from './VisualizationCard';
import { ChartWrapper, ChartConfig } from './ChartWrapper';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Database, BarChart2, LineChart as LineChartIcon, PieChart as PieChartIcon, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

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

const COLORS = ['hsl(var(--chart-blue))', 'hsl(var(--chart-green))', 'hsl(var(--chart-purple))', 'hsl(var(--chart-orange))'];

interface DashboardProps {
  data?: any[];
  chartConfigs?: ChartConfig[];
}

// Helper function to render the appropriate chart based on type
const renderChart = (config: ChartConfig, data: any[]) => {
  const xAxisKey = config.xAxis || "name";
  
  switch (config.type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {config.showLegend && <Legend />}
          {config.series && config.series.map((serie, idx) => (
            <Bar 
              key={idx} 
              dataKey={serie.dataKey || serie.name} 
              fill={config.colors ? config.colors[idx] : COLORS[idx % COLORS.length]} 
              name={serie.name} 
              stackId={config.stacked ? "stack" : undefined}
            />
          ))}
        </BarChart>
      );
    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {config.showLegend && <Legend />}
          {config.series && config.series.map((serie, idx) => (
            <Line 
              key={idx}
              type="monotone" 
              dataKey={serie.dataKey || serie.name} 
              stroke={config.colors ? config.colors[idx] : COLORS[idx % COLORS.length]} 
              name={serie.name}
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      );
    case 'pie':
      return (
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey={config.series && config.series[0]?.dataKey || config.series && config.series[0]?.name}
            nameKey={xAxisKey}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={config.colors ? config.colors[index % config.colors.length] : COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          {config.showLegend && <Legend />}
        </PieChart>
      );
    case 'area':
      return (
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {config.showLegend && <Legend />}
          {config.series && config.series.map((serie, idx) => (
            <Area 
              key={idx}
              type="monotone" 
              dataKey={serie.dataKey || serie.name} 
              fill={config.colors ? config.colors[idx] : COLORS[idx % COLORS.length]} 
              stroke={config.colors ? config.colors[idx] : COLORS[idx % COLORS.length]} 
              name={serie.name}
            />
          ))}
        </AreaChart>
      );
    case 'scatter':
      return (
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis />
          <Tooltip />
          {config.showLegend && <Legend />}
          {config.series && config.series.map((serie, idx) => (
            <Scatter 
              key={idx}
              name={serie.name} 
              data={data} 
              fill={config.colors ? config.colors[idx] : COLORS[idx % COLORS.length]}
              dataKey={serie.dataKey || serie.name}
            />
          ))}
        </ScatterChart>
      );
    default:
      return <div>Nicht unterstützter Diagrammtyp</div>;
  }
};

export function Dashboard({ data = sampleData, chartConfigs = [] }: DashboardProps) {
  // Check if there's no data
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

  // If there are custom chart configs, render those
  if (chartConfigs && chartConfigs.length > 0) {
    return (
      <div className="dashboard-layout">
        {chartConfigs.map((config, index) => {
          // Make sure we handle the ChartConfig properties correctly
          const chartTitle = config.title || `Diagramm ${index + 1}`;
          const chartDescription = config.description || "Benutzerdefiniertes Diagramm";
          
          return (
            <VisualizationCard 
              key={config.id || index}
              title={chartTitle} 
              description={chartDescription}
            >
              <ChartWrapper>
                {renderChart(config, data)}
              </ChartWrapper>
            </VisualizationCard>
          );
        })}
      </div>
    );
  }

  // Otherwise render default charts
  return (
    <>
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-purple-500 dark:text-purple-400">Datensätze</p>
              <h3 className="text-2xl font-bold mt-1">3</h3>
            </div>
            <div className="bg-white dark:bg-purple-800/30 p-3 rounded-full">
              <Database className="h-6 w-6 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-blue-500 dark:text-blue-400">Visualisierungen</p>
              <h3 className="text-2xl font-bold mt-1">7</h3>
            </div>
            <div className="bg-white dark:bg-blue-800/30 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/30">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm font-medium text-green-500 dark:text-green-400">Dashboards</p>
              <h3 className="text-2xl font-bold mt-1">2</h3>
            </div>
            <div className="bg-white dark:bg-green-800/30 p-3 rounded-full">
              <LineChartIcon className="h-6 w-6 text-green-500" />
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
              <Bar dataKey="value" fill="hsl(var(--chart-blue))" name="Wert A" />
              <Bar dataKey="value2" fill="hsl(var(--chart-green))" name="Wert B" />
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
                stroke="hsl(var(--chart-blue))" 
                name="Wert A"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="value2" 
                stroke="hsl(var(--chart-purple))" 
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
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ChartWrapper>
        </VisualizationCard>
      </div>
    </>
  );
}
