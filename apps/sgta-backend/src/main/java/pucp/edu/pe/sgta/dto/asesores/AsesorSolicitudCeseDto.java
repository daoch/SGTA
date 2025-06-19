package pucp.edu.pe.sgta.dto.asesores;

import pucp.edu.pe.sgta.util.AccionSolicitudEnum;
import pucp.edu.pe.sgta.util.RolSolicitudEnum;
import pucp.edu.pe.sgta.util.Utils;

public class AsesorSolicitudCeseDto {
    private int id;
    private String nombres;
    private String correoElectronico;
    private final String rolSolicitud = RolSolicitudEnum.ASESOR_ACTUAL.name();
    private String foto;
    private final String accionSolicitud = AccionSolicitudEnum.SIN_ACCION.name();

    public static AsesorSolicitudCeseDto fromQueryResult(Object[] result) {
        AsesorSolicitudCeseDto dto = new AsesorSolicitudCeseDto();
        dto.id = (Integer) result[0];
        String nombre = (String) result[1];
        String apellido = (String) result[2];
        dto.nombres = Utils.normalizarNombre(nombre,apellido);
        dto.correoElectronico = (String) result[3];
        byte[] foto = (byte[]) result[4];
        dto.foto = Utils.convertByteArrayToStringBase64(foto);
        return dto;
    }
}
