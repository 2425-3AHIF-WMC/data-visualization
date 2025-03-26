
export type DataPoint = {
  month: string;
  value: number;
  category: string;
};

export type Dataset = {
  id: string;
  name: string;
  description: string;
  data: DataPoint[];
};

export const monthlyRevenueData: Dataset = {
  id: "monthly-revenue",
  name: "Monthly Revenue",
  description: "Revenue data for the past 12 months across different product categories",
  data: [
    { month: "Jan", value: 3400, category: "Hardware" },
    { month: "Feb", value: 3900, category: "Hardware" },
    { month: "Mar", value: 4100, category: "Hardware" },
    { month: "Apr", value: 4600, category: "Hardware" },
    { month: "May", value: 5000, category: "Hardware" },
    { month: "Jun", value: 5300, category: "Hardware" },
    { month: "Jul", value: 5800, category: "Hardware" },
    { month: "Aug", value: 6000, category: "Hardware" },
    { month: "Sep", value: 6300, category: "Hardware" },
    { month: "Oct", value: 6700, category: "Hardware" },
    { month: "Nov", value: 7000, category: "Hardware" },
    { month: "Dec", value: 7500, category: "Hardware" },
    
    { month: "Jan", value: 2300, category: "Software" },
    { month: "Feb", value: 2500, category: "Software" },
    { month: "Mar", value: 2800, category: "Software" },
    { month: "Apr", value: 3200, category: "Software" },
    { month: "May", value: 3500, category: "Software" },
    { month: "Jun", value: 3800, category: "Software" },
    { month: "Jul", value: 4200, category: "Software" },
    { month: "Aug", value: 4500, category: "Software" },
    { month: "Sep", value: 4900, category: "Software" },
    { month: "Oct", value: 5300, category: "Software" },
    { month: "Nov", value: 5800, category: "Software" },
    { month: "Dec", value: 6200, category: "Software" },
    
    { month: "Jan", value: 1800, category: "Services" },
    { month: "Feb", value: 2000, category: "Services" },
    { month: "Mar", value: 2200, category: "Services" },
    { month: "Apr", value: 2400, category: "Services" },
    { month: "May", value: 2600, category: "Services" },
    { month: "Jun", value: 2900, category: "Services" },
    { month: "Jul", value: 3100, category: "Services" },
    { month: "Aug", value: 3400, category: "Services" },
    { month: "Sep", value: 3700, category: "Services" },
    { month: "Oct", value: 4000, category: "Services" },
    { month: "Nov", value: 4300, category: "Services" },
    { month: "Dec", value: 4700, category: "Services" },
  ],
};

export const userActivityData: Dataset = {
  id: "user-activity",
  name: "User Activity",
  description: "Daily active users over the past 30 days",
  data: Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const day = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return {
      month: day,
      value: 2000 + Math.floor(Math.random() * 1500) + (i < 15 ? 800 : 0),
      category: "Users"
    };
  }).reverse(),
};

export const productPerformanceData: Dataset = {
  id: "product-performance",
  name: "Product Performance",
  description: "Performance metrics for each product line",
  data: [
    { month: "Product A", value: 87, category: "Satisfaction" },
    { month: "Product B", value: 92, category: "Satisfaction" },
    { month: "Product C", value: 79, category: "Satisfaction" },
    { month: "Product D", value: 95, category: "Satisfaction" },
    { month: "Product E", value: 88, category: "Satisfaction" },
  ],
};

export const marketShareData: Dataset = {
  id: "market-share",
  name: "Market Share",
  description: "Current market share by segment",
  data: [
    { month: "Segment 1", value: 35, category: "Market Share" },
    { month: "Segment 2", value: 25, category: "Market Share" },
    { month: "Segment 3", value: 20, category: "Market Share" },
    { month: "Segment 4", value: 15, category: "Market Share" },
    { month: "Other", value: 5, category: "Market Share" },
  ],
};

export const availableDatasets: Dataset[] = [
  monthlyRevenueData,
  userActivityData,
  productPerformanceData,
  marketShareData,
];

export type ChartType = "bar" | "line" | "area" | "pie" | "scatter";

export const chartTypes: { id: ChartType; name: string }[] = [
  { id: "bar", name: "Bar Chart" },
  { id: "line", name: "Line Chart" },
  { id: "area", name: "Area Chart" },
  { id: "pie", name: "Pie Chart" },
  { id: "scatter", name: "Scatter Plot" }
];
