package pucp.edu.pe.sgta.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * TemaDto es el objeto que exponemos en nuestra API para no enviar directamente la
 * entidad JPA (Tema).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemaDto {

    private Integer id;

    //@NotBlank(message = "El código es obligatorio")
    private String codigo;

    @NotBlank(message = "El título es obligatorio")
    @Size(max = 255, message = "El título no puede tener más de 255 caracteres")
    private String titulo;

    @NotBlank(message = "El resumen es obligatorio")
    private String resumen;

    private String objetivos;

    private String metodologia;

    private String portafolioUrl;

    private Boolean activo;
    private Boolean rechazado;

    //@NotNull(message = "La fecha límite es obligatoria")
    //@FutureOrPresent(message = "La fecha límite debe ser hoy o en el futuro")
    private OffsetDateTime fechaLimite;

    private OffsetDateTime fechaFinalizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private String estadoTemaNombre;

    //@NotNull(message = "La carrera es obligatoria")
    private CarreraDto carrera;

    private Integer cantPostulaciones; // only for general proposals

    //@NotEmpty(message = "Debe haber al menos una área")
    private List<@NotNull(message = "Area inválida") AreaConocimientoDto> area;

    //@NotEmpty(message = "Debe haber al menos una subárea")
    private List<@NotNull(message = "Subárea inválida") SubAreaConocimientoDto> subareas;

    @NotEmpty(message = "Debe haber al menos un tesista")
    private List<UsuarioDto> tesistas ;

    private List< UsuarioDto> coasesores ;
}
