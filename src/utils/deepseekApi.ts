
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with proper error handling
let supabase: ReturnType<typeof createClient> | null = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized successfully');
  } else {
    console.warn('Supabase credentials not found in environment variables');
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
}

export interface AnalysisRequest {
  data: any[];
  dataType: 'finance' | 'sales' | 'marketing' | 'operations';
  analysisGoal?: string;
}

export interface InsightResult {
  title: string;
  description: string;
  type: "insight" | "anomaly" | "trend-up" | "trend-down";
  metric?: string;
  value?: string | number;
  change?: string | number;
  confidenceScore?: number;
}

export async function analyzeData(request: AnalysisRequest): Promise<InsightResult[]> {
  try {
    // Check if Supabase is initialized before attempting to use it
    if (!supabase) {
      console.warn('Supabase client not initialized, falling back to sample insights');
      return getSampleInsights();
    }

    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('analyze-data', {
      body: request
    });

    if (error) {
      console.error('Error calling analyze-data function:', error);
      throw new Error('Failed to analyze data');
    }

    return data as InsightResult[];
  } catch (error) {
    console.error('Error in analyzeData:', error);
    // Return sample insights for fallback
    return getSampleInsights();
  }
}

export function getSampleInsights(): InsightResult[] {
  return [
    {
      title: "Revenue pattern shows strong seasonality",
      description: "Your data indicates a consistent 23% increase in Q4 revenue compared to other quarters over the past two years.",
      type: "insight",
      metric: "Q4 Revenue Lift",
      value: "23%",
      confidenceScore: 0.92
    },
    {
      title: "Sales growth outpacing market average",
      description: "Your year-over-year sales growth of 18% exceeds industry average of 7.2% by a significant margin.",
      type: "trend-up",
      metric: "YoY Growth",
      value: "18%",
      change: 10.8,
      confidenceScore: 0.89
    },
    {
      title: "Customer retention rate anomaly",
      description: "April 2024 shows an unexpected 8.5% drop in customer retention, deviating from the historical average.",
      type: "anomaly",
      metric: "Retention Drop",
      value: "-8.5%",
      confidenceScore: 0.87
    },
    {
      title: "Marketing efficiency declining",
      description: "Cost per acquisition has increased by 12% while conversion rates decreased by 3.2% over the last quarter.",
      type: "trend-down",
      metric: "CPA Change",
      value: "+12%",
      change: -15.2,
      confidenceScore: 0.91
    }
  ];
}
