package pucp.edu.pe.sgta.model;

import jakarta.persistence.*;
import jakarta.persistence.Convert;
import jakarta.persistence.Converter;
import jakarta.persistence.AttributeConverter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.OffsetDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import org.hibernate.annotations.CreationTimestamp;
import java.util.ArrayList;
import java.util.List;


@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "etapa_formativa")
public class EtapaFormativa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "etapa_formativa_id")
    private Integer id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nombre;

    @Column(name = "creditaje_por_tema", nullable = true, precision = 6, scale = 2)
    private BigDecimal creditajePorTema;

    @Convert(converter = DurationToIntervalConverter.class)
    @Column(name = "duracion_exposicion", nullable = true, length = 50)
    private Duration duracionExposicion;


    @Column(nullable = false)
    private Boolean activo = true;

    @CreationTimestamp
    @Column(
        name = "fecha_creacion",
        nullable = false,
        updatable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime fechaCreacion;

    @UpdateTimestamp
    @Column(
        name = "fecha_modificacion",
        nullable = false,
        insertable = false,
        columnDefinition = "TIMESTAMP WITH TIME ZONE"
    )
    private OffsetDateTime fechaModificacion;

    @OneToMany(mappedBy = "etapaFormativa", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<EtapaFormativaXCiclo> etapasXCiclo = new ArrayList<>();

    public void addEtapaXCiclo(EtapaFormativaXCiclo etapaXCiclo) {
        etapasXCiclo.add(etapaXCiclo);
        etapaXCiclo.setEtapaFormativa(this);
    }

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "carrera_id", nullable = false, foreignKey = @ForeignKey(name = "fk_area_conocimiento_carrera"))
    private Carrera carrera;

    /**
     * Converter para transformar Duration a PostgreSQL interval
     */
    @Converter(autoApply = false)
    public static class DurationToIntervalConverter implements AttributeConverter<Duration, String> {

        @Override
        public String convertToDatabaseColumn(Duration duration) {
            return duration == null ? null : duration.toString(); // e.g., PT1H30M
        }

        @Override
        public Duration convertToEntityAttribute(String dbData) {
            return dbData == null ? null : Duration.parse(dbData);
        }
    }

}