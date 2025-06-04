
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartConfig, DataSource, ChartFilter, ChartInteraction, CustomMetric}from '@/components/charts/visualization';
import { Plus, X, Settings } from 'lucide-react';

interface AdvancedChartSelectorProps {
  dataSource: DataSource;
  onChartCreate: (config: ChartConfig) => void;
  onClose?: () => void;
}

const chartTypes = [
  { value: 'line', label: 'Line Chart', category: 'basic', library: 'both' },
  { value: 'bar', label: 'Bar Chart', category: 'basic', library: 'both' },
  { value: 'pie', label: 'Pie Chart', category: 'basic', library: 'both' },
  { value: 'area', label: 'Area Chart', category: 'basic', library: 'both' },
  { value: 'scatter', label: 'Scatter Plot', category: 'basic', library: 'both' },
  { value: 'heatmap', label: 'Heatmap', category: 'advanced', library: 'd3' },
  { value: 'treemap', label: 'Treemap', category: 'advanced', library: 'd3' },
  { value: 'network', label: 'Network Graph', category: 'advanced', library: 'd3' },
  { value: 'sankey', label: 'Sankey Diagram', category: 'advanced', library: 'd3' },
  { value: 'histogram', label: 'Histogram', category: 'statistical', library: 'd3' },
  { value: 'boxplot', label: 'Box Plot', category: 'statistical', library: 'd3' },
  { value: 'bubble', label: 'Bubble Chart', category: 'advanced', library: 'd3' },
  { value: 'waterfall', label: 'Waterfall Chart', category: 'business', library: 'd3' },
  { value: 'radar', label: 'Radar Chart', category: 'specialized', library: 'recharts' }
];

const aggregationTypes = [
  { value: 'none', label: 'No Aggregation' },
  { value: 'sum', label: 'Sum' },
  { value: 'avg', label: 'Average' },
  { value: 'count', label: 'Count' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'median', label: 'Median' }
];

