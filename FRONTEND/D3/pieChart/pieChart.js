import * as d3 from "d3";

export class PieChart {
    createPieChart() {
        const dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
        const svgWidth = 500, svgHeight = 300;
        const radius = Math.min(svgWidth, svgHeight) / 2;

        const svg = d3.select('.bar-chart')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", `translate(${svgWidth / 2}, ${svgHeight / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);
        const pie = d3.pie<number>;
        const arc = d3.arc<d3.PieArcDatum<number>>()
            .innerRadius(0)
            .outerRadius(radius);

        const arcs = svg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const pieChart = new PieChart();
    pieChart.createPieChart();
});
