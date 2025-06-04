
import React, { useCallback } from 'react';
import { Upload, FileText, Database, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Papa from 'papaparse';
import { DataSource, DataPoint } from '@/components/charts/visualization';

interface DataUploadProps {
  onDataLoad: (dataSource: DataSource) => void;
}

const DataUpload: React.FC<DataUploadProps> = ({ onDataLoad }) => {
  const [apiUrl, setApiUrl] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      if (file.name.endsWith('.csv')) {
        Papa.parse(content, {
          header: true,
          complete: (results) => {
            const data = results.data as DataPoint[];
            const validData = data.filter(row => Object.values(row).some(val => val !== ''));
            const columns = Object.keys(validData[0] || {});
            
            onDataLoad({
              id: Date.now().toString(),
              name: file.name,
              type: 'csv',
              data: validData,
              columns,
              schema: {
                fields: columns.map(col => ({
                  name: col,
                  type: inferDataType(validData, col),
                  nullable: true
                }))
              }
            });
          }
        });
      } else if (file.name.endsWith('.json')) {
        try {
          const jsonData = JSON.parse(content);
          const data = Array.isArray(jsonData) ? jsonData : [jsonData];
          const columns = Object.keys(data[0] || {});
          
          onDataLoad({
            id: Date.now().toString(),
            name: file.name,
            type: 'json',
            data,
            columns,
            schema: {
              fields: columns.map(col => ({
                name: col,
                type: inferDataType(data, col),
                nullable: true
              }))
            }
          });
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      }
    };
    
    reader.readAsText(file);
  }, [onDataLoad]);

  const loadFromAPI = async () => {
    if (!apiUrl) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const processedData = Array.isArray(data) ? data : [data];
      const columns = Object.keys(processedData[0] || {});
      
      onDataLoad({
        id: Date.now().toString(),
        name: `API Data - ${new URL(apiUrl).hostname}`,
        type: 'api',
        data: processedData,
        columns,
        url: apiUrl,
        schema: {
          fields: columns.map(col => ({
            name: col,
            type: inferDataType(processedData, col),
            nullable: true
          }))
        }
      });
    } catch (error) {
      console.error('Error loading from API:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSampleData = () => {
    const datasets = [
      {
        name: 'Sales Performance',
        data: [
          { month: 'Jan', sales: 120, profit: 45, region: 'North', category: 'Electronics' },
          { month: 'Feb', sales: 135, profit: 52, region: 'North', category: 'Electronics' },
          { month: 'Mar', sales: 148, profit: 58, region: 'South', category: 'Clothing' },
          { month: 'Apr', sales: 162, profit: 61, region: 'South', category: 'Electronics' },
          { month: 'May', sales: 178, profit: 68, region: 'East', category: 'Books' },
          { month: 'Jun', sales: 195, profit: 75, region: 'East', category: 'Electronics' },
          { month: 'Jul', sales: 210, profit: 82, region: 'West', category: 'Clothing' },
          { month: 'Aug', sales: 188, profit: 71, region: 'North', category: 'Books' },
          { month: 'Sep', sales: 205, profit: 78, region: 'South', category: 'Electronics' },
          { month: 'Oct', sales: 220, profit: 85, region: 'East', category: 'Clothing' },
          { month: 'Nov', sales: 235, profit: 92, region: 'West', category: 'Electronics' },
          { month: 'Dec', sales: 250, profit: 98, region: 'North', category: 'Books' }
        ]
      },
      {
        name: 'Customer Demographics',
        data: [
          { age: 25, income: 45000, city: 'New York', satisfaction: 8.5, purchases: 12 },
          { age: 34, income: 62000, city: 'Los Angeles', satisfaction: 7.2, purchases: 8 },
          { age: 45, income: 78000, city: 'Chicago', satisfaction: 9.1, purchases: 15 },
          { age: 28, income: 51000, city: 'Houston', satisfaction: 6.8, purchases: 6 },
          { age: 37, income: 69000, city: 'Phoenix', satisfaction: 8.9, purchases: 11 },
          { age: 52, income: 85000, city: 'Philadelphia', satisfaction: 7.7, purchases: 9 },
          { age: 29, income: 48000, city: 'San Antonio', satisfaction: 8.2, purchases: 10 },
          { age: 41, income: 71000, city: 'San Diego', satisfaction: 8.8, purchases: 13 }
        ]
      },
      {
        name: 'Network Data',
        data: [
          { id: 'A', type: 'node', value: 10, group: 1 },
          { id: 'B', type: 'node', value: 15, group: 1 },
          { id: 'C', type: 'node', value: 20, group: 2 },
          { id: 'D', type: 'node', value: 12, group: 2 },
          { source: 'A', target: 'B', type: 'link', value: 5 },
          { source: 'B', target: 'C', type: 'link', value: 8 },
          { source: 'C', target: 'D', type: 'link', value: 3 },
          { source: 'A', target: 'D', type: 'link', value: 7 }
        ]
      }
    ];

    datasets.forEach((dataset, index) => {
      const columns = Object.keys(dataset.data[0] || {});
      onDataLoad({
        id: `sample-${index}`,
        name: dataset.name,
        type: 'json',
        data: dataset.data,
        columns,
        schema: {
          fields: columns.map(col => ({
            name: col,
            type: inferDataType(dataset.data, col),
            nullable: true
          }))
        }
      });
    });
  };

  const inferDataType = (data: any[], column: string): 'string' | 'number' | 'date' | 'boolean' => {
    if (data.length === 0) return 'string';
    
    const sample = data.slice(0, 10);
    const values = sample.map(row => row[column]).filter(val => val !== null && val !== undefined && val !== '');
    
    if (values.length === 0) return 'string';
    
    // Check if all values are numbers
    if (values.every(val => !isNaN(Number(val)))) {
      return 'number';
    }
    
    // Check if all values are booleans
    if (values.every(val => val === true || val === false || val === 'true' || val === 'false')) {
      return 'boolean';
    }
    
    // Check if all values are dates
    if (values.every(val => !isNaN(Date.parse(val)))) {
      return 'date';
    }
    
    return 'string';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Database className="w-12 h-12 text-cyan-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">Upload Files</h3>
          
          <div className="space-y-3">
            <div>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild className="bg-cyan-600 hover:bg-cyan-700 w-full">
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload CSV/JSON Files
                  </span>
                </Button>
              </label>
            </div>
            
            <Button 
              onClick={loadSampleData}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-700 w-full"
            >
              <FileText className="w-4 h-4 mr-2" />
              Load Sample Datasets
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-gray-700">
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Globe className="w-12 h-12 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white">Load from API</h3>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label htmlFor="api-url" className="text-white">API Endpoint URL</Label>
              <Input
                id="api-url"
                type="url"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                placeholder="https://api.example.com/data"
                className="bg-gray-800 border-gray-600 text-white"
              />
            </div>
            
            <Button 
              onClick={loadFromAPI}
              disabled={!apiUrl || isLoading}
              className="bg-green-600 hover:bg-green-700 w-full"
            >
              {isLoading ? 'Loading...' : 'Load from API'}
            </Button>
          </div>
          
          <div className="text-xs text-gray-400 space-y-1">
            <p>• Supports JSON APIs</p>
            <p>• CORS must be enabled</p>
            <p>• Public APIs work best</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DataUpload;
