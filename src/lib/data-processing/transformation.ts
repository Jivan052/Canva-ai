/**
 * Utility functions for transforming data
 */

/**
 * Rename columns in the dataset
 * @param data The dataset to transform
 * @param renameMap Object mapping old column names to new ones
 * @returns Transformed dataset with renamed columns
 */
export function renameColumns(
  data: Record<string, any>[],
  renameMap: Record<string, string>
): Record<string, any>[] {
  if (!data.length) return [];
  
  return data.map(row => {
    const newRow: Record<string, any> = {};
    
    Object.entries(row).forEach(([key, value]) => {
      const newKey = renameMap[key] || key;
      newRow[newKey] = value;
    });
    
    return newRow;
  });
}

/**
 * Reorder columns in the dataset
 * @param data The dataset to transform
 * @param columnOrder Array of column names in desired order
 * @returns Transformed dataset with reordered columns
 */
export function reorderColumns(
  data: Record<string, any>[],
  columnOrder: string[]
): Record<string, any>[] {
  if (!data.length) return [];
  
  // Get all column names
  const originalColumns = Object.keys(data[0]);
  
  // Validate column order
  const validColumns = columnOrder.filter(col => originalColumns.includes(col));
  
  // Add any missing columns to the end
  const missingColumns = originalColumns.filter(col => !columnOrder.includes(col));
  const finalColumnOrder = [...validColumns, ...missingColumns];
  
  return data.map(row => {
    const newRow: Record<string, any> = {};
    
    finalColumnOrder.forEach(col => {
      if (col in row) {
        newRow[col] = row[col];
      }
    });
    
    return newRow;
  });
}

/**
 * Split a column into multiple columns
 * @param data The dataset to transform
 * @param columnToSplit Column to split
 * @param delimiter String delimiter to split on
 * @param newColumnNames Names for the new columns
 * @param keepOriginal Whether to keep the original column
 * @returns Transformed dataset with split columns
 */
export function splitColumn(
  data: Record<string, any>[],
  columnToSplit: string,
  delimiter: string,
  newColumnNames: string[],
  keepOriginal: boolean = false
): Record<string, any>[] {
  if (!data.length) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    if (columnToSplit in row) {
      const value = String(row[columnToSplit] || '');
      const parts = value.split(delimiter);
      
      // Add new columns
      newColumnNames.forEach((colName, index) => {
        newRow[colName] = parts[index] !== undefined ? parts[index] : '';
      });
      
      // Remove original column if not keeping
      if (!keepOriginal) {
        delete newRow[columnToSplit];
      }
    }
    
    return newRow;
  });
}

/**
 * Merge multiple columns into a single column
 * @param data The dataset to transform
 * @param columnsToMerge Columns to merge
 * @param newColumnName Name for the new merged column
 * @param delimiter String delimiter to join values with
 * @param keepOriginals Whether to keep the original columns
 * @returns Transformed dataset with merged column
 */
export function mergeColumns(
  data: Record<string, any>[],
  columnsToMerge: string[],
  newColumnName: string,
  delimiter: string = ' ',
  keepOriginals: boolean = false
): Record<string, any>[] {
  if (!data.length) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    // Extract values to merge
    const valuesToMerge = columnsToMerge.map(col => 
      row[col] !== null && row[col] !== undefined ? String(row[col]) : ''
    );
    
    // Create merged value
    newRow[newColumnName] = valuesToMerge.join(delimiter);
    
    // Remove original columns if not keeping
    if (!keepOriginals) {
      columnsToMerge.forEach(col => {
        delete newRow[col];
      });
    }
    
    return newRow;
  });
}

/**
 * Create a calculated column based on a formula
 * @param data The dataset to transform
 * @param newColumnName Name for the new calculated column
 * @param formula Function that calculates the new value from a row
 * @returns Transformed dataset with calculated column
 */
export function createCalculatedColumn(
  data: Record<string, any>[],
  newColumnName: string,
  formula: (row: Record<string, any>) => any
): Record<string, any>[] {
  if (!data.length) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    try {
      newRow[newColumnName] = formula(row);
    } catch (error) {
      console.error('Error calculating value:', error);
      newRow[newColumnName] = null;
    }
    
    return newRow;
  });
}

/**
 * Sort data by one or more columns
 * @param data The dataset to transform
 * @param sortColumns Array of column names and sort directions
 * @returns Sorted dataset
 */
export function sortData(
  data: Record<string, any>[],
  sortColumns: Array<{ column: string, direction: 'asc' | 'desc' }>
): Record<string, any>[] {
  if (!data.length || !sortColumns.length) return [...data];
  
  return [...data].sort((a, b) => {
    for (const { column, direction } of sortColumns) {
      const valueA = a[column];
      const valueB = b[column];
      
      // Handle null/undefined values in sorting
      if (valueA === valueB) continue;
      if (valueA === null || valueA === undefined) return direction === 'asc' ? -1 : 1;
      if (valueB === null || valueB === undefined) return direction === 'asc' ? 1 : -1;
      
      // Compare based on type
      let comparison: number;
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        comparison = valueA - valueB;
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        comparison = valueA.localeCompare(valueB);
      } else {
        // Convert to string for mixed types
        comparison = String(valueA).localeCompare(String(valueB));
      }
      
      if (comparison !== 0) {
        return direction === 'asc' ? comparison : -comparison;
      }
    }
    
    return 0;
  });
}

/**
 * Filter data based on column conditions
 * @param data The dataset to filter
 * @param filters Array of filter conditions
 * @returns Filtered dataset
 */
export function filterData(
  data: Record<string, any>[],
  filters: Array<{
    column: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'greaterThan' | 'lessThan';
    value: any;
  }>
): Record<string, any>[] {
  if (!data.length || !filters.length) return [...data];
  
  return data.filter(row => {
    // Row must satisfy all filters (AND condition)
    return filters.every(filter => {
      const { column, operator, value } = filter;
      const cellValue = row[column];
      
      switch (operator) {
        case 'equals':
          return cellValue === value;
          
        case 'notEquals':
          return cellValue !== value;
          
        case 'contains':
          if (typeof cellValue !== 'string') {
            return String(cellValue).includes(String(value));
          }
          return cellValue.includes(String(value));
          
        case 'notContains':
          if (typeof cellValue !== 'string') {
            return !String(cellValue).includes(String(value));
          }
          return !cellValue.includes(String(value));
          
        case 'greaterThan':
          if (cellValue === null || cellValue === undefined) return false;
          return Number(cellValue) > Number(value);
          
        case 'lessThan':
          if (cellValue === null || cellValue === undefined) return false;
          return Number(cellValue) < Number(value);
          
        default:
          return true;
      }
    });
  });
}

/**
 * Standardize text case in columns
 * @param data The dataset to transform
 * @param columns Columns to transform
 * @param caseType Type of case transformation
 * @returns Transformed dataset
 */
export function standardizeTextCase(
  data: Record<string, any>[],
  columns: string[],
  caseType: 'uppercase' | 'lowercase' | 'titlecase'
): Record<string, any>[] {
  if (!data.length) return [];
  
  // Function to convert text to title case
  const toTitleCase = (text: string) => {
    return text.replace(/\w\S*/g, (word) => {
      return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
    });
  };
  
  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (col in row && typeof row[col] === 'string') {
        switch (caseType) {
          case 'uppercase':
            newRow[col] = row[col].toUpperCase();
            break;
          case 'lowercase':
            newRow[col] = row[col].toLowerCase();
            break;
          case 'titlecase':
            newRow[col] = toTitleCase(row[col]);
            break;
        }
      }
    });
    
    return newRow;
  });
}

/**
 * Extract part of a string column based on a regular expression
 * @param data The dataset to transform
 * @param column Column to extract from
 * @param pattern Regular expression pattern with capture groups
 * @param newColumnName Name of the new column to store extracted value
 * @returns Transformed dataset with extraction
 */
