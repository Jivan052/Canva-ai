import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ColumnSelectorProps {
  columns: string[];
  selectedColumns: string[];
  onSelectedColumnsChange: (columns: string[]) => void;
  className?: string;
  placeholder?: string;
}

export function ColumnSelector({
  columns,
  selectedColumns,
  onSelectedColumnsChange,
  className,
  placeholder = "Select columns..."
}: ColumnSelectorProps) {
  const [open, setOpen] = useState(false);

  const toggleColumn = (column: string) => {
    if (selectedColumns.includes(column)) {
      onSelectedColumnsChange(selectedColumns.filter(c => c !== column));
    } else {
      onSelectedColumnsChange([...selectedColumns, column]);
    }
  };

  const removeColumn = (column: string) => {
    onSelectedColumnsChange(selectedColumns.filter(c => c !== column));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedColumns.length > 0
              ? `${selectedColumns.length} column${selectedColumns.length > 1 ? 's' : ''} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Search columns..." />
            <CommandList>
              <CommandEmpty>No columns found.</CommandEmpty>
              <CommandGroup>
                {columns.map((column) => (
                  <CommandItem
                    key={column}
                    value={column}
                    onSelect={() => toggleColumn(column)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedColumns.includes(column)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {column}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {selectedColumns.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedColumns.map(column => (
            <Badge key={column} variant="secondary">
              {column}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={() => removeColumn(column)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remove {column}</span>
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}