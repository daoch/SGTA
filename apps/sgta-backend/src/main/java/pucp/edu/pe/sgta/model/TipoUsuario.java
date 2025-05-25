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
@Table(name = "tipo_usuario")
public class TipoUsuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tipo_usuario_id")
	private Integer id;

	@Column(length = 100, nullable = false)
	private String nombre;

	@Transient
	@Column(length = 100, nullable = true)
	private String tipoDedicacion;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false,
			columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
