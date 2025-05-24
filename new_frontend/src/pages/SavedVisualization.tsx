import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card.tsx';
import { BarChart, LineChart, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Line, Bar } from 'recharts';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Layout } from '../components/Layout';
import { Trash2, Pencil } from 'lucide-react';

export interface SavedVisualization {
    id: string;
    title: string;
    type: 'bar' | 'line' | 'pie';
    data: any[];
    xAxis: string;
    yAxis: string;
}

const renderChartPreview = (type: 'bar' | 'line' | 'pie', data: any[]) => {
    const sample = data.slice(0, 5);
    switch (type) {
        case 'bar':
            return (
                <BarChart width={250} height={150} data={sample}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            );
        case 'line':
            return (
                <LineChart width={250} height={150} data={sample}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
            );
        case 'pie':
            return (
                <PieChart width={250} height={150}>
                    <Tooltip />
                    <Pie data={sample} dataKey="value" nameKey="name" outerRadius={60} fill="#ffc658">
                        {sample.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#8884d8', '#82ca9d', '#ffc658'][index % 3]} />
                        ))}
                    </Pie>
                </PieChart>
            );
        default:
            return null;
    }
};

export const SavedVisualizations = () => {
    const [visualizations, setVisualizations] = useState<SavedVisualization[]>([]);
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

    const editVisualization = (viz: SavedVisualization) => {
        navigate('/visualization/new', {
            state: {
                processedData: {
                    fields: [viz.xAxis, viz.yAxis],
                    data: viz.data.map(d => ({ [viz.xAxis]: d.name, [viz.yAxis]: d.value }))
                },
                initialSettings: {
                    chartTitle: viz.title,
                    chartType: viz.type,
                    xAxis: viz.xAxis,
                    yAxis: viz.yAxis
                }
            }
        });
    };

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
                            <CardContent>{renderChartPreview(viz.type, viz.data)}</CardContent>
                            <CardFooter className="flex justify-between">
                                <CardFooter className="justify-end">
                                    <button
                                        onClick={() => deleteVisualization(viz.id)}
                                        className="flex items-center text-sm font-medium"
                                    >
                                        <Trash2 className="w-4 h-4 mr-1" strokeWidth={1.5} />
                                        Löschen
                                    </button>
                                </CardFooter>

                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default SavedVisualizations;
