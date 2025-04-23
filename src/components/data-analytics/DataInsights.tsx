import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  RefreshCw,
  Lightbulb,
  Info,
  AlertTriangle,
  CheckCircle,
  Brain,
  Flame,
  ArrowRight
} from "lucide-react";
import { useAIDataAssistant } from "@/hooks/useAIDataAssistant";
import { useDataOperations } from "@/hooks/useDataOperations";

interface DataInsightsProps {
  className?: string;
}

export function DataInsights({ className }: DataInsightsProps) {
  const { isInitialized, data } = useDataOperations();
  const { 
    isAnalyzing, 
    lastAnalyzed,
    dataQualityScore,
    columnAnalysis,
    relationships,
    recommendations,
    analyzeData 
  } = useAIDataAssistant();

  const [activeTab, setActiveTab] = useState<string>("recommendations");

  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return "Never";
    return date.toLocaleString();
  };

  // Get chart icon based on chart name
  const getChartIcon = (chartName: string) => {
    if (chartName.toLowerCase().includes('bar')) {
      return <BarChart className="h-4 w-4" />;
    } else if (chartName.toLowerCase().includes('scatter')) {
      return <ScatterChart className="h-4 w-4" />;
    } else if (chartName.toLowerCase().includes('pie') || chartName.toLowerCase().includes('donut')) {
      return <PieChart className="h-4 w-4" />;
    } else {
      return <LineChart className="h-4 w-4" />;
    }
  };

  // Get severity badge for data quality suggestions
  const getSeverityBadge = (index: number) => {
    const severity = index === 0 ? "high" : index === 1 ? "medium" : "low";
    const color = 
      severity === "high" ? "text-red-600 bg-red-100" : 
      severity === "medium" ? "text-amber-600 bg-amber-100" : 
      "text-blue-600 bg-blue-100";
    
    return (
      <Badge variant="outline" className={`${color} font-medium`}>
        {severity}
      </Badge>
    );
  };

  // Quality score color
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-amber-600";
    return "text-red-600";
  };

  if (!isInitialized) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            <CardTitle>AI Data Insights</CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => analyzeData()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? <RefreshCw className="h-3.5 w-3.5 animate-spin mr-1" /> : <Lightbulb className="h-3.5 w-3.5 mr-1 text-amber-500" />}
            {isAnalyzing ? "Analyzing..." : "Refresh Insights"}
          </Button>
        </div>
        <CardDescription className="flex items-center justify-between">
          <span>AI-powered analysis and recommendations</span>
          <span className="text-xs text-muted-foreground">
            Last analyzed: {formatDate(lastAnalyzed)}
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        {isAnalyzing ? (
          <div className="py-8 space-y-4 text-center">
            <RefreshCw className="h-8 w-8 text-muted-foreground animate-spin mx-auto" />
            <p className="text-muted-foreground">Analyzing your data...</p>
            <Progress value={45} className="w-full" />
          </div>
        ) : (
          <>
            {/* Data Quality Score Summary */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg border p-3 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(dataQualityScore.overallScore)}`}>
                  {dataQualityScore.overallScore}%
                </div>
                <div className="text-xs text-muted-foreground">Overall Quality</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(dataQualityScore.completeness)}`}>
                  {dataQualityScore.completeness}%
                </div>
                <div className="text-xs text-muted-foreground">Completeness</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(dataQualityScore.consistency)}`}>
                  {dataQualityScore.consistency}%
                </div>
                <div className="text-xs text-muted-foreground">Consistency</div>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <div className={`text-2xl font-bold ${getScoreColor(dataQualityScore.uniqueness)}`}>
                  {dataQualityScore.uniqueness}%
                </div>
                <div className="text-xs text-muted-foreground">Uniqueness</div>
              </div>
            </div>

            {/* Tabs for different insights */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="recommendations">
                  <Lightbulb className="h-3.5 w-3.5 mr-1.5" />
                  Recommendations
                </TabsTrigger>
                <TabsTrigger value="relationships">
                  <Flame className="h-3.5 w-3.5 mr-1.5" />
                  Relationships
                </TabsTrigger>
                <TabsTrigger value="columns">
                  <Info className="h-3.5 w-3.5 mr-1.5" />
                  Column Insights
                </TabsTrigger>
              </TabsList>

              {/* Recommendations Tab */}
              <TabsContent value="recommendations">
                <ScrollArea className="h-[350px] pr-2">
                  <div className="space-y-6">
                    {/* Chart Recommendations */}
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <LineChart className="h-4 w-4 mr-2 text-purple-500" />
                        Recommended Charts
                      </h3>
                      {recommendations.recommendedCharts.length > 0 ? (
                        <div className="space-y-2">
                          {recommendations.recommendedCharts.map((chart, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-md border">
                              {getChartIcon(chart)}
                              <div>
                                <p className="text-sm">{chart}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No chart recommendations available
                        </p>
                      )}
                    </div>

                    {/* Analysis Suggestions */}
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-indigo-500" />
                        Suggested Analyses
                      </h3>
                      {recommendations.suggestedAnalyses.length > 0 ? (
                        <div className="space-y-2">
                          {recommendations.suggestedAnalyses.map((analysis, i) => (
                            <div key={i} className="flex items-start p-2 rounded-md border">
                              <Badge variant="outline" className="mr-2 bg-indigo-50">
                                {i + 1}
                              </Badge>
                              <p className="text-sm">{analysis}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No analysis suggestions available
                        </p>
                      )}
                    </div>

                    {/* Data Quality Suggestions */}
                    <div>
                      <h3 className="font-medium mb-2 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                        Data Quality Suggestions
                      </h3>
                      {recommendations.dataQualitySuggestions.length > 0 ? (
                        <div className="space-y-2">
                          {recommendations.dataQualitySuggestions.map((suggestion, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 rounded-md border">
                              {getSeverityBadge(i)}
                              <p className="text-sm">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No data quality issues detected
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Relationships Tab */}
              <TabsContent value="relationships">
                <ScrollArea className="h-[350px] pr-2">
                  <div className="space-y-6">
                    {/* Correlations */}
                    <div>
                      <h3 className="font-medium mb-2">Strong Correlations</h3>
                      {relationships.correlations.length > 0 ? (
                        <div className="space-y-2">
                          {relationships.correlations.map((corr, i) => (
                            <div key={i} className="p-2 rounded-md border">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    variant="outline" 
                                    className={corr.strength > 0 ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}
                                  >
                                    {Math.abs(corr.strength).toFixed(2)}
                                  </Badge>
                                  <span className="text-sm font-medium">{corr.strength > 0 ? "Positive" : "Negative"}</span>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {corr.strength > 0 ? "Move together" : "Move inversely"}
                                </span>
                              </div>
                              <div className="mt-1.5 text-sm">
                                <div className="flex items-center">
                                  <span>{corr.columns[0]}</span>
                                  <ArrowRight className="h-3 w-3 mx-1.5 text-muted-foreground" />
                                  <span>{corr.columns[1]}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No strong correlations detected
                        </p>
                      )}
                    </div>

                    {/* Functional Dependencies */}
                    <div>
                      <h3 className="font-medium mb-2">Functional Dependencies</h3>
                      {relationships.functionalDependencies.length > 0 ? (
                        <div className="space-y-2">
                          {relationships.functionalDependencies.map((dep, i) => (
                            <div key={i} className="p-2 rounded-md border">
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                  {(dep.confidence * 100).toFixed(0)}% confidence
                                </Badge>
                              </div>
                              <div className="mt-1.5 text-sm">
                                <div className="flex items-center">
                                  <span className="font-medium">{dep.source}</span>
                                  <ArrowRight className="h-3 w-3 mx-1.5 text-muted-foreground" />
                                  <span>{dep.target}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                  When {dep.source} is fixed, {dep.target} is determined
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No functional dependencies detected
                        </p>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Column Insights Tab */}
              <TabsContent value="columns">
                <ScrollArea className="h-[350px] pr-2">
                  <div className="space-y-4">
                    {Object.entries(columnAnalysis).map(([columnName, analysis]) => (
                      <div key={columnName} className="p-3 rounded-md border">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{columnName}</h3>
                          <Badge 
                            variant="outline" 
                            className={analysis.completeness === 100 
                              ? "bg-green-50 text-green-700" 
                              : analysis.completeness > 80 
                                ? "bg-amber-50 text-amber-700" 
                                : "bg-red-50 text-red-700"
                            }
                          >
                            {analysis.completeness.toFixed(0)}% complete
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-medium">Type:</span> {analysis.valueType}
                          </div>
                          <div>
                            <span className="font-medium">Unique Values:</span> {analysis.uniqueCount}
                          </div>
                          <div>
                            {analysis.possibleRole && (
                              <>
                                <span className="font-medium">Role:</span> {analysis.possibleRole}
                              </>
                            )}
                          </div>
                        </div>
                        
                        <Separator className="my-2" />
                        
                        <div className="text-xs space-y-1">
                          {analysis.insights.map((insight, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <Info className="h-3 w-3 text-blue-500" />
                              <span>{insight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}