export function extractPattern(
  data: Record<string, any>[],
  column: string,
  pattern: string,
  newColumnName: string
): Record<string, any>[] {
  if (!data.length) return [];
  
  try {
    const regex = new RegExp(pattern);
    
    return data.map(row => {
      const newRow = { ...row };
      
      if (column in row && typeof row[column] === 'string') {
        const match = row[column].match(regex);
        newRow[newColumnName] = match && match[1] ? match[1] : null;
      } else {
        newRow[newColumnName] = null;
      }
      
      return newRow;
    });
  } catch (error) {
    console.error('Invalid regular expression:', error);
    return data;
  }
}

/**
 * Convert data types for specified columns
 * @param data The dataset to transform
 * @param conversions Map of columns to target data types
 * @returns Transformed dataset with converted types
 */
export function convertDataTypes(
  data: Record<string, any>[],
  conversions: Record<string, 'string' | 'number' | 'boolean' | 'date'>
): Record<string, any>[] {
  if (!data.length) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    Object.entries(conversions).forEach(([column, targetType]) => {
      if (!(column in row) || row[column] === null || row[column] === undefined) {
        return;
      }
      
      switch (targetType) {
        case 'string':
          newRow[column] = String(row[column]);
          break;
          
        case 'number':
          const numValue = Number(row[column]);
          newRow[column] = isNaN(numValue) ? null : numValue;
          break;
          
        case 'boolean':
          if (typeof row[column] === 'boolean') {
            newRow[column] = row[column];
          } else if (typeof row[column] === 'string') {
            const value = row[column].toLowerCase().trim();
            newRow[column] = value === 'true' || value === 'yes' || value === '1' || value === 'y';
          } else {
            newRow[column] = Boolean(row[column]);
          }
          break;
          
        case 'date':
          try {
            const dateValue = new Date(row[column]);
            newRow[column] = isNaN(dateValue.getTime()) ? null : dateValue;
          } catch {
            newRow[column] = null;
          }
          break;
      }
    });
    
    return newRow;
  });
}

/**
 * Format date columns to a specified format
 * @param data The dataset to transform
 * @param columns Columns containing dates
 * @param format Target format (simple implementation)
 * @returns Transformed dataset with formatted dates
 */
export function formatDates(
  data: Record<string, any>[],
  columns: string[],
  format: string = 'YYYY-MM-DD'
): Record<string, any>[] {
  if (!data.length) return [];
  
  // Simple date formatter
  const formatDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day);
  };
  
  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (col in row && row[col] !== null && row[col] !== undefined) {
        try {
          const date = new Date(row[col]);
          if (!isNaN(date.getTime())) {
            newRow[col] = formatDate(date, format);
          }
        } catch (error) {
          // Keep original value if conversion fails
        }
      }
    });
    
    return newRow;
  });
}

/**
 * Bin numeric values into categories
 * @param data The dataset to transform
 * @param column Column with numeric values
 * @param bins Array of bin boundaries
 * @param labels Array of labels for bins (optional)
 * @param newColumnName Name for the new column with bin labels
 * @returns Transformed dataset with binned values
 */
export function binValues(
  data: Record<string, any>[],
  column: string,
  bins: number[],
  labels: string[],
  newColumnName: string
): Record<string, any>[] {
  if (!data.length) return [];
  
  // Ensure bins are sorted
  const sortedBins = [...bins].sort((a, b) => a - b);
  
  return data.map(row => {
    const newRow = { ...row };
    
    if (column in row && row[column] !== null && row[column] !== undefined) {
      const value = Number(row[column]);
      
      if (!isNaN(value)) {
        // Find the bin index
        let binIndex = sortedBins.findIndex(bin => value <= bin);
        if (binIndex === -1) {
          binIndex = sortedBins.length;
        }
        
        // Assign label if available, otherwise use bin range
        if (labels && labels[binIndex]) {
          newRow[newColumnName] = labels[binIndex];
        } else {
          const lowerBound = binIndex === 0 ? '-∞' : sortedBins[binIndex - 1];
          const upperBound = binIndex === sortedBins.length ? '∞' : sortedBins[binIndex];
          newRow[newColumnName] = `${lowerBound} to ${upperBound}`;
        }
      } else {
        newRow[newColumnName] = null;
      }
    } else {
      newRow[newColumnName] = null;
    }
    
    return newRow;
  });
}