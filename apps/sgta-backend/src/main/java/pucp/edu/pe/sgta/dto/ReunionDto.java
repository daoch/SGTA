package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReunionDto {

    private Integer id;
    private String titulo;
    private OffsetDateTime fechaHoraInicio;
    private OffsetDateTime fechaHoraFin;
    private String descripcion;
    private Integer disponible;
    private String url;
    private Boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;

}