package pucp.edu.pe.sgta.model;

import java.time.OffsetDateTime;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuario;
import pucp.edu.pe.sgta.util.EstadoExposicionUsuarioConverter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "control_exposicion_usuario")
public class ControlExposicionUsuarioTema {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "control_exposicion_usuario_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "exposicion_x_tema_id", nullable = false,
			foreignKey = @ForeignKey(name = "fk_ceu_exposicion_x_tema"))
	private ExposicionXTema exposicionXTema;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_x_tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_ceu_usuario_x_tema"))
	private UsuarioXTema usuario;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String observacionesFinalesExposicion;

	@Column(nullable = false)
	private Boolean asistio = true;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	// @Enumerated(EnumType.STRING)
	@Column(name = "estado_exposicion_usuario", nullable = false, insertable = false)
	@Convert(converter = EstadoExposicionUsuarioConverter.class)
	private EstadoExposicionUsuario estadoExposicion = EstadoExposicionUsuario.ESPERANDO_RESPUESTA;

}
