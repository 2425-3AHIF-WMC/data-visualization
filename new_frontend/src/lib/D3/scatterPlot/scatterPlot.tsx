import React from 'react';
import {
    ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const data = [
    { x: 10, y: 30 },
    { x: 20, y: 50 },
    { x: 30, y: 40 },
    { x: 40, y: 80 },
    { x: 50, y: 60 },
];

const ScatterPlotChart = () => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <ScatterChart
                margin={{ top: 20, right: 20, bottom: 10, left: 10 }}
            >
                <CartesianGrid />
                <XAxis type="number" dataKey="x" name="X Axis" />
                <YAxis type="number" dataKey="y" name="Y Axis" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter name="Sample Data" data={data} fill="#8884d8" />
            </ScatterChart>
        </ResponsiveContainer>
    );
};

export default ScatterPlotChart;


