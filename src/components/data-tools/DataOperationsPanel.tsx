import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDataOperations } from "@/hooks/useDataOperations";
import { DataCleaningTools } from "./DataCleaningTools";
import { DataTransformTools } from "./DataTransformTools";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2, RotateCcw, FileText, BarChart2, Table, Filter } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

interface DataOperationsPanelProps {
  className?: string;
}

export function DataOperationsPanel({ className }: DataOperationsPanelProps) {
  const { 
    isInitialized, 
    canUndo, 
    canRedo, 
    undo, 
    redo, 
    reset,
    data,
    lastOperation
  } = useDataOperations();
  
  const [activeTab, setActiveTab] = useState<string>("clean");
  
  // Handle non-initialized state
  if (!isInitialized) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="px-6 py-10">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No Data Loaded</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md">
              Upload a dataset to start cleaning and transforming your data.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleUndo = () => {
    undo();
    toast({
      title: "Operation Undone",
      description: "The last operation has been reversed.",
    });
  };

  const handleRedo = () => {
    redo();
    toast({
      title: "Operation Redone",
      description: "The operation has been reapplied.",
    });
  };

  const handleReset = () => {
    reset();
    toast({
      title: "Data Reset",
      description: "All operations have been cleared and data reset to original.",
      variant: "destructive",
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Stats panel */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-primary/20 to-purple-500/20 p-0.5">
          <div className="bg-card p-3 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start w-full sm:w-auto">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1 py-1 border-primary/30">
                      <Table className="h-3.5 w-3.5" />
                      <span>{data.length} rows</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of data rows</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1 py-1 border-primary/30">
                      <BarChart2 className="h-3.5 w-3.5" />
                      <span>{Object.keys(data[0] || {}).length} cols</span>
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Number of columns</p>
                  </TooltipContent>
                </Tooltip>

                {lastOperation && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant={lastOperation.successful ? "default" : "destructive"} 
                        className="flex items-center gap-1 py-1"
                      >
                        <Filter className="h-3.5 w-3.5" />
                        <span>{lastOperation.name}</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Latest operation: {lastOperation.name}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </TooltipProvider>
            </div>

            <div className="flex items-center space-x-1 mt-2 sm:mt-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleUndo}
                disabled={!canUndo}
                className="h-8 w-8"
              >
                <Undo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRedo}
                disabled={!canRedo}
                className="h-8 w-8"
              >
                <Redo2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReset}
                className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs for different operation categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4 w-full">
          <TabsTrigger value="clean" className="flex items-center gap-1.5">
            <Filter className="h-4 w-4" />
            <span>Clean</span>
          </TabsTrigger>
          <TabsTrigger value="transform" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span>Transform</span>
          </TabsTrigger>
        </TabsList>

        {/* Data cleaning tools */}
        <TabsContent value="clean" className="space-y-4 mt-2">
          <DataCleaningTools />
        </TabsContent>

        {/* Data transformation tools */}
        <TabsContent value="transform" className="space-y-4 mt-2">
          <DataTransformTools />
        </TabsContent>
      </Tabs>

      {/* Last operation notification */}
      {lastOperation && (
        <div className={cn(
          "text-sm p-3 rounded-md border transition-all duration-300 animate-fade-in",
          lastOperation.successful 
            ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900" 
            : "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900"
        )}>
          <div className="font-medium mb-0.5">
            {lastOperation.successful ? "Operation Completed" : "Operation Failed"}
          </div>
          <div className="opacity-90">
            {lastOperation.successful 
              ? `${lastOperation.name} completed successfully.` 
              : `${lastOperation.name} failed: ${lastOperation.message}`}
          </div>
        </div>
      )}
    </div>
  );
}