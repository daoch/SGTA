package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Setter
@Getter
public class DetalleSolicitudCambioAsesorDto {
    private int solicitudId;
    private String fechaEnvio;
    private String estadoGlobal;
    private String motivoEstudiante;
    private Integer temaId;
    private String temaTitulo;
    private UsuarioSolicitudCambioAsesorDto solicitante;
    private UsuarioSolicitudCambioAsesorDto asesorActual;
    private UsuarioSolicitudCambioAsesorDto asesorNuevo;
    private UsuarioSolicitudCambioAsesorDto coordinador;
    private String fechaResolucion;

    public static DetalleSolicitudCambioAsesorDto fromResultQuery(Object[] result) {
        DetalleSolicitudCambioAsesorDto detalle = new DetalleSolicitudCambioAsesorDto();
        detalle.solicitudId = (Integer) result[0];
        Instant instant = (Instant) result[1];
        detalle.fechaEnvio = Utils.formatearInstant(instant);
        detalle.estadoGlobal = (String) result[2];
        detalle.motivoEstudiante = (String) result[3];
        detalle.temaId = (Integer) result[4];
        detalle.temaTitulo = (String) result[5];
        instant = (Instant) result[10];
        detalle.fechaResolucion = Utils.formatearInstant(instant);
        return detalle;
    }
}