const AdvancedChartSelector: React.FC<AdvancedChartSelectorProps> = ({ 
  dataSource, 
  onChartCreate, 
  onClose 
}) => {
  const [selectedType, setSelectedType] = useState<string>('line');
  const [library, setLibrary] = useState<'d3' | 'recharts'>('recharts');
  const [xAxis, setXAxis] = useState(dataSource.columns[0] || '');
  const [yAxis, setYAxis] = useState(dataSource.columns[1] || '');
  const [zAxis, setZAxis] = useState('');
  const [title, setTitle] = useState(`${dataSource.name} Chart`);
  const [aggregation, setAggregation] = useState<string>('none');
  const [groupBy, setGroupBy] = useState<string[]>([]);
  const [filters, setFilters] = useState<ChartFilter[]>([]);
  const [interactions, setInteractions] = useState<ChartInteraction[]>([
    { type: 'tooltip', enabled: true },
    { type: 'zoom', enabled: false },
    { type: 'pan', enabled: false },
    { type: 'brush', enabled: false }
  ]);
  const [customMetrics, setCustomMetrics] = useState<CustomMetric[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('basic');

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    const chartType = chartTypes.find(ct => ct.value === type);
    if (chartType) {
      if (chartType.library === 'd3') {
        setLibrary('d3');
      } else if (chartType.library === 'recharts') {
        setLibrary('recharts');
      }
    }
  };

  const addFilter = () => {
    setFilters([...filters, {
      field: dataSource.columns[0] || '',
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

  const addCustomMetric = () => {
    setCustomMetrics([...customMetrics, {
      name: `Metric ${customMetrics.length + 1}`,
      formula: '',
      description: ''
    }]);
  };

  const removeCustomMetric = (index: number) => {
    setCustomMetrics(customMetrics.filter((_, i) => i !== index));
  };

  const updateCustomMetric = (index: number, field: keyof CustomMetric, value: string) => {
    const updatedMetrics = [...customMetrics];
    updatedMetrics[index] = { ...updatedMetrics[index], [field]: value };
    setCustomMetrics(updatedMetrics);
  };

  const toggleInteraction = (type: string) => {
    setInteractions(interactions.map(interaction => 
      interaction.type === type 
        ? { ...interaction, enabled: !interaction.enabled }
        : interaction
    ));
  };

  const handleCreate = () => {
    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: selectedType as any,
      data: dataSource.data,
      xAxis,
      yAxis,
      zAxis: zAxis || undefined,
      title,
      library,
      width: 600,
      height: 400,
      aggregation: aggregation !== 'none' ? aggregation as any : undefined,
      groupBy: groupBy.length > 0 ? groupBy : undefined,
      filters: filters.length > 0 ? filters : undefined,
      interactions: interactions.filter(i => i.enabled),
      customMetrics: customMetrics.length > 0 ? customMetrics : undefined,
      theme: {
        colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'],
        backgroundColor: 'transparent',
        gridColor: '#e0e0e0',
        textColor: '#333',
        fontSize: 12
      }
    };
    
    onChartCreate(config);
  };

  const filteredChartTypes = chartTypes.filter(ct => 
    selectedCategory === 'all' || ct.category === selectedCategory
  );

  return (
    <Card className="w-full max-w-4xl bg-gray-900 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Advanced Chart Configuration</CardTitle>
        {onClose && (
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="interactions">Interactions</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label className="text-white">Chart Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Charts</SelectItem>
                  <SelectItem value="basic">Basic Charts</SelectItem>
                  <SelectItem value="advanced">Advanced Charts</SelectItem>
                  <SelectItem value="statistical">Statistical Charts</SelectItem>
                  <SelectItem value="business">Business Charts</SelectItem>
                  <SelectItem value="specialized">Specialized Charts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Chart Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {filteredChartTypes.map(chartType => (
                  <Button
                    key={chartType.value}
                    size="sm"
                    variant={selectedType === chartType.value ? 'default' : 'outline'}
                    onClick={() => handleTypeChange(chartType.value)}
                    className="text-xs"
                  >
                    {chartType.label}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-white">Title</Label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-white">Library</Label>
              <Select value={library} onValueChange={(value: 'd3' | 'recharts') => setLibrary(value)}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recharts">Recharts</SelectItem>
                  <SelectItem value="d3">D3.js</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">X-Axis</Label>
                <Select value={xAxis} onValueChange={setXAxis}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSource.columns.map(col => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Y-Axis</Label>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dataSource.columns.map(col => (
                      <SelectItem key={col} value={col}>{col}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-white">Aggregation</Label>
              <Select value={aggregation} onValueChange={setAggregation}>
                <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {aggregationTypes.map(agg => (
                    <SelectItem key={agg.value} value={agg.value}>{agg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label className="text-white">Filters</Label>
                <Button size="sm" onClick={addFilter}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Filter
                </Button>
              </div>
              {filters.map((filter, index) => (
                <div key={index} className="flex gap-2 items-center mt-2">
                  <Select value={filter.field} onValueChange={(value) => updateFilter(index, 'field', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSource.columns.map(col => (
                        <SelectItem key={col} value={col}>{col}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filter.operator} onValueChange={(value) => updateFilter(index, 'operator', value)}>
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eq">Equals</SelectItem>
                      <SelectItem value="ne">Not Equals</SelectItem>
                      <SelectItem value="gt">Greater Than</SelectItem>
                      <SelectItem value="lt">Less Than</SelectItem>
                      <SelectItem value="contains">Contains</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    value={filter.value}
                    onChange={(e) => updateFilter(index, 'value', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Value"
                  />
                  <Button size="sm" variant="ghost" onClick={() => removeFilter(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="space-y-4">
            <div>
              <Label className="text-white">Interactive Features</Label>
              <div className="space-y-2 mt-2">
                {interactions.map((interaction, index) => (
                  <div key={interaction.type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={interaction.enabled}
                      onCheckedChange={() => toggleInteraction(interaction.type)}
                    />
                    <Label className="text-white capitalize">{interaction.type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-white">Custom Metrics</Label>
                <Button size="sm" onClick={addCustomMetric}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              </div>
              {customMetrics.map((metric, index) => (
                <div key={index} className="space-y-2 p-3 border border-gray-600 rounded">
                  <div className="flex gap-2 items-center">
                    <Input
                      value={metric.name}
                      onChange={(e) => updateCustomMetric(index, 'name', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="Metric Name"
                    />
                    <Button size="sm" variant="ghost" onClick={() => removeCustomMetric(index)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <Input
                    value={metric.formula}
                    onChange={(e) => updateCustomMetric(index, 'formula', e.target.value)}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Formula (e.g., sum(field1) / count(*))"
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between">
          <div className="flex flex-wrap gap-2">
            {aggregation !== 'none' && (
              <Badge variant="secondary">{aggregation}</Badge>
            )}
            {filters.length > 0 && (
              <Badge variant="secondary">{filters.length} filter(s)</Badge>
            )}
            {interactions.filter(i => i.enabled).length > 0 && (
              <Badge variant="secondary">{interactions.filter(i => i.enabled).length} interaction(s)</Badge>
            )}
          </div>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            Create Advanced Chart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedChartSelector;
