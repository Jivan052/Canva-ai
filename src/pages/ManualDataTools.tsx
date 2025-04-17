import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AIProcessingIndicator } from "@/components/ui-custom/AIProcessingIndicator";
import { ChevronLeft, BarChart3, Database, FileUp, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDataset, Dataset } from "@/hooks/useDataset";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DataVisualizer } from "@/components/tools/DataVisualizer";
import { DataFormulator } from "@/components/tools/DataFormulator";

export function ManualDataTools() {
  const [activeTab, setActiveTab] = useState<string>("visualize");
  const { currentDataset, setCurrentDataset } = useDataset();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const file = e.target.files?.[0];
      if (!file) {
        setIsLoading(false);
        return;
      }
      
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          // Assuming CSV format
          const content = event.target?.result as string;
          const lines = content.split('\n');
          
          if (lines.length < 2) {
            throw new Error("Not enough data in file. The file appears to be empty or improperly formatted.");
          }
          
          // Parse headers - handle both comma and semicolon delimiters
          const delimiter = lines[0].includes(',') ? ',' : ';';
          const columns = lines[0].split(delimiter).map(col => col.trim());
          
          // Parse data
          const data = lines.slice(1)
            .filter(line => line.trim() !== '')
            .map(line => {
              // Handle quoted fields that might contain delimiters
              const cells = [];
              let inQuotes = false;
              let currentCell = "";
              
              for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                  inQuotes = !inQuotes;
                } else if (char === delimiter && !inQuotes) {
                  cells.push(currentCell.trim());
                  currentCell = "";
                } else {
                  currentCell += char;
                }
              }
              
              // Add the last cell
              cells.push(currentCell.trim());
              
              // Ensure all rows have the same number of columns
              while (cells.length < columns.length) {
                cells.push("");
              }
              
              return cells.slice(0, columns.length);
            });
          
          // Create dataset
          const dataset: Dataset = {
            name: file.name,
            columns,
            data,
            originalData: JSON.parse(JSON.stringify(data)) // Deep copy
          };
          
          setCurrentDataset(dataset);
          setIsLoading(false);
          
          toast({
            title: "Dataset loaded successfully",
            description: `Loaded ${data.length} rows and ${columns.length} columns`,
          });
          
        } catch (error) {
          console.error("Error parsing file:", error);
          setError(error instanceof Error ? error.message : "Failed to parse file");
          setIsLoading(false);
        }
      };
      
      reader.onerror = () => {
        setError("Error reading the file");
        setIsLoading(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("File upload error:", error);
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            className="mr-2" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Manual Data Processing Tools</h1>
        </div>
        
        <div className="flex items-center">
          <Button asChild className="cursor-pointer">
            <label>
              <FileUp className="h-4 w-4 mr-2" />
              {currentDataset ? "Change Dataset" : "Upload Dataset"}
              <input 
                type="file" 
                className="hidden" 
                accept=".csv"
                onChange={handleFileUpload} 
              />
            </label>
          </Button>
          
          {currentDataset && (
            <div className="ml-4 text-sm">
              Working with: <span className="font-medium">{currentDataset.name}</span>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {isLoading ? (
        <Card className="mb-6">
          <CardContent className="flex items-center justify-center p-12">
            <AIProcessingIndicator status="loading" />
          </CardContent>
        </Card>
      ) : !currentDataset ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>No Dataset Loaded</CardTitle>
            <CardDescription>
              Please upload a dataset to get started with the manual tools
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <p className="text-center text-gray-500 mb-6 max-w-md">
              Upload a CSV file to visualize, clean, and transform your data with advanced tools
            </p>
            <Button asChild className="cursor-pointer">
              <label>
                <FileUp className="h-4 w-4 mr-2" />
                Upload CSV File
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileUpload} 
                />
              </label>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Advanced Data Tools</CardTitle>
            <CardDescription>
              Process and visualize your data with precision
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="visualize" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="visualize" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Visualize
                </TabsTrigger>
                <TabsTrigger value="clean" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  Clean & Transform
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="visualize">
                <DataVisualizer />
              </TabsContent>
              
              <TabsContent value="clean">
                <DataFormulator />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}