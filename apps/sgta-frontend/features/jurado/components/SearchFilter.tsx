"use client";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AreaEspecialidad } from "../types/jurado.types";

interface Props {
    topics : AreaEspecialidad[];
}


const SearchFilter: React.FC<Props> = ({topics}) => {
   
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();
    const placeholder = "Inombre del docente o codigo de tesis";

    const [selectedEspecialidad, _] = useState("Todos");
    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set("query", term);
        } else {
            params.delete("query");
        }
        replace(`${pathname}?${params.toString()}`);
    }
  
    return (
        <div className="relative flex flex-1 flex-shrink-0 gap-4">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <input
          className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-2 text-sm outline-2 placeholder:text-gray-500"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <DropdownMenu>
              <DropdownMenuTrigger className="w-1/2 border-gray-300 border-2 rounded-lg text-left p-1">
                {selectedEspecialidad}
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  {topics.map((top: AreaEspecialidad) => (
                    <DropdownMenuItem key={top.name}>{top.name}</DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
      </div>
    );
  };
  
export default SearchFilter;