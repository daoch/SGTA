"use client";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React from "react";
import { useState } from "react";
import { ReunionesAsesorModal } from "@/features/coordinador/components/reuniones-asersor-modal";

const Page: React.FC = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="p-8">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-[#042354] text-white hover:bg-[#001e44]">
            Ver historial de reuniones
          </Button>
        </DialogTrigger>
        <ReunionesAsesorModal onClose={() => setOpen(false)} />
      </Dialog>
    </div>
  );
};

export default Page;
