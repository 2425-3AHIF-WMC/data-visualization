import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Grid, Plus, Download, Settings, Filter } from 'lucide-react';
import { ChartConfig, DataSource } from '@/types/visualization';
import ChartFactory from './charts/ChartFactory';
import AdvancedChartSelector from './AdvancedChartSelector';
import VisualizationBuilder from './VisualizationBuilder';
import Header from './Header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface DashboardProps {
  charts: ChartConfig[];
  dataSources: DataSource[];
  onChartsChange: (charts: ChartConfig[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ charts, dataSources, onChartsChange }) => {
  const [showBuilder, setShowBuilder] = useState(false);
  const [layout, setLayout] = useState<'grid' | 'tabs' | 'dashboard'>('grid');
  const [selectedTab, setSelectedTab] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [gridCols, setGridCols] = useState(2);
  const [tooltipData, setTooltipData] = useState<any>(null);

  const handleChartCreate = (config: ChartConfig) => {
    onChartsChange([...charts, config]);
    setShowBuilder(false);
    setIsDialogOpen(false);
    setSelectedDataSource(null);
  };

  const handleChartRemove = (id: string) => {
    onChartsChange(charts.filter(chart => chart.id !== id));
  };

  const handleInteraction = (type: string, data: any) => {
    if (type === 'tooltip') {
      setTooltipData(data);
    }
  };

  const exportDashboard = () => {
    const dashboardData = {
      charts,
      layout,
      gridCols,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(dashboardData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dashboard-export.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (showBuilder) {
    return (
      <VisualizationBuilder
        dataSources={dataSources}
        onChartCreate={handleChartCreate}
        onBack={() => setShowBuilder(false)}
      />
    );
  }

  if (!dataSources.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center text-gray-400 py-24">
          <p>Load data sources first to create advanced visualizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="p-6">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Dashboard</h2>
            <p className="text-gray-600">Create interactive visualizations with D3.js and Recharts</p>
          </div>
          
          <div className="flex gap-4 items-center">
            {/* Layout Controls */}
            <div className="flex gap-1 bg-white rounded-lg p-1 border">
              <Button
                size="sm"
                variant={layout === 'grid' ? 'default' : 'ghost'}
                onClick={() => setLayout('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={layout === 'tabs' ? 'default' : 'ghost'}
                onClick={() => setLayout('tabs')}
              >
                Tabs
              </Button>
              <Button
                size="sm"
                variant={layout === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setLayout('dashboard')}
              >
                Dashboard
              </Button>
            </div>

            {/* Grid Columns */}
            {layout === 'grid' && (
              <Select value={gridCols.toString()} onValueChange={(value) => setGridCols(parseInt(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Col</SelectItem>
                  <SelectItem value="2">2 Cols</SelectItem>
                  <SelectItem value="3">3 Cols</SelectItem>
                  <SelectItem value="4">4 Cols</SelectItem>
                </SelectContent>
              </Select>
            )}

            {/* Export */}
            <Button onClick={exportDashboard} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>

            {/* Add Chart */}
            <Button 
              onClick={() => setShowBuilder(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Neue Visualisierung
            </Button>
          </div>
        </div>

        {/* Charts Display */}
        {charts.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <p className="text-gray-600">No visualizations created yet. Click "Neue Visualisierung" to begin.</p>
            </CardContent>
          </Card>
        ) : (
          <div>
            {layout === 'grid' && (
              <div 
                className="grid gap-6"
                style={{ gridTemplateColumns: `repeat(${gridCols}, 1fr)` }}
              >
                {charts.map(chart => (
                  <ChartFactory
                    key={chart.id}
                    config={chart}
                    onInteraction={handleInteraction}
                    className="hover:shadow-lg transition-shadow"
                  />
                ))}
              </div>
            )}

            {layout === 'tabs' && (
              <Tabs value={selectedTab.toString()} onValueChange={(value) => setSelectedTab(parseInt(value))}>
                <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(charts.length, 4)}, 1fr)` }}>
                  {charts.slice(0, 4).map((chart, index) => (
                    <TabsTrigger key={chart.id} value={index.toString()}>
                      {chart.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {charts.map((chart, index) => (
                  <TabsContent key={chart.id} value={index.toString()}>
                    <ChartFactory
                      config={{
                        ...chart,
                        width: 1000,
                        height: 600,
                      }}
                      onInteraction={handleInteraction}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}

            {layout === 'dashboard' && (
              <div className="space-y-6">
                {/* Summary Row */}
                <div className="grid grid-cols-4 gap-4">
                  {charts.slice(0, 4).map(chart => (
                    <Card key={chart.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="p-4">
                        <ChartFactory
                          config={{
                            ...chart,
                            width: 250,
                            height: 150,
                          }}
                          onInteraction={handleInteraction}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Main Charts */}
                <div className="grid grid-cols-2 gap-6">
                  {charts.slice(4).map(chart => (
                    <ChartFactory
                      key={chart.id}
                      config={{
                        ...chart,
                        width: 500,
                        height: 350,
                      }}
                      onInteraction={handleInteraction}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tooltip */}
        {tooltipData && (
          <div
            className="fixed z-50 bg-white border border-gray-200 rounded-lg p-3 pointer-events-none shadow-lg"
            style={{
              left: tooltipData.x + 10,
              top: tooltipData.y - 10,
            }}
          >
            <div className="text-gray-900 text-sm">
              <p><strong>{tooltipData.xField}:</strong> {tooltipData.data[tooltipData.xField]}</p>
              <p><strong>{tooltipData.yField}:</strong> {tooltipData.data[tooltipData.yField]}</p>
            </div>
          </div>
        )}

        {/* Data Sources Info */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Available Data Sources ({dataSources.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dataSources.map(source => (
                <div key={source.id} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900">{source.name}</h4>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="outline">{source.type}</Badge>
                    <Badge variant="secondary">{source.data.length} records</Badge>
                    <Badge variant="secondary">{source.columns.length} fields</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
