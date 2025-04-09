
import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface ChartWrapperProps {
  children: React.ReactElement;
  height?: number | string;
  className?: string;
  fullWidth?: boolean;
}

export interface ChartConfig {
  id: string;
  title: string;
  description?: string;
  type: 'bar' | 'line' | 'pie' | 'area' | 'radar' | 'scatter';
  xAxis?: string;
  series?: {
    name: string;
    dataKey?: string;
    data?: number[];
  }[];
  labels?: string[];
  colors?: string[];
  stacked?: boolean;
  showLegend?: boolean;
}

export function ChartWrapper({ 
  children, 
  height = 300, 
  className,
  fullWidth = false
}: ChartWrapperProps) {
  return (
    <div 
      style={{ 
        width: '100%', 
        height: typeof height === 'number' ? height : height 
      }}
      className={cn(
        "transition-all duration-300 rounded-lg overflow-hidden", 
        fullWidth ? "w-full" : "",
        className
      )}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}
