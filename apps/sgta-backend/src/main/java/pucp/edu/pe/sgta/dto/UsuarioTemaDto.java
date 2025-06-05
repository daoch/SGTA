package pucp.edu.pe.sgta.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioTemaDto {
    private Integer id;
    private Integer usuarioId;
    private Integer temaId;
    private Boolean activo;
    private String comentario;
}