import { useState } from "react";
import { FileSpreadsheet, Upload, X, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileAnalyze?: (file: File, prompt: string) => Promise<void>;
  onPromptSend?: (prompt: string) => Promise<void>;
}

export function FileUpload({ onFileAnalyze, onPromptSend }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [hasAnalyzedFile, setHasAnalyzedFile] = useState(false); // Track if file has been analyzed
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'xlsx' || fileExt === 'xls' || fileExt === 'csv') {
        setFile(selectedFile);
        // Reset the analyzed state when new file is selected
        setHasAnalyzedFile(false);
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload an Excel or CSV file",
          variant: "destructive"
        });
      }
    }
  };

  const handleAnalyzeOrSend = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a prompt before proceeding",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      if (!hasAnalyzedFile && file) {
        // First time: send file + prompt
        if (onFileAnalyze) {
          await onFileAnalyze(file, prompt);
          setHasAnalyzedFile(true);
          toast({
            title: "Analysis successful",
            description: "Your file has been analyzed with the provided prompt",
          });
        } else {
          // Mock file analysis with prompt
          await new Promise(resolve => setTimeout(resolve, 2000));
          setHasAnalyzedFile(true);
          toast({
            title: "Analysis successful",
            description: "Your file has been analyzed with the provided prompt",
          });
        }
      } else {
        // Subsequent times: send only prompt
        if (onPromptSend) {
          await onPromptSend(prompt);
          toast({
            title: "Prompt sent",
            description: "Your prompt has been processed",
          });
        } else {
          // Mock prompt sending
          await new Promise(resolve => setTimeout(resolve, 1000));
          toast({
            title: "Prompt sent",
            description: "Your prompt has been processed",
          });
        }
      }
      
      // Clear prompt after successful submission
      setPrompt("");
      
    } catch (error) {
      toast({
        title: "Process failed",
        description: "There was an issue processing your request",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setHasAnalyzedFile(false);
  };

  const getButtonText = () => {
    if (isUploading) {
      return hasAnalyzedFile || !file ? "Sending..." : "Analyzing...";
    }
    return hasAnalyzedFile || !file ? "Send Prompt" : "Analyze File";
  };

  const getButtonIcon = () => {
    if (hasAnalyzedFile || !file) {
      return <Send className="h-4 w-4" />;
    }
    return <Upload className="h-4 w-4" />;
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-6">Upload Excel File</h3>
        
        {!file ? (
          <div 
            className={`data-upload-zone ${isDragging ? 'border-primary bg-secondary/70' : ''} min-h-40 flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">Drag & Drop Excel File</p>
            <p className="text-sm text-muted-foreground mb-6">Or click to browse</p>
            
            <Button variant="outline" asChild>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden"
                  accept=".xlsx,.xls,.csv" 
                  onChange={handleFileInput} 
                />
                Browse Files
              </label>
            </Button>
          </div>
        ) : (
          <div className="p-4 border rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <FileSpreadsheet className="h-8 w-8" />
                  {hasAnalyzedFile && <Check className="h-4 w-4 text-green-600" />}
                </div>
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                    {hasAnalyzedFile && " • Analyzed"}
                  </p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={removeFile} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Prompt textarea - shown when file is selected OR file has been analyzed */}
        {(file || hasAnalyzedFile) && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-2">
              {hasAnalyzedFile ? "Send another prompt:" : "Enter your prompt for analysis:"}
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full p-3 border rounded-md resize-vertical min-h-20"
              disabled={isUploading}
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleAnalyzeOrSend} 
                disabled={isUploading || !prompt.trim()} 
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    {getButtonText()} <span className="animate-pulse">...</span>
                  </>
                ) : (
                  <>
                    {getButtonText()} {getButtonIcon()}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          Supported formats: .xlsx, .xls, .csv
          {hasAnalyzedFile && " • File already analyzed, now sending prompts only"}
        </div>
      </CardContent>
    </Card>
  );
}