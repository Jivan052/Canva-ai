import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import { DatasetProvider } from "./hooks/useDataset";
import { DataOperationsProvider } from "@/contexts/DataOperationsContext"; // Add this import
import { ManualDataTools } from "./pages/ManualDataTools";
import  DemoAi  from "./pages/Demo"; // Import the DemoAi component

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatasetProvider>
      <DataOperationsProvider> {/* Add the DataOperationsProvider here */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manual-tools" element={<ManualDataTools />} />
              <Route path="/demo-ai" element={<DemoAi />} /> {/* Add the Demo route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataOperationsProvider> {/* Close the provider */}
    </DatasetProvider>
  </QueryClientProvider>
);

export default App;