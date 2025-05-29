import { Zap, Sparkles, MousePointer, FileText, Users, RefreshCw, Clock, Rocket, Shield } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function HowWeHelpYou() {
  const helpCards = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant Insights",
      description: "Instantly see the story your data is hiding. Just upload your data, and our AI agents will create compelling visuals for you.",
      gradient: "from-blue-500 to-cyan-500",
      bgClass: "bg-blue-50 hover:bg-blue-100"
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: "Effortless Data Cleaning",
      description: "Say goodbye to format errors and handling multi-currency — we fix them all automatically, no formulas required.",
      gradient: "from-purple-500 to-pink-500",
      bgClass: "bg-purple-50 hover:bg-purple-100"
    },
    {
      icon: <MousePointer className="h-6 w-6" />,
      title: "1-Click Explore & Play",
      description: "Customize with one-click selections like date grouping, segmentation, filtering, and theme changes.",
      gradient: "from-green-500 to-emerald-500",
      bgClass: "bg-green-50 hover:bg-green-100"
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Customizable Reports",
      description: "Create multiple reports tailored to different audiences, with relevant charts, KPIs, or tabular data.",
      gradient: "from-orange-500 to-red-500",
      bgClass: "bg-orange-50 hover:bg-orange-100"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Seamless Collaboration",
      description: "Share interactive visuals via email or link. Leave comments directly on charts for team discussions.",
      gradient: "from-indigo-500 to-blue-500",
      bgClass: "bg-indigo-50 hover:bg-indigo-100"
    },
    {
      icon: <RefreshCw className="h-6 w-6" />,
      title: "Automated Workflows",
      description: "No more repetitive work. Schedule updates daily, weekly, monthly, quarterly or yearly.",
      gradient: "from-teal-500 to-cyan-500",
      bgClass: "bg-teal-50 hover:bg-teal-100"
    },
  ];

  return (
    <section id="how-we-help-you" className="py-20 px-4 md:px-6 bg-background">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="outline" className="px-4 py-1 text-sm border-primary/20 bg-primary/5 text-primary">
              Features
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              <span className="relative inline-block text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
            How We Help You
              </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the powerful features that transform your data into actionable insights
          </p>
          <Separator className="max-w-md mx-auto" />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCards.map((card, index) => (
            <Card 
              key={index}
              className={cn(
                "group overflow-hidden transition-all duration-300 border border-border/40",
                "hover:shadow-lg hover:border-primary/20 hover:-translate-y-1",
                card.bgClass
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center space-x-3">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${card.gradient} flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                    {card.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{card.title}</CardTitle>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                  {card.description}
                </CardDescription>
              </CardContent>
              
              <CardFooter className="pt-0">
                <div className={`h-0.5 w-full bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}