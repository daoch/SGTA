package pucp.edu.pe.sgta.dto;

import jakarta.persistence.*;
import lombok.*;
import pucp.edu.pe.sgta.model.Tema;

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

    private boolean activo;

    private OffsetDateTime fechaCreacion;

    private OffsetDateTime fechaModificacion;
}
