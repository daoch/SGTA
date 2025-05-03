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
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
