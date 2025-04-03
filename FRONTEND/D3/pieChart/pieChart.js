"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PieChart = void 0;
var d3 = require("d3");
var PieChart = /** @class */ (function () {
    function PieChart() {
    }
    PieChart.prototype.createPieChart = function () {
        var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
        var svgWidth = 500, svgHeight = 300;
        var radius = Math.min(svgWidth, svgHeight) / 2;
        var svg = d3.select('.bar-chart')
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .append("g")
            .attr("transform", "translate(".concat(svgWidth / 2, ", ").concat(svgHeight / 2, ")"));
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var pie = d3.pie();
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        var arcs = svg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc");
    };
    return PieChart;
}());
exports.PieChart = PieChart;
document.addEventListener("DOMContentLoaded", function () {
    var pieChart = new PieChart();
    pieChart.createPieChart();
});
