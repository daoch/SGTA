package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.dto.UsuarioSolicitudDto;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Getter
@Setter
public class DetalleSolicitudCeseTema {
    Integer solicitudId;
    String fechaEnvio;
    String estadoGlobal;
    String motivoEstudiante;
    Integer temaId;
    String temaTitulo;
    UsuarioSolicitudCambioAsesorDto solicitante;
    AsesorSolicitudCeseDto asesorActual;
    UsuarioSolicitudCambioAsesorDto coordinador;
    String fechaResolucion;

    public static DetalleSolicitudCeseTema fromQuery(Object[] query) {
        DetalleSolicitudCeseTema dto = new DetalleSolicitudCeseTema();
        dto.solicitudId = (Integer) query[0];
        Instant fechaEnvio = (Instant) query[1];
        dto.fechaEnvio = Utils.formatearInstant(fechaEnvio);
        dto.estadoGlobal = (String) query[2];
        dto.motivoEstudiante = (String) query[3];
        dto.temaId = (Integer) query[4];
        dto.temaTitulo = (String) query[5];
        Instant fechaResolucion = (Instant) query[6];
        dto.fechaResolucion = Utils.formatearInstant(fechaResolucion);
        return dto;
    }
}
