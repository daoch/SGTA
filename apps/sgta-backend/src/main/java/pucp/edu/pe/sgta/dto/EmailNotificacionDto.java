package pucp.edu.pe.sgta.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmailNotificacionDto {
    private String destinatario;
    private String nombreDestinatario;
    private String asunto;
    private String mensaje;
    private String tipoNotificacion; // "recordatorio", "alerta", "informativa"
} 