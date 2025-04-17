import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { useDataset, Dataset } from "@/hooks/useDataset";
import { useToast } from "@/hooks/use-toast";
import { ChevronDown, Filter, Trash2, Wand, ArrowDownUp, CheckCircle2, Ban, FileWarning } from "lucide-react";

export function DataFormulator() {
  const { currentDataset, updateDataset, resetToOriginal } = useDataset();
  const { toast } = useToast();
  const [filterDialog, setFilterDialog] = useState(false);
  const [missingValueDialog, setMissingValueDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filters, setFilters] = useState<{column: string, operator: string, value: string}[]>([]);
  const [columnTotals, setColumnTotals] = useState<Record<string, {total: number, missing: number}>>({});
  
  // Calculate column stats when dataset changes
  useState(() => {
    if (!currentDataset) return;
    
    const stats: Record<string, {total: number, missing: number}> = {};
    
    currentDataset.columns.forEach((column, colIndex) => {
      const total = currentDataset.data.length;
      const missing = currentDataset.data.filter(row => 
        row[colIndex] === null || 
        row[colIndex] === undefined || 
        row[colIndex] === ''
      ).length;
      
      stats[column] = { total, missing };
    });
    
    setColumnTotals(stats);
  });
  
  // Handle removing duplicates
  const handleRemoveDuplicates = () => {
    if (!currentDataset) return;
    
    // Create a map to track unique rows
    const uniqueRows = new Map();
    const newData: any[][] = [];
    
    currentDataset.data.forEach((row) => {
      // Create a string representation of the row to use as key
      const rowKey = JSON.stringify(row);
      
      if (!uniqueRows.has(rowKey)) {
        uniqueRows.set(rowKey, true);
        newData.push(row);
      }
    });
    
    const removedCount = currentDataset.data.length - newData.length;
    
    // Update dataset with deduplicated data
    updateDataset({
      ...currentDataset,
      data: newData
    });
    
    toast({
      title: "Duplicates removed",
      description: `Removed ${removedCount} duplicate ${removedCount === 1 ? 'row' : 'rows'}`,
    });
  };
  
  // Handle missing values
  const handleMissingValues = (strategy: string, columns: string[]) => {
    if (!currentDataset) return;
    
    const newData = [...currentDataset.data];
    let replacedCount = 0;
    
    // Get column indices for selected columns
    const columnIndices = columns.map(col => currentDataset.columns.indexOf(col));
    
    newData.forEach((row, rowIndex) => {
      columnIndices.forEach(colIndex => {
        if (colIndex === -1) return;
        
        const value = row[colIndex];
        if (value === null || value === undefined || value === '') {
          replacedCount++;
          
          switch (strategy) {
            case "zero":
              newData[rowIndex][colIndex] = 0;
              break;
            case "mean":
              // Calculate mean of column (excluding missing values)
              const columnValues = currentDataset.data
                .map(r => r[colIndex])
                .filter(v => v !== null && v !== undefined && v !== '')
                .map(v => parseFloat(v));
              
              const mean = columnValues.length > 0 
                ? columnValues.reduce((sum, val) => sum + val, 0) / columnValues.length 
                : 0;
                
              newData[rowIndex][colIndex] = Number(mean.toFixed(2));
              break;
            case "median":
              // Calculate median of column
              const sortedValues = currentDataset.data
                .map(r => r[colIndex])
                .filter(v => v !== null && v !== undefined && v !== '')
                .map(v => parseFloat(v))
                .sort((a, b) => a - b);
              
              let median = 0;
              if (sortedValues.length > 0) {
                const mid = Math.floor(sortedValues.length / 2);
                median = sortedValues.length % 2 === 0
                  ? (sortedValues[mid - 1] + sortedValues[mid]) / 2
                  : sortedValues[mid];
              }
              
              newData[rowIndex][colIndex] = Number(median.toFixed(2));
              break;
            case "mode":
              // Calculate mode (most common value)
              const valueCounts: Record<string, number> = {};
              currentDataset.data.forEach(r => {
                const val = r[colIndex];
                if (val !== null && val !== undefined && val !== '') {
                  valueCounts[val] = (valueCounts[val] || 0) + 1;
                }
              });
              
              let mode = '';
              let maxCount = 0;
              
              Object.entries(valueCounts).forEach(([value, count]) => {
                if (count > maxCount) {
                  maxCount = count;
                  mode = value;
                }
              });
              
              newData[rowIndex][colIndex] = mode;
              break;
            case "constant":
              newData[rowIndex][colIndex] = "N/A";
              break;
            case "remove":
              // We'll handle removal separately
              break;
          }
        }
      });
    });
    
    // Handle row removal strategy separately
    if (strategy === "remove") {
      const filteredData = newData.filter((row) => {
        return !columnIndices.some(colIndex => 
          row[colIndex] === null || 
          row[colIndex] === undefined || 
          row[colIndex] === ''
        );
      });
      
      replacedCount = newData.length - filteredData.length;
      
      updateDataset({
        ...currentDataset,
        data: filteredData
      });
    } else {
      updateDataset({
        ...currentDataset,
        data: newData
      });
    }
    
    setMissingValueDialog(false);
    
    toast({
      title: "Missing values handled",
      description: strategy === "remove" 
        ? `Removed ${replacedCount} ${replacedCount === 1 ? 'row' : 'rows'} with missing values` 
        : `Replaced ${replacedCount} missing ${replacedCount === 1 ? 'value' : 'values'}`,
    });
  };
  
  // Apply filters to data
  const applyFilters = () => {
    if (!currentDataset || filters.length === 0) return;
    
    const filteredData = currentDataset.data.filter(row => {
      // All filters must pass for a row to be included
      return filters.every(filter => {
        const columnIndex = currentDataset.columns.indexOf(filter.column);
        if (columnIndex === -1) return true;
        
        const cellValue = row[columnIndex];
        const filterValue = filter.value;
        
        switch (filter.operator) {
          case "equals":
            return String(cellValue) === filterValue;
          case "notEquals":
            return String(cellValue) !== filterValue;
          case "contains":
            return String(cellValue).includes(filterValue);
          case "greaterThan":
            return Number(cellValue) > Number(filterValue);
          case "lessThan":
            return Number(cellValue) < Number(filterValue);
          case "empty":
            return cellValue === null || cellValue === undefined || cellValue === '';
          case "notEmpty":
            return cellValue !== null && cellValue !== undefined && cellValue !== '';
          default:
            return true;
        }
      });
    });
    
    updateDataset({
      ...currentDataset,
      data: filteredData
    });
    
    setFilterDialog(false);
    
    const removedCount = currentDataset.data.length - filteredData.length;
    toast({
      title: "Filters applied",
      description: `Filtered out ${removedCount} ${removedCount === 1 ? 'row' : 'rows'}`,
    });
  };
  
  // Reset the dataset to original
  const handleResetData = () => {
    resetToOriginal();
    toast({
      title: "Data reset",
      description: "Your data has been reset to the original state",
    });
  };
  
  // Handle adding a new filter
  const addFilter = () => {
    if (!currentDataset) return;
    setFilters([
      ...filters, 
      { 
        column: currentDataset.columns[0], 
        operator: "equals", 
        value: "" 
      }
    ]);
  };
  
  // Update an existing filter
  const updateFilter = (index: number, field: string, value: string) => {
    const newFilters = [...filters];
    newFilters[index] = { ...newFilters[index], [field]: value };
    setFilters(newFilters);
  };
  
  // Remove a filter
  const removeFilter = (index: number) => {
    const newFilters = [...filters];
    newFilters.splice(index, 1);
    setFilters(newFilters);
  };
  
  if (!currentDataset) {
    return (
      <div className="p-8 text-center text-gray-500">
        <FileWarning className="mx-auto h-12 w-12 text-gray-400 mb-3" />
        <p>No dataset loaded</p>
        <p className="text-sm">Please load a dataset first</p>
      </div>
    );
  }
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="clean">Clean Data</TabsTrigger>
          <TabsTrigger value="sample">Data Sample</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Dataset Overview</CardTitle>
              <CardDescription>
                Summary of your dataset and potential issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Rows</p>
                    <p className="text-2xl font-bold">{currentDataset.data.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Columns</p>
                    <p className="text-2xl font-bold">{currentDataset.columns.length}</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">File Name</p>
                    <p className="text-lg font-medium truncate">{currentDataset.name}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Column Summary</h3>
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Column</TableHead>
                          <TableHead>Missing Values</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentDataset.columns.map((column, index) => {
                          const colStats = columnTotals[column] || { total: 0, missing: 0 };
                          const missingPercent = colStats.total > 0 
                            ? Math.round((colStats.missing / colStats.total) * 100) 
                            : 0;
                            
                          return (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{column}</TableCell>
                              <TableCell>
                                {colStats.missing > 0 ? (
                                  <div className="flex items-center">
                                    <Badge variant={missingPercent > 30 ? "destructive" : "secondary"}>
                                      {colStats.missing} ({missingPercent}%)
                                    </Badge>
                                  </div>
                                ) : (
                                  <span className="text-green-600 flex items-center">
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    No missing values
                                  </span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="clean">
          <Card>
            <CardHeader>
              <CardTitle>Data Cleaning Tools</CardTitle>
              <CardDescription>
                Tools to clean and transform your dataset
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Ban className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Remove Duplicates</h3>
                      <p className="text-sm text-gray-500 mb-3">Remove rows that have identical values</p>
                      <Button 
                        onClick={handleRemoveDuplicates} 
                        variant="default" 
                        className="w-full"
                      >
                        Remove Duplicates
                      </Button>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Wand className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Handle Missing Values</h3>
                      <p className="text-sm text-gray-500 mb-3">Replace or remove missing values</p>
                      <Dialog open={missingValueDialog} onOpenChange={setMissingValueDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Handle Missing Values</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Handle Missing Values</DialogTitle>
                            <DialogDescription>
                              Choose how to handle missing values in your dataset
                            </DialogDescription>
                          </DialogHeader>
                          
                          <MissingValueHandler 
                            columns={currentDataset.columns} 
                            onApply={handleMissingValues}
                            onCancel={() => setMissingValueDialog(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Filter className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Filter Data</h3>
                      <p className="text-sm text-gray-500 mb-3">Filter rows based on conditions</p>
                      <Dialog open={filterDialog} onOpenChange={setFilterDialog}>
                        <DialogTrigger asChild>
                          <Button className="w-full">Filter Data</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Filter Data</DialogTitle>
                            <DialogDescription>
                              Create rules to filter rows in your dataset
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4 my-4">
                            {filters.map((filter, index) => (
                              <div key={index} className="flex items-center space-x-2 p-3 border rounded-md bg-muted/30">
                                <div className="grid grid-cols-3 gap-2 flex-1">
                                  <Select
                                    value={filter.column}
                                    onValueChange={(value) => updateFilter(index, 'column', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {currentDataset.columns.map((column, i) => (
                                        <SelectItem key={i} value={column}>{column}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  
                                  <Select
                                    value={filter.operator}
                                    onValueChange={(value) => updateFilter(index, 'operator', value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Operator" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="equals">equals</SelectItem>
                                      <SelectItem value="notEquals">not equals</SelectItem>
                                      <SelectItem value="contains">contains</SelectItem>
                                      <SelectItem value="greaterThan">greater than</SelectItem>
                                      <SelectItem value="lessThan">less than</SelectItem>
                                      <SelectItem value="empty">is empty</SelectItem>
                                      <SelectItem value="notEmpty">is not empty</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  
                                  {filter.operator !== "empty" && filter.operator !== "notEmpty" && (
                                    <Input
                                      value={filter.value}
                                      onChange={(e) => updateFilter(index, 'value', e.target.value)}
                                      placeholder="Value"
                                    />
                                  )}
                                </div>
                                <Button
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFilter(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            
                            {filters.length === 0 && (
                              <div className="p-4 text-center text-muted-foreground">
                                No filters added yet. Add a filter to get started.
                              </div>
                            )}
                            
                            <Button 
                              onClick={addFilter}
                              variant="outline" 
                              className="w-full"
                            >
                              Add Filter
                            </Button>
                          </div>
                          
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setFilterDialog(false)}>Cancel</Button>
                            <Button onClick={applyFilters} disabled={filters.length === 0}>Apply Filters</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-4 border">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 rounded-full bg-destructive/10">
                      <ArrowDownUp className="h-5 w-5 text-destructive" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Reset Data</h3>
                      <p className="text-sm text-gray-500 mb-3">Revert to original dataset</p>
                      <Button 
                        onClick={handleResetData} 
                        variant="destructive" 
                        className="w-full"
                      >
                        Reset to Original
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sample">
          <Card>
            <CardHeader>
              <CardTitle>Data View</CardTitle>
              <CardDescription>
                Preview of your current dataset (first 10 rows)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {currentDataset.columns.map((column, index) => (
                          <TableHead key={index}>{column}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentDataset.data.slice(0, 10).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>
                              {cell === null || cell === undefined || cell === '' ? (
                                <span className="text-muted-foreground italic">Empty</span>
                              ) : String(cell)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </ScrollArea>
              <div className="mt-2 text-sm text-muted-foreground">
                Showing first 10 rows of {currentDataset.data.length} rows total
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Component for handling missing values
function MissingValueHandler({
  columns,
  onApply,
  onCancel
}: {
  columns: string[];
  onApply: (strategy: string, columns: string[]) => void;
  onCancel: () => void;
}) {
  const [strategy, setStrategy] = useState("zero");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      setSelectedColumns(selectedColumns.filter(c => c !== column));
    } else {
      setSelectedColumns([...selectedColumns, column]);
    }
  };
  
  const selectAllColumns = () => {
    setSelectedColumns([...columns]);
  };
  
  const deselectAllColumns = () => {
    setSelectedColumns([]);
  };
  
  return (
    <div className="space-y-4 my-2">
      <div className="space-y-2">
        <Label>Replacement Strategy</Label>
        <Select value={strategy} onValueChange={setStrategy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="zero">Replace with 0</SelectItem>
            <SelectItem value="mean">Replace with mean</SelectItem>
            <SelectItem value="median">Replace with median</SelectItem>
            <SelectItem value="mode">Replace with most common value</SelectItem>
            <SelectItem value="constant">Replace with N/A</SelectItem>
            <SelectItem value="remove">Remove rows with missing values</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground mt-1">
          {strategy === "zero" && "Replace empty or null values with 0"}
          {strategy === "mean" && "Replace empty or null values with the average of the column"}
          {strategy === "median" && "Replace empty or null values with the middle value"}
          {strategy === "mode" && "Replace empty or null values with the most common value"}
          {strategy === "constant" && "Replace empty or null values with 'N/A'"}
          {strategy === "remove" && "Remove entire rows that contain empty or null values"}
        </p>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Select Columns</Label>
          <div className="space-x-2">
            <Button variant="outline" size="sm" onClick={selectAllColumns}>Select All</Button>
            <Button variant="outline" size="sm" onClick={deselectAllColumns}>Deselect All</Button>
          </div>
        </div>
        
        <div className="border rounded-md p-4 max-h-[200px] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {columns.map((column) => (
              <div key={column} className="flex items-center space-x-2">
                <Checkbox 
                  id={`column-${column}`}
                  checked={selectedColumns.includes(column)}
                  onCheckedChange={() => toggleColumn(column)}
                />
                <Label htmlFor={`column-${column}`} className="cursor-pointer">
                  {column}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          disabled={selectedColumns.length === 0} 
          onClick={() => onApply(strategy, selectedColumns)}
        >
          Apply
        </Button>
      </DialogFooter>
    </div>
  );
}