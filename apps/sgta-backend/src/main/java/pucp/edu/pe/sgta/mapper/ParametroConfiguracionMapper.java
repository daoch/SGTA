package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ParametroConfiguracionDto;
import pucp.edu.pe.sgta.model.ParametroConfiguracion;

public class ParametroConfiguracionMapper {

	public static ParametroConfiguracionDto toDto(ParametroConfiguracion ParametroConfiguracion) {
		ParametroConfiguracionDto dto = new ParametroConfiguracionDto();
		dto.setId(ParametroConfiguracion.getId());
        dto.setNombre(ParametroConfiguracion.getNombre());
        dto.setDescripcion(ParametroConfiguracion.getDescripcion());

		return dto;
	}

    public static ParametroConfiguracion toEntity(ParametroConfiguracionDto dto) {
		ParametroConfiguracion parametroConfiguracion = new ParametroConfiguracion();
		parametroConfiguracion.setId(dto.getId());
        parametroConfiguracion.setNombre(dto.getNombre());
		parametroConfiguracion.setDescripcion(dto.getDescripcion());

        return parametroConfiguracion;

	}

}