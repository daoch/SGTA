package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.RolDto;
import pucp.edu.pe.sgta.model.Rol;

import java.util.List;
import java.util.stream.Collectors;

public class RolMapper {
    
    public static RolDto toDto(Rol rol) {
        if (rol == null) {
            return null;
        }
        
        return RolDto.builder()
                .id(rol.getId())
                .nombre(rol.getNombre())
                .descripcion(rol.getDescripcion())
                .activo(rol.getActivo())
                .fechaCreacion(rol.getFechaCreacion())
                .fechaModificacion(rol.getFechaModificacion())
                .build();
    }
    
    public static List<RolDto> toDtoList(List<Rol> roles) {
        if (roles == null) {
            return List.of();
        }
        
        return roles.stream()
                .map(RolMapper::toDto)
                .collect(Collectors.toList());
    }
    
    public static Rol toEntity(RolDto dto) {
        if (dto == null) {
            return null;
        }
        
        Rol rol = new Rol();
        rol.setId(dto.getId());
        rol.setNombre(dto.getNombre());
        rol.setDescripcion(dto.getDescripcion());
        rol.setActivo(dto.getActivo());
        rol.setFechaCreacion(dto.getFechaCreacion());
        rol.setFechaModificacion(dto.getFechaModificacion());
        
        return rol;
    }
}