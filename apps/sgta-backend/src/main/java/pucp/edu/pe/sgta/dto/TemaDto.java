package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * TemaDto es el objeto que exponemos en nuestra API
 * para no enviar directamente la entidad JPA (Tema).
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemaDto {

    private Integer id;
    private String codigo;
    private String titulo;
    private String resumen;
    private String objetivos;
    private String metodologia;
    private String portafolioUrl;
    private boolean activo;
    private OffsetDateTime fechaLimite;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private List<Integer> idUsuarioInvolucradosList;
    private List<Integer> idCoasesorInvolucradosList;
    private List<Integer> idEstudianteInvolucradosList;
    private List<Integer> idSubAreasConocimientoList;

    private List<UsuarioDto> coasesores;
    private List<UsuarioDto> tesistas;
    private List<SubAreaConocimientoDto> subareas;
}