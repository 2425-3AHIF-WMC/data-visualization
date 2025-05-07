import * as d3 from "d3";

export class BarChart {
    createBarchart(){
        var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

        var svgWidth = 500, svgHeight = 300, barPadding = 5;
        var barWidth = svgWidth / dataset.length;
        var svg = d3.select('.bar-chart')
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        var barChart = svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("y", function (d: number): number {
                return svgHeight - d
            })
            .attr("height", function (d: number): number {
                return d;
            })
            .attr("width", barWidth - barPadding)
            .attr("class", "bar")
            .attr("transform", function (_d: number, i: number) {
                const translate = [barWidth * i, 0];
                return "translate(" + translate[0] + "," + translate[1] + ")";
                //  return "translate(" + translate + ")";
            });

        var text = svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text((d: number) => d.toString())
            .attr("y", function (d: number, i: number) {
                return svgHeight - d - 2;
            })
            .attr("x", function (d: number, i: number) {
                return barWidth * i;
            })
            .attr("fill", "#A64C38");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const barChart = new BarChart();
    barChart.createBarchart();
})