package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.Tema;

public class TemaMapper {
    public static TemaDto toDto(Tema tema) {
        TemaDto dto = new TemaDto();
        dto.setId(tema.getId());
        dto.setTitulo(tema.getTitulo());
        dto.setCodigo(tema.getCodigo());
        dto.setResumen(tema.getResumen());
        dto.setObjetivos(tema.getObjetivos());
        dto.setMetodologia(tema.getMetodologia());
        dto.setFechaCreacion(tema.getFechaCreacion());
        dto.setFechaModificacion(tema.getFechaModificacion());
        dto.setPortafolioUrl(tema.getPortafolioUrl());
        return dto;
    }

    public static Tema toEntity(TemaDto dto) {
        Tema tema = new Tema();
        tema.setId(dto.getId());
        tema.setTitulo(dto.getTitulo());
        tema.setCodigo(dto.getCodigo());
        tema.setResumen(dto.getResumen());
        tema.setObjetivos(dto.getObjetivos());
        tema.setMetodologia(dto.getMetodologia());
        tema.setFechaCreacion(dto.getFechaCreacion());
        tema.setFechaModificacion(dto.getFechaModificacion());
        tema.setPortafolioUrl(dto.getPortafolioUrl());
        return tema;
    }
}
