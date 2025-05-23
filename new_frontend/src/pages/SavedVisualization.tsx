import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card.tsx';
import {Bar, BarChart, Line, LineChart, Pie, PieChart, XAxis, YAxis} from 'recharts';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.tsx';
import { Layout } from '../components/Layout';

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
                    <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
            );
        case 'line':
            return (
                <LineChart width={250} height={150} data={sample}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Line type="monotone" dataKey="value" stroke="#82ca9d" />
                </LineChart>
            );
        case 'pie':
            return (
                <PieChart width={250} height={150}>
                    <Pie data={sample} dataKey="value" nameKey="name" outerRadius={60} fill="#ffc658" />
                </PieChart>
            );
        default:
            return null;
    }
};

export const SavedVisualizations = () => {
    const [visualizations, setVisualizations] = useState<SavedVisualization[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem('savedVisualizations');
        if (stored) {
            setVisualizations(JSON.parse(stored));
        }
    }, []);

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
                        </Card>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default SavedVisualizations;
