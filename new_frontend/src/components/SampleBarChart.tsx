import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

// Deine Funktion, um Daten zu laden (z.B. API oder lokale Daten)
const fetchData = async () => {
    // Simuliere das Laden von Daten. In einer echten Anwendung könntest du hier eine API anrufen.
    return [
        { name: "Nord", value: 4000 },
        { name: "Süd", value: 3000 },
        { name: "Ost", value: 2000 },
        { name: "West", value: 2780 },
        { name: "Zentral", value: 1890 },
    ];
};

const DynamicBarChart = () => {
    const [data, setData] = useState<any[]>([]);

    // Lade die Daten im useEffect-Hook
    useEffect(() => {
        const loadData = async () => {
            const loadedData = await fetchData();
            setData(loadedData); // Setze die geladenen Daten in den State
        };

        loadData();
    }, []); // Der leere Array sorgt dafür, dass die Daten nur einmal beim Laden der Komponente geladen werden

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                data={data}
                margin={{
                    top: 10,
                    right: 20,
                    left: 20,
                    bottom: 10,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar
                    dataKey="value"
                    fill="#4f46e5"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default DynamicBarChart;
