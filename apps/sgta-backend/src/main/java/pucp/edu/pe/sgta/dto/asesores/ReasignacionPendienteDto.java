package pucp.edu.pe.sgta.dto.asesores;

import java.time.OffsetDateTime;
import java.util.List;

public class ReasignacionPendienteDto {
    // Información de la Solicitud de Cese Original
    private Integer solicitudOriginalId;
    private OffsetDateTime fechaAprobacionCese; // Cuándo se aprobó el cese del asesor original
    private String motivoCeseOriginal;      // Motivo que dio el asesor original

    // Información del Tema
    private Integer temaId;
    private String temaTitulo;

    // Información del Asesor Original (el que cesó)
    private Integer asesorOriginalId;
    private String asesorOriginalNombres;
    private String asesorOriginalPrimerApellido;
    private String asesorOriginalCorreo;

    // Información de los Estudiantes Afectados
    private List<EstudianteSimpleDto> estudiantes; // Reutilizamos EstudianteSimpleDto

    // Estado Actual del Proceso de Reasignación
    private String estadoReasignacion; // Ej: "PENDIENTE_PROPUESTA_COORDINADOR", "PENDIENTE_ACEPTACION_ASESOR", "REASIGNACION_RECHAZADA_POR_ASESOR"

    // Información del Asesor Propuesto (si hay uno actualmente propuesto)
    private Integer asesorPropuestoId;
    private String asesorPropuestoNombres;
    private String asesorPropuestoPrimerApellido;
    private OffsetDateTime fechaPropuestaNuevoAsesor; // Cuándo se hizo la última propuesta a un nuevo asesor

    // Constructor, Getters y Setters (Lombok o manuales)
    public ReasignacionPendienteDto() {}

    // Getters y Setters para todos los campos...
    public Integer getSolicitudOriginalId() { return solicitudOriginalId; }
    public void setSolicitudOriginalId(Integer solicitudOriginalId) { this.solicitudOriginalId = solicitudOriginalId; }
    public OffsetDateTime getFechaAprobacionCese() { return fechaAprobacionCese; }
    public void setFechaAprobacionCese(OffsetDateTime fechaAprobacionCese) { this.fechaAprobacionCese = fechaAprobacionCese; }
    public String getMotivoCeseOriginal() { return motivoCeseOriginal; }
    public void setMotivoCeseOriginal(String motivoCeseOriginal) { this.motivoCeseOriginal = motivoCeseOriginal; }
    public Integer getTemaId() { return temaId; }
    public void setTemaId(Integer temaId) { this.temaId = temaId; }
    public String getTemaTitulo() { return temaTitulo; }
    public void setTemaTitulo(String temaTitulo) { this.temaTitulo = temaTitulo; }
    public Integer getAsesorOriginalId() { return asesorOriginalId; }
    public void setAsesorOriginalId(Integer asesorOriginalId) { this.asesorOriginalId = asesorOriginalId; }
    public String getAsesorOriginalNombres() { return asesorOriginalNombres; }
    public void setAsesorOriginalNombres(String asesorOriginalNombres) { this.asesorOriginalNombres = asesorOriginalNombres; }
    public String getAsesorOriginalPrimerApellido() { return asesorOriginalPrimerApellido; }
    public void setAsesorOriginalPrimerApellido(String asesorOriginalPrimerApellido) { this.asesorOriginalPrimerApellido = asesorOriginalPrimerApellido; }
    public String getAsesorOriginalCorreo() { return asesorOriginalCorreo; }
    public void setAsesorOriginalCorreo(String asesorOriginalCorreo) { this.asesorOriginalCorreo = asesorOriginalCorreo; }
    public List<EstudianteSimpleDto> getEstudiantes() { return estudiantes; }
    public void setEstudiantes(List<EstudianteSimpleDto> estudiantes) { this.estudiantes = estudiantes; }
    public String getEstadoReasignacion() { return estadoReasignacion; }
    public void setEstadoReasignacion(String estadoReasignacion) { this.estadoReasignacion = estadoReasignacion; }
    public Integer getAsesorPropuestoId() { return asesorPropuestoId; }
    public void setAsesorPropuestoId(Integer asesorPropuestoId) { this.asesorPropuestoId = asesorPropuestoId; }
    public String getAsesorPropuestoNombres() { return asesorPropuestoNombres; }
    public void setAsesorPropuestoNombres(String asesorPropuestoNombres) { this.asesorPropuestoNombres = asesorPropuestoNombres; }
    public String getAsesorPropuestoPrimerApellido() { return asesorPropuestoPrimerApellido; }
    public void setAsesorPropuestoPrimerApellido(String asesorPropuestoPrimerApellido) { this.asesorPropuestoPrimerApellido = asesorPropuestoPrimerApellido; }
    public OffsetDateTime getFechaPropuestaNuevoAsesor() { return fechaPropuestaNuevoAsesor; }
    public void setFechaPropuestaNuevoAsesor(OffsetDateTime fechaPropuestaNuevoAsesor) { this.fechaPropuestaNuevoAsesor = fechaPropuestaNuevoAsesor; }

}