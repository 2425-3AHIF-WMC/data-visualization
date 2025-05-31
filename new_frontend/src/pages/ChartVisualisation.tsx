import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast.ts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter
} from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs.tsx";
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
    AreaChartIcon, ScatterChartIcon
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { sampleDatasets } from "@/pages/Datasets.tsx";
import SavedVisualization from "@/pages/SavedVisualization.tsx";
import {apiFetch} from "@/utils/api.ts";

const chartColors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-colour1))',
    'hsl(var(--chart-colour2))',
    'hsl(var(--chart-colour3))',
    'hsl(var(--chart-colour4))',
    'hsl(var(--chart-colour5))',
];
const ChartVisualization = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const token=localStorage.getItem("jwt");

    const [allDatasets, setAllDatasets] = useState<typeof sampleDatasets>(sampleDatasets);
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed'>('bar');
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartTitle, setChartTitle] = useState<string>('Neue Visualisierung');
    const [availableFields, setAvailableFields] = useState<string[]>([]);
    const [processedData, setProcessedData] = useState<any>(null);
    const [selectedDatasetId, setSelectedDatasetId] = useState<string>('');

    useEffect(() => {

        const fetchUserDatasets=async () => {
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
                        // **EXTRACT FIELDS**:
                        // Wenn 'fields' nicht existiert, verwende 'columns', sonst aus data-Objekt ableiten
                        let fieldsArray: string[] = [];
                        if (Array.isArray(ds.fields) && ds.fields.length > 0) {
                            fieldsArray = ds.fields;
                        } else if (Array.isArray(ds.columns) && ds.columns.length > 0) {
                            fieldsArray = ds.columns.map((col: any) => col.name); // <-- CHANGE: Felder aus columns ziehen
                        } else if (Array.isArray(ds.data) && ds.data.length > 0) {
                            fieldsArray = Object.keys(ds.data[0]); // <-- CHANGE: Fallback aus data-Keys
                        }

                        return {
                            id: ds.id,
                            name: ds.name,
                            recordCount: ds.recordCount,
                            createdAt: new Date(ds.createdAt),
                            lastModified: new Date(ds.lastModified),
                            fileType: ds.fileType,
                            data: ds.data,
                            fields: fieldsArray, // <-- CHANGE: hier das neu gefüllte fields-Array setzen
                            columns: ds.columns || [] // optional falls später benötigt
                        };
                    });
                    setAllDatasets([...sampleDatasets, ...userDS]);
                }

            }catch (error){
                console.error("Fehler beim Laden der Nutzerdatensätze:", error);
                toast({
                    title: "Fehler",
                    description: "Konnte Nutzerdatensätze nicht laden.",
                    variant: "destructive",
                });
            }
        };
fetchUserDatasets();

    }, [toast,token]);
    // --- 2. Wenn aus vorheriger Seite processedData mitgegeben wurde, nutzen ---
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
            }
        }
    }, [location, navigate, toast]);

    // --- 3. Wenn der Nutzer einen Datensatz aus dem Dropdown auswählt, Daten/Fields setzen ---
    useEffect(() => {
        if (selectedDatasetId) {
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
    }, [selectedDatasetId,allDatasets]);

// 4) Whenever processedData/xAxis/yAxis change, prepare chartData
useEffect(() => {
        if (processedData && xAxis && yAxis) {
            const prepared = processedData.data.map((item: any) => ({
                name: item[xAxis]?.toString() || '',
                x: typeof item[xAxis] === 'number' ? item[xAxis] : undefined,
                y: typeof item[yAxis] === 'number' ? item[yAxis] : 0,
                value: typeof item[yAxis] === 'number' ? item[yAxis] : 0
            }));
            setChartData(prepared);
        }
    }, [processedData, xAxis, yAxis]);

    const saveVisualization = () => {
        const newViz = {
            id: crypto.randomUUID(),
            title: chartTitle,
            type: chartType,
            data: chartData,
            xAxis,
            yAxis,
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
                    <p className="text-muted-foreground">Wählen Sie Achsen für die Visualisierung</p>
                </div>
            );
        }

        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill={chartColors[0]} />
                        </BarChart>
                    </ResponsiveContainer>
                );
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="value" stroke={chartColors[1]} />
                        </LineChart>
                    </ResponsiveContainer>
                );
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
            case 'scatter':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <ScatterChart>
                            <CartesianGrid />
                            <XAxis dataKey="x" name="X" />
                            <YAxis dataKey="y" name="Y" />
                            <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                            <Legend />
                            <Scatter name="Datenpunkte" data={chartData} fill={chartColors[3]} />
                        </ScatterChart>
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
                        <h1 className="text-3xl font-bold ">Visualisierung erstellen</h1>
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
                                    <label className="block text-sm font-medium text-gray-700u mb-2">
                                        Diagrammtyp
                                    </label>
                                    <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
                                        <TabsList className="grid grid-cols-3 grid-rows-2 gap-1 w-full h-full">
                                            <TabsTrigger value="bar" className="flex items-center gap-2">
                                                <ChartBarBig className="h-4 w-4" /> Balken
                                            </TabsTrigger>
                                            <TabsTrigger value="line" className="flex items-center gap-2">
                                                <ChartLine className="h-4 w-4" /> Linie
                                            </TabsTrigger>
                                            <TabsTrigger value="pie" className="flex items-center gap-2">
                                                <ChartPie className="h-4 w-4" /> Kreis
                                            </TabsTrigger>
                                            <TabsTrigger value="area" className="flex items-center gap-2">
                                                <AreaChartIcon className="h-4 w-4" /> Fläche
                                            </TabsTrigger>
                                            <TabsTrigger value="scatter" className="flex items-center gap-2">
                                                <ScatterChartIcon className="h-4 w-4" /> Punkt
                                            </TabsTrigger>
                                            <TabsTrigger value="composed" className="flex items-center gap-2">
                                                <ComposedChart className="h-4 w-4" /> Kombiniert
                                            </TabsTrigger>
                                        </TabsList>
                                    </Tabs>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium  mb-1">
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
                                    <label className="block text-sm font-medium  mb-1">
                                        Titel
                                    </label>
                                    <input
                                        type="text"
                                        value={chartTitle}
                                        onChange={handleInputChange}
                                        className="w-full text-sm rounded-md border p-2 bg-white text-black dark:bg-[#020817] dark:border-[#1E293B] dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium  mb-1">
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
                                    <label className="block text-sm font-medium  mb-1">
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
                            </CardContent>
                            <CardFooter>
                                <Button onClick={saveVisualization} className="w-full" disabled={!chartData.length}>
                                    <Save className="h-4 w-4 mr-2" /> Visualisierung speichern
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>{chartTitle}</CardTitle>
                            </CardHeader>
                            <CardContent className="h-[350px]">
                                {renderChartByType()}
                            </CardContent>
                        </Card>

                        <div className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Datenvorschau</CardTitle>
                                </CardHeader>
                                <CardContent>
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
                                            {processedData?.data?.slice(0, 5).map((row: any, rowIndex: number) => (
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
                                        {processedData?.data?.length > 5 && (
                                            <p className="text-xs text-center text-muted-foreground mt-2">
                                                Zeigt 5 von {processedData.data.length} Datensätzen
                                            </p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChartVisualization;
