package pucp.edu.pe.sgta.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemaPorAsociarDto {
    private Integer id;

    //@NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255, message = "El título no puede tener más de 255 caracteres")
    private String titulo;

    private String estadoTemaNombre;

    private CarreraLiteDto carrera;

    //@NotEmpty(message = "Debe haber al menos un tesista")
    private List<TesistaLiteDto> tesistas;
}
