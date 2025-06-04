import { AggregationType, DataPoint } from "@/components/charts/visualization.ts";

export default {
    transformData(data: DataPoint[], transform: { type: AggregationType; field: string; binSize?: number }) {
        if (transform.type === 'bin' && transform.binSize) {
            return this.createBins(data, transform.field, transform.binSize);
        }

        const grouped = this.groupData(data, transform.field);
        return this.aggregateData(grouped, transform.field, transform.type);
    },

    groupData(data: DataPoint[], field: string) {
        const groups: Record<string, DataPoint[]> = {};

        data.forEach(item => {
            const key = item[field];
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        return groups;
    },

    aggregateData(groups: Record<string, DataPoint[]>, field: string, type: AggregationType) {
        return Object.entries(groups).map(([key, items]) => {
            const values = items.map(item => item[field]).filter(v => typeof v === 'number');

            return {
                category: key,
                value: this.calculateAggregate(values, type),
                count: items.length
            };
        });
    },

    createBins(data: DataPoint[], field: string, binSize: number) {
        const values = data.map(d => d[field]).filter(v => typeof v === 'number') as number[];
        if (values.length === 0) return [];

        const min = Math.min(...values);
        const max = Math.max(...values);
        const binCount = Math.ceil((max - min) / binSize);

        const bins = Array.from({ length: binCount }, (_, i) => ({
            binStart: min + i * binSize,
            binEnd: min + (i + 1) * binSize,
            count: 0
        }));

        values.forEach(value => {
            const binIndex = Math.floor((value - min) / binSize);
            if (binIndex >= 0 && binIndex < binCount) {
                bins[binIndex].count++;
            }
        });

        return bins.map(bin => ({
            name: `${bin.binStart.toFixed(1)} - ${bin.binEnd.toFixed(1)}`,
            value: bin.count
        }));
    },

    calculateAggregate(values: number[], type: AggregationType): number {
        if (values.length === 0) return 0;

        switch (type) {
            case 'sum':
                return values.reduce((a, b) => a + b, 0);
            case 'average':
                return values.reduce((a, b) => a + b, 0) / values.length;
            case 'count':
                return values.length;
            case 'min':
                return Math.min(...values);
            case 'max':
                return Math.max(...values);
            default:
                return 0;
        }
    },

    calculateMetric(data: DataPoint[], field: string, metric: 'average' | 'median' | 'min' | 'max'): number {
        const values = data.map(d => d[field]).filter(v => typeof v === 'number') as number[];
        if (values.length === 0) return 0;

        switch (metric) {
            case 'average':
                return values.reduce((a, b) => a + b, 0) / values.length;
            case 'median':
                const sorted = [...values].sort((a, b) => a - b);
                const mid = Math.floor(sorted.length / 2);
                return sorted.length % 2 !== 0
                    ? sorted[mid]
                    : (sorted[mid - 1] + sorted[mid]) / 2;
            case 'min':
                return Math.min(...values);
            case 'max':
                return Math.max(...values);
            default:
                return 0;
        }
    }
};