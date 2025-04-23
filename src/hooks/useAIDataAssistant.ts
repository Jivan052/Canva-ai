import { useState, useEffect, useCallback } from 'react';
import { useDataOperations } from '@/hooks/useDataOperations';
import { 
  AISuggestion, 
  generateSuggestions 
} from '@/lib/data-processing/aiSuggestions';
import { 
  analyzeColumn,
  detectRelationships,
  generateAnalysisRecommendations,
  calculateDataQualityScore
} from '@/lib/utils/aiHelpers';
import { toast } from '@/components/ui/use-toast';

export interface AIAssistantState {
  isAnalyzing: boolean;
  lastAnalyzed: Date | null;
  suggestions: AISuggestion[];
  dataQualityScore: {
    overallScore: number;
    completeness: number;
    consistency: number;
    uniqueness: number;
  };
  columnAnalysis: Record<string, ReturnType<typeof analyzeColumn>>;
  relationships: ReturnType<typeof detectRelationships>;
  recommendations: ReturnType<typeof generateAnalysisRecommendations>;
}

export function useAIDataAssistant() {
  const { data, columns, isInitialized, clean, transform } = useDataOperations();
  
  // State for AI assistant features
  const [state, setState] = useState<AIAssistantState>({
    isAnalyzing: false,
    lastAnalyzed: null,
    suggestions: [],
    dataQualityScore: {
      overallScore: 0,
      completeness: 0,
      consistency: 0,
      uniqueness: 0
    },
    columnAnalysis: {},
    relationships: {
      correlations: [],
      functionalDependencies: []
    },
    recommendations: {
      recommendedCharts: [],
      suggestedAnalyses: [],
      dataQualitySuggestions: []
    }
  });
  
  // Run all AI analysis on the data
  const analyzeData = useCallback(async () => {
    if (!isInitialized || !data.length) {
      toast({
        title: "No Data Available",
        description: "Please load data before running AI analysis.",
        variant: "destructive",
      });
      return;
    }
    
    setState(prev => ({ ...prev, isAnalyzing: true }));
    
    try {
      // Run all analyses in parallel for efficiency
      const [
        suggestions,
        dataQualityScore,
        relationships,
        recommendations
      ] = await Promise.all([
        generateSuggestions(data),
        Promise.resolve(calculateDataQualityScore(data)),
        Promise.resolve(detectRelationships(data)),
        Promise.resolve(generateAnalysisRecommendations(data))
      ]);
      
      // Process column analysis sequentially to avoid overwhelming the CPU
      const columnAnalysis: Record<string, ReturnType<typeof analyzeColumn>> = {};
      for (const column of columns) {
        columnAnalysis[column] = analyzeColumn(data, column);
        // Small delay to keep UI responsive
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      setState(prev => ({
        ...prev,
        isAnalyzing: false,
        lastAnalyzed: new Date(),
        suggestions,
        dataQualityScore,
        columnAnalysis,
        relationships,
        recommendations
      }));
      
      toast({
        title: "AI Analysis Complete",
        description: `Found ${suggestions.length} suggestions and analyzed ${columns.length} columns.`,
      });
    } catch (error) {
      console.error("Error during AI analysis:", error);
      setState(prev => ({ ...prev, isAnalyzing: false }));
      
      toast({
        title: "Analysis Failed",
        description: "An error occurred during AI analysis.",
        variant: "destructive",
      });
    }
  }, [data, columns, isInitialized]);
  
  // Apply a suggested operation to the data
  const applySuggestion = useCallback(async (suggestion: AISuggestion) => {
    try {
      const { name, params } = suggestion.operation;
      
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
          // This would need to be implemented in the DataOperationsContext
          console.warn('Operation not implemented:', name);
          break;
        case 'standardizeDataType':
          // This would need to be implemented
          console.warn('Operation not implemented:', name);
          break;
        case 'trimWhitespace':
          await clean.trimWhitespace(params.columns);
          break;
        case 'standardizeTextCase':
          // Use an existing transform method or log that this operation isn't implemented
          console.warn('Operation not implemented:', name);
          // Alternatively, you could implement a workaround with existing methods
          // For example: await transform.renameColumns({...})
          break;
        case 'handleOutliers':
          // This would need to be implemented
          console.warn('Operation not implemented:', name);
          break;
        default:
          throw new Error(`Unknown operation: ${name}`);
      }
      
      // Update suggestion status
      setState(prev => ({
        ...prev,
        suggestions: prev.suggestions.map(s => 
          s.id === suggestion.id 
            ? { ...s, status: 'applied' as const } 
            : s
        )
      }));
      
      toast({
        title: "Suggestion Applied",
        description: suggestion.title,
      });
      
      return true;
    } catch (error) {
      console.error("Failed to apply suggestion:", error);
      
      toast({
        title: "Operation Failed",
        description: "Failed to apply the suggestion.",
        variant: "destructive",
      });
      
      return false;
    }
  }, [clean, transform]);
  
  // Dismiss a suggestion
  const dismissSuggestion = useCallback((suggestionId: string) => {
    setState(prev => ({
      ...prev,
      suggestions: prev.suggestions.map(s => 
        s.id === suggestionId 
          ? { ...s, status: 'dismissed' as const } 
          : s
      )
    }));
  }, []);
  
  // Get pending suggestions
  const getPendingSuggestions = useCallback(() => {
    return state.suggestions.filter(s => s.status === 'pending');
  }, [state.suggestions]);
  
  // Get applied suggestions
  const getAppliedSuggestions = useCallback(() => {
    return state.suggestions.filter(s => s.status === 'applied');
  }, [state.suggestions]);
  
  // Get dismissed suggestions
  const getDismissedSuggestions = useCallback(() => {
    return state.suggestions.filter(s => s.status === 'dismissed');
  }, [state.suggestions]);
  
  // Auto-analyze when data changes significantly
  useEffect(() => {
    if (isInitialized && data.length > 0) {
      // Only analyze if we haven't done so already or if data has changed significantly
      const shouldAnalyze = 
        !state.lastAnalyzed || 
        state.columnAnalysis && Object.keys(state.columnAnalysis).length !== columns.length;
      
      if (shouldAnalyze && !state.isAnalyzing) {
        analyzeData();
      }
    }
  }, [isInitialized, data.length, columns.length]);
  
  return {
    ...state,
    analyzeData,
    applySuggestion,
    dismissSuggestion,
    getPendingSuggestions,
    getAppliedSuggestions,
    getDismissedSuggestions
  };
}