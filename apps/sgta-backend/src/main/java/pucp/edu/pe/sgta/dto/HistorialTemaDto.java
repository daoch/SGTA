package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistorialTemaDto {
    private Integer id;

    private TemaDto tema;

    private String codigo;

    private String titulo;

    private String resumen;

    private String metodologia;

    private String objetivos;

    private String descripcionCambio;

    private String portafolioUrl;

    private String estadoTemaNombre;

    private Integer proyectoId;

    private CarreraDto carrera;

    private OffsetDateTime fechaLimite;

    private OffsetDateTime fechaFinalizacion;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
