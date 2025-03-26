
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="text-center max-w-md animate-fade-in">
        <h1 className="text-8xl font-bold text-primary mb-4">404</h1>
        <p className="text-xl text-foreground mb-6">Oops! The page you're looking for doesn't exist.</p>
        <p className="text-muted-foreground mb-8">
          The page at <code className="px-1 py-0.5 bg-secondary/70 rounded text-sm">{location.pathname}</code> could not be found.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 active:scale-[0.98]"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
