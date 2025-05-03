import { AsesorInfo } from '../types';
import AsesorCard from '@/components/ui/AsesorCard';

type Props = {
  asesores: AsesorInfo[];
  onToggleEstado: (id: string) => void;
};

const AsesorList = ({ asesores, onToggleEstado }: Props) => {
  return (
    <div className="space-y-4">
      {asesores.map(asesor => (
        <AsesorCard
          key={asesor.id}
          asesor={asesor}
          onToggle={() => onToggleEstado(asesor.id)}
        />
      ))}
    </div>
  );
};

export default AsesorList;
