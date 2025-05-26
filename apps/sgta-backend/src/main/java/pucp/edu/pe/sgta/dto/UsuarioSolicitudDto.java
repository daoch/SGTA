package pucp.edu.pe.sgta.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioSolicitudDto {
    private Integer id;
    private Integer usuarioId;
    private Integer solicitudId;
    private Boolean solicitudCompletada;
    private Boolean aprovado;
    private String comentario;
    private Boolean destinatario;
    private Boolean activo;
}