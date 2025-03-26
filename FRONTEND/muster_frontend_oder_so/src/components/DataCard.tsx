
import { useState } from "react";
import { Chart } from "./Chart";
import { Dataset, ChartType, chartTypes } from "@/lib/mockData";
import { Select } from "@/components/ui/select";
import { BarChart3, FilterX, RefreshCw } from "lucide-react";

type DataCardProps = {
  dataset: Dataset;
  defaultChartType?: ChartType;
  className?: string;
};

export const DataCard = ({ dataset, defaultChartType = "bar", className = "" }: DataCardProps) => {
  const [chartType, setChartType] = useState<ChartType>(defaultChartType);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div 
      className={`bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-all ${className}`}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary mb-2 inline-block">
            {dataset.id}
          </span>
          <h3 className="text-xl font-semibold">{dataset.name}</h3>
          <p className="text-sm text-muted-foreground">{dataset.description}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
            aria-label="Filter data"
          >
            <FilterX size={18} />
          </button>
          <button 
            onClick={handleRefresh}
            className={`p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors ${isRefreshing ? 'animate-spin' : ''}`}
            aria-label="Refresh data"
          >
            <RefreshCw size={18} />
          </button>
          <div className="relative">
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="bg-secondary/70 text-sm rounded-lg border border-border px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {chartTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              <BarChart3 size={16} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>
      
      {isFilterOpen && (
        <div className="mb-4 p-3 bg-secondary/40 border border-border rounded-lg animate-scale-in">
          <p className="text-sm text-muted-foreground mb-2">Filter options would appear here</p>
          <div className="flex gap-2 flex-wrap">
            <button className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
              All Categories
            </button>
            {Array.from(new Set(dataset.data.map(d => d.category))).map(category => (
              <button 
                key={category}
                className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className={`transition-opacity duration-300 ${isRefreshing ? 'opacity-40' : 'opacity-100'}`}>
        <Chart 
          data={dataset.data} 
          type={chartType} 
          height={300}
        />
      </div>
    </div>
  );
};
