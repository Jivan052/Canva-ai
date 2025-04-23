/**
 * Utility functions for AI-powered data analysis and suggestions
 */

/**
 * Analyze a dataset column and generate insights
 * @param data Array of data objects
 * @param column Column to analyze
 * @returns Insights about the column
 */
export function analyzeColumn(
  data: Record<string, any>[],
  column: string
): {
  valueType: string;
  uniqueCount: number;
  completeness: number;
  insights: string[];
  possibleRole?: string;
} {
  if (!data.length) {
    return {
      valueType: 'unknown',
      uniqueCount: 0,
      completeness: 0,
      insights: ['No data available for analysis']
    };
  }
  
  // Extract values from the column
  const values = data.map(row => row[column]);
  const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
  
  // Calculate basic stats
  const uniqueValues = new Set(values);
  const uniqueCount = uniqueValues.size;
  const completeness = (nonNullValues.length / values.length) * 100;
  
  // Determine value type
  let valueType = 'mixed';
  if (nonNullValues.length > 0) {
    const types = new Set(nonNullValues.map(val => typeof val));
    
    if (types.size === 1) {
      valueType = types.values().next().value;
      
      // Further refine string types
      if (valueType === 'string') {
        // Check if it's a date
        const potentialDates = nonNullValues.filter(val => !isNaN(new Date(val).getTime()));
        if (potentialDates.length >= nonNullValues.length * 0.8) {
          valueType = 'date';
        }
        // Check if it's a numeric string
        const numericStrings = nonNullValues.filter(val => !isNaN(Number(val)));
        if (numericStrings.length >= nonNullValues.length * 0.8) {
          valueType = 'numeric-string';
        }
      }
    }
  }
  
  // Generate insights
  const insights: string[] = [];
  
  // Completeness insights
  if (completeness < 100) {
    insights.push(`${(100 - completeness).toFixed(1)}% of values are missing`);
  } else {
    insights.push('Column has no missing values');
  }
  
  // Uniqueness insights
  const uniquenessRatio = uniqueCount / values.length;
  if (uniquenessRatio === 1) {
    insights.push('All values are unique, possibly an identifier column');
  } else if (uniquenessRatio > 0.9) {
    insights.push('High uniqueness (>90%), likely contains identifiers or free-form text');
  } else if (uniquenessRatio < 0.1) {
    insights.push('Low uniqueness (<10%), likely a categorical column');
  }
  
  // Detect potential column role
  let possibleRole: string | undefined;
  
  // Check for common column patterns
  const colNameLower = column.toLowerCase();
  
  if (
    colNameLower.includes('id') || 
    colNameLower === 'key' || 
    uniquenessRatio === 1
  ) {
    possibleRole = 'identifier';
  } else if (
    colNameLower.includes('name') || 
    colNameLower.includes('title')
  ) {
    possibleRole = 'descriptor';
  } else if (
    colNameLower.includes('date') || 
    colNameLower.includes('time') || 
    valueType === 'date'
  ) {
    possibleRole = 'temporal';
  } else if (
    colNameLower.includes('price') || 
    colNameLower.includes('cost') || 
    colNameLower.includes('amount') || 
    colNameLower.includes('qty') || 
    colNameLower.includes('num')
  ) {
    possibleRole = 'measure';
  } else if (
    colNameLower.includes('category') || 
    colNameLower.includes('type') || 
    colNameLower.includes('status') || 
    uniquenessRatio < 0.1
  ) {
    possibleRole = 'category';
  } else if (
    colNameLower.includes('lat') || 
    colNameLower.includes('long') || 
    colNameLower.includes('zip') || 
    colNameLower.includes('country') || 
    colNameLower.includes('city') || 
    colNameLower.includes('address')
  ) {
    possibleRole = 'geographic';
  }
  
  // Additional insights based on role
  if (possibleRole) {
    if (possibleRole === 'identifier' && completeness < 100) {
      insights.push('Warning: Identifier column has missing values');
    } else if (possibleRole === 'temporal') {
      // Check for date consistency
      const dateFormats = new Set();
      const dateValues = nonNullValues
        .filter(val => !isNaN(new Date(val).getTime()))
        .slice(0, 50); // Sample for efficiency
        
      dateValues.forEach(val => {
        if (typeof val === 'string') {
          // Simple format detection
          if (val.includes('-')) {
            if (val.includes('T')) {
              dateFormats.add('ISO');
            } else {
              dateFormats.add('YYYY-MM-DD');
            }
          } else if (val.includes('/')) {
            dateFormats.add('MM/DD/YYYY');
          } else if (val.includes('.')) {
            dateFormats.add('DD.MM.YYYY');
          }
        }
      });
      
      if (dateFormats.size > 1) {
        insights.push('Multiple date formats detected, consider standardizing');
      }
    }
  }
  
  return {
    valueType,
    uniqueCount,
    completeness,
    insights,
    possibleRole
  };
}

/**
 * Detect potential relationships between columns
 * @param data Array of data objects
 * @returns Potential relationships between columns
 */
