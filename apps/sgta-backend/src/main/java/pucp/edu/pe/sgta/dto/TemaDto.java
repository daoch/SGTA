package pucp.edu.pe.sgta.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.ArrayList;
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
    private Boolean activo;
    private OffsetDateTime fechaLimite;
    private OffsetDateTime fechaFinalizacion;
    private OffsetDateTime fechaCreacion;
    private OffsetDateTime fechaModificacion;
    private String estadoTemaNombre;
    private CarreraDto carrera;
//    private List<Integer> idUsuarioInvolucradosList;
//    private List<Integer> idCoasesorInvolucradosList;
//    private List<Integer> idEstudianteInvolucradosList;
//    private List<Integer> idSubAreasConocimientoList;
    private  Integer cantPostulaciones; //only for general proposals
    private List<UsuarioDto> coasesores = new ArrayList<>();
    private List<UsuarioDto> tesistas = new ArrayList<>();
    private List<SubAreaConocimientoDto> subareas = new ArrayList<>();
}