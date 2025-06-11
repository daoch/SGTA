package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Setter
@Getter
public class SolicitudCeseAsesoriaResumenDto {
    private int solicitudId;
    private String fechaEnvio;
    private String estadoGlobal;
    private String estadoAccion;
    private int temaId;
    private String temaTitulo;
    private String nombreSolicitante;
    private String correoSolicitante;
    private String nombreAsesorActual;

    public static SolicitudCeseAsesoriaResumenDto fromResultQuery(Object[] results) {
        SolicitudCeseAsesoriaResumenDto resumen = new SolicitudCeseAsesoriaResumenDto();
        resumen.solicitudId = (Integer) results[0];
        Instant fecha = (Instant) results[1];
        resumen.fechaEnvio = Utils.formatearInstant(fecha);
        resumen.temaId = (Integer) results[2];
        resumen.temaTitulo = (String) results[3];
        resumen.estadoGlobal = (String) results[4];
        String nombreSolicitante = (String) results[5];
        String apellidSolicitante = (String) results[6];
        resumen.nombreSolicitante = Utils.normalizarNombre(nombreSolicitante, apellidSolicitante);
        resumen.correoSolicitante = (String) results[7];
        String nombreAsesorActual = (String) results[8];
        String apellidoAsesorActual = (String) results[9];
        resumen.nombreAsesorActual = Utils.normalizarNombre(nombreAsesorActual, apellidoAsesorActual);
        resumen.estadoAccion = (String) results[12];
        return resumen;
    }
}
