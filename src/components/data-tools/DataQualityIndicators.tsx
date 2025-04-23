import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle2, AlertTriangle, XCircle, ArrowRight } from "lucide-react";
import { useDataOperations } from "@/hooks/useDataOperations";
import { detectDataIssues } from "@/lib/utils/dataHelpers";

interface DataQualityProps {
  className?: string;
  onFixIssue?: (issue: string, columns?: string[]) => void;
}

export function DataQualityIndicators({ className, onFixIssue }: DataQualityProps) {
  const { data, columns, isInitialized } = useDataOperations();
  const [qualityScore, setQualityScore] = useState<number>(0);
  const [issues, setIssues] = useState<{
    nullValues: Record<string, number>;
    duplicateRows: number;
    inconsistentTypes: string[];
    outliers: Record<string, number[]>;
  }>({ nullValues: {}, duplicateRows: 0, inconsistentTypes: [], outliers: {} });
  
  // Calculate data quality on data changes
  useEffect(() => {
    if (!isInitialized || !data.length) return;
    
    // Detect issues
    const detectedIssues = detectDataIssues(data);
    setIssues(detectedIssues);
    
    // Calculate score based on issues
    const totalRows = data.length;
    
    // Factors to consider (with weights)
    const nullScore = 0.4; // 40% weight for null values
    const dupeScore = 0.3; // 30% weight for duplicates
    const typeScore = 0.2; // 20% weight for inconsistent types
    const outlierScore = 0.1; // 10% weight for outliers
    
    // Calculate sub-scores
    let nullScoreValue = 1.0;
    const totalNulls = Object.values(detectedIssues.nullValues)
      .reduce((sum, count) => sum + count, 0);
    if (totalRows > 0) {
      // Penalize based on % of nulls
      nullScoreValue = Math.max(0, 1 - (totalNulls / (totalRows * columns.length)));
    }
    
    let dupeScoreValue = 1.0;
    if (totalRows > 0) {
      // Penalize based on % of duplicates
      dupeScoreValue = Math.max(0, 1 - (detectedIssues.duplicateRows / totalRows));
    }
    
    let typeScoreValue = 1.0;
    if (columns.length > 0) {
      // Penalize based on % of columns with inconsistent types
      typeScoreValue = Math.max(0, 1 - (detectedIssues.inconsistentTypes.length / columns.length));
    }
    
    let outlierScoreValue = 1.0;
    const totalOutliers = Object.values(detectedIssues.outliers)
      .reduce((sum, arr) => sum + arr.length, 0);
    if (totalRows > 0) {
      // Penalize based on % of outliers
      outlierScoreValue = Math.max(0, 1 - (totalOutliers / totalRows));
    }
    
    // Calculate total score
    const score = Math.round(
      (nullScore * nullScoreValue + 
       dupeScore * dupeScoreValue + 
       typeScore * typeScoreValue + 
       outlierScore * outlierScoreValue) * 100
    );
    
    setQualityScore(score);
  }, [data, columns, isInitialized]);
  
  // If data is not loaded yet
  if (!isInitialized || !data.length) {
    return null;
  }
  
  // Get issue count
  const nullIssueCount = Object.keys(issues.nullValues).length;
  const typeIssueCount = issues.inconsistentTypes.length;
  const outlierIssueCount = Object.keys(issues.outliers).length;
  const totalIssueCount = 
    nullIssueCount + 
    (issues.duplicateRows > 0 ? 1 : 0) + 
    typeIssueCount + 
    outlierIssueCount;
  
  // Determine quality level
  let qualityLevel: "low" | "medium" | "high" = "high";
  if (qualityScore < 70) {
    qualityLevel = "low";
  } else if (qualityScore < 90) {
    qualityLevel = "medium";
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Data Quality
          <Badge 
            variant={
              qualityLevel === "high" ? "default" : 
              qualityLevel === "medium" ? "outline" : 
              "destructive"
            }
            className="ml-2"
          >
            {qualityScore}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Analysis of potential data quality issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quality score indicator */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-sm">Quality Score</span>
            <span className="text-sm font-medium">{qualityScore}%</span>
          </div>
          <Progress value={qualityScore} className="h-2" />
        </div>
        
        {/* Issues summary */}
        <div className="flex items-center justify-between text-sm">
          <span>
            {totalIssueCount === 0 ? (
              <span className="flex items-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                No issues detected
              </span>
            ) : (
              <span>
                {totalIssueCount} {totalIssueCount === 1 ? "issue" : "issues"} detected
              </span>
            )}
          </span>
          
          {totalIssueCount > 0 && (
            <Button variant="link" className="p-0 h-auto" onClick={() => {}}>
              View all
            </Button>
          )}
        </div>
        
        {/* Issues list */}
        {totalIssueCount > 0 && (
          <ScrollArea className="h-[200px] rounded-md border p-2">
            <div className="space-y-3">
              {/* Missing values */}
              {nullIssueCount > 0 && (
                <div className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p>
                      <span className="font-medium">Missing values</span> in {nullIssueCount} {nullIssueCount === 1 ? "column" : "columns"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(issues.nullValues).map(([column, count]) => (
                        <Badge key={column} variant="outline" className="text-xs">
                          {column}: {count}
                        </Badge>
                      ))}
                    </div>
                    {onFixIssue && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs"
                        onClick={() => onFixIssue("fillMissing", Object.keys(issues.nullValues))}
                      >
                        Fix issue
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Duplicate rows */}
              {issues.duplicateRows > 0 && (
                <div className="flex items-start space-x-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p>
                      <span className="font-medium">{issues.duplicateRows} duplicate {issues.duplicateRows === 1 ? "row" : "rows"}</span> found in dataset
                    </p>
                    {onFixIssue && (
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="h-auto p-0 text-xs"
                        onClick={() => onFixIssue("removeDuplicates")}
                      >
                        Fix issue
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              )}
              
              {/* Inconsistent types */}
              {typeIssueCount > 0 && (
                <div className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p>
                      <span className="font-medium">Inconsistent data types</span> in {typeIssueCount} {typeIssueCount === 1 ? "column" : "columns"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {issues.inconsistentTypes.map((column) => (
                        <Badge key={column} variant="outline" className="text-xs">
                          {column}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Outliers */}
              {outlierIssueCount > 0 && (
                <div className="flex items-start space-x-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <p>
                      <span className="font-medium">Outliers detected</span> in {outlierIssueCount} {outlierIssueCount === 1 ? "column" : "columns"}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(issues.outliers).map(([column, values]) => (
                        <Badge key={column} variant="outline" className="text-xs">
                          {column}: {values.length}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}