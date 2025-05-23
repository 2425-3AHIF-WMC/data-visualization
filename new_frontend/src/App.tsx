//  Name, Avatar, Passwort etc.
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "./utils/themeContext";
import Index from "./pages/Index";
import DataImport from "./pages/DataImport";
import Visualizations from "./pages/Visualizations";
import AppSettings from "./pages/AppSettings.tsx";
import AccountSettingsPage from "@/pages/AccountSettings.tsx";
import SignIn from "@/pages/SignIn.tsx";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Datasets from "@/pages/Datasets.tsx";
import DatasetEdit from "@/pages/DatasetEdit.tsx";
import ChartVisualization from "@/pages/ChartVisualisation.tsx";
import SavedVisualization from "@/pages/SavedVisualization.tsx";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/import" element={<DataImport />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/settings" element={<AppSettings />} />
            <Route path="/accountSettings" element={<AccountSettingsPage/>}/>
            <Route path="/datasets" element={<Datasets/>}/>
            <Route path="datasets/:id" element={<DatasetEdit />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signin" element={<SignIn/>}/>
            <Route path="*" element={<NotFound />} />
            <Route path="/diagrams" element={<ChartVisualization />} />
            <Route path="/saved" element={<SavedVisualization />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

// Todo /settings route muss noch namentlich angepasst werden, damit eindeutig ist
export default App;
