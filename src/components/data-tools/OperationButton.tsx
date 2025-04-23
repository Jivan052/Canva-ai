import React, { useState } from "react";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger,
  TooltipProvider 
} from "@/components/ui/tooltip";
import { LucideIcon, ChevronRight, ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface OperationButtonProps extends ButtonProps {
  icon: LucideIcon; // Making icon required instead of optional
  label: string;
  description?: string;
  tooltip?: string;
  collapsible?: boolean;
  children?: React.ReactNode;
  badgeCount?: number;
  highlight?: boolean;
  iconOnly?: boolean; // New prop to control icon-only mode (defaults to true)
}

export function OperationButton({ 
  icon: Icon, 
  label, 
  description, 
  tooltip,
  className, 
  variant = "outline", 
  size = "default",
  collapsible = false,
  children,
  badgeCount,
  highlight = false,
  iconOnly = true, // Default to icon-only mode
  ...props 
}: OperationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Create base button content
  const buttonInnerContent = (
    <>
      <div className={cn(
        "flex-shrink-0 flex items-center justify-center",
        iconOnly && "mx-auto"
      )}>
        <Icon className={cn(
          "h-5 w-5", 
          highlight && "text-primary"
        )} />
      </div>
      
      {/* Show text only if not in icon-only mode */}
      {!iconOnly && (
        <div className={cn(
          "flex flex-col gap-0.5 text-left ml-2",
          !description && "flex-1"
        )}>
          <span className={cn(
            "line-clamp-1",
            highlight && "font-medium text-primary"
          )}>
            {label}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground font-normal line-clamp-2 max-md:hidden">
              {description}
            </span>
          )}
        </div>
      )}
      
      {badgeCount !== undefined && (
        <div className={cn(
          "flex items-center justify-center",
          iconOnly ? "-mt-6 -mr-6" : "ml-auto"
        )}>
          <span className="inline-flex items-center rounded-full bg-primary/90 text-primary-foreground px-1.5 py-0.5 text-xs font-medium min-w-[18px] text-center">
            {badgeCount}
          </span>
        </div>
      )}
      
      {collapsible && !iconOnly && (
        <div className="ml-auto flex-shrink-0">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      )}
    </>
  );
  
  // Determine button size and classes based on icon-only mode
  const buttonSize = iconOnly ? "icon" : size;
  
  // Create the main button without collapsible content
  const buttonContent = (
    <Button 
      variant={variant} 
      size={buttonSize}
      className={cn(
        "transition-all duration-200",
        iconOnly ? "relative h-10 w-10" : "flex items-center gap-2 w-full", 
        description && !iconOnly && "flex-row items-center justify-start gap-2 h-auto py-2 px-3",
        collapsible && !iconOnly && "justify-between",
        highlight && "border-primary/50 bg-primary/5 hover:bg-primary/10",
        className
      )}
      {...props}
    >
      {buttonInnerContent}
    </Button>
  );
  
  // Always use tooltip in icon-only mode, otherwise use it if specified
  const effectiveTooltip = iconOnly ? label : tooltip;
  
  // Wrap with tooltip if needed
  const wrappedButton = effectiveTooltip ? (
    <TooltipProvider>
      <Tooltip delayDuration={iconOnly ? 100 : 300}>
        <TooltipTrigger asChild>
          {buttonContent}
        </TooltipTrigger>
        <TooltipContent side="bottom" className={iconOnly ? "font-medium" : ""}>
          <p>{effectiveTooltip}</p>
          {iconOnly && description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    buttonContent
  );
  
  // Handle collapsible content
  if (collapsible && children) {
    return (
      <Collapsible 
        open={isOpen} 
        onOpenChange={setIsOpen} 
        className={cn(
          "rounded-md overflow-hidden transition-all duration-200",
          iconOnly ? "w-auto" : "w-full"
        )}
      >
        <CollapsibleTrigger asChild>
          {wrappedButton}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className={cn(
            "py-2 my-0.5",
            iconOnly 
              ? "px-1" 
              : "px-2 pl-8 border-l-2 ml-6",
            highlight ? "border-primary/40" : "border-muted-foreground/20",
          )}>
            {children}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
  
  return wrappedButton;
}

/**
 * Group of operation buttons with responsive grid layout
 * Optimized for icon-only buttons
 */
interface OperationButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  iconMode?: boolean; // Defaults to true for icon grid layout
}

export function OperationButtonGroup({ 
  children, 
  className,
  title,
  iconMode = true
}: OperationButtonGroupProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {title && (
        <h4 className="text-sm font-medium mb-1.5">{title}</h4>
      )}
      <div className={cn(
        "grid gap-2",
        iconMode 
          ? "grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10" 
          : "grid-cols-1"
      )}>
        {children}
      </div>
    </div>
  );
}