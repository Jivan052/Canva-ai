
import { useState, ReactNode } from "react";
import { Link } from "react-router-dom";
import { LayoutDashboard, Upload, BarChart2, Settings, Home, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AIProcessingIndicator } from "@/components/ui-custom/AIProcessingIndicator";
import { useIsMobile } from "@/hooks/use-mobile";

type AIStatus = "idle" | "loading" | "analyzing" | "complete" | "error";

interface DashboardLayoutProps {
  children: ReactNode;
  showAIStatus?: boolean;
  aiStatus?: AIStatus;
  progress?: number;
}

export function DashboardLayout({ 
  children, 
  showAIStatus = false,
  aiStatus = "idle",
  progress = 0 
}: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Upload Data", icon: Upload, path: "/dashboard/upload" },
    { name: "Visualize", icon: BarChart2, path: "/dashboard/visualize" },
    { name: "Settings", icon: Settings, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile menu toggle */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 rounded-md bg-background border border-border shadow-sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      )}

      {/* Sidebar */}
      <div 
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:relative md:translate-x-0 z-40 w-64 h-full border-r border-border bg-background transition-transform duration-200 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <BarChart2 className="text-white w-5 h-5" />
              </div>
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">QueryBee</span>
            </Link>
          </div>

          <Separator />

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <Link to="/" className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary rounded-md">
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Analysis
              </p>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center space-x-2 px-3 py-2 text-sm hover:bg-secondary rounded-md"
              >
                <item.icon size={18} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4">
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2" asChild>
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Home</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {showAIStatus && (
            <div className="mb-6">
              <AIProcessingIndicator status={aiStatus} progress={progress} />
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
}
