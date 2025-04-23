/**
 * Core data management functionality for data operations
 */

import { v4 as uuidv4 } from 'uuid';

export interface ColumnType {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'unknown';
}

export interface DataOperation {
  id: string;
  type: string;
  name: string;
  params: Record<string, any>;
  timestamp: number;
}

export interface DataState {
  columns: string[];
  columnTypes: Record<string, ColumnType>;
  data: Record<string, any>[];
  operationHistory: DataOperation[];
  currentOperationIndex: number;
}

export class DataManager {
  private state: DataState;
  private originalData: Record<string, any>[];
  private maxHistoryLength = 50;

  constructor(data: Record<string, any>[]) {
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    
    this.originalData = [...data];
    this.state = {
      columns,
      columnTypes: this.inferColumnTypes(data),
      data: [...data],
      operationHistory: [],
      currentOperationIndex: -1
    };
  }

  /**
   * Infer column types from data
   */
  private inferColumnTypes(data: Record<string, any>[]): Record<string, ColumnType> {
    const columnTypes: Record<string, ColumnType> = {};
    
    if (data.length === 0) return columnTypes;
    
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    
    for (const col of columns) {
      // Sample up to 100 non-null values for type detection
      const samples = data
        .slice(0, Math.min(data.length, 100))
        .map(row => row[col])
        .filter(val => val !== null && val !== undefined);
      
      const type = this.detectType(samples);
      
      columnTypes[col] = {
        name: col,
        type
      };
    }
    
    return columnTypes;
  }

  /**
   * Detect data type from a sample of values
   */
  private detectType(samples: any[]): 'string' | 'number' | 'boolean' | 'date' | 'unknown' {
    if (samples.length === 0) return 'unknown';
    
    // Check if all values are numbers
    if (samples.every(val => !isNaN(Number(val)))) {
      return 'number';
    }
    
    // Check if all values are booleans
    if (samples.every(val => typeof val === 'boolean' || val === 'true' || val === 'false')) {
      return 'boolean';
    }
    
    // Check if all values are valid dates
    if (samples.every(val => !isNaN(Date.parse(String(val))))) {
      return 'date';
    }
    
    // Default to string
    return 'string';
  }

  /**
   * Apply an operation to the current data
   */
  applyOperation(type: string, name: string, params: Record<string, any>, processFn: (data: Record<string, any>[]) => Record<string, any>[]): void {
    // Create a new operation
    const operation: DataOperation = {
      id: uuidv4(),
      type,
      name,
      params,
      timestamp: Date.now()
    };

    // Apply the operation
    const newData = processFn([...this.state.data]);
    
    // Update column list (might have changed)
    const columns = newData.length > 0 ? Object.keys(newData[0]) : [];
    
    // Trim history if we're not at the end
    const newHistory = this.state.operationHistory.slice(0, this.state.currentOperationIndex + 1);
    
    // Add the new operation and update state
    this.state = {
      ...this.state,
      data: newData,
      columns,
      columnTypes: this.inferColumnTypes(newData),
      operationHistory: [...newHistory, operation].slice(-this.maxHistoryLength),
      currentOperationIndex: Math.min(newHistory.length, this.maxHistoryLength - 1)
    };
  }

  /**
   * Undo the last operation
   */
  undo(): boolean {
    if (this.state.currentOperationIndex < 0) {
      return false;
    }

    // Decrement the current operation index
    this.state.currentOperationIndex--;
    
    // Re-apply all operations up to the current index
    this.reapplyOperations();
    
    return true;
  }

  /**
   * Redo the previously undone operation
   */
  redo(): boolean {
    if (this.state.currentOperationIndex >= this.state.operationHistory.length - 1) {
      return false;
    }

    // Increment the current operation index
    this.state.currentOperationIndex++;
    
    // Re-apply all operations up to the current index
    this.reapplyOperations();
    
    return true;
  }

  /**
   * Reapply all operations up to the current index
   */
  private reapplyOperations(): void {
    // Start with original data
    let processedData = [...this.originalData];
    
    // Apply each operation in sequence
    for (let i = 0; i <= this.state.currentOperationIndex; i++) {
      const operation = this.state.operationHistory[i];
      // Apply the operation (this would dispatch to specific handler functions)
      processedData = this.processOperation(processedData, operation);
    }
    
    // Update state with the reprocessed data
    this.state.data = processedData;
    this.state.columns = processedData.length > 0 ? Object.keys(processedData[0]) : [];
    this.state.columnTypes = this.inferColumnTypes(processedData);
  }

  /**
   * Process a specific operation type
   * This would dispatch to various operation handlers
   */
  private processOperation(data: Record<string, any>[], operation: DataOperation): Record<string, any>[] {
    // This is a placeholder - actual implementation would dispatch to specific handlers
    // based on the operation.type
    return data;
  }

  /**
   * Reset to original data
   */
  reset(): void {
    this.state.data = [...this.originalData];
    this.state.columns = this.state.data.length > 0 ? Object.keys(this.state.data[0]) : [];
    this.state.columnTypes = this.inferColumnTypes(this.state.data);
    this.state.operationHistory = [];
    this.state.currentOperationIndex = -1;
  }

  /**
   * Get the current state
   */
  getState(): DataState {
    return { ...this.state };
  }

  /**
   * Get the current data
   */
  getData(): Record<string, any>[] {
    return [...this.state.data];
  }

  /**
   * Get operation history
   */
  getHistory(): DataOperation[] {
    return [...this.state.operationHistory];
  }

  /**
   * Can undo?
   */
  canUndo(): boolean {
    return this.state.currentOperationIndex >= 0;
  }

  /**
   * Can redo?
   */
  canRedo(): boolean {
    return this.state.currentOperationIndex < this.state.operationHistory.length - 1;
  }
}