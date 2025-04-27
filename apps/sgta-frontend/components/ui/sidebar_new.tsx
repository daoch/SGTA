"use client";
import * as React from "react";

export const Sidebar = () => {
  return (
    <aside className="min-w-60 w-[254px]">
      <nav className="relative flex-1 w-full shadow-sm bg-sky-950 max-w-[254px]">
        <div className="flex z-0 flex-col justify-center p-2 w-full font-bold max-w-[244px]">
          <div className="flex gap-2 items-center px-2 py-1 w-full rounded-md min-h-12">
            <div className="flex gap-2.5 self-stretch my-auto w-8 text-sm text-center whitespace-nowrap rounded-lg min-h-8 text-sky-950">
              <div className="overflow-hidden flex-1 shrink px-1.5 w-8 h-8 bg-purple-100 rounded-lg basis-0">
                DM
              </div>
            </div>
            <div className="flex flex-col flex-1 shrink gap-1 self-stretch my-auto basis-0">
              <span className="text-sm text-white text-ellipsis">
                Diana Morán
              </span>
              <div className="flex gap-1 items-start self-start mt-1 text-xs leading-none text-purple-100 whitespace-nowrap">
                <span className="gap-2.5 self-stretch px-2.5 py-0.5 bg-purple-950 rounded-[border-radius]">
                  Coordinador
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden z-0 flex-1 w-full">
          <nav className="w-full">
            <div className="p-2 w-full">
              <h2 className="flex gap-2 items-center p-2 w-full text-xs font-bold leading-none text-white rounded-md min-h-8 min-w-32">
                <span className="flex-1 shrink self-stretch my-auto basis-0 opacity-[opacity-70] text-ellipsis">
                  Como coordinador
                </span>
              </h2>

              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6f0760dad1deaea6431da0b7ce0b5a34740efb44?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Temas" />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4bd009cc68fa09cea044c0c55a74f424700cf8f8?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Propuestas" />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d5ef653a8049dbf83168d8db4aa9683881cdd49d?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Aprobaciones" />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/5e2c4775152d07e167a4e5949716c32571832b16?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Exposiciones" />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/c9acbf1670877f64ff9ad50c2560e761c081e1c9?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Revisión" />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/37c5f2a3ad3f22dbc8381deb133a033c0aa6cd31?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Asesores" hasDropdown />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/4869768f0f90a8bb61914d509d36ce1f49f3e51c?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Jurados" active />
              <NavItem icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d19ca62de4ae75ba3940802aa93403aba907dae1?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c" text="Reportes" />
            </div>
          </nav>
        </div>

        <footer className="flex overflow-hidden z-0 flex-col justify-center items-center p-2 w-full rounded-md">
          <button className="flex gap-2 justify-center items-center px-2 py-1.5 w-9 rounded-md min-h-8 min-w-px">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/21e7b898e8f29504d2ce5101e3d7df2714e9b2b3?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
              alt="Settings"
              className="object-contain self-stretch my-auto w-5 aspect-square"
            />
          </button>
        </footer>

        <div className="flex absolute inset-y-0 -right-2 z-0 gap-2 items-center pr-2 pl-2 w-4 min-h-[900px] max-md:hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/539c7d57b8db5dcbeb93a074af35a24dcfae17b2?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
            alt="Resize handle"
            className="object-contain w-0 aspect-[0] stroke-[1px] stroke-slate-500"
          />
        </div>
      </nav>
    </aside>
  );
};

interface NavItemProps {
  icon: string;
  text: string;
  active?: boolean;
  hasDropdown?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  icon,
  text,
  active,
  hasDropdown,
}) => {
  const baseClasses =
    "flex gap-2 items-center px-2 py-1.5 w-full rounded-md min-h-8";
  const activeClasses = active ? "bg-slate-400" : "";
  const textClasses = active ? "text-sky-950" : "text-white";

  return (
    <button className={`${baseClasses} ${activeClasses} mt-1`}>
      <div className="flex overflow-hidden justify-center self-stretch my-auto w-5 min-h-5">
        <img
          src={icon}
          alt={text}
          className="object-contain flex-1 shrink w-5 aspect-square basis-0"
        />
      </div>
      <span
        className={`flex-1 shrink self-stretch my-auto text-sm basis-0 text-ellipsis ${textClasses}`}
      >
        {text}
      </span>
      {hasDropdown && (
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e48c2a5a2b18814d6c41839c4a57f1212fc00adc?placeholderIfAbsent=true&apiKey=226d0b58387b443480f4c3ceb094be8c"
          alt="Dropdown"
          className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
        />
      )}
    </button>
  );
};
