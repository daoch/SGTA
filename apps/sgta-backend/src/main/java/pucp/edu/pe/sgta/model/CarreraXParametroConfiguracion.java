package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "carrera_parametro_configuracion")
public class CarreraXParametroConfiguracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "carrera_parametro_configuracion_id")
	private Integer id;

	@Column(length = 100, nullable = false)
	private String valor;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "carrera_id", nullable = false, foreignKey = @ForeignKey(name = "fk_cpc_carrera"))
	private Carrera carrera;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "parametro_configuracion_id", nullable = false,
			foreignKey = @ForeignKey(name = "fk_cpc_parametro_configuracion"))
	private ParametroConfiguracion parametroConfiguracion;

	// Si agregas una FK a etapa_formativa, podrías añadirla aquí como:
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "etapa_formativa_id", foreignKey = @ForeignKey(name = "fk_cpc_grupo"))
	private EtapaFormativa etapaFormativa;

}
