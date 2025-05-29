"use client";

import AppLoading from "@/components/loading/app-loading";
import { usePing } from "../queries/use-ping";
import { useState } from "react";

export default function SimplePing() {
  const { data, isLoading, error, refetch } = usePing();
  const [lastUpdated, setLastUpdated] = useState<string>(
    new Date().toLocaleTimeString(),
  );

  const [buttonLoading, setButtonLoading] = useState(false);

  const handleRefetch = async () => {
    setButtonLoading(true);
    await refetch();
    setLastUpdated(new Date().toLocaleTimeString());
    setButtonLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Ping al backend</h2>

        <div className="mb-4">
          <button
            onClick={handleRefetch}
            disabled={buttonLoading}
            className={`px-4 py-2 rounded text-white flex items-center justify-center mx-auto ${
              buttonLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {buttonLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Reenviar Ping"
            )}
          </button>
        </div>

        {isLoading ? (
          <AppLoading />
        ) : error ? (
          <p className="text-red-500">
            Error: {error instanceof Error ? error.message : "Desconocido"}
          </p>
        ) : (
          <div>
            <p className="text-green-600 font-semibold mb-2">
              Respuesta: {data}
            </p>
            <p className="text-sm text-gray-500">Última actualización:</p>
            <p className="text-sm text-gray-500">{lastUpdated}</p>
          </div>
        )}
      </div>
    </div>
  );
}
