import React, {useState} from 'react';
import {FileUploader} from '../components/FileUploader';
import {Layout} from '../components/Layout';
import {processData} from '../utils/dataProcessor';
import {Button} from '../components/ui/button';
import {Database, Plus, Upload} from 'lucide-react';
import {ImportDataDialog} from '../components/ImportDataDialog';
import {useNavigate} from "react-router-dom";
import {data} from "autoprefixer";
import {useToast} from "@/hooks/use-toast.ts";

const DataImport = () => {
    const { toast } = useToast();
    const [processedData, setProcessedData] = useState<any>(null);
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const navigate = useNavigate();

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
        setProcessedData(data);
        toast({
            title: "Daten erfolgreich importiert",
            description: `${data.data.length} Datensätze importiert`,
        });

        // Redirect to visualization page after successful import
        navigate('/chart', { state: { processedData: data } });
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold mb-4">Daten Importieren</h1>
                    <p className="text-muted-foreground mb-6">
                        Import your data to start the visualization </p>
                    <Button
                        onClick={() => setIsImportDialogOpen(true)}
                        className="flex items-center"
                        size="lg"
                    >
                        <Plus className="mr-2 h-4 w-4"/>
                        Import New Dataset
                    </Button>
                </div>

                {processedData ? (
                    <div className="bg-card border rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Imported Data</h2>
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
                        <div
                            className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Database className="h-10 w-10 text-primary"/>
                        </div>
                        <h3 className="text-xl font-medium mb-2">No Data Available</h3>
                        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            Drag and drop a file here or click the button below to import data
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
