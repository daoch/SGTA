package pucp.edu.pe.sgta.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class EstadoExposicionConverter implements AttributeConverter<EstadoExposicion, String> {

    @Override
    public String convertToDatabaseColumn(EstadoExposicion attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase(); // SIN_PROGRAMAR -> "sin_programar"
    }

    @Override
    public EstadoExposicion convertToEntityAttribute(String dbData) {
        //System.out.println("Convirtiendo estado desde BD: '" + dbData + "'");
        if (dbData == null) return null;
        try {
            return EstadoExposicion.valueOf(dbData.toUpperCase()); // "sin_programar" -> SIN_PROGRAMAR
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor desconocido para EstadoExposicion: " + dbData);
        }
    }
}
