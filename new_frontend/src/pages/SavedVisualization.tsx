import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card.tsx';
import {
    BarChart,
    LineChart,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Line,
    Bar,
    AreaChart,
    ScatterChart, Scatter, ComposedChart, Area
} from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Layout } from '../components/Layout';
import { Trash2, Pencil, Expand, Download } from 'lucide-react';
import { toJpeg } from 'html-to-image';
import { createPortal } from 'react-dom';

export interface SavedVisualization {
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed';
    data: any[];
    xAxis: string;
    yAxis: string;
}

const chartColors = [
    'hsl(var(--primary))',
    'hsl(var(--chart-colour1))',
    'hsl(var(--chart-colour2))',
    'hsl(var(--chart-colour3))',
    'hsl(var(--chart-colour4))',
    'hsl(var(--chart-colour5))',
];

const renderChartPreview = (
    type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'composed',
    data: any[],
    preview = true
) => {
    const displayData = preview ? data.slice(0, 5) : data;

    switch (type) {
        case 'bar':
            return (
                <BarChart width={preview ? 250 : 800} height={preview ? 150 : 500} data={displayData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill={chartColors[0]} />
                </BarChart>
            );
        case 'line':
            return (
                <LineChart width={preview ? 250 : 800} height={preview ? 150 : 500} data={displayData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke={chartColors[1]} />
                </LineChart>
            );
        case 'pie':
            return (
                <PieChart width={preview ? 250 : 800} height={preview ? 150 : 500}>
                    <Tooltip />
                    <Pie
                        data={displayData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={preview ? 60 : 100}
                        fill={chartColors[0]}
                    >
                        {displayData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                    </Pie>
                </PieChart>
            );
        case 'area':
            return (
                <AreaChart width={preview ? 250 : 800} height={preview ? 150 : 500} data={displayData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={chartColors[2]}
                        fill={preview ? `${chartColors[2]}80` : chartColors[2]} // Beispiel mit Transparenz bei Preview
                    />
                </AreaChart>
            );
        case 'scatter':
            return (
                <ScatterChart width={preview ? 250 : 800} height={preview ? 150 : 500}>
                    <XAxis dataKey="name" />
                    <YAxis dataKey="value" />
                    <Tooltip />
                    <Scatter name="A" data={displayData} fill={chartColors[3]} />
                </ScatterChart>
            );
        case 'composed':
            return (
                <ComposedChart width={preview ? 250 : 800} height={preview ? 150 : 500} data={displayData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" barSize={20} fill={chartColors[5]} />
                    <Line type="monotone" dataKey="value" stroke={chartColors[1]} />
                    <Area type="monotone" dataKey="value" fill={chartColors[4]} stroke={chartColors[4]} />
                </ComposedChart>
            );
        default:
            return null;
    }
};


export const SavedVisualizations = () => {
    const [visualizations, setVisualizations] = useState<SavedVisualization[]>([]);
    const [fullscreenChart, setFullscreenChart] = useState<React.ReactNode | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadVisualizations();
    }, []);

    const loadVisualizations = () => {
        const stored = localStorage.getItem('savedVisualizations');
        if (stored) {
            setVisualizations(JSON.parse(stored));
        }
    };

    const deleteVisualization = (id: string) => {
        const updated = visualizations.filter(v => v.id !== id);
        localStorage.setItem('savedVisualizations', JSON.stringify(updated));
        setVisualizations(updated);
    };


    const downloadChartAsImage = async (id: string) => {
        const node = document.getElementById(`chart-${id}`);
        if (!node) return;
        const dataUrl = await toJpeg(node, { quality: 0.95 });
        const link = document.createElement('a');
        link.download = `${id}.jpeg`;
        link.href = dataUrl;
        link.click();
    };

    const openFullscreen = (chart: React.ReactNode) => {
        setFullscreenChart(chart);
    };



    const closeFullscreen = () => setFullscreenChart(null);

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-800">Gespeicherte Visualisierungen</h1>
                    <Button asChild>
                        <Link to="/diagrams">+ Neue Visualisierung</Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {visualizations.length === 0 && (
                        <p className="text-gray-600">Noch keine gespeicherten Visualisierungen.</p>
                    )}

                    {visualizations.map((viz) => (
                        <Card key={viz.id}>
                            <CardHeader>
                                <CardTitle>{viz.title}</CardTitle>
                                <CardDescription>Typ: {viz.type.toUpperCase()}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div id={`chart-${viz.id}`} className="bg-white p-2 rounded">
                                    {renderChartPreview(viz.type, viz.data)}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => downloadChartAsImage(viz.id)}
                                        className="flex items-center text-sm font-medium"
                                    >
                                        <Download className="w-4 h-4 mr-1" strokeWidth={1.5} />
                                        Download
                                    </button>
                                    <button
                                        onClick={() => openFullscreen(renderChartPreview(viz.type, viz.data, false))}
                                        className="flex items-center text-sm font-medium"
                                    >
                                        <Expand className="w-4 h-4 mr-1" strokeWidth={1.5} />
                                        Vollbild
                                    </button>

                                    <button
                                        onClick={() => deleteVisualization(viz.id)}
                                        className="flex items-center text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" strokeWidth={1.5} />
                                        Löschen
                                    </button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {fullscreenChart && createPortal(
                <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
                    <div className="bg-white rounded p-4 max-w-5xl max-h-[90vh] overflow-auto">
                        {fullscreenChart}
                        <div className="text-right mt-4">
                            <Button onClick={closeFullscreen}>Schließen</Button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </Layout>
    );
};

export default SavedVisualizations;
