package pucp.edu.pe.sgta.dto.calificacion;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ExposicionCalificacionDto {
    private Integer id_exposicion;
    private String titulo;
    private String descripcion;
    private List<EstudiantesCalificacionDto> estudiantes;
    private List<CriteriosCalificacionDto> criterios;
    private String observaciones_finales;
}
