
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { FileUp, Database, FileJson, FileSpreadsheet, Server } from 'lucide-react';

interface ImportDataDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport?: (data: any) => void;
}

export function ImportDataDialog({ 
  open, 
  onOpenChange, 
  onImport 
}: ImportDataDialogProps) {
  const [activeTab, setActiveTab] = useState('json');
  const [datasetName, setDatasetName] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  
  const handleImport = () => {
    // Here you would process the data and send it to the parent component
    if (onImport) {
      onImport({
        name: datasetName,
        type: activeTab,
        content: activeTab === 'json' ? jsonContent : null,
      });
    }
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] fixed top-[10%] left-[33.6%] transform -translate-x-1/2 -translate-y-1/2">
      <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <span className="text-sm">Import Data</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Import your data from various sources to start visualizing
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="mb-4">
            <Label htmlFor="dataset-name">Dataset Name</Label>
            <Input 
              id="dataset-name" 
              value={datasetName} 
              onChange={(e) => setDatasetName(e.target.value)} 
              placeholder="My Dataset"
              className="mt-1 text-sm"
            />
          </div>
          
          <Tabs defaultValue="json" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full text-xs">
              <TabsTrigger value="json" className="flex-1 text-xs">
                <FileJson className="h-4 w-4 mr-2" />
                JSON
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex-1 text-xs">
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                CSV
              </TabsTrigger>
              <TabsTrigger value="sql" className="flex-1 text-xs">
                <Server className="h-4 w-4 mr-2" />
                SQL
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="json" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label>Upload JSON File</Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center justify-center text-center text-xs">
                      <FileUp className="h-6 w-6 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop your JSON file here, or click to browse
                      </p>
                      <input type="file" className="hidden" accept=".json" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="json-content">Or paste JSON</Label>
                  <Textarea 
                    id="json-content" 
                    placeholder='[{"name": "Example", "value": 42}]'
                    value={jsonContent}
                    onChange={(e) => setJsonContent(e.target.value)}
                    className="mt-1 font-mono text-xs h-[80px]"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="csv" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label>Upload CSV File</Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
                    <div className="flex flex-col items-center justify-center text-center">
                      <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Drag & drop your CSV file here, or click to browse
                      </p>
                      <input type="file" className="hidden" accept=".csv" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sql" className="pt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sql-query">SQL Query</Label>
                  <Textarea 
                    id="sql-query" 
                    placeholder="SELECT * FROM table WHERE ..."
                    className="mt-1 font-mono text-sm h-[200px]"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="space-x-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={!datasetName}
            className="text-xs py-1 px-2"
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
