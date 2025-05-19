import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const data = [
    { name: "Jan", uv: 120000 },
    { name: "Feb", uv: 115000 },
    { name: "März", uv: 90000 },
    { name: "April", uv: 110000 },
    { name: "Mai", uv: 95000 },
    { name: "Juni", uv: 60000 },
];

const LineChart = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 320;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 30, left: 40 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Scales
        const x = d3
            .scalePoint()
            .domain(data.map((d) => d.name))
            .range([0, chartWidth]);
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.uv)!])
            .nice()
            .range([chartHeight, 0]);

        // Chart group
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X Axis
        g.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x));

        // Y Axis
        g.append("g").call(d3.axisLeft(y).ticks(5));

        // Line
        const line = d3
            .line<{ name: string; uv: number }>()
            .x((d) => x(d.name)!)
            .y((d) => y(d.uv))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#f87171")
            .attr("stroke-width", 3)
            .attr("d", line as any);

        // Dots
        g.selectAll("dot")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => x(d.name)!)
            .attr("cy", (d) => y(d.uv))
            .attr("r", 5)
            .attr("fill", "#f87171");
    }, []);

    return (
        <div className="w-full h-[200px]">
            <svg ref={ref} width="100%" height="200" viewBox="0 0 320 200" />
        </div>
    );
};

export default LineChart;