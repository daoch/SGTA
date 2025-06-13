package pucp.edu.pe.sgta.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TesistaCronDto {
    private Integer id;
    private String nombreCompleto;
    private String temaTesis;
}
