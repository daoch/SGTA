package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "notificacion")
public class Notificacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "notificacion_id")
	private Integer id;

	@Column(columnDefinition = "TEXT", nullable = false)
	private String mensaje;

	@Column(length = 50, nullable = false)
	private String canal;

	@Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_lectura", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaLectura;

	@Column(nullable = false)
	private Boolean activo = true;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "modulo_id", nullable = false, foreignKey = @ForeignKey(name = "fk_not_modulo"))
	private Modulo modulo;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tipo_notificacion_id", nullable = false,
			foreignKey = @ForeignKey(name = "fk_not_tipo_notificacion"))
	private TipoNotificacion tipoNotificacion;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_not_usuario"))
	private Usuario usuario;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	// Enlace opcional para redirigir al usuario
	@Column(name = "enlace_redireccion", length = 500)
	private String enlaceRedireccion;

	@PrePersist
	protected void onCreate() {
		fechaCreacion = OffsetDateTime.now();
		fechaModificacion = OffsetDateTime.now();
		if (activo == null) {
			activo = true;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		fechaModificacion = OffsetDateTime.now();
	}

	// Constructor útil (opcional)
	public Notificacion(String mensaje, String canal, Modulo modulo, TipoNotificacion tipoNotificacion, Usuario usuarioDestinatario) {
		this.mensaje = mensaje;
		this.canal = canal;
		this.modulo = modulo;
		this.tipoNotificacion = tipoNotificacion;
		this.usuario = usuarioDestinatario;// activo se defaulta a true, fechaCreacion/Modificacion se setean en @PrePersist
	}

}
