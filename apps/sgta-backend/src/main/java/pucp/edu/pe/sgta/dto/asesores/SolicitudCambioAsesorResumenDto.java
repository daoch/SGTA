package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;
import java.time.OffsetDateTime;

@Setter
@Getter
public class SolicitudCambioAsesorResumenDto {
    private int solicitudId;
    private String fechaEnvio;
    private String estadoGlobal;
    private String estadoAccion;
    private int temaId;
    private String temaTitulo;
    private String nombreSolicitante;
    private String correoSolicitante;
    private String nombreAsesorActual;
    private String nombreAsesorNuevo;

    public static SolicitudCambioAsesorResumenDto fromResultQuery(Object[] results) {
        SolicitudCambioAsesorResumenDto resumen = new SolicitudCambioAsesorResumenDto();
        resumen.solicitudId = (Integer) results[0];
        Instant fecha = (Instant) results[1];
        resumen.fechaEnvio = Utils.formatearInstant(fecha);
        resumen.temaId = (Integer) results[2];
        resumen.temaTitulo = (String) results[3];
        resumen.estadoGlobal = (String) results[4];
        String nombreSolicitante = (String) results[5];
        String apellidSolicitante = (String) results[6];
        resumen.nombreSolicitante = Utils.normalizarNombre(nombreSolicitante,apellidSolicitante);
        resumen.correoSolicitante = (String) results[7];
        String nombreAsesorActual = (String) results[8];
        String apellidoAsesorActual = (String) results[9];
        resumen.nombreAsesorActual = Utils.normalizarNombre(nombreAsesorActual,apellidoAsesorActual);
        String nombreAsesorNuevo = (String) results[10];
        String apellidoAsesorNuevo = (String) results[11];
        resumen.nombreAsesorNuevo = Utils.normalizarNombre(nombreAsesorNuevo,apellidoAsesorNuevo);
        resumen.estadoAccion = (String) results[12];
        return resumen;
    }
}
