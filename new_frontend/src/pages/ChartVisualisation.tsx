import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    Bar,
    Line,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    LineChart,
    PieChart,
    ScatterChart,
    Scatter,
    ComposedChart,
    Label
} from 'recharts';
import {
    ChartBarBig,
    ChartLine,
    ChartPie,
    Save,
    ArrowLeft,
    LineChart as LineIcon,
    AreaChart as AreaIcon,
    ScatterChart as ScatterIcon,
    AreaChartIcon,
    ScatterChartIcon,
    X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { sampleDatasets } from "@/pages/Datasets";
import { apiFetch } from "@/utils/api";

const chartColors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-colour1))',
    'hsl(var(--chart-colour2))',
    'hsl(var(--chart-colour3))',
    'hsl(var(--chart-colour4))',
    'hsl(var(--chart-colour5))',
];

interface DatasetSelection {
    id: string;
    name: string;
    data: any[];
    fields: string[];
    color: string;
    yAxisField: string;
}

const ChartVisualization = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const token = localStorage.getItem("jwt");

    const [allDatasets, setAllDatasets] = useState<typeof sampleDatasets>(sampleDatasets);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed'>('line');
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartTitle, setChartTitle] = useState<string>('Neue Visualisierung');
    const [availableFields, setAvailableFields] = useState<string[]>([]);
    const [processedData, setProcessedData] = useState<any>(null);
    const [selectedDatasets, setSelectedDatasets] = useState<DatasetSelection[]>([]);
    const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');

    useEffect(() => {
        const fetchUserDatasets = async () => {
            if (!token) return;

            try {
                const response: any = await apiFetch(
                    `datasets`,
                    "GET",
                    undefined,
                    { Authorization: `Bearer ${token}` }
                );

                if (Array.isArray(response.datasets)) {
                    const userDS = response.datasets.map((ds: any) => {
                        let fieldsArray: string[] = [];
                        if (Array.isArray(ds.fields) && ds.fields.length > 0) {
                            fieldsArray = ds.fields;
                        } else if (Array.isArray(ds.columns) && ds.columns.length > 0) {
                            fieldsArray = ds.columns.map((col: any) => col.name);
                        } else if (Array.isArray(ds.data) && ds.data.length > 0) {
                            fieldsArray = Object.keys(ds.data[0]);
                        }

                        return {
                            id: ds.id,
                            name: ds.name,
                            recordCount: ds.recordCount,
                            createdAt: new Date(ds.createdAt),
                            lastModified: new Date(ds.lastModified),
                            fileType: ds.fileType,
                            data: ds.data,
                            fields: fieldsArray,
                            columns: ds.columns || []
                        };
                    });
                    setAllDatasets([...sampleDatasets, ...userDS]);
                }
            } catch (error) {
                console.error("Fehler beim Laden der Nutzerdatensätze:", error);
                toast({
                    title: "Fehler",
                    description: "Konnte Nutzerdatensätze nicht laden.",
                    variant: "destructive",
                });
            }
        };
        fetchUserDatasets();
    }, [toast, token]);

    useEffect(() => {
        if (location.state && (location.state as any).processedData) {
            const data = (location.state as any).processedData;
            setProcessedData(data);

            if (data.fields && data.fields.length > 0) {
                setAvailableFields(data.fields);
                setXAxis(data.fields[0]);
                const numericField = data.fields.find((field: string) =>
                    data.data.length > 0 && typeof data.data[0][field] === 'number'
                );
                setYAxis(numericField || data.fields[1] || data.fields[0]);

                if (chartType === 'line' || chartType === 'bar' || chartType === 'scatter') {
                    const newDataset: DatasetSelection = {
                        id: 'processed-data',
                        name: 'Verarbeitete Daten',
                        data: data.data,
                        fields: data.fields,
                        color: chartColors[0],
                        yAxisField: numericField || data.fields[1] || data.fields[0]
                    };
                    setSelectedDatasets([newDataset]);
                }
            }
        }
    }, [location, navigate, toast, chartType]);

    useEffect(() => {
        if (chartType === 'line' || chartType === 'bar' || chartType === 'scatter') {
            if (processedData && selectedDatasets.length === 0) {
                const numericField = processedData.fields?.find((field: string) =>
                    processedData.data.length > 0 && typeof processedData.data[0][field] === 'number'
                );
                const newDataset: DatasetSelection = {
                    id: 'processed-data',
                    name: 'Verarbeitete Daten',
                    data: processedData.data,
                    fields: processedData.fields,
                    color: chartColors[0],
                    yAxisField: numericField || processedData.fields[1] || processedData.fields[0]
                };
                setSelectedDatasets([newDataset]);
            }
        } else {
            setSelectedDatasets([]);
        }
    }, [chartType, processedData]);


    useEffect(() => {
        if ((chartType !== 'line' && chartType !== 'bar' && chartType !== 'scatter') && selectedDatasetId) {
            const selected = allDatasets.find(ds => ds.id.toString() === selectedDatasetId);
            if (selected && selected.data && selected.fields) {
                setProcessedData(selected);
                setAvailableFields(selected.fields);
                setXAxis(selected.fields[0]);
                const numericField = selected.fields.find((field: string) =>
                    selected.data.length > 0 && typeof selected.data[0][field] === 'number'
                );
                setYAxis(numericField || selected.fields[1] || selected.fields[0]);
            }
        }
    }, [selectedDatasetId, allDatasets, chartType]);

    const addDataset = () => {
        if (!selectedDatasetId || (chartType !== 'line' && chartType !== 'bar' && chartType !== 'scatter')) return;

        const dataset = allDatasets.find(ds => ds.id.toString() === selectedDatasetId);
        if (!dataset) return;

        if (selectedDatasets.some(ds => ds.id === selectedDatasetId)) {
            toast({
                title: "Warnung",
                description: "Dieser Datensatz wurde bereits ausgewählt.",
                variant: "destructive",
            });
            return;
        }

        const numericField = dataset.fields.find((field: string) =>
            dataset.data.length > 0 && typeof dataset.data[0][field] === 'number'
        );

        const newDataset: DatasetSelection = {
            id: selectedDatasetId,
            name: dataset.name,
            data: dataset.data,
            fields: dataset.fields,
            color: chartColors[selectedDatasets.length % chartColors.length],
            yAxisField: numericField || dataset.fields[1] || dataset.fields[0]
        };

        setSelectedDatasets(prev => [...prev, newDataset]);

        const allFields = [...new Set([...availableFields, ...dataset.fields])];
        setAvailableFields(allFields);

        if (!xAxis && dataset.fields.length > 0) {
            setXAxis(dataset.fields[0]);
        }

        setSelectedDatasetId('');
    };

    const removeDataset = (id: string) => {
        setSelectedDatasets(prev => prev.filter(ds => ds.id !== id));

        if (selectedDatasets.length === 1) {
            setAvailableFields([]);
            setXAxis('');
        }
    };

    const updateDatasetYAxis = (datasetId: string, field: string) => {
        setSelectedDatasets(prev =>
            prev.map(ds =>
                ds.id === datasetId ? { ...ds, yAxisField: field } : ds
            )
        );
    };

    useEffect(() => {
        if ((chartType === 'line' || chartType === 'bar' || chartType === 'scatter') && selectedDatasets.length > 0 && xAxis) {
            if (chartType === 'scatter') {
                const scatterData = selectedDatasets.map((dataset, index) => ({
                    datasetIndex: index,
                    datasetName: dataset.name,
                    data: dataset.data.map((item: any) => ({
                        x: typeof item[xAxis] === 'number' ? item[xAxis] : parseFloat(item[xAxis]) || 0,
                        y: typeof item[dataset.yAxisField] === 'number' ? item[dataset.yAxisField] : parseFloat(item[dataset.yAxisField]) || 0,
                        name: item[xAxis]?.toString() || '',
                        value: typeof item[dataset.yAxisField] === 'number' ? item[dataset.yAxisField] : parseFloat(item[dataset.yAxisField]) || 0
                    })).filter(point => !isNaN(point.x) && !isNaN(point.y))
                }));
                setChartData(scatterData);
            } else {
                const allXValues = new Set<string>();
                selectedDatasets.forEach(dataset => {
                    dataset.data.forEach(item => {
                        if (item[xAxis] !== undefined) {
                            allXValues.add(item[xAxis].toString());
                        }
                    });
                });

                const prepared = Array.from(allXValues).map(xValue => {
                    const dataPoint: any = { name: xValue };

                    selectedDatasets.forEach((dataset, index) => {
                        const matchingItem = dataset.data.find(item =>
                            item[xAxis]?.toString() === xValue
                        );

                        const datasetKey = `dataset_${index}`;
                        dataPoint[datasetKey] = matchingItem && typeof matchingItem[dataset.yAxisField] === 'number'
                            ? matchingItem[dataset.yAxisField]
                            : null;
                    });

                    return dataPoint;
                }).sort((a, b) => {
                    const aNum = parseFloat(a.name);
                    const bNum = parseFloat(b.name);
                    if (!isNaN(aNum) && !isNaN(bNum)) {
                        return aNum - bNum;
                    }
                    return a.name.localeCompare(b.name);
                });

                setChartData(prepared);
            }
        } else if ((chartType !== 'line' && chartType !== 'bar' && chartType !== 'scatter') && processedData && xAxis && yAxis) {
            const prepared = processedData.data.map((item: any) => ({
                name: item[xAxis]?.toString() || '',
                x: typeof item[xAxis] === 'number' ? item[xAxis] : undefined,
                y: typeof item[yAxis] === 'number' ? item[yAxis] : 0,
                value: typeof item[yAxis] === 'number' ? item[yAxis] : 0
            }));
            setChartData(prepared);
        } else {
            setChartData([]);
        }
    }, [selectedDatasets, xAxis, yAxis, processedData, chartType]);

    const saveVisualization = () => {
        const newViz = {
            id: crypto.randomUUID(),
            title: chartTitle,
            type: chartType,
            data: chartData,
            xAxis,
            yAxis: (chartType === 'line' || chartType === 'bar' || chartType === 'scatter') ? undefined : yAxis,
            selectedDatasets: (chartType === 'line' || chartType === 'bar' || chartType === 'scatter') ? selectedDatasets.map(ds => ({
                id: ds.id,
                name: ds.name,
                yAxisField: ds.yAxisField,
                color: ds.color
            })) : undefined,
        };

        const existing = JSON.parse(localStorage.getItem('savedVisualizations') || '[]');
        localStorage.setItem('savedVisualizations', JSON.stringify([...existing, newViz]));

        toast({ title: 'Gespeichert', description: 'Visualisierung wurde gespeichert.' });
        navigate('/visualizations');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChartTitle(e.target.value);
    };

    const renderChartByType = () => {
        if (!chartData || chartData.length === 0) {
            return (
                <div className="flex items-center justify-center h-[300px] bg-muted/20">
                    <p className="text-muted-foreground">Wählen Sie Datensätze und Achsen für die Visualisierung</p>
                </div>
            );
        }

        if (chartType === 'line' || chartType === 'bar') {
            const CustomTooltip = ({ active, payload, label }: any) => {
                if (active && payload && payload.length) {
                    return (
                        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                            <p className="font-medium">{`${xAxis}: ${label}`}</p>
                            {payload.map((entry: any, index: number) => {
                                const dataset = selectedDatasets[index];
                                return (
                                    <p key={index} style={{ color: entry.color }}>
                                        {`${dataset?.name}: ${entry.value !== null ? entry.value : 'Keine Daten'}`}
                                    </p>
                                );
                            })}
                        </div>
                    );
                }
                return null;
            };

            if (chartType === 'line') {
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {selectedDatasets.map((dataset, index) => (
                                <Line
                                    key={dataset.id}
                                    type="monotone"
                                    dataKey={`dataset_${index}`}
                                    stroke={dataset.color}
                                    strokeWidth={2}
                                    name={dataset.name}
                                    connectNulls={false}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                );
            } else {
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            {selectedDatasets.map((dataset, index) => (
                                <Bar
                                    key={dataset.id}
                                    dataKey={`dataset_${index}`}
                                    fill={dataset.color}
                                    name={dataset.name}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                );
            }
        }

        if (chartType === 'scatter') {
            return (
                <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                        <CartesianGrid />
                        <XAxis dataKey="x" name="X" />
                        <YAxis dataKey="y" name="Y" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                        <Legend />
                        {chartData.map((datasetInfo: any) => (
                            <Scatter
                                key={datasetInfo.datasetIndex}
                                name={datasetInfo.datasetName}
                                data={datasetInfo.data}
                                fill={selectedDatasets[datasetInfo.datasetIndex]?.color || chartColors[datasetInfo.datasetIndex]}
                            />
                        ))}
                    </ScatterChart>
                </ResponsiveContainer>
            );
        }

        switch (chartType) {
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Tooltip />
                            <Legend />
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                                {chartData.map((_, index) => (
                                    <Cell key={index} fill={chartColors[index % chartColors.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                );
            case 'area':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="value" stroke={chartColors[2]} fill={chartColors[2]} />
                        </AreaChart>
                    </ResponsiveContainer>
                );
            case 'composed':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ComposedChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Area type="monotone" dataKey="value" fill={chartColors[4]} stroke={chartColors[4]} />
                            <Bar dataKey="value" barSize={20} fill={chartColors[5]} />
                            <Line type="monotone" dataKey="value" stroke={chartColors[6]} />
                        </ComposedChart>
                    </ResponsiveContainer>
                );
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Visualisierung erstellen</h1>
                        <p>Wählen Sie einen Datensatz für Ihre Datenvisualisierung</p>
                    </div>
                    <Button>
                        <Link to="/" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Zurück
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Visualisierungseinstellungen</CardTitle>
                                <CardDescription>Wählen Sie den Diagrammtyp und die Datenfelder</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Diagrammtyp
                                    </label>
                                    <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
                                        <TabsList className="grid grid-cols-3 grid-rows-1 gap-1 w-full h-full">
                                            <TabsTrigger value="pie" className="flex items-center gap-1">
                                                <ChartPie className="h-4 w-4" /> Kreis
                                            </TabsTrigger>
                                            <TabsTrigger value="area" className="flex items-center gap-1">
                                                <AreaChartIcon className="h-4 w-4" /> Fläche
                                            </TabsTrigger>
                                            <TabsTrigger value="composed" className="flex items-center gap-1">
                                                <ChartLine className="h-4 w-4" /> Kombiniert
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            erweiterte Diagrammtypen
                                        </label>
                                        <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
                                            <TabsList className="grid grid-cols-3 grid-rows-1 gap-1 w-full h-full">
                                                <TabsTrigger value="bar" className="flex items-center gap-1">
                                                    <ChartBarBig className="h-4 w-4" /> Balken
                                                </TabsTrigger>
                                                <TabsTrigger value="line" className="flex items-center gap-1">
                                                    <ChartLine className="h-4 w-4" /> Linie
                                                </TabsTrigger>
                                                <TabsTrigger value="scatter" className="flex items-center gap-1">
                                                    <ScatterChartIcon className="h-4 w-4" /> Punkt
                                                </TabsTrigger>
                                            </TabsList>
                                        </Tabs>
                                    </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Titel
                                    </label>
                                    <input
                                        type="text"
                                        value={chartTitle}
                                        onChange={handleInputChange}
                                        className="w-full text-sm rounded-md border p-2 bg-white text-black dark:bg-[#020817] dark:border-[#1E293B] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                {chartType === 'line' || chartType === 'bar' || chartType === 'scatter' ? (
                                    <>
                                        <div className="space-y-3">
                                            <label className="block text-sm font-medium">
                                                Datensätze hinzufügen
                                            </label>
                                            <div className="flex gap-2">
                                                <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                                                    <SelectTrigger className="flex-1">
                                                        <SelectValue placeholder="Datensatz auswählen" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {allDatasets
                                                            .filter(dataset => !selectedDatasets.some(selected => selected.id === dataset.id.toString()))
                                                            .map((dataset) => (
                                                                <SelectItem key={dataset.id} value={dataset.id.toString()}>
                                                                    {dataset.name}
                                                                </SelectItem>
                                                            ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button onClick={addDataset} disabled={!selectedDatasetId} size="sm">
                                                    Hinzufügen
                                                </Button>
                                            </div>
                                        </div>

                                        {selectedDatasets.length > 0 && (
                                            <div className="space-y-3">
                                                <label className="block text-sm font-medium">
                                                    Ausgewählte Datensätze ({selectedDatasets.length})
                                                </label>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {selectedDatasets.map((dataset) => (
                                                        <div key={dataset.id} className="flex items-center justify-between p-2 border rounded-md">
                                                            <div className="flex items-center gap-2 flex-1">
                                                                <div
                                                                    className="w-4 h-4 rounded"
                                                                    style={{ backgroundColor: dataset.color }}
                                                                />
                                                                <span className="text-sm font-medium truncate">{dataset.name}</span>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeDataset(dataset.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedDatasets.length > 0 && (
                                            <>
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">
                                                        X-Achse / Kategorien
                                                    </label>
                                                    <Select value={xAxis} onValueChange={setXAxis}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="X-Achse wählen" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {availableFields.map((field) => (
                                                                <SelectItem key={field} value={field}>
                                                                    {field}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="block text-sm font-medium">
                                                        Y-Achse / Werte pro Datensatz
                                                    </label>
                                                    {selectedDatasets.map((dataset) => (
                                                        <div key={dataset.id} className="flex items-center gap-2">
                                                            <div
                                                                className="w-3 h-3 rounded"
                                                                style={{ backgroundColor: dataset.color }}
                                                            />
                                                            <span className="text-xs text-muted-foreground min-w-0 flex-shrink truncate">
                                                                {dataset.name}:
                                                            </span>
                                                            <Select
                                                                value={dataset.yAxisField}
                                                                onValueChange={(value) => updateDatasetYAxis(dataset.id, value)}
                                                            >
                                                                <SelectTrigger className="flex-1">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {dataset.fields.map((field) => (
                                                                        <SelectItem key={field} value={field}>
                                                                            {field}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium mb-1">
                                                Datensätze
                                            </label>
                                            <Select value={selectedDatasetId} onValueChange={setSelectedDatasetId}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Datensatz auswählen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allDatasets.map((dataset) => (
                                                        <SelectItem key={dataset.id} value={dataset.id.toString()}>
                                                            {dataset.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                X-Achse / Kategorien
                                            </label>
                                            <Select value={xAxis} onValueChange={setXAxis}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="X-Achse wählen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableFields.map((field) => (
                                                        <SelectItem key={field} value={field}>
                                                            {field}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Y-Achse / Werte
                                            </label>
                                            <Select value={yAxis} onValueChange={setYAxis}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Y-Achse wählen" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableFields.map((field) => (
                                                        <SelectItem key={field} value={field}>
                                                            {field}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button
                                    onClick={saveVisualization}
                                    className="w-full"
                                    disabled={!chartData.length}
                                >
                                    <Save className="h-4 w-4 mr-2" /> Visualisierung speichern
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{chartTitle}</CardTitle>
                                {(chartType === 'line' || chartType === 'bar' || chartType === 'scatter') && selectedDatasets.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {selectedDatasets.map((dataset) => (
                                            <Badge
                                                key={dataset.id}
                                                variant="outline"
                                                className="flex items-center gap-1"
                                            >
                                                <div
                                                    className="w-2 h-2 rounded"
                                                    style={{ backgroundColor: dataset.color }}
                                                />
                                                {dataset.name}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                {renderChartByType()}
                            </CardContent>
                        </Card>

                        {(((chartType === 'line' || chartType === 'bar' || chartType === 'scatter') && selectedDatasets.length > 0) || ((chartType !== 'line' && chartType !== 'bar' && chartType !== 'scatter') && processedData)) && (
                            <div className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Datenvorschau</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {chartType === 'line' || chartType === 'bar' || chartType === 'scatter' ? (
                                            <div className="space-y-4">
                                                {selectedDatasets.map((dataset) => (
                                                    <div key={dataset.id}>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div
                                                                className="w-3 h-3 rounded"
                                                                style={{ backgroundColor: dataset.color }}
                                                            />
                                                            <h4 className="font-medium">{dataset.name}</h4>
                                                        </div>
                                                        <div className="overflow-auto max-h-[150px] border rounded">
                                                            <table className="w-full border-collapse text-sm">
                                                                <thead className="bg-muted">
                                                                <tr>
                                                                    {dataset.fields.slice(0, 4).map((field, fieldIndex) => (
                                                                        <th key={fieldIndex} className="text-left p-2 border text-xs">
                                                                            {field}
                                                                        </th>
                                                                    ))}
                                                                    {dataset.fields.length > 4 && (
                                                                        <th className="text-left p-2 border text-xs">...</th>
                                                                    )}
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {dataset.data.map((row: any, rowIndex: number) => (
                                                                    <tr key={rowIndex}>
                                                                        {dataset.fields.slice(0, 4).map((field, colIndex) => (
                                                                            <td key={colIndex} className="p-2 border text-xs">
                                                                                {row[field] !== undefined ? String(row[field]).slice(0, 20) : ''}
                                                                            </td>
                                                                        ))}
                                                                        {dataset.fields.length > 4 && (
                                                                            <td className="p-2 border text-xs">...</td>
                                                                        )}
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="overflow-auto max-h-[200px]">
                                                <table className="w-full border-collapse">
                                                    <thead className="bg-muted">
                                                    <tr>
                                                        {availableFields.map((field, index) => (
                                                            <th key={index} className="text-left p-2 border">{field}</th>
                                                        ))}
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {processedData?.data?.map((row: any, rowIndex: number) => (
                                                        <tr key={rowIndex}>
                                                            {availableFields.map((field, colIndex) => (
                                                                <td key={colIndex} className="p-2 border">
                                                                    {row[field] !== undefined ? String(row[field]) : ''}
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChartVisualization;