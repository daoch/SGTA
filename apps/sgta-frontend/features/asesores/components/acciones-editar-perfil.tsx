// components/EditarPerfilActions.tsx

import { Button } from "@/components/ui/button";
import { Edit, Save, X } from "lucide-react";

interface Props {
  isEditing: boolean;
  onStartEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function EditarPerfilActions({
  isEditing,
  onStartEdit,
  onSave,
  onCancel,
}: Props) {
  return !isEditing ? (
    <Button
      onClick={onStartEdit}
      variant="outline"
      className="bg-white text-black hover:bg-gray-100 w-full sm:w-auto"
    >
      <Edit className="h-4 w-4 mr-2" /> Editar perfil
    </Button>
  ) : (
    <div className="flex gap-2 w-full sm:w-auto">
      <Button
        onClick={onSave}
        className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-initial"
      >
        <Save className="h-4 w-4 mr-2" /> Guardar
      </Button>
      <Button
        onClick={onCancel}
        variant="outline"
        className="flex-1 sm:flex-initial"
      >
        <X className="h-4 w-4 mr-2" /> Cancelar
      </Button>
    </div>
  );
}
