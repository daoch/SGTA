package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReunionesXUsuariosDto {
    UsuarioDto asesor;
    UsuarioDto alumno;
    UsuarioDto coasesor;
    String estado;
    String curso;
}
