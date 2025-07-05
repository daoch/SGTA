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

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@Column(name = "respuesta", columnDefinition = "TEXT", nullable = true)
	private String respuesta;

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
