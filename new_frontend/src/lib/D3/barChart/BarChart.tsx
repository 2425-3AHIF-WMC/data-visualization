import  { useEffect } from 'react';
import * as React from 'react';
import * as d3 from 'd3';

const BarChart: React.FC = () => {
    useEffect(() => {
        const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

        const svgWidth = 500;
        const svgHeight = 300;
        const barPadding = 5;
        const barWidth = svgWidth / dataset.length;

        const svg = d3.select('.bar-chart')
            .attr('width', svgWidth)
            .attr('height', svgHeight);

        svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('rect')
            .attr('y', (d: number) => svgHeight - d)
            .attr('height', (d: number) => d)
            .attr('width', barWidth - barPadding)
            .attr('class', 'bar')
            .attr('transform', (_d: number, i: number) => {
                const translate = [barWidth * i, 0];
                return `translate(${translate[0]}, ${translate[1]})`;
            });

        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text((d: number) => d.toString())
            .attr('y', (d: number) => svgHeight - d - 2)
            .attr('x', (d: number, i: number) => barWidth * i)
            .attr('fill', '#A64C38');
    }, []);

    return <svg className="bar-chart" />;
};

export default BarChart;
