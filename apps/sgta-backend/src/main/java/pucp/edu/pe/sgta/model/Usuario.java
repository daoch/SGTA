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
@Table(name = "usuario")
public class Usuario {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "usuario_id")
	private Integer id;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "tipo_usuario_id", nullable = false, foreignKey = @ForeignKey(name = "fk_tipo_usuario"))
	private TipoUsuario tipoUsuario;

	@Column(name = "codigo_PUCP", length = 20)
	private String codigoPucp;

	@Column(length = 100, nullable = false)
	private String nombres;

	@Column(name = "primer_apellido", length = 100, nullable = false)
	private String primerApellido;

	@Column(name = "segundo_apellido", length = 100, nullable = false)
	private String segundoApellido;

	@Column(name = "correo_electronico", length = 255, nullable = false, unique = true)
	private String correoElectronico;

	@Column(name = "nivel_estudios", length = 25)
	private String nivelEstudios;

	@Column(length = 255, nullable = false)
	private String contrasena;

	@Column(columnDefinition = "TEXT")
	private String biografia;

    @Column(name = "enlace_repositorio")
    private String enlaceRepositorio;

    @Column(name = "enlace_linkedin", columnDefinition = "TEXT")
    private String enlaceLinkedin;

	@Column(name = "foto_perfil", columnDefinition = "bytea", nullable = true)
	private byte[] fotoPerfil;

	@Column(columnDefinition = "TEXT")
	private String disponibilidad;

	@Column(name = "tipo_disponibilidad", columnDefinition = "TEXT")
	private String tipoDisponibilidad;

	@Column(nullable = false)
	private Boolean activo = true;

	@Column(name = "fecha_creacion", nullable = false, columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaCreacion;

	@Column(name = "fecha_modificacion", columnDefinition = "TIMESTAMP WITH TIME ZONE")
	private OffsetDateTime fechaModificacion;

	public String getNombreDisplay(){
		String nombreDisplay = "";
		nombreDisplay += nombres.split(" ")[0] + " ";
		nombreDisplay += primerApellido;
		return nombreDisplay;
	}
}
