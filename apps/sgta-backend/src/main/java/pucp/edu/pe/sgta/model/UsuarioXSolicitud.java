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
@Table(name = "usuario_solicitud")
public class UsuarioXSolicitud {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "usuario_solicitud_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_usuario"))
	private Usuario usuario;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "solicitud_id", nullable = false, foreignKey = @ForeignKey(name = "fk_solicitud"))
	private Solicitud solicitud;

	// Campo legado temporal
	@Column(name = "solicitud_completada", nullable = false)
	private Boolean solicitudCompletada = false;

	// Campo legado temporal
	@Column(nullable = false)
	private Boolean aprobado = false;

	// NUEVO: relación con tabla de acciones
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "accion_solicitud", foreignKey = @ForeignKey(name = "fk_us_as"))
	private AccionSolicitud accionSolicitud;

	// NUEVO: relación con tabla de roles
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "rol_solicitud", foreignKey = @ForeignKey(name = "fk_us_rs"))
	private RolSolicitud rolSolicitud;

	// NUEVO: relación con tabla de roles
	@Column(name = "fecha_accion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaAccion;

	@Column(columnDefinition = "TEXT")
	private String comentario;

	@Column(nullable = false)
	private Boolean destinatario = false;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@Column(name = "usuario_creacion")          
    private String usuarioCreacion;

    @Column(name = "usuario_modificacion")     
    private String usuarioModificacion;

	@PrePersist
	protected void onCreate() {
		fechaCreacion = OffsetDateTime.now();
		fechaModificacion = OffsetDateTime.now(); // Asegúrate que se setee en la creación
	}

	@PreUpdate
	protected void onUpdate() {
		fechaModificacion = OffsetDateTime.now(); // Asegúrate que se actualice en cada update
	}

}
