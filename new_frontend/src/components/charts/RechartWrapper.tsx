import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import {ChartConfig} from "@/components/charts/visualization.ts";

interface RechartsWrapperProps {
    config: ChartConfig;
}

const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981', '#f97316'];

const RechartsWrapper: React.FC<RechartsWrapperProps> = ({ config }) => {
    const { type, data, xAxis, yAxis, width = 400, height = 300 } = config;

    const renderChart = () => {
        switch (type) {
            case 'line':
                return (
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey={xAxis} stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey={yAxis}
                            stroke="#06b6d4"
                            strokeWidth={2}
                            dot={{ fill: '#06b6d4', strokeWidth: 2, r: 4 }}
                            activeDot={{ r: 6, stroke: '#06b6d4', strokeWidth: 2 }}
                        />
                    </LineChart>
                );

            case 'bar':
                return (
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey={xAxis} stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                        <Bar dataKey={yAxis} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey={yAxis}
                            nameKey={xAxis}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Legend />
                    </PieChart>
                );

            case 'scatter':
                return (
                    <ScatterChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey={xAxis} stroke="#9ca3af" />
                        <YAxis dataKey={yAxis} stroke="#9ca3af" />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1f2937',
                                border: '1px solid #374151',
                                borderRadius: '8px',
                                color: '#fff'
                            }}
                        />
                        <Scatter fill="#f59e0b" />
                    </ScatterChart>
                );

            default:
                return <div>Nicht unterstützter Chart-Typ</div>;
        }
    };

    return (
        <ResponsiveContainer width="100%" height={height}>
            {renderChart()}
        </ResponsiveContainer>
    );
};

export default RechartsWrapper;