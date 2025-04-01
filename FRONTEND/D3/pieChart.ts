import * as d3 from 'd3';

class PieChart {
    createPieChart(){
        var dataset = [80, 100, 56, 120, 180, 30, 40, 120, 160];

        var svgWidth = 500, svgHeight = 300, barPadding = 5;
        var barWidth = svgWidth / dataset.length;
        var svg = d3.select('.bar-chart')
            .attr("width", svgWidth)
            .attr("height", svgHeight);


    }

    private drawChart(): void {
        const pie = d3.pie<{ label: string; value: number }>().value(d => d.value);
        const arc = d3
            .arc<d3.PieArcDatum<{ label: string; value: number }>>()
            .innerRadius(0)
            .outerRadius(this.radius);

        const arcs = this.svg
            .selectAll('.arc')
            .data(pie(this.data))
            .enter()
            .append('g')
            .attr('class', 'arc');

        arcs
            .append('path')
            .attr('d', arc as any)
            .attr('fill', d => this.color(d.data.label));

        arcs
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(d => d.data.label);
    }

}

// Beispiel zur Verwendung:
document.addEventListener('DOMContentLoaded', () => {

});
