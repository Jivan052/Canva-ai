import React, { useState, useEffect } from "react";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"; 


export default function LandingHero() {
  const navigate = useNavigate(); // Add this hook
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const rotatingWords = ["AI Insights", "Smart Analytics", "Data Magic", "Visual Stories"];
  const rotatingColors = [
    "from-primary to-indigo-600",
    "from-cyan-600 to-blue-600", 
    "from-purple-600 to-fuchsia-600",
    "from-emerald-600 to-cyan-600"
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: "⚡", title: "Instant Analysis", desc: "Results in seconds" },
    { icon: "🎯", title: "99% Accuracy", desc: "AI-powered insights" },
    { icon: "📊", title: "Beautiful Charts", desc: "Auto-generated visuals" }
  ];


  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-background pt-10">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-gradient-to-r from-primary/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div 
        className={cn(
          "relative z-10 px-6 md:px-10 max-w-7xl mx-auto transition-all duration-1000", 
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        )}
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[80vh]">
          
          {/* Left column - Text content */}
          <div className="text-center lg:text-left order-2 lg:order-1 p-6 lg:pt-0">
            
            {/* Badge */}
            <Badge 
              variant="outline" 
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 bg-background/80 backdrop-blur-sm border-primary/20 hover:bg-primary/5 shadow-sm transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Data Analysis</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </Badge>

            {/* Main headline */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight mb-6 leading-tight">
              Transform Your Data <br className="hidden sm:inline"/>with{" "}
              <span className="relative inline-block">
                <span className={cn(
                  "relative z-10 text-transparent bg-clip-text bg-gradient-to-r",
                  rotatingColors[currentWord]
                )}>
                  {rotatingWords[currentWord]}
                </span>
                <Sparkles className="inline-block w-5 h-5 md:w-6 md:h-6 text-primary ml-1" />
                
                {/* Underline */}
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary rounded-full"></span>
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-md md:text-lg text-muted-foreground mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Upload your Excel sheets or connect Google Sheets and let our{" "}
              <span className="font-medium text-primary">AI generate comprehensive insights</span>{" "}
              and stunning visualizations automatically.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center mb-10">

              <Link to="/demo-ai">
                <div className="relative">
                  <Button 
                    size="lg" 
                    className="group relative px-6 py-6 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      QuerryBee.AI
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Button>
                </div>
              </Link>

              <Link to="/dashboard">
                <div className="relative">
                  <Button 
                    size="lg" 
                    className="group relative px-6 py-6 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground shadow-lg hover:shadow-primary/25 transition-all duration-300"
                  >
                    <span className="flex items-center gap-2">
                      Query Crafter
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
    
                  </Button>
                </div>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="group p-4 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow transition-all duration-300 hover:border-primary/20 hover:bg-primary/5"
                >
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-medium text-foreground mb-1 text-sm">{feature.title}</h3>
                  <p className="text-muted-foreground text-xs">{feature.desc}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Right column - Image */}
          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="relative group">
              {/* Main image container */}
              <div className="relative overflow-hidden rounded-2xl shadow-xl border border-border/30">
                <img 
                  src="https://osiztechnologiesnew.s3.amazonaws.com/ai-tools-for-data-analytics.webp" 
                  alt="Data Analytics Dashboard"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              {/* Floating stat cards */}
              <Badge 
                variant="secondary"
                className="absolute top-0 -right-8 flex items-center gap-2 p-3 shadow-lg"
                style={{
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="font-medium">+247%</span>
              </Badge>
              
              <Badge 
                variant="secondary"
                className="absolute bottom-20 -left-12 flex items-center gap-2 p-3 shadow-lg"
                style={{
                  animation: 'float-delay 5s ease-in-out 1s infinite'
                }}
              >
                <Zap className="w-4 h-4 text-primary" />
                <span className="font-medium">Live Data</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Custom animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes float-delay {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
          }
        `
      }} />
    </section>
  );
}