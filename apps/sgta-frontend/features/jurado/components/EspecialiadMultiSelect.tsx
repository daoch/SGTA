"use client";

import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "./EspecialidadCheckbox";
import { SelectOption } from "@/features/jurado/types/juradoDetalle.types";

interface MultiSelectCheckboxProps {
  options: SelectOption[];
  selected: string[];
  onChange: (selected: string[]) => void;
  displayText?: string;
}

export const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
  options,
  selected,
  onChange,
  displayText = "Selecciona áreas",
}) => {
  const toggleValue = (value: string) => {
    if (selected.includes(value)) {
      onChange(selected.filter((v) => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  const getDisplayText = () => {
    const count = selected.length;
    if (count === 0) return displayText;
    return `${count} área${count !== 1 ? 's' : ''} seleccionada${count !== 1 ? 's' : ''}`;
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className={cn(
            "flex items-center justify-between border border-input rounded-md px-3 py-2 text-sm w-[200px] shadow-sm bg-white",
            "hover:border-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring",
          )}
        >
          <span className="truncate">
            {getDisplayText()}
          </span>
          <ChevronDownIcon className="ml-2 h-4 w-4 text-muted-foreground" />
        </button>
      </Popover.Trigger>

      <Popover.Content
        className="bg-white border rounded-md shadow-md p-2 w-[200px]"
        align="start"
        sideOffset={4}
      >
        {options.map((opt) => (
          <div
            key={opt.value}
            className="flex items-center gap-2 py-1 cursor-pointer"
            onClick={() => toggleValue(opt.value)}
          >
            <Checkbox checked={selected.includes(opt.value)} />
            <span className="text-sm">{opt.label}</span>
          </div>
        ))}
      </Popover.Content>
    </Popover.Root>
  );
};
