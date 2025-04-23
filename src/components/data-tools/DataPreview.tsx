import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  Search, 
  RotateCcw,
  Eye,
  Download,
  Filter,
  MoreHorizontal,
  ChevronDown,
  SlidersHorizontal,
  X,
  Database
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useDataOperations } from "@/hooks/useDataOperations";
import { getColumnStats } from "@/lib/utils/dataHelpers";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DataPreviewProps {
  className?: string;
  data?: Record<string, any>[];
  columns?: string[];
}

export function DataPreview({ className, data: propData, columns: propColumns }: DataPreviewProps) {
  const { data: contextData, columns: contextColumns, isInitialized } = useDataOperations();
  
  // Use props data if provided, otherwise use context data
  const data = propData || contextData || [];
  const columns = propColumns || contextColumns || [];
  
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(15);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchColumn, setSearchColumn] = useState<string>("all");
  const [showSearchOptions, setShowSearchOptions] = useState<boolean>(false);
  
  // Calculate filtered data based on search terms
  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    return data.filter(row => {
      if (searchColumn === "all") {
        // Search across all columns
        return Object.entries(row).some(([key, value]) => 
          String(value).toLowerCase().includes(term)
        );
      } else {
        // Search in specific column
        return String(row[searchColumn] || '').toLowerCase().includes(term);
      }
    });
  }, [data, searchTerm, searchColumn]);
  
  // Reset page when filtered data changes
  useEffect(() => {
    setPage(0);
  }, [filteredData.length]);
  
  // Calculate page info
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = page * pageSize;
  const endIndex = Math.min(startIndex + pageSize, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);
  
  // Handle page changes
  const goToPage = (newPage: number) => {
    setPage(Math.max(0, Math.min(newPage, totalPages - 1)));
  };
  
  // Handle search reset
  const resetSearch = () => {
    setSearchTerm("");
    setSearchColumn("all");
  };
  
  // Responsive column handling
  const getVisibleColumnCount = () => {
    const width = window.innerWidth;
    if (width < 640) return 2; // Mobile: show 2 columns
    if (width < 768) return 3; // Small tablets: show 3 columns
    if (width < 1024) return 5; // Tablets: show 5 columns
    if (width < 1280) return 7; // Small desktops: show 7 columns
    return 9; // Large screens: show 9 columns
  };
  
  // Calculate visible columns
  const visibleColumnCount = getVisibleColumnCount();
  const visibleColumns = columns.slice(0, visibleColumnCount);
  const hiddenColumnsCount = Math.max(0, columns.length - visibleColumns.length);
  
  // Calculate column statistics
  const stats = useMemo(() => getColumnStats(data), [data]);
  
  // If data is not loaded yet
  if (!data?.length) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-[400px] rounded-md border-2 border-dashed", className)}>
        <Database className="h-12 w-12 mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-medium mb-1">No Data Available</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Please import a dataset or load data to view
        </p>
      </div>
    );
  }
  
  return (
    <div className={cn("flex flex-col h-[calc(100%-1rem)]", className)}>
      {/* Controls header with search and filters */}
      <div className="flex-shrink-0 space-y-2 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search bar with icon */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-9 w-full pr-8"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-9 w-9"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Search options */}
          <Popover open={showSearchOptions} onOpenChange={setShowSearchOptions}>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 flex items-center gap-1.5"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Options</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72" align="end">
              <div className="space-y-3">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Search Options</h4>
                  <Select
                    value={searchColumn}
                    onValueChange={setSearchColumn}
                  >
                    <SelectTrigger className="w-full h-8">
                      <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Columns</SelectItem>
                      {columns.map(column => (
                        <SelectItem key={column} value={column}>
                          {column}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Rows per page</h4>
                  <div className="flex gap-2">
                    {[10, 15, 25, 50].map((size) => (
                      <Button
                        key={size}
                        variant={pageSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPageSize(size)}
                        className="flex-1 h-7 text-xs"
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between pt-2 border-t">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={resetSearch}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                    Reset
                  </Button>
                  
                  <Button 
                    size="sm"
                    onClick={() => setShowSearchOptions(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Export button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-9"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportData("csv")}>
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportData("json")}>
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Data info bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">{filteredData.length}</span>
            <span className="text-muted-foreground">
              {filteredData.length === 1 ? 'row' : 'rows'}
              {filteredData.length !== data.length && (
                <> (filtered from {data.length})</>
              )}
            </span>
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetSearch}
                className="h-6 text-xs ml-1.5"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
          
          {/* Page indicator for larger screens */}
          {totalPages > 1 && (
            <div className="hidden sm:flex items-center text-xs text-muted-foreground">
              Page {page + 1} of {totalPages}
            </div>
          )}
        </div>
      </div>
      
      {/* Table with proper overflow handling */}
      <div className="flex-1 min-h-0 border rounded-md overflow-hidden bg-white dark:bg-muted/10">
        <div className="h-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10">
              <TableRow>
                {visibleColumns.map((column) => (
                  <TableHead 
                    key={column} 
                    className="whitespace-nowrap bg-muted/40 font-medium py-2"
                  >
                    <div className="flex items-center gap-1">
                      <span className="truncate max-w-[150px]">{column}</span>
                      {stats[column] && (
                        <Badge 
                          variant="outline" 
                          className="font-normal text-[10px] h-5 px-1 ml-1"
                        >
                          {stats[column].type === 'number' ? 'num' : 
                           stats[column].type === 'string' ? 'str' : 
                           stats[column].type.slice(0, 4)}
                        </Badge>
                      )}
                    </div>
                  </TableHead>
                ))}
                
                {hiddenColumnsCount > 0 && (
                  <TableHead className="bg-muted/40 whitespace-nowrap w-[80px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-xs flex gap-1"
                        >
                          +{hiddenColumnsCount} more
                          <ChevronDown className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
                        <DropdownMenuSeparator />
                        {columns.slice(visibleColumnCount).map((col) => (
                          <DropdownMenuItem key={col} className="text-xs">
                            {col}
                            {stats[col] && (
                              <Badge 
                                variant="outline" 
                                className="ml-auto font-normal text-[10px] h-5 px-1"
                              >
                                {stats[col].type === 'number' ? 'number' : 
                                 stats[col].type === 'string' ? 'string' : 
                                 stats[col].type}
                              </Badge>
                            )}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {currentPageData.length > 0 ? (
                currentPageData.map((row, rowIndex) => (
                  <TableRow key={rowIndex} className="hover:bg-muted/20">
                    {visibleColumns.map((column) => {
                      const cellValue = row[column];
                      const isNull = cellValue === null || cellValue === undefined;
                      const valueToShow = isNull ? '' : String(cellValue);
                      const isLongText = valueToShow.length > 30;
                      
                      return (
                        <TableCell 
                          key={`${rowIndex}-${column}`}
                          className="py-2 px-3"
                        >
                          {isNull ? (
                            <span className="text-muted-foreground italic text-xs">null</span>
                          ) : isLongText ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button 
                                  variant="link" 
                                  className="h-auto p-0 text-left font-normal text-xs sm:text-sm"
                                >
                                  <span className="truncate block max-w-[150px]">
                                    {valueToShow}
                                  </span>
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] max-w-[80vw]">
                                <p className="text-sm break-words">{valueToShow}</p>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <span className="text-xs sm:text-sm">{valueToShow}</span>
                          )}
                        </TableCell>
                      );
                    })}
                    
                    {hiddenColumnsCount > 0 && (
                      <TableCell className="w-[60px] text-right px-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <div className="text-xs px-2 py-1.5 text-muted-foreground">
                              Hidden columns
                            </div>
                            <DropdownMenuSeparator />
                            {columns.slice(visibleColumnCount).map((col) => {
                              const value = row[col];
                              const isNull = value === null || value === undefined;
                              
                              return (
                                <DropdownMenuItem key={col} className="text-xs">
                                  <span className="font-medium mr-2">{col}:</span>
                                  {isNull ? (
                                    <span className="italic text-muted-foreground">null</span>
                                  ) : (
                                    <span className="truncate max-w-[200px]">{String(value)}</span>
                                  )}
                                </DropdownMenuItem>
                              );
                            })}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={visibleColumns.length + (hiddenColumnsCount > 0 ? 1 : 0)} 
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-muted-foreground">
                      <Filter className="h-8 w-8 mb-2 opacity-40" />
                      <p>No results found.</p>
                      {searchTerm && (
                        <Button 
                          variant="link" 
                          size="sm" 
                          onClick={resetSearch}
                          className="mt-2"
                        >
                          Clear filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3">
          <div className="flex text-xs text-muted-foreground order-2 sm:order-1">
            Showing {startIndex + 1}-{endIndex} of {filteredData.length} rows
          </div>
          
          <div className="flex items-center gap-1 order-1 sm:order-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToPage(0)}
              disabled={page === 0}
              className="h-8 w-8"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {/* Numeric pagination - visible on larger screens */}
            <div className="hidden sm:flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (page < 2) {
                  pageNum = i;
                } else if (page > totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                if (pageNum >= 0 && pageNum < totalPages) {
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="icon"
                      onClick={() => goToPage(pageNum)}
                      className="h-8 w-8"
                    >
                      {pageNum + 1}
                    </Button>
                  );
                }
                return null;
              })}
            </div>
            
            {/* Mobile page indicator */}
            <div className="sm:hidden flex items-center">
              <Input
                type="number"
                min={1}
                max={totalPages}
                value={page + 1}
                onChange={(e) => goToPage(Number(e.target.value) - 1)}
                className="h-8 w-12 text-center p-1 mx-1"
              />
              <span className="text-xs text-muted-foreground">/ {totalPages}</span>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages - 1}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => goToPage(totalPages - 1)}
              disabled={page === totalPages - 1}
              className="h-8 w-8"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
  
  // Export data function
  function exportData(format: "csv" | "json") {
    try {
      let content: string;
      let fileName: string;
      let mimeType: string;
      
      if (format === "csv") {
        // Create CSV content
        const headers = columns.join(',');
        const rows = data.map(row => 
          columns.map(col => {
            const value = row[col];
            // Handle values with commas by wrapping in quotes
            if (typeof value === 'string' && value.includes(',')) {
              return `"${value}"`;
            }
            return value ?? '';
          }).join(',')
        );
        content = [headers, ...rows].join('\n');
        fileName = 'data_export.csv';
        mimeType = 'text/csv;charset=utf-8;';
      } else {
        // JSON export
        content = JSON.stringify(data, null, 2);
        fileName = 'data_export.json';
        mimeType = 'application/json;charset=utf-8;';
      }
      
      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  }
}