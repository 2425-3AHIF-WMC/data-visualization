"use strict";
//import * as d3 from "d3";
document.addEventListener("DOMContentLoaded", function () {
    var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
    var svgWidth = 500, svgHeight = 300, barPadding = 5;
    var barWidth = svgWidth / dataset.length;
    var svg = d3.select('.bar-chart') // Ändere 'svg' zu '.bar-chart'
        .attr("width", svgWidth)
        .attr("height", svgHeight);
    var barChart = svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("y", function (d) {
        return svgHeight - d;
    })
        .attr("height", function (d) {
        return d;
    })
        .attr("width", barWidth - barPadding)
        .attr("class", "bar")
        .attr("transform", function (_d, i) {
        const translate = [barWidth * i, 0];
        return "translate(" + translate[0] + "," + translate[1] + ")";
        //  return "translate(" + translate + ")";
    });
    var text = svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text((d) => d.toString())
        .attr("y", function (d, i) {
        return svgHeight - d - 2;
    })
        .attr("x", function (d, i) {
        return barWidth * i;
    })
        .attr("fill", "#A64C38");
});
