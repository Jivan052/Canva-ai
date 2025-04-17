import { createContext, useContext, useState, ReactNode } from "react";

export interface Dataset {
  name: string;
  columns: string[];
  data: any[][];
  originalData?: any[][];
}

interface DatasetContextType {
  currentDataset: Dataset | null;
  setCurrentDataset: (dataset: Dataset | null) => void;
  updateDataset: (dataset: Dataset) => void;
  resetToOriginal: () => void;
}

const DatasetContext = createContext<DatasetContextType | undefined>(undefined);

export function DatasetProvider({ children }: { children: ReactNode }) {
  const [currentDataset, setCurrentDataset] = useState<Dataset | null>(null);
  
  const updateDataset = (dataset: Dataset) => {
    // Store the original data if this is a new dataset
    if (!dataset.originalData) {
      dataset.originalData = [...dataset.data];
    }
    setCurrentDataset(dataset);
    // You might want to save this to localStorage or your backend
  };
  
  const resetToOriginal = () => {
    if (currentDataset?.originalData) {
      setCurrentDataset({
        ...currentDataset,
        data: [...currentDataset.originalData]
      });
    }
  };
  
  return (
    <DatasetContext.Provider value={{ currentDataset, setCurrentDataset, updateDataset, resetToOriginal }}>
      {children}
    </DatasetContext.Provider>
  );
}

export function useDataset() {
  const context = useContext(DatasetContext);
  if (context === undefined) {
    throw new Error("useDataset must be used within a DatasetProvider");
  }
  return context;
}