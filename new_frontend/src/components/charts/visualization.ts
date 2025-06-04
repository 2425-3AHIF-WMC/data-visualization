
export interface DataPoint {
  [key: string]: any;
}

export interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'network' | 'treemap' | 'sankey' | 'histogram' | 'boxplot' | 'radar' | 'bubble' | 'candlestick' | 'waterfall';
  data: DataPoint[];
  xAxis?: string;
  yAxis?: string;
  zAxis?: string; // For 3D visualizations
  title: string;
  width?: number;
  height?: number;
  library: 'd3' | 'recharts';
  aggregation?: 'sum' | 'avg' | 'count' | 'min' | 'max' | 'median';
  groupBy?: string[];
  filters?: ChartFilter[];
  interactions?: ChartInteraction[];
  customMetrics?: CustomMetric[];
  theme?: ChartTheme;
}

export interface ChartFilter {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: any;
}

export interface ChartInteraction {
  type: 'zoom' | 'pan' | 'brush' | 'tooltip' | 'drill-down' | 'crossfilter';
  enabled: boolean;
  config?: any;
}

export interface CustomMetric {
  name: string;
  formula: string;
  description?: string;
}

export interface ChartTheme {
  colors: string[];
  backgroundColor: string;
  gridColor: string;
  textColor: string;
  fontSize: number;
}

export interface DashboardConfig {
  charts: ChartConfig[];
  layout: 'grid' | 'tabs' | 'dashboard';
  gridCols?: number;
  responsive?: boolean;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'json' | 'csv' | 'api' | 'database';
  data: DataPoint[];
  columns: string[];
  url?: string;
  apiKey?: string;
  refreshInterval?: number;
  schema?: DataSchema;
}

export interface DataSchema {
  fields: DataField[];
}

export interface DataField {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'array' | 'object';
  nullable?: boolean;
  unique?: boolean;
  format?: string;
}

export interface VisualizationPlugin {
  id: string;
  name: string;
  component: React.ComponentType<any>;
  supportedDataTypes: string[];
  config: any;
}

export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf' | 'json' | 'csv';
  quality?: number;
  dimensions?: { width: number; height: number };
  includeData?: boolean;
}

export interface DataTransformation {
  type: 'filter' | 'aggregate' | 'pivot' | 'sort' | 'bin' | 'calculate';
  config: any;
}
