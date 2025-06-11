package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioXCarreraDto {
    private Integer id;
    private Integer usuarioId;
    private Integer carreraId;
    private boolean esCoordinador;
}
