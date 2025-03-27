import * as d3 from 'd3';

class PieChart {
    private svg: d3.Selection<SVGGElement, unknown, null, undefined>;
    private width: number;
    private height: number;
    private radius: number;
    private color: d3.ScaleOrdinal<string, string>;

    constructor(selector: string, private data: { label: string; value: number }[]) {
        this.width = 400;
        this.height = 400;
        this.radius = Math.min(this.width, this.height) / 2;

        this.color = d3.scaleOrdinal(d3.schemeCategory10);

        const svgContainer = d3
            .select(selector)
            .append('svg')
            .attr('width', this.width)
            .attr('height', this.height);

        this.svg = svgContainer
            .append('g')
            .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`);

        this.drawChart();
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
    new PieChart('#chart', [
        { label: 'A', value: 30 },
        { label: 'B', value: 70 },
        { label: 'C', value: 50 }
    ]);
});
