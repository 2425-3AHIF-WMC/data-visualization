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
    Area, BarChart, LineChart, PieChart
} from 'recharts';
import { ChartBarBig, ChartLine, ChartPie, Save, ArrowLeft } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

const ChartVisualization = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
    const [xAxis, setXAxis] = useState<string>('');
    const [yAxis, setYAxis] = useState<string>('');
    const [chartData, setChartData] = useState<any[]>([]);
    const [chartTitle, setChartTitle] = useState<string>('Neue Visualisierung');
    const [availableFields, setAvailableFields] = useState<string[]>([]);
    const [processedData, setProcessedData] = useState<any>(null);


    interface PieChartProps {
        data: number[];
        width: number;
        height: number;
    }
    useEffect(() => {
        // Check if data was passed via location state
        if (location.state && location.state.processedData) {
            const data = location.state.processedData;
            setProcessedData(data);

            if (data.fields && data.fields.length > 0) {
                setAvailableFields(data.fields);
                setXAxis(data.fields[0]);
                // Try to find a numeric field for Y-axis
                const numericField = data.fields.find((field: string) =>
                    data.data.length > 0 && typeof data.data[0][field] === 'number'
                );
                setYAxis(numericField || data.fields[1] || data.fields[0]);
            }
        } else {
            toast({
                title: "Keine Daten gefunden",
                description: "Bitte laden Sie zuerst Daten hoch",
                variant: "destructive"
            });
            navigate('/upload');
        }
    }, [location, navigate, toast]);

    useEffect(() => {
        // Generate chart data whenever x-axis or y-axis selection changes
        if (processedData && xAxis && yAxis) {
            const prepared = processedData.data.map((item: any) => ({
                name: item[xAxis]?.toString() || '',
                value: typeof item[yAxis] === 'number' ? item[yAxis] : 0
            }));
            setChartData(prepared);
        }
    }, [processedData, xAxis, yAxis]);

    const saveVisualization = () => {
        // In a real application, you would save to a database or local storage
        toast({
            title: "Visualisierung gespeichert",
            description: `${chartTitle} wurde erfolgreich gespeichert.`
        });

        // Navigate to visualizations page
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
                return <BarChart data={chartData} width={600} height={300} />;
            case 'line':
                return <LineChart data={chartData} width={600} height={300} />;
            case 'pie':
                return <PieChart data={chartData} width={600} height={300} />;
            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Visualisierung erstellen</h1>
                    <p className="text-gray-600">Wählen Sie einen Datensatz für Ihre Datenvisualisierung</p>
                </div>
                <Button variant="outline" asChild>
                    <Link to="/upload" className="flex items-center gap-2">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Diagrammtyp
                                </label>
                                <Tabs value={chartType} onValueChange={(value) => setChartType(value as any)} className="w-full">
                                    <TabsList className="grid grid-cols-3 w-full">
                                        <TabsTrigger value="bar" className="flex items-center gap-2">
                                            <ChartBarBig className="h-4 w-4" /> Balken
                                        </TabsTrigger>
                                        <TabsTrigger value="line" className="flex items-center gap-2">
                                            <ChartLine className="h-4 w-4" /> Linie
                                        </TabsTrigger>
                                        <TabsTrigger value="pie" className="flex items-center gap-2">
                                            <ChartPie className="h-4 w-4" /> Kreis
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Titel
                                </label>
                                <input
                                    type="text"
                                    value={chartTitle}
                                    onChange={handleInputChange}
                                    className="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">
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
    );
};

export default ChartVisualization;