package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.dto.UsuarioSolicitudDto;

@Getter
@Setter
public class DetalleSolicitudCeseTema {
    Integer solicitudId;
    String fechaEnvio;
    String estadoGlobal;
    String motivoEstudiante;
    Integer temaId;
    String temaTitulo;
    UsuarioSolicitudDto solicitante;
    UsuarioSolicitudDto asesorActual;
    UsuarioSolicitudDto coordinador;
    String fechaResolucion;
}
