package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TesistaLiteDto {
    private Integer id;
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
}
