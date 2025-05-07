"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineChart = void 0;
var d3 = require("d3");
var LineChart = /** @class */ (function () {
    function LineChart() {
    }
    LineChart.prototype.createLineChart = function () {
        var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
        var svgWidth = 500, svgHeight = 300;
        var margin = { top: 20, right: 20, bottom: 30, left: 40 };
        var width = svgWidth - margin.left - margin.right;
        var height = svgHeight - margin.top - margin.bottom;
        var svg = d3.select('.line-chart')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", "translate(".concat(margin.left, ",").concat(margin.top, ")"));
        var xScale = d3.scaleLinear()
            .domain([0, dataset.length - 1])
            .range([0, width]);
        var yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset)])
            .range([height, 0]);
        var line = d3.line()
            .x(function (_d, i) { return xScale(i); })
            .y(function (d) { return yScale(d); });
        // Draw the line
        svg.append("path")
            .datum(dataset)
            .attr("class", "line")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line);
        // Add circles to data points
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function (_d, i) { return xScale(i); })
            .attr("r", 4)
            .attr("fill", "steelblue");
        // Add text labels
        svg.selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .text(function (d) { return d.toString(); })
            .attr("x", function (_d, i) { return xScale(i) + 5; })
            .attr("font-size", "10px")
            .attr("fill", "#A64C38");
    };
    return LineChart;
}());
exports.LineChart = LineChart;
document.addEventListener("DOMContentLoaded", function () {
    var lineChart = new LineChart();
    lineChart.createLineChart();
});
