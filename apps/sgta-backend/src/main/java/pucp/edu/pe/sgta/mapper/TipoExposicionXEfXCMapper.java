package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TipoExposicionXEfXCDto;
import pucp.edu.pe.sgta.model.TipoExposicionXEfXC;
import pucp.edu.pe.sgta.model.EtapaFormativaXCiclo;
import pucp.edu.pe.sgta.model.TipoExposicion;

public class TipoExposicionXEfXCMapper {

    public static TipoExposicionXEfXCDto toDto(TipoExposicionXEfXC tipoExposicionXEfXC) {
        TipoExposicionXEfXCDto dto = new TipoExposicionXEfXCDto();
        dto.setId(tipoExposicionXEfXC.getId());
        dto.setEtapaFormativaXCicloId(tipoExposicionXEfXC.getEtapaFormativaXCiclo().getId());
        dto.setTipoExposicionId(tipoExposicionXEfXC.getTipoExposicion().getId());
        dto.setActivo(tipoExposicionXEfXC.getActivo());
        dto.setFechaCreacion(tipoExposicionXEfXC.getFechaCreacion());
        dto.setFechaModificacion(tipoExposicionXEfXC.getFechaModificacion());
        return dto;
    }

    public static TipoExposicionXEfXC toEntity(TipoExposicionXEfXCDto dto) {
        if (dto == null)
            return null;

        TipoExposicionXEfXC entity = new TipoExposicionXEfXC();
        entity.setId(dto.getId());
        entity.setActivo(dto.getActivo());
        entity.setFechaCreacion(dto.getFechaCreacion());
        entity.setFechaModificacion(dto.getFechaModificacion());

        if (dto.getEtapaFormativaXCicloId() != null) {
            EtapaFormativaXCiclo efxc = new EtapaFormativaXCiclo();
            efxc.setId(dto.getEtapaFormativaXCicloId());
            entity.setEtapaFormativaXCiclo(efxc);
        }

        if (dto.getTipoExposicionId() != null) {
            TipoExposicion tipoExposicion = new TipoExposicion();
            tipoExposicion.setId(dto.getTipoExposicionId());
            entity.setTipoExposicion(tipoExposicion);
        }

        return entity;
    }
}
