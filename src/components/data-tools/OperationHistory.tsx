import { useDataOperations } from "@/hooks/useDataOperations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Wand2, Filter, BarChart2, Clock, ArrowRightLeft, X, Check,
  ChevronDown, ChevronUp, History as HistoryIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider
} from "@/components/ui/tooltip";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OperationHistoryProps {
  className?: string;
}

// Define a proper type for the operation history item
interface OperationHistoryItem {
  type: string;
  name: string;
  timestamp?: number;
  successful?: boolean;
  parameters?: Record<string, any>;
}

export function OperationHistory({ className }: OperationHistoryProps) {
  const { operationHistory, lastOperation } = useDataOperations();
  const [isOpen, setIsOpen] = useState(false);
  
  // Only show the last 5 operations
  const displayHistory = (operationHistory && operationHistory.length > 0) ? 
    (operationHistory as OperationHistoryItem[])
      .slice(-5)
      .reverse() :
    [];
  
  const hasOperations = displayHistory.length > 0;

  return (
    <Collapsible 
      open={isOpen} 
      onOpenChange={setIsOpen}
      className={cn("border rounded-md bg-card shadow-sm", className)}
    >
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between rounded-none border-0 px-3 py-1.5 h-auto"
        >
          <div className="flex items-center gap-2">
            <HistoryIcon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs font-medium">Operation History</span>
            {hasOperations && (
              <Badge variant="secondary" className="text-[10px] h-5 font-normal px-1.5">
                {operationHistory.length}
              </Badge>
            )}
          </div>
          {isOpen ? (
            <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <div className="px-2 pt-0 pb-2">
          {!hasOperations ? (
            <div className="flex flex-col items-center justify-center py-4 text-center text-muted-foreground">
              <Clock className="h-4 w-4 mb-1 opacity-70" />
              <p className="text-xs">No operations yet</p>
            </div>
          ) : (
            <div className="space-y-1 pt-1">
              <TooltipProvider delayDuration={300}>
                {displayHistory.map((operation, index) => {
                  const isActive = lastOperation && 
                    operation.type === lastOperation.type && 
                    operation.name === lastOperation.name;
                  
                  // Safely check for successful property with a default of true if undefined
                  const isSuccess = operation.successful !== false;
                  
                  return (
                    <Tooltip key={index}>
                      <TooltipTrigger asChild>
                        <div 
                          className={cn(
                            "flex items-center justify-between p-1.5 rounded-md text-xs",
                            isActive
                              ? 'bg-muted' 
                              : 'bg-muted/40 text-muted-foreground hover:bg-muted/80 transition-colors'
                          )}
                        >
                          <div className="flex items-center space-x-1.5">
                            <div className="flex-shrink-0">
                              {operation.type === 'clean' ? (
                                <Filter className="h-3 w-3" />
                              ) : operation.type === 'transform' ? (
                                <BarChart2 className="h-3 w-3" />
                              ) : (
                                <ArrowRightLeft className="h-3 w-3" />
                              )}
                            </div>
                            <span className="truncate max-w-[110px]">{operation.name || "Unknown"}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {isSuccess ? (
                              <Check className="h-3 w-3 text-green-500" />
                            ) : (
                              <X className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-[10px] tabular-nums opacity-60">
                              {operation.timestamp 
                                ? new Date(operation.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                                : '--:--'}
                            </span>
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right" align="start">
                        <div className="space-y-1">
                          <p className="font-medium">{operation.name || "Unknown operation"}</p>
                          <p className="text-xs opacity-90">
                            Status: {isSuccess ? "Successful" : "Failed"}
                          </p>
                          <p className="text-xs opacity-90">
                            Type: {operation.type === 'clean' ? 'Cleaning' : 
                                  operation.type === 'transform' ? 'Transformation' : 
                                  operation.type || 'Unknown'}
                          </p>
                          {operation.parameters && Object.keys(operation.parameters).length > 0 && (
                            <div className="text-xs opacity-90">
                              <span className="font-medium">Parameters:</span>{" "}
                              {Object.entries(operation.parameters).map(([key, value]) => (
                                `${key}: ${String(value)}`
                              )).join(", ")}
                            </div>
                          )}
                          <p className="text-xs opacity-90">
                            {operation.timestamp 
                              ? new Date(operation.timestamp).toLocaleString()
                              : 'No timestamp'}
                          </p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
              
              {operationHistory.length > 5 && (
                <div className="text-center text-[10px] text-muted-foreground pt-1">
                  +{operationHistory.length - 5} more
                </div>
              )}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}