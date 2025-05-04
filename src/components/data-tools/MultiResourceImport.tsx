import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  FileSpreadsheet,
  Database,
  Globe,
  FileJson,
  Loader2,
  Cloud,
  FilePlus2,
  CircleUser,
  Github,
  Upload,
} from "lucide-react";
import { useDataOperations } from "@/hooks/useDataOperations";
import { csvToJson } from "@/lib/utils/fileHelpers";

interface MultiResourceImportProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MultiResourceImport({ open, onOpenChange }: MultiResourceImportProps) {
  const [activeTab, setActiveTab] = useState("google-sheets");
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiEndpoint, setApiEndpoint] = useState("");
  const [gistId, setGistId] = useState("");
  const { initializeData } = useDataOperations();

  const handleGoogleSheetsImport = async () => {
    if (!url.trim()) {
      toast({
        title: "Missing URL",
        description: "Please enter a Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    // Validate if it's a Google Sheets URL
    if (!url.includes("docs.google.com/spreadsheets")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract the sheet ID from the URL
      const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match) {
        throw new Error("Invalid Google Sheets URL");
      }
      
      const sheetId = match[1];
      
      // Format the URL for the Google Sheets API
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
      
      // Fetch the data
      const response = await fetch(exportUrl);
      
      if (!response.ok) {
        throw new Error("Failed to fetch Google Sheet. Make sure it's shared publicly.");
      }
      
      const csvData = await response.text();
      const jsonData = csvToJson(csvData);
      
      if (!jsonData || !jsonData.length) {
        throw new Error("The sheet appears to be empty or inaccessible");
      }
      
      initializeData(jsonData);
      
      toast({
        title: "Google Sheet imported successfully",
        description: `Loaded ${jsonData.length} rows from the spreadsheet.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing Google Sheet:", error);
      toast({
        title: "Import failed",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Failed to import the Google Sheet. Check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApiImport = async () => {
    if (!apiEndpoint.trim()) {
      toast({
        title: "Missing API Endpoint",
        description: "Please enter an API endpoint URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Configure headers if API key is provided
      const headers: HeadersInit = {};
      if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`;
      }
      
      // Fetch the data
      const response = await fetch(apiEndpoint, { headers });
      
      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }
      
      const jsonData = await response.json();
      
      // Handle both array and object responses
      const dataArray = Array.isArray(jsonData) ? jsonData : 
                        jsonData.data ? jsonData.data : 
                        jsonData.results ? jsonData.results : 
                        [jsonData];
      
      if (!dataArray.length) {
        throw new Error("The API response doesn't contain any data");
      }
      
      initializeData(dataArray);
      
      toast({
        title: "API data imported successfully",
        description: `Loaded ${dataArray.length} rows from the API.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing API data:", error);
      toast({
        title: "Import failed",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Failed to import data from the API. Check the endpoint and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGistImport = async () => {
    if (!gistId.trim()) {
      toast({
        title: "Missing Gist ID",
        description: "Please enter a GitHub Gist ID or URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Extract the Gist ID if a full URL was provided
      let extractedGistId = gistId;
      if (gistId.includes('github.com/gist/')) {
        const match = gistId.match(/github\.com\/gist\/([a-zA-Z0-9]+)/);
        if (match) extractedGistId = match[1];
      } else if (gistId.includes('gist.github.com/')) {
        const match = gistId.match(/gist\.github\.com\/[^/]+\/([a-zA-Z0-9]+)/);
        if (match) extractedGistId = match[1];
      }
      
      // Fetch the gist
      const response = await fetch(`https://api.github.com/gists/${extractedGistId}`);
      
      if (!response.ok) {
        throw new Error(`GitHub API returned status ${response.status}`);
      }
      
      const gistData = await response.json();
      
      // Find the first CSV or JSON file in the gist
      const files = gistData.files;
      if (!files) {
        throw new Error("No files found in this gist");
      }
      
      // Find files with csv or json extensions
      let fileContent = null;
      let fileType = "";
      
      for (const filename in files) {
        if (filename.endsWith(".csv")) {
          fileContent = files[filename].content;
          fileType = "csv";
          break;
        } else if (filename.endsWith(".json")) {
          fileContent = files[filename].content;
          fileType = "json";
          break;
        }
      }
      
      if (!fileContent) {
        throw new Error("No CSV or JSON files found in this gist");
      }
      
      // Process the file content
      let jsonData;
      if (fileType === "csv") {
        jsonData = csvToJson(fileContent);
      } else {
        jsonData = JSON.parse(fileContent);
        if (!Array.isArray(jsonData)) {
          jsonData = [jsonData];
        }
      }
      
      if (!jsonData || !jsonData.length) {
        throw new Error("The file appears to be empty or invalid");
      }
      
      initializeData(jsonData);
      
      toast({
        title: "GitHub Gist imported successfully",
        description: `Loaded ${jsonData.length} rows from the gist.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error("Error importing GitHub Gist:", error);
      toast({
        title: "Import failed",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "Failed to import data from GitHub Gist. Check the Gist ID and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FilePlus2 className="h-5 w-5" />
            Import Data from Multiple Sources
          </DialogTitle>
          <DialogDescription>
            Connect to different data sources to import your dataset
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="google-sheets" className="flex items-center gap-1">
              <CircleUser className="h-3.5 w-3.5 text-red-500" />
              <span className="hidden sm:inline">Google Sheets</span>
              <span className="sm:hidden">Sheets</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-1">
              <Globe className="h-3.5 w-3.5 text-blue-500" />
              <span className="hidden sm:inline">REST API</span>
              <span className="sm:hidden">API</span>
            </TabsTrigger>
            <TabsTrigger value="github-gist" className="flex items-center gap-1">
              <Github className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">GitHub Gist</span>
              <span className="sm:hidden">Gist</span>
            </TabsTrigger>
          </TabsList>
          
          <div className="mt-4 space-y-6">
            <TabsContent value="google-sheets" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center mb-1">
                  <CircleUser className="h-5 w-5 text-red-500 mr-2" />
                  <h3 className="text-lg font-medium">Import from Google Sheets</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Enter the URL of a published Google Sheet. Make sure the sheet is shared
                  with "Anyone with the link" view access.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sheets-url">Google Sheets URL</Label>
                <Input
                  id="sheets-url"
                  placeholder="https://docs.google.com/spreadsheets/d/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />

              </div>
            </TabsContent>
            
            <TabsContent value="api" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center mb-1">
                  <Globe className="h-5 w-5 text-blue-500 mr-2" />
                  <h3 className="text-lg font-medium">Import from API</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import data from a REST API endpoint returning JSON data.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-endpoint">API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  placeholder="https://api.example.com/data"
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key (Optional)</Label>
                <Input
                  id="api-key"
                  placeholder="Enter API key if required"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Will be sent as Bearer token in Authorization header
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="github-gist" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center mb-1">
                  <Github className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-medium">Import from GitHub Gist</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Import a CSV or JSON file from a public GitHub Gist.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="gist-id">Gist ID or URL</Label>
                <Input
                  id="gist-id"
                  placeholder="e.g. a1b2c3d4e5f6g7h8i9j0"
                  value={gistId}
                  onChange={(e) => setGistId(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter the Gist ID or full Gist URL containing a CSV or JSON file
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-2 sm:mt-0"
          >
            Cancel
          </Button>
          
          <Button
            onClick={() => {
              if (activeTab === "google-sheets") {
                handleGoogleSheetsImport();
              } else if (activeTab === "api") {
                handleApiImport();
              } else if (activeTab === "github-gist") {
                handleGistImport();
              }
            }}
            disabled={isLoading}
            className="gap-2 mt-2 sm:mt-0"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}