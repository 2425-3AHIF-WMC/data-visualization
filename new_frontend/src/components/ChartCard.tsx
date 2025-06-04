
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, Maximize2 } from 'lucide-react';
import { ChartConfig } from '@/components/charts/visualization';
import RechartsWrapper from './charts/RechartsWrapper';
import D3Wrapper from './charts/D3Wrapper';
import html2canvas from 'html2canvas';

interface ChartCardProps {
  config: ChartConfig;
  onRemove: (id: string) => void;
  onMaximize?: (config: ChartConfig) => void;
}

const ChartCard: React.FC<ChartCardProps> = ({ config, onRemove, onMaximize }) => {
  const cardRef = React.useRef<HTMLDivElement>(null);

  const handleExport = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#1f2937',
        scale: 2,
      });
      
      const link = document.createElement('a');
      link.download = `${config.title}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <Card 
      ref={cardRef}
      className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-gray-700 overflow-hidden group hover:shadow-lg transition-all duration-300"
    >
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="font-semibold text-white text-sm truncate">{config.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onMaximize?.(config)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleExport}
            className="h-8 w-8 p-0 text-gray-400 hover:text-white"
          >
            <Download className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onRemove(config.id)}
            className="h-8 w-8 p-0 text-gray-400 hover:text-red-400"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        {config.library === 'recharts' ? (
          <RechartsWrapper config={config} />
        ) : (
          <D3Wrapper config={config} />
        )}
      </div>
      
      <div className="px-4 pb-3 flex justify-between items-center text-xs text-gray-400">
        <span>{config.library === 'recharts' ? 'Recharts' : 'D3.js'}</span>
        <span>{config.data.length} Datenpunkte</span>
      </div>
    </Card>
  );
};

export default ChartCard;
