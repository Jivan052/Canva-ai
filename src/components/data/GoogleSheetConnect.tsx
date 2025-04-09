
import { useState } from "react";
import { FileSpreadsheet, RefreshCw, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface GoogleSheetConnectProps {
  onSheetAnalyze?: (url: string) => Promise<void>;
}

export function GoogleSheetConnect({ onSheetAnalyze }: GoogleSheetConnectProps) {
  const [url, setUrl] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    // Validate URL
    if (!url.includes("docs.google.com/spreadsheets")) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Google Sheets URL",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      if (onSheetAnalyze) {
        await onSheetAnalyze(url);
      } else {
        // Mock connection process - in real app this would be an OAuth flow
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsConnected(true);
      toast({
        title: "Connection successful",
        description: "Your Google Sheet has been connected",
      });
    } catch (error) {
      toast({
        title: "Connection failed",
        description: "There was an issue connecting to your Google Sheet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setUrl("");
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-6">Connect Google Sheet</h3>
        
        {!isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-6">
              <FileSpreadsheet className="h-6 w-6 text-muted-foreground" />
              <p>Enter the URL of your Google Sheet</p>
            </div>
            
            <Input
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mb-4"
            />
            
            <div className="flex justify-end">
              <Button 
                onClick={handleConnect} 
                disabled={!url || isConnecting}
                className="gap-2"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect & Analyze"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-1 rounded-full bg-primary">
                  <Check className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-medium">Connected to Google Sheet</p>
                  <p className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                    {url}
                  </p>
                </div>
              </div>
              
              <Button variant="outline" size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open
                </a>
              </Button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={handleDisconnect}>
                Disconnect
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          Make sure your Google Sheet is shared with view access
        </div>
      </CardContent>
    </Card>
  );
}
