"use client";

import React from "react";

const AppMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-full flex flex-1 flex-col gap-4 p-4 overflow-hidden">
      {children}
    </main>
  );
};

export default AppMain;
