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
@Table(name = "usuario_tema")
public class UsuarioXTema {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "usuario_tema_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_usuario"))
	private Usuario usuario;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tema_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tema"))
	private Tema tema;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "rol_id", nullable = false, foreignKey = @ForeignKey(name = "fk_rol"))
	private Rol rol;

	@Column(nullable = false)
	private boolean asignado = false;

	@Column
	private Integer prioridad;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
