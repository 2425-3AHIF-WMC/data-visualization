import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const data = [
    { name: "A", value: 400, color: "#2563eb" },
    { name: "B", value: 300, color: "#fbbf24" },
    { name: "C", value: 300, color: "#f97316" },
    { name: "D", value: 200, color: "#06b6d4" },
];

const PieChart = () => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        const width = 320;
        const height = 200;
        const radius = Math.min(width, height) / 2 - 20;

        const svg = d3.select(ref.current);
        svg.selectAll("*").remove();

        const g = svg
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

        const pie = d3.pie<{ name: string; value: number; color: string }>().value((d) => d.value);
        const arc = d3.arc<d3.PieArcDatum<{ name: string; value: number; color: string }>>()
            .outerRadius(radius)
            .innerRadius(0);

        const arcs = g.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs
            .append("path")
            .attr("d", arc as any)
            .attr("fill", (d) => d.data.color);

        /*
        arcs
          .append("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .text((d) => d.data.name);
        */
    }, []);

    return (
        <div className="w-full h-[200px]">
            <svg ref={ref} width="100%" height="200" viewBox="0 0 320 200" />
        </div>
    );
};

export default PieChart;