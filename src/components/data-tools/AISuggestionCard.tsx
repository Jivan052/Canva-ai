
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  Sparkles, 
  Check, 
  X, 
  Lightbulb, 
  Brush, 
  ArrowRightLeft, 
  FileType, 
  ShieldCheck,
  MoreHorizontal,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AISuggestion } from "@/lib/data-processing/aiSuggestions";

interface AISuggestionCardProps {
  suggestion: AISuggestion;
  onApply: (suggestion: AISuggestion) => void;
  onDismiss: (suggestion: AISuggestion) => void;
  onInfo?: (suggestion: AISuggestion) => void;
  isApplying?: boolean;
  className?: string;
}

export function AISuggestionCard({ 
  suggestion, 
  onApply, 
  onDismiss, 
  onInfo,
  isApplying = false,
  className = "" 
}: AISuggestionCardProps) {
  // Determine the icon based on suggestion type
  const getIcon = () => {
    switch (suggestion.type) {
      case 'cleaning':
        return <Brush className="h-4 w-4" />;
      case 'transformation':
        return <ArrowRightLeft className="h-4 w-4" />;
      case 'formatting':
        return <FileType className="h-4 w-4" />;
      case 'validation':
        return <ShieldCheck className="h-4 w-4" />;
      default:
        return <Lightbulb className="h-4 w-4" />;
    }
  };

  // Format the confidence level
  const getConfidenceBadge = () => {
    let variant = "outline";
    let label = "Low";
    
    if (suggestion.confidence >= 85) {
      variant = "default";
      label = "High";
    } else if (suggestion.confidence >= 70) {
      variant = "secondary";
      label = "Medium";
    }
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant={variant as any} className="ml-2">
              {label}
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p>Confidence score: {suggestion.confidence}%</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  // Format the relative time
  const getRelativeTime = () => {
    const msPerMinute = 60 * 1000;
    const msPerHour = msPerMinute * 60;
    const msPerDay = msPerHour * 24;
    
    const elapsed = Date.now() - suggestion.timestamp;
    
    if (elapsed < msPerMinute) {
      return 'Just now';
    } else if (elapsed < msPerHour) {
      const minutes = Math.round(elapsed / msPerMinute);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (elapsed < msPerDay) {
      const hours = Math.round(elapsed / msPerHour);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      const days = Math.round(elapsed / msPerDay);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  return (
    <Card 
      className={cn(
        "border-l-4",
        suggestion.type === 'cleaning' ? "border-l-blue-500" : 
        suggestion.type === 'transformation' ? "border-l-purple-500" : 
        suggestion.type === 'formatting' ? "border-l-green-500" : 
        "border-l-amber-500",
        className
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <Badge 
            variant="outline" 
            className={cn(
              "flex items-center gap-1 text-xs",
              suggestion.type === 'cleaning' ? "text-blue-600" : 
              suggestion.type === 'transformation' ? "text-purple-600" : 
              suggestion.type === 'formatting' ? "text-green-600" : 
              "text-amber-600"
            )}
          >
            {getIcon()}
            {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
          </Badge>
          {getConfidenceBadge()}
        </div>
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          {suggestion.title}
        </CardTitle>
        <CardDescription className="text-sm">
          {suggestion.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2 text-xs text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>Suggested {getRelativeTime()}</span>
          {onInfo && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => onInfo(suggestion)}
            >
              <Info className="h-3.5 w-3.5" />
              <span className="sr-only">View details</span>
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex items-center gap-2 w-full">
          <Button 
            size="sm" 
            className="flex-1" 
            onClick={() => onApply(suggestion)} 
            disabled={isApplying || suggestion.status !== 'pending'}
          >
            {isApplying ? (
              <span className="flex items-center gap-1">
                <span className="animate-pulse">Processing...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Check className="h-3.5 w-3.5" />
                Apply
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onDismiss(suggestion)}
            disabled={isApplying || suggestion.status !== 'pending'}
          >
            <span className="flex items-center gap-1">
              <X className="h-3.5 w-3.5" />
              Dismiss
            </span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}