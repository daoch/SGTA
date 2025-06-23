package pucp.edu.pe.sgta.service.inter;

import pucp.edu.pe.sgta.dto.ConfiguracionRecordatorioDto;

public interface ConfiguracionRecordatorioService {
    ConfiguracionRecordatorioDto getByUsuarioId(Integer usuarioId);
    ConfiguracionRecordatorioDto saveOrUpdate(Integer usuarioId, ConfiguracionRecordatorioDto dto);
}