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
import ChartDisplay from "./components/charts/CharDisplay";

import ProductSales from "./pages/useCasesPage/ProductSales";
import HROperation from "./pages/useCasesPage/HROperation";
import Finance from "./pages/useCasesPage/Finance";
import Marketing from "./pages/useCasesPage/Marketing";
import Footer from "./components/landing/Footer";
import Navbar from "./components/landing/Navbar";
import { InsightProvider } from "./contexts/InsightContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DatasetProvider>
      <DataOperationsProvider> {/* Add the DataOperationsProvider here */}
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <InsightProvider>
          
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/manual-tools" element={<ManualDataTools />} />
              <Route path="/demo-ai" element={<DemoAi />} /> {/* Add the Demo route */}

              {/* ✅ Use Case Pages */}
              <Route path="/product-sales" element={<ProductSales />} />
              <Route path="/hr-operation" element={<HROperation />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/marketing" element={<Marketing />} />


              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Footer */}
            <Footer />
          </BrowserRouter>
          </InsightProvider>
        </TooltipProvider>
      </DataOperationsProvider> {/* Close the provider */}
    </DatasetProvider>
  </QueryClientProvider>
);

export default App;