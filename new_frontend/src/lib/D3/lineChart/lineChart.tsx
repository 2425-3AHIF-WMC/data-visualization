import { useEffect } from 'react';
import * as React from 'react';
import * as d3 from 'd3';

const LineChart: React.FC = () => {
    useEffect(() => {
        const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

        const svgWidth = 500, svgHeight = 300;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const width = svgWidth - margin.left - margin.right;
        const height = svgHeight - margin.top - margin.bottom;

        const svg = d3.select('.line-chart')
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleLinear()
            .domain([0, dataset.length - 1])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset)!])
            .range([height, 0]);

        const line = d3.line<number>()
            .x((_d, i) => xScale(i))
            .y(d => yScale(d));

        // Draw the line
        svg.append('path')
            .datum(dataset)
            .attr('class', 'line')
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Add circles to data points
        svg.selectAll('circle')
            .data(dataset)
            .enter()
            .append('circle')
            .attr('cx', (_d: number, i) => xScale(i))
            .attr('r', 4)
            .attr('fill', 'steelblue');

        // Add text labels
        svg.selectAll('text')
            .data(dataset)
            .enter()
            .append('text')
            .text(d => d.toString())
            .attr('x', (_d, i) => xScale(i) + 5)
            .attr('font-size', '10px')
            .attr('fill', '#A64C38');
    }, []);

    return <svg className="line-chart" />;
};

export default LineChart;
