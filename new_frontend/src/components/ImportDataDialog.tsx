import React, {useState, useRef} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {Textarea} from './ui/textarea';
import {FileUp, Database, FileJson, FileSpreadsheet, Server, Globe} from 'lucide-react';
import {apiFetch} from '@/utils/api';

interface ImportDataDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImport?: (data: any) => void;
}

export function ImportDataDialog({
                                     open,
                                     onOpenChange,
                                     onImport,
                                 }: ImportDataDialogProps) {
    const [activeTab, setActiveTab] = useState('json');
    const [datasetName, setDatasetName] = useState('');
    const [jsonContent, setJsonContent] = useState('');
    const [url, setUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const token = localStorage.getItem("jwt");

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const text = await file.text();
            setJsonContent(text);
            if (!datasetName) {
                setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            const text = await file.text();
            setJsonContent(text);
            if (!datasetName) {
                setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
            }
        }
    };

    const handleUrlFetch = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const text = await response.text();

            if (activeTab === 'url') {
                // Versuche JSON zu parsen; wenn es fehlschlägt, zeige Rohtext
                try {
                    const parsed = JSON.parse(text);
                    setJsonContent(JSON.stringify(parsed, null, 2));
                } catch {
                    setJsonContent(text);
                }
            }
        } catch (error) {
            alert('Konnte Datei nicht laden. Prüfe die URL und das Format.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImport = async () => {
        if (!datasetName.trim()) return;

        try {
            let payload: any = {
                datasetName: datasetName,
                source: activeTab,
            };

            if (activeTab === 'json') {
                payload.content = JSON.parse(jsonContent);

            } else if (activeTab === 'csv') {
                payload.content = jsonContent;
            } else if(activeTab==='url'){
                try {
                    // Versuche, aus jsonContent ein Objekt zu machen, falls es gültiges JSON ist
                    payload.content = JSON.parse(jsonContent);
                } catch {
                    // Falls kein JSON, schicke den rohen String (z.B. CSV o.ä.)
                    payload.content = jsonContent;
                }
            }

            const result = await apiFetch('datasets/import', 'POST', payload, {
                Authorization: `Bearer ${token}`
            });

            /*  if (onImport) {
                  onImport({...payload, serverResponse: result});
              }*/

            onOpenChange(false);
        } catch (err) {
            console.error('Import failed:', err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="sm:max-w-[500px] h-[600px] fixed top-[10%] left-[33.6%] transform -translate-x-1/2 -translate-y-1/2">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5"/>
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

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full text-xs">
                            <TabsTrigger value="json" className="flex-1 text-xs">
                                <FileJson className="h-4 w-4 mr-2"/> JSON
                            </TabsTrigger>
                            <TabsTrigger value="csv" className="flex-1 text-xs">
                                <FileSpreadsheet className="h-4 w-4 mr-2"/> CSV
                            </TabsTrigger>
                            <TabsTrigger value="sql" className="flex-1 text-xs">
                                <Server className="h-4 w-4 mr-2"/> SQL
                            </TabsTrigger>
                            <TabsTrigger value="url" className="flex-1 text-xs">
                                <Globe className="h-4 w-4 mr-2"/> URL
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="json" className="pt-4">
                            <Label>Upload JSON File</Label>
                            <div
                                onClick={handleFileClick}
                                onDrop={handleDrop}
                                onDragOver={(e) => e.preventDefault()}
                                className="mt-1 border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:border-primary/50 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center text-center text-xs">
                                    <FileUp className="h-6 w-6 text-muted-foreground mb-2"/>
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop your JSON file here, or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".json"
                                    />
                                </div>
                            </div>
                            <Label htmlFor="json-content" className="mt-2 block">Or paste JSON</Label>
                            <Textarea
                                id="json-content"
                                placeholder='[{"name": "Example", "value": 42}]'
                                value={jsonContent}
                                onChange={(e) => setJsonContent(e.target.value)}
                                className="mt-1 font-mono text-xs h-[80px]"
                            />
                        </TabsContent>

                        <TabsContent value="csv" className="pt-4">
                            <Label>Upload CSV File</Label>
                            <div
                                onClick={handleFileClick}
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                className="mt-1 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors"
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <FileUp className="h-8 w-8 text-muted-foreground mb-2"/>
                                    <p className="text-sm text-muted-foreground">
                                        Drag & drop your CSV file here, or click to browse
                                    </p>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".csv"
                                    />
                                </div>
                            </div>
                            <Textarea
                                placeholder="name,value\nTest,123"
                                value={jsonContent}
                                onChange={(e) => setJsonContent(e.target.value)}
                                className="mt-2 font-mono text-xs h-[80px]"
                            />
                        </TabsContent>

                        <TabsContent value="sql" className="pt-4">
                            <Label htmlFor="sql-query">SQL Query</Label>
                            <Textarea
                                id="sql-query"
                                placeholder="SELECT * FROM table WHERE ..."
                                className="mt-1 font-mono text-sm h-[200px]"
                            />
                        </TabsContent>

                        <TabsContent value="url" className="pt-4">
                            <Label htmlFor="url-input">URL to data file (CSV or JSON)</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="url-input"
                                    placeholder="https://example.com/data.json"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                />
                                <Button onClick={handleUrlFetch} disabled={!url.trim() || isLoading}>
                                    {isLoading ? 'Loading...' : 'Fetch'}
                                </Button>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Enter a direct link to a file.
                            </p>

                            <Label htmlFor="url-result" className="mt-2 block">Result:</Label>
                            <Textarea
                                id="url-result"
                                readOnly
                                value={jsonContent}
                                className="mt-1 font-mono text-xs h-[150px] overflow-auto"
                            />
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="space-x-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Tooltip>
                        <TooltipTrigger asChild>
              <span>
                <Button
                    onClick={handleImport}
                    disabled={!datasetName.trim()}
                    className="text-xs py-1 px-2"
                >
                  Import
                </Button>
              </span>
                        </TooltipTrigger>
                        {!datasetName.trim() && (
                            <TooltipContent side="top" className="text-xs">
                                Please enter a dataset name
                            </TooltipContent>
                        )}
                    </Tooltip>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
