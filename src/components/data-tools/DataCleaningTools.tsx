import { useState } from "react";
import { 
  Wand2, 
  Scissors, 
  X, 
  Table, 
  SquarePen, 
  CaseLower, 
  Search, 
  CalendarClock,
  Trash2
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
import { OperationButton } from "./OperationButton";
import { useDataOperations } from "@/hooks/useDataOperations";
import { ColumnSelector } from "./ColumnSelector";

export function DataCleaningTools() {
  const { clean, columns, isProcessing } = useDataOperations();
  
  // State for dialogs
  const [fillMissingOpen, setFillMissingOpen] = useState(false);
  const [textCaseOpen, setTextCaseOpen] = useState(false);
  const [specialCharsOpen, setSpecialCharsOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  
  // State for form values
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [fillMethod, setFillMethod] = useState<"value" | "mean" | "median" | "mode">("value");
  const [fillValue, setFillValue] = useState("");
  const [caseType, setCaseType] = useState<"uppercase" | "lowercase" | "titlecase">("lowercase");
  const [findValue, setFindValue] = useState("");
  const [replaceValue, setReplaceValue] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [pattern, setPattern] = useState("[^a-zA-Z0-9 ]");

  const handleRemoveDuplicates = () => {
    clean.removeDuplicates();
  };

  const handleTrimWhitespace = () => {
    clean.trimWhitespace();
  };

  const handleRemoveNullRows = () => {
    clean.removeNullRows();
  };

  const handleDropEmptyColumns = () => {
    clean.dropEmptyColumns();
  };

  const handleFillMissingSubmit = () => {
    if (selectedColumns.length === 0) return;
    
    const value = fillMethod === "value" ? fillValue : undefined;
    clean.fillMissingValues(selectedColumns, fillMethod, value);
    setFillMissingOpen(false);
  };

  const handleTextCaseSubmit = () => {
    if (selectedColumns.length === 0) return;
    
    clean.standardizeTextCase(selectedColumns, caseType);
    setTextCaseOpen(false);
  };

  const handleSpecialCharsSubmit = () => {
    if (selectedColumns.length === 0) return;
    
    clean.removeSpecialCharacters(selectedColumns, pattern);
    setSpecialCharsOpen(false);
  };

  const handleFindReplaceSubmit = () => {
    if (selectedColumns.length === 0 || !findValue) return;
    
    clean.findAndReplace(selectedColumns, findValue, replaceValue, caseSensitive);
    setFindReplaceOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Basic cleaning operations */}
        <OperationButton
          icon={Wand2}
          label="Remove Duplicates"
          description="Remove duplicate rows from the dataset"
          onClick={handleRemoveDuplicates}
          disabled={isProcessing}
        />
        
        <OperationButton
          icon={Scissors}
          label="Trim Whitespace"
          description="Remove leading and trailing spaces"
          onClick={handleTrimWhitespace}
          disabled={isProcessing}
        />
        
        <OperationButton
          icon={X}
          label="Remove Null Rows"
          description="Delete rows with empty values"
          onClick={handleRemoveNullRows}
          disabled={isProcessing}
        />
        
        <OperationButton
          icon={Trash2}
          label="Drop Empty Columns"
          description="Remove columns that are entirely empty"
          onClick={handleDropEmptyColumns}
          disabled={isProcessing}
        />
        
        {/* Fill missing values dialog */}
        <Dialog open={fillMissingOpen} onOpenChange={setFillMissingOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={Table}
              label="Fill Missing Values"
              description="Replace nulls with specified values"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Fill Missing Values</DialogTitle>
              <DialogDescription>
                Replace null or empty values in selected columns.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="columns">Select columns</Label>
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={setSelectedColumns}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fillMethod">Fill method</Label>
                <Select
                  value={fillMethod}
                  onValueChange={(value) => setFillMethod(value as any)}
                >
                  <SelectTrigger id="fillMethod">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="value">Custom Value</SelectItem>
                    <SelectItem value="mean">Mean (Average)</SelectItem>
                    <SelectItem value="median">Median</SelectItem>
                    <SelectItem value="mode">Mode (Most Common)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {fillMethod === "value" && (
                <div className="grid gap-2">
                  <Label htmlFor="fillValue">Fill value</Label>
                  <Input
                    id="fillValue"
                    value={fillValue}
                    onChange={(e) => setFillValue(e.target.value)}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setFillMissingOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFillMissingSubmit}
                disabled={selectedColumns.length === 0}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Text case dialog */}
        <Dialog open={textCaseOpen} onOpenChange={setTextCaseOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={CaseLower}
              label="Standardize Text Case"
              description="Convert text to consistent case format"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Standardize Text Case</DialogTitle>
              <DialogDescription>
                Convert text in selected columns to a consistent case format.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="columns">Select text columns</Label>
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={setSelectedColumns}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="caseType">Case format</Label>
                <Select
                  value={caseType}
                  onValueChange={(value) => setCaseType(value as any)}
                >
                  <SelectTrigger id="caseType">
                    <SelectValue placeholder="Select case format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="uppercase">UPPERCASE</SelectItem>
                    <SelectItem value="lowercase">lowercase</SelectItem>
                    <SelectItem value="titlecase">Title Case</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setTextCaseOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleTextCaseSubmit}
                disabled={selectedColumns.length === 0}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Special characters dialog */}
        <Dialog open={specialCharsOpen} onOpenChange={setSpecialCharsOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={SquarePen}
              label="Remove Special Characters"
              description="Strip non-alphanumeric characters"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Remove Special Characters</DialogTitle>
              <DialogDescription>
                Strip special characters from text in selected columns.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="columns">Select text columns</Label>
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={setSelectedColumns}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="pattern">Regular expression pattern</Label>
                <Input
                  id="pattern"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Default pattern removes all non-alphanumeric characters except spaces.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setSpecialCharsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSpecialCharsSubmit}
                disabled={selectedColumns.length === 0}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Find & Replace dialog */}
        <Dialog open={findReplaceOpen} onOpenChange={setFindReplaceOpen}>
          <DialogTrigger asChild>
            <OperationButton
              icon={Search}
              label="Find & Replace"
              description="Search and replace text values"
              disabled={isProcessing}
            />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Find & Replace</DialogTitle>
              <DialogDescription>
                Search for text and replace it with new values.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="columns">Select columns</Label>
                <ColumnSelector
                  columns={columns}
                  selectedColumns={selectedColumns}
                  onSelectedColumnsChange={setSelectedColumns}
                  className="mt-1"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="findValue">Find</Label>
                <Input
                  id="findValue"
                  value={findValue}
                  onChange={(e) => setFindValue(e.target.value)}
                  placeholder="Text to find"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="replaceValue">Replace with</Label>
                <Input
                  id="replaceValue"
                  value={replaceValue}
                  onChange={(e) => setReplaceValue(e.target.value)}
                  placeholder="Replacement text"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="caseSensitive" 
                  checked={caseSensitive}
                  onCheckedChange={(checked) => setCaseSensitive(!!checked)}
                />
                <Label htmlFor="caseSensitive">Case sensitive</Label>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setFindReplaceOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleFindReplaceSubmit}
                disabled={selectedColumns.length === 0 || !findValue}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Placeholder for other operations */}
        <OperationButton
          icon={CalendarClock}
          label="Fix Date Format"
          description="Standardize date formats"
          disabled={true}
          tooltip="Coming soon"
        />
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Cleaning Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Start with basics:</strong> Remove duplicates and fix missing values first.
            </p>
            <p>
              <strong>Standardize text:</strong> Consistent case and format helps with analysis.
            </p>
            <p>
              <strong>Inspect your data:</strong> Look for patterns in errors and inconsistencies.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}