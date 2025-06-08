package pucp.edu.pe.sgta.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * DTO para exponer relaciones de similitud entre temas en la API.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemaSimilarDto {

    /** Identificador único de la relación */
    private Integer id;

    /** Tema origen de la similitud */
    //@NotNull(message = "El tema origen es obligatorio")
    private TemaDto tema;

    /** Tema relacionado o similar */
   // @NotNull(message = "El tema relacionado es obligatorio")
    private TemaDto temaRelacion;

    private UsuarioDto usuario;

    /** Porcentaje de similitud entre ambos temas (0.00 a 100.00) */
    //@NotNull(message = "El porcentaje de similitud es obligatorio")
    //@DecimalMin(value = "0.00", message = "El porcentaje debe ser ≥ 0")
    //@DecimalMax(value = "100.00", message = "El porcentaje debe ser ≤ 100")
    private BigDecimal porcentajeSimilitud;

    /** Indicador de vigencia de la relación */
    private Boolean activo;

    /** Marcas de tiempo */
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
}
