import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DataOperationsPanel } from "@/components/data-tools/DataOperationsPanel";
import { DataPreview } from "@/components/data-tools/DataPreview";
import { DataQualityIndicators } from "@/components/data-tools/DataQualityIndicators";
import { OperationHistory } from "@/components/data-tools/OperationHistory";
import { AISuggestions } from "@/components/data-tools/AISuggestions";
import { DataInsights } from "@/components/data-analytics/DataInsights";
import { AutoCleanModal } from "@/components/data-tools/AutoCleanModal";
import { useDataOperations } from "@/hooks/useDataOperations";
import {  BarChart2, BadgePlus } from "lucide-react";
import { 
  Upload, Download, PanelRight, PanelLeft, Sparkles, 
  Menu, ChevronRight, Hammer, Settings, ExternalLink,
  FileSpreadsheet, Database
} from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/utils/fileHelpers";
import { toast } from "@/components/ui/use-toast";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";


export default function Dashboard() {
  const navigate = useNavigate();
  const { data, columns, initializeData, isInitialized } = useDataOperations();
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [showCleanModal, setShowCleanModal] = useState<boolean>(false);
  
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Reset input value to allow selecting the same file again
    e.currentTarget.value = '';

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      try {
        // Handle different file types
        if (file.name.toLowerCase().endsWith('.csv')) {
          const jsonData = csvToJson(content);
          if (!jsonData || !jsonData.length) {
            throw new Error("CSV appears to be empty or invalid");
          }
          initializeData(jsonData);
          
          toast({
            title: "File uploaded successfully",
            description: `Loaded ${file.name} with ${jsonData.length} rows.`,
          });
        } else if (file.name.toLowerCase().endsWith('.json')) {
          const jsonData = JSON.parse(content);
          const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
          
          if (!dataArray.length) {
            throw new Error("JSON data appears to be empty");
          }
          
          initializeData(dataArray);
          
          toast({
            title: "File uploaded successfully",
            description: `Loaded ${file.name} with ${dataArray.length} rows.`,
          });
        } else {
          toast({
            title: "Unsupported file format",
            description: "Please upload a CSV or JSON file.",
            variant: "destructive",
          });
          return;
        }
      } catch (error) {
        console.error("Error processing file:", error);
        toast({
          title: "Error processing file",
          description: typeof error === 'object' && error !== null && 'message' in error 
            ? String(error.message)
            : "The file couldn't be processed. Check the format and try again.",
          variant: "destructive",
        });
      }
    };
    
    reader.onerror = () => {
      toast({
        title: "Error reading file",
        description: "The file couldn't be read. It might be corrupted or too large.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  // Handle export
  const handleExport = () => {
    if (!data || !data.length) {
      toast({
        title: "No data to export",
        description: "Please load or create data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const csv = jsonToCsv(data);
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'exported_data.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Data exported successfully",
        description: `Exported ${data.length} rows to CSV.`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    }
  };
  
  // Export as JSON
  const handleExportJson = () => {
    if (!data || !data.length) {
      toast({
        title: "No data to export",
        description: "Please load or create data first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'exported_data.json';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Data exported successfully",
        description: `Exported ${data.length} rows to JSON.`,
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      toast({
        title: "Export failed",
        description: "An error occurred while exporting the data.",
        variant: "destructive",
      });
    }
  };

  // Navigate to manual tools
  const goToManualTools = () => {
    navigate("/manual-tools");
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation */}
      <header className="border-b bg-card/90 backdrop-blur-sm p-2 md:p-3 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2"> 
          <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">\
            
                <BarChart2 className="text-white w-5 h-5" />
              </div>
            <span className="font-bold text-lg">AI Data Canvas</span>
            </Link>
          </div>
          
          
            </h1>

            {/* Mobile menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[85%] max-w-sm">
                <div className="flex flex-col h-full py-4">
                  <h2 className="text-lg font-semibold mb-4 flex items-center">
                    <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                      Data Operations
                    </span>
                  </h2>
                  <Tabs defaultValue="operations" className="flex-1 flex flex-col">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="operations">Operations</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                    <TabsContent value="operations" className="flex-1 overflow-auto">
                      <DataOperationsPanel />
                    </TabsContent>
                    <TabsContent value="history" className="flex-1 overflow-auto">
                      <OperationHistory className="h-full" />
                    </TabsContent>
                  </Tabs>
                  <div className="mt-6 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={goToManualTools}
                    >
                      <Hammer className="mr-2 h-4 w-4" />
                      Advanced Data Tools
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={goToManualTools} 
              className="hidden md:flex"
            >
              <Hammer className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
              <span>Advanced Tools</span>
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setShowCleanModal(true)}>
              <Sparkles className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4 text-amber-500" />
              <span className="hidden xs:inline">AI Auto-Clean</span>
              <span className="xs:hidden">Clean</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-2 sm:px-3">
                  <Upload className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden xs:inline">Import</span>
                  <ChevronRight className="h-3 w-3 ml-0 xs:ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Import Data</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                  <label className="flex w-full items-center cursor-pointer">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    CSV File
                    <input
                      type="file"
                      accept=".csv"
                      className="sr-only"
                      onChange={handleFileUpload}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer">
                  <label className="flex w-full items-center cursor-pointer">
                    <Database className="mr-2 h-4 w-4" />
                    JSON File
                    <input
                      type="file"
                      accept=".json"
                      className="sr-only"
                      onChange={handleFileUpload}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </label>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Import from URL
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={!isInitialized}
                  className="px-2 sm:px-3"
                >
                  <Download className="mr-1 md:mr-2 h-3 md:h-4 w-3 md:w-4" />
                  <span className="hidden xs:inline">Export</span>
                  <ChevronRight className="h-3 w-3 ml-0 xs:ml-1 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Export Data</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleExport}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExportJson}>
                  <Database className="mr-2 h-4 w-4" />
                  Export as JSON
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Options</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={goToManualTools}>
                  <Hammer className="mr-2 h-4 w-4" />
                  <span>Manual Data Tools</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShowCleanModal(true)}>
                  <Sparkles className="mr-2 h-4 w-4 text-amber-500" />
                  <span>AI Auto-Clean</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="hidden md:flex h-8 w-8"
              aria-label="Toggle left sidebar"
            >
              {leftSidebarOpen ? <PanelRight size={16} /> : <PanelLeft size={16} />}
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="hidden md:flex h-8 w-8"
              aria-label="Toggle right sidebar"
            >
              {rightSidebarOpen ? <PanelLeft size={16} /> : <PanelRight size={16} />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-1 overflow-hidden">
        {/* Left Panel (Data Operations) */}
        <div 
          className={`border-r bg-card/40 transition-all duration-300 overflow-hidden hidden md:block
            ${leftSidebarOpen ? 'md:w-[280px] lg:w-[320px]' : 'md:w-0'}`}
        >
          {leftSidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="px-3 py-3 border-b bg-muted/30">
                <h2 className="text-sm font-medium flex items-center justify-between">
                  <span>Data Operations</span>
                </h2>
              </div>
              <div className="p-3 flex-1 overflow-auto">
                <DataOperationsPanel />
              </div>
              <div className="mt-auto">
                <OperationHistory className="border-t border-b bg-muted/30" />
              </div>
            </div>
          )}
        </div>

        {/* Center (Data Preview) */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!isInitialized ? (
            <div className="flex items-center justify-center h-full bg-muted/10">
              <div className="text-center p-4 md:p-6 max-w-md">
                <div className="mb-6 flex justify-center">
                  <div className="inline-flex rounded-full p-4 bg-primary/10">
                    <Sparkles className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <h2 className="text-xl md:text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                  Welcome to AI Data Canvas
                </h2>
                <p className="mb-8 text-muted-foreground">
                  Import a dataset to get started with AI-powered data cleaning and transformation.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <Button variant="default" size="default" asChild className="gap-2">
                    <label className="flex items-center cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Import Dataset
                      <input
                        type="file"
                        accept=".csv,.json"
                        className="sr-only"
                        onChange={handleFileUpload}
                      />
                    </label>
                  </Button>
                  <Button variant="outline" size="default" onClick={goToManualTools} className="gap-2">

                    <BadgePlus />
                    Multi Resource 
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-muted/50 p-2 flex items-center justify-between">
                <span className="text-sm font-medium ml-2">Data Preview</span>
                <Button variant="ghost" size="sm" onClick={goToManualTools} className="gap-1 text-xs">
                  Advanced Tools
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              <DataPreview className="flex-1" />
            </>
          )}
        </div>

        {/* Right Panel (AI & Insights) */}
        <div 
          className={`border-l bg-card/40 transition-all duration-300 overflow-hidden hidden md:block
            ${rightSidebarOpen ? 'md:w-[300px] lg:w-[380px]' : 'md:w-0'}`}
        >
          {rightSidebarOpen && (
            <div className="h-full flex flex-col">
              <div className="px-3 py-3 border-b bg-muted/30">
                <h2 className="text-sm font-medium flex items-center justify-between">
                  <span>AI Insights & Suggestions</span>
                </h2>
              </div>
              <div className="h-full overflow-y-auto">
                <Tabs defaultValue="suggestions" className="w-full h-full">
                  <TabsList className="w-full grid grid-cols-3">
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>
                  <div className="p-3">
                    <TabsContent value="quality">
                      <DataQualityIndicators />
                    </TabsContent>
                    <TabsContent value="suggestions">
                      <AISuggestions />
                    </TabsContent>
                    <TabsContent value="insights">
                      <DataInsights />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      {isInitialized && (
        <div className="md:hidden border-t bg-card/90 backdrop-blur-sm shadow-[0_-2px_5px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-3 p-2 gap-2">
            <Button variant="outline" size="sm" className="w-full" onClick={goToManualTools}>
              <Hammer className="mr-1 h-4 w-4" />
              Advanced
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Sparkles className="mr-1 h-4 w-4 text-purple-500" />
                  Insights
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="h-full flex flex-col">
                  <div className="py-2 text-center border-b">
                    <h2 className="text-lg font-medium">AI Data Insights</h2>
                  </div>
                  <div className="flex-1 overflow-auto p-3 pb-16">
                    <Tabs defaultValue="quality" className="w-full">
                      <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger value="quality">Quality</TabsTrigger>
                        <TabsTrigger value="insights">Insights</TabsTrigger>
                      </TabsList>
                      
                      <div className="mt-4">
                        <TabsContent value="quality">
                          <DataQualityIndicators />
                        </TabsContent>
                        <TabsContent value="insights">
                          <DataInsights />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Sparkles className="mr-1 h-4 w-4 text-amber-500" />
                  Suggest
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <div className="h-full flex flex-col">
                  <div className="py-2 text-center border-b">
                    <h2 className="text-lg font-medium">AI Suggestions</h2>
                  </div>
                  <div className="flex-1 overflow-auto p-3 pb-16">
                    <AISuggestions />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      )}
      
      {/* AI Auto-Clean Modal */}
      <AutoCleanModal 
        open={showCleanModal} 
        onOpenChange={setShowCleanModal} 
      />
    </div>
  );
}