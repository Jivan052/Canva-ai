import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyzeData, AnalysisRequest, InsightResult, getSampleInsights } from '@/utils/deepseekApi';
import { useToast } from '@/hooks/use-toast';

export type AnalysisStatus = 'idle' | 'loading' | 'analyzing' | 'complete' | 'error';

interface UseDataAnalysisOptions {
  onSuccess?: (insights: InsightResult[]) => void;
}

export function useDataAnalysis(options?: UseDataAnalysisOptions) {
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [insights, setInsights] = useState<InsightResult[]>([]);
  const { toast } = useToast();

  const simulateProgress = () => {
    setAnalysisStatus('analyzing');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 10) + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  };
  

  const { refetch, isLoading, isError } = useQuery({
    queryKey: ['dataAnalysis'],
    queryFn: async () => {
      const request: AnalysisRequest = {
        data: [],
        dataType: 'finance',
      };
      
      const cleanupProgress = simulateProgress();
      
      try {
        const results = await analyzeData(request);
        
        setProgress(100);
        setAnalysisStatus('complete');
        setInsights(results);
        
        if (options?.onSuccess) {
          options.onSuccess(results);
        }
        
        toast({
          title: "Analysis complete",
          description: "AI has generated insights from your data",
        });
        
        return results;
      } catch (error) {
        setAnalysisStatus('error');
        toast({
          title: "Analysis failed",
          description: "There was an issue analyzing your data",
          variant: "destructive"
        });
        throw error;
      } finally {
        cleanupProgress();
      }
    },
    enabled: false,
  });

  const analyzeWithFile = async (file: File) => {
    setAnalysisStatus('loading');
    toast({
      title: "Processing data",
      description: `Analyzing ${file.name}`,
    });
    
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  
  const analyzeWithGoogleSheet = async (url: string) => {
    setAnalysisStatus('loading');
    toast({
      title: "Connecting to Google Sheet",
      description: "Preparing to analyze your data",
    });
    
    setTimeout(() => {
      refetch();
    }, 1000);
  };
  
  return {
    analyzeWithFile,
    analyzeWithGoogleSheet,
    analysisStatus,
    progress,
    insights,
    isLoading: isLoading || analysisStatus === 'loading' || analysisStatus === 'analyzing',
    isError,
    reset: () => {
      setAnalysisStatus('idle');
      setProgress(0);
      setInsights([]);
    }
  };
}
