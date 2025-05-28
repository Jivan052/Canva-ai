// context/InsightContext.tsx
import React, { createContext, useContext, useState } from "react";

export interface Chart {
  chartType: "bar" | "line" | "pie";
  labels: string[];
  data: number[];
  title: string;
  color: string;
}

export interface Metric {
  title: string;
  value: number | string;
  unit?: string;
}

export interface Visualization {
  charts: Chart[];
  metrics: Metric[];
}

export interface Insight {
  insight: string;
  description: string;
  suggestion: string;
  visualization: Visualization;
}

interface InsightContextType {
  dataInsights: Insight[] | null;
  setDataInsights: (data: Insight[]) => void;
}

const InsightContext = createContext<InsightContextType | undefined>(undefined);

export const InsightProvider = ({ children }: { children: React.ReactNode }) => {
  const [insights, setInsights] = useState<Insight[] | null>(null);

  return (
    <InsightContext.Provider value={{ dataInsights: insights, setDataInsights: setInsights }}>
      {children}
    </InsightContext.Provider>
  );
};

export const useInsight = () => {
  const context = useContext(InsightContext);
  if (!context) {
    throw new Error("useInsight must be used within an InsightProvider");
  }
  return context;
};
