package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;
import java.util.List;

@Entity
@Table(name = "configuracion_recordatorio", uniqueConstraints = @UniqueConstraint(columnNames = "usuario_id"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ConfiguracionRecordatorio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "configuracion_recordatorio_id")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @Column(name = "activo", nullable = false)
    private Boolean activo = true;

    @Column(name = "dias_anticipacion", columnDefinition = "integer[]")
    private Integer[] diasAnticipacion; 

    @Column(name = "canal_correo", nullable = false)
    private Boolean canalCorreo = true;

    @Column(name = "canal_sistema", nullable = false)
    private Boolean canalSistema = true;

    @Column(name = "fecha_creacion", nullable = false)
    private OffsetDateTime fechaCreacion = OffsetDateTime.now();

    @Column(name = "fecha_modificacion", nullable = false)
    private OffsetDateTime fechaModificacion = OffsetDateTime.now();
}