
import React, { useState } from 'react';
import { ChartConfig } from './visualization';
import RechartsWrapper from './RechartsWrapper';
import D3Wrapper from './D3Wrapper';
import D3AdvancedWrapper from './D3AdvancedWrapper';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ChartFactoryProps {
  config: ChartConfig;
  onDataUpdate?: (data: any[]) => void;
  onInteraction?: (type: string, data: any) => void;
  className?: string;
}

const ChartFactory: React.FC<ChartFactoryProps> = ({ 
  config, 
  onDataUpdate, 
  onInteraction,
  className = ""
}) => {
  const { type, library, title, interactions } = config;
  const [tooltipData, setTooltipData] = useState<any>(null);

  // Make charts responsive by default
  const responsiveConfig = {
    ...config,
    width: config.width || 800,
    height: config.height || 400
  };

  // Determine which library to use based on chart type
  const shouldUseD3 = () => {
    const d3OnlyTypes = ['heatmap', 'network', 'treemap', 'sankey', 'histogram', 'boxplot', 'bubble', 'candlestick', 'waterfall'];
    return library === 'd3' || d3OnlyTypes.includes(type);
  };

  const handleInteraction = (interactionType: string, data: any) => {
    console.log('Chart interaction:', interactionType, data);
    
    if (interactionType === 'tooltip') {
      setTooltipData(data);
    }
    
    if (onInteraction) {
      onInteraction(interactionType, data);
    }
  };

  const renderChart = () => {
    if (shouldUseD3()) {
      // Use advanced D3 wrapper for complex visualizations
      const advancedTypes = ['heatmap', 'network', 'treemap', 'sankey', 'histogram', 'boxplot', 'bubble', 'candlestick', 'waterfall'];
      if (advancedTypes.includes(type)) {
        return (
          <D3AdvancedWrapper 
            config={responsiveConfig} 
            onDataUpdate={onDataUpdate}
            onInteraction={handleInteraction}
          />
        );
      } else {
        return (
          <D3Wrapper 
            config={responsiveConfig}
          />
        );
      }
    } else {
      return (
        <RechartsWrapper 
          config={responsiveConfig}
        />
      );
    }
  };

  const hasZoomEnabled = interactions?.some(i => i.type === 'zoom' && i.enabled);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="p-4 border-b flex justify-between items-center">
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              {shouldUseD3() ? 'D3.js' : 'Recharts'}
            </Badge>
            <Badge variant="outline" className="text-xs capitalize">
              {type}
            </Badge>
            {config.aggregation && (
              <Badge variant="secondary" className="text-xs">
                {config.aggregation}
              </Badge>
            )}
            {hasZoomEnabled && (
              <Badge variant="default" className="text-xs">
                Zoom aktiv
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      {/* Make chart container responsive */}
      <div className="relative p-4 w-full min-h-[400px]">
        <div className="w-full h-full">
          {renderChart()}
        </div>
        
        {/* Tooltip */}
        {tooltipData && (
          <div 
            className="absolute bg-gray-800 text-white text-xs p-2 rounded shadow-lg pointer-events-none z-10"
            style={{ 
              left: tooltipData.x - 200, 
              top: tooltipData.y - 100 
            }}
          >
            {tooltipData.xField && tooltipData.data && (
              <div>
                <div>{tooltipData.xField}: {tooltipData.data[tooltipData.xField]}</div>
                <div>{tooltipData.yField}: {tooltipData.data[tooltipData.yField]}</div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {config.customMetrics && config.customMetrics.length > 0 && (
        <div className="px-4 pb-3 border-t bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Custom Metrics:</p>
          <div className="flex flex-wrap gap-1">
            {config.customMetrics.map((metric, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {metric.name}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default ChartFactory;
