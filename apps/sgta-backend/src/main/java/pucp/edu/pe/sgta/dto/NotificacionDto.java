package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificacionDto {
    private Integer notificacionId;
    private String mensaje;
    private String canal;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaLectura;
    private Boolean activo;
    private String tipoNotificacion;
    private Integer prioridad;
    private String modulo;
    private Integer usuarioId;
    private String nombreUsuario;
} 