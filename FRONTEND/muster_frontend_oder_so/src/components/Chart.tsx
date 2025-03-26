
import { useEffect, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  PieChart, Pie, Cell, ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import { ChartType, DataPoint } from "@/lib/mockData";

type ChartProps = {
  data: DataPoint[];
  type: ChartType;
  height?: number;
  className?: string;
};

// Helper function to get unique categories from data
const getUniqueCategories = (data: DataPoint[]): string[] => {
  return Array.from(new Set(data.map(item => item.category)));
};

// Helper to generate colors
const getColor = (index: number): string => {
  const colors = [
    "#3B82F6", "#EC4899", "#8B5CF6", "#10B981", 
    "#F97316", "#06B6D4", "#EAB308", "#6366F1"
  ];
  return colors[index % colors.length];
};

// Custom tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded-lg border border-gray-100 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`value-${index}`} className="text-sm" style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value.toLocaleString()}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const Chart = ({ data, type, height = 300, className = "" }: ChartProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  if (!isClient) {
    return (
      <div 
        className={`w-full h-[${height}px] flex-center bg-muted/30 rounded-lg animate-pulse-subtle ${className}`}
      >
        <span className="text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  const categories = getUniqueCategories(data);
  const chartHeight = height;

  // Rendering different chart types
  switch (type) {
    case "line":
      return (
        <div className={`w-full h-[${chartHeight}px] ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey="value"
                  strokeWidth={2}
                  name={category}
                  data={data.filter(d => d.category === category)}
                  stroke={getColor(index)}
                  activeDot={{ r: 8, strokeWidth: 1, stroke: '#fff' }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );

    case "bar":
      return (
        <div className={`w-full h-[${chartHeight}px] ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {categories.map((category, index) => (
                <Bar
                  key={category}
                  dataKey="value"
                  name={category}
                  data={data.filter(d => d.category === category)}
                  fill={getColor(index)}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );

    case "area":
      return (
        <div className={`w-full h-[${chartHeight}px] ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="month" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey="value"
                  name={category}
                  data={data.filter(d => d.category === category)}
                  stroke={getColor(index)}
                  fill={getColor(index)}
                  fillOpacity={0.2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      );

    case "pie":
      // For pie chart we need to restructure data
      // Aggregating by category
      const pieData = categories.map(category => ({
        name: category,
        value: data
          .filter(d => d.category === category)
          .reduce((sum, item) => sum + item.value, 0)
      }));

      return (
        <div className={`w-full h-[${chartHeight}px] ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={chartHeight / 3}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(index)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      );

    case "scatter":
      return (
        <div className={`w-full h-[${chartHeight}px] ${className}`}>
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                type="category" 
                dataKey="month" 
                name="Month" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis 
                dataKey="value" 
                name="Value" 
                tick={{ fill: 'var(--foreground)', fontSize: 12 }}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomTooltip />} />
              <Legend />
              {categories.map((category, index) => (
                <Scatter
                  key={category}
                  name={category}
                  data={data.filter(d => d.category === category)}
                  fill={getColor(index)}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      );

    default:
      return <div>Unsupported chart type</div>;
  }
};
