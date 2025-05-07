import { useEffect } from 'react';
import * as d3 from 'd3';

interface PieChartProps {
    data: number[]; // Array von Zahlen, das das Datenset für das Diagramm enthält
    width: number;  // Breite des Diagramms
    height: number; // Höhe des Diagramms
}

const PieChart: React.FC<PieChartProps> = ({ data, width, height }) => {
    useEffect(() => {
        const radius = Math.min(width, height) / 2; // Berechnet den Radius des Kreises

        const color = d3.scaleOrdinal(d3.schemeCategory10); // Farbschema

        // Erstellen des SVG-Elements für das PieChart
        const svg = d3.select('.pie-chart')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', `translate(${width / 2}, ${height / 2})`); // Zentriert das PieChart

        const pie = d3.pie<number>().value(d => d); // Erstellt das Pie-Diagramm basierend auf den Daten

        const arc = d3.arc<d3.PieArcDatum<number>>()
            .innerRadius(0)   // Kein innerer Radius für ein vollständiges Pie-Diagramm
            .outerRadius(radius); // Der äußere Radius wird mit dem kleineren Wert zwischen Höhe und Breite gesetzt

        const arcs = svg.selectAll('arc')
            .data(pie(data)) // Bindet die Daten an das Diagramm
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs.append('path')
            .attr('d', arc) // Definiert den Pfad (Form des Kreises)
            .attr('fill', (d, i) => color(i)); // Setzt die Füllfarbe für jedes Segment

        // Fügt Textlabels in die Segmente ein
        arcs.append('text')
            .attr('transform', (d) => `translate(${arc.centroid(d)})`) // Positioniert den Text im Segment
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', '#fff')
            .text((d) => d.data.toString()); // Zeigt die Daten im Segment an
    }, [data, width, height]); // Diese Hook wird ausgeführt, wenn sich die Daten oder die Größe ändern

    return <svg className="pie-chart" />;
};

export default PieChart;
