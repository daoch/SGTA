package pucp.edu.pe.sgta.dto;

import lombok.*;

import java.time.OffsetDateTime;

import pucp.edu.pe.sgta.util.TipoEventoEnum;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventoDto {

    private Integer id;
    private String nombre;
    private String descripcion;
    private TipoEventoEnum tipo;
    private OffsetDateTime fechaInicio;
    private OffsetDateTime fechaFin;
    private Boolean activo;
}
