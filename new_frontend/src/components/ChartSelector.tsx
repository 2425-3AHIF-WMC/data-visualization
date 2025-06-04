
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChartConfig, DataSource } from '@/components/charts/visualization.ts';

interface ChartSelectorProps {
  dataSource: DataSource;
  onChartCreate: (config: ChartConfig) => void;
}

const ChartSelector: React.FC<ChartSelectorProps> = ({ dataSource, onChartCreate }) => {
  const [selectedType, setSelectedType] = useState<'line' | 'bar' | 'pie' | 'area'>('line');
  const [xAxis, setXAxis] = useState(dataSource.columns[0] || '');
  const [yAxis, setYAxis] = useState(dataSource.columns[1] || '');
  const [title, setTitle] = useState(`${dataSource.name} Chart`);

  const handleCreate = () => {
    const config: ChartConfig = {
      id: `chart-${Date.now()}`,
      type: selectedType,
      data: dataSource.data,
      xAxis,
      yAxis,
      title,
      library: 'recharts',
      width: 400,
      height: 300
    };
    
    onChartCreate(config);
  };

  return (
    <Card className="p-4 bg-gray-800 border-gray-700">
      <h4 className="text-white font-semibold mb-4">{dataSource.name}</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Chart Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(['line', 'bar', 'pie', 'area'] as const).map(type => (
              <Button
                key={type}
                size="sm"
                variant={selectedType === type ? 'default' : 'outline'}
                onClick={() => setSelectedType(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
          />
        </div>

        {selectedType !== 'pie' && (
          <>
            <div>
              <label className="block text-sm text-gray-300 mb-2">X-Axis</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                {dataSource.columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">Y-Axis</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600"
              >
                {dataSource.columns.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </>
        )}

        <Button onClick={handleCreate} className="w-full bg-blue-600 hover:bg-blue-700">
          Create Chart
        </Button>
      </div>
    </Card>
  );
};

export default ChartSelector;
