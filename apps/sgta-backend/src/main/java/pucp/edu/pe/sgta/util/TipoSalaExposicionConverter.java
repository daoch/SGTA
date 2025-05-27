package pucp.edu.pe.sgta.util;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = false)
public class TipoSalaExposicionConverter implements AttributeConverter<TipoSalaExposicion, String> {

    @Override
    public String convertToDatabaseColumn(TipoSalaExposicion attribute) {
        if (attribute == null) return null;
        return attribute.name().toLowerCase(); // PRESENCIAL -> "presencial"
    }

    @Override
    public TipoSalaExposicion convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        try {
            return TipoSalaExposicion.valueOf(dbData.toUpperCase()); // "presencial" -> PRESENCIAL
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Valor desconocido para TipoSalaExposicion: " + dbData);
        }
    }
}
