"use client";

import React from "react";

const AppMain = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
  );
};

export default AppMain;
