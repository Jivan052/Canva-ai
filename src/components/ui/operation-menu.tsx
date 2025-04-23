import * as React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";

export interface OperationItem {
  id: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  onClick: () => void;
  disabled?: boolean;
}

export interface OperationGroup {
  label: string;
  items: OperationItem[];
}

export interface OperationSubmenu {
  label: string;
  icon?: LucideIcon;
  groups: OperationGroup[];
}

interface OperationMenuProps {
  label: string;
  icon?: LucideIcon;
  variant?: "default" | "outline" | "ghost";
  groups?: OperationGroup[];
  submenus?: OperationSubmenu[];
}

export function OperationMenu({
  label,
  icon: Icon,
  variant = "outline",
  groups,
  submenus
}: OperationMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} className="flex items-center gap-2">
          {Icon && <Icon className="h-4 w-4" />}
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {groups && groups.map((group, groupIndex) => (
          <React.Fragment key={`group-${groupIndex}`}>
            {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
            {group.items.map((item) => (
              <DropdownMenuItem
                key={item.id}
                onClick={item.onClick}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                <span>{item.label}</span>
              </DropdownMenuItem>
            ))}
            {groupIndex < (groups.length - 1) && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
        
        {submenus && submenus.map((submenu, index) => (
          <React.Fragment key={`submenu-${index}`}>
            {index === 0 && groups && groups.length > 0 && <DropdownMenuSeparator />}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                {submenu.icon && <submenu.icon className="mr-2 h-4 w-4" />}
                <span>{submenu.label}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {submenu.groups.map((group, groupIndex) => (
                    <React.Fragment key={`subgroup-${groupIndex}`}>
                      {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
                      <DropdownMenuGroup>
                        {group.items.map((item) => (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={item.onClick}
                            disabled={item.disabled}
                          >
                            {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      {groupIndex < (submenu.groups.length - 1) && <DropdownMenuSeparator />}
                    </React.Fragment>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}