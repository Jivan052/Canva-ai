/**
 * Convert CSV string to array of objects
 * @param csv CSV string to convert
 * @returns Array of objects
 */
export function csvToJson(csv: string): Record<string, any>[] {
  const lines = csv.split('\n');
  
  // Handle empty file
  if (!lines.length) return [];
  
  // Extract headers (first line) and trim whitespace
  const headers = lines[0].split(',').map(header => header.trim());
  
  // Process data rows (skip header row)
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    // Skip empty lines
    if (!lines[i].trim()) continue;
    
    // Handle quoted values and commas within quotes
    const row: Record<string, any> = {};
    let lineData = lines[i];
    let fields: string[] = [];
    let insideQuotes = false;
    let currentField = '';
    
    // Parse fields with potential quotes and commas
    for (let j = 0; j < lineData.length; j++) {
      const char = lineData[j];
      
      if (char === '"') {
        insideQuotes = !insideQuotes;
      } else if (char === ',' && !insideQuotes) {
        fields.push(currentField);
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    // Add the last field
    fields.push(currentField);
    
    // If simple split worked and produced the right number of fields
    if (fields.length !== headers.length) {
      // Fallback to simple split
      fields = lineData.split(',');
    }
    
    // Create object from headers and fields
    for (let j = 0; j < headers.length; j++) {
      const value = fields[j] ? fields[j].trim() : '';
      
      // Try to parse numeric values
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && value === String(numValue)) {
        row[headers[j]] = numValue;
      } 
      // Handle boolean values
      else if (value.toLowerCase() === 'true') {
        row[headers[j]] = true;
      }
      else if (value.toLowerCase() === 'false') {
        row[headers[j]] = false;
      }
      // Handle null values
      else if (value === '' || value.toLowerCase() === 'null' || value.toLowerCase() === 'na') {
        row[headers[j]] = null;
      }
      // Handle quoted strings (remove quotes)
      else if (value.startsWith('"') && value.endsWith('"')) {
        row[headers[j]] = value.substring(1, value.length - 1);
      }
      // Keep as is
      else {
        row[headers[j]] = value;
      }
    }
    
    result.push(row);
  }
  
  return result;
}

/**
 * Convert array of objects to CSV string
 * @param data Array of objects to convert
 * @returns CSV string
 */
export function jsonToCsv(data: Record<string, any>[]): string {
  if (!data.length) return '';
  
  // Get all unique headers
  const headers = Array.from(
    new Set(
      data.flatMap(obj => Object.keys(obj))
    )
  );
  
  // Create CSV header row
  const csvRows = [headers.join(',')];
  
  // Create CSV data rows
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header] !== undefined ? row[header] : '';
      
      // Handle null values
      if (value === null) return '';
      
      // Handle string values with special characters
      if (typeof value === 'string') {
        // Check if the value contains commas, quotes, or newlines
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          // Escape quotes and wrap in quotes
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }
      
      // Handle dates
      if (value instanceof Date) {
        return value.toISOString();
      }
      
      // Convert everything else to string
      return String(value);
    });
    
    csvRows.push(values.join(','));
  }
  
  return csvRows.join('\n');
}

/**
 * Parse a file to JSON based on file extension
 * @param file File to parse
 * @returns Promise resolving to parsed data
 */
export async function parseFile(file: File): Promise<Record<string, any>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        
        if (file.name.endsWith('.csv')) {
          resolve(csvToJson(content));
        } else if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          resolve(Array.isArray(jsonData) ? jsonData : [jsonData]);
        } else {
          reject(new Error('Unsupported file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => reject(new Error('Error reading file'));
    
    reader.readAsText(file);
  });
}

/**
 * Download data as a file
 * @param data Data to download
 * @param filename Filename to use
 * @param type File mime type
 */
export function downloadFile(data: string, filename: string, type: string): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  document.body.appendChild(a);
  a.click();
  
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}