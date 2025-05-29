import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Zap, Settings, Download, Upload, Brain, BarChart3, FileText, Wand2 } from "lucide-react";

export default function HowItWorks() {
  const [activeWorkflow, setActiveWorkflow] = useState('manual');

  const manualWorkflow = [
    {
      icon: Upload,
      title: "Upload Your Data",
      description: "Import Excel files, CSV, or connect to Google Sheets with drag-and-drop simplicity"
    },
    {
      icon: Settings,
      title: "Manual Cleaning Tools",
      description: "Use our intuitive interface to clean, filter, and transform your data manually"
    },
    {
      icon: BarChart3,
      title: "Manual Transformations",
      description: "Apply custom transformations, aggregations, and calculations to your datasets"
     
    },
   
    {
      icon: Download,
      title: "Export Clean Data",
      description: "Download your cleaned datasets and reports in multiple formats (CSV, Excel, PDF)"
    }
  ];

  const automaticWorkflow = [
    {
      icon: Upload,
      title: "Upload & Command",
      description: "Upload your data files and provide specific instructions or insights you want to extract"
    },
    {
      icon: Brain,
      title: "AI Processing",
      description: "Our LLM models automatically clean, transform, and analyze your data based on your requirements"
    },
    {
      icon: Wand2,
      title: "Smart Insights",
      description: "AI generates intelligent insights, patterns, and recommendations from your data"
    },
    {
      icon: BarChart3,
      title: "Auto Visualizations",
      description: "Automatically created charts and dashboards tailored to your specific requests"
    },
    {
      icon: Download,
      title: "Download Everything",
      description: "Get cleaned data, AI insights, visualizations, and comprehensive reports instantly"
    }
  ];

  const currentWorkflow = activeWorkflow === 'manual' ? manualWorkflow : automaticWorkflow;

  return (
    <>
    <section id="how-it-works" className="py-20 px-6 md:px-10 bg-background/40 overflow-hidden relative">
      {/* Gradient backgrounds */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
              Process
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
              How It Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Choose your preferred approach: Take full control with manual tools or let AI handle everything automatically
          </p>
          <Separator className="max-w-md mx-auto" />
          
          {/* Workflow Toggle */}
          <div className="flex items-center justify-center mt-8">
            <div className="bg-muted/50 p-1 rounded-lg border border-border/50 backdrop-blur-sm">
              <Button
                variant={activeWorkflow === 'manual' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveWorkflow('manual')}
                className={cn(
                  "px-6 py-2 transition-all duration-200",
                  activeWorkflow === 'manual' 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "hover:bg-muted/80"
                )}
              >
                <Settings className="w-4 h-4 mr-2" />
                Manual Tool
              </Button>
              <Button
                variant={activeWorkflow === 'automatic' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveWorkflow('automatic')}
                className={cn(
                  "px-6 py-2 transition-all duration-200",
                  activeWorkflow === 'automatic' 
                    ? "bg-gradient-to-r from-primary to-purple-500 text-primary-foreground shadow-sm" 
                    : "hover:bg-muted/80"
                )}
              >
                <Zap className="w-4 h-4 mr-2" />
                QueryBee.AI
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Description */}
        <div className="text-center mb-12">
          <div className="max-w-2xl mx-auto p-6 rounded-xl bg-muted/30 border border-border/50 backdrop-blur-sm">
            {activeWorkflow === 'manual' ? (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  Manual Data Processing
                </h3>
                <p className="text-muted-foreground">
                  Perfect for users who want hands-on control. Clean, transform, and analyze your data using our comprehensive suite of manual tools and interactive features.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground flex items-center justify-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  AI-Powered Automation
                </h3>
                <p className="text-muted-foreground">
                  Let AI do the heavy lifting. Simply upload your data, tell us what insights you need, and our LLM models will clean, analyze, and generate comprehensive reports automatically.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-primary/10 via-purple-500/30 to-primary/10"></div>
          
          <div
  className={cn(
    "grid grid-cols-1 sm:grid-cols-2 gap-12 relative z-10",
    activeWorkflow === 'manual' ? "lg:grid-cols-4 gap-y-20 lg:gap-x-12" : "lg:grid-cols-5 gap-x-6"
  )}
>

            {currentWorkflow.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div 
                  key={`${activeWorkflow}-${index}`}
                  className="flex flex-col items-center text-center group animate-in fade-in-50 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className={cn(
                      "w-28 h-28 rounded-full flex items-center justify-center",
                      "shadow-lg transform transition-all duration-500",
                      "group-hover:scale-110 group-hover:shadow-xl",
                      activeWorkflow === 'manual' 
                        ? "bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20" 
                        : "bg-gradient-to-br from-purple-500/10 to-primary/5 border-2 border-purple-500/20",
                      "group-hover:shadow-primary/20",
                      "overflow-hidden backdrop-blur-sm",
                      "before:absolute before:inset-0 before:rounded-full",
                      "before:bg-gradient-to-br before:from-white/10 before:to-transparent",
                      "before:opacity-0 group-hover:before:opacity-100",
                      "before:transition-opacity before:duration-300"
                    )}>
                      <IconComponent className={cn(
                        "w-12 h-12 relative z-10 transition-colors duration-300",
                        activeWorkflow === 'manual' 
                          ? "text-primary group-hover:text-primary" 
                          : "text-purple-500 group-hover:text-purple-600"
                      )} />
                    </div>
                    
                    {/* Step Number */}
                    <div className={cn(
                      "absolute -top-1 -right-1 w-8 h-8 rounded-full",
                      "flex items-center justify-center text-sm font-bold",
                      activeWorkflow === 'manual' 
                        ? "bg-gradient-to-br from-primary to-primary/80" 
                        : "bg-gradient-to-br from-purple-500 to-primary",
                      "text-white shadow-md transition-transform duration-300",
                      "group-hover:scale-110"
                    )}>
                      {index + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action */}
       
      </div>
    </section>
    </>
  );
}