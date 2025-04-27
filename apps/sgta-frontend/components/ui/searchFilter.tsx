"use client";
import * as React from "react";

export const SearchFilters = () => {
  return (
    <div className="flex flex-wrap gap-10 w-full text-sm leading-none max-md:max-w-full">
      <div className="flex flex-wrap flex-auto gap-2.5 self-end -mt-6 text-[color:var(--foreground)] max-md:max-w-full">
        <div className="flex gap-3 items-center self-end mt-6 border border-black border-solid text-[color:var(--muted-foreground)]">
          <div className="flex gap-2 items-center self-stretch pt-2 pb-12 my-auto border border-solid bg-[color:var(--background)] border-slate-200 min-h-11 min-w-60 pl-[var(--spacing-lg,] pr-[var(--spacing-lg,] rounded-[border-radius] w-[447px]">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/fd118fc03956b46c606072fce28182f0c33fdf2c?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
              alt="Search"
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
            <input
              type="text"
              placeholder="Ingrese el nombre, código o correo electrónico del usuario"
              className="flex-1 shrink self-stretch my-auto basis-0 bg-transparent border-none focus:outline-none"
            />
          </div>
        </div>
        <button className="gap-2 self-end px-4 mt-6 font-medium tracking-normal whitespace-nowrap rounded-md bg-sky-950 min-h-11 text-[color:var(--primary-foreground)]">
          Buscar
        </button>

        <SelectField label="Tipo de Dedicación" value="Todos" />

        <SelectField label="Área de Especialidad" value="Todos" />

        <SelectField label="Estado" value="Activo" />
      </div>

      <button className="flex z-10 gap-2 justify-center items-center px-4 font-medium tracking-normal rounded-md bg-sky-950 min-h-11 text-[color:var(--primary-foreground)] max-md:mr-0">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/a2afc6013540fc9a3da078d9139d8c7b4909dd50?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
          alt="Add"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
        <span className="self-stretch my-auto">Nuevo Jurado</span>
      </button>
    </div>
  );
};

interface SelectFieldProps {
  label: string;
  value: string;
}

const SelectField: React.FC<SelectFieldProps> = ({ label, value }) => {
  return (
    <div className="min-h-[68px]">
      <label className="gap-0.5 self-stretch font-medium tracking-normal">
        {label}
      </label>
      <div className="flex gap-3 items-center px-3 py-2.5 mt-1.5 w-full whitespace-nowrap rounded-md bg-[color:var(--background)] min-h-10">
        <span className="flex-1 shrink self-stretch my-auto basis-0">
          {value}
        </span>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/3f770549a71497189102c1242f4d2c2a3f9df02d?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
          alt="Dropdown"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
      </div>
    </div>
  );
};
