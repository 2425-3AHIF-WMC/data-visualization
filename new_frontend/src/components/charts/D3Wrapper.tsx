import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { ChartConfig } from '@/types/visualization';

interface D3WrapperProps {
    config: ChartConfig;
}

const D3Wrapper: React.FC<D3WrapperProps> = ({ config }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const { type, data, xAxis, yAxis, width = 400, height = 300 } = config;

    useEffect(() => {
        if (!svgRef.current || !data.length) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const margin = { top: 20, right: 30, bottom: 40, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        switch (type) {
            case 'bar':
                renderBarChart(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
                break;
            case 'line':
                renderLineChart(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
                break;
            case 'scatter':
                renderScatterPlot(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
                break;
            default:
                break;
        }
    }, [data, type, xAxis, yAxis, width, height]);

    const renderBarChart = (g: any, data: any[], xKey: string, yKey: string, width: number, height: number) => {
        const xScale = d3.scaleBand()
            .domain(data.map(d => d[xKey]))
            .range([0, width])
            .padding(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yKey]) as number])
            .range([height, 0]);

        // Bars
        g.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', (d: any) => xScale(d[xKey]))
            .attr('width', xScale.bandwidth())
            .attr('y', (d: any) => yScale(d[yKey]))
            .attr('height', (d: any) => height - yScale(d[yKey]))
            .attr('fill', '#8b5cf6')
            .attr('rx', 4)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('fill', '#a78bfa');

                // Tooltip
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background', '#1f2937')
                    .style('color', 'white')
                    .style('padding', '8px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);

                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`${xKey}: ${d[xKey]}<br/>${yKey}: ${d[yKey]}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('fill', '#8b5cf6');
                d3.selectAll('.tooltip').remove();
            });

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('fill', '#9ca3af');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', '#9ca3af');
    };

    const renderLineChart = (g: any, data: any[], xKey: string, yKey: string, width: number, height: number) => {
        const xScale = d3.scalePoint()
            .domain(data.map(d => d[xKey]))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[yKey]) as [number, number])
            .range([height, 0]);

        const line = d3.line<any>()
            .x(d => xScale(d[xKey])!)
            .y(d => yScale(d[yKey]))
            .curve(d3.curveMonotoneX);

        // Line
        g.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#06b6d4')
            .attr('stroke-width', 2)
            .attr('d', line);

        // Points
        g.selectAll('.point')
            .data(data)
            .enter().append('circle')
            .attr('class', 'point')
            .attr('cx', (d: any) => xScale(d[xKey])!)
            .attr('cy', (d: any) => yScale(d[yKey]))
            .attr('r', 4)
            .attr('fill', '#06b6d4')
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 6);

                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background', '#1f2937')
                    .style('color', 'white')
                    .style('padding', '8px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);

                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`${xKey}: ${d[xKey]}<br/>${yKey}: ${d[yKey]}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 4);
                d3.selectAll('.tooltip').remove();
            });

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('fill', '#9ca3af');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', '#9ca3af');
    };

    const renderScatterPlot = (g: any, data: any[], xKey: string, yKey: string, width: number, height: number) => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[xKey]) as [number, number])
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d[yKey]) as [number, number])
            .range([height, 0]);

        // Points
        g.selectAll('.point')
            .data(data)
            .enter().append('circle')
            .attr('class', 'point')
            .attr('cx', (d: any) => xScale(d[xKey]))
            .attr('cy', (d: any) => yScale(d[yKey]))
            .attr('r', 5)
            .attr('fill', '#f59e0b')
            .attr('opacity', 0.7)
            .on('mouseover', function(event, d) {
                d3.select(this).attr('r', 7).attr('opacity', 1);

                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('position', 'absolute')
                    .style('background', '#1f2937')
                    .style('color', 'white')
                    .style('padding', '8px')
                    .style('border-radius', '4px')
                    .style('font-size', '12px')
                    .style('pointer-events', 'none')
                    .style('opacity', 0);

                tooltip.transition().duration(200).style('opacity', 1);
                tooltip.html(`${xKey}: ${d[xKey]}<br/>${yKey}: ${d[yKey]}`)
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY - 10) + 'px');
            })
            .on('mouseout', function() {
                d3.select(this).attr('r', 5).attr('opacity', 0.7);
                d3.selectAll('.tooltip').remove();
            });

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .style('fill', '#9ca3af');

        g.append('g')
            .call(d3.axisLeft(yScale))
            .selectAll('text')
            .style('fill', '#9ca3af');
    };

    return (
        <svg
            ref={svgRef}
            width={width}
            height={height}
            className="bg-transparent"
        />
    );
};

export default D3Wrapper;
