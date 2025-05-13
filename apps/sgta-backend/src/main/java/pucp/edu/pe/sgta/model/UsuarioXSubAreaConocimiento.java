package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "usuario_sub_area_conocimiento")
public class UsuarioXSubAreaConocimiento {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "usuario_sub_area_conocimiento_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_usac_usuario"))
	private Usuario usuario;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "sub_area_conocimiento_id", nullable = false, foreignKey = @ForeignKey(name = "fk_usac_sac"))
	private SubAreaConocimiento subAreaConocimiento;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
