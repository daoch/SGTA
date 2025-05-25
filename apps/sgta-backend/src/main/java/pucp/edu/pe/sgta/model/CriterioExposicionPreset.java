package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "criterio_exposicion_preset")
public class CriterioExposicionPreset {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "criterio_exposicion_preset_id")
	private Integer id;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String nombre;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@Column(name = "nota_maxima", nullable = false, precision = 5, scale = 2)
	private BigDecimal notaMaxima;

	@Column(nullable = false)
	private boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
