
import { LandingHero } from "@/components/landing/LandingHero";
import { UploadSection } from "@/components/landing/UploadSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {  BarChart2, Settings2 } from "lucide-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-border py-4 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <BarChart2 className="text-white w-5 h-5" />
              </div>
            <span className="font-bold text-lg">AI Data Canvas</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm hover:underline">How It Works</a>
            <Link to="/pricing" className="text-sm hover:underline">DFormulator</Link>
            <Link to="/manual-tools">
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Manual Data Tools
            </Button>
            </Link>
            <Link to="/demo-ai">
            <Button variant="outline" className="gap-2">
              <Settings2 className="h-4 w-4" />
              DemoAI
            </Button>
            </Link>
          </nav>
          
          <div>
            <Button asChild>
              <Link to="/dashboard">Get Started</Link>
            </Button>
          </div>
          
          
        </div>
      </header>
      
      {/* Hero Section */}
      <LandingHero />
      
      {/* Features Section */}
      <UploadSection />
      
      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 md:px-10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 AI Data Canvas. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
