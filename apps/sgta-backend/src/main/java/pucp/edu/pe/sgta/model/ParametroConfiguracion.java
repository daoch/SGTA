package pucp.edu.pe.sgta.model;

import pucp.edu.pe.sgta.util.TipoDatoEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "parametro_configuracion")
public class ParametroConfiguracion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "parametro_configuracion_id")
	private Integer id;

	@Column(length = 100, nullable = false)
	private String nombre;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "modulo_id", nullable = false, foreignKey = @ForeignKey(name = "fk_pc_modulo"))
	private Modulo modulo;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false,
			columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	@Enumerated(EnumType.STRING)
	@Column(name = "tipo", nullable = false)
	private TipoDatoEnum tipoDato;

}
