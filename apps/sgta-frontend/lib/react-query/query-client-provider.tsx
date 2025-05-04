"use client";

import { QueryClientProvider as TanstackQueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { queryClient } from "./query-client";

interface QueryClientProviderProps {
  children: React.ReactNode;
}

export const QueryClientProvider = ({ children }: QueryClientProviderProps) => {
  const [client] = useState(() => queryClient);

  return (
    <TanstackQueryClientProvider client={client}>
      {children}
      {process.env.NODE_ENV !== "production" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </TanstackQueryClientProvider>
  );
};
