package pucp.edu.pe.sgta.dto;


import lombok.*;
import pucp.edu.pe.sgta.model.TipoUsuario;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDto {

    private Integer id;

    private TipoUsuario tipoUsuario;

    private String codigoPucp;

    private String nombres;

    private String primerApellido;


    private String segundoApellido;

    private String correoElectronico;


    private String nivelEstudios;


    private String contrasena;

    private String biografia;



    private String disponibilidad;


    private String tipoDisponibilidad;

    private boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
