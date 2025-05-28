
import { LandingHero } from "@/components/landing/LandingHero";
import HowItWorks from "@/components/landing/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {  BarChart2, Settings2 } from "lucide-react";
import HowWeHelpYou from "@/components/landing/HowWeHelpYou";
import Review from "@/components/landing/Review";
import FAQs from "@/components/landing/FAQs";
import UseCasesDropdown from "@/components/UseCasesDropdown";
import Footer from "@/components/landing/Footer";

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
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">AI Data Canvas</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#how-it-works" className="text-sm hover:underline">How It Works</a>
            <a href="#how-we-help-you" className="text-sm hover:underline">Services</a>
            <UseCasesDropdown />
            <Link to ="/blog">Blog</Link>
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
      <HowItWorks />

      {/* HowWeHelpYou Secton */}
      <HowWeHelpYou />

      {/* Reviews Section */}
      <Review />

      {/* FAQs Section */}
      <FAQs />
    
    </div>
  );
};

export default Index;
