package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.ParametroConfiguracionDto;
import pucp.edu.pe.sgta.model.ParametroConfiguracion;

import pucp.edu.pe.sgta.model.Modulo;

public class ParametroConfiguracionMapper {

	public static ParametroConfiguracionDto toDto(ParametroConfiguracion ParametroConfiguracion) {
		ParametroConfiguracionDto dto = new ParametroConfiguracionDto();
		dto.setId(ParametroConfiguracion.getId());
        dto.setNombre(ParametroConfiguracion.getNombre());
        dto.setActivo(ParametroConfiguracion.isActivo());
        dto.setDescripcion(ParametroConfiguracion.getDescripcion());
        dto.setModuloId(ParametroConfiguracion.getModulo().getId());
        dto.setTipoDato(ParametroConfiguracion.getTipoDato());

		return dto;
	}

    public static ParametroConfiguracion toEntity(ParametroConfiguracionDto dto) {
		ParametroConfiguracion parametroConfiguracion = new ParametroConfiguracion();
		parametroConfiguracion.setId(dto.getId());
        parametroConfiguracion.setNombre(dto.getNombre());
        parametroConfiguracion.setActivo(dto.isActivo());
		parametroConfiguracion.setDescripcion(dto.getDescripcion());
        Modulo modulo = new Modulo();
        modulo.setId(dto.getModuloId());
        parametroConfiguracion.setModulo(modulo);
        parametroConfiguracion.setTipoDato(dto.getTipoDato());

        return parametroConfiguracion;

	}

}