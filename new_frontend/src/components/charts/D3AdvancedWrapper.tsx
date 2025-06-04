
import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { ChartConfig } from './visualization';

interface D3AdvancedWrapperProps {
  config: ChartConfig;
  onDataUpdate?: (data: any[]) => void;
  onInteraction?: (type: string, data: any) => void;
}

const D3AdvancedWrapper: React.FC<D3AdvancedWrapperProps> = ({ 
  config, 
  onDataUpdate, 
  onInteraction 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isZooming, setIsZooming] = useState(false);
  
  const { type, data, xAxis, yAxis, width = 400, height = 300 } = config;

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add zoom behavior if enabled
    if (config.interactions?.some(i => i.type === 'zoom' && i.enabled)) {
      const zoom = d3.zoom()
        .scaleExtent([0.5, 10])
        .on('zoom', (event) => {
          setIsZooming(true);
          g.attr('transform', `translate(${margin.left + event.transform.x},${margin.top + event.transform.y}) scale(${event.transform.k})`);
          setTimeout(() => setIsZooming(false), 100);
        });

      svg.call(zoom as any);
    }

    switch (type) {
      case 'heatmap':
        renderHeatmap(g, data, innerWidth, innerHeight);
        break;
      case 'treemap':
        renderTreemap(g, data, innerWidth, innerHeight);
        break;
      case 'network':
        renderNetwork(g, data, innerWidth, innerHeight);
        break;
      case 'sankey':
        renderSankey(g, data, innerWidth, innerHeight);
        break;
      case 'histogram':
        renderHistogram(g, data, xAxis!, innerWidth, innerHeight);
        break;
      case 'boxplot':
        renderBoxplot(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
        break;
      case 'bubble':
        renderBubbleChart(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
        break;
      case 'waterfall':
        renderWaterfall(g, data, xAxis!, yAxis!, innerWidth, innerHeight);
        break;
      default:
        renderFallback(g, innerWidth, innerHeight);
        break;
    }
  }, [data, type, xAxis, yAxis, width, height, config.interactions]);

  const renderHeatmap = (g: any, data: any[], width: number, height: number) => {
    const values = data.map(d => d[yAxis!]);
    const colorScale = d3.scaleSequential(d3.interpolateBlues)
      .domain(d3.extent(values) as [number, number]);

    const uniqueX = [...new Set(data.map(d => d[xAxis!]))];
    const uniqueY = [...new Set(data.map(d => d[yAxis!]))];

    const xScale = d3.scaleBand().domain(uniqueX).range([0, width]).padding(0.1);
    const yScale = d3.scaleBand().domain(uniqueY).range([0, height]).padding(0.1);

    g.selectAll('.heatmap-rect')
      .data(data)
      .enter().append('rect')
      .attr('class', 'heatmap-rect')
      .attr('x', (d: any) => xScale(d[xAxis!]))
      .attr('y', (d: any) => yScale(d[yAxis!]))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', (d: any) => colorScale(d.value || 0))
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        showTooltip(event, d, xAxis!, yAxis!);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        hideTooltip();
      });

    // Add axes
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append('g').call(d3.axisLeft(yScale));
  };

  const renderTreemap = (g: any, data: any[], width: number, height: number) => {
    const hierarchy = d3.hierarchy<any>({ children: data }).sum((d: any) => d.value || 1)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    const treemap = d3.treemap()
      .size([width, height])
      .padding(2);

    const root = treemap(hierarchy);

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    g.selectAll('.treemap-rect')
      .data(root.leaves())
      .enter().append('rect')
      .attr('class', 'treemap-rect')
      .attr('x', (d: any) => d.x0)
      .attr('y', (d: any) => d.y0)
      .attr('width', (d: any) => d.x1 - d.x0)
      .attr('height', (d: any) => d.y1 - d.y0)
      .attr('fill', (d: any, i: number) => colorScale(i.toString()))
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 0.8);
        showTooltip(event, d.data, 'name', 'value');
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 1);
        hideTooltip();
      });

    // Add labels
    g.selectAll('.treemap-text')
      .data(root.leaves())
      .enter().append('text')
      .attr('class', 'treemap-text')
      .attr('x', (d: any) => (d.x0 + d.x1) / 2)
      .attr('y', (d: any) => (d.y0 + d.y1) / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '10px')
      .attr('fill', 'white')
      .text((d: any) => d.data.name || d.data[xAxis!] || '');
  };

  const renderNetwork = (g: any, data: any[], width: number, height: number) => {
    // Assume data has nodes and links structure
    const nodes = data.filter(d => d.type === 'node' || !d.type);
    const links = data.filter(d => d.type === 'link');

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = g.selectAll('.network-link')
      .data(links)
      .enter().append('line')
      .attr('class', 'network-link')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1);

    const node = g.selectAll('.network-node')
      .data(nodes)
      .enter().append('circle')
      .attr('class', 'network-node')
      .attr('r', 5)
      .attr('fill', '#69b3a2')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  };

  const renderSankey = (g: any, data: any[], width: number, height: number) => {
    // Basic Sankey implementation
    // Note: Full Sankey would require d3-sankey plugin
    const nodes = [...new Set(data.flatMap(d => [d.source, d.target]))].map(name => ({ name }));
    const links = data.map(d => ({
      source: nodes.findIndex(n => n.name === d.source),
      target: nodes.findIndex(n => n.name === d.target),
      value: d.value || 1
    }));

    // Simple vertical layout
    const nodeHeight = height / nodes.length;
    
    nodes.forEach((node, i) => {
      g.append('rect')
        .attr('x', 0)
        .attr('y', i * nodeHeight)
        .attr('width', 20)
        .attr('height', nodeHeight - 5)
        .attr('fill', '#69b3a2');

      g.append('text')
        .attr('x', 25)
        .attr('y', i * nodeHeight + nodeHeight / 2)
        .attr('dominant-baseline', 'middle')
        .attr('font-size', '12px')
        .text(node.name);
    });
  };

  const renderHistogram = (g: any, data: any[], field: string, width: number, height: number) => {
    const values = data.map(d => parseFloat(d[field])).filter(v => !isNaN(v));
    
    const xScale = d3.scaleLinear()
      .domain(d3.extent(values) as [number, number])
      .range([0, width]);

    const bins = d3.histogram()
      .domain(xScale.domain() as [number, number])
      .thresholds(xScale.ticks(20))(values);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length) as number])
      .range([height, 0]);

    g.selectAll('.hist-bar')
      .data(bins)
      .enter().append('rect')
      .attr('class', 'hist-bar')
      .attr('x', (d: any) => xScale(d.x0))
      .attr('y', (d: any) => yScale(d.length))
      .attr('width', (d: any) => Math.max(0, xScale(d.x1) - xScale(d.x0) - 1))
      .attr('height', (d: any) => height - yScale(d.length))
      .attr('fill', '#69b3a2')
      .attr('stroke', 'white')
      .on('mouseover', function(event, d) {
        showTooltip(event, { count: d.length, range: `${d.x0}-${d.x1}` }, 'range', 'count');
      })
      .on('mouseout', hideTooltip);

    // Add axes
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append('g').call(d3.axisLeft(yScale));
  };

  const renderBoxplot = (g: any, data: any[], xField: string, yField: string, width: number, height: number) => {
    // Group data by x field
    const grouped = d3.group(data, d => d[xField]);
    const categories = Array.from(grouped.keys());
    
    const xScale = d3.scaleBand()
      .domain(categories)
      .range([0, width])
      .padding(0.1);

    const allValues = data.map(d => parseFloat(d[yField])).filter(v => !isNaN(v));
    const yScale = d3.scaleLinear()
      .domain(d3.extent(allValues) as [number, number])
      .range([height, 0]);

    categories.forEach(category => {
      const values = grouped.get(category)!.map(d => parseFloat(d[yField])).filter(v => !isNaN(v)).sort(d3.ascending);
      
      if (values.length === 0) return;

      const q1 = d3.quantile(values, 0.25)!;
      const median = d3.quantile(values, 0.5)!;
      const q3 = d3.quantile(values, 0.75)!;
      const min = values[0];
      const max = values[values.length - 1];

      const x = xScale(category)! + xScale.bandwidth() / 2;
      const boxWidth = xScale.bandwidth() * 0.6;

      // Draw box
      g.append('rect')
        .attr('x', x - boxWidth / 2)
        .attr('y', yScale(q3))
        .attr('width', boxWidth)
        .attr('height', yScale(q1) - yScale(q3))
        .attr('fill', '#69b3a2')
        .attr('stroke', 'black');

      // Draw median line
      g.append('line')
        .attr('x1', x - boxWidth / 2)
        .attr('x2', x + boxWidth / 2)
        .attr('y1', yScale(median))
        .attr('y2', yScale(median))
        .attr('stroke', 'black')
        .attr('stroke-width', 2);

      // Draw whiskers
      g.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', yScale(q3))
        .attr('y2', yScale(max))
        .attr('stroke', 'black');

      g.append('line')
        .attr('x1', x)
        .attr('x2', x)
        .attr('y1', yScale(q1))
        .attr('y2', yScale(min))
        .attr('stroke', 'black');
    });

    // Add axes
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append('g').call(d3.axisLeft(yScale));
  };

  const renderBubbleChart = (g: any, data: any[], xField: string, yField: string, width: number, height: number) => {
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => parseFloat(d[xField])) as [number, number])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => parseFloat(d[yField])) as [number, number])
      .range([height, 0]);

    const sizeScale = d3.scaleSqrt()
      .domain(d3.extent(data, d => d.size || 1) as [number, number])
      .range([3, 20]);

    g.selectAll('.bubble')
      .data(data)
      .enter().append('circle')
      .attr('class', 'bubble')
      .attr('cx', (d: any) => xScale(parseFloat(d[xField])))
      .attr('cy', (d: any) => yScale(parseFloat(d[yField])))
      .attr('r', (d: any) => sizeScale(d.size || 1))
      .attr('fill', '#69b3a2')
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1);
        showTooltip(event, d, xField, yField);
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.7);
        hideTooltip();
      });

    // Add axes
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append('g').call(d3.axisLeft(yScale));
  };

  const renderWaterfall = (g: any, data: any[], xField: string, yField: string, width: number, height: number) => {
    let cumulative = 0;
    const processedData = data.map(d => {
      const value = parseFloat(d[yField]);
      const start = cumulative;
      cumulative += value;
      return {
        ...d,
        start,
        end: cumulative,
        value
      };
    });

    const xScale = d3.scaleBand()
      .domain(data.map(d => d[xField]))
      .range([0, width])
      .padding(0.1);

    const yExtent = d3.extent(processedData, d => d.end) as [number, number];
    const yScale = d3.scaleLinear()
      .domain([Math.min(0, yExtent[0]), yExtent[1]])
      .range([height, 0]);

    g.selectAll('.waterfall-bar')
      .data(processedData)
      .enter().append('rect')
      .attr('class', 'waterfall-bar')
      .attr('x', (d: any) => xScale(d[xField]))
      .attr('y', (d: any) => yScale(Math.max(d.start, d.end)))
      .attr('width', xScale.bandwidth())
      .attr('height', (d: any) => Math.abs(yScale(d.start) - yScale(d.end)))
      .attr('fill', (d: any) => d.value >= 0 ? '#69b3a2' : '#ff6b6b')
      .on('mouseover', function(event, d) {
        showTooltip(event, d, xField, 'value');
      })
      .on('mouseout', hideTooltip);

    // Add connecting lines
    g.selectAll('.waterfall-connector')
      .data(processedData.slice(0, -1))
      .enter().append('line')
      .attr('class', 'waterfall-connector')
      .attr('x1', (d: any, i: number) => xScale(d[xField])! + xScale.bandwidth())
      .attr('x2', (d: any, i: number) => xScale(processedData[i + 1][xField])!)
      .attr('y1', (d: any) => yScale(d.end))
      .attr('y2', (d: any) => yScale(d.end))
      .attr('stroke', '#999')
      .attr('stroke-dasharray', '3,3');

    // Add axes
    g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(xScale));
    g.append('g').call(d3.axisLeft(yScale));
  };

  const renderFallback = (g: any, width: number, height: number) => {
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', '16px')
      .attr('fill', '#666')
      .text(`${type} chart not yet implemented`);
  };

  const showTooltip = (event: any, data: any, xField: string, yField: string) => {
    if (!onInteraction) return;
    
    onInteraction('tooltip', {
      x: event.pageX,
      y: event.pageY,
      data,
      xField,
      yField
    });
  };

  const hideTooltip = () => {
    if (!onInteraction) return;
    onInteraction('tooltip', null);
  };

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-transparent overflow-visible"
        style={{ cursor: isZooming ? 'grabbing' : 'grab' }}
      />
      {config.interactions?.some(i => i.type === 'zoom' && i.enabled) && (
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          Zoom: Mouse wheel | Pan: Click & drag
        </div>
      )}
    </div>
  );
};

export default D3AdvancedWrapper;
