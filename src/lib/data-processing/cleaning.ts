/**
 * Data cleaning operations
 */

/**
 * Remove duplicate rows from data
 * @param data Array of data objects
 * @param keys Optional keys to consider for duplication (if not provided, all keys are used)
 * @returns Filtered data array
 */
export function removeDuplicates(
  data: Record<string, any>[],
  keys?: string[]
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const keysToCheck = keys || Object.keys(data[0]);
  const seen = new Set();
  
  return data.filter(row => {
    // Create a unique key based on specified values
    const rowKey = keysToCheck.map(key => JSON.stringify(row[key])).join('|');
    
    if (seen.has(rowKey)) {
      return false;
    } else {
      seen.add(rowKey);
      return true;
    }
  });
}

/**
 * Trim whitespace from string values
 * @param data Array of data objects
 * @param columns Columns to trim (if not provided, all string columns are trimmed)
 * @returns Data with trimmed strings
 */
export function trimWhitespace(
  data: Record<string, any>[],
  columns?: string[]
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const columnsToProcess = columns || Object.keys(data[0]);
  
  return data.map(row => {
    const newRow = { ...row };
    
    columnsToProcess.forEach(col => {
      if (typeof newRow[col] === 'string') {
        newRow[col] = newRow[col].trim();
      }
    });
    
    return newRow;
  });
}

/**
 * Remove rows with null values
 * @param data Array of data objects
 * @param columns Columns to check for nulls (if not provided, all columns are checked)
 * @returns Filtered data array
 */
export function removeNullRows(
  data: Record<string, any>[],
  columns?: string[]
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const columnsToCheck = columns || Object.keys(data[0]);
  
  return data.filter(row => {
    return columnsToCheck.every(col => 
      row[col] !== null && 
      row[col] !== undefined && 
      row[col] !== ''
    );
  });
}

/**
 * Drop columns that are empty (all values are null or empty string)
 * @param data Array of data objects
 * @returns Data with empty columns removed
 */
export function dropEmptyColumns(
  data: Record<string, any>[]
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const columns = Object.keys(data[0]);
  const emptyColumns = columns.filter(col => {
    return data.every(row => 
      row[col] === null || 
      row[col] === undefined || 
      row[col] === ''
    );
  });
  
  if (emptyColumns.length === 0) {
    return data;
  }
  
  return data.map(row => {
    const newRow = { ...row };
    emptyColumns.forEach(col => {
      delete newRow[col];
    });
    return newRow;
  });
}

/**
 * Fill missing values in specified columns
 * @param data Array of data objects
 * @param columns Columns to fill
 * @param fillMethod Method to use for filling (value, mean, median, mode)
 * @param fillValue Value to use if fillMethod is 'value'
 * @returns Data with filled values
 */
export function fillMissingValues(
  data: Record<string, any>[],
  columns: string[],
  fillMethod: 'value' | 'mean' | 'median' | 'mode',
  fillValue?: any
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const result = [...data];
  
  columns.forEach(column => {
    let valueToFill: any;
    
    if (fillMethod === 'value') {
      valueToFill = fillValue;
    } else {
      // Extract non-null values
      const values = data
        .map(row => row[column])
        .filter(val => val !== null && val !== undefined && val !== '');
      
      if (values.length === 0) return;
      
      if (fillMethod === 'mean') {
        // Calculate mean for numeric values
        if (values.every(v => !isNaN(Number(v)))) {
          const sum = values.reduce((acc, val) => acc + Number(val), 0);
          valueToFill = sum / values.length;
        } else {
          valueToFill = fillValue || '';
        }
      } else if (fillMethod === 'median') {
        // Calculate median for numeric values
        if (values.every(v => !isNaN(Number(v)))) {
          const sorted = [...values].map(Number).sort((a, b) => a - b);
          const mid = Math.floor(sorted.length / 2);
          valueToFill = sorted.length % 2 === 0
            ? (sorted[mid - 1] + sorted[mid]) / 2
            : sorted[mid];
        } else {
          valueToFill = fillValue || '';
        }
      } else if (fillMethod === 'mode') {
        // Find most frequent value
        const counts = new Map();
        values.forEach(val => {
          counts.set(val, (counts.get(val) || 0) + 1);
        });
        
        let maxCount = 0;
        let modeValue = null;
        
        counts.forEach((count, val) => {
          if (count > maxCount) {
            maxCount = count;
            modeValue = val;
          }
        });
        
        valueToFill = modeValue;
      }
    }
    
    // Apply the fill value
    result.forEach(row => {
      if (row[column] === null || row[column] === undefined || row[column] === '') {
        row[column] = valueToFill;
      }
    });
  });
  
  return result;
}

/**
 * Standardize text case in specified columns
 * @param data Array of data objects
 * @param columns Columns to transform
 * @param caseType Type of case to apply
 * @returns Data with standardized text case
 */
export function standardizeTextCase(
  data: Record<string, any>[],
  columns: string[],
  caseType: 'uppercase' | 'lowercase' | 'titlecase'
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (typeof newRow[col] === 'string') {
        if (caseType === 'uppercase') {
          newRow[col] = newRow[col].toUpperCase();
        } else if (caseType === 'lowercase') {
          newRow[col] = newRow[col].toLowerCase();
        } else if (caseType === 'titlecase') {
          newRow[col] = newRow[col]
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      }
    });
    
    return newRow;
  });
}

/**
 * Remove special characters from specified columns
 * @param data Array of data objects
 * @param columns Columns to clean
 * @param pattern Regex pattern for characters to remove
 * @returns Data with special characters removed
 */
export function removeSpecialCharacters(
  data: Record<string, any>[],
  columns: string[],
  pattern: string = '[^a-zA-Z0-9 ]'
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  const regex = new RegExp(pattern, 'g');
  
  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (typeof newRow[col] === 'string') {
        newRow[col] = newRow[col].replace(regex, '');
      }
    });
    
    return newRow;
  });
}

/**
 * Find and replace values in specified columns
 * @param data Array of data objects
 * @param columns Columns to process
 * @param findValue Value to find
 * @param replaceValue Value to replace with
 * @param caseSensitive Whether the search is case sensitive
 * @returns Data with replaced values
 */
export function findAndReplace(
  data: Record<string, any>[],
  columns: string[],
  findValue: string,
  replaceValue: string,
  caseSensitive: boolean = true
): Record<string, any>[] {
  if (data.length === 0) return [];
  
  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (typeof newRow[col] === 'string') {
        if (caseSensitive) {
          const regex = new RegExp(findValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
          newRow[col] = newRow[col].replace(regex, replaceValue);
        } else {
          const regex = new RegExp(findValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
          newRow[col] = newRow[col].replace(regex, replaceValue);
        }
      }
    });
    
    return newRow;
  });
}