package pucp.edu.pe.sgta.mapper;

import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.dto.UsuarioXReunionDto;
import pucp.edu.pe.sgta.model.UsuarioXReunion;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class UsuarioXReunionMapper {

    public UsuarioXReunionDto toDTO(UsuarioXReunion usuarioXReunion) {
        if (usuarioXReunion == null) {
            return null;
        }

        UsuarioXReunionDto dto = new UsuarioXReunionDto();
        dto.setId(usuarioXReunion.getId());
        dto.setUsuarioId(usuarioXReunion.getUsuario().getId());
        dto.setUsuarioNombre(usuarioXReunion.getUsuario().getNombres() + " " +
                usuarioXReunion.getUsuario().getPrimerApellido());
        dto.setReunionId(usuarioXReunion.getReunion().getId());
        dto.setReunionTitulo(usuarioXReunion.getReunion().getTitulo());
        dto.setReunionFechaHoraInicio(usuarioXReunion.getReunion().getFechaHoraInicio());
        dto.setReunionFechaHoraFin(usuarioXReunion.getReunion().getFechaHoraFin());
        dto.setEstadoAsistencia(usuarioXReunion.getEstadoAsistencia());
        dto.setEstadoDetalle(usuarioXReunion.getEstadoDetalle());
        dto.setActivo(usuarioXReunion.getActivo());
        dto.setFechaCreacion(usuarioXReunion.getFechaCreacion());
        dto.setFechaModificacion(usuarioXReunion.getFechaModificacion());

        return dto;
    }

    public List<UsuarioXReunionDto> toDTOList(List<UsuarioXReunion> usuarioXReuniones) {
        if (usuarioXReuniones == null) {
            return null;
        }

        return usuarioXReuniones.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

}