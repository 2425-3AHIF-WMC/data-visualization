"use strict";
<<<<<<< Updated upstream
//import * as d3 from "d3";
document.addEventListener("DOMContentLoaded", function () {
    var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
    var svgWidth = 500, svgHeight = 500;
    var radius = Math.min(svgWidth, svgHeight) / 2; // Der Radius des Kreises

    var color = d3.scaleOrdinal(d3.schemeCategory10); // Farbskala für die Segmente

    // Erstellen eines SVG-Elements
    var svg = d3.select('.pie-chart') // Ändere 'svg' zu '.pie-chart'
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", "translate(" + svgWidth / 2 + "," + svgHeight / 2 + ")"); // Zentrieren des Diagramms

    // Erstellen des D3-Pie-Layouts
    var pie = d3.pie();

    // Definieren eines Arc-Generators
    var arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0); // Keine innere Kreisfläche (für einfaches Pie-Chart)

    // Erstellen der Segmente
    var arcData = svg.selectAll(".arc")
        .data(pie(dataset))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Hinzufügen der Segmente (Slices) in das Diagramm
    arcData.append("path")
        .attr("d", arc)
        .attr("fill", function (d, i) {
            return color(i); // Färbt das Segment basierend auf dem Index
        });

    // Hinzufügen von Text-Labels auf jedem Segment
    arcData.append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")"; // Platzierung des Texts auf dem Segment
        })
        .attr("dy", ".35em") // Vertikale Ausrichtung des Texts
        .attr("text-anchor", "middle") // Zentriert den Text
        .text(function (d) { return d.data; }); // Zeigt den Wert des Segments an
=======
Object.defineProperty(exports, "__esModule", { value: true });
var d3 = require("d3");
var PieChart = /** @class */ (function () {
    function PieChart() {
    }
    PieChart.prototype.createPieChart = function () {
        var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];
        var svgWidth = 500, svgHeight = 300;
        var radius = Math.min(svgWidth, svgHeight) / 2;
        // Wähle das EXISTIERENDE SVG aus (korrekter Klassenname!)
        var svg = d3.select('.bar-chart') // Achtung: Kein Tippfehler? ".bar-chart" oder ".bar-chart"?
            .attr("width", svgWidth) // Überschreibt die SVG-Größe falls nötig
            .attr("height", svgHeight)
            .append("g") // Füge eine Gruppe für die Transformation hinzu
            .attr("transform", "translate(".concat(svgWidth / 2, ", ").concat(svgHeight / 2, ")"));
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        var pie = d3.pie();
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);
        // Zeichne die Pfade (Arcs)
        svg.selectAll(".arc")
            .data(pie(dataset))
            .enter()
            .append("g")
            .attr("class", "arc")
            .append("path")
            .attr("d", arc)
            .attr("fill", function (d, i) { return color(i.toString()); }); // Farbe hinzufügen
    };
    return PieChart;
}());
// Initialisierung
document.addEventListener("DOMContentLoaded", function () {
    new PieChart().createPieChart();
<<<<<<< Updated upstream
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
});
