import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  variant?: "default" | "primary" | "secondary";
  className?: string;
}

export function Spinner({
  size = "md",
  variant = "primary",
  className,
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  const variantClasses = {
    default: "border-muted-foreground/20 border-t-muted-foreground",
    primary: "border-primary/20 border-t-primary",
    secondary: "border-secondary-foreground/20 border-t-secondary",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    />
  );
}

interface UploadProgressProps {
  progress: number;
  status?: string;
  className?: string;
}

export function UploadProgress({ 
  progress, 
  status,
  className 
}: UploadProgressProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center">
        <p className="text-sm font-medium text-muted-foreground">
          {status || "Uploading..."}
        </p>
        <span className="text-sm font-medium">{Math.round(progress)}%</span>
      </div>
      
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

interface ProcessingOverlayProps {
  isLoading: boolean;
  progress?: number;
  status?: string;
  className?: string;
}

export function ProcessingOverlay({
  isLoading,
  progress = 0,
  status = "Processing...",
  className,
}: ProcessingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className={cn(
      "absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm z-10 rounded-lg",
      className
    )}>
      <div className="text-center space-y-4 max-w-xs mx-auto p-6">
        <Spinner size="lg" />
        <h3 className="text-lg font-medium">{status}</h3>
        
        {progress > 0 && (
          <UploadProgress 
            progress={progress} 
            status={progress < 100 ? "Uploading..." : "Processing data..."} 
          />
        )}
      </div>
    </div>
  );
}