"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogTitle,
} from "@/components/ui/dialog";
import { useAuthStore } from "@/features/auth/store/auth-store";
import { ArrowLeft, RefreshCcw, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast, Toaster } from "sonner";

export default function SimilitudTemasPage() {
  const [openDialog, setOpenDialog] = useState<null | "init" | "clear">(null);
  const [loading, setLoading] = useState(false);

  const handleInitializeFaiss = async () => {
    setLoading(true);
    try {
      const { idToken } = useAuthStore.getState();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/initializeFaiss`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Error al inicializar embeddings");
      toast.success("Embeddings inicializados correctamente");
      setOpenDialog(null);
    } catch (error) {
      toast.error("No se pudo inicializar embeddings");
    } finally {
      setLoading(false);
    }
  };

  const handleClearFaiss = async () => {
    setLoading(true);
    try {
      const { idToken } = useAuthStore.getState();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/temas/clearFaiss`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Error al eliminar embeddings");
      toast.success("Todos los embeddings fueron eliminados correctamente");
      setOpenDialog(null);
    } catch (error) {
      toast.error("No se pudo eliminar los embeddings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 px-2">
      <Toaster richColors position="bottom-right" />
      <div className="flex items-center gap-4 mb-6">
        <Link href="/administrador/configuracion">
          <Button variant="ghost" size="icon">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Gestión de Embeddings</h1>
      </div>

      <div className="py-10 flex flex-col items-center gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <button
            onClick={() => setOpenDialog("init")}
            className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow w-full text-left"
          >
            <RefreshCcw size={50} className="text-[#0F1A3A]" />
            <div>
              <div className="font-bold text-lg mb-1">Inicializar Embeddings</div>
              <div className="text-sm text-muted-foreground">
                Inicializa los embeddings de todos los temas registrados en el sistema para búsquedas de similitud.
              </div>
            </div>
          </button>
          <button
            onClick={() => setOpenDialog("clear")}
            className="bg-white rounded-lg shadow p-6 flex items-start gap-4 hover:shadow-md transition-shadow w-full text-left"
          >
            <Trash2 size={50} className="text-[#0F1A3A]" />
            <div>
              <div className="font-bold text-lg mb-1">Eliminar todos los Embeddings</div>
              <div className="text-sm text-muted-foreground">
                Elimina todos los embeddings actualmente almacenados. Útil para limpieza o en caso de corrupción de datos.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Dialog de confirmación */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="[&>button.absolute]:hidden">
          <DialogTitle>
            {openDialog === "init"
              ? "¿Seguro que quieres inicializar los embeddings de todos los temas?"
              : "¿Seguro que quieres eliminar todos los embeddings?"}
          </DialogTitle>
          <div className="text-sm mt-2 mb-4">
            {openDialog === "init"
              ? "Asegúrate de que los embeddings estén limpios antes de inicializar. Esta acción puede sobrescribir datos existentes."
              : "Esta acción no se puede deshacer."}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              className={openDialog === "clear" ? "bg-red-600 text-white" : ""}
              onClick={
                openDialog === "init"
                  ? handleInitializeFaiss
                  : handleClearFaiss
              }
              disabled={loading}
            >
              {loading && openDialog === "init"
                ? "Procesando..."
                : openDialog === "init"
                ? "Inicializar"
                : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
