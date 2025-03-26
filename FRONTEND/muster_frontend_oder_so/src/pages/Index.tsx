
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { DataCard } from "@/components/DataCard";
import { useAuth } from "@/hooks/useAuth";
import { availableDatasets, Dataset } from "@/lib/mockData";
import { AreaChart, BarChart3, LineChart, PieChart } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }

    // Simulate data loading with animation
    const timer = setTimeout(() => {
      setDatasets(availableDatasets);
      setIsInitialLoad(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isInitialLoad) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Loading Dashboard</h2>
          <p className="text-muted-foreground">Preparing your visualization experience...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show a preview version
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="container mx-auto px-4 py-12 flex-1 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight">Interactive Data Dashboard</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-8">
            Please log in to access the full features of this dashboard including interactive filters, custom visualizations, and real-time data updates.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
          >
            Log in to Continue
          </button>
          
          <div className="mt-12 w-full max-w-4xl p-6 border border-dashed border-border rounded-xl bg-secondary/20 backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-4">Dashboard Preview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="aspect-video bg-card rounded-lg border border-border p-4 flex flex-col items-center justify-center">
                <BarChart3 size={32} className="text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Bar Charts</p>
              </div>
              <div className="aspect-video bg-card rounded-lg border border-border p-4 flex flex-col items-center justify-center">
                <LineChart size={32} className="text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Line Charts</p>
              </div>
              <div className="aspect-video bg-card rounded-lg border border-border p-4 flex flex-col items-center justify-center">
                <AreaChart size={32} className="text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Area Charts</p>
              </div>
              <div className="aspect-video bg-card rounded-lg border border-border p-4 flex flex-col items-center justify-center">
                <PieChart size={32} className="text-primary mb-3" />
                <p className="text-sm text-muted-foreground">Pie Charts</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/10 rounded-md">
              <p className="text-sm">Log in to explore real data and customize your visualizations.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Navbar />
        
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome to your interactive data visualization dashboard.</p>
          </div>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[
              { title: "Total Revenue", value: "$124,592", change: "+12.3%", up: true },
              { title: "Active Users", value: "8,231", change: "+5.4%", up: true },
              { title: "Conversion Rate", value: "24.6%", change: "-2.1%", up: false },
              { title: "Avg. Session", value: "4m 23s", change: "+0.8%", up: true }
            ].map((item, index) => (
              <div 
                key={item.title}
                className={`bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-all animate-slide-in`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h3 className="text-sm font-medium text-muted-foreground">{item.title}</h3>
                <div className="flex items-baseline mt-1 gap-2">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <span className={`text-xs ${item.up ? 'text-green-500' : 'text-red-500'}`}>
                    {item.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Data Visualization Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {datasets.map((dataset, index) => (
              <DataCard 
                key={dataset.id}
                dataset={dataset}
                defaultChartType={index === 0 ? "bar" : index === 1 ? "line" : index === 2 ? "pie" : "area"}
                className={`animate-fade-in`}
                style={{ animationDelay: `${200 + index * 100}ms` }}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
