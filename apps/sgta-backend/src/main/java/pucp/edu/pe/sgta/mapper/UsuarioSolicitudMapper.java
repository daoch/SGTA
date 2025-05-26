package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.UsuarioSolicitudDto;
import pucp.edu.pe.sgta.model.UsuarioXSolicitud;
import pucp.edu.pe.sgta.model.Usuario;
import pucp.edu.pe.sgta.model.Solicitud;

public class UsuarioSolicitudMapper {
    public static UsuarioSolicitudDto toDto(UsuarioXSolicitud entity) {
        if (entity == null) {
            return null;
        }
        return UsuarioSolicitudDto.builder()
            .id(entity.getId())
            .usuarioId(entity.getUsuario() != null ? entity.getUsuario().getId() : null)
            .solicitudId(entity.getSolicitud() != null ? entity.getSolicitud().getId() : null)
            .solicitudCompletada(entity.getSolicitudCompletada())
            .aprovado(entity.getAprovado())
            .comentario(entity.getComentario())
            .destinatario(entity.getDestinatario())
            .activo(entity.getActivo())
            .build();
    }

    public static UsuarioXSolicitud toEntity(UsuarioSolicitudDto dto) {
        if (dto == null) {
            return null;
        }
        UsuarioXSolicitud entity = new UsuarioXSolicitud();
        entity.setId(dto.getId());

        if (dto.getUsuarioId() != null) {
            Usuario usuario = new Usuario();
            usuario.setId(dto.getUsuarioId());
            entity.setUsuario(usuario);
        }

        if (dto.getSolicitudId() != null) {
            Solicitud solicitud = new Solicitud();
            solicitud.setId(dto.getSolicitudId());
            entity.setSolicitud(solicitud);
        }

        entity.setSolicitudCompletada(dto.getSolicitudCompletada());
        entity.setAprovado(dto.getAprovado());
        entity.setComentario(dto.getComentario());
        entity.setDestinatario(dto.getDestinatario());
        entity.setActivo(dto.getActivo());
        return entity;
    }
}
