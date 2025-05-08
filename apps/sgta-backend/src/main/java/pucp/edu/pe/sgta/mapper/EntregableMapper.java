package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.EntregableDto;
import pucp.edu.pe.sgta.model.Entregable;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;

public class EntregableMapper {

    public static EntregableDto toDto(Entregable entregable) {
        if( entregable == null) {
            return null;
        }

        EntregableDto dto = new EntregableDto();
        dto.setId(entregable.getId());
        dto.setNombre(entregable.getNombre());
        dto.setDescripcion(entregable.getDescripcion());
        dto.setFechaInicio(entregable.getFechaInicio());
        dto.setFechaFin(entregable.getFechaFin());
        dto.setEsEvaluable(entregable.isEsEvaluable());
        dto.setEstado(entregable.getEstado());

        if(entregable.getEtapaFormativaXCiclo() != null) {
            dto.setEtapaFormativaXCicloId(entregable.getEtapaFormativaXCiclo().getId());
        }

        return dto;
    }

    public static Entregable toEntity(EntregableDto dto) {
        if( dto == null) {
            return null;
        }

        Entregable entregable = new Entregable();
        entregable.setId(dto.getId());
        entregable.setNombre(dto.getNombre());
        entregable.setDescripcion(dto.getDescripcion());
        entregable.setFechaInicio(dto.getFechaInicio());
        entregable.setFechaFin(dto.getFechaFin());
        entregable.setEsEvaluable(dto.isEsEvaluable());
        entregable.setEstado(dto.getEstado());

        if(dto.getEtapaFormativaXCicloId() != null) {
            EtapaFormativaXCiclo efc = new EtapaFormativaXCiclo();
            efc.setId(dto.getEtapaFormativaXCicloId());
            entregable.setEtapaFormativaXCiclo(efc);
        }

        return entregable;
    }

}