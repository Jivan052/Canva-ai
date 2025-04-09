
import { Sparkles, AlertCircle } from "lucide-react";

interface AIProcessingIndicatorProps {
  status: "idle" | "loading" | "analyzing" | "complete" | "error";
  progress?: number;
}

export function AIProcessingIndicator({ status, progress = 0 }: AIProcessingIndicatorProps) {
  const getStatusText = () => {
    switch (status) {
      case "idle":
        return "Ready for analysis";
      case "loading":
        return "Preparing data";
      case "analyzing":
        return "AI analyzing data";
      case "complete":
        return "Analysis complete";
      case "error":
        return "Analysis failed";
    }
  };

  return (
    <div className={`flex items-center justify-center space-x-3 py-4 px-6 rounded-lg ${status === "error" ? "bg-red-50 border border-red-200" : "bg-secondary border border-border"}`}>
      <div className={`relative ${status === "analyzing" ? "animate-spin-slow" : ""}`}>
        {status === "error" ? (
          <AlertCircle className="h-5 w-5 text-red-500" />
        ) : (
          <Sparkles className="h-5 w-5" />
        )}
      </div>
      <div>
        <p className={`font-medium ${status === "error" ? "text-red-700" : ""}`}>{getStatusText()}</p>
        
        {status !== "idle" && status !== "complete" && status !== "error" && (
          <div className="w-full bg-secondary-foreground/10 rounded-full h-1.5 mt-2">
            <div 
              className="bg-black h-1.5 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
