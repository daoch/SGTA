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
@Table(name = "tipo_dedicacion")
public class TipoDedicacion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "tipo_dedicacion_id")
	private Integer id;

	@Column(length = 10, nullable = false)
	private String iniciales;

	@Column(length = 100, nullable = false)
	private String descripcion;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
