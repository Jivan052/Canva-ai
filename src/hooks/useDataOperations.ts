import { useState, useCallback } from 'react';
import { useDataOperations as useDataOperationsContext } from '@/contexts/DataOperationsContext';
import * as cleaningOps from '@/lib/data-processing/cleaning';
import * as transformationOps from '@/lib/data-processing/transformation';

export function useDataOperations() {
  const context = useDataOperationsContext();
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastOperation, setLastOperation] = useState<{
    type: string;
    name: string;
    successful: boolean;
    message?: string;
  } | null>(null);

  // Helper to execute operations with loading state
  const executeOperation = useCallback((
    type: string,
    name: string,
    operation: () => void
  ) => {
    setIsProcessing(true);
    setLastOperation(null);
    
    try {
      operation();
      setLastOperation({ type, name, successful: true });
    } catch (error) {
      console.error(`Error in operation ${name}:`, error);
      setLastOperation({ 
        type, 
        name, 
        successful: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      });
    } finally {
      setIsProcessing(false);
    }
  }, []);

  // Data cleaning operations
  const cleanData = {
    removeDuplicates: (keys?: string[]) => {
      executeOperation('clean', 'Remove Duplicates', () => {
        context.applyOperation(
          'clean',
          'Remove Duplicates',
          { keys },
          (data) => cleaningOps.removeDuplicates(data, keys)
        );
      });
    },

    trimWhitespace: (columns?: string[]) => {
      executeOperation('clean', 'Trim Whitespace', () => {
        context.applyOperation(
          'clean',
          'Trim Whitespace',
          { columns },
          (data) => cleaningOps.trimWhitespace(data, columns)
        );
      });
    },

    removeNullRows: (columns?: string[]) => {
      executeOperation('clean', 'Remove Null Rows', () => {
        context.applyOperation(
          'clean',
          'Remove Null Rows',
          { columns },
          (data) => cleaningOps.removeNullRows(data, columns)
        );
      });
    },

    dropEmptyColumns: () => {
      executeOperation('clean', 'Drop Empty Columns', () => {
        context.applyOperation(
          'clean',
          'Drop Empty Columns',
          {},
          (data) => cleaningOps.dropEmptyColumns(data)
        );
      });
    },

    fillMissingValues: (
      columns: string[],
      fillMethod: 'value' | 'mean' | 'median' | 'mode',
      fillValue?: any
    ) => {
      executeOperation('clean', 'Fill Missing Values', () => {
        context.applyOperation(
          'clean',
          'Fill Missing Values',
          { columns, fillMethod, fillValue },
          (data) => cleaningOps.fillMissingValues(data, columns, fillMethod, fillValue)
        );
      });
    },

    standardizeTextCase: (
      columns: string[],
      caseType: 'uppercase' | 'lowercase' | 'titlecase'
    ) => {
      executeOperation('clean', 'Standardize Text Case', () => {
        context.applyOperation(
          'clean',
          'Standardize Text Case',
          { columns, caseType },
          (data) => cleaningOps.standardizeTextCase(data, columns, caseType)
        );
      });
    },

    removeSpecialCharacters: (
      columns: string[],
      pattern?: string
    ) => {
      executeOperation('clean', 'Remove Special Characters', () => {
        context.applyOperation(
          'clean',
          'Remove Special Characters',
          { columns, pattern },
          (data) => cleaningOps.removeSpecialCharacters(data, columns, pattern)
        );
      });
    },

    findAndReplace: (
      columns: string[],
      findValue: string,
      replaceValue: string,
      caseSensitive: boolean = true
    ) => {
      executeOperation('clean', 'Find and Replace', () => {
        context.applyOperation(
          'clean',
          'Find and Replace',
          { columns, findValue, replaceValue, caseSensitive },
          (data) => cleaningOps.findAndReplace(data, columns, findValue, replaceValue, caseSensitive)
        );
      });
    },
  };

  // Data transformation operations
  const transformData = {
    renameColumns: (renameMap: Record<string, string>) => {
      executeOperation('transform', 'Rename Columns', () => {
        context.applyOperation(
          'transform',
          'Rename Columns',
          { renameMap },
          (data) => transformationOps.renameColumns(data, renameMap)
        );
      });
    },

    reorderColumns: (columnOrder: string[]) => {
      executeOperation('transform', 'Reorder Columns', () => {
        context.applyOperation(
          'transform',
          'Reorder Columns',
          { columnOrder },
          (data) => transformationOps.reorderColumns(data, columnOrder)
        );
      });
    },

    splitColumn: (
      columnToSplit: string,
      delimiter: string,
      newColumnNames: string[],
      keepOriginal: boolean = false
    ) => {
      executeOperation('transform', 'Split Column', () => {
        context.applyOperation(
          'transform',
          'Split Column',
          { columnToSplit, delimiter, newColumnNames, keepOriginal },
          (data) => transformationOps.splitColumn(data, columnToSplit, delimiter, newColumnNames, keepOriginal)
        );
      });
    },

    mergeColumns: (
      columnsToMerge: string[],
      newColumnName: string,
      delimiter: string = ' ',
      keepOriginals: boolean = false
    ) => {
      executeOperation('transform', 'Merge Columns', () => {
        context.applyOperation(
          'transform',
          'Merge Columns',
          { columnsToMerge, newColumnName, delimiter, keepOriginals },
          (data) => transformationOps.mergeColumns(data, columnsToMerge, newColumnName, delimiter, keepOriginals)
        );
      });
    },

    createCalculatedColumn: (
      newColumnName: string,
      formula: (row: Record<string, any>) => any
    ) => {
      executeOperation('transform', 'Create Calculated Column', () => {
        context.applyOperation(
          'transform',
          'Create Calculated Column',
          { newColumnName },
          (data) => transformationOps.createCalculatedColumn(data, newColumnName, formula)
        );
      });
    },

    sortData: (
      sortColumns: Array<{ column: string, direction: 'asc' | 'desc' }>
    ) => {
      executeOperation('transform', 'Sort Data', () => {
        context.applyOperation(
          'transform',
          'Sort Data',
          { sortColumns },
          (data) => transformationOps.sortData(data, sortColumns)
        );
      });
    },

      roundValues: (
    roundConfigs: Array<{ column: string, decimals: number }>
  ) => {
    executeOperation('transform', 'Round Values', () => {
      context.applyOperation(
        'transform',
        'Round Values',
        { roundConfigs },
        (data) => transformationOps.roundValues(data, roundConfigs)
      );
    });
  },

    filterData: (
      filters: Array<{
        column: string;
        operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan';
        value: any;
      }>
    ) => {
      executeOperation('transform', 'Filter Data', () => {
        context.applyOperation(
          'transform',
          'Filter Data',
          { filters },
          (data) => transformationOps.filterData(data, filters)
        );
      });
    }
  };

  return {
    // Export context values
    data: context.data,
    columns: context.columns,
    operationHistory: context.operationHistory,
    isInitialized: context.isInitialized,
    initializeData: context.initializeData,
    
    // History control
    undo: context.undo,
    redo: context.redo,
    reset: context.reset,
    canUndo: context.canUndo,
    canRedo: context.canRedo,
    
    // Operation sets
    clean: cleanData,
    transform: transformData,
    
    // Status
    isProcessing,
    lastOperation
  };
}