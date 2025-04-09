
import { LandingHero } from "@/components/landing/LandingHero";
import { UploadSection } from "@/components/landing/UploadSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="border-b border-border py-4 px-6 md:px-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-lg">AI Data Canvas</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm hover:underline">How It Works</a>
            <Link to="/dashboard" className="text-sm hover:underline">Dashboard</Link>
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
