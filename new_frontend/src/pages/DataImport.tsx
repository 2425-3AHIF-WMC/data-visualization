
import React, { useState } from 'react';
import { FileUploader } from '../components/FileUploader';
import { Layout } from '../components/Layout';
import { processData } from '../utils/dataProcessor';
import { Button } from '../components/ui/button';
import { Database, Plus, Upload } from 'lucide-react';
import { ImportDataDialog } from '../components/ImportDataDialog';

const DataImport = () => {
  const [processedData, setProcessedData] = useState<any>(null);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);

  const handleFileUpload = async (file: File) => {
    try {
      const fileText = await file.text();
      let fileType: 'csv' | 'json' = 'csv';
      
      if (file.type === 'application/json') {
        fileType = 'json';
      } else if (file.type === 'text/csv') {
        fileType = 'csv';
      } else {
        console.error('Unsupported file type');
        return;
      }
      
      const data = processData(fileText, fileType);
      setProcessedData({
        fields: data.columns,
        data: data.records
      });
    } catch (error) {
      console.error('Error processing file:', error);
    }
  };

  const handleDataImport = (data: any) => {
    console.log('Imported data:', data);
    // Process the imported data here
    // This is where you'd normally send the data to your backend or store it locally
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-4">Daten Importieren</h1>
          <p className="text-muted-foreground mb-6">
            Importieren Sie Ihre Daten, um mit der Visualisierung zu beginnen
          </p>
          <Button 
            onClick={() => setIsImportDialogOpen(true)}
            className="flex items-center"
            size="lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            Neuen Datensatz importieren
          </Button>
        </div>
        
        {processedData ? (
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Importierte Daten</h2>
            <div className="overflow-auto max-h-[500px]">
              <table className="w-full border-collapse">
                <thead className="bg-muted">
                  <tr>
                    {processedData.fields && processedData.fields.map((field: string, index: number) => (
                      <th key={index} className="text-left p-2 border">{field}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedData.data && processedData.data.map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {processedData.fields && processedData.fields.map((field: string, colIndex: number) => (
                        <td key={colIndex} className="p-2 border">
                          {row[field] !== undefined ? row[field].toString() : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-card border rounded-lg p-10 text-center">
            <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Database className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Keine Daten vorhanden</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Ziehen Sie eine Datei hierher oder klicken Sie auf die Schaltfläche unten, um Daten zu importieren
            </p>
            <div className="mt-4">
              <FileUploader 
                onFileUpload={handleFileUpload}
                accept=".csv,.json"
              />
            </div>
          </div>
        )}
      </div>
      
      <ImportDataDialog 
        open={isImportDialogOpen} 
        onOpenChange={setIsImportDialogOpen}
        onImport={handleDataImport}
      />
    </Layout>
  );
};

export default DataImport;
