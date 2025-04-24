import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Lightbulb,
  Sparkles,
  RefreshCw,
  History,
  LucideSparkles,
  Zap
} from "lucide-react";
import { AISuggestionCard } from "./AISuggestionCard";
import { useDataOperations } from "@/hooks/useDataOperations";
import { AISuggestion, generateSuggestions } from "@/lib/data-processing/aiSuggestions";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

interface AISuggestionsProps {
  className?: string;
}

export function AISuggestions({ className }: AISuggestionsProps) {
  const { data, columns, isInitialized, clean, transform } = useDataOperations();
  
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [appliedSuggestions, setAppliedSuggestions] = useState<AISuggestion[]>([]);
  const [dismissedSuggestions, setDismissedSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null);
  const [isApplyingSuggestion, setIsApplyingSuggestion] = useState<string | null>(null);
  
  // Load suggestions when data changes significantly
  useEffect(() => {
    if (isInitialized && data.length > 0) {
      refreshSuggestions();
    }
  }, [isInitialized]);
  
  // Get pending suggestions
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');
  
  // Function to refresh suggestions
  const refreshSuggestions = async () => {
    if (!isInitialized || data.length === 0) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newSuggestions = await generateSuggestions(data);
      setSuggestions(prev => {
        // Filter out any suggestions that have been applied or dismissed
        const appliedIds = appliedSuggestions.map(s => s.id);
        const dismissedIds = dismissedSuggestions.map(s => s.id);
        
        // Combine with existing suggestions, avoiding duplicates
        const existingIds = prev.map(s => s.id);
        const uniqueNewSuggestions = newSuggestions.filter(s => 
          !existingIds.includes(s.id) && 
          !appliedIds.includes(s.id) && 
          !dismissedIds.includes(s.id)
        );
        
        return [...prev, ...uniqueNewSuggestions];
      });
      
      toast({
        title: "AI Suggestions Updated",
        description: `Found ${newSuggestions.length} new suggestions for your data.`,
      });
    } catch (error) {
      console.error("Failed to generate suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to apply a suggestion
  const applySuggestion = async (suggestion: AISuggestion) => {
    setIsApplyingSuggestion(suggestion.id);
    
    try {
      // Execute the operation based on suggestion type
      const { name, params } = suggestion.operation;
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (suggestion.type === 'cleaning') {
        switch (name) {
          case 'removeDuplicates':
            await clean.removeDuplicates();
            break;
          case 'fillMissingValues':
            await clean.fillMissingValues(
              params.columns, 
              params.method, 
              params.value
            );
            break;
          case 'dropColumns':
            // This operation might need to be implemented
            console.log('Drop columns operation:', params.columns);
            break;
          case 'handleOutliers':
            // This operation might need to be implemented
            console.log('Handle outliers operation:', params);
            break;
          case 'trimWhitespace':
            await clean.trimWhitespace(params.columns);
            break;
          default:
            throw new Error(`Unknown cleaning operation: ${name}`);
        }
      } else if (suggestion.type === 'transformation' || suggestion.type === 'formatting') {
        switch (name) {
          case 'standardizeTextCase':
            // This operation might need to be implemented
            console.log('Standardize text case operation:', params);
            break;
          case 'standardizeDataType':
            // This operation might need to be implemented
            console.log('Standardize data type operation:', params);
            break;
          case 'mergeColumns':
            await transform.mergeColumns(
              params.columns,
              params.newColumnName,
              params.delimiter,
              params.keepOriginals
            );
            break;
          case 'standardizeDateFormat':
            // This operation might need to be implemented
            console.log('Standardize date format operation:', params);
            break;
          default:
            throw new Error(`Unknown transformation operation: ${name}`);
        }
      }
      
      // Update suggestion status
      const updatedSuggestion = { ...suggestion, status: 'applied' as const };
      
      setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
      setAppliedSuggestions(prev => [...prev, updatedSuggestion]);
      
      toast({
        title: "Suggestion Applied",
        description: suggestion.title,
      });
    } catch (error) {
      console.error("Failed to apply suggestion:", error);
      toast({
        title: "Operation Failed",
        description: "Failed to apply the suggestion. Please try manually.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingSuggestion(null);
    }
  };
  
  // Function to dismiss a suggestion
  const dismissSuggestion = (suggestion: AISuggestion) => {
    const updatedSuggestion = { ...suggestion, status: 'dismissed' as const };
    
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    setDismissedSuggestions(prev => [...prev, updatedSuggestion]);
    
    toast({
      title: "Suggestion Dismissed",
      description: "The suggestion has been removed from your list.",
    });
  };
  
  // Function to view suggestion details
  const viewSuggestionDetails = (suggestion: AISuggestion) => {
    setSelectedSuggestion(suggestion);
  };
  
  // If data is not loaded yet
  if (!isInitialized) {
    return null;
  }
  
  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle>AI Suggestions</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshSuggestions}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              {isLoading ? (
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              )}
              {isLoading ? "Analyzing..." : "Get Suggestions"}
            </Button>
          </div>
          <CardDescription>
            AI-powered suggestions to clean and transform your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="pending" className="flex items-center gap-1">
                <Zap className="h-3.5 w-3.5" />
                Pending
                {pendingSuggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {pendingSuggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="applied" className="flex items-center gap-1">
                <LucideSparkles className="h-3.5 w-3.5" />
                Applied
                {appliedSuggestions.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {appliedSuggestions.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="dismissed" className="flex items-center gap-1">
                <History className="h-3.5 w-3.5" />
                Dismissed
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingSuggestions.length > 0 ? (
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-3">
                    {pendingSuggestions.map(suggestion => (
                      <AISuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onApply={applySuggestion}
                        onDismiss={dismissSuggestion}
                        onInfo={viewSuggestionDetails}
                        isApplying={isApplyingSuggestion === suggestion.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Lightbulb className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No Pending Suggestions</h3>
                  <p className="text-sm text-muted-foreground mt-2 mb-4">
                    Click "Get Suggestions" to have AI analyze your data
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="applied">
              {appliedSuggestions.length > 0 ? (
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-3">
                    {appliedSuggestions.map(suggestion => (
                      <AISuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onApply={applySuggestion}
                        onDismiss={dismissSuggestion}
                        onInfo={viewSuggestionDetails}
                        isApplying={false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No suggestions have been applied yet</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="dismissed">
              {dismissedSuggestions.length > 0 ? (
                <ScrollArea className="h-[350px] pr-4">
                  <div className="space-y-3">
                    {dismissedSuggestions.map(suggestion => (
                      <AISuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onApply={applySuggestion}
                        onDismiss={dismissSuggestion}
                        onInfo={viewSuggestionDetails}
                        isApplying={false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <p>No suggestions have been dismissed</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Suggestion details dialog */}
      <Dialog open={!!selectedSuggestion} onOpenChange={() => setSelectedSuggestion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Suggestion Details</DialogTitle>
            <DialogDescription>
              Detailed information about this suggestion
            </DialogDescription>
          </DialogHeader>
          
          {selectedSuggestion && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Title</h3>
                <p>{selectedSuggestion.title}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Description</h3>
                <p>{selectedSuggestion.description}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Type</h3>
                <p className="capitalize">{selectedSuggestion.type}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Confidence</h3>
                <p>{selectedSuggestion.confidence}%</p>
              </div>
              
              <div>
                <h3 className="font-medium">Operation</h3>
                <pre className="bg-muted p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(selectedSuggestion.operation, null, 2)}
                </pre>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedSuggestion(null)}>
                  Close
                </Button>
                <Button 
                  onClick={() => {
                    applySuggestion(selectedSuggestion);
                    setSelectedSuggestion(null);
                  }}
                  disabled={selectedSuggestion.status !== 'pending' || isApplyingSuggestion !== null}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}