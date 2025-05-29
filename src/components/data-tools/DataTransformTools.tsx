import { useState } from "react";
import { 
  Pencil, 
  ArrowUpDown, 
  Split, 
  Combine, 
  Calculator, 
  SlidersHorizontal, 
  ArrowDownAZ, 
  Table2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { OperationButton } from "./OperationButton";
import { ColumnSelector } from "./ColumnSelector";
import { useDataOperations } from "@/hooks/useDataOperations";

export function DataTransformTools() {
  const { transform, columns, isProcessing } = useDataOperations();
  
  // State for dialogs
  const [renameColumnOpen, setRenameColumnOpen] = useState(false);
  const [reorderColumnsOpen, setReorderColumnsOpen] = useState(false);
  const [splitColumnOpen, setSplitColumnOpen] = useState(false);
  const [mergeColumnsOpen, setMergeColumnsOpen] = useState(false);
  const [sortDataOpen, setSortDataOpen] = useState(false);
  const [roundDataOpen, setRoundDataOpen] = useState(false);

  
  // State for form values
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [newColumnName, setNewColumnName] = useState<string>("");
  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [delimiter, setDelimiter] = useState<string>(",");
  const [newColumnNames, setNewColumnNames] = useState<string[]>([]);
  const [keepOriginal, setKeepOriginal] = useState<boolean>(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [mergeDelimiter, setMergeDelimiter] = useState<string>(" ");
  const [mergeColumnName, setMergeColumnName] = useState<string>("merged_column");
  const [keepOriginals, setKeepOriginals] = useState<boolean>(false);
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [columnsToRound, setColumnsToRound] = useState<string[]>([]);
  // const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
  const [roundColumn, setRoundColumn] = useState<string>("");
const [decimalPlaces, setDecimalPlaces] = useState<number>(2);
const [keepOriginalRounded, setKeepOriginalRounded] = useState<boolean>(false);


  // Handle column rename
  const handleRenameColumn = () => {
    if (!selectedColumn || !newColumnName) return;
    
    const renameMap: Record<string, string> = {
      [selectedColumn]: newColumnName
    };
    
    transform.renameColumns(renameMap);
    setRenameColumnOpen(false);
    setSelectedColumn("");
    setNewColumnName("");
  };

  // Handle column reordering
  const handleReorderColumns = () => {
    if (columnOrder.length === 0) return;
    
    transform.reorderColumns(columnOrder);
    setReorderColumnsOpen(false);
  };

  // Handle column splitting
  const handleSplitColumn = () => {
    if (!selectedColumn || !delimiter || newColumnNames.length === 0) return;
    
    transform.splitColumn(selectedColumn, delimiter, newColumnNames, keepOriginal);
    setSplitColumnOpen(false);
  };

  // Handle column merging
  const handleMergeColumns = () => {
    if (selectedColumns.length < 2 || !mergeColumnName) return;
    
    transform.mergeColumns(selectedColumns, mergeColumnName, mergeDelimiter, keepOriginals);
    setMergeColumnsOpen(false);
  };

  // Handle sort data
  const handleSortData = () => {
    if (!sortColumn) return;
    
    transform.sortData([{
      column: sortColumn,
      direction: sortDirection
    }]);
    
    setSortDataOpen(false);
  };

  // Handle rounding for a single column
const handleRoundValues = () => {
  if (!roundColumn || isNaN(decimalPlaces)) return;

  const roundConfig = [{
    column: roundColumn,
    decimals: decimalPlaces,
    keepOriginal: keepOriginalRounded,
  }];

  transform.roundValues(roundConfig); // Assumes transform.roundValues expects this format

  // Reset state
  setRoundDataOpen(false);
  setRoundColumn("");
  setDecimalPlaces(2);
  setKeepOriginalRounded(false);
};



  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Rename column dialog */}
        <Dialog open={renameColumnOpen} onOpenChange={setRenameColumnOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={Pencil}
              label="Rename Column"
              description="Change column names"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Rename Column</DialogTitle>
              <DialogDescription>
                Change the name of a column in your dataset.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="column">Select column</Label>
                <Select 
                  value={selectedColumn} 
                  onValueChange={setSelectedColumn}
                >
                  <SelectTrigger id="column">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newName">New column name</Label>
                <Input
                  id="newName"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Enter new name"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setRenameColumnOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleRenameColumn}
                disabled={!selectedColumn || !newColumnName}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Reorder columns dialog */}
        <Dialog open={reorderColumnsOpen} onOpenChange={setReorderColumnsOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={ArrowUpDown}
              label="Reorder Columns"
              description="Change column arrangement"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Reorder Columns</DialogTitle>
              <DialogDescription>
                Change the order of columns in your dataset.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="border rounded-md p-4">
                <Label className="mb-2 block">Drag to reorder columns</Label>
                <div className="max-h-64 overflow-y-auto">
                  {/* In a real implementation, this would be a drag-and-drop list */}
                  <p className="text-sm text-muted-foreground">
                    This is a simplified implementation. A complete version would include 
                    drag-and-drop functionality.
                  </p>
                  <div className="mt-2 space-y-2">
                    {columns.map((column, index) => (
                      <div key={column} className="flex items-center p-2 bg-muted rounded-sm">
                        <span className="text-sm">{index + 1}. {column}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="columnOrder">Selected order</Label>
                <Textarea
                  id="columnOrder"
                  placeholder="Enter column names separated by commas"
                  value={columnOrder.join(", ")}
                  onChange={(e) => setColumnOrder(e.target.value.split(",").map(s => s.trim()))}
                  className="h-24"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter column names exactly as they appear, separated by commas.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setReorderColumnsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleReorderColumns}
                disabled={columnOrder.length === 0}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Split column dialog */}
        <Dialog open={splitColumnOpen} onOpenChange={setSplitColumnOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={Split}
              label="Split Column"
              description="Divide column by delimiter"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Split Column</DialogTitle>
              <DialogDescription>
                Divide a column into multiple columns based on a delimiter.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="columnToSplit">Select column to split</Label>
                <Select 
                  value={selectedColumn} 
                  onValueChange={setSelectedColumn}
                >
                  <SelectTrigger id="columnToSplit">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="delimiter">Delimiter</Label>
                <Input
                  id="delimiter"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  placeholder="e.g., comma (,)"
                />
              </div>
              <div>
                <Label htmlFor="newColumnNames">New column names</Label>
                <Textarea
                  id="newColumnNames"
                  placeholder="Enter new column names separated by commas"
                  value={newColumnNames.join(", ")}
                  onChange={(e) => setNewColumnNames(e.target.value.split(",").map(s => s.trim()))}
                  className="h-24"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepOriginal" 
                  checked={keepOriginal}
                  onCheckedChange={(checked) => setKeepOriginal(!!checked)}
                />
                <Label htmlFor="keepOriginal">Keep original column</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSplitColumnOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSplitColumn}
                disabled={!selectedColumn || !delimiter || newColumnNames.length === 0}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Merge columns dialog */}
        <Dialog open={mergeColumnsOpen} onOpenChange={setMergeColumnsOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={Combine}
              label="Merge Columns"
              description="Combine multiple columns"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Merge Columns</DialogTitle>
              <DialogDescription>
                Combine multiple columns into a single column.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Select columns to merge</Label>
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={setSelectedColumns}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="mergeColumnName">New column name</Label>
                <Input
                  id="mergeColumnName"
                  value={mergeColumnName}
                  onChange={(e) => setMergeColumnName(e.target.value)}
                  placeholder="Enter name for merged column"
                />
              </div>
              <div>
                <Label htmlFor="mergeDelimiter">Delimiter</Label>
                <Input
                  id="mergeDelimiter"
                  value={mergeDelimiter}
                  onChange={(e) => setMergeDelimiter(e.target.value)}
                  placeholder="e.g., space ( )"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="keepOriginals" 
                  checked={keepOriginals}
                  onCheckedChange={(checked) => setKeepOriginals(!!checked)}
                />
                <Label htmlFor="keepOriginals">Keep original columns</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setMergeColumnsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleMergeColumns}
                disabled={selectedColumns.length < 2 || !mergeColumnName}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Sort data dialog */}
        <Dialog open={sortDataOpen} onOpenChange={setSortDataOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={ArrowDownAZ}
              label="Sort Data"
              description="Order rows by column values"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Sort Data</DialogTitle>
              <DialogDescription>
                Order your dataset rows by column values.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="sortColumn">Sort by column</Label>
                <Select 
                  value={sortColumn} 
                  onValueChange={setSortColumn}
                >
                  <SelectTrigger id="sortColumn">
                    <SelectValue placeholder="Select column" />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map(column => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="sortDirection">Direction</Label>
                <Select 
                  value={sortDirection} 
                  onValueChange={(value) => setSortDirection(value as "asc" | "desc")}
                >
                  <SelectTrigger id="sortDirection">
                    <SelectValue placeholder="Select direction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending (A → Z, 1 → 9)</SelectItem>
                    <SelectItem value="desc">Descending (Z → A, 9 → 1)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSortDataOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSortData}
                disabled={!sortColumn}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        


        {/* Round data dialog */}
<Dialog open={roundDataOpen} onOpenChange={setRoundDataOpen}>
  <DialogTrigger asChild>
    <OperationButton
      icon={Calculator} // You can choose another icon if you want
      label="Round Data"
      description="Round values to specific decimals"
      disabled={isProcessing}
    />
  </DialogTrigger>
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Round Data</DialogTitle>
      <DialogDescription>
        Round numeric values in a column to a specified number of decimal places.
      </DialogDescription>
    </DialogHeader>
    <div className="grid gap-4 py-4">
      <div>
        <Label htmlFor="roundColumn">Select column</Label>
        <Select 
          value={roundColumn} 
          onValueChange={setRoundColumn}
        >
          <SelectTrigger id="roundColumn">
            <SelectValue placeholder="Select numeric column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(column => (
              <SelectItem key={column} value={column}>
                {column}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="decimalPlaces">Decimal places</Label>
        <Input
          id="decimalPlaces"
          type="number"
          min="0"
          max="10"
          value={decimalPlaces}
          onChange={(e) => setDecimalPlaces(Number(e.target.value))}
          placeholder="e.g., 2"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="keepOriginalRounded" 
          checked={keepOriginalRounded}
          onCheckedChange={(checked) => setKeepOriginalRounded(!!checked)}
        />
        <Label htmlFor="keepOriginalRounded">Keep original column</Label>
      </div>
    </div>
    <DialogFooter>
      <Button 
        variant="outline" 
        onClick={() => setRoundDataOpen(false)}
      >
        Cancel
      </Button>
      <Button 
        onClick={handleRoundValues}
        disabled={!roundColumn || isNaN(decimalPlaces)}
      >
        Apply
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

            

        {/* Placeholder for other operations */}
        {/* <OperationButton
          icon={Calculator}
          label="Create Calculated Column"
          description="Add a column with formula"
          disabled={true}
          tooltip="Coming soon"
        /> */}
        
        {/* <OperationButton
          icon={SlidersHorizontal}
          label="Filter Rows"
          description="Show only matching records"
          disabled={true}
          tooltip="Coming soon"
        />
        
        <OperationButton
          icon={Table2}
          label="Pivot Table"
          description="Summarize data by groups"
          disabled={true}
          tooltip="Coming soon"
        /> */}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Transformation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Organize first:</strong> Rename and reorder columns for cleaner structure.
            </p>
            <p>
              <strong>Split wisely:</strong> Break complex fields into components that can be analyzed separately.
            </p>
            <p>
              <strong>Sort strategically:</strong> Sorting helps spot patterns and outliers in your data.
            </p>
            <p>
              <strong>Round carefully:</strong> Decide which columns to round, and how many decimal places to keep.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}