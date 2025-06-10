package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Setter
@Getter
public class DetalleSolicitudCeseAsesoriaDto {
    private int solicitudId;
    private String fechaEnvio;
    private String estadoGlobal;
    private String motivoEstudiante;
    private Integer temaId;
    private String temaTitulo;
    private UsuarioSolicitudCeseAsesoriaDto solicitante;
    private UsuarioSolicitudCeseAsesoriaDto asesorActual;
    private UsuarioSolicitudCeseAsesoriaDto coordinador;
    private String fechaResolucion;

    public static DetalleSolicitudCeseAsesoriaDto fromResultQuery(Object[] result) {
        DetalleSolicitudCeseAsesoriaDto detalle = new DetalleSolicitudCeseAsesoriaDto();
        detalle.setSolicitudId((Integer) result[0]);
        Instant instant = (Instant) result[1];
        detalle.setFechaEnvio(Utils.formatearInstant(instant));
        detalle.setEstadoGlobal((String) result[2]);
        detalle.setMotivoEstudiante((String) result[3]);
        detalle.setTemaId((Integer) result[4]);
        detalle.setTemaTitulo((String) result[5]);
        instant = (Instant) result[10];
        detalle.setFechaResolucion(Utils.formatearInstant(instant));
        return detalle;
    }
}
