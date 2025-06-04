package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "solicitud")
public class Solicitud {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "solicitud_id")
	private Integer id;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tipo_solicitud_id", nullable = false, foreignKey = @ForeignKey(name = "fk_solicitud_tipo"))
	private TipoSolicitud tipoSolicitud;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_s_tema"))
	private Tema tema;

	@Column(nullable = false)
	private Boolean activo = true;

	// Campo legado temporal (NO eliminar aún)
	@Column(name = "estado", nullable = false)
	private Integer estado = 1;  // 0: aprobado, 1: pendiente, 2: rechazado

	// Nuevo campo para relación con tabla de estados
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "estado_solicitud", foreignKey = @ForeignKey(name = "fk_s_es"))
	private EstadoSolicitud estadoSolicitud;

	@Column(name = "fecha_resolucion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaResolucion;

	@Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@Column(name = "respuesta", columnDefinition = "TEXT", nullable = true)
	private String respuesta;

	@ManyToOne(fetch = FetchType.LAZY) // Puede ser EAGER si siempre lo necesitas con la solicitud
	@JoinColumn(name = "usuario_creador_id", nullable = false, foreignKey = @ForeignKey(name = "fk_solicitud_usuario_creador"))
	private Usuario usuarioCreador; // NUEVO CAMPO

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asesor_propuesto_reasignacion_id") // Nueva columna FK
	private Usuario asesorPropuestoReasignacion;

	@Column(name = "estado_reasignacion") // Nueva columna
	private String estadoReasignacion; // Ej: "PENDIENTE_ACEPTACION_ASESOR", "REASIGNACION_COMPLETADA"

	@PrePersist
	protected void onCreate() {
		fechaCreacion = OffsetDateTime.now();
		fechaModificacion = OffsetDateTime.now(); // Asegúrate que se setee en la creación
	}

	@PreUpdate
	protected void onUpdate() {
		fechaModificacion = OffsetDateTime.now(); // Asegúrate que se actualice en cada update
	}

	// --- GETTERS Y SETTERS para los nuevos campos ---
	public Usuario getAsesorPropuestoReasignacion() {
		return asesorPropuestoReasignacion;
	}

	public void setAsesorPropuestoReasignacion(Usuario asesorPropuestoReasignacion) {
		this.asesorPropuestoReasignacion = asesorPropuestoReasignacion;
	}

	public String getEstadoReasignacion() {
		return estadoReasignacion;
	}

	public void setEstadoReasignacion(String estadoReasignacion) {
		this.estadoReasignacion = estadoReasignacion;
	}
}
