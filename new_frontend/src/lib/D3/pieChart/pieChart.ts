import * as d3 from "d3";

export class PieChart {
    createPieChart() {
        const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

        const width = 500;
        const height = 300;
        const radius = Math.min(width, height) / 2;

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const svg = d3.select(".pie-chart")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        const pie = d3.pie<number>().value(d => d);

        const arc = d3.arc<d3.PieArcDatum<number>>()
            .innerRadius(0)
            .outerRadius(radius);

        const arcs = svg.selectAll("arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)

        var text = svg.selectAll("text")
            .attr("text-anchor", "middle")
            .attr("font-size", "12px")
            .attr("fill", "#fff")

    }
}

document.addEventListener("DOMContentLoaded", function () {
    const pieChart = new PieChart();
    pieChart.createPieChart();
});