export function detectRelationships(
  data: Record<string, any>[]
): {
  correlations: {columns: [string, string], strength: number}[];
  functionalDependencies: {source: string, target: string, confidence: number}[];
} {
  if (!data.length) {
    return {
      correlations: [],
      functionalDependencies: []
    };
  }
  
  const columns = Object.keys(data[0]);
  const result = {
    correlations: [] as {columns: [string, string], strength: number}[],
    functionalDependencies: [] as {source: string, target: string, confidence: number}[]
  };
  
  // Simple detection of functional dependencies (if X is fixed, Y is fixed)
  for (const colA of columns) {
    for (const colB of columns) {
      if (colA === colB) continue;
      
      // Check if values in colA determine values in colB
      const mappings = new Map<any, Set<any>>();
      
      data.forEach(row => {
        const valA = row[colA];
        const valB = row[colB];
        
        if (valA === null || valA === undefined) return;
        
        if (!mappings.has(valA)) {
          mappings.set(valA, new Set());
        }
        
        mappings.get(valA)!.add(valB);
      });
      
      // Calculate how often a value in A maps to exactly one value in B
      let singleMappingCount = 0;
      for (const valuesB of mappings.values()) {
        if (valuesB.size === 1) {
          singleMappingCount++;
        }
      }
      
      const confidence = mappings.size > 0 ? singleMappingCount / mappings.size : 0;
      
      // If there's a strong functional dependency
      if (confidence > 0.9) {
        result.functionalDependencies.push({
          source: colA,
          target: colB,
          confidence
        });
      }
    }
  }
  
  // For numeric columns, calculate correlations
  const numericColumns = columns.filter(col => {
    const numericValues = data
      .filter(row => row[col] !== null && row[col] !== undefined)
      .map(row => row[col])
      .filter(val => !isNaN(Number(val)));
    
    return numericValues.length >= data.length * 0.7;
  });
  
  // Calculate pair-wise correlations
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const colA = numericColumns[i];
      const colB = numericColumns[j];
      
      // Extract numeric values
      const pairs = data
        .map(row => ({ a: Number(row[colA]), b: Number(row[colB]) }))
        .filter(pair => !isNaN(pair.a) && !isNaN(pair.b));
      
      if (pairs.length < 10) continue; // Need sufficient data points
      
      // Calculate Pearson correlation
      const correlation = calculateCorrelation(
        pairs.map(p => p.a), 
        pairs.map(p => p.b)
      );
      
      if (Math.abs(correlation) > 0.7) { // Only strong correlations
        result.correlations.push({
          columns: [colA, colB],
          strength: correlation
        });
      }
    }
  }
  
  return result;
}

/**
 * Calculate Pearson correlation coefficient between two arrays
 */
function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / n;
  const yMean = y.reduce((sum, val) => sum + val, 0) / n;
  
  // Calculate numerator and denominator components
  let numerator = 0;
  let xSquaredSum = 0;
  let ySquaredSum = 0;
  
  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xSquaredSum += xDiff * xDiff;
    ySquaredSum += yDiff * yDiff;
  }
  
  const denominator = Math.sqrt(xSquaredSum * ySquaredSum);
  
  return denominator === 0 ? 0 : numerator / denominator;
}

/**
 * Generate a recommended analysis approach based on dataset characteristics
 * @param data Array of data objects
 * @returns Analysis recommendations
 */
