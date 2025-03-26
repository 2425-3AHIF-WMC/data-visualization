
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { toast } from "sonner";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        if (!name) {
          toast.error("Please enter your name");
          return;
        }
        await register(name, email, password);
      }
      navigate("/");
    } catch (error) {
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md flex flex-col items-stretch gap-8">
          <div className="text-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-foreground font-bold text-xl">D</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight">DataViz Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm animate-scale-in">
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium block">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-secondary/60 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/60 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium block">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/60 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 px-4 rounded-md bg-primary text-primary-foreground font-medium transition-all ${
                  isLoading 
                    ? "opacity-70 cursor-not-allowed" 
                    : "hover:bg-primary/90 active:scale-[0.98]"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? "Sign In" : "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-primary hover:underline"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          {/* Demo section */}
          <div className="bg-secondary/40 rounded-xl p-4 border border-border">
            <h3 className="text-sm font-medium mb-2">Demo Credentials</h3>
            <p className="text-xs text-muted-foreground mb-2">
              For demonstration purposes, you can use any valid email and password combination.
            </p>
            <button
              onClick={() => {
                setEmail("demo@example.com");
                setPassword("password");
                setIsLogin(true);
              }}
              className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-md hover:bg-primary/20 transition-colors"
            >
              Use Demo Account
            </button>
          </div>
        </div>
      </div>

      <footer className="border-t border-border py-4 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} DataViz. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
