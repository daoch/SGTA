package pucp.edu.pe.sgta.mapper;

import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.dto.ReunionDto;
import pucp.edu.pe.sgta.model.Reunion;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReunionMapper {

    public ReunionDto toDTO(Reunion reunion) {
        if (reunion == null) {
            return null;
        }

        ReunionDto dto = new ReunionDto();
        dto.setId(reunion.getId());
        dto.setTitulo(reunion.getTitulo());
        dto.setFechaHoraInicio(reunion.getFechaHoraInicio());
        dto.setFechaHoraFin(reunion.getFechaHoraFin());
        dto.setDescripcion(reunion.getDescripcion());
        dto.setDisponible(reunion.getDisponible());
        dto.setUrl(reunion.getUrl());
        dto.setActivo(reunion.getActivo());
        dto.setFechaCreacion(reunion.getFechaCreacion());
        dto.setFechaModificacion(reunion.getFechaModificacion());

        return dto;
    }

    public List<ReunionDto> toDTOList(List<Reunion> reuniones) {
        if (reuniones == null) {
            return null;
        }

        return reuniones.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Reunion toEntity(ReunionDto dto) {
        if (dto == null) {
            return null;
        }

        Reunion reunion = new Reunion();
        reunion.setId(dto.getId());
        reunion.setTitulo(dto.getTitulo());
        reunion.setFechaHoraInicio(dto.getFechaHoraInicio());
        reunion.setFechaHoraFin(dto.getFechaHoraFin());
        reunion.setDescripcion(dto.getDescripcion());
        reunion.setDisponible(dto.getDisponible());
        reunion.setUrl(dto.getUrl());
        reunion.setActivo(dto.getActivo());

        return reunion;
    }

}