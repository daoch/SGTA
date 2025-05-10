package pucp.edu.pe.sgta.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class MiembroJuradoDto {

    private Integer id;
    private String codigoPucp;
    private String nombres;
    private String primerApellido;
    private String segundoApellido;
    private String correoElectronico;
    private String nivelEstudios;
    private Integer asignados;
    private String tipoDedicacion;
    private boolean activo;
    private OffsetDateTime fechaAsignacion;
    private List<String> especialidades;

<<<<<<< HEAD
    public MiembroJuradoDto(Integer id, String codigoPucp, String nombres, String primerApellido, String segundoApellido, String correoElectronico, String nivelEstudios, Integer asignados, String tipoDedicacion, boolean activo, OffsetDateTime fechaAsignacion, List<String> especialidades) {
=======
    public MiembroJuradoDto(Integer id, String codigoPucp, String nombres, String primerApellido, String segundoApellido, String correoElectronico, String nivelEstudios, Integer asignados, String tipoDedicacion, boolean activo, OffsetDateTime fechaAsignacion,List<String> especialidades) {
>>>>>>> 1f49a275c3ebf30ea35c9243d5ca3edc8b0601c5
        this.id = id;
        this.codigoPucp = codigoPucp;
        this.nombres = nombres;
        this.primerApellido = primerApellido;
        this.segundoApellido = segundoApellido;
        this.correoElectronico = correoElectronico;
        this.nivelEstudios = nivelEstudios;
        this.asignados = asignados;
        this.tipoDedicacion = tipoDedicacion;
        this.activo = activo;
        this.fechaAsignacion = fechaAsignacion;
        this.especialidades = especialidades;
    }
}
