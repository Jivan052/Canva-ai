
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function LandingHero() {
  return (
    <section className="py-24 px-6 md:px-10 flex flex-col items-center text-center max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
        Transform Your Data with 
        <span className="relative ml-2 inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
           AI Insights<Sparkles className="inline-block w-6 h-6 text-primary ml-2" />
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-black"></div>
        </span>
        
      </h1>
      
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
        Upload your Excel sheets or connect Google Sheets and let our AI generate comprehensive insights and visualizations automatically.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="gap-2">
          <Link to="/dashboard">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
        
        <Button asChild variant="outline" size="lg">
          <a href="#how-it-works">Learn More</a>
        </Button>
      </div>
    </section>
  );
}
