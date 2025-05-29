import { useState } from "react";
import { FileSpreadsheet, Upload, X, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { csvToJson } from "@/lib/utils/fileHelpers";
import { useInsight } from "@/contexts/InsightContext";
import { Spinner, ProcessingOverlay } from "@/components/ui/Spinner";
import { useRef } from "react";

interface FileUploadProps {
  onFileAnalyze?: (file: File, prompt: string) => Promise<void>;
  onPromptSend?: (prompt: string) => Promise<void>;
}

export function FileUpload({ onFileAnalyze, onPromptSend }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("Preparing...");
  const [prompt, setPrompt] = useState("");
  const [hasAnalyzedFile, setHasAnalyzedFile] = useState(false);
  const { toast } = useToast();

  const { setDataInsights } = useInsight();
  const promptInputRef = useRef<HTMLTextAreaElement>(null);

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

  // Simulate progress for better UX
  const startProgressSimulation = () => {
    setUploadProgress(0);
    
    // Quickly go to 20% to show immediate feedback
    const timer1 = setTimeout(() => {
      setUploadProgress(20);
    }, 200);
    
    // Then slower progress up to 90%
    const timer2 = setTimeout(() => {
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newValue = prev + (Math.random() * 3);
          if (newValue >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newValue;
        });
      }, 300);
      
      // Clean up interval after 10 seconds max
      setTimeout(() => clearInterval(interval), 10000);
      
      return () => clearInterval(interval);
    }, 500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  };

  const sendFileToBackend = async (file: File) => {
    // Get the current prompt value from the ref
    const currentPrompt = promptInputRef.current?.value || prompt;
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append('customPrompt', currentPrompt || 'what is average quantityordered');

    setIsUploading(true);
    setProcessingStatus("Uploading file...");
    
    // Start progress simulation
    const stopProgress = startProgressSimulation();

    try {
      const response = await axios.post(

        "https://allan30joseph.app.n8n.cloud/webhook/upload-dataset",

        formData
      );
      console.log("Response:", response.data);
      
      // Set progress to 100% when complete
      setUploadProgress(100);
      setProcessingStatus("Processing complete");
      
      // Process data insights
      if (response.data && response.data.output) {
        setDataInsights(response.data.output);
        setHasAnalyzedFile(true);
        
        toast({
          title: "Analysis complete",
          description: "Your data has been processed successfully.",
        });
      }
      
      // Wait a moment to show the complete state
      await new Promise(resolve => setTimeout(resolve, 800));

    } catch (error) {
      console.error("Upload failed:", error);
      
      toast({
        title: "Upload failed",
        description: typeof error === 'object' && error !== null && 'message' in error 
          ? String(error.message)
          : "There was a problem with your upload. Please try again.",
        variant: "destructive",
      });
    } finally {
      // Clean up progress simulation
      stopProgress();
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const sendPromptToBackend = async (promptText: string) => {
    try {
      const response = await axios.post(
        "https://allan30joseph.app.n8n.cloud/webhook/chat",
        {
          customPrompt: "average sales of each product",
          promptOnly: true // Flag to indicate this is a prompt-only request
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Prompt response:", response.data);
      
      // Process response if needed
      if (response.data && response.data.output) {
        setDataInsights(response.data.output);
      }
      
      return response.data;
    } catch (error) {
      console.error("Prompt send failed:", error);
      throw error;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Reset input value to allow selecting the same file again
    e.currentTarget.value = '';
    
    handleFiles(Array.from([selectedFile]));
  };

  const handleFiles = (files: FileList | File[]) => {
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
    // Get the current prompt value from the ref
    const currentPrompt = promptInputRef.current?.value || prompt;
    
    if (!currentPrompt.trim() && !file) {
      toast({
        title: "Input required",
        description: "Please enter a prompt or upload a file",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    try {
      if (!hasAnalyzedFile && file) {
        setProcessingStatus("Analyzing file...");
        await sendFileToBackend(file);
      } else {
        // Handle sending prompt only
        setProcessingStatus("Processing prompt...");
        
        if (onPromptSend) {
          await onPromptSend(currentPrompt);
        } else {
          // Send prompt to n8n backend
          await sendPromptToBackend(currentPrompt);
        }
        
        toast({
          title: "Prompt sent",
          description: "Your prompt has been processed",
        });
      }
      
      // Clear prompt after successful submission
      setPrompt("");
      if (promptInputRef.current) {
        promptInputRef.current.value = "";
      }
      
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

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPrompt(value);
    // Sync the ref value with state
    if (promptInputRef.current) {
      promptInputRef.current.value = value;
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
    <Card className="w-full relative">
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
                  onChange={handleFileUpload} 
                />
                Browse Files
              </label>
            </Button>
          </div>
        ) : (
          <div className="p-4 border rounded-md relative">
            {/* Processing overlay */}
            <ProcessingOverlay 
              isLoading={isUploading} 
              progress={uploadProgress} 
              status={processingStatus}
            />
            
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
              {hasAnalyzedFile ? "Send another prompt:" : "prompt "}
            </label>
            <textarea
              ref={promptInputRef}
              value={prompt}
              onChange={handlePromptChange}
              placeholder="Enter your prompt here..."
              className="w-full p-3 border rounded-md resize-vertical min-h-20"
              disabled={isUploading}
            />
            
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={handleAnalyzeOrSend} 
                disabled={isUploading || (!file && !prompt.trim())} 
                className="gap-2"
              >
                {isUploading ? (
                  <>
                    <span>{getButtonText()}</span>
                    <Spinner size="sm" />
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