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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "unidad_academica")
public class UnidadAcademica {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "unidad_academica_id")
	private Integer id;

	@Column(length = 100, nullable = false)
	private String nombre;

	@Column(columnDefinition = "TEXT")
	private String descripcion;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", insertable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

}