export function generateAnalysisRecommendations(
  data: Record<string, any>[]
): {
  recommendedCharts: string[];
  suggestedAnalyses: string[];
  dataQualitySuggestions: string[];
} {
  if (!data.length) {
    return {
      recommendedCharts: [],
      suggestedAnalyses: [],
      dataQualitySuggestions: []
    };
  }
  
  const columns = Object.keys(data[0]);
  const recommendations = {
    recommendedCharts: [] as string[],
    suggestedAnalyses: [] as string[],
    dataQualitySuggestions: [] as string[]
  };
  
  // Analyze each column
  const columnAnalyses = Object.fromEntries(
    columns.map(col => [col, analyzeColumn(data, col)])
  );
  
  // Count column types
  const numericColumns = columns.filter(col => 
    ['number', 'numeric-string'].includes(columnAnalyses[col].valueType)
  );
  
  const categoricalColumns = columns.filter(col => 
    columnAnalyses[col].uniqueCount < data.length * 0.2 || 
    columnAnalyses[col].possibleRole === 'category'
  );
  
  const temporalColumns = columns.filter(col =>
    columnAnalyses[col].valueType === 'date' ||
    columnAnalyses[col].possibleRole === 'temporal'
  );
  
  // Chart recommendations based on data characteristics
  if (numericColumns.length >= 1 && categoricalColumns.length >= 1) {
    recommendations.recommendedCharts.push('Bar chart comparing numeric values across categories');
  }
  
  if (numericColumns.length >= 2) {
    recommendations.recommendedCharts.push('Scatter plot to visualize relationships between numeric variables');
  }
  
  if (temporalColumns.length >= 1 && numericColumns.length >= 1) {
    recommendations.recommendedCharts.push('Time series chart to track changes over time');
  }
  
  if (categoricalColumns.length >= 1) {
    recommendations.recommendedCharts.push('Pie or donut chart to show categorical distribution');
  }
  
  if (numericColumns.length >= 1) {
    recommendations.recommendedCharts.push('Histogram or box plot to visualize distributions');
  }
  
  // Analysis suggestions
  if (numericColumns.length >= 2) {
    recommendations.suggestedAnalyses.push('Correlation analysis between numeric variables');
  }
  
  if (numericColumns.length >= 1 && categoricalColumns.length >= 1) {
    recommendations.suggestedAnalyses.push('Group-by analysis and summary statistics by category');
  }
  
  if (temporalColumns.length >= 1 && numericColumns.length >= 1) {
    recommendations.suggestedAnalyses.push('Trend analysis and forecasting');
    recommendations.suggestedAnalyses.push('Seasonal decomposition of time series');
  }
  
  if (numericColumns.length >= 3) {
    recommendations.suggestedAnalyses.push('Principal component analysis or factor analysis');
  }
  
  // Data quality suggestions
  const incompleteColumns = columns.filter(col => columnAnalyses[col].completeness < 95);
  if (incompleteColumns.length > 0) {
    recommendations.dataQualitySuggestions.push(
      `Address missing values in ${incompleteColumns.length} columns before analysis`
    );
  }
  
  // Check for outliers in numeric columns
  recommendations.dataQualitySuggestions.push(
    `Check for outliers in numeric columns that may skew analysis results`
  );
  
  // Check for inconsistent data entry
  const nonUniqueColumns = columns.filter(col => 
    columnAnalyses[col].uniqueCount < data.length * 0.9 && 
    columnAnalyses[col].uniqueCount > 1
  );
  
  if (nonUniqueColumns.length > 0) {
    recommendations.dataQualitySuggestions.push(
      `Check for inconsistent data entry in categorical variables`
    );
  }
  
  return recommendations;
}

/**
 * Generate a data quality score
 * @param data Array of data objects
 * @returns Data quality score and breakdown
 */
export function calculateDataQualityScore(
  data: Record<string, any>[]
): {
  overallScore: number;
  completeness: number;
  consistency: number;
  uniqueness: number;
} {
  if (!data.length) {
    return {
      overallScore: 0,
      completeness: 0,
      consistency: 0,
      uniqueness: 0
    };
  }
  
  const columns = Object.keys(data[0]);
  const totalCells = data.length * columns.length;
  
  // Calculate completeness
  let missingValues = 0;
  for (const col of columns) {
    missingValues += data.filter(row => 
      row[col] === null || row[col] === undefined || row[col] === ''
    ).length;
  }
  const completeness = (1 - (missingValues / totalCells)) * 100;
  
  // Calculate consistency
  // This is a simplified approach. In a real implementation, this would be more sophisticated.
  let inconsistentCells = 0;
  for (const col of columns) {
    // For string columns, check for mixed case entries of the same value
    const values = data.map(row => row[col]);
    const nonNullValues = values.filter(val => val !== null && val !== undefined && val !== '');
    const stringValues = nonNullValues.filter(val => typeof val === 'string');
    
    if (stringValues.length > 0) {
      // Check for case inconsistencies
      const lowercaseValueCounts = new Map<string, number>();
      stringValues.forEach(val => {
        const lower = val.toLowerCase();
        lowercaseValueCounts.set(lower, (lowercaseValueCounts.get(lower) || 0) + 1);
      });
      
      // Count strings that appear in different cases
      const stringsWithDifferentCases = lowercaseValueCounts.size;
      const uniqueStrings = new Set(stringValues).size;
      
      if (stringsWithDifferentCases < uniqueStrings) {
        inconsistentCells += (uniqueStrings - stringsWithDifferentCases);
      }
    }
    
    // For numeric columns, check for different formats (e.g. integers vs. decimals)
    const numericStringValues = nonNullValues.filter(val => 
      typeof val === 'string' && !isNaN(Number(val))
    );
    
    if (numericStringValues.length > 0) {
      const integersCount = numericStringValues.filter(val => !val.includes('.')).length;
      const decimalsCount = numericStringValues.filter(val => val.includes('.')).length;
      
      if (integersCount > 0 && decimalsCount > 0) {
        // Some inconsistency in numeric format
        inconsistentCells += Math.min(integersCount, decimalsCount);
      }
    }
  }
  const consistency = (1 - (inconsistentCells / totalCells)) * 100;
  
  // Calculate uniqueness (based on duplicate rows)
  const uniqueRowsCount = new Set(data.map(row => JSON.stringify(row))).size;
  const uniqueness = (uniqueRowsCount / data.length) * 100;
  
  // Calculate overall score (weighted average)
  const overallScore = (completeness * 0.4) + (consistency * 0.4) + (uniqueness * 0.2);
  
  return {
    overallScore: Math.round(overallScore),
    completeness: Math.round(completeness),
    consistency: Math.round(consistency),
    uniqueness: Math.round(uniqueness)
  };
}