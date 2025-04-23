/**
 * Helper functions for data operations
 */

/**
 * Get a sample of rows from data
 * @param data Array of data objects
 * @param sampleSize Number of rows to sample
 * @returns Sampled rows
 */
export function getSampleRows(
  data: Record<string, any>[],
  sampleSize: number = 5
): Record<string, any>[] {
  if (data.length <= sampleSize) {
    return [...data];
  }
  
  // Take first and last rows plus some from the middle
  const first = data.slice(0, Math.ceil(sampleSize / 2));
  const last = data.slice(-Math.floor(sampleSize / 2));
  
  return [...first, ...last];
}

/**
 * Get column statistics for numeric columns
 * @param data Array of data objects
 * @param columns Columns to analyze (if not provided, all numeric columns are analyzed)
 * @returns Object with statistics for each column
 */
export function getColumnStats(
  data: Record<string, any>[],
  columns?: string[]
): Record<string, { min: number, max: number, mean: number, median: number, nullCount: number, type: string }> {
  if (data.length === 0) return {};
  
  const allColumns = Object.keys(data[0]);
  const columnsToProcess = columns || allColumns;
  
  const result: Record<string, any> = {};
  
  for (const column of columnsToProcess) {
    // Extract values from the column
    const values = data.map(row => row[column]);
    
    // Count null values
    const nullCount = values.filter(val => val === null || val === undefined || val === '').length;
    
    // Determine most likely type
    const type = inferColumnType(values);
    
    // Filter out non-numeric values if it's a numeric column
    if (type === 'number') {
      const numericValues = values
        .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
        .map(val => Number(val));
      
      // Skip if no numeric values
      if (numericValues.length === 0) {
        result[column] = { 
          min: null, 
          max: null, 
          mean: null, 
          median: null, 
          nullCount, 
          type 
        };
        continue;
      }
      
      // Calculate statistics
      const min = Math.min(...numericValues);
      const max = Math.max(...numericValues);
      const sum = numericValues.reduce((acc, val) => acc + val, 0);
      const mean = sum / numericValues.length;
      
      // Calculate median
      const sorted = [...numericValues].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
      
      result[column] = { min, max, mean, median, nullCount, type };
    } else {
      // For non-numeric columns, just record null count and type
      result[column] = { 
        min: null, 
        max: null, 
        mean: null, 
        median: null, 
        nullCount,
        type 
      };
    }
  }
  
  return result;
}

/**
 * Infer the most likely data type for a column
 * @param values Array of values from a column
 * @returns Inferred data type
 */
export function inferColumnType(values: any[]): string {
  // Filter out nulls and empty values
  const nonEmptyValues = values.filter(val => val !== null && val !== undefined && val !== '');
  
  if (nonEmptyValues.length === 0) return 'unknown';
  
  // Sample up to 100 values for faster processing
  const sampleValues = nonEmptyValues.slice(0, 100);
  
  // Check if all values are booleans
  const booleanValues = ['true', 'false', true, false];
  if (sampleValues.every(val => 
    typeof val === 'boolean' || 
    (typeof val === 'string' && booleanValues.includes(val.toLowerCase()))
  )) {
    return 'boolean';
  }
  
  // Check if all values are numbers
  if (sampleValues.every(val => !isNaN(Number(val)))) {
    return 'number';
  }
  
  // Check if all values are valid dates
  if (sampleValues.every(val => {
    if (typeof val === 'object' && val instanceof Date) return true;
    if (typeof val === 'number') return false; // Avoid treating numbers as timestamps
    const date = new Date(val);
    return !isNaN(date.getTime()) && String(val).length > 5; // Basic heuristic to avoid misidentifying numbers as dates
  })) {
    return 'date';
  }
  
  // Default to string
  return 'string';
}

/**
 * Get unique values for a column
 * @param data Array of data objects
 * @param column Column to get unique values for
 * @param limit Maximum number of unique values to return
 * @returns Array of unique values
 */
export function getUniqueValues(
  data: Record<string, any>[],
  column: string,
  limit: number = 100
): any[] {
  if (data.length === 0) return [];
  
  const values = data.map(row => row[column]);
  const uniqueValues = Array.from(new Set(values));
  
  return uniqueValues.slice(0, limit);
}

