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
public class UsuarioXReunionDto {

    private Integer id;
    private Integer usuarioId;
    private String usuarioNombre;
    private Integer reunionId;
    private String reunionTitulo;
    private OffsetDateTime reunionFechaHoraInicio;
    private OffsetDateTime reunionFechaHoraFin;
    private String estadoAsistencia;
    private String estadoDetalle;
    private Boolean activo;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;

}