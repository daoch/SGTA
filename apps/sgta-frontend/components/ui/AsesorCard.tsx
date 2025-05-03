import { Button } from '@/components/ui/button';
import { AsesorInfo } from '@/features/asesores/types';

type Props = {
  asesor: AsesorInfo;
  onToggle: () => void;
};

const AsesorCard = ({ asesor, onToggle }: Props) => {
  return (
    <div className="flex justify-between items-center border-b pb-3">
      <div>
        <p className="font-semibold">{asesor.nombre}</p>
        <p className="text-sm text-muted-foreground">{asesor.especialidad}</p>
        <p className="text-sm text-muted-foreground">{asesor.correo}</p>
      </div>
      <div className="flex items-center gap-4">
        <p className={`text-sm font-medium ${asesor.estado === 'habilitado' ? 'text-green-600' : 'text-red-600'}`}>
          {asesor.estado}
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
        >
          {asesor.estado === 'habilitado' ? 'Inhabilitar' : 'Habilitar'}
        </Button>
      </div>
    </div>
  );
};

export default AsesorCard;
