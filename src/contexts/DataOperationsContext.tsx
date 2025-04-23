import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataManager, DataOperation, DataState } from '@/lib/data-processing/dataManager';

interface DataOperationsContextType {
  dataManager: DataManager | null;
  data: Record<string, any>[];
  columns: string[];
  operationHistory: DataOperation[];
  currentOperationIndex: number;
  initializeData: (data: Record<string, any>[]) => void;
  applyOperation: (
    type: string, 
    name: string, 
    params: Record<string, any>, 
    processFn: (data: Record<string, any>[]) => Record<string, any>[]
  ) => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isInitialized: boolean;
}

const DataOperationsContext = createContext<DataOperationsContextType | undefined>(undefined);

export function DataOperationsProvider({ children }: { children: React.ReactNode }) {
  const [dataManager, setDataManager] = useState<DataManager | null>(null);
  const [state, setState] = useState<DataState>({
    columns: [],
    columnTypes: {},
    data: [],
    operationHistory: [],
    currentOperationIndex: -1
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data manager with data
  const initializeData = (data: Record<string, any>[]) => {
    const manager = new DataManager(data);
    setDataManager(manager);
    setState(manager.getState());
    setIsInitialized(true);
  };

  // Apply an operation to the data
  const applyOperation = (
    type: string,
    name: string,
    params: Record<string, any>,
    processFn: (data: Record<string, any>[]) => Record<string, any>[]
  ) => {
    if (dataManager) {
      dataManager.applyOperation(type, name, params, processFn);
      setState(dataManager.getState());
    }
  };

  // Undo the last operation
  const undo = () => {
    if (dataManager && dataManager.canUndo()) {
      dataManager.undo();
      setState(dataManager.getState());
    }
  };

  // Redo the previously undone operation
  const redo = () => {
    if (dataManager && dataManager.canRedo()) {
      dataManager.redo();
      setState(dataManager.getState());
    }
  };

  // Reset to original data
  const reset = () => {
    if (dataManager) {
      dataManager.reset();
      setState(dataManager.getState());
    }
  };

  return (
    <DataOperationsContext.Provider
      value={{
        dataManager,
        data: state.data,
        columns: state.columns,
        operationHistory: state.operationHistory,
        currentOperationIndex: state.currentOperationIndex,
        initializeData,
        applyOperation,
        undo,
        redo,
        reset,
        canUndo: dataManager?.canUndo() || false,
        canRedo: dataManager?.canRedo() || false,
        isInitialized
      }}
    >
      {children}
    </DataOperationsContext.Provider>
  );
}

export function useDataOperations() {
  const context = useContext(DataOperationsContext);
  
  if (context === undefined) {
    throw new Error('useDataOperations must be used within a DataOperationsProvider');
  }
  
  return context;
}