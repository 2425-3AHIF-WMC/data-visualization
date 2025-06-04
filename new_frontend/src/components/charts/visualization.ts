
export interface DataPoint {
    [key: string]: any;
}

export interface ChartConfig {
    id: string;
    type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' |'composed';
    data: DataPoint[];
    xAxis?: string;
    yAxis?: string;
    title: string;
    width?: number;
    height?: number;
    library: 'd3' | 'recharts';
}

export interface DashboardConfig {
    charts: ChartConfig[];
    layout: 'grid' | 'tabs';
}

export interface DataSource {
    id: string;
    name: string;
    type: 'json' | 'csv' | 'api';
    data: DataPoint[];
    columns: string[];
}

export type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'composed';