/**
 * Calculate the frequency distribution of values in a column
 * @param data Array of data objects
 * @param column Column to analyze
 * @param limit Maximum number of categories to return
 * @returns Frequency distribution object
 */
export function getValueFrequency(
  data: Record<string, any>[],
  column: string,
  limit: number = 10
): { value: any, count: number, percentage: number }[] {
  if (data.length === 0) return [];
  
  const values = data.map(row => row[column]);
  const counts: Record<string, number> = {};
  
  // Count occurrences
  values.forEach(value => {
    const key = value === null || value === undefined ? 'null' : String(value);
    counts[key] = (counts[key] || 0) + 1;
  });
  
  // Convert to array and sort by frequency
  const sortedFrequencies = Object.entries(counts)
    .map(([value, count]) => ({
      value: value === 'null' ? null : value,
      count,
      percentage: (count / values.length) * 100
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
  
  return sortedFrequencies;
}

/**
 * Detect data quality issues
 * @param data Array of data objects
 * @returns Object with detected issues
 */
export function detectDataIssues(
  data: Record<string, any>[]
): {
  nullValues: Record<string, number>;
  duplicateRows: number;
  inconsistentTypes: string[];
  outliers: Record<string, number[]>;
} {
  if (data.length === 0) {
    return {
      nullValues: {},
      duplicateRows: 0,
      inconsistentTypes: [],
      outliers: {}
    };
  }
  
  const columns = Object.keys(data[0]);
  const result = {
    nullValues: {} as Record<string, number>,
    duplicateRows: 0,
    inconsistentTypes: [] as string[],
    outliers: {} as Record<string, number[]>
  };
  
  // Check for null values
  columns.forEach(col => {
    const nullCount = data.filter(row => 
      row[col] === null || 
      row[col] === undefined || 
      row[col] === ''
    ).length;
    
    if (nullCount > 0) {
      result.nullValues[col] = nullCount;
    }
  });
  
  // Check for duplicate rows
  const seen = new Set();
  data.forEach(row => {
    const rowKey = JSON.stringify(row);
    if (seen.has(rowKey)) {
      result.duplicateRows++;
    } else {
      seen.add(rowKey);
    }
  });
  
  // Check for inconsistent types
  columns.forEach(col => {
    const types = new Set<string>();
    const valuesWithTypes = data
      .filter(row => row[col] !== null && row[col] !== undefined && row[col] !== '')
      .slice(0, 100) // Sample for performance
      .map(row => {
        // Initial type
        let type: string = typeof row[col];
        const val = row[col];
        
        // Refined type detection
        if (type === 'string') {
          if (!isNaN(Number(val))) {
            // Check if it's a numeric string
            type = 'number';
          } else if (!isNaN(Date.parse(val)) && val.length > 5) {
            // Check if it's a date string (basic validation)
            type = 'date';
          } else if (['true', 'false'].includes(val.toLowerCase())) {
            // Check if it's a boolean string
            type = 'boolean';
          }
        } else if (type === 'object' && val instanceof Date) {
          type = 'date';
        }
        
        return { value: val, type };
      });
    
    // Record all unique types found
    valuesWithTypes.forEach(({ type }) => types.add(type));
    
    // If we have multiple types (excluding null/undefined), mark as inconsistent
    if (types.size > 1) {
      result.inconsistentTypes.push(col);
    }
  });
  
  // Check for outliers in numeric columns
  columns.forEach(col => {
    // Only check columns that appear to be numeric
    const numericValues = data
      .map(row => row[col])
      .filter(val => val !== null && val !== undefined && val !== '' && !isNaN(Number(val)))
      .map(Number);
    
    if (numericValues.length > 10) { // Only check if sufficient data
      // Calculate quartiles and IQR
      const sorted = [...numericValues].sort((a, b) => a - b);
      const q1Index = Math.floor(sorted.length * 0.25);
      const q3Index = Math.floor(sorted.length * 0.75);
      const q1 = sorted[q1Index];
      const q3 = sorted[q3Index];
      const iqr = q3 - q1;
      
      // Use 1.5 * IQR rule to detect outliers
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;
      
      // Find values outside bounds
      const outliers = numericValues.filter(val => val < lowerBound || val > upperBound);
      
      if (outliers.length > 0) {
        // Only store up to 100 outliers to avoid excessive memory usage
        result.outliers[col] = outliers.slice(0, 100);
      }
    }
  });
  
  return result;
}

/**
 * Format a value for display based on its type
 * @param value Value to format
 * @param type Type of value
 * @returns Formatted value as a string
 */
export function formatValueForDisplay(value: any, type?: string): string {
  if (value === null || value === undefined) {
    return '—';
  }
  
  // Infer type if not provided
  const valueType = type || typeof value;
  
  switch (valueType) {
    case 'number':
      // Format numbers with comma separators and reasonable precision
      return Number.isInteger(value)
        ? value.toLocaleString()
        : value.toLocaleString(undefined, { 
            maximumFractionDigits: 4,
            minimumFractionDigits: 0
          });
    
    case 'boolean':
      return value ? 'True' : 'False';
    
    case 'date':
      // Try to parse as date if it's not already
      const date = value instanceof Date ? value : new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleString();
      }
      return String(value);
    
    case 'object':
      // Format objects as JSON
      return JSON.stringify(value);
    
    default:
      // For strings and other types
      return String(value);
  }
}

/**
 * Generate a summary of a dataset
 * @param data Array of data objects
 * @returns Summary object with key statistics
 */
export function generateDataSummary(
  data: Record<string, any>[]
): {
  rowCount: number;
  columnCount: number;
  nullPercentage: number;
  duplicatePercentage: number;
  columnTypes: Record<string, string>;
} {
  if (data.length === 0) {
    return {
      rowCount: 0,
      columnCount: 0,
      nullPercentage: 0,
      duplicatePercentage: 0,
      columnTypes: {}
    };
  }
  
  const columns = Object.keys(data[0]);
  const columnCount = columns.length;
  const rowCount = data.length;
  
  // Count nulls across all cells
  let nullCount = 0;
  const totalCells = rowCount * columnCount;
  
  // Infer column types
  const columnTypes: Record<string, string> = {};
  
  columns.forEach(col => {
    const values = data.map(row => row[col]);
    
    // Count nulls in this column
    nullCount += values.filter(val => 
      val === null || val === undefined || val === ''
    ).length;
    
    // Infer column type
    columnTypes[col] = inferColumnType(values);
  });
  
  // Count duplicates
  const uniqueRows = new Set(data.map(row => JSON.stringify(row)));
  const duplicateCount = rowCount - uniqueRows.size;
  
  return {
    rowCount,
    columnCount,
    nullPercentage: (nullCount / totalCells) * 100,
    duplicatePercentage: (duplicateCount / rowCount) * 100,
    columnTypes
  };
}

/**
 * Compare two datasets and identify differences
 * @param originalData Original dataset
 * @param newData Modified dataset
 * @returns Summary of differences
 */
export function compareDatasets(
  originalData: Record<string, any>[],
  newData: Record<string, any>[]
): {
  rowDifference: number;
  addedColumns: string[];
  removedColumns: string[];
  modifiedCells: number;
} {
  if (originalData.length === 0 && newData.length === 0) {
    return {
      rowDifference: 0,
      addedColumns: [],
      removedColumns: [],
      modifiedCells: 0
    };
  }
  
  // Get column lists
  const originalColumns = originalData.length > 0 ? Object.keys(originalData[0]) : [];
  const newColumns = newData.length > 0 ? Object.keys(newData[0]) : [];
  
  // Find column differences
  const addedColumns = newColumns.filter(col => !originalColumns.includes(col));
  const removedColumns = originalColumns.filter(col => !newColumns.includes(col));
  
  // Row difference
  const rowDifference = newData.length - originalData.length;
  
  // Count modified cells in common columns
  let modifiedCells = 0;
  const commonColumns = originalColumns.filter(col => newColumns.includes(col));
  
  // Only compare up to the length of the shorter dataset
  const minLength = Math.min(originalData.length, newData.length);
  
  for (let i = 0; i < minLength; i++) {
    for (const col of commonColumns) {
      if (JSON.stringify(originalData[i][col]) !== JSON.stringify(newData[i][col])) {
        modifiedCells++;
      }
    }
  }
  
  return {
    rowDifference,
    addedColumns,
    removedColumns,
    modifiedCells
  };
}