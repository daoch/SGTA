package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "grupo_investigacion_proyecto")
public class GrupoInvestigacionXProyecto {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "grupo_investigacion_proyecto_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "grupo_investigacion_id", nullable = false, foreignKey = @ForeignKey(name = "fk_gip_grupo"))
	private GrupoInvestigacion grupoInvestigacion;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "proyecto_id", nullable = false, foreignKey = @ForeignKey(name = "fk_gip_proyecto"))
	private Proyecto proyecto;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
