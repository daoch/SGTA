package pucp.edu.pe.sgta.mapper;

import pucp.edu.pe.sgta.dto.CarreraXParametroConfiguracionDto;
import pucp.edu.pe.sgta.model.CarreraXParametroConfiguracion;
import pucp.edu.pe.sgta.util.TipoDatoEnum;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import pucp.edu.pe.sgta.model.Carrera;


public class CarreraXParametroConfiguracionMapper {

	public static CarreraXParametroConfiguracionDto toDto(CarreraXParametroConfiguracion carreraXParametroConfiguracion) {
		CarreraXParametroConfiguracionDto dto = new CarreraXParametroConfiguracionDto();
		dto.setId(carreraXParametroConfiguracion.getId());

        String valor = carreraXParametroConfiguracion.getValor();
        TipoDatoEnum tipo = carreraXParametroConfiguracion.getParametroConfiguracion().getTipoDato();

        //Pasar valores de acuerdo al tipo de dato
        switch (tipo) {
            case BOOLEANO:
                // Si el tipo es booleano, convierte el valor a Boolean
                dto.setValor(Boolean.parseBoolean(valor));
                break;
            case INTEGER:
                // Si el tipo es Integer, convierte el valor a Integer
                dto.setValor(Integer.parseInt(valor)); 
                break;
            case DATE:
                // Si el tipo es Date, convierte el valor a Date o ZonedDateTime 
                DateTimeFormatter formatter = DateTimeFormatter.ISO_ZONED_DATE_TIME;
                dto.setValor(ZonedDateTime.parse(valor, formatter)); // Si el valor es una fecha en formato ISO
                break;
            case STRING:
            default:
                dto.setValor(valor); 
                break;
        }

        
		dto.setActivo(carreraXParametroConfiguracion.isActivo());
        dto.setCarreraId(carreraXParametroConfiguracion.getCarrera().getId());
        dto.setParametroConfiguracion(ParametroConfiguracionMapper.toDto(carreraXParametroConfiguracion.getParametroConfiguracion()));

		return dto;
	}

    public static CarreraXParametroConfiguracion toEntity(CarreraXParametroConfiguracionDto dto) {
		CarreraXParametroConfiguracion carreraXParametroConfiguracion = new CarreraXParametroConfiguracion();
		carreraXParametroConfiguracion.setId(dto.getId());
        carreraXParametroConfiguracion.setValor(dto.getValor().toString()); 
		carreraXParametroConfiguracion.setActivo(dto.isActivo());
        Carrera carrera = new Carrera(); 
        carrera.setId(dto.getCarreraId());
        carreraXParametroConfiguracion.setCarrera(carrera);
        carreraXParametroConfiguracion.setParametroConfiguracion(ParametroConfiguracionMapper.toEntity(dto.getParametroConfiguracion()));
        return carreraXParametroConfiguracion;

	}

}
