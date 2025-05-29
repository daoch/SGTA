package pucp.edu.pe.sgta.dto.asesores;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class UsuarioSolicitudDto {
    private int id;
    private String nombres;
    private String correoElectronico;
    private String rolSolicitud;
    private String foto;
    private String accionSolicitud;
    private String fechaAccion;
    private String comentario;
}
