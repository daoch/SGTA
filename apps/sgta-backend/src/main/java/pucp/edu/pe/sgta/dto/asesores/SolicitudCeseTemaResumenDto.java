package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Getter
@Setter
public class SolicitudCeseTemaResumenDto {
    Integer solicitudId;
    Integer temaId;
    String temaTitulo;

    String fechaEnvio;
    String estadoGlobal;
    String estadoAccion;

    String nombreSolicitante;
    String correoSolicitante;
    String nombreAsesorActual;

    public static SolicitudCeseTemaResumenDto fromQuery(Object[] result){
        SolicitudCeseTemaResumenDto dto = new SolicitudCeseTemaResumenDto();
        dto.solicitudId = (Integer) result[0];
        dto.temaId = (Integer) result[1];
        dto.temaTitulo = (String) result[2];

        Instant fechaEnvio = (Instant) result[3];
        dto.fechaEnvio = Utils.formatearInstant(fechaEnvio);

        dto.estadoGlobal = (String) result[4];
        String solicitanteNombres = (String) result[5];
        String solicitanteApellido = (String) result[6];
        dto.nombreSolicitante = Utils.normalizarNombre(solicitanteNombres, solicitanteApellido);
        dto.correoSolicitante = (String) result[7];

        String asesorNombre = (String) result[8];
        String asesorApellido = (String) result[9];
        dto.nombreAsesorActual = Utils.normalizarNombre(asesorNombre, asesorApellido);

        dto.estadoAccion = (String) result[10];
        return dto;
    }
}
