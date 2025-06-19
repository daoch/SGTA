package pucp.edu.pe.sgta.mapper;

import org.springframework.stereotype.Component;
import pucp.edu.pe.sgta.dto.ConfiguracionRecordatorioDto;
import pucp.edu.pe.sgta.model.ConfiguracionRecordatorio;

@Component
public class ConfiguracionRecordatorioMapper {
    public ConfiguracionRecordatorioDto toDto(ConfiguracionRecordatorio entity) {
        ConfiguracionRecordatorioDto dto = new ConfiguracionRecordatorioDto();
        dto.setId(entity.getId());
        dto.setUsuarioId(entity.getUsuario().getId());
        dto.setActivo(entity.getActivo());
        dto.setDiasAnticipacion(entity.getDiasAnticipacion());
        dto.setCanalCorreo(entity.getCanalCorreo());
        dto.setCanalSistema(entity.getCanalSistema());
        return dto;
    }

    public void updateEntityFromDto(ConfiguracionRecordatorioDto dto, ConfiguracionRecordatorio entity) {
        entity.setActivo(dto.getActivo());
        entity.setDiasAnticipacion(dto.getDiasAnticipacion());
        entity.setCanalCorreo(dto.getCanalCorreo());
        entity.setCanalSistema(dto.getCanalSistema());
        entity.setFechaModificacion(java.time.OffsetDateTime.now());
    }
}