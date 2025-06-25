package pucp.edu.pe.sgta.dto;

import lombok.Data;
import java.util.List;

@Data
public class ConfiguracionRecordatorioDto {
    private Integer id;
    private Integer usuarioId;
    private Boolean activo;
    private Integer[] diasAnticipacion;
    private Boolean canalCorreo;
    private Boolean canalSistema;
}