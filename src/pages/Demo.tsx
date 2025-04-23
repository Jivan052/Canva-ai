import { useState } from "react";
import { FileUpload } from "@/components/data/FileUpload";
import { GoogleSheetConnect } from "@/components/data/GoogleSheetConnect";
import { InsightCard } from "@/components/insights/InsightCard";
import { DataChart } from "@/components/visualizations/DataChart";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataAnalysis } from "@/hooks/useDataAnalysis";
import { InsightResult } from "@/utils/deepseekApi";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";

const DemoAi = () => {
  const [activeTab, setActiveTab] = useState("insights");
  
  const {
    analyzeWithFile,
    analyzeWithGoogleSheet,
    analysisStatus,
    progress,
    insights,
    isLoading
  } = useDataAnalysis({
    onSuccess: () => {
      // Switch to insights tab when analysis is complete
      setActiveTab("insights");
    }
  });
  
  // Sample chart data
  const monthlyData = [
    { month: "Jan", revenue: 5000, expenses: 3000, profit: 2000 },
    { month: "Feb", revenue: 7500, expenses: 4000, profit: 3500 },
    { month: "Mar", revenue: 10000, expenses: 5000, profit: 5000 },
    { month: "Apr", revenue: 8500, expenses: 4500, profit: 4000 },
    { month: "May", revenue: 12000, expenses: 6000, profit: 6000 },
    { month: "Jun", revenue: 15000, expenses: 7000, profit: 8000 },
  ];
  
  const categoryData = [
    { category: "Product A", sales: 3200, target: 3000 },
    { category: "Product B", sales: 2100, target: 2500 },
    { category: "Product C", sales: 4500, target: 4000 },
    { category: "Product D", sales: 1800, target: 2000 },
  ];
  
  const regionData = [
    { name: "North", value: 35 },
    { name: "South", value: 25 },
    { name: "East", value: 20 },
    { name: "West", value: 20 },
  ];

  // Convert analysisStatus to the type expected by DashboardLayout
  const layoutStatus = analysisStatus === "error" ? "idle" : analysisStatus;

  return (
    <DashboardLayout showAIStatus={true} aiStatus={layoutStatus} progress={progress}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            View AI-powered insights and visualizations from your data.
          </p>
        </div>

        {/* Upload Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="visualize">Visualizations</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6 mt-6">
            {insights.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.map((insight, index) => (
                    <InsightCard key={index} {...insight} />
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DataChart
                    title="Monthly Revenue Overview"
                    description="Revenue, expenses and profit over time"
                    data={monthlyData}
                    type="line"
                    xKey="month"
                    yKeys={["revenue", "expenses", "profit"]}
                  />
                  
                  <DataChart
                    title="Sales by Region"
                    data={regionData}
                    type="pie"
                    xKey="name"
                    yKeys={["value"]}
                  />
                </div>
                
                <DataChart
                  title="Product Performance vs Target"
                  description="Sales performance compared to targets"
                  data={categoryData}
                  type="bar"
                  xKey="category"
                  yKeys={["sales", "target"]}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 p-4 rounded-full bg-secondary">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No data analyzed yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload an Excel file or connect a Google Sheet to generate AI-powered insights.
                </p>
                <Button onClick={() => setActiveTab("upload")} variant="default">
                  Upload Data
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
                <CardDescription>
                  Upload your Excel file or connect to Google Sheets to analyze your data with DeepSeek AI.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FileUpload onFileAnalyze={analyzeWithFile} />
                  <GoogleSheetConnect onSheetAnalyze={analyzeWithGoogleSheet} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="visualize" className="space-y-6 mt-6">
            {insights.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <DataChart
                    title="Monthly Revenue Overview"
                    description="Revenue, expenses and profit over time"
                    data={monthlyData}
                    type="area"
                    xKey="month"
                    yKeys={["revenue", "expenses", "profit"]}
                  />
                  
                  <DataChart
                    title="Sales by Region"
                    data={regionData}
                    type="pie"
                    xKey="name"
                    yKeys={["value"]}
                  />
                </div>
                
                <DataChart
                  title="Product Performance vs Target"
                  description="Sales performance compared to targets"
                  data={categoryData}
                  type="bar"
                  xKey="category"
                  yKeys={["sales", "target"]}
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 p-4 rounded-full bg-secondary">
                  <FileSpreadsheet className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No data analyzed yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload an Excel file or connect a Google Sheet to generate visualizations.
                </p>
                <Button onClick={() => setActiveTab("upload")} variant="default">
                  Upload Data
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DemoAi;
