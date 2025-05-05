import React, {useState, useRef} from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from './ui/dialog';
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from './ui/tabs';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {Label} from './ui/label';
import {Textarea} from './ui/textarea';
import {FileUp, Database, FileJson, FileSpreadsheet, Server} from 'lucide-react';
import {apiFetch} from "@/utils/api.ts";

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

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const text = await file.text();
            setJsonContent(text);
        }
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type === 'application/json') {
            const text = await file.text();
            setJsonContent(text);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleImport = async () => {

        //  todo Here you would process the data and send it to the parent component
        if (!datasetName) return;     // 🚨 sicherstellen, dass ein Name gesetzt ist

        try {

            let payload: any= {
                name: datasetName,
                type: activeTab,
            };

            if (activeTab === 'json') {
                const jsonParsed= JSON.parse(jsonContent)
                payload.content = jsonParsed;}


                const result = await apiFetch('/datasets/import/json', 'POST', payload);


            if (onImport) {
                onImport({

                    /*name: datasetName,
                    type: activeTab,
                    content: activeTab === 'json' ? payload : null,*/
                    ...payload,
                    serverResponse:result
                });
            }
            onOpenChange(false);
        } catch (err) {
            console.error('Import failed:', err.message);
        }
    };

    // todo: URL Dings...Ich will eine url eingeben können

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

                    <Tabs defaultValue="json" value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="w-full text-xs">
                            <TabsTrigger value="json" className="flex-1 text-xs">
                                <FileJson className="h-4 w-4 mr-2"/>
                                JSON
                            </TabsTrigger>
                            <TabsTrigger value="csv" className="flex-1 text-xs">
                                <FileSpreadsheet className="h-4 w-4 mr-2"/>
                                CSV
                            </TabsTrigger>
                            <TabsTrigger value="sql" className="flex-1 text-xs">
                                <Server className="h-4 w-4 mr-2"/>
                                SQL
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="json" className="pt-4">
                            <div className="space-y-4">
                                <div>
                                    <Label>Upload JSON File</Label>
                                    <div
                                        onClick={handleFileClick}
                                        onDrop={handleDrop}
                                        onDragOver={(e) => e.preventDefault()}
                                        className="mt-1 border-2 border-dashed border-border rounded-md p-4 cursor-pointer hover:border-primary/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center text-center text-xs">
                                            <FileUp className="h-6 w-6 text-muted-foreground mb-2"/>
                                            <p className="text-sm text-muted-foreground">
                                                Drag & drop your JSON file here, or click to browse
                                            </p>
                                            <input type="file"
                                                   ref={fileInputRef}
                                                   onChange={handleFileChange}
                                                   className="hidden"
                                                   accept=".json"/>
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
                                    <div
                                        className="mt-1 border-2 border-dashed border-border rounded-md p-6 cursor-pointer hover:border-primary/50 transition-colors">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <FileUp className="h-8 w-8 text-muted-foreground mb-2"/>
                                            <p className="text-sm text-muted-foreground">
                                                Drag & drop your CSV file here, or click to browse
                                            </p>
                                            <input type="file" className="hidden" accept=".csv"/>
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
