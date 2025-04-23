import { detectDataIssues, getColumnStats } from "@/lib/utils/dataHelpers";

/**
 * Types of suggestions the AI can provide
 */
export type SuggestionType = 'cleaning' | 'transformation' | 'formatting' | 'validation';

/**
 * Structure of an AI suggestion
 */
export interface AISuggestion {
  id: string;
  type: SuggestionType;
  title: string;
  description: string;
  confidence: number; // 0-100
  operation: {
    name: string;
    params: Record<string, any>;
  };
  status: 'pending' | 'applied' | 'dismissed';
  timestamp: number;
}

/**
 * Generate AI suggestions for data cleaning and transformation
 * @param data The dataset to analyze
 * @returns Array of suggestions
 */
export async function generateSuggestions(
  data: Record<string, any>[]
): Promise<AISuggestion[]> {
  if (!data.length) return [];
  
  try {
    const suggestions: AISuggestion[] = [];
    const columnNames = Object.keys(data[0]);
    const issues = detectDataIssues(data);
    const stats = getColumnStats(data);
    
    // Suggestion ID counter
    let suggestionCounter = 0;
    const createId = () => `ai-suggestion-${Date.now()}-${suggestionCounter++}`;
    
    // Check for missing values
    const columnsWithNulls = Object.entries(issues.nullValues)
      .filter(([_, count]) => count > 0);
    
    if (columnsWithNulls.length > 0) {
      // Group by percentage of missing values
      const highMissingColumns = columnsWithNulls
        .filter(([_, count]) => count / data.length > 0.8)
        .map(([col]) => col);
      
      const moderateMissingColumns = columnsWithNulls
        .filter(([col, count]) => count / data.length <= 0.8 && count / data.length > 0.3)
        .map(([col]) => col);
      
      const lowMissingColumns = columnsWithNulls
        .filter(([col, count]) => count / data.length <= 0.3)
        .map(([col]) => col);
      
      // Suggest dropping columns with too many missing values
      if (highMissingColumns.length > 0) {
        suggestions.push({
          id: createId(),
          type: 'cleaning',
          title: 'Remove columns with excessive missing values',
          description: `${highMissingColumns.length} columns have more than 80% missing values, which may not be useful for analysis.`,
          confidence: 85,
          operation: {
            name: 'dropColumns',
            params: {
              columns: highMissingColumns
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      }
      
      // Suggest filling with median/mode for moderate missing values
      if (moderateMissingColumns.length > 0) {
        const numericColumns = moderateMissingColumns.filter(
          col => stats[col]?.type === 'number'
        );
        
        const categoricalColumns = moderateMissingColumns.filter(
          col => stats[col]?.type !== 'number'
        );
        
        if (numericColumns.length > 0) {
          suggestions.push({
            id: createId(),
            type: 'cleaning',
            title: 'Fill numeric missing values with median',
            description: `Fill missing values in ${numericColumns.length} numeric columns with the median value to preserve distribution.`,
            confidence: 80,
            operation: {
              name: 'fillMissingValues',
              params: {
                columns: numericColumns,
                method: 'median'
              }
            },
            status: 'pending',
            timestamp: Date.now()
          });
        }
        
        if (categoricalColumns.length > 0) {
          suggestions.push({
            id: createId(),
            type: 'cleaning',
            title: 'Fill categorical missing values with mode',
            description: `Fill missing values in ${categoricalColumns.length} categorical columns with the most frequent value.`,
            confidence: 75,
            operation: {
              name: 'fillMissingValues',
              params: {
                columns: categoricalColumns,
                method: 'mode'
              }
            },
            status: 'pending',
            timestamp: Date.now()
          });
        }
      }
      
      // Suggest custom fill for low missing values
      if (lowMissingColumns.length > 0) {
        suggestions.push({
          id: createId(),
          type: 'cleaning',
          title: 'Fill remaining missing values',
          description: `${lowMissingColumns.length} columns have a small number of missing values that could be filled.`,
          confidence: 70,
          operation: {
            name: 'fillMissingValues',
            params: {
              columns: lowMissingColumns,
              method: 'auto'
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      }
    }
    
    // Check for duplicate rows
    if (issues.duplicateRows > 0) {
      suggestions.push({
        id: createId(),
        type: 'cleaning',
        title: 'Remove duplicate rows',
        description: `${issues.duplicateRows} duplicate rows detected that may affect analysis accuracy.`,
        confidence: 95,
        operation: {
          name: 'removeDuplicates',
          params: {}
        },
        status: 'pending',
        timestamp: Date.now()
      });
    }
    
    // Check for inconsistent types
    if (issues.inconsistentTypes.length > 0) {
      issues.inconsistentTypes.forEach(column => {
        suggestions.push({
          id: createId(),
          type: 'transformation',
          title: `Standardize data type in '${column}'`,
          description: `Column '${column}' has mixed data types which may cause analysis issues.`,
          confidence: 85,
          operation: {
            name: 'standardizeDataType',
            params: {
              column,
              targetType: 'auto'
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      });
    }
    
    // Check for outliers
    const columnsWithOutliers = Object.keys(issues.outliers);
    if (columnsWithOutliers.length > 0) {
      suggestions.push({
        id: createId(),
        type: 'cleaning',
        title: 'Address outliers in numeric columns',
        description: `${columnsWithOutliers.length} columns contain outliers that may skew statistical analysis.`,
        confidence: 70,
        operation: {
          name: 'handleOutliers',
          params: {
            columns: columnsWithOutliers,
            method: 'cap'
          }
        },
        status: 'pending',
        timestamp: Date.now()
      });
    }
    
    // Suggest text cleaning for string columns
    const textColumns = columnNames.filter(col => {
      const sampleValues = data.slice(0, 50).map(row => row[col]);
      return sampleValues.some(val => typeof val === 'string' && val.length > 3);
    });
    
    if (textColumns.length > 0) {
      // Check for columns that might need trimming
      const needTrimming = textColumns.filter(col => {
        const sampleValues = data.slice(0, 50).map(row => row[col]);
        return sampleValues.some(val => 
          typeof val === 'string' && 
          (val.startsWith(' ') || val.endsWith(' '))
        );
      });
      
      if (needTrimming.length > 0) {
        suggestions.push({
          id: createId(),
          type: 'cleaning',
          title: 'Trim whitespace from text columns',
          description: `${needTrimming.length} columns have values with leading or trailing spaces.`,
          confidence: 90,
          operation: {
            name: 'trimWhitespace',
            params: {
              columns: needTrimming
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      }
      
      // Check for case inconsistency
      const needCaseStandardization = textColumns.filter(col => {
        const sampleValues = data.slice(0, 50)
          .map(row => row[col])
          .filter(val => typeof val === 'string');
          
        // Check if same values appear with different cases
        const lowercaseValueSet = new Set(
          sampleValues.map(val => val.toLowerCase())
        );
        
        return lowercaseValueSet.size < sampleValues.length;
      });
      
      if (needCaseStandardization.length > 0) {
        suggestions.push({
          id: createId(),
          type: 'transformation',
          title: 'Standardize text case',
          description: `${needCaseStandardization.length} columns have inconsistent text case that could be standardized.`,
          confidence: 80,
          operation: {
            name: 'standardizeTextCase',
            params: {
              columns: needCaseStandardization,
              caseType: 'lowercase'
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      }
    }
    
    // Suggest potentially useful column creation
    // Example: Full name from first and last name
    const nameColumns = columnNames.filter(col => 
      col.toLowerCase().includes('name') ||
      col.toLowerCase().includes('first') ||
      col.toLowerCase().includes('last')
    );
    
    if (nameColumns.length >= 2) {
      // Check for first name and last name columns
      const firstNameCol = nameColumns.find(col => 
        col.toLowerCase().includes('first') || 
        col.toLowerCase() === 'fname' || 
        col.toLowerCase() === 'firstname'
      );
      
      const lastNameCol = nameColumns.find(col => 
        col.toLowerCase().includes('last') || 
        col.toLowerCase() === 'lname' || 
        col.toLowerCase() === 'lastname'
      );
      
      if (firstNameCol && lastNameCol) {
        suggestions.push({
          id: createId(),
          type: 'transformation',
          title: 'Create full name column',
          description: `Combine '${firstNameCol}' and '${lastNameCol}' into a full name column for better readability.`,
          confidence: 75,
          operation: {
            name: 'mergeColumns',
            params: {
              columns: [firstNameCol, lastNameCol],
              delimiter: ' ',
              newColumnName: 'full_name',
              keepOriginals: true
            }
          },
          status: 'pending',
          timestamp: Date.now()
        });
      }
    }
    
    // Suggest date formatting if date columns are detected
    const potentialDateColumns = columnNames.filter(col => {
      const sampleValues = data.slice(0, 50).map(row => row[col]);
      return sampleValues.some(val => {
        if (typeof val !== 'string') return false;
        // Simple check for date-like patterns
        return /^\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/.test(val) ||
               /^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/.test(val);
      });
    });
    
    if (potentialDateColumns.length > 0) {
      suggestions.push({
        id: createId(),
        type: 'formatting',
        title: 'Standardize date formats',
        description: `${potentialDateColumns.length} columns appear to contain dates that could be standardized.`,
        confidence: 85,
        operation: {
          name: 'standardizeDateFormat',
          params: {
            columns: potentialDateColumns,
            format: 'YYYY-MM-DD'
          }
        },
        status: 'pending',
        timestamp: Date.now()
      });
    }
    
    // Simulate a slight delay for API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return suggestions;
    
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return [];
  }
}

/**
 * Apply an AI suggestion to the data
 * @param data The dataset to modify
 * @param suggestion The suggestion to apply
 * @returns The modified dataset
 */
export function applySuggestion(
  data: Record<string, any>[],
  suggestion: AISuggestion
): Record<string, any>[] {
  // This function would typically delegate to the appropriate data operation
  // based on the suggestion.operation.name and params
  // For now, it's just a placeholder that returns the original data
  
  console.log('Applying suggestion:', suggestion);
  return data;
}