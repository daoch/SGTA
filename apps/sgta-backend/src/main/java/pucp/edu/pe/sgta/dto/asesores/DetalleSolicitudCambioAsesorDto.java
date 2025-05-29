package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;
import pucp.edu.pe.sgta.dto.UsuarioDto;

@Setter
@Getter
public class DetalleSolicitudCambioAsesorDto {
    private int solicitudId;
    private String fechaEnvio;
    private String estadoGlobal;
    private String motivoEstudiante;
    private Integer temaId;
    private String temaTitulo;
    private UsuarioDto solicitante;
    private UsuarioDto asesorActual;
    private UsuarioDto asesorNuevo;
    private UsuarioDto coordinador;
    private String fechaResolucion;
}
