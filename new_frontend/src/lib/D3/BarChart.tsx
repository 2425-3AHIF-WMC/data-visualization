import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const data = [
    { name: "Jan", uv: 4000 },
    { name: "Feb", uv: 3000 },
    { name: "März", uv: 5000 },
    { name: "April", uv: 4000 },
];

const BarChart = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 320;
        const height = 200;
        const margin = { top: 20, right: 20, bottom: 30, left: 30 };
        const chartWidth = width - margin.left - margin.right;
        const chartHeight = height - margin.top - margin.bottom;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        // Create scales
        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.name))
            .range([0, chartWidth])
            .padding(0.2);
        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.uv)!])
            .nice()
            .range([chartHeight, 0]);

        // Chart group
        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // X axis
        g.append("g")
            .attr("transform", `translate(0,${chartHeight})`)
            .call(d3.axisBottom(x));

        // Y axis
        g.append("g").call(d3.axisLeft(y));

        // Bars
        g.selectAll("rect")
            .data(data)
            .join("rect")
            .attr("x", (d) => x(d.name)!)
            .attr("y", (d) => y(d.uv))
            .attr("width", x.bandwidth())
            .attr("height", (d) => chartHeight - y(d.uv))
            .attr("fill", "#14b8a6")
            .attr("rx", 6)
            .attr("ry", 6);
    }, []);

    return (
        <div className="w-full h-[200px]">
            <svg ref={ref} width="100%" height="200" viewBox="0 0 320 200" />
        </div>
    );
};

export default BarChart;