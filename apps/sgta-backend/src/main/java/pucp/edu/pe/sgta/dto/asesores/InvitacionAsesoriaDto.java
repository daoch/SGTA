package pucp.edu.pe.sgta.dto.asesores;

import java.time.OffsetDateTime;
import java.util.List;

public class InvitacionAsesoriaDto {
    private Integer solicitudOriginalId; // ID de la Solicitud de cese original
    private Integer temaId;
    private String temaTitulo;
    private String temaResumen; // Opcional, para dar más contexto
    private List<EstudianteSimpleDto> estudiantes; // Lista de estudiantes en ese tema
    private String asesorOriginalNombres;    // Nombre del asesor que cesó
    private String asesorOriginalApellidos;  // Apellidos del asesor que cesó
    private OffsetDateTime fechaPropuesta;   // Cuándo se le hizo la propuesta (ej. fecha_modificacion de la solicitud cuando se le asignó como propuesto)
    private String motivoCeseOriginal;     // El motivo que dio el asesor original para el cese

    // Constructor, Getters y Setters (Lombok o manuales)

    public InvitacionAsesoriaDto() {}

    public InvitacionAsesoriaDto(Integer solicitudOriginalId, Integer temaId, String temaTitulo, String temaResumen,
                                 List<EstudianteSimpleDto> estudiantes, String asesorOriginalNombres,
                                 String asesorOriginalApellidos, OffsetDateTime fechaPropuesta, String motivoCeseOriginal) {
        this.solicitudOriginalId = solicitudOriginalId;
        this.temaId = temaId;
        this.temaTitulo = temaTitulo;
        this.temaResumen = temaResumen;
        this.estudiantes = estudiantes;
        this.asesorOriginalNombres = asesorOriginalNombres;
        this.asesorOriginalApellidos = asesorOriginalApellidos;
        this.fechaPropuesta = fechaPropuesta;
        this.motivoCeseOriginal = motivoCeseOriginal;
    }

    // Getters y Setters para todos los campos...
    public Integer getSolicitudOriginalId() { return solicitudOriginalId; }
    public void setSolicitudOriginalId(Integer solicitudOriginalId) { this.solicitudOriginalId = solicitudOriginalId; }
    public Integer getTemaId() { return temaId; }
    public void setTemaId(Integer temaId) { this.temaId = temaId; }
    public String getTemaTitulo() { return temaTitulo; }
    public void setTemaTitulo(String temaTitulo) { this.temaTitulo = temaTitulo; }
    public String getTemaResumen() { return temaResumen; }
    public void setTemaResumen(String temaResumen) { this.temaResumen = temaResumen; }
    public List<EstudianteSimpleDto> getEstudiantes() { return estudiantes; }
    public void setEstudiantes(List<EstudianteSimpleDto> estudiantes) { this.estudiantes = estudiantes; }
    public String getAsesorOriginalNombres() { return asesorOriginalNombres; }
    public void setAsesorOriginalNombres(String asesorOriginalNombres) { this.asesorOriginalNombres = asesorOriginalNombres; }
    public String getAsesorOriginalApellidos() { return asesorOriginalApellidos; }
    public void setAsesorOriginalApellidos(String asesorOriginalApellidos) { this.asesorOriginalApellidos = asesorOriginalApellidos; }
    public OffsetDateTime getFechaPropuesta() { return fechaPropuesta; }
    public void setFechaPropuesta(OffsetDateTime fechaPropuesta) { this.fechaPropuesta = fechaPropuesta; }
    public String getMotivoCeseOriginal() { return motivoCeseOriginal; }
    public void setMotivoCeseOriginal(String motivoCeseOriginal) { this.motivoCeseOriginal = motivoCeseOriginal; }
}
