package pucp.edu.pe.sgta.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoExposicionUsuarioConverter implements AttributeConverter<EstadoExposicionUsuario, String> {

	@Override
	public String convertToDatabaseColumn(EstadoExposicionUsuario attribute) {
		if (attribute == null)
			return null;
		return attribute.name().toLowerCase(); // ACEPTADO -> "aceptado"
	}

	@Override
	public EstadoExposicionUsuario convertToEntityAttribute(String dbData) {
		System.out.println("Convirtiendo estado desde BD: '" + dbData + "'");
		if (dbData == null)
			return null;
		try {
			return EstadoExposicionUsuario.valueOf(dbData.toUpperCase()); // "aceptado" ->
																			// ACEPTADO
		}
		catch (IllegalArgumentException e) {
			throw new IllegalArgumentException("Valor desconocido para EstadoExposicionUsuario: " + dbData);
		}
	}

}