"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check } from "lucide-react";

export type SortOption = "default" | "name-asc" | "name-desc";

interface OrdenDropdownProps {
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
}

const sortOptionLabels: Record<SortOption, string> = {
  default: "Orden predeterminado",
  "name-asc": "Nombre (A-Z)",
  "name-desc": "Nombre (Z-A)",
};

export default function OrdenDropdown({
  sortOption,
  setSortOption,
}: OrdenDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          {sortOptionLabels[sortOption]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(["default", "name-asc", "name-desc"] as SortOption[]).map(
          (option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => setSortOption(option)}
            >
              <div className="flex items-center gap-2">
                {sortOption === option && <Check className="h-4 w-4" />}
                <span>{sortOptionLabels[option]}</span>
              </div>
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
