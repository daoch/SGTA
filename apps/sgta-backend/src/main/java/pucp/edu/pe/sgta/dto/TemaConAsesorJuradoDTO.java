package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemaConAsesorJuradoDTO {
    private Integer id;
    private String codigo;
    private String titulo;
    private List<UsuarioNombresDTO> usuariosNombre;

}
