package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsarioRolDto {

    private int idUsario;
    private String nombres;
    private String apellidos;
    private RolDto rol;
    private String estadoRespuesta;

    public UsarioRolDto(int idUsuario, String nombres, String apellidos,int rolId,
                        String rolNombre,String estadoRespuesta) {

       this.idUsario = idUsuario;
       this.nombres = nombres;
       this.apellidos = apellidos;
       this.rol = new RolDto();
       this.rol.setId(rolId);
       this.rol.setNombre(rolNombre);
       this.estadoRespuesta = estadoRespuesta;

    }
}
