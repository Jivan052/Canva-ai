
import { useState } from "react";
import { FileSpreadsheet, Upload, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileAnalyze?: (file: File) => Promise<void>;
}

export function FileUpload({ onFileAnalyze }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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
      } else {
        toast({
          title: "Invalid file format",
          description: "Please upload an Excel or CSV file",
          variant: "destructive"
        });
      }
    }
  };

  const uploadFile = async () => {
    if (!file) return;
    
    setIsUploading(true);
    
    try {
      if (onFileAnalyze) {
        await onFileAnalyze(file);
      } else {
        // Mock upload process - in real app this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast({
          title: "Upload successful",
          description: "Your file has been uploaded and is being analyzed",
        });
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an issue uploading your file",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
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
                <FileSpreadsheet className="h-8 w-8" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              
              <Button variant="ghost" size="sm" onClick={removeFile} disabled={isUploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-6 flex justify-end">
              <Button onClick={uploadFile} disabled={isUploading} className="gap-2">
                {isUploading ? (
                  <>Processing <span className="animate-pulse">...</span></>
                ) : (
                  <>Analyze <Upload className="h-4 w-4" /></>
                )}
              </Button>
            </div>
          </div>
        )}
        
        <div className="mt-4 text-xs text-muted-foreground">
          Supported formats: .xlsx, .xls, .csv
        </div>
      </CardContent>
    </Card>
  );
}
