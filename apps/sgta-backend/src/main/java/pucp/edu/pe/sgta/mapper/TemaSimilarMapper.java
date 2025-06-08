package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.TemaSimilarDto;
import pucp.edu.pe.sgta.dto.TemaDto;
import pucp.edu.pe.sgta.model.Tema;
import pucp.edu.pe.sgta.model.TemaSimilar;

/**
 * Mapper para convertir entre TemaSimilar (entidad) y TemaSimilarDto.
 */
public class TemaSimilarMapper {

    /**
     * Convierte una entidad TemaSimilar a su DTO.
     */
    public static TemaSimilarDto toDto(TemaSimilar entity) {
        if (entity == null) {
            return null;
        }
        TemaSimilarDto dto = TemaSimilarDto.builder()
            .id(entity.getId())
            .tema(TemaMapper.toDto(entity.getTema()))
            .temaRelacion(TemaMapper.toDto(entity.getTemaRelacion()))
            .porcentajeSimilitud(entity.getPorcentajeSimilitud())
            .activo(entity.getActivo())
            .fechaCreacion(entity.getFechaCreacion())
            .fechaModificacion(entity.getFechaModificacion())
            .usuario(UsuarioMapper.toDto(entity.getUsuario())) // Asumiendo que UsuarioMapper existe
            .build();
        return dto;
    }

    /**
     * Convierte un DTO TemaSimilarDto a su entidad.
     */
    public static TemaSimilar toEntity(TemaSimilarDto dto) {
        if (dto == null) {
            return null;
        }
        TemaSimilar entity = new TemaSimilar();
        if (dto.getId() != null) {
            entity.setId(dto.getId());
        }
        // Asignar solo la referencia por ID
        if (dto.getTema() != null && dto.getTema().getId() != null) {
            Tema tema = new Tema();
            tema.setId(dto.getTema().getId());
            entity.setTema(tema);
        }
        if (dto.getTemaRelacion() != null && dto.getTemaRelacion().getId() != null) {
            Tema temaRel = new Tema();
            temaRel.setId(dto.getTemaRelacion().getId());
            entity.setTemaRelacion(temaRel);
        }
        if (dto.getUsuario() != null && dto.getUsuario().getId() != null) {
            entity.setUsuario(UsuarioMapper.toEntity(dto.getUsuario()));
        }
        entity.setPorcentajeSimilitud(dto.getPorcentajeSimilitud());
        entity.setActivo(dto.getActivo() != null ? dto.getActivo() : Boolean.TRUE);
        // fechaCreacion y fechaModificacion las maneja la base de datos
        return entity;
    }
}
