import { useState, useRef } from "react";
import { FileUpload } from "@/components/data/FileUpload";
import { GoogleSheetConnect } from "@/components/data/GoogleSheetConnect";
import { InsightCard } from "@/components/insights/InsightCard";
import { DataChart } from "@/components/visualizations/DataChart";
import { DashboardLayout } from "@/layouts/DashboardLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDataAnalysis } from "@/hooks/useDataAnalysis";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, BarChart, PieChart, LineChart, Download, Loader2 } from "lucide-react";
import  ChatbotWidget  from "./ChatbotWidget";
import { useInsight } from "@/contexts/InsightContext";
import { fetchBotReply } from "./fetchBotReply";

const DemoAi = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const { dataInsights } = useInsight();
  const [chatMessagesData, setChatMessagesData] = useState([]);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const chartsRef = useRef(null);

  // Function to generate and download PDF
  const downloadChartsAsPDF = async () => {
    if (!chartData?.charts || chartData.charts.length === 0) {
      alert("No charts available to download");
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      // Dynamic import of html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      
      // Add title page
      pdf.setFontSize(20);
      pdf.text('Data Visualization Report', margin, 30);
      pdf.setFontSize(12);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 45);
      pdf.text(`Total Charts: ${chartData.charts.length}`, margin, 55);
      
      // Get all chart elements
      const chartElements = chartsRef.current?.querySelectorAll('[data-chart-container]');
      
      if (chartElements && chartElements.length > 0) {
        for (let i = 0; i < chartElements.length; i++) {
          const element = chartElements[i];
          
          // Add new page for each chart (except first)
          if (i > 0) {
            pdf.addPage();
          } else {
            // For first chart, add some space after title
            pdf.text('', margin, 70);
          }
          
          // Capture the chart element
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/png');
          
          // Calculate dimensions to fit the page
          const imgWidth = pageWidth - (margin * 2);
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Add chart title
          const chartTitle = chartData.charts[i]?.title || `Chart ${i + 1}`;
          pdf.setFontSize(16);
          pdf.text(chartTitle, margin, i === 0 ? 80 : 30);
          
          // Add chart image
          const yPosition = i === 0 ? 90 : 40;
          if (imgHeight <= pageHeight - yPosition - margin) {
            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          } else {
            // If image is too tall, scale it down
            const scaledHeight = pageHeight - yPosition - margin;
            const scaledWidth = (canvas.width * scaledHeight) / canvas.height;
            pdf.addImage(imgData, 'PNG', margin, yPosition, scaledWidth, scaledHeight);
          }
          
          // Add description if available
          const description = chartData.charts[i]?.description;
          if (description && description.length > 0) {
            pdf.setFontSize(10);
            const descY = yPosition + Math.min(imgHeight, pageHeight - yPosition - margin) + 10;
            if (descY < pageHeight - margin) {
              // Split long descriptions into multiple lines
              const splitDescription = pdf.splitTextToSize(description, pageWidth - (margin * 2));
              pdf.text(splitDescription, margin, descY);
            }
          }
        }
      }
      
      // Save the PDF
      pdf.save(`data-visualizations-${new Date().toISOString().split('T')[0]}.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  // Transform dataInsights into chart data format
  const transformDataForCharts = () => {
    if (!dataInsights || !Array.isArray(dataInsights) || dataInsights.length === 0) return null;
    
    const charts = [];
    const metrics = [];
    
    dataInsights.forEach((insight, insightIndex) => {
      if (insight.visualization?.charts) {
        insight.visualization.charts.forEach((chart, chartIndex) => {
          // Transform chart data based on type
          let transformedData = [];
          
          if (chart.chartType === 'bar' || chart.chartType === 'line') {
            transformedData = chart.labels.map((label, index) => ({
              name: label,
              value: chart.data[index]
            }));
          } else if (chart.chartType === 'pie') {
            transformedData = chart.labels.map((label, index) => ({
              name: label,
              value: chart.data[index]
            }));
          }
          
          charts.push({
            id: `chart-${insightIndex}-${chartIndex}`,
            title: chart.title,
            description: insight.description,
            data: transformedData,
            type: chart.chartType === 'bar' ? 'bar' : chart.chartType === 'line' ? 'line' : 'pie',
            xKey: 'name',
            yKeys: ['value'],
            color: "#3B82F6"
          });
        });
      }
      
      if (insight.visualization?.metrics) {
        metrics.push(...insight.visualization.metrics.map(metric => ({
          ...metric,
          insightTitle: insight.insight
        })));
      }
    });
    
    return { charts, metrics };
  };
  
  // Generate contextual chatbot responses based on dataInsights
  const handleChatPrompt = async (prompt: string): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    if (!dataInsights || !Array.isArray(dataInsights) || dataInsights.length === 0) {
      return "Please upload some data first so I can provide insights about your business metrics.";
    }
    
    const lowerPrompt = prompt.toLowerCase();
    
    // Find relevant insights based on keywords
    if (lowerPrompt.includes("revenue") || lowerPrompt.includes("sales")) {
      const revenueInsight = dataInsights.find(insight => 
        insight.insight.toLowerCase().includes("revenue") || 
        insight.description.toLowerCase().includes("revenue")
      );
      
      if (revenueInsight) {
        const changeMetric = revenueInsight.visualization?.metrics?.find(m => 
          m.title.toLowerCase().includes("change")
        );
        return `${revenueInsight.description} ${changeMetric ? `The change was ${changeMetric.value}${changeMetric.unit}.` : ''} Suggestion: ${revenueInsight.suggestion}`;
      }
    }
    
    if (lowerPrompt.includes("region") || lowerPrompt.includes("growth")) {
      const regionInsight = dataInsights.find(insight => 
        insight.insight.toLowerCase().includes("region") || 
        insight.insight.toLowerCase().includes("west")
      );
      
      if (regionInsight) {
        const growthMetric = regionInsight.visualization?.metrics?.find(m => 
          m.title.toLowerCase().includes("growth")
        );
        return `${regionInsight.description} ${growthMetric ? `Growth rate: ${growthMetric.value}${growthMetric.unit}.` : ''} Suggestion: ${regionInsight.suggestion}`;
      }
    }
    
    // General insights summary
    if (lowerPrompt.includes("summary") || lowerPrompt.includes("overview")) {
      const insights = dataInsights.map(insight => `• ${insight.insight}: ${insight.description}`).join('\n');
      return `Here's a summary of your key insights:\n${insights}`;
    }
    
    // Default response with available insights
    const availableTopics = dataInsights.map(insight => insight.insight).join(', ');
    return `I can help analyze your data insights. Current topics available: ${availableTopics}. Try asking about specific metrics or request a summary.`;
  };
  
  const {
    analyzeWithFile,
    analyzeWithGoogleSheet,
    analysisStatus,
    progress,
    insights,
  } = useDataAnalysis({
    onSuccess: () => {
      setActiveTab("insights");
    }
  });

  // Convert analysisStatus to the type expected by DashboardLayout
  const layoutStatus = analysisStatus === "error" ? "idle" : analysisStatus;
  
  // Get transformed chart data
  const chartData = transformDataForCharts();

  return (
    <DashboardLayout showAIStatus={true} aiStatus={layoutStatus} progress={progress}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            View AI-powered insights and visualizations from your data.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="visualize">Visualizations</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
                <CardDescription>
                  Upload your Excel file or connect to Google Sheets to analyze your data.
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
          
          <TabsContent value="insights" className="space-y-6 mt-6">
            {/* Display metrics cards */}
            {chartData?.metrics && chartData.metrics.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {chartData.metrics.map((metric, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="text-2xl font-bold">
                        {metric.unit === '₹' ? '₹' : ''}{metric.value.toLocaleString()}{metric.unit === '%' ? '%' : ''}
                      </div>
                      <p className="text-sm text-muted-foreground">{metric.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {dataInsights && Array.isArray(dataInsights) && dataInsights.length > 0 ? (
              <>
                {/* Display insights as cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dataInsights.map((insight, index) => (
                    <InsightCard 
                      key={index} 
                      insight={insight.insight}
                      description={insight.description}
                      suggestion={insight.suggestion}
                    />
                  ))}
                </div>
              
                {/* Display dynamic charts */}
                {chartData?.charts && chartData.charts.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {chartData.charts.map((chart) => (
                      <DataChart
                        key={chart.id}
                        title={chart.title}
                        description={chart.description}
                        data={chart.data}
                        type={chart.type}
                        xKey={chart.xKey}
                        yKeys={chart.yKeys}
                      />
                    ))}
                  </div>
                )}
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
          
          <TabsContent value="visualize" className="space-y-6 mt-6">
            {chartData?.charts && chartData.charts.length > 0 ? (
              <>
                {/* Download Button */}
                <div className="flex justify-end mb-6">
                  <Button 
                    onClick={downloadChartsAsPDF}
                    disabled={isGeneratingPDF}
                    className="flex items-center gap-2"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating PDF...
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Download PDF
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Charts Container */}
                <div ref={chartsRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {chartData.charts.map((chart) => (
                    <div key={`viz-${chart.id}`} data-chart-container>
                      <DataChart
                        title={chart.title}
                        description={chart.description}
                        data={chart.data}
                        type={chart.type}
                        xKey={chart.xKey}
                        yKeys={chart.yKeys}
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 p-4 rounded-full bg-secondary">
                  <BarChart className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No visualizations available</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Upload data with insights to see dynamic visualizations.
                </p>
                <Button onClick={() => setActiveTab("upload")} variant="default">
                  Upload Data
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="assistant" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Assistant</CardTitle>
                <CardDescription>
                  Ask questions about your data and get AI-powered insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatbotWidget
                  messagesData={chatMessagesData}
                  onSendPrompt={fetchBotReply}
                  onUpdateMessagesData={setChatMessagesData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default DemoAi;