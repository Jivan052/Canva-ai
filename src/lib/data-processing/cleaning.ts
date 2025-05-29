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
  columnsToReplace?: string[]
): Record<string, any>[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  // If no specific columns provided, check all columns
  const targetColumns = columnsToReplace || Object.keys(data[0] || {});
  if (targetColumns.length === 0) return data;

  const columnDefaults: Record<string, any> = {};

  // Calculate replacement values for each column
  for (const col of targetColumns) {
    // Get all non-null values for this column
    const values = data
      .map(row => row[col])
      .filter(val => val !== null && val !== undefined && val !== '' && val !== 'null' && val !== 'NULL' && val !== 'N/A' && val !== 'n/a');

    // If no valid values found, set default to null
    if (values.length === 0) {
      columnDefaults[col] = null;
      continue;
    }

    const sample = values[0];

    // Check if column is numeric
    const isNumeric = values.every(val => {
      const num = Number(val);
      return !isNaN(num) && isFinite(num);
    });

    if (isNumeric) {
      // Calculate mean for numeric columns
      const numericValues = values.map(Number);
      const mean = numericValues.reduce((acc, val) => acc + val, 0) / numericValues.length;
      
      // Round to 2 decimal places to avoid floating point precision issues
      columnDefaults[col] = Math.round(mean * 100) / 100;
    } else {
      // Calculate mode for categorical columns
      const freqMap = new Map<any, number>();
      
      for (const val of values) {
        const key = String(val).trim(); // Convert to string and trim whitespace
        freqMap.set(key, (freqMap.get(key) || 0) + 1);
      }

      let mode = values[0];
      let maxCount = 0;
      
      for (const [key, count] of freqMap.entries()) {
        if (count > maxCount) {
          maxCount = count;
          mode = key;
        }
      }

      columnDefaults[col] = mode;
    }
  }

  // Replace null values in the data
  return data.map(row => {
    const newRow = { ...row };
    
    for (const col of targetColumns) {
      const value = newRow[col];
      
      // Check for various null representations
      if (value === null || 
          value === undefined || 
          value === '' || 
          value === 'null' || 
          value === 'NULL' ||
          value === 'N/A' ||
          value === 'n/a' ||
          value === 'undefined' ||
          value === 'NaN' ||
          value === 'nan' ||
          value === 'None' ||
          value === 'none' ||
          (typeof value === 'string' && value.trim() === '')) {
        newRow[col] = columnDefaults[col];
      }
    }
    
    return newRow;
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

/**
 * Standardize date formats in specified columns
 * @param data Array of data objects
 * @param columns Columns containing dates to format
 * @param targetFormat Target date format ('ISO', 'US', 'EU', 'custom')
 * @param customFormat Custom format string (e.g., 'yyyy-MM-dd') when targetFormat is 'custom'
 * @returns Data with standardized date formats
 */
export function standardizeDateFormat(
  data: Record<string, any>[],
  columns: string[],
  targetFormat: 'ISO' | 'US' | 'EU' | 'custom' = 'ISO',
  customFormat?: string
): Record<string, any>[] {
  if (data.length === 0) return [];

  const formatDate = (dateValue: any): string => {
    if (!dateValue || dateValue === '') return dateValue;
    
    let date: Date;
    
    // Try to parse the date
    if (dateValue instanceof Date) {
      date = dateValue;
    } else {
      date = new Date(dateValue);
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateValue; // Return original value if can't parse
    }
    
    // Format based on target format
    switch (targetFormat) {
      case 'ISO':
        return date.toISOString().split('T')[0]; // YYYY-MM-DD
      case 'US':
        return date.toLocaleDateString('en-US'); // MM/DD/YYYY
      case 'EU':
        return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
      case 'custom':
        if (!customFormat) return date.toISOString().split('T')[0];
        return formatCustomDate(date, customFormat);
      default:
        return date.toISOString().split('T')[0];
    }
  };

  const formatCustomDate = (date: Date, format: string): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return format
      .replace(/yyyy/g, year.toString())
      .replace(/MM/g, month)
      .replace(/dd/g, day)
      .replace(/yy/g, year.toString().slice(-2))
      .replace(/M/g, (date.getMonth() + 1).toString())
      .replace(/d/g, date.getDate().toString());
  };

  return data.map(row => {
    const newRow = { ...row };
    
    columns.forEach(col => {
      if (newRow[col] !== null && newRow[col] !== undefined) {
        newRow[col] = formatDate(newRow[col]);
      }
    });
    
    return newRow;
  });
}
