
import LandingHero  from "@/components/landing/LandingHero";
import HowItWorks from "@/components/landing/HowItWorks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {  BarChart2, Settings2 } from "lucide-react";
import HowWeHelpYou from "@/components/landing/HowWeHelpYou";
import Review from "@/components/landing/Review";
import FAQs from "@/components/landing/FAQs";
import UseCasesDropdown from "@/components/UseCasesDropdown";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      
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
