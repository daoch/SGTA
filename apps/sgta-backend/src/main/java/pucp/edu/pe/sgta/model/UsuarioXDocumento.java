package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario_documento")
public class UsuarioXDocumento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "usuario_documento_id")
	private Integer usuarioDocumentoId;

	@ManyToOne
	@JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id")
	private Usuario usuario;

	@ManyToOne
	@JoinColumn(name = "documento_id", referencedColumnName = "documento_id")
	private Documento documento;

	@Column(name = "permiso", nullable = false, length = 50)
	private String permiso;

	@Column(name = "activo")
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, updatable = false)
	private ZonedDateTime fechaCreacion = ZonedDateTime.now();

	@Column(name = "fecha_modificacion")
	private ZonedDateTime fechaModificacion;

}