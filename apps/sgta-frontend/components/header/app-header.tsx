"use client";


import { NotificationsDropdown } from "@/features/notifications/components/notifications-dropdown";

import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

export default function AppHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b bg-white">
      <div className="flex items-center justify-between gap-2 px-4 flex-1">
        <Image
          src="/logo.png"
          alt="Logo"
          width={150}
          height={41}
          className="select-none pointer-events-none h-10 w-auto"
          draggable={false}
          priority={true}
        />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <NotificationsDropdown />
      </div>
    </header>
  );
}
