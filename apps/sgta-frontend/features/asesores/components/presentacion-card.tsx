// components/PresentacionCard.tsx

import { Textarea } from "@/components/ui/textarea";

interface Props {
  isEditing: boolean;
  biografia: string;
  setBiografia: (value: string) => void;
}

export default function PresentacionCard({
  isEditing,
  biografia,
  setBiografia,
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Presentación</h3>

      {isEditing ? (
        <Textarea
          value={biografia}
          onChange={(e) => setBiografia(e.target.value)}
          className="min-h-[150px] w-full"
        />
      ) : (
        <p className="text-sm sm:text-base text-gray-700">{biografia}</p>
      )}
    </div>
  );
}
