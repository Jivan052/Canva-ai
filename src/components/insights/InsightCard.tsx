
import { ArrowRight, Lightbulb, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface InsightCardProps {
  title: string;
  description: string;
  type: "insight" | "anomaly" | "trend-up" | "trend-down";
  metric?: string;
  value?: string | number;
  change?: string | number;
  confidenceScore?: number;
}

export function InsightCard({ 
  title, 
  description, 
  type, 
  metric, 
  value, 
  change,
  confidenceScore 
}: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case "insight":
        return <Lightbulb className="h-5 w-5" />;
      case "anomaly":
        return <AlertTriangle className="h-5 w-5" />;
      case "trend-up":
        return <TrendingUp className="h-5 w-5" />;
      case "trend-down":
        return <TrendingDown className="h-5 w-5" />;
    }
  };

  const getTypeColor = () => {
    switch (type) {
      case "insight":
        return "bg-secondary text-primary";
      case "anomaly":
        return "bg-amber-100 text-amber-800";
      case "trend-up":
        return "bg-green-100 text-green-800";
      case "trend-down":
        return "bg-red-100 text-red-800";
    }
  };
  
  const getTypeName = () => {
    switch (type) {
      case "insight":
        return "Insight";
      case "anomaly":
        return "Anomaly";
      case "trend-up":
        return "Trend (↑)";
      case "trend-down":
        return "Trend (↓)";
    }
  };

  // Convert change to number for comparison if it exists
  const numericChange = change !== undefined ? Number(change) : 0;
  const isPositiveChange = numericChange > 0;

  return (
    <Card className="insight-card animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge className={`${getTypeColor()} font-normal flex items-center gap-1`}>
            {getIcon()}
            {getTypeName()}
            {confidenceScore !== undefined && (
              <span className="ml-1 text-xs opacity-80">
                {Math.round(confidenceScore * 100)}%
              </span>
            )}
          </Badge>
          
          {metric && value && (
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{metric}</p>
              <p className="text-xl font-semibold">
                {value}
                {change !== undefined && (
                  <span className={isPositiveChange ? "text-green-600" : "text-red-600"} style={{ fontSize: "0.75em" }}>
                    {" "}{isPositiveChange ? "+" : ""}{numericChange}%
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
        
        <CardTitle className="mt-4 text-xl">{title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="pt-4">
        <div className="w-full flex justify-end">
          <span className="text-sm font-medium flex items-center cursor-pointer hover:underline">
            Explore details <ArrowRight className="h-3 w-3 ml-1" />
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
