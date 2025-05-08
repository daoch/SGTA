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

    private String titulo;

    private String resumen;

    private String descripcionCambio;

    private Integer estadoTemaId;

    private Boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
