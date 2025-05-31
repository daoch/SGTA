package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.util.Utils;

import java.time.Instant;

@Setter
@Getter
public class UsuarioSolicitudCambioAsesorDto {
    private int id;
    private String nombres;
    private String correoElectronico;
    private String rolSolicitud;
    private String foto;
    private String accionSolicitud;
    private String fechaAccion;
    private String comentario;

    public static UsuarioSolicitudCambioAsesorDto fromQueryResult(Object[] result) {
        UsuarioSolicitudCambioAsesorDto dto = new UsuarioSolicitudCambioAsesorDto();
        dto.id = (int)result[0];
        String nombres = (String)result[1];
        String apellidos = (String)result[2];
        dto.nombres = Utils.normalizarNombre(nombres, apellidos);
        dto.correoElectronico = (String)result[3];
        byte[] foto = (byte[])result[4];
        dto.foto = Utils.convertByteArrayToStringBase64(foto);
        dto.rolSolicitud = (String)result[5];
        dto.accionSolicitud = (String)result[6];
        Instant fechaAccion = (Instant)result[7];
        dto.fechaAccion = Utils.formatearInstant(fechaAccion);
        dto.comentario = (String)result[8];
        return dto;
    }
